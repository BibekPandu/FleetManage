import React, { useEffect } from 'react';
import './Reports.css';
import { useReports } from '../context/ReportsContext';
import StatCard from '../components/reports/StatCard';
import SchedulesBarChart from '../components/reports/SchedulesBarChart';

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

  // Example: Schedules per day from logbookStats or another stat source
  // You may need to adjust this if you want to show a chart from a specific stat
  const scheduleChartData = [];
  // If you want to show logbook entries by vehicle or driver, you can use logbookStats.byVehicle/byDriver

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
      </div>
      {loading && <div className="loading">Loading report statistics...</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="stat-cards-container">
        <StatCard title="Total Vehicles" value={vehicleStats?.total ?? '-'} />
        <StatCard title="Total Staff" value={staffStats?.total ?? '-'} />
        <StatCard title="Total Logbook Entries" value={logbookStats?.total ?? '-'} />
        <StatCard title="Total Expenses" value={expensesStats?.total ?? '-'} />
      </div>
      {/* Example chart placeholder, update as needed */}
      <div className="charts-container">
        <h2>Schedules per Day</h2>
        <SchedulesBarChart data={scheduleChartData} />
      </div>
    </div>
  );
};

export default Reports;
