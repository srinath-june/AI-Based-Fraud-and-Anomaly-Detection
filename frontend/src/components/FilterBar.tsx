import React from "react";
import { Search, Filter, X } from "lucide-react";

interface FilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  riskLevel: string;
  setRiskLevel: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  minAmount: string;
  setMinAmount: (v: string) => void;
  maxAmount: string;
  setMaxAmount: (v: string) => void;
  onClearFilters: () => void;
}

const CATEGORIES = [
  "ALL",
  "Retail",
  "Electronics",
  "Travel",
  "Dining",
  "Groceries",
  "Gambling",
  "Crypto",
  "Luxury Goods",
  "Entertainment",
  "Digital Goods",
];

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  setSearch,
  riskLevel,
  setRiskLevel,
  status,
  setStatus,
  category,
  setCategory,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  onClearFilters,
}) => {
  const isFiltered =
    Boolean(search) ||
    riskLevel !== "ALL" ||
    status !== "ALL" ||
    category !== "ALL" ||
    Boolean(minAmount) ||
    Boolean(maxAmount);

  return (
    <div
      className="glass-card"
      style={{
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        {/* Search input */}
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search
            size={16}
            color="#64748b"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Search by ID, Customer, Merchant, City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px 9px 36px",
              background: "rgba(13, 21, 39, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
        </div>

        {/* Risk Level */}
        <div style={{ flex: "0 1 150px" }}>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              background: "rgba(13, 21, 39, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="CRITICAL">Critical (&gt;85)</option>
            <option value="HIGH">High (70-84)</option>
            <option value="MEDIUM">Medium (40-69)</option>
            <option value="LOW">Low (&lt;40)</option>
          </select>
        </div>

        {/* Status */}
        <div style={{ flex: "0 1 140px" }}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              background: "rgba(13, 21, 39, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="FLAGGED">Flagged</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="WHITELISTED">Whitelisted</option>
          </select>
        </div>

        {/* Category */}
        <div style={{ flex: "0 1 160px" }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              background: "rgba(13, 21, 39, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Min Amount */}
        <div style={{ flex: "0 1 110px" }}>
          <input
            type="number"
            placeholder="Min $"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 10px",
              background: "rgba(13, 21, 39, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
        </div>

        {/* Max Amount */}
        <div style={{ flex: "0 1 110px" }}>
          <input
            type="number"
            placeholder="Max $"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 10px",
              background: "rgba(13, 21, 39, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={onClearFilters}
            className="btn-secondary"
            style={{ fontSize: "0.82rem", padding: "8px 12px", color: "#f87171" }}
          >
            <X size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};
