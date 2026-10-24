import random
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionReviewUpdate,
    TransactionFilterParams,
    PaginatedTransactionsResponse,
    AnomalyScoreResult,
)
from app.services import transaction_service
from app.services.ml_detector import detector
from app.services.data_generator import generate_synthetic_transactions

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.get("", response_model=PaginatedTransactionsResponse)
def list_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    search: Optional[str] = None,
    risk_level: Optional[str] = None,
    status: Optional[str] = None,
    merchant_category: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    sort_by: Optional[str] = "timestamp",
    sort_desc: Optional[bool] = True,
    db: Session = Depends(get_db),
):
    """Retrieve filtered, paginated transactions with anomaly scores and risk metrics."""
    params = TransactionFilterParams(
        page=page,
        page_size=page_size,
        search=search,
        risk_level=risk_level,
        status=status,
        merchant_category=merchant_category,
        min_amount=min_amount,
        max_amount=max_amount,
        sort_by=sort_by,
        sort_desc=sort_desc,
    )
    return transaction_service.get_transactions(db, params)

@router.get("/{txn_id}", response_model=TransactionResponse)
def get_transaction(txn_id: str, db: Session = Depends(get_db)):
    """Fetch full transaction details and explainable AI risk factors."""
    txn = transaction_service.get_transaction_by_id(db, txn_id)
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return txn

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(txn_in: TransactionCreate, db: Session = Depends(get_db)):
    """Ingest a new transaction, run AI anomaly detector, and store result."""
    return transaction_service.create_and_score_transaction(db, txn_in)

@router.post("/analyze", response_model=AnomalyScoreResult)
def analyze_transaction_live(txn_in: TransactionCreate):
    """Real-time scoring simulation without persisting to database."""
    item_dict = txn_in.model_dump()
    ts = txn_in.timestamp or datetime.utcnow()
    item_dict["timestamp"] = ts
    item_dict["hour_of_day"] = ts.hour
    item_dict["day_of_week"] = ts.weekday()
    item_dict["is_weekend"] = (ts.weekday() >= 5)
    item_dict["amount_ratio_to_avg"] = round(txn_in.amount / max(txn_in.avg_amount_past_30d, 1.0), 2)
    
    res = detector.predict_one(item_dict)
    return AnomalyScoreResult(**res)

@router.patch("/{txn_id}/review", response_model=TransactionResponse)
def review_transaction(
    txn_id: str,
    review: TransactionReviewUpdate,
    db: Session = Depends(get_db)
):
    """Update analyst review status (Approved, Flagged, Whitelisted, Rejected) and notes."""
    updated = transaction_service.update_transaction_review(db, txn_id, review)
    if not updated:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated

@router.post("/simulate-stream", response_model=TransactionResponse)
def simulate_stream_transaction(
    fraud_bias: bool = Query(False, description="Force high probability of fraud for testing"),
    db: Session = Depends(get_db)
):
    """Simulates a live incoming transaction stream event and scores it in real-time."""
    fraud_ratio = 0.85 if fraud_bias else 0.15
    raw_txns = generate_synthetic_transactions(count=1, fraud_ratio=fraud_ratio)
    raw = raw_txns[0]
    raw["timestamp"] = datetime.utcnow()

    txn_in = TransactionCreate(**raw)
    return transaction_service.create_and_score_transaction(db, txn_in)

@router.post("/reset-demo")
def reset_demo_database(db: Session = Depends(get_db)):
    """Reset database and re-seed 750 sample transactions with fresh model training."""
    from app.models.transaction import Transaction
    db.query(Transaction).delete()
    db.commit()
    transaction_service.init_database_and_seed(db)
    return {"status": "success", "message": "Database reset and re-seeded successfully."}
