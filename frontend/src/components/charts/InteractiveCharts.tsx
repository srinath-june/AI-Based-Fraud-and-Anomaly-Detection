import React, { useState } from "react";
import { ScatterPoint, ModelEvaluationMetrics } from "../../types/transaction";
import { ShieldCheck, AlertTriangle, Crosshair, BarChart2 } from "lucide-react";

/* -------------------------------------------------------------
 * 1. Time Series Volume & Fraud Trend Chart (SVG)
 * ------------------------------------------------------------- */
export const VolumeAndFraudChart: React.FC<{
  trends: {
    date: string;
    total_count: number;
    fraud_count: number;
    total_volume: number;
    fraud_volume: number;
    fraud_rate: number;
  }[];
}> = ({ trends }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!trends || trends.length === 0) {
    return <div style={{ color: "var(--text-dim)", padding: "30px", textAlign: "center" }}>No trend data recorded</div>;
  }

  const maxCount = Math.max(...trends.map((t) => t.total_count), 10);
  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 35, left: 40 };

  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const stepX = innerW / Math.max(trends.length - 1, 1);

  // Points for total transactions line
  const totalPoints = trends.map((t, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + innerH - (t.total_count / maxCount) * innerH;
    return `${x},${y}`;
  });

  // Points for fraud transactions line
  const fraudPoints = trends.map((t, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + innerH - (t.fraud_count / maxCount) * innerH;
    return `${x},${y}`;
  });

  // Area for total volume
  const areaTotalPath = `M ${padding.left},${padding.top + innerH} L ${totalPoints.join(" L ")} L ${
    padding.left + (trends.length - 1) * stepX
  },${padding.top + innerH} Z`;

  return (
    <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#38bdf8" }} />
            <span style={{ color: "var(--text-muted)" }}>Total Transactions</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#ef4444" }} />
            <span style={{ color: "var(--text-muted)" }}>Flagged Anomalies</span>
          </div>
        </div>
        {hoveredIndex !== null && (
          <div style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: 600 }}>
            {trends[hoveredIndex].date}: {trends[hoveredIndex].total_count} txns ({trends[hoveredIndex].fraud_count} flagged)
          </div>
        )}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding.top + innerH * (1 - ratio);
          return (
            <g key={idx}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(30, 47, 80, 0.6)" strokeDasharray="3 3" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                {Math.round(ratio * maxCount)}
              </text>
            </g>
          );
        })}

        {/* Total fill area */}
        <path d={areaTotalPath} fill="url(#totalGrad)" />

        {/* Total line */}
        <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={totalPoints.join(" ")} />

        {/* Fraud line */}
        <polyline fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={fraudPoints.join(" ")} />

        {/* Hover markers and interactive columns */}
        {trends.map((t, i) => {
          const x = padding.left + i * stepX;
          const yTotal = padding.top + innerH - (t.total_count / maxCount) * innerH;
          const yFraud = padding.top + innerH - (t.fraud_count / maxCount) * innerH;
          const isHovered = hoveredIndex === i;

          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} style={{ cursor: "pointer" }}>
              <rect
                x={x - stepX / 2}
                y={padding.top}
                width={stepX}
                height={innerH}
                fill={isHovered ? "rgba(56, 189, 248, 0.08)" : "transparent"}
              />
              {isHovered && (
                <line x1={x} y1={padding.top} x2={x} y2={padding.top + innerH} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
              )}
              <circle cx={x} cy={yTotal} r={isHovered ? 5 : 3.5} fill="#38bdf8" stroke="#070b13" strokeWidth="1.5" />
              <circle cx={x} cy={yFraud} r={isHovered ? 5 : 3.5} fill="#ef4444" stroke="#070b13" strokeWidth="1.5" />
              {/* X axis labels (sparse) */}
              {(i % 2 === 0 || i === trends.length - 1) && (
                <text x={x} y={height - 10} textAnchor="middle" fontSize="9" fill="#64748b">
                  {t.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. Category Fraud Breakdown Horizontal Bars
 * ------------------------------------------------------------- */
export const CategoryRiskBarChart: React.FC<{
  categories: {
    category: string;
    total_transactions: number;
    flagged_transactions: number;
    total_volume: number;
    fraud_rate: number;
  }[];
}> = ({ categories }) => {
  const sorted = [...categories].sort((a, b) => b.fraud_rate - a.fraud_rate);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {sorted.map((cat) => {
        const rate = cat.fraud_rate;
        const color =
          rate >= 40 ? "#ef4444" : rate >= 20 ? "#f97316" : rate >= 10 ? "#f59e0b" : "#10b981";

        return (
          <div key={cat.category} style={{ fontSize: "0.82rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontWeight: 600 }}>{cat.category}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                <strong style={{ color }}>{rate.toFixed(1)}%</strong> ({cat.flagged_transactions}/{cat.total_transactions} flagged)
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "4px",
                background: "rgba(30, 47, 80, 0.6)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(rate * 1.5, 100)}%`,
                  height: "100%",
                  background: color,
                  borderRadius: "4px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. Risk Distribution Donut / Progress Breakdown
 * ------------------------------------------------------------- */
export const RiskDistributionBar: React.FC<{
  distribution: { LOW: number; MEDIUM: number; HIGH: number; CRITICAL: number };
}> = ({ distribution }) => {
  const total = (distribution.LOW || 0) + (distribution.MEDIUM || 0) + (distribution.HIGH || 0) + (distribution.CRITICAL || 0) || 1;
  const pLow = ((distribution.LOW || 0) / total) * 100;
  const pMed = ((distribution.MEDIUM || 0) / total) * 100;
  const pHigh = ((distribution.HIGH || 0) / total) * 100;
  const pCrit = ((distribution.CRITICAL || 0) / total) * 100;

  return (
    <div>
      {/* Visual Multi-Segment Bar */}
      <div
        style={{
          width: "100%",
          height: "16px",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          marginBottom: "16px",
          background: "rgba(30, 47, 80, 0.4)",
        }}
      >
        <div style={{ width: `${pLow}%`, background: "#10b981" }} title={`Low: ${distribution.LOW}`} />
        <div style={{ width: `${pMed}%`, background: "#f59e0b" }} title={`Medium: ${distribution.MEDIUM}`} />
        <div style={{ width: `${pHigh}%`, background: "#f97316" }} title={`High: ${distribution.HIGH}`} />
        <div style={{ width: `${pCrit}%`, background: "#ef4444" }} title={`Critical: ${distribution.CRITICAL}`} />
      </div>

      {/* Legend Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
        <div className="glass-card" style={{ padding: "10px", borderLeft: "3px solid #10b981" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>LOW RISK (&lt;40)</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#6ee7b7" }}>{distribution.LOW || 0}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{pLow.toFixed(1)}% of total</div>
        </div>

        <div className="glass-card" style={{ padding: "10px", borderLeft: "3px solid #f59e0b" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>MEDIUM RISK (40-69)</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fde047" }}>{distribution.MEDIUM || 0}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{pMed.toFixed(1)}% of total</div>
        </div>

        <div className="glass-card" style={{ padding: "10px", borderLeft: "3px solid #f97316" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>HIGH RISK (70-84)</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fdba74" }}>{distribution.HIGH || 0}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{pHigh.toFixed(1)}% of total</div>
        </div>

        <div className="glass-card" style={{ padding: "10px", borderLeft: "3px solid #ef4444" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>CRITICAL RISK (85+)</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fca5a5" }}>{distribution.CRITICAL || 0}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{pCrit.toFixed(1)}% of total</div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 4. Interactive 2D Scatter Risk Matrix (Amount vs. Anomaly Score)
 * ------------------------------------------------------------- */
export const ScatterRiskMatrix: React.FC<{
  points: ScatterPoint[];
  onSelectPoint?: (id: string) => void;
}> = ({ points, onSelectPoint }) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);

  const width = 850;
  const height = 440;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // Max amount scale (log-scale or capped at 8000 for visibility)
  const maxAmount = 8000;

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
            <Crosshair size={18} color="#38bdf8" />
            Transaction Amount vs. AI Anomaly Score Cluster
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Unsupervised Isolation Forest + Random Forest risk score coordinates. Click any node to inspect.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "14px", fontSize: "0.75rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#10b981" }} /> Low Risk
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#f59e0b" }} /> Medium
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#f97316" }} /> High
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ef4444" }} /> Critical Anomaly
          </span>
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {/* Risk Zones Background Fill */}
          <rect x={padding.left} y={padding.top} width={innerW} height={innerH * 0.15} fill="rgba(239, 68, 68, 0.08)" />
          <rect x={padding.left} y={padding.top + innerH * 0.15} width={innerW} height={innerH * 0.15} fill="rgba(249, 115, 22, 0.05)" />
          <rect x={padding.left} y={padding.top + innerH * 0.30} width={innerW} height={innerH * 0.30} fill="rgba(245, 158, 11, 0.03)" />
          <rect x={padding.left} y={padding.top + innerH * 0.60} width={innerW} height={innerH * 0.40} fill="rgba(16, 185, 129, 0.03)" />

          {/* Grid lines - Y axis (Anomaly Score: 0 to 100) */}
          {[0, 20, 40, 60, 70, 85, 100].map((score) => {
            const y = padding.top + innerH * (1 - score / 100);
            return (
              <g key={score}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(30, 47, 80, 0.6)" strokeDasharray="3 3" />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                  {score}
                </text>
              </g>
            );
          })}

          {/* Grid lines - X axis (Amount: 0 to 8000) */}
          {[0, 1000, 2500, 5000, 8000].map((amt) => {
            const x = padding.left + (amt / maxAmount) * innerW;
            return (
              <g key={amt}>
                <line x1={x} y1={padding.top} x2={x} y2={padding.top + innerH} stroke="rgba(30, 47, 80, 0.4)" strokeDasharray="3 3" />
                <text x={x} y={height - 18} textAnchor="middle" fontSize="10" fill="#94a3b8">
                  ${amt.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Axes Titles */}
          <text x={width / 2} y={height - 4} textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
            Transaction Amount ($ USD)
          </text>
          <text
            x={-height / 2}
            y={18}
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
            fontWeight="600"
            transform="rotate(-90)"
          >
            Anomaly Score (0 - 100)
          </text>

          {/* Scatter Points */}
          {points.map((pt) => {
            const clampedAmt = Math.min(pt.amount, maxAmount);
            const x = padding.left + (clampedAmt / maxAmount) * innerW;
            const y = padding.top + innerH * (1 - pt.anomaly_score / 100);

            const color =
              pt.risk_level === "CRITICAL"
                ? "#ef4444"
                : pt.risk_level === "HIGH"
                ? "#f97316"
                : pt.risk_level === "MEDIUM"
                ? "#f59e0b"
                : "#10b981";

            const isHovered = hoveredPoint?.id === pt.id;

            return (
              <g
                key={pt.id}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => onSelectPoint && onSelectPoint(pt.id)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 8 : pt.risk_level === "CRITICAL" ? 5.5 : 4}
                  fill={color}
                  opacity={isHovered ? 1 : 0.75}
                  stroke={isHovered ? "#ffffff" : "#070b13"}
                  strokeWidth={isHovered ? 2 : 1}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "24px",
              background: "rgba(13, 21, 39, 0.95)",
              border: "1px solid var(--border-highlight)",
              borderRadius: "8px",
              padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              pointerEvents: "none",
              fontSize: "0.8rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px" }}>
              <span style={{ fontWeight: 700, color: "#38bdf8" }}>{hoveredPoint.id}</span>
              <span
                className={
                  hoveredPoint.risk_level === "CRITICAL"
                    ? "badge-critical"
                    : hoveredPoint.risk_level === "HIGH"
                    ? "badge-high"
                    : hoveredPoint.risk_level === "MEDIUM"
                    ? "badge-medium"
                    : "badge-low"
                }
                style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "0.68rem" }}
              >
                {hoveredPoint.risk_level} ({hoveredPoint.anomaly_score})
              </span>
            </div>
            <div>Customer: {hoveredPoint.customer}</div>
            <div>Merchant: {hoveredPoint.merchant} ({hoveredPoint.category})</div>
            <div style={{ fontWeight: 600, marginTop: "4px" }}>
              Amount: ${hoveredPoint.amount.toFixed(2)} | Status: {hoveredPoint.status}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 5. ROC Curve & Confusion Matrix Visualizer
 * ------------------------------------------------------------- */
export const ModelEvaluationView: React.FC<{
  metrics: ModelEvaluationMetrics;
  onRetrain: () => void;
  isRetraining: boolean;
}> = ({ metrics, onRetrain, isRetraining }) => {
  const cm = metrics.confusion_matrix;
  const totalPreds = cm.true_positives + cm.false_positives + cm.true_negatives + cm.false_negatives || 1;

  // ROC Curve SVG dimensions
  const rocW = 340;
  const rocH = 260;
  const pad = { top: 20, right: 20, bottom: 35, left: 35 };
  const inW = rocW - pad.left - pad.right;
  const inH = rocH - pad.top - pad.bottom;

  const rocPointsStr = (metrics.roc_curve_points || []).map((pt) => {
    const x = pad.left + pt.x * inW;
    const y = pad.top + inH * (1 - pt.y);
    return `${x},${y}`;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header and Retrain Trigger */}
      <div
        className="glass-card"
        style={{
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            {metrics.model_name}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Trained on {metrics.samples_count} labeled records ({metrics.fraud_samples_count} fraud instances). Last trained: {new Date(metrics.trained_at).toLocaleString()}
          </p>
        </div>

        <button onClick={onRetrain} disabled={isRetraining} className="btn-primary">
          <BarChart2 size={16} className={isRetraining ? "animate-spin" : ""} />
          <span>{isRetraining ? "Retraining Models..." : "Retrain AI Engine"}</span>
        </button>
      </div>

      {/* Primary Metrics 5-Card Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ROC-AUC SCORE</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#38bdf8", margin: "4px 0" }}>
            {(metrics.roc_auc * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: "0.7rem", color: "#34d399" }}>Excellent Discrimination</div>
        </div>

        <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>PRECISION</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#34d399", margin: "4px 0" }}>
            {(metrics.precision * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Low false alarms</div>
        </div>

        <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>RECALL (SENSITIVITY)</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fbbf24", margin: "4px 0" }}>
            {(metrics.recall * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Fraud patterns caught</div>
        </div>

        <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>F1-SCORE</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#818cf8", margin: "4px 0" }}>
            {(metrics.f1_score * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Harmonic balance</div>
        </div>

        <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>OVERALL ACCURACY</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f1f5f9", margin: "4px 0" }}>
            {(metrics.accuracy * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Total sample accuracy</div>
        </div>
      </div>

      {/* Row: ROC Curve + Confusion Matrix Grid + Top Feature Importances */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* ROC Curve SVG */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "8px" }}>
            Receiver Operating Characteristic (ROC)
          </h4>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "14px" }}>
            True Positive Rate vs False Positive Rate curve (AUC = {metrics.roc_auc.toFixed(3)})
          </p>

          <svg viewBox={`0 0 ${rocW} ${rocH}`} style={{ width: "100%", height: "auto", display: "block" }}>
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = pad.top + inH * (1 - r);
              const x = pad.left + inW * r;
              return (
                <g key={i}>
                  <line x1={pad.left} y1={y} x2={rocW - pad.right} y2={y} stroke="rgba(30, 47, 80, 0.5)" strokeDasharray="2 2" />
                  <line x1={x} y1={pad.top} x2={x} y2={pad.top + inH} stroke="rgba(30, 47, 80, 0.5)" strokeDasharray="2 2" />
                  <text x={pad.left - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#64748b">{r}</text>
                  <text x={x} y={rocH - 12} textAnchor="middle" fontSize="9" fill="#64748b">{r}</text>
                </g>
              );
            })}

            {/* Diagonal random baseline */}
            <line x1={pad.left} y1={pad.top + inH} x2={pad.left + inW} y2={pad.top} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* ROC Curve Path */}
            {rocPointsStr.length > 0 && (
              <polyline fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={rocPointsStr.join(" ")} />
            )}

            <text x={rocW / 2} y={rocH - 2} textAnchor="middle" fontSize="9" fill="#64748b">False Positive Rate (FPR)</text>
            <text x={-rocH / 2} y={12} textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90)">True Positive Rate (TPR)</text>
          </svg>
        </div>

        {/* 2x2 Confusion Matrix */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "8px" }}>
            Confusion Matrix Breakdown
          </h4>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "14px" }}>
            Detailed breakdown of True/False Positives and Negatives on test samples.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {/* True Negative */}
            <div style={{ padding: "14px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 600 }}>TRUE NEGATIVES (TN)</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, margin: "4px 0" }}>{cm.true_negatives}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                Correctly identified legitimate transactions ({((cm.true_negatives / totalPreds) * 100).toFixed(1)}%)
              </div>
            </div>

            {/* False Positive */}
            <div style={{ padding: "14px", background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "#fbbf24", fontWeight: 600 }}>FALSE POSITIVES (FP)</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, margin: "4px 0" }}>{cm.false_positives}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                Legitimate txns falsely flagged (Type I error)
              </div>
            </div>

            {/* False Negative */}
            <div style={{ padding: "14px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "#f87171", fontWeight: 600 }}>FALSE NEGATIVES (FN)</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, margin: "4px 0" }}>{cm.false_negatives}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                Undetected fraud events (Type II error)
              </div>
            </div>

            {/* True Positive */}
            <div style={{ padding: "14px", background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 600 }}>TRUE POSITIVES (TP)</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, margin: "4px 0" }}>{cm.true_positives}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                Successfully caught fraud attacks ({((cm.true_positives / totalPreds) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Top Feature Importances */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "8px" }}>
            Top Feature Importances (Gini Index)
          </h4>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "14px" }}>
            Machine learning weight given to features when detecting fraud patterns.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(metrics.feature_importances || []).slice(0, 6).map((feat, idx) => {
              const pct = (feat.importance * 100).toFixed(1);
              return (
                <div key={idx} style={{ fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span style={{ fontWeight: 500 }}>{feat.feature}</span>
                    <span style={{ color: "#38bdf8", fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "rgba(30, 47, 80, 0.6)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(feat.importance * 300, 100)}%`, height: "100%", background: "#38bdf8", borderRadius: "3px" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
