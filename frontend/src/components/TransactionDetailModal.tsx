import React, { useState } from "react";
import { Transaction } from "../types/transaction";
import {
  X,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  Clock,
  MapPin,
  CreditCard,
  Smartphone,
  Send,
} from "lucide-react";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onReview: (
    id: string,
    status: "APPROVED" | "FLAGGED" | "WHITELISTED" | "REJECTED",
    notes: string
  ) => Promise<void>;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onReview,
}) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!transaction) return null;

  const handleAction = async (status: "APPROVED" | "FLAGGED" | "WHITELISTED" | "REJECTED") => {
    setIsSubmitting(true);
    try {
      await onReview(transaction.id, status, notes);
      setNotes("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#ef4444";
    if (score >= 70) return "#f97316";
    if (score >= 40) return "#f59e0b";
    return "#10b981";
  };

  const scoreColor = getScoreColor(transaction.anomaly_score);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#0c1527",
          border: "1px solid var(--border-highlight)",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.8)",
          padding: "28px",
          borderRadius: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "#38bdf8" }}>
                {transaction.id}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: `${scoreColor}22`,
                  color: scoreColor,
                  border: `1px solid ${scoreColor}55`,
                }}
              >
                {transaction.risk_level} RISK ({transaction.anomaly_score.toFixed(1)})
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Recorded on {new Date(transaction.timestamp).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Anomaly Score Gauge Card */}
        <div
          style={{
            background: "rgba(17, 28, 52, 0.7)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "12px",
            padding: "18px 20px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)" }}>
              AI Anomaly & Fraud Probability Meter
            </span>
            <span style={{ fontSize: "1.2rem", fontWeight: 800, color: scoreColor }}>
              {transaction.anomaly_score.toFixed(1)} / 100
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              background: "rgba(30, 47, 80, 0.8)",
              borderRadius: "5px",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: `${transaction.anomaly_score}%`,
                height: "100%",
                background: `linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)`,
                borderRadius: "5px",
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-dim)" }}>
            <span>0 (Normal)</span>
            <span>40 (Medium)</span>
            <span>70 (High)</span>
            <span>85+ (Critical)</span>
          </div>
        </div>

        {/* 2-Column Details: Transaction Info & Customer Profile */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "20px" }}>
          <div style={{ background: "rgba(17, 28, 52, 0.5)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "16px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#38bdf8", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <CreditCard size={15} /> TRANSACTION ATTRIBUTES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Amount:</span>
                <span style={{ fontWeight: 700 }}>${transaction.amount.toFixed(2)} {transaction.currency}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Merchant:</span>
                <span style={{ fontWeight: 600 }}>{transaction.merchant}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Category:</span>
                <span>{transaction.merchant_category}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Channel:</span>
                <span>{transaction.channel} ({transaction.card_present ? "Card Present" : "Card Not Present"})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Current Status:</span>
                <span style={{ fontWeight: 700 }}>{transaction.status}</span>
              </div>
            </div>
          </div>

          <div style={{ background: "rgba(17, 28, 52, 0.5)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "16px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#38bdf8", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <User size={15} /> CUSTOMER & CONTEXT PROFILE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Customer:</span>
                <span style={{ fontWeight: 600 }}>{transaction.customer_name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Account ID:</span>
                <span style={{ fontFamily: "monospace" }}>{transaction.account_id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>30-Day Avg Amount:</span>
                <span>${transaction.avg_amount_past_30d.toFixed(2)} ({transaction.amount_ratio_to_avg.toFixed(1)}x ratio)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Velocity (24h):</span>
                <span>{transaction.velocity_24h} transactions</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Location / Origin:</span>
                <span>{transaction.location_city}, {transaction.location_country} ({transaction.distance_from_home_km.toFixed(0)} km)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Explainable AI Risk Factors */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertTriangle size={16} color="#fbbf24" />
            Explainable AI (XAI) Risk Factors & Anomaly Contributions
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {transaction.risk_factors.map((factor, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(245, 158, 11, 0.08)",
                  borderLeft: "3px solid #f59e0b",
                  padding: "10px 14px",
                  borderRadius: "4px",
                  fontSize: "0.82rem",
                  color: "#fef3c7",
                }}
              >
                {factor}
              </div>
            ))}
          </div>
        </div>

        {/* Review Notes History (if reviewed) */}
        {transaction.reviewed_at && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(56, 189, 248, 0.08)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "0.8rem",
            }}
          >
            <div style={{ fontWeight: 600, color: "#38bdf8", marginBottom: "4px" }}>
              Analyst Audit Log: Reviewed by {transaction.reviewed_by} on {new Date(transaction.reviewed_at).toLocaleString()}
            </div>
            <div style={{ color: "var(--text-muted)" }}>
              Note: {transaction.review_notes || "No notes provided."}
            </div>
          </div>
        )}

        {/* Analyst Action Controls */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>Analyst Investigation Decision</div>

          <textarea
            placeholder="Add analyst review note or investigation findings..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "rgba(13, 21, 39, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              outline: "none",
              resize: "vertical",
            }}
          />

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button
              onClick={() => handleAction("APPROVED")}
              disabled={isSubmitting}
              className="btn-secondary"
              style={{ color: "#34d399", borderColor: "rgba(16, 185, 129, 0.4)" }}
            >
              <CheckCircle size={15} />
              <span>Approve (Legitimate)</span>
            </button>

            <button
              onClick={() => handleAction("WHITELISTED")}
              disabled={isSubmitting}
              className="btn-secondary"
              style={{ color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.4)" }}
            >
              <span>Whitelist Customer</span>
            </button>

            <button
              onClick={() => handleAction("FLAGGED")}
              disabled={isSubmitting}
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                color: "#ffffff",
                border: "1px solid #ef4444",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: 600,
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <ShieldAlert size={15} />
              <span>Confirm Fraud (Block)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
