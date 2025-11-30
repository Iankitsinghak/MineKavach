# MineKavach 🛡️

**Rockfall Sentinel: AI-Powered Mine Safety Monitoring & Alert System**

[![Deploy Status](https://img.shields.io/badge/deploy-live-success)](https://mine-kavach.vercel.app)
[![TypeScript](https://img.shields. io/badge/TypeScript-91. 8%25-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-6.7%25-yellow)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

MineKavach is an intelligent mine safety monitoring system that leverages machine learning, real-time sensor data, and geospatial analysis to predict and prevent rockfall incidents in mining operations. The platform provides probabilistic forecasting, real-time risk assessment, and automated alerting to ensure worker safety and operational continuity. 

🌐 **Live Demo**: [https://mine-kavach.vercel. app](https://mine-kavach.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Project Structure](#-project-structure)
- [Machine Learning Pipeline](#-machine-learning-pipeline)
- [MQTT Integration](#-mqtt-integration)
- [Dashboard Features](#-dashboard-features)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Capabilities

- **Real-Time Risk Assessment**: Continuous monitoring and evaluation of mine stability using multi-sensor data fusion
- **Probabilistic Forecasting**: ML-powered prediction of rockfall likelihood and scale using Random Forest and LSTM models
- **Multi-Source Data Integration**: Combines sensor data, DEM (Digital Elevation Model), and drone imagery for comprehensive analysis
- **Automated Alert System**: Intelligent SMS/email notifications when high-risk conditions are detected
- **Interactive Dashboard**: Intuitive web interface for data visualization and risk monitoring
- **Historical Analysis**: Track trends and patterns over time with detailed logging

### 🔬 Advanced Features

- **Hybrid ML Pipeline**: 
  - **Random Forest** for snapshot-level classification
  - **LSTM** for time-series risk prediction
  - **DEM Fusion** for spatial risk correlation
- **Smart Sensor Management**: Configure and monitor multiple sensor types (vibration, tilt, strain, pore pressure, temperature, humidity)
- **Geographic Intelligence**: Geocoding and nearby mine detection for contextual awareness
- **Weather Integration**: Real-time weather data correlation with risk factors
- **AI-Powered Insights**: Genkit AI integration for intelligent risk analysis

---

## 🏗️ Architecture

MineKavach employs a modern full-stack architecture with AI/ML capabilities:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │   Alerts     │  │   Sensors    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI Layer (Genkit AI)                      │
│  • Risk Analysis  • Geocoding  • Weather  • Nearby Mines   │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  MQTT Broker (Mosquitto)                    │
│              Real-time Sensor Data Streaming                │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                Backend (Python ML Pipeline)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Random Forest│  │     LSTM     │  │  DEM Fusion  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         Risk Calculation • Alert Logging • Map Generation   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.3.3 (React 18.3.1)
- **Language**: TypeScript 5
- **UI Components**: Radix UI + Tailwind CSS
- **Styling**: Tailwind CSS with custom theme
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation
- **AI Integration**: Genkit AI with Google AI

### Backend
- **Language**: Python 3.x
- **ML Frameworks**: 
  - TensorFlow/Keras (LSTM)
  - scikit-learn (Random Forest)
  - joblib (Model persistence)
- **MQTT**: Paho MQTT Client
- **Data Processing**: NumPy, Pandas
- **Visualization**: Matplotlib
- **Terminal UI**: Colorama

### Infrastructure
- **Deployment**: Vercel (Frontend)
- **MQTT Broker**: test. mosquitto.org (configurable)
- **State Management**: React Context + Local Storage

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.8+
- **Git**

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/xthxr/MineKavach.git
   cd MineKavach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env. local` file in the root directory:
   ```env
   # Google AI API Key for Genkit
   GOOGLE_GENAI_API_KEY=your_api_key_here
   
   # Firebase Configuration (if using)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:9002`

5. **Run Genkit development server** (optional, for AI flows)
   ```bash
   npm run genkit:dev
   ```

### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2.  **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train ML models** (first-time setup)
   ```bash
   python train_sensor_model. py
   ```
   This will:
   - Generate synthetic sensor data
   - Train Random Forest classifier
   - Train LSTM time-series model
   - Save models to `models/` directory

5. **Run the monitoring system**
   ```bash
   python calc_prob. py
   ```
   This starts:
   - MQTT client (subscribes to sensor data)
   - ML inference pipeline
   - Sensor data simulation (publishes dummy data)
   - Real-time risk calculation and alerting

---

## 📁 Project Structure

```
MineKavach/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── alerts/         # Alerts management
│   │   │   ├── sensors/        # Sensor monitoring
│   │   │   └── page.tsx        # Main dashboard
│   │   ├── onboarding/         # Mine setup wizard
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   ├── onboarding/         # Onboarding forms
│   │   └── ui/                 # Reusable UI components
│   ├── ai/
│   │   ├── flows/              # Genkit AI flows
│   │   └── tools/              # AI tools (geocoding, weather)
│   └── lib/
│       ├── data. ts             # Mock data
│       └── types.ts            # TypeScript types
├── Backend/
│   ├── calc_prob.py            # Main ML pipeline & MQTT
│   ├── train_sensor_model.py  # Model training script
│   ├── requirements.txt        # Python dependencies
│   ├── models/                 # Trained ML models
│   ├── data/                   # Training datasets
│   ├── dem_files/              # DEM/drone imagery
│   └── logs/                   # Alert logs
├── docs/
│   └── blueprint.md            # Project specifications
└── public/                     # Static assets
```

---

## 🧠 Machine Learning Pipeline

### 1. Random Forest Classifier
- **Purpose**: Snapshot-level risk classification
- **Input Features**: 6 sensor readings (vibration, tilt, strain, pore pressure, temperature, humidity)
- **Output**: Risk probability [0-1]
- **Threshold**: 0.3 (triggers DEM fusion)

### 2.  LSTM Time-Series Model
- **Purpose**: Short-term temporal pattern recognition
- **Input**: Sequence of 5 timesteps (30 sensor values)
- **Architecture**: LSTM layers with dropout
- **Output**: Temporal risk score [0-1]

### 3. DEM Fusion Module
- **Purpose**: Spatial risk analysis from terrain data
- **Trigger**: Activated when RF risk > 0.3
- **Process**: Analyzes latest DEM/drone imagery files
- **Output**: Spatial risk factor [0-1]

### 4. Risk Fusion Algorithm
```python
Final Risk = (W_RF × RF_prob) + (W_LSTM × LSTM_prob) + (W_DEM × DEM_prob)

# Default weights:
W_RF = 0. 5    # Snapshot classification
W_LSTM = 0.2  # Temporal patterns
W_DEM = 0.3   # Spatial analysis
```

### Alert Thresholds
- **ALERT**: Final Risk ≥ 0.6 (60%)
- **WARNING**: Final Risk ≥ 0.4 (40%)
- **SAFE**: Final Risk < 0.4 (40%)

---

## 📡 MQTT Integration

### Configuration
- **Broker**: `test.mosquitto.org` (default)
- **Port**: `1883`
- **Topic**: `mine/sensors`
- **Protocol**: MQTT v3.1. 1

### Message Format
```json
{
  "vibration": 0.45,
  "tilt": 0.32,
  "strain": 0.67,
  "pore_pressure": 0.51,
  "temp": 0.28,
  "humidity": 0.39
}
```

### Data Flow
1.  Sensors publish data to MQTT topic every 2 seconds
2. Backend subscribes and processes incoming messages
3. ML pipeline performs real-time inference
4. Risk maps and alerts generated automatically
5. Frontend dashboard receives updates via polling/websocket

---

## 📊 Dashboard Features

### 1. **Main Dashboard** (`/dashboard`)
- Overall risk level indicator
- Sensor status monitoring
- Active alerts summary
- Real-time weather integration
- Key metrics visualization

### 2. **Alerts Management** (`/dashboard/alerts`)
- Alert history table with filtering
- Severity-based color coding
- Search and sort functionality
- AI-powered risk analysis
- Export capabilities

### 3. **Sensor Monitoring** (`/dashboard/sensors`)
- Real-time sensor charts
- Individual sensor status
- Historical trend analysis
- Multi-sensor comparison
- Data source management

### 4. **Onboarding Wizard** (`/onboarding`)
- **Step 1**: Mine information (name, location, type)
- **Step 2**: Data availability (sensor selection)
- **Step 3**: Monitoring preferences
- **Step 4**: Emergency contacts

---

## 🔌 API Documentation

### AI Flows (Genkit)

#### Analyze Current Risk
```typescript
import { analyzeCurrentRiskFromSensors } from '@/ai/flows/analyze-current-risk-from-sensors';

const result = await analyzeCurrentRiskFromSensors({
  sensorData: [... ],
  alerts: [...]
});
```

#### Geocoding
```typescript
import { getAddressFromCoordinates } from '@/ai/tools/geocoding-tool';

const address = await getAddressFromCoordinates({
  latitude: 28.6139,
  longitude: 77.2090
});
```

#### Weather Data
```typescript
import { getWeather } from '@/ai/tools/weather-tool';

const weather = await getWeather({
  latitude: 28.6139,
  longitude: 77.2090
});
```

#### Nearby Mines
```typescript
import { getNearbyMines } from '@/ai/tools/nearby-mines-tool';

const mines = await getNearbyMines({
  latitude: 28.6139,
  longitude: 77.2090,
  radius: 50
});
```

---

## ⚙️ Configuration

### Backend Configuration (`calc_prob.py`)

```python
# MQTT Settings
BROKER = "test.mosquitto.org"
PORT = 1883
TOPIC = "mine/sensors"

# ML Settings
TIMESTEPS = 5                    # LSTM sequence length
RF_THRESHOLD_FOR_DEM = 0.3       # DEM activation threshold
ALERT_THRESHOLD = 0.6            # High-risk alert
STATUS_THRESHOLD = 0.4           # Warning threshold

# Fusion Weights
W_RF = 0.5                       # Random Forest weight
W_LSTM = 0.2                     # LSTM weight
W_DEM = 0.3                      # DEM weight
```

### Frontend Configuration

```typescript
// next.config.ts
const config = {
  experimental: {
    serverActions: true,
  },
  // Add your configurations
}
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Deep Blue (#3498db) - Stability and trust
- **Background**: Light Grey (#f0f0f0) - Clean backdrop
- **Accent**: Orange (#e67e22) - Alerts and CTAs
- **Success**: Green - Safe conditions
- **Warning**: Amber - Medium risk
- **Danger**: Red - High risk

### Typography
- **Font Family**: Inter (sans-serif)
- **Headings**: Bold, clear hierarchy
- **Body**: Regular, highly readable

---

## 📈 Output & Logging

### Risk Map
- Generated as `risk_map.png` in Backend directory
- Color-coded visualization of risk levels
- Updated with each prediction cycle

### Alert Logs
- Stored in `logs/alerts.csv`
- Fields: timestamp, RF prob, LSTM prob, DEM prob, final prob
- Used for historical analysis and reporting

### Terminal Output
- Colorized, boxed pipeline summary
- Real-time sensor values
- Model predictions and fusion results
- Alert status indicators

---

## 🤝 Contributing

We welcome contributions!  Please follow these guidelines:

1.  Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript/Python best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- Simulated sensor data (demo mode)
- Mock DEM processing
- Test MQTT broker (not production-ready)

### Planned Features
- [ ] Real sensor integration (IoT devices)
- [ ] Advanced DEM processing with computer vision
- [ ] Multi-mine management
- [ ] Mobile app (iOS/Android)
- [ ] Advanced analytics and reporting
- [ ] Integration with mine management systems
- [ ] Real-time 3D visualization
- [ ] Predictive maintenance scheduling

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 

---

## 👨‍💻 Authors

**xthxr**
- GitHub: [@xthxr](https://github.com/xthxr)
**ankit**
- GitHub: [@xthxr](https://github.com/Iankitsinghak)

---

## 🙏 Acknowledgments

- **Genkit AI** - AI integration framework
- **Next.js Team** - Amazing React framework
- **TensorFlow Team** - ML capabilities
- **Open Source Community** - Various libraries and tools

---

## 📞 Support

For support, please:
- Open an issue on GitHub
- Check existing documentation
- Review the [blueprint.md](docs/blueprint.md) for detailed specifications

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Built with ❤️ for safer mining operations**
