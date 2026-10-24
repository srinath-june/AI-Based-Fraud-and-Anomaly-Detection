from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.transaction import ModelEvaluationMetrics
from app.services import transaction_service

router = APIRouter(prefix="/api/evaluation", tags=["Model Evaluation"])

@router.get("/metrics", response_model=ModelEvaluationMetrics)
def get_model_evaluation_metrics(db: Session = Depends(get_db)):
    """Retrieve model performance statistics: ROC-AUC, Precision, Recall, F1, Confusion Matrix, and ROC curve."""
    return transaction_service.get_model_evaluation(db)

@router.post("/retrain", response_model=ModelEvaluationMetrics)
def retrain_model_endpoint(db: Session = Depends(get_db)):
    """Trigger refitting of Isolation Forest and Random Forest on stored database transactions."""
    return transaction_service.retrain_model(db)
