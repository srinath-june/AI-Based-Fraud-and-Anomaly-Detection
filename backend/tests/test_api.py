import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "FastAPI" in data["engine"]

def test_analytics_summary():
    response = client.get("/api/analytics/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_transactions" in data
    assert data["total_transactions"] > 0
    assert "risk_distribution" in data
    assert "LOW" in data["risk_distribution"]

def test_transactions_listing_and_filtering():
    # Listing with default params
    response = client.get("/api/transactions?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) == 10
    assert data["total"] > 0

    # Risk level filtering
    filter_resp = client.get("/api/transactions?risk_level=CRITICAL")
    assert filter_resp.status_code == 200
    crit_items = filter_resp.json()["items"]
    for item in crit_items:
        assert item["risk_level"] == "CRITICAL"

def test_analyze_transaction_live():
    payload = {
        "account_id": "ACC-TEST-01",
        "customer_name": "Test Customer",
        "amount": 9500.0,
        "currency": "USD",
        "merchant": "Rolex Boutique",
        "merchant_category": "Luxury Goods",
        "location_country": "Russia",
        "location_city": "Moscow",
        "device_type": "Desktop",
        "ip_address": "95.173.136.2",
        "channel": "Online",
        "card_present": False,
        "distance_from_home_km": 7500.0,
        "velocity_24h": 8,
        "avg_amount_past_30d": 60.0,
        "is_foreign": True
    }
    response = client.post("/api/transactions/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["anomaly_score"] >= 70.0
    assert data["is_fraud_predicted"] is True
    assert len(data["risk_factors"]) > 0

def test_analyst_review_workflow():
    list_resp = client.get("/api/transactions?page=1&page_size=1")
    first_txn = list_resp.json()["items"][0]
    txn_id = first_txn["id"]

    review_payload = {
        "status": "APPROVED",
        "reviewed_by": "Test Analyst",
        "review_notes": "Verified with cardholder over secure phone channel."
    }
    patch_resp = client.patch(f"/api/transactions/{txn_id}/review", json=review_payload)
    assert patch_resp.status_code == 200
    updated = patch_resp.json()
    assert updated["status"] == "APPROVED"
    assert updated["reviewed_by"] == "Test Analyst"
    assert "Verified with cardholder" in updated["review_notes"]

def test_model_evaluation_metrics():
    response = client.get("/api/evaluation/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["accuracy"] > 0.80
    assert data["roc_auc"] > 0.85
    assert "confusion_matrix" in data
    assert "feature_importances" in data
    assert len(data["feature_importances"]) > 0

def test_risk_matrix_scatter():
    response = client.get("/api/analytics/risk-matrix")
    assert response.status_code == 200
    data = response.json()
    assert "points" in data
    assert len(data["points"]) > 0
    first_pt = data["points"][0]
    assert "amount" in first_pt
    assert "anomaly_score" in first_pt
    assert "risk_level" in first_pt
