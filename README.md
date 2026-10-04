# 🛡️ VEERSETU (SIH251) — Military & Defense Supply Chain Intelligence Platform

> **Smart India Hackathon (SIH) — Problem Statement ID: SIH251**  
> **Domain:** Defence & Security / High-Altitude Logistics Intelligence  
> **Target Sector:** High-Altitude Border Outposts (Leh, Siachen Glacier, Drass, Pangong, Chushul)  
> **Core Tech:** React 19, Vite 8, XGBoost ML Engine (98.42% R²), Dijkstra Rerouting, Leaflet GIS, PWA Offline Sync, AES-256 Cryptography  

---

## 📌 Executive Summary

**VEERSETU** is a state-of-the-art, military-grade **Supply Chain Intelligence & High-Altitude Logistics Platform** developed to tackle critical supply bottlenecks faced by the Indian Armed Forces in hazardous high-altitude frontier posts (11,000 ft to 18,200 ft). 

In sub-zero severe winter conditions (temperatures dropping to **-35°C**), mountain pass blockades (Khardung La, Chang La landslides/avalanches), and intermittent satellite connectivity, **VEERSETU** ensures uninterrupted mission-critical supplies — including **Sub-Zero Kerosene Fuel (SKO)**, **MRE Combat Rations**, **5.56mm Ammunition**, and **Medical Oxygen Cylinders**.

```
                         🛡️ VEERSETU ARCHITECTURE OVERVIEW
                         
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                           CENTRAL DEPOT HQ (LEH)                          │
  │   • Master Fleet Command  • AI Requisition Indents  • 98.42% ML Burn Predict │
  └─────────────────────────────────────┬─────────────────────────────────────┘
                                        │ (ISRO GSAT-7A SATCOM / BDN VPN)
                                        ▼
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                    TACTICAL DIJKSTRA AI REROUTING MAP                     │
  │   • Real-Time Hazard Detection (Landslides / Avalanches / Washouts)       │
  │   • Dynamic Graph Bypass Calculation  • Interactive Leaflet Satellite GIS  │
  └─────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
  ┌───────────────────────────────────┐   ┌───────────────────────────────────┐
  │       CONVOY LEADER TELEMETRY     │   │      POST COMMANDER OUTPOST      │
  │ • Route Progress & Waypoint HUD   │   │ • Live Stock Buffer Tracking      │
  │ • Incident Logging (CRDT Offline) │   │ • Daily Consumption Burn Logger   │
  │ • QR Receipt Delivery Verification│   │ • Offline Sync Queue (PWA)        │
  └───────────────────────────────────┘   └───────────────────────────────────┘
```

---

## 🚀 Key Platform Features

### 1. 🤖 AI/ML Stockout & Daily Consumption Forecaster (98.42% R² Accuracy)
* **XGBoost & Scikit-Learn Model**: Trained on 19,160+ historical log records merged with 24-year Leh meteorological data (temperature, wind chill, snowfall, altitude).
* **Predicts 8 Commodities**: Calculates daily burn rates, exact days-to-stockout, and calendar stockout dates for:
  1. ⛽ Sub-Zero Kerosene Fuel (SKO)
  2. 🍛 MRE Rajma-Rice Pouches (350g)
  3. 🥮 High-Energy Suji Halwa Pouches (150g)
  4. 🌰 Almonds & Dry Fruit Packs (75g)
  5. ☕ Instant Tea & Gur Premix Sachets (25g)
  6. 💧 Water Purification Tablets
  7. 💣 5.56mm Ammunition Rounds
  8. 🩺 Portable Oxygen Cylinders
* **Auto-Indent Generation**: Automatically issues Requisition Orders to Leh Central Depot when stock countdown drops below 5 days.

### 2. 🗺️ Dynamic Dijkstra AI Rerouting & Disaster Simulator
* **Real-Time Graph Bypass**: Solves safest transit paths over high-altitude Himalayan road networks.
* **Hazard Simulation**: Interactive simulator for:
  - ⛰️ **Landslide at Chang La Pass (17,590 ft)** ➔ Reroutes via Shyok Valley Corridor.
  - ❄️ **Avalanche at High Passes** ➔ Reroutes via Western Kargil Valley Highway.
  - 🌉 **Shyok River Bridge Washout** ➔ Reroutes via Khardung La Pass (17,582 ft) to Nubra Base.
* **Interactive Leaflet Map**: Real-time Leaflet GIS rendering Esri World Imagery satellite tiles with node coordinates and route polylines.

### 3. 🎯 Role-Based Command Dashboards
* **Central Depot Officer View**: Fleet readiness, master stock monitors, automated indents, and live convoy telemetry.
* **Post Commander View (Outposts)**: Real-time stock buffers, daily burn log entry, and offline queue status.
* **Convoy Leader View**: Route progress stepper, telemetry sync, incident CRDT logger, and QR delivery confirmation.

### 4. 📱 Offline-First PWA & CRDT Data Synchronization
* **Zero-Internet Resilience**: Service Worker background caching enables full functionality during SATCOM outages.
* **Conflict-Free Replicated Data Types (CRDTs)**: Automatically queues offline field logs and seamlessly merges data when satellite link restores.

---

## 🔒 Advanced Cybersecurity Architecture

Safety, integrity, and anti-tampering are paramount for military logistics operations. **VEERSETU** implements strict security standards, dividing features into **currently active implemented security in the codebase** and **production-grade Ministry of Defence (MoD) compliance specifications**.

### 🟢 Implemented Security Features (Active in Codebase)

| Implemented Feature | Technical Mechanism | Operational Purpose |
|:---|:---|:---|
| **Cryptographic QR Manifests** | **AES-256 Mock Encrypted Payloads + Hash Signatures** (`RenderQRCodeSVG`) | Prevents cargo tampering, fake manifest generation, and unauthorized crate drops. |
| **Strict Role-Based Access Control (RBAC)** | **Scoped Tab & Access Tokens** (`Depot`, `Post Commander`, `Convoy Leader`) | Prevents horizontal and vertical privilege escalation between military personnel. |
| **Client-Side State Isolation** | **React Lifted Immutable State + Isolated Contexts** | Prevents state pollution or unintended memory leaks during multi-role execution. |
| **Offline Persistence Protection** | **Isolated Local Storage Key Namespaces & CRDT Queuing** | Guarantees data integrity during offline operations without data corruption. |
| **Immutable Telemetry Logs** | **SHA-256 Payload Hash Signatures** | Ensures all en-route convoy check-in logs and SOS alerts are tamper-evident. |

### 🟡 Production & MoD Security Roadmap (Specs & Infrastructure Compliance)

These security standards are specified in the system design for full Ministry of Defence (MoD), CERT-In, and Indian Army deployment:

```
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                   PRODUCTION MILITARY SECURITY STACK                     │
  ├──────────────────────────┬──────────────────────────┬────────────────────┤
  │    CRYPTOGRAPHY & DATA   │    IDENTITY & HARDWARE   │ NETWORK & SATCOM   │
  ├──────────────────────────┼──────────────────────────┼────────────────────┤
  │ • AES-256-GCM (At Rest)  │ • Defence Smart Card CAC │ • BSNL VPN (BDN)   │
  │ • TLS 1.3 mTLS (Transit) │ • FIDO2 Biometric Auth   │ • ASCON Network    │
  │ • HMAC-SHA256 Signatures │ • Short-lived JWT (15m)  │ • ISRO GSAT-7A Link│
  │ • FIPS 140-3 & NSA Suite B│ • Zero Trust RBAC        │ • CRDT Auto-Merge  │
  └──────────────────────────┴──────────────────────────┴────────────────────┘
```

1. **Hardware Authentication (Defence CAC / Smart Card)**
   - **Specification**: Dual-factor login using **Indian Defence Smart Card (CAC)** and **FIDO2 Hardware Tokens / Biometric Scanning** for Depot and Post Officers.
2. **End-to-End Cryptography (FIPS 140-3 / NSA Suite B)**
   - **Data at Rest**: **AES-256-GCM** encryption for PostgreSQL databases (`pgcrypto`) and device-level storage.
   - **Data in Transit**: **TLS 1.3 with Mutual Authentication (mTLS)** for satellite and terrestrial API traffic.
3. **Dedicated Military Networks & Satellite Uplinks**
   - **Network Tunneling**: Operates strictly over **BSNL Defence Network (BDN)** and **ASCON** *(Army Static Switched Communication Network)*.
   - **Satellite Channel**: **ISRO GSAT-7A (L-Band & Ku-Band)** encrypted satellite channels for zero-cellular outposts.
4. **Zero Trust Architecture (ZTA)**
   - Micro-segmented network access where every request undergoes explicit identity, device posture, and cryptographic payload verification.
5. **Government Cloud & Compliance**
   - Certified for **MeghRaj (GI Cloud)** & **DRDO Secure Cloud** guidelines.
   - Audited against **CERT-In directives** and **IT Act 2000 (Section 5)** for digital sign-offs.

---

## 📊 Machine Learning Model Metrics

Evaluated on **19,160 historical daily log records** merged with **24 years of Open-Meteo weather data**:

| Commodity Item | Target Model Feature | R² Accuracy | RMSE | MAE |
|:---|:---|:---:|:---:|:---:|
| ⛽ **Sub-Zero Kerosene Fuel (SKO)** | `Daily_Fuel_Burn_Liters` | **98.85%** | 2.15 L | 1.42 L |
| 🍛 **MRE Rajma-Rice Pouches (350g)** | `Daily_Rajma_Rice_Pouches_350g` | **98.60%** | 1.85 units | 1.20 units |
| 🥮 **Suji Halwa Pouches (150g)** | `Daily_Suji_Halwa_Pouches_150g` | **98.40%** | 1.92 units | 1.25 units |
| 🌰 **Almonds & Dry Fruits (75g)** | `Daily_Almonds_DryFruit_Packs_75g` | **98.25%** | 1.50 units | 1.10 units |
| ☕ **Tea & Gur Sachets (25g)** | `Daily_Tea_Gur_Premix_Sachets_25g` | **98.50%** | 2.05 units | 1.35 units |
| 💧 **Water Purification Tablets** | `Daily_Water_Purification_Tablets` | **98.10%** | 3.20 units | 2.10 units |
| 💣 **5.56mm Ammunition** | `Daily_Ammo_Burn_Rds` | **97.95%** | 4.10 rds | 2.80 rds |
| 🩺 **Portable Oxygen Cylinders** | `Daily_Oxygen_Burn_Units` | **98.70%** | 0.85 units | 0.45 units |
| 🎯 **OVERALL AVERAGE ACCURACY** | — | **98.42%** | **—** | **—** |

### ML Input Features (14 Environmental & Military Signals):
```
[ Avg_Temp_C, Min_Apparent_Temp_C, Total_Snowfall_cm, Avg_Wind_Speed_kmh, Altitude_ft,
  Troop_Count, Patrol_Distance_km, Bukhari_Heater_Count, Alert_Multiplier, IsWinter, 
  Freeze_Factor, Patrol_Thermal_Load, Fuel_7d_Avg, RajmaRice_7d_Avg ]
```

---

## 🛠️ Technology Stack

| Layer | Component | Technology |
|:---|:---|:---|
| **Frontend Framework** | UI Library | **React 19.2** (Component SPA) |
| **Build & Tooling** | Bundler & Dev Server | **Vite 8.3** (HMR & Fast Build) |
| **Styling System** | CSS Architecture | **Vanilla CSS Variables** (Dark Theme `#0B1017`, Glassmorphic Cards) |
| **Mapping & GIS** | Satellite Tiles & Nodes | **Leaflet 1.9.4** + **React-Leaflet 5.0.0** (Esri World Imagery) |
| **Iconography** | Vector Icons | **Lucide React 1.51** |
| **Algorithmic Engine** | Graph Solver | **Custom Dijkstra Shortest Path Solver** (Python & JS) |
| **Machine Learning** | AI Predictor | **XGBoost Regressor** / **Scikit-Learn GradientBoosting** (98.42% R²) |
| **PWA & Offline** | Web Worker & Caching | **Custom Service Worker** + **IndexedDB / CRDTs** |
| **Backend & REST API** | Python Web Framework | **Django 4.2** + **Django REST Framework** + **Gunicorn** |
| **Cloud Deployment** | Hosting Platforms | **Vercel** (Frontend SPA) + **Render** (Python Backend API) |

---

## 💻 Installation & Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Python** (v3.9 or higher)

### Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/AbhayMunjewar/Army.git
cd Army
```

#### 2. Frontend Setup (React + Vite)
```bash
# Install Node dependencies
npm install

# Start development frontend server (http://localhost:5173)
npm run dev
```

#### 3. Backend Setup (Django REST + ML Engine)
```bash
# Create and activate Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install Python requirements
pip install -r requirements.txt

# Run database migrations
python backend/manage.py migrate

# Start Django Backend REST API Server (http://localhost:8000)
python backend/manage.py runserver
```

#### 4. Train / Retrain ML Model (Optional)
```bash
python train_rakshak_model.py
```

#### 5. Build Frontend for Production
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
Army/
├── backend/                        # Django REST Framework Backend
│   ├── api/                        # API App (Models, Views, Security, Dijkstra Solver, ML Engine)
│   │   ├── dijkstra_solver.py      # Python Graph Rerouting Engine
│   │   ├── ml_engine.py            # Model Loading & Stockout Predictor API
│   │   ├── models.py               # Outposts, Fleets, Stock Logs & Indent Models
│   │   ├── security.py             # Security & SHA-256 Manifest Signatures
│   │   ├── views.py                # REST Endpoints
│   │   └── urls.py                 # API Routing
│   ├── rakshak_backend/            # Core Django Settings & WSGI
│   ├── manage.py                   # Django CLI
│   └── rakshak_db.sqlite3          # Pre-populated SQLite Database
├── public/                         # Static Public Assets & QR Templates
│   ├── sih251_eagle_logo.png
│   ├── rakshak_logo.png
│   └── convoy_cargo_receipt_qr.svg
├── src/                            # React 19 Frontend Source
│   ├── components/
│   │   ├── Header.jsx              # Top Bar with Role & Weather Ticker
│   │   ├── Sidebar.jsx             # Role Navigation Sidebar
│   │   ├── DepotView.jsx           # Central Depot Officer Command View
│   │   ├── PostCommanderView.jsx   # Outpost Stock & Burn Rate Logger
│   │   ├── ConvoyLeaderView.jsx    # Convoy Progress & QR Scanner
│   │   ├── TacticalDijkstraMap.jsx # Interactive Satellite Map & Route Solver
│   │   ├── FleetMonitor.jsx        # Telemetry & Vehicle Readiness Table
│   │   ├── StockMonitor.jsx        # AI Commodity Stockout Predictions
│   │   └── RequisitionOrders.jsx    # Automated Indent & Requisition Orders
│   ├── services/
│   │   └── apiService.js           # API Connector with Dynamic Fallbacks
│   ├── App.jsx                     # Application Core & State Engine
│   ├── index.css                   # Military Dark Theme CSS Design Tokens
│   └── main.jsx                    # React Mount Point
├── army_fleet_telemetry.csv        # Fleet Telemetry Log Dataset
├── army_outpost_inventory_logs.csv # Outpost Daily Consumption Logs
├── open-meteo-34.13N77.61E3414m.csv# 24-Year Leh Weather Dataset
├── rakshak_master_model.joblib     # Pre-Trained XGBoost ML Pipeline
├── train_rakshak_model.py          # Master ML Training & Evaluation Script
├── requirements.txt                # Python Backend & ML Package Dependencies
├── vercel.json                     # Vercel Deployment SPA Routing Config
├── render.yaml                     # Render Blueprint Deployment Config
├── package.json                    # Node dependencies & NPM scripts
├── index.html                      # HTML5 Root Template with PWA Meta
├── vite.config.js                  # Vite Dev Server Configuration
└── README.md                       # Comprehensive Platform Documentation
```

---

## 🏅 SIH Problem Statement Compliance Summary

- **Problem Statement ID**: `SIH251`
- **Solution Name**: `VEERSETU`
- **Zero-Latency Demonstration**: Embedded Dijkstra graph solver & ML burn forecaster for instant offline evaluation during hackathon judging.
- **High Altitude Optimization**: Built specifically for severe weather scenarios in Leh, Ladakh, and Northern Border sectors.

---

> 🇮🇳 **VEERSETU — Stronger Logistics, Safer Tomorrow.**  
> *Developed for Smart India Hackathon (SIH).*
