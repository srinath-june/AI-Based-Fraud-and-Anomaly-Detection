import React, { useState } from "react";
import { TransactionCreatePayload, AnomalyScoreResult } from "../types/transaction";
import { analyzeTransactionLive } from "../services/api";
import { Play, Sparkles, ShieldAlert, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

export const SingleTransactionTester: React.FC = () => {
  const [form, setForm] = useState<TransactionCreatePayload>({
    account_id: "ACC-1001",
    customer_name: "Sarah Jenkins",
    amount: 3450.0,
    currency: "USD",
    merchant: "Rolex Boutique New York",
    merchant_category: "Luxury Goods",
    location_country: "USA",
    location_city: "New York",
    device_type: "Desktop",
    ip_address: "185.220.101.5",
    channel: "Online",
    card_present: false,
    distance_from_home_km: 45.0,
    velocity_24h: 3,
    avg_amount_past_30d: 65.0,
    is_foreign: false,
  });

  const [result, setResult] = useState<AnomalyScoreResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTest = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeTransactionLive(form);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyPreset = (presetName: string) => {
    if (presetName === "safe_coffee") {
      setForm({
        account_id: "ACC-1002",
        customer_name: "Michael Chang",
        amount: 8.5,
        currency: "USD",
        merchant: "Starbucks Coffee",
        merchant_category: "Dining",
        location_country: "USA",
        location_city: "New York",
        device_type: "Mobile",
        ip_address: "72.229.28.18",
        channel: "In-Store",
        card_present: true,
        distance_from_home_km: 2.1,
        velocity_24h: 1,
        avg_amount_past_30d: 45.0,
        is_foreign: false,
      });
    } else if (presetName === "crypto_bustout") {
      setForm({
        account_id: "ACC-1005",
        customer_name: "David Kim",
        amount: 6200.0,
        currency: "USD",
        merchant: "Binance Global OTC",
        merchant_category: "Crypto",
        location_country: "USA",
        location_city: "Chicago",
        device_type: "Desktop",
        ip_address: "194.26.29.112",
        channel: "Online",
        card_present: false,
        distance_from_home_km: 650.0,
        velocity_24h: 7,
        avg_amount_past_30d: 85.0,
        is_foreign: false,
      });
    } else if (presetName === "foreign_wire") {
      setForm({
        account_id: "ACC-1009",
        customer_name: "Robert Chen",
        amount: 14500.0,
        currency: "USD",
        merchant: "Moscow Clearing Wire",
        merchant_category: "Retail",
        location_country: "Russia",
        location_city: "Moscow",
        device_type: "Desktop",
        ip_address: "95.173.136.2",
        channel: "Wire Transfer",
        card_present: false,
        distance_from_home_km: 7500.0,
        velocity_24h: 2,
        avg_amount_past_30d: 120.0,
        is_foreign: true,
      });
    } else if (presetName === "velocity_attack") {
      setForm({
        account_id: "ACC-1014",
        customer_name: "Lucas Miller",
        amount: 450.0,
        currency: "USD",
        merchant: "Digital Gift Cards Inc",
        merchant_category: "Digital Goods",
        location_country: "USA",
        location_city: "Seattle",
        device_type: "Mobile",
        ip_address: "104.28.19.4",
        channel: "Online",
        card_present: false,
        distance_from_home_km: 15.0,
        velocity_24h: 12,
        avg_amount_past_30d: 50.0,
        is_foreign: false,
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header & Preset Shortcuts */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} color="#38bdf8" /> Interactive AI Fraud Simulation Sandbox
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Fine-tune transaction telemetry parameters to test how the ML ensemble scores anomalies in real time.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => applyPreset("safe_coffee")} className="btn-secondary" style={{ fontSize: "0.75rem" }}>
              Normal $8.50 Coffee
            </button>
            <button onClick={() => applyPreset("crypto_bustout")} className="btn-secondary" style={{ fontSize: "0.75rem", color: "#fbbf24" }}>
              $6.2k Crypto Anomaly
            </button>
            <button onClick={() => applyPreset("foreign_wire")} className="btn-secondary" style={{ fontSize: "0.75rem", color: "#f87171" }}>
              $14.5k Russia Wire
            </button>
            <button onClick={() => applyPreset("velocity_attack")} className="btn-secondary" style={{ fontSize: "0.75rem", color: "#f97316" }}>
              12-Txn Velocity Spree
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "20px" }}>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Customer Name
            </label>
            <input
              type="text"
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", background: "rgba(13, 21, 39, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "white" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Transaction Amount ($)
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              style={{ width: "100%", padding: "8px 12px", background: "rgba(13, 21, 39, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "white" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Customer 30-Day Avg ($)
            </label>
            <input
              type="number"
              value={form.avg_amount_past_30d}
              onChange={(e) => setForm({ ...form, avg_amount_past_30d: parseFloat(e.target.value) || 1 })}
              style={{ width: "100%", padding: "8px 12px", background: "rgba(13, 21, 39, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "white" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Merchant Category
            </label>
            <select
              value={form.merchant_category}
              onChange={(e) => setForm({ ...form, merchant_category: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", background: "rgba(13, 21, 39, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "white" }}
            >
              {["Retail", "Electronics", "Travel", "Dining", "Groceries", "Gambling", "Crypto", "Luxury Goods", "Entertainment", "Digital Goods"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Channel
            </label>
            <select
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", background: "rgba(13, 21, 39, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "white" }}
            >
              {["Online", "In-Store", "Wire Transfer", "ATM", "Mobile App"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Velocity in Last 24h
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={form.velocity_24h}
              onChange={(e) => setForm({ ...form, velocity_24h: parseInt(e.target.value) || 1 })}
              style={{ width: "100%", padding: "8px 12px", background: "rgba(13, 21, 39, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "white" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Distance from Home (km)
            </label>
            <input
              type="number"
              value={form.distance_from_home_km}
              onChange={(e) => setForm({ ...form, distance_from_home_km: parseFloat(e.target.value) || 0 })}
              style={{ width: "100%", padding: "8px 12px", background: "rgba(13, 21, 39, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "white" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Foreign / Cross-Border?
            </label>
            <select
              value={form.is_foreign ? "true" : "false"}
              onChange={(e) => setForm({ ...form, is_foreign: e.target.value === "true" })}
              style={{ width: "100%", padding: "8px 12px", background: "rgba(13, 21, 39, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "white" }}
            >
              <option value="false">Domestic (USA)</option>
              <option value="true">Cross-Border / Foreign</option>
            </select>
          </div>
        </div>

        <button onClick={handleTest} disabled={isAnalyzing} className="btn-primary" style={{ padding: "10px 20px" }}>
          <Play size={16} fill="white" />
          <span>{isAnalyzing ? "Computing ML Anomaly Inference..." : "Evaluate Transaction in ML Engine"}</span>
        </button>
      </div>

      {/* Evaluation Results Card */}
      {result && (
        <div
          className="glass-card"
          style={{
            padding: "24px",
            border: `1px solid ${
              result.risk_level === "CRITICAL"
                ? "#ef4444"
                : result.risk_level === "HIGH"
                ? "#f97316"
                : result.risk_level === "MEDIUM"
                ? "#f59e0b"
                : "#10b981"
            }`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ANOMALY DETECTION RESULT</span>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                Risk Tier: <span style={{ color: result.risk_level === "CRITICAL" || result.risk_level === "HIGH" ? "#f87171" : "#34d399" }}>{result.risk_level}</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#38bdf8" }}>
                {result.anomaly_score.toFixed(1)} <span style={{ fontSize: "1rem", color: "var(--text-dim)" }}>/ 100</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                Classification: {result.is_fraud_predicted ? "FLAGGED AS SUSPICIOUS" : "NORMAL ACTIVITY"}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "8px" }}>
              Explainable AI (XAI) Risk Factors Detected:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {result.risk_factors.map((rf, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255, 255, 255, 0.04)",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    borderLeft: "3px solid #38bdf8",
                  }}
                >
                  {rf}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
