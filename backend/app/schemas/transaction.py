from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class TransactionBase(BaseModel):
    account_id: str
    customer_name: str
    amount: float = Field(..., gt=0, description="Transaction amount in currency units")
    currency: str = "USD"
    merchant: str
    merchant_category: str
    location_country: str
    location_city: str
    device_type: str = "Mobile"
    ip_address: str = "127.0.0.1"
    channel: str = "Online"
    card_present: bool = True
    
    distance_from_home_km: float = 0.0
    velocity_24h: int = 1
    avg_amount_past_30d: float = 50.0
    is_foreign: bool = False

class TransactionCreate(TransactionBase):
    id: Optional[str] = None
    timestamp: Optional[datetime] = None
    ground_truth_fraud: Optional[bool] = None

class TransactionReviewUpdate(BaseModel):
    status: str = Field(..., description="PENDING, FLAGGED, APPROVED, REJECTED, WHITELISTED")
    reviewed_by: Optional[str] = "Analyst"
    review_notes: Optional[str] = None

class RiskFactor(BaseModel):
    feature: str
    impact: str  # High, Medium, Low
    description: str

class AnomalyScoreResult(BaseModel):
    anomaly_score: float = Field(..., description="Normalized score 0.0 to 100.0")
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    is_fraud_predicted: bool
    risk_factors: List[str]
    confidence: float

class TransactionResponse(TransactionBase):
    id: str
    timestamp: datetime
    amount_ratio_to_avg: float
    hour_of_day: int
    day_of_week: int
    is_weekend: bool
    anomaly_score: float
    risk_level: str
    is_fraud_predicted: bool
    ground_truth_fraud: Optional[bool] = None
    status: str
    risk_factors: List[str]
    reviewed_by: Optional[str] = None
    review_notes: Optional[str] = None
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TransactionFilterParams(BaseModel):
    page: int = 1
    page_size: int = 50
    search: Optional[str] = None
    risk_level: Optional[str] = None
    status: Optional[str] = None
    merchant_category: Optional[str] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    sort_by: Optional[str] = "timestamp"
    sort_desc: Optional[bool] = True

class PaginatedTransactionsResponse(BaseModel):
    items: List[TransactionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

class AnalyticsSummary(BaseModel):
    total_transactions: int
    total_amount: float
    flagged_count: int
    flagged_amount: float
    fraud_rate_percentage: float
    avg_anomaly_score: float
    risk_distribution: Dict[str, int]
    status_distribution: Dict[str, int]
    category_fraud_breakdown: List[Dict[str, Any]]
    time_series_trends: List[Dict[str, Any]]

class ConfusionMatrix(BaseModel):
    true_positives: int
    false_positives: int
    true_negatives: int
    false_negatives: int

class CurvePoint(BaseModel):
    x: float
    y: float

class ModelEvaluationMetrics(BaseModel):
    model_name: str
    trained_at: datetime
    samples_count: int
    fraud_samples_count: int
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    confusion_matrix: ConfusionMatrix
    feature_importances: List[Dict[str, Any]]
    roc_curve_points: List[CurvePoint]
    score_threshold: float
