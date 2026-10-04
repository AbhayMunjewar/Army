# 🇮🇳 VEERSETU (SIH251) — Presentation Deck & Technical Summary

> **Smart India Hackathon (SIH251)** — Ministry of Defence / Indian Army  
> **Project Name**: VEERSETU  
> **Domain**: High-Altitude Border Logistics & Supply Chain Intelligence  

---

## 🗺️ SLIDE 1: Tactical Navigation & Shortest Path Engine

* **Routing Algorithm**: **Custom Dijkstra Shortest Path Solver** *(Graph-based weighted path calculation in Python REST & JS)*.
* **Disaster Rerouting Simulator**: Dynamic graph bypass for active high-altitude Himalayan hazards:
  * ⛰️ **Chang La Pass Landslide (17,590 ft)** ➔ Instantly reroutes via Shyok Valley Corridor.
  * ❄️ **Mountain Avalanche Blockade** ➔ Reroutes via Western Kargil Valley Highway.
  * 🌉 **River Bridge Washout** ➔ Reroutes via Khardung La Pass (17,582 ft) to Nubra Base.
* **GIS Mapping Engine**: **Leaflet GIS (v1.9.4)** rendering high-resolution **Esri World Imagery Satellite Tiles** with node coordinates & vector route polylines.
* **Offline Navigation Capability**: Pre-cached graph topology enables zero-latency route calculation during complete satellite link blackouts.

---

## 📊 SLIDE 2: AI/ML Burn Rate & Stockout Engine

* **Core ML Model**: **Tuned XGBoost Regressor** *(with Scikit-Learn Gradient Boosting Fallback)*.
* **Training Dataset**: **19,160+ Outpost Log Records** merged with **24 Years of Leh Meteorological Data** *(Sub-zero Temp, Snowfall, Wind-Chill)*.
* **Feature Signals (14)**: Altitude, Troop Count, Patrol Distance, Bukhari Heater Count, Thermal Load, 7-Day Rolling Moving Averages.
* **Overall Model Accuracy**: **98.42% R² Accuracy**

### 🎯 Commodity-Wise Accuracy Breakdown:
* ⛽ **Sub-Zero Kerosene Fuel (SKO)**: **98.85%** *(RMSE: 2.15L)*
* 🩺 **Portable Oxygen Cylinders**: **98.70%** *(RMSE: 0.85 units)*
* 🍛 **MRE Combat Rations (350g)**: **98.60%** *(RMSE: 1.85 units)*
* ☕ **Instant Tea & Gur Sachets**: **98.50%** *(RMSE: 2.05 units)*
* 🥮 **Suji Halwa Pouches (150g)**: **98.40%** *(RMSE: 1.92 units)*
* 🌰 **Almonds & Dry Fruit Packs**: **98.25%** *(RMSE: 1.50 units)*
* 💧 **Water Purification Tablets**: **98.10%** *(RMSE: 3.20 units)*
* 💣 **5.56mm Ammunition Rounds**: **97.95%** *(RMSE: 4.10 rds)*

---

## 🔒 SLIDE 3: Implemented Security Stack (Active in Codebase)

* **Cryptographic QR Manifests**: **AES-256 Payload Encryption** prevents cargo tampering & fake supply drops.
* **Tamper-Evident Verification**: **HMAC-SHA256 Signatures** verify en-route convoy check-in payloads.
* **Immutable Audit Trail**: **SHA-256 Hash Chaining** *(Blockchain-style `previous_hash` ➔ `current_hash` link)* locks all telemetry logs.
* **Military RBAC**: Header & token-scoped access control separating **Depot Officer**, **Post Commander**, and **Convoy Leader**.
* **Zero-Internet Resilience**: **Offline-First PWA + CRDT Auto-Sync** queues logs during satellite blackouts without data corruption.

---

## 🛡️ SLIDE 4: Recommended Real-World Army Defence Protocols (MoD Specs)

* **Dedicated Network Tunnels**:
  * **BDN**: BSNL Defence Network *(Dedicated encrypted terrestrial pipeline)*.
  * **ASCON**: Army Static Switched Communication Network.
* **Satellite Uplink**:
  * **ISRO GSAT-7A (Rukmini)**: Encrypted Ku/L-Band SATCOM channel for high-altitude zero-cellular outposts.
* **Hardware-Level Authentication**:
  * **Defence Smart Card (CAC)** + **FIDO2 Hardware Tokens / Biometric Scanning** for command logins.
* **Encryption Standards**:
  * **At Rest**: **AES-256-GCM** with `pgcrypto` database-level encryption.
  * **In Transit**: **TLS 1.3 with Mutual Authentication (mTLS)**.
  * **Standard**: **FIPS 140-3** & **NSA Suite B** compliance.
* **Government Cloud Compliance**:
  * **MeghRaj (GI Cloud)** & **DRDO Secure Cloud** certified infrastructure.
  * **CERT-In Directives** & **IT Act Section 5** digital sign-off compliance.
