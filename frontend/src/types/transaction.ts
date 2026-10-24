export interface Transaction {
  id: string;
  timestamp: string;
  account_id: string;
  customer_name: string;
  amount: number;
  currency: string;
  merchant: string;
  merchant_category: string;
  location_country: string;
  location_city: string;
  device_type: string;
  ip_address: string;
  channel: string;
  card_present: boolean;
  distance_from_home_km: number;
  velocity_24h: number;
  avg_amount_past_30d: number;
  amount_ratio_to_avg: number;
  hour_of_day: number;
  day_of_week: number;
  is_weekend: boolean;
  is_foreign: boolean;
  anomaly_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  is_fraud_predicted: boolean;
  ground_truth_fraud?: boolean | null;
  status: "PENDING" | "FLAGGED" | "APPROVED" | "REJECTED" | "WHITELISTED";
  risk_factors: string[];
  reviewed_by?: string | null;
  review_notes?: string | null;
  reviewed_at?: string | null;
}

export interface TransactionCreatePayload {
  account_id: string;
  customer_name: string;
  amount: number;
  currency?: string;
  merchant: string;
  merchant_category: string;
  location_country: string;
  location_city: string;
  device_type: string;
  ip_address?: string;
  channel: string;
  card_present: boolean;
  distance_from_home_km: number;
  velocity_24h: number;
  avg_amount_past_30d: number;
  is_foreign: boolean;
}

export interface AnomalyScoreResult {
  anomaly_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  is_fraud_predicted: boolean;
  risk_factors: string[];
  confidence: number;
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AnalyticsSummary {
  total_transactions: number;
  total_amount: number;
  flagged_count: number;
  flagged_amount: number;
  fraud_rate_percentage: number;
  avg_anomaly_score: number;
  risk_distribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
    [key: string]: number;
  };
  status_distribution: {
    [key: string]: number;
  };
  category_fraud_breakdown: {
    category: string;
    total_transactions: number;
    flagged_transactions: number;
    total_volume: number;
    fraud_rate: number;
  }[];
  time_series_trends: {
    date: string;
    total_count: number;
    fraud_count: number;
    total_volume: number;
    fraud_volume: number;
    fraud_rate: number;
  }[];
}

export interface ConfusionMatrix {
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
}

export interface ModelEvaluationMetrics {
  model_name: string;
  trained_at: string;
  samples_count: number;
  fraud_samples_count: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  confusion_matrix: ConfusionMatrix;
  feature_importances: {
    feature: string;
    importance: number;
  }[];
  roc_curve_points: {
    x: number;
    y: number;
  }[];
  score_threshold: number;
}

export interface ScatterPoint {
  id: string;
  amount: number;
  anomaly_score: number;
  risk_level: string;
  merchant: string;
  category: string;
  status: string;
  is_fraud: boolean;
  customer: string;
}
