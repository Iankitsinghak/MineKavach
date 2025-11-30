import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib, os, json
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# ----------------------------
# 1️⃣ Folders
# ----------------------------
os.makedirs("data", exist_ok=True)
os.makedirs("models", exist_ok=True)
os.makedirs("logs", exist_ok=True)

# ----------------------------
# 2️⃣ Dataset Creation (higher risk bias)
# ----------------------------
N = 400   # normal
MID = 400 # mid-risk
M = 400   # high-risk

def make_dataset():
    normal_data = pd.DataFrame({
        "vibration": np.random.uniform(0.0, 0.5, N),
        "tilt": np.random.uniform(10, 30, N),
        "strain": np.random.uniform(0.0, 0.5, N),
        "pore_pressure": np.random.uniform(0.0, 0.3, N),
        "temp": np.random.uniform(20, 30, N),
        "humidity": np.random.uniform(40, 60, N),
        "label": 0
    })

    mid_risk_data = pd.DataFrame({
        "vibration": np.random.uniform(0.4, 0.8, MID),
        "tilt": np.random.uniform(30, 70, MID),
        "strain": np.random.uniform(0.4, 0.8, MID),
        "pore_pressure": np.random.uniform(0.3, 0.7, MID),
        "temp": np.random.uniform(28, 38, MID),
        "humidity": np.random.uniform(55, 75, MID),
        "label": 1
    })

    high_risk_data = pd.DataFrame({
        "vibration": np.random.uniform(0.7, 1.0, M),
        "tilt": np.random.uniform(60, 90, M),
        "strain": np.random.uniform(0.7, 1.0, M),
        "pore_pressure": np.random.uniform(0.7, 1.0, M),
        "temp": np.random.uniform(35, 45, M),
        "humidity": np.random.uniform(70, 95, M),
        "label": 1
    })

    return pd.concat([normal_data, mid_risk_data, high_risk_data], ignore_index=True)

data = make_dataset()
data.to_csv("data/synthetic_sensor_data.csv", index=False)

# ----------------------------
# 3️⃣ Random Forest Training
# ----------------------------
X = data[["vibration","tilt","strain","pore_pressure","temp","humidity"]]
y = data["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf_model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_split=5,
    min_samples_leaf=3,
    class_weight="balanced",
    random_state=42
)
rf_model.fit(X_train, y_train)
y_pred = rf_model.predict(X_test)

joblib.dump(rf_model, "models/rockfall_rf.pkl")

# ----------------------------
# 4️⃣ LSTM Training
# ----------------------------
timesteps = 5
X_seq, y_seq = [], []
for i in range(len(X) - timesteps):
    X_seq.append(X.iloc[i:i+timesteps].values)
    y_seq.append(y.iloc[i+timesteps])
X_seq, y_seq = np.array(X_seq), np.array(y_seq)

X_train_seq, X_test_seq = X_seq[:int(0.8*len(X_seq))], X_seq[int(0.8*len(X_seq)):]
y_train_seq, y_test_seq = y_seq[:int(0.8*len(y_seq))], y_seq[int(0.8*len(y_seq)):]

lstm_model = Sequential([
    LSTM(64, input_shape=(timesteps, X.shape[1])),
    Dropout(0.3),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')
])
lstm_model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
lstm_model.fit(X_train_seq, y_train_seq, epochs=10, batch_size=32, verbose=1, validation_split=0.2)

lstm_model.save("models/rockfall_lstm.h5")

# ----------------------------
# 5️⃣ Logs
# ----------------------------
rf_acc = accuracy_score(y_test, y_pred)
metrics = {
    "rf_accuracy": rf_acc,
    "rf_report": classification_report(y_test, y_pred, output_dict=True),
    "lstm_train_shape": X_train_seq.shape,
    "lstm_test_shape": X_test_seq.shape
}
with open("logs/training_metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

print("✅ Random Forest + LSTM trained and saved!")
print(f"🔹 RF Accuracy: {rf_acc:.3f}")
print("📊 Metrics saved in logs/training_metrics.json")
