import React, { useEffect } from "react";
import "../styles/Reports.css";
import { useReports } from "../context/ReportsContext";
import StatCard from "../components/reports/StatCard";
import RoundRobinScheduler from "../components/reports/RoundRobinScheduler";

const Reports = () => {
  const {
    vehicleStats,
    staffStats,
    logbookStats,
    expensesStats,
    loading,
    error,
    fetchAllStats,
  } = useReports();

  useEffect(() => {
    fetchAllStats();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
      </div>
      {loading && <div className="loading">Loading report statistics...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Round-Robin Scheduling System */}
      <RoundRobinScheduler />

      <div className="stat-cards-container">
        <StatCard title="Total Vehicles" value={vehicleStats?.total ?? "-"} />
        <StatCard title="Total Staff" value={staffStats?.total ?? "-"} />
        <StatCard
          title="Total Logbook Entries"
          value={logbookStats?.total ?? "-"}
        />
        <StatCard title="Total Expenses" value={expensesStats?.total ?? "-"} />
      </div>
    </div>
  );
};

export default Reports;
