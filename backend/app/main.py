from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.database import SessionLocal
from app.services.transaction_service import init_database_and_seed
from app.routers import transactions_router, analytics_router, evaluation_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure database initialized and seeded
    db = SessionLocal()
    try:
        init_database_and_seed(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="AI-Based Fraud & Anomaly Detection API",
    description="Intelligent financial transaction anomaly scoring, pattern detection, and ML evaluation engine.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(transactions_router)
app.include_router(analytics_router)
app.include_router(evaluation_router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Fraud and Anomaly Detection Engine",
        "version": "1.0.0",
        "engine": "FastAPI + Scikit-Learn Ensemble",
    }
