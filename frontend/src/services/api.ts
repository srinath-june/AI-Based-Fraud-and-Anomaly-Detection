import {
  Transaction,
  PaginatedTransactions,
  AnalyticsSummary,
  ModelEvaluationMetrics,
  AnomalyScoreResult,
  TransactionCreatePayload,
  ScatterPoint,
} from "../types/transaction";

const API_BASE = "http://localhost:8000/api";

export async function fetchTransactions(params: {
  page?: number;
  page_size?: number;
  search?: string;
  risk_level?: string;
  status?: string;
  merchant_category?: string;
  min_amount?: number;
  max_amount?: number;
  sort_by?: string;
  sort_desc?: boolean;
}): Promise<PaginatedTransactions> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.search) query.append("search", params.search);
  if (params.risk_level && params.risk_level !== "ALL") query.append("risk_level", params.risk_level);
  if (params.status && params.status !== "ALL") query.append("status", params.status);
  if (params.merchant_category && params.merchant_category !== "ALL") query.append("merchant_category", params.merchant_category);
  if (params.min_amount !== undefined && params.min_amount !== null) query.append("min_amount", params.min_amount.toString());
  if (params.max_amount !== undefined && params.max_amount !== null) query.append("max_amount", params.max_amount.toString());
  if (params.sort_by) query.append("sort_by", params.sort_by);
  if (params.sort_desc !== undefined) query.append("sort_desc", params.sort_desc.toString());

  const res = await fetch(`${API_BASE}/transactions?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function fetchTransaction(id: string): Promise<Transaction> {
  const res = await fetch(`${API_BASE}/transactions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch transaction details");
  return res.json();
}

export async function analyzeTransactionLive(payload: TransactionCreatePayload): Promise<AnomalyScoreResult> {
  const res = await fetch(`${API_BASE}/transactions/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to analyze transaction");
  return res.json();
}

export async function reviewTransaction(
  id: string,
  review: { status: string; reviewed_by?: string; review_notes?: string }
): Promise<Transaction> {
  const res = await fetch(`${API_BASE}/transactions/${id}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error("Failed to update transaction review");
  return res.json();
}

export async function simulateStreamTransaction(fraudBias: boolean = false): Promise<Transaction> {
  const res = await fetch(`${API_BASE}/transactions/simulate-stream?fraud_bias=${fraudBias}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to simulate stream event");
  return res.json();
}

export async function resetDemoDatabase(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/transactions/reset-demo`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to reset database");
  return res.json();
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const res = await fetch(`${API_BASE}/analytics/summary`);
  if (!res.ok) throw new Error("Failed to fetch analytics summary");
  return res.json();
}

export async function fetchRiskMatrix(): Promise<{ points: ScatterPoint[] }> {
  const res = await fetch(`${API_BASE}/analytics/risk-matrix`);
  if (!res.ok) throw new Error("Failed to fetch risk matrix points");
  return res.json();
}

export async function fetchModelEvaluation(): Promise<ModelEvaluationMetrics> {
  const res = await fetch(`${API_BASE}/evaluation/metrics`);
  if (!res.ok) throw new Error("Failed to fetch model evaluation metrics");
  return res.json();
}

export async function retrainModel(): Promise<ModelEvaluationMetrics> {
  const res = await fetch(`${API_BASE}/evaluation/retrain`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to trigger model retraining");
  return res.json();
}
