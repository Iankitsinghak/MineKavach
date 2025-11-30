#!/usr/bin/env python3
"""
Rockfall Monitoring & Alert System – SIH Prototype v5 (Final)

Pipeline:
- RandomForest → snapshot classification (sensor-level)
- LSTM        → short-term time-series risk
- DEM/Drone   → external spatial risk (auto-used when RF > threshold)
- Fused risk  → weighted score in [0, 1], displayed as %
- MQTT        → live sensor stream (simulated publisher + subscriber)
- Output      → colorized, boxed terminal + risk map PNG + alert logs
"""

import os
import csv
import glob
import json
import random
import threading
import time
from datetime import datetime
from typing import List, Tuple

# Suppress verbose TF logs before importing it
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import numpy as np
import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model  # pyright: ignore[reportMissingImports]
import paho.mqtt.client as mqtt
from colorama import Fore, Style, init

# ---------------------------------------------------------------------
# 0. Terminal & Global Config
# ---------------------------------------------------------------------
init(autoreset=True)

MODEL_DIR = "models"
DEM_FOLDER = "dem_files"
LOG_DIR = "logs"
RISK_MAP_PATH = "risk_map.png"   # can make timestamped if you want

BROKER = "test.mosquitto.org"
PORT = 1883
TOPIC = "mine/sensors"

TIMESTEPS = 5
RF_THRESHOLD_FOR_DEM = 0.3
ALERT_THRESHOLD = 0.6
STATUS_THRESHOLD = 0.4  # for label "SAFE/ALERT" on terminal

# Fusion weights (must sum ≤ 1; we clamp at the end anyway)
W_RF = 0.5
W_LSTM = 0.2
W_DEM = 0.3

# Shared state
sensor_history: List[List[float]] = []
external_file_path: str | None = None
history_lock = threading.Lock()
dem_lock = threading.Lock()


# ---------------------------------------------------------------------
# 1. Small Utility Pieces
# ---------------------------------------------------------------------
def ensure_dirs() -> None:
    """Create required folders if they don't exist."""
    os.makedirs(DEM_FOLDER, exist_ok=True)
    os.makedirs(LOG_DIR, exist_ok=True)


def banner() -> None:
    """Print a one-time ASCII-style header."""
    title = "ROCKFALL MONITORING & ALERT SYSTEM"
    line = "═" * (len(title) + 8)
    print(Fore.LIGHTWHITE_EX + line)
    print(
        Fore.LIGHTWHITE_EX
        + f"║  {Fore.CYAN}{title}{Fore.LIGHTWHITE_EX}  ║"
    )
    print(Fore.LIGHTWHITE_EX + line)
    print(
        f"{Fore.YELLOW}RF + LSTM + DEM Fusion  "
        f"{Fore.WHITE}|  {Fore.GREEN}MQTT Live Stream  "
        f"{Fore.WHITE}|  {Fore.MAGENTA}SIH Prototype v5\n"
    )


def get_latest_dem() -> str | None:
    """Return path of the most recently created DEM/Drone file, if any."""
    files = glob.glob(os.path.join(DEM_FOLDER, "*"))
    if not files:
        return None
    return max(files, key=os.path.getctime)


def process_external_input(file_path: str | None) -> float:
    """
    Convert DEM/Drone input into a probability [0, 1].

    Fallbacks to a neutral value if anything goes wrong.
    """
    if not file_path or not os.path.exists(file_path):
        return 0.3

    try:
        arr = plt.imread(file_path).astype(np.float32)
        if arr.size == 0:
            return 0.3
        arr = (arr - arr.min()) / (arr.max() - arr.min() + 1e-6)
        return float(np.clip(np.mean(arr), 0.0, 1.0))
    except Exception:
        return 0.3


def dem_watcher() -> None:
    """Background thread to watch the DEM folder for new files."""
    global external_file_path
    previous: str | None = None

    while True:
        latest = get_latest_dem()
        if latest and latest != previous:
            with dem_lock:
                external_file_path = latest
            previous = latest
            print(f"{Fore.CYAN}📂 New DEM/Drone file detected → {latest}")
        time.sleep(5)


# ---------------------------------------------------------------------
# 2. Model Loading & Risk Fusion
# ---------------------------------------------------------------------
def load_models() -> Tuple[object, object]:
    """Load RF and LSTM models from disk."""
    rf_path = os.path.join(MODEL_DIR, "rockfall_rf.pkl")
    lstm_path = os.path.join(MODEL_DIR, "rockfall_lstm.h5")

    if not os.path.exists(rf_path):
        raise FileNotFoundError(f"RandomForest model not found at: {rf_path}")
    if not os.path.exists(lstm_path):
        raise FileNotFoundError(f"LSTM model not found at: {lstm_path}")

    rf_model = joblib.load(rf_path)
    lstm_model = load_model(lstm_path)

    return rf_model, lstm_model


def update_history(sensor_input: List[float]) -> np.ndarray | None:
    """
    Append the latest sensor reading to the history and return a sequence
    of shape (1, TIMESTEPS, features) when enough data is available.
    """
    with history_lock:
        sensor_history.append(sensor_input)
        if len(sensor_history) > TIMESTEPS:
            del sensor_history[:-TIMESTEPS]

        if len(sensor_history) < TIMESTEPS:
            return None

        seq = np.array(sensor_history, dtype=np.float32)
        seq = seq.reshape(1, TIMESTEPS, -1)
        return seq


def compute_final_risk(
    rf_model,
    lstm_model,
    sensor_input: List[float],
) -> Tuple[float, float, float, float]:
    """
    Run RF, LSTM and DEM/Drone fusion to produce final risk in [0, 1].

    Returns:
        rf_prob, lstm_prob, dem_prob, final_prob
    """
    # --- RF probability (snapshot) ---
    rf_prob = float(rf_model.predict_proba([sensor_input])[0][1])

    # --- LSTM probability (time-series) ---
    lstm_prob = 0.0
    seq = update_history(sensor_input)
    if seq is not None:
        lstm_prob = float(lstm_model.predict(seq, verbose=0)[0][0])

    # --- DEM/Drone probability (spatial) ---
    if rf_prob > RF_THRESHOLD_FOR_DEM:
        with dem_lock:
            dem_path = external_file_path
        dem_prob = process_external_input(dem_path)
    else:
        dem_prob = 0.0

    # --- Weighted fusion ---
    raw_final = W_RF * rf_prob + W_LSTM * lstm_prob + W_DEM * dem_prob
    final_prob = float(np.clip(raw_final, 0.0, 1.0))

    return rf_prob, lstm_prob, dem_prob, final_prob


# ---------------------------------------------------------------------
# 3. Pretty Terminal Output
# ---------------------------------------------------------------------
def pretty_print_pipeline(
    rf_prob: float,
    lstm_prob: float,
    dem_prob: float,
    final_prob: float,
) -> None:
    """Display a clean, boxed pipeline summary in the terminal."""
    if final_prob >= STATUS_THRESHOLD:
        status_label = f"{Fore.RED}🚨 ALERT"
    else:
        status_label = f"{Fore.GREEN}✅ SAFE"

    rf_line: str
    if rf_prob > RF_THRESHOLD_FOR_DEM:
        rf_line = (
            f"{Fore.YELLOW}Sensor Model (RF) → {rf_prob:.2f}  "
            f"⚠️  Threshold crossed → External DEM/Drone used"
        )
        dem_line = f"{Fore.CYAN}External DEM/Drone Risk → {dem_prob:.2f}"
    else:
        rf_line = (
            f"{Fore.BLUE}Sensor Model (RF) → {rf_prob:.2f}  "
            f"🚫 Below threshold → DEM/Drone skipped"
        )
        dem_line = f"{Fore.CYAN}External DEM/Drone Risk → {dem_prob:.2f} (inactive)"

    lstm_line = f"{Fore.MAGENTA}LSTM Time-Series Risk → {lstm_prob:.2f}"
    final_line = (
        f"{Fore.WHITE}{Style.BRIGHT}Final Fused Risk → {final_prob * 100:.2f}%  "
        f"→ {status_label}{Style.RESET_ALL}"
    )
    timestamp_line = f"{Fore.LIGHTBLACK_EX}{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

    lines = [rf_line, dem_line, lstm_line, final_line, timestamp_line]

    # Determine width based on visible text (strip ANSI)
    def visible_length(s: str) -> int:
        import re
        return len(re.sub(r"\x1b\[[0-9;]*m", "", s))

    width = max(visible_length(line) for line in lines) + 4

    top_border = "╔" + "═" * (width - 2) + "╗"
    bottom_border = "╚" + "═" * (width - 2) + "╝"

    print()
    print(Fore.LIGHTWHITE_EX + top_border)
    for line in lines:
        pad = width - 3 - visible_length(line)
        print(Fore.LIGHTWHITE_EX + "║ " + line + " " * max(pad, 0) + "║")
    print(Fore.LIGHTWHITE_EX + bottom_border)
    print()


# ---------------------------------------------------------------------
# 4. Risk Map + Alert Logging
# ---------------------------------------------------------------------
def save_risk_map(final_prob: float) -> None:
    """
    Generate a simple synthetic risk map scaled by final_prob.
    Replace with real DEM-based map if available in future.
    """
    grid = np.random.rand(100, 100).astype(np.float32) * final_prob
    plt.figure()
    plt.imshow(grid, cmap="terrain")
    plt.title(f"Risk Map – {'ALERT' if final_prob >= ALERT_THRESHOLD else 'SAFE'}")
    plt.colorbar(label="Relative Risk")
    plt.tight_layout()
    plt.savefig(RISK_MAP_PATH)
    plt.close()


def log_alert(
    rf_prob: float,
    lstm_prob: float,
    dem_prob: float,
    final_prob: float,
) -> None:
    """Append an alert record to CSV, create header if file is new."""
    path = os.path.join(LOG_DIR, "alerts.csv")
    file_exists = os.path.exists(path)

    with open(path, "a", newline="") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(
                ["timestamp", "rf_prob", "lstm_prob", "dem_prob", "final_prob", "status"]
            )
        writer.writerow(
            [
                datetime.now().isoformat(timespec="seconds"),
                f"{rf_prob:.4f}",
                f"{lstm_prob:.4f}",
                f"{dem_prob:.4f}",
                f"{final_prob:.4f}",
                "ALERT",
            ]
        )

    print(f"{Fore.YELLOW}📝 Alert logged → {path}")


# ---------------------------------------------------------------------
# 5. MQTT Handling
# ---------------------------------------------------------------------
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"{Fore.GREEN}✅ Connected to MQTT broker @ {BROKER}:{PORT}")
        client.subscribe(TOPIC)
        print(f"{Fore.CYAN}🔗 Subscribed to topic → {TOPIC}")
    else:
        print(f"{Fore.RED}❌ MQTT connection failed with code {rc}")


def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload)
        sensor_input = [
            float(payload["vibration"]),
            float(payload["tilt"]),
            float(payload["strain"]),
            float(payload["pore_pressure"]),
            float(payload["temp"]),
            float(payload["humidity"]),
        ]
    except Exception as exc:
        print(f"{Fore.RED}⚠️ Failed to parse incoming MQTT message: {exc}")
        return

    rf_prob, lstm_prob, dem_prob, final_prob = compute_final_risk(
        userdata["rf_model"],
        userdata["lstm_model"],
        sensor_input,
    )

    # Pretty terminal output
    pretty_print_pipeline(rf_prob, lstm_prob, dem_prob, final_prob)

    # Risk map visualization
    save_risk_map(final_prob)

    # Log high-risk alerts
    if final_prob >= ALERT_THRESHOLD:
        log_alert(rf_prob, lstm_prob, dem_prob, final_prob)


def create_mqtt_client(rf_model, lstm_model) -> mqtt.Client:
    """Configure MQTT client with callbacks and shared userdata."""
    client = mqtt.Client(
        client_id=f"rockfall-client-{random.randint(0, 9999)}",
        userdata={"rf_model": rf_model, "lstm_model": lstm_model},
    )
    client.on_connect = on_connect
    client.on_message = on_message
    return client


# ---------------------------------------------------------------------
# 6. Simulation Publisher (Dummy Sensor Data)
# ---------------------------------------------------------------------
def simulate_sensor_stream(client: mqtt.Client) -> None:
    """Publish dummy sensor readings every 2 seconds."""
    print(f"{Fore.CYAN}📡 Starting dummy sensor stream → publishing every 2s...")
    print(
        f"{Fore.LIGHTBLACK_EX}   (30% of samples are intentionally high-risk "
        f"to stress the pipeline)\n"
    )

    keys = ["vibration", "tilt", "strain", "pore_pressure", "temp", "humidity"]

    while True:
        try:
            if random.random() < 0.3:  # 30% high-risk samples
                msg = {k: random.uniform(0.6, 1.0) for k in keys}
            else:
                msg = {k: random.uniform(0.0, 0.5) for k in keys}

            client.publish(TOPIC, json.dumps(msg))
            time.sleep(2)
        except KeyboardInterrupt:
            raise
        except Exception as exc:
            print(f"{Fore.RED}⚠️ Sensor simulation error: {exc}")
            time.sleep(2)


# ---------------------------------------------------------------------
# 7. Main Entry Point
# ---------------------------------------------------------------------
def main() -> None:
    ensure_dirs()
    banner()

    # Start DEM watcher thread
    threading.Thread(target=dem_watcher, daemon=True).start()

    print(f"{Fore.WHITE}📦 Loading models from '{MODEL_DIR}' ...", end=" ")
    rf_model, lstm_model = load_models()
    print(f"{Fore.GREEN}done.\n")

    client = create_mqtt_client(rf_model, lstm_model)
    client.connect(BROKER, PORT, keepalive=60)
    client.loop_start()

    try:
        simulate_sensor_stream(client)
    except KeyboardInterrupt:
        print(f"\n{Fore.RED}🛑 Stopping simulation & disconnecting MQTT...")
    finally:
        client.loop_stop()
        client.disconnect()
        print(f"{Fore.LIGHTWHITE_EX}👋 Shutdown complete.")


if __name__ == "__main__":
    main()
