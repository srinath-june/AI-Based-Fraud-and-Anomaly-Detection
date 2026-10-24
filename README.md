# AI-Based Fraud and Anomaly Detection Platform

A full-stack, enterprise-grade machine learning system designed to analyze financial transaction streams, identify anomalous patterns, calculate calibrated fraud risk scores (0–100), and empower security analysts with explainable AI (XAI) insights and interactive charts.

---

## 🚀 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Machine Learning** | **Scikit-learn**, **Pandas**, **NumPy**, Isolation Forest (Unsupervised), Random Forest (Supervised Ensemble) |
| **Backend API** | **FastAPI**, **SQLAlchemy ORM**, **SQLite / PostgreSQL**, Uvicorn, Pydantic V2 |
| **Frontend UI** | **React 18**, **TypeScript**, **Vite**, **Lucide Icons**, SVG Interactive Charts, Modern Cyber/Fintech Dark UI |
| **Data & Storage** | **SQL** (Transactions & Audit Logs), Joblib (Serialized Model Artifacts) |

---

## 🧠 Machine Learning & Anomaly Detection Architecture

The platform utilizes a **hybrid ensemble architecture** combining unsupervised multi-dimensional anomaly detection with supervised classification:

1. **Unsupervised Anomaly Detection (`IsolationForest`)**:
   - Isolates anomalous transactions based on structural distance across multidimensional feature space without relying solely on labels.
   - Detects novel, zero-day fraud typologies.
2. **Supervised Classification (`RandomForestClassifier`)**:
   - Calibrated ensemble with balanced class weighting to discriminate complex fraud vectors from legitimate behavior.
3. **Calibrated Anomaly Scoring (0.0 to 100.0)**:
   - Combines normalized anomaly distance and fraud probabilities:
     $$\text{Score} = 0.40 \times \text{Score}_{\text{IsolationForest}} + 0.60 \times \text{Prob}_{\text{RandomForest}}$$
   - **Risk Tiers**:
     - 🟢 **LOW RISK (0 – 39.9)**: Normal baseline activity.
     - 🟡 **MEDIUM RISK (40.0 – 69.9)**: Elevated parameters; monitor.
     - 🟠 **HIGH RISK (70.0 – 84.9)**: Suspicious activity; analyst review recommended.
     - 🔴 **CRITICAL RISK (85.0 – 100.0)**: Extreme fraud vector; automated block or immediate freeze.
4. **Explainable AI (XAI) Attribution**:
   - Compares individual transaction features against historical 30-day baselines, transaction velocity, geographic proximity, and category vectors to output human-readable risk drivers (e.g., *“Unusually high amount ($3,450.00), 8.4x higher than 30-day baseline”*, *“Geographic mismatch: 7,500 km from residence”*).

---

## 📊 Key Features

- **Dynamic Anomaly Scores & Risk Badges**: Every transaction is scored with fine-grained risk ratings and explainability notes.
- **Interactive Visualizations**:
  - **14-Day Volume & Anomaly Trends**: Multi-series SVG area/bar chart with hover telemetry.
  - **2D Risk Matrix Scatter Cluster**: Interactive scatter plot comparing Transaction Amount vs. Anomaly Score with color-coded risk zones and node click inspection.
  - **Merchant Category Risk Bar Chart**: Fraud rate percentage rankings across industry sectors (Crypto, Luxury Goods, Digital Goods, Retail, etc.).
  - **Risk Distribution Breakdown**: Real-time distribution across Low, Medium, High, and Critical risk tiers.
- **Advanced Transaction Filtering**:
  - Free-text search (ID, Customer Name, Merchant, Account ID, City).
  - Risk tier filter (All, Low, Medium, High, Critical).
  - Review status filter (Flagged, Approved, Pending, Rejected, Whitelisted).
  - Merchant category dropdown.
  - Min / Max transaction amount filters.
- **Analyst Investigation Cockpit**:
  - Deep-dive transaction modal with anomaly gauges, behavioral comparisons, and full XAI reasoning.
  - One-click workflow decisions: **Approve (Legitimate)**, **Confirm Fraud (Block)**, **Whitelist Customer**, and add investigation notes.
- **Live Stream Simulation**:
  - Toggle live transaction feed that generates, scores, and streams realistic incoming transactions in real time.
- **Interactive AI Simulator & Sandbox**:
  - Test arbitrary transaction parameters (Amount, 30-day baseline, Velocity, Distance, Merchant, Channel) and immediately view real-time ML score inferences.
  - Includes quick-test presets (e.g., *Normal Coffee*, *Crypto Bust-out*, *Russia Wire Transfer*, *Velocity Attack*).
- **Model Evaluation Suite**:
  - Real-time ML metrics: **ROC-AUC (96%+)**, **Precision**, **Recall**, **F1-Score**, and **Accuracy**.
  - **ROC Curve Visualizer** with True Positive Rate vs. False Positive Rate curve.
  - **2x2 Confusion Matrix** displaying True Positives, False Positives, True Negatives, and False Negatives.
  - **Top Feature Importances** (Gini index rankings).
  - One-click **Retrain AI Engine** button to fit fresh models on current database records.

---

## 📁 Project Structure

```
AI-Based Fraud and Anomaly Detection/
├── backend/
│   ├── app/
│   │   ├── config.py             # Settings, DB URLs, risk score thresholds
│   │   ├── database.py           # SQLAlchemy session engine
│   │   ├── main.py               # FastAPI application with CORS and lifespan
│   │   ├── models/
│   │   │   └── transaction.py    # Transaction database model with indexing
│   │   ├── schemas/
│   │   │   └── transaction.py    # Pydantic schemas for requests, responses & metrics
│   │   ├── services/
│   │   │   ├── data_generator.py # Realistic synthetic transactions generator
│   │   │   ├── ml_detector.py    # Isolation Forest + Random Forest dual ML detector
│   │   │   └── transaction_service.py # Business logic, filtering, seeding & metrics
│   │   └── routers/
│   │       ├── transactions.py   # Transaction listing, scoring, streaming, reviews
│   │       ├── analytics.py      # Summary metrics & 2D scatter matrix
│   │       └── evaluation.py     # ROC-AUC, confusion matrix & retrain trigger
│   ├── data/                     # SQLite database & serialized .joblib models
│   ├── tests/
│   │   └── test_api.py           # Pytest integration test suite
│   ├── requirements.txt
│   └── run.py                    # Backend server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── TransactionTable.tsx
│   │   │   ├── TransactionDetailModal.tsx
│   │   │   ├── SingleTransactionTester.tsx
│   │   │   └── charts/
│   │   │       └── InteractiveCharts.tsx # Trend, Category, Donut, Scatter & ROC charts
│   │   ├── services/
│   │   │   └── api.ts            # API client
│   │   ├── types/
│   │   │   └── transaction.ts    # TypeScript definitions
│   │   ├── App.tsx               # Main application container & tab router
│   │   ├── index.css             # Cyber/Fintech dark UI design system
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.app.json
│   └── vite.config.ts
├── start.bat                     # Windows 1-click launcher
├── start.sh                      # Linux/macOS launcher
└── README.md
```

---

## ⚡ Quick Start

### 1. One-Click Launch (Windows)
Double-click `start.bat` or run:
```cmd
start.bat
```
This automatically boots:
- FastAPI Backend on: [http://localhost:8000](http://localhost:8000) (Interactive Swagger Docs at `http://localhost:8000/docs`)
- React Vite Frontend on: [http://localhost:5173](http://localhost:5173)

---

### 2. Manual Startup

#### Backend
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
*(On first run, the backend automatically generates 750 realistic transactions, fits the ML models, computes anomaly scores, and seeds the database!)*

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Automated Tests

Run the backend integration test suite:
```bash
cd backend
python -m pytest tests/test_api.py -v
```

All 7 test suites verify:
- API health and OpenAPI specification
- Analytics KPI calculations
- Transaction multi-filtering and pagination
- Real-time ML anomaly inference
- Analyst review status transitions and notes
- Model evaluation metrics, ROC curve and confusion matrix
- 2D Risk scatter matrix generation
