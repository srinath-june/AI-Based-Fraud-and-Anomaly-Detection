import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR / 'fraud_detection.db'}")
MODEL_PATH = DATA_DIR / "fraud_models.joblib"

# Fraud Score Risk Thresholds (0 - 100)
SCORE_LOW_MAX = 39.9
SCORE_MEDIUM_MAX = 69.9
SCORE_HIGH_MAX = 84.9
# 85.0 - 100.0 is Critical

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*",
]
