import React from "react";
import { Transaction } from "../types/transaction";
import { Eye, ShieldAlert, CheckCircle, ChevronLeft, ChevronRight, AlertOctagon } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onSelectTransaction: (txn: Transaction) => void;
  isLoading: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onSelectTransaction,
  isLoading,
}) => {
  const getRiskBadge = (level: string, score: number) => {
    let className = "badge-low";
    if (level === "CRITICAL") className = "badge-critical";
    else if (level === "HIGH") className = "badge-high";
    else if (level === "MEDIUM") className = "badge-medium";

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          className={className}
          style={{
            padding: "3px 8px",
            borderRadius: "6px",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {level}
        </span>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)" }}>
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const isFlagged = status === "FLAGGED";
    const isApproved = status === "APPROVED";
    const isWhitelisted = status === "WHITELISTED";
    const isRejected = status === "REJECTED";

    return (
      <span
        style={{
          padding: "3px 8px",
          borderRadius: "6px",
          fontSize: "0.72rem",
          fontWeight: 600,
          background: isFlagged
            ? "rgba(239, 68, 68, 0.15)"
            : isApproved
            ? "rgba(16, 185, 129, 0.15)"
            : isWhitelisted
            ? "rgba(56, 189, 248, 0.15)"
            : isRejected
            ? "rgba(249, 115, 22, 0.15)"
            : "rgba(148, 163, 184, 0.15)",
          color: isFlagged
            ? "#f87171"
            : isApproved
            ? "#34d399"
            : isWhitelisted
            ? "#38bdf8"
            : isRejected
            ? "#fb923c"
            : "#94a3b8",
          border: `1px solid ${
            isFlagged
              ? "rgba(239, 68, 68, 0.3)"
              : isApproved
              ? "rgba(16, 185, 129, 0.3)"
              : "rgba(148, 163, 184, 0.3)"
          }`,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="glass-card" style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Txn ID / Time</th>
              <th>Customer / Account</th>
              <th>Merchant & Category</th>
              <th>Amount</th>
              <th>Channel & Origin</th>
              <th>Anomaly Score</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--text-dim)" }}>
                  No transactions match current filters.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => {
                const dateObj = new Date(txn.timestamp);
                const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const dateStr = dateObj.toLocaleDateString([], { month: "short", day: "numeric" });

                return (
                  <tr
                    key={txn.id}
                    onClick={() => onSelectTransaction(txn)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: "#38bdf8", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem" }}>
                        {txn.id}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                        {dateStr} at {timeStr}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{txn.customer_name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                        {txn.account_id}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 500 }}>{txn.merchant}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                        {txn.merchant_category}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                        ${txn.amount.toFixed(2)}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: txn.amount_ratio_to_avg > 2.5 ? "#f87171" : "var(--text-dim)" }}>
                        {txn.amount_ratio_to_avg.toFixed(1)}x avg
                      </div>
                    </td>

                    <td>
                      <div>{txn.channel}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                        {txn.location_city}, {txn.location_country} {txn.is_foreign && "🌍"}
                      </div>
                    </td>

                    <td>{getRiskBadge(txn.risk_level, txn.anomaly_score)}</td>

                    <td>{getStatusBadge(txn.status)}</td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(txn);
                        }}
                        className="btn-secondary"
                        style={{ padding: "6px 10px", fontSize: "0.75rem" }}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid var(--border-subtle)",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "0.82rem",
          color: "var(--text-muted)",
        }}
      >
        <div>
          Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total.toLocaleString()} total transactions)
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.8rem", opacity: page <= 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.8rem", opacity: page >= totalPages ? 0.4 : 1 }}
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
