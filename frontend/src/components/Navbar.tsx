import React from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  Layers,
  Activity,
  Cpu,
  Sliders,
  RotateCcw,
  Zap,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isStreaming,
  setIsStreaming,
  onResetDemo,
  isResetting,
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Layers },
    { id: "risk-matrix", label: "Risk Matrix", icon: Activity },
    { id: "simulator", label: "AI Simulator", icon: Sliders },
    { id: "evaluation", label: "Model Evaluation", icon: Cpu },
  ];

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(13, 21, 39, 0.85)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(56, 189, 248, 0.4)",
            }}
          >
            <ShieldAlert size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "0.02em" }}>
                FRAUDGUARD <span style={{ color: "#38bdf8" }}>AI</span>
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: "rgba(56, 189, 248, 0.15)",
                  color: "#38bdf8",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  fontWeight: 600,
                }}
              >
                v1.0 ML
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Real-Time Financial Anomaly & Pattern Detection Engine
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: isActive ? "1px solid #38bdf8" : "1px solid transparent",
                  background: isActive ? "rgba(56, 189, 248, 0.12)" : "transparent",
                  color: isActive ? "#38bdf8" : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions & Live Simulation Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Live stream switch */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: isStreaming ? "1px solid #10b981" : "1px solid var(--border-subtle)",
              background: isStreaming ? "rgba(16, 185, 129, 0.12)" : "rgba(17, 28, 52, 0.6)",
              color: isStreaming ? "#34d399" : "var(--text-muted)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isStreaming ? "#10b981" : "#64748b",
              }}
              className={isStreaming ? "pulsing-dot" : ""}
            />
            <Zap size={14} />
            <span>{isStreaming ? "Live Feed: ON" : "Live Feed: OFF"}</span>
          </button>

          {/* Reset Demo button */}
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            title="Reset database and re-seed transactions"
            className="btn-secondary"
            style={{ fontSize: "0.82rem" }}
          >
            <RotateCcw size={14} className={isResetting ? "animate-spin" : ""} />
            <span>{isResetting ? "Resetting..." : "Reset Demo"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
