from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, Index
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(64), primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    account_id = Column(String(64), index=True, nullable=False)
    customer_name = Column(String(128), nullable=False)
    amount = Column(Float, nullable=False, index=True)
    currency = Column(String(8), default="USD")
    merchant = Column(String(128), nullable=False, index=True)
    merchant_category = Column(String(64), nullable=False, index=True)
    location_country = Column(String(64), nullable=False)
    location_city = Column(String(64), nullable=False)
    device_type = Column(String(32), nullable=False)
    ip_address = Column(String(64), nullable=False)
    channel = Column(String(32), nullable=False)
    card_present = Column(Boolean, default=True)
    
    # Behavioral and contextual indicators
    distance_from_home_km = Column(Float, default=0.0)
    velocity_24h = Column(Integer, default=1)
    avg_amount_past_30d = Column(Float, default=50.0)
    amount_ratio_to_avg = Column(Float, default=1.0)
    hour_of_day = Column(Integer, default=12)
    day_of_week = Column(Integer, default=0)
    is_weekend = Column(Boolean, default=False)
    is_foreign = Column(Boolean, default=False)
    
    # AI / Anomaly outputs
    anomaly_score = Column(Float, nullable=False, index=True)  # 0.0 to 100.0
    risk_level = Column(String(32), nullable=False, index=True) # LOW, MEDIUM, HIGH, CRITICAL
    is_fraud_predicted = Column(Boolean, nullable=False, index=True)
    ground_truth_fraud = Column(Boolean, nullable=True) # For evaluation metrics
    status = Column(String(32), default="PENDING", index=True) # PENDING, FLAGGED, APPROVED, REJECTED, WHITELISTED
    risk_factors = Column(Text, default="[]") # JSON string list of reasons
    
    # Human Analyst Review Workflow
    reviewed_by = Column(String(64), nullable=True)
    review_notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    __table_args__ = (
        Index("ix_txn_risk_time", "risk_level", "timestamp"),
        Index("ix_txn_status_score", "status", "anomaly_score"),
    )
