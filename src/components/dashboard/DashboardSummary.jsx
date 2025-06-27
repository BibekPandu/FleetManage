import React from 'react';
import './DashboardSummary.css';

const DashboardSummary = ({ summaryData }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#10b981';
      case 'In Progress':
        return '#f59e0b';
      case 'Scheduled':
        return '#3b82f6';
      case 'Overdue':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-summary">
      <div className="summary-header">
        <h3>Recent Activity</h3>
        <p className="summary-subtitle">Latest fleet operations and updates</p>
      </div>
      <div className="activity-list">
        {summaryData.map((item, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon">
              <span className="icon">{item.icon}</span>
            </div>
            <div className="activity-content">
              <div className="activity-header">
                <span className="activity-time">{item.time}</span>
                <span 
                  className="activity-status" 
                  style={{ color: getStatusColor(item.status) }}
                >
                  {item.status}
                </span>
              </div>
              <p className="activity-text">{item.activity}</p>
              <span className="activity-date">{formatDate(item.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSummary;
