import React, { useState, useEffect, useCallback } from "react";
import {
  Transaction,
  AnalyticsSummary,
  ModelEvaluationMetrics,
  ScatterPoint,
} from "./types/transaction";
import {
  fetchTransactions,
  fetchAnalyticsSummary,
  fetchModelEvaluation,
  fetchRiskMatrix,
  reviewTransaction,
  simulateStreamTransaction,
  resetDemoDatabase,
  retrainModel,
} from "./services/api";

import { Navbar } from "./components/Navbar";
import { StatCard } from "./components/StatCard";
import { FilterBar } from "./components/FilterBar";
import { TransactionTable } from "./components/TransactionTable";
import { TransactionDetailModal } from "./components/TransactionDetailModal";
import { SingleTransactionTester } from "./components/SingleTransactionTester";
import {
  VolumeAndFraudChart,
  CategoryRiskBarChart,
  RiskDistributionBar,
  ScatterRiskMatrix,
  ModelEvaluationView,
} from "./components/charts/InteractiveCharts";

import {
  ShieldAlert,
  DollarSign,
  TrendingUp,
  Percent,
  AlertTriangle,
  Zap,
  Layers,
  Activity,
  CheckCircle,
} from "lucide-react";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);

  // Transactions list & pagination
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingTxns, setIsLoadingTxns] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Analytics & Model Metrics
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [modelMetrics, setModelMetrics] = useState<ModelEvaluationMetrics | null>(null);
  const [scatterPoints, setScatterPoints] = useState<ScatterPoint[]>([]);

  // Selected transaction for modal
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Load Analytics
  const loadAnalytics = useCallback(async () => {
    try {
      const data = await fetchAnalyticsSummary();
      setAnalytics(data);
    } catch (err) {
      console.error("Error loading analytics:", err);
    }
  }, []);

  // Load Transactions
  const loadTransactions = useCallback(async () => {
    setIsLoadingTxns(true);
    try {
      const data = await fetchTransactions({
        page,
        page_size: pageSize,
        search,
        risk_level: riskLevel,
        status,
        merchant_category: category,
        min_amount: minAmount ? parseFloat(minAmount) : undefined,
        max_amount: maxAmount ? parseFloat(maxAmount) : undefined,
      });
      setTransactions(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setIsLoadingTxns(false);
    }
  }, [page, pageSize, search, riskLevel, status, category, minAmount, maxAmount]);

  // Load Model Evaluation
  const loadModelMetrics = useCallback(async () => {
    try {
      const data = await fetchModelEvaluation();
      setModelMetrics(data);
    } catch (err) {
      console.error("Error loading model metrics:", err);
    }
  }, []);

  // Load Scatter Points
  const loadScatterPoints = useCallback(async () => {
    try {
      const data = await fetchRiskMatrix();
      setScatterPoints(data.points);
    } catch (err) {
      console.error("Error loading risk matrix:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAnalytics();
    loadTransactions();
    loadModelMetrics();
    loadScatterPoints();
  }, [loadAnalytics, loadTransactions, loadModelMetrics, loadScatterPoints]);

  // Reset pagination on filter change
  useEffect(() => {
    setPage(1);
  }, [search, riskLevel, status, category, minAmount, maxAmount]);

  // Live Stream Simulation Effect
  useEffect(() => {
    let interval: any = null;
    if (isStreaming) {
      interval = setInterval(async () => {
        try {
          // 25% chance of simulating fraud event for interactive excitement
          const fraudBias = Math.random() < 0.25;
          const newTxn = await simulateStreamTransaction(fraudBias);
          setTransactions((prev) => [newTxn, ...prev.slice(0, pageSize - 1)]);
          setTotal((prev) => prev + 1);
          loadAnalytics();
        } catch (err) {
          console.error("Live streaming error:", err);
        }
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, pageSize, loadAnalytics]);

  // Handle Review Action
  const handleReview = async (
    id: string,
    reviewStatus: "APPROVED" | "FLAGGED" | "WHITELISTED" | "REJECTED",
    notes: string
  ) => {
    try {
      const updated = await reviewTransaction(id, {
        status: reviewStatus,
        reviewed_by: "Security Analyst",
        review_notes: notes,
      });

      // Update local state
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (selectedTxn && selectedTxn.id === id) {
        setSelectedTxn(updated);
      }
      loadAnalytics();
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  // Handle Reset Demo
  const handleResetDemo = async () => {
    if (!window.confirm("Reset demo database with 750 fresh synthetic transactions and retrain model?")) return;
    setIsResetting(true);
    try {
      await resetDemoDatabase();
      await loadAnalytics();
      await loadTransactions();
      await loadModelMetrics();
      await loadScatterPoints();
    } catch (err) {
      console.error("Reset demo failed:", err);
    } finally {
      setIsResetting(false);
    }
  };

  // Handle Model Retrain
  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      const updated = await retrainModel();
      setModelMetrics(updated);
    } catch (err) {
      console.error("Retrain failed:", err);
    } finally {
      setIsRetraining(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setRiskLevel("ALL");
    setStatus("ALL");
    setCategory("ALL");
    setMinAmount("");
    setMaxAmount("");
  };

  // Select point from scatter chart
  const handleSelectScatterPoint = (id: string) => {
    const found = transactions.find((t) => t.id === id);
    if (found) {
      setSelectedTxn(found);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "28px 24px", width: "100%", flex: 1 }}>
        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW                                                */}
        {/* ========================================================================= */}
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* KPI Cards Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <StatCard
                title="TOTAL TRANSACTIONS"
                value={(analytics?.total_transactions || 0).toLocaleString()}
                subtitle="Monitored in system"
                icon={Layers}
                variant="blue"
              />

              <StatCard
                title="FLAGGED FRAUD ALERTS"
                value={(analytics?.flagged_count || 0).toLocaleString()}
                subtitle={`${analytics?.fraud_rate_percentage || 0}% overall fraud rate`}
                icon={ShieldAlert}
                badge={`${analytics?.flagged_count || 0} Critical/High`}
                variant="rose"
              />

              <StatCard
                title="TOTAL TRANSACTION VOLUME"
                value={`$${(analytics?.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtitle={`$${(analytics?.flagged_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} flagged`}
                icon={DollarSign}
                variant="emerald"
              />

              <StatCard
                title="AVG ANOMALY SCORE"
                value={`${analytics?.avg_anomaly_score || 0} / 100`}
                subtitle="Isolation Forest + RF Ensemble"
                icon={Activity}
                badge={analytics && analytics.avg_anomaly_score > 40 ? "Elevated Alert" : "Normal Baseline"}
                variant="amber"
              />
            </div>

            {/* Middle Row: Trend Chart & Category Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px" }}>
              {/* Trends */}
              <div className="glass-card" style={{ padding: "22px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>
                  14-Day Transaction Volume & Anomaly Trends
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                  Daily historical volume with flagged anomalous patterns overlaid.
                </p>
                <VolumeAndFraudChart trends={analytics?.time_series_trends || []} />
              </div>

              {/* Risk Distribution & Category Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="glass-card" style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>
                    Risk Tier Distribution
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                    Stratification across Low, Medium, High, and Critical anomaly boundaries.
                  </p>
                  <RiskDistributionBar
                    distribution={
                      analytics?.risk_distribution || { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
                    }
                  />
                </div>

                <div className="glass-card" style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>
                    Fraud Rate by Merchant Category
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                    Percentage of transactions flagged per industry sector.
                  </p>
                  <CategoryRiskBarChart categories={analytics?.category_fraud_breakdown || []} />
                </div>
              </div>
            </div>

            {/* Recent High-Risk Transactions Snapshot */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertTriangle size={18} color="#f97316" /> Recent Monitored Transactions
                </h3>
                <button onClick={() => setActiveTab("transactions")} className="btn-secondary" style={{ fontSize: "0.8rem" }}>
                  View All in Explorer →
                </button>
              </div>

              <TransactionTable
                transactions={transactions.slice(0, 8)}
                total={total}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                onPageChange={setPage}
                onSelectTransaction={(txn) => setSelectedTxn(txn)}
                isLoading={isLoadingTxns}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TRANSACTIONS & ANOMALY EXPLORER                                    */}
        {/* ========================================================================= */}
        {activeTab === "transactions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Transaction & Anomaly Explorer</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Filter, inspect, and perform analyst reviews on scored transactions.
              </p>
            </div>

            <FilterBar
              search={search}
              setSearch={setSearch}
              riskLevel={riskLevel}
              setRiskLevel={setRiskLevel}
              status={status}
              setStatus={setStatus}
              category={category}
              setCategory={setCategory}
              minAmount={minAmount}
              setMinAmount={setMinAmount}
              maxAmount={maxAmount}
              setMaxAmount={setMaxAmount}
              onClearFilters={handleClearFilters}
            />

            <TransactionTable
              transactions={transactions}
              total={total}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={setPage}
              onSelectTransaction={(txn) => setSelectedTxn(txn)}
              isLoading={isLoadingTxns}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RISK MATRIX & SCATTER CLUSTER                                      */}
        {/* ========================================================================= */}
        {activeTab === "risk-matrix" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>2D Risk Matrix Scatter Analysis</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Interactive visual clustering of transaction amounts vs calculated anomaly scores.
              </p>
            </div>

            <ScatterRiskMatrix
              points={scatterPoints}
              onSelectPoint={handleSelectScatterPoint}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AI TRANSACTION SIMULATOR & TESTER                                  */}
        {/* ========================================================================= */}
        {activeTab === "simulator" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>AI Anomaly Scoring Simulator</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Test arbitrary transactions or run presets to observe Isolation Forest + Random Forest predictions.
              </p>
            </div>

            <SingleTransactionTester />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MODEL EVALUATION & EXPLAINABILITY                                   */}
        {/* ========================================================================= */}
        {activeTab === "evaluation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Model Performance & Evaluation Suite</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Machine learning metrics: ROC-AUC, Precision, Recall, Confusion Matrix, and Gini feature importances.
              </p>
            </div>

            {modelMetrics ? (
              <ModelEvaluationView
                metrics={modelMetrics}
                onRetrain={handleRetrain}
                isRetraining={isRetraining}
              />
            ) : (
              <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
                Loading model evaluation metrics...
              </div>
            )}
          </div>
        )}
      </main>

      {/* Deep-Dive Transaction Detail & Review Modal */}
      <TransactionDetailModal
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        onReview={handleReview}
      />
    </div>
  );
};

export default App;
