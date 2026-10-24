from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import AnalyticsSummary
from app.services import transaction_service

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    """Overview KPI metrics, risk tier distributions, category breakdowns, and time-series trends."""
    return transaction_service.get_analytics_summary(db)

@router.get("/risk-matrix")
def get_risk_matrix_scatter(db: Session = Depends(get_db)):
    """Fetch sample transactions for interactive Amount vs Anomaly Score risk scatter plot."""
    # Return latest 250 transactions for snappy chart rendering
    txns = db.query(
        Transaction.id,
        Transaction.amount,
        Transaction.anomaly_score,
        Transaction.risk_level,
        Transaction.merchant,
        Transaction.merchant_category,
        Transaction.status,
        Transaction.is_fraud_predicted,
        Transaction.customer_name
    ).order_by(Transaction.timestamp.desc()).limit(250).all()

    points = []
    for r in txns:
        points.append({
            "id": r.id,
            "amount": round(r.amount, 2),
            "anomaly_score": round(r.anomaly_score, 1),
            "risk_level": r.risk_level,
            "merchant": r.merchant,
            "category": r.merchant_category,
            "status": r.status,
            "is_fraud": r.is_fraud_predicted,
            "customer": r.customer_name,
        })
    return {"points": points}
