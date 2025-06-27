import React from 'react';
import './Dashboard.css';
import DashboardCards from '../components/dashboard/DashboardCards';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import DashboardSummary from '../components/dashboard/DashboardSummary';

// Reference data (from fleetfox or static as in the image)
const cards = [
  { title: 'Total Vehicles', value: 24, icon: '🚗', change: '+2.1% from last month', changeType: 'positive', description: '' },
  { title: 'Active Staff', value: 18, icon: '👥', change: '+2.1% from last month', changeType: 'positive', description: '' },
  { title: 'Fuel Usage (Today)', value: '1,204 L', icon: '⛽', change: '+2.1% from last month', changeType: 'positive', description: '' },
  { title: 'Schedules (Today)', value: 7, icon: '📅', change: '+2.1% from last month', changeType: 'positive', description: '' },
];

const barChartData = [
  { name: 'Mon', value: 1700 },
  { name: 'Tue', value: 5400 },
  { name: 'Wed', value: 2900 },
  { name: 'Thu', value: 4700 },
  { name: 'Fri', value: 4200 },
  { name: 'Sat', value: 2300 },
  { name: 'Sun', value: 4800 },
];

const summary = [
  { date: '2023-10-26', time: '14:30', activity: 'Vehicle #123 returned from delivery route', status: 'Completed', icon: '✅' },
  { date: '2023-10-26', time: '12:15', activity: 'Staff #456 started morning shift', status: 'In Progress', icon: '🔄' },
  { date: '2023-10-26', time: '10:45', activity: 'Fueling completed for Vehicle #789', status: 'Completed', icon: '✅' },
  { date: '2023-10-25', time: '16:20', activity: 'Maintenance scheduled for Vehicle #123', status: 'Scheduled', icon: '📅' },
  { date: '2023-10-25', time: '09:30', activity: 'New driver training completed', status: 'Completed', icon: '✅' },
];

const Dashboard = () => {
  return (
    <>
      <div className="dashboard-cards-row">
        <DashboardCards stats={cards} />
      </div>
      <div className="dashboard-grid-row">
        <div className="dashboard-card dashboard-grid-item">
          <h2>Weekly Activity Overview</h2>
          <div className="dashboard-bar-chart">
            <DashboardCharts data={barChartData} />
          </div>
        </div>
        <div className="dashboard-card dashboard-grid-item">
          <h2>Vehicle Status</h2>
          <div className="dashboard-pie-chart">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="80" fill="#e5f0ff" />
              <path d="M90,90 L90,10 A80,80 0 0,1 170,90 Z" fill="#2196f3" />
              <path d="M90,90 L170,90 A80,80 0 0,1 120,170 Z" fill="#ffd600" />
              <path d="M90,90 L120,170 A80,80 0 1,1 90,10 Z" fill="#e0e0e0" />
            </svg>
            <div className="dashboard-pie-legend">
              <span style={{ color: '#2196f3' }}>● Active</span>
              <span style={{ color: '#ffd600' }}>● In Maintenance</span>
              <span style={{ color: '#bdbdbd' }}>● Inactive</span>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-card" style={{ marginTop: 32 }}>
        <h2>Recent Activity</h2>
        <DashboardSummary summaryData={summary} />
      </div>
    </>
  );
};

export default Dashboard;
