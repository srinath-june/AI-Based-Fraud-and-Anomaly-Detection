import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  variant?: "blue" | "emerald" | "amber" | "rose" | "indigo";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  variant = "blue",
}) => {
  const variantStyles = {
    blue: {
      color: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.12)",
      border: "rgba(56, 189, 248, 0.3)",
    },
    emerald: {
      color: "#34d399",
      bg: "rgba(16, 185, 129, 0.12)",
      border: "rgba(16, 185, 129, 0.3)",
    },
    amber: {
      color: "#fbbf24",
      bg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.3)",
    },
    rose: {
      color: "#f87171",
      bg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.3)",
    },
    indigo: {
      color: "#818cf8",
      bg: "rgba(99, 102, 241, 0.12)",
      border: "rgba(99, 102, 241, 0.3)",
    },
  }[variant];

  return (
    <div
      className="glass-card"
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500 }}>
          {title}
        </span>
        <div
          style={{
            padding: "8px",
            borderRadius: "8px",
            background: variantStyles.bg,
            border: `1px solid ${variantStyles.border}`,
            color: variantStyles.color,
          }}
        >
          <Icon size={18} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px" }}>
            {subtitle}
          </div>
        )}
      </div>

      {badge && (
        <div
          style={{
            display: "inline-block",
            fontSize: "0.7rem",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "6px",
            background: variantStyles.bg,
            color: variantStyles.color,
            width: "fit-content",
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};
