import React from "react";
import "./DashboardCards.css";

const DashboardCards = ({ stats }) => {
  const getChangeColor = (changeType) => {
    switch (changeType) {
      case "positive":
        return "#10b981";
      case "negative":
        return "#ef4444";
      case "neutral":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case "positive":
        return "↗️";
      case "negative":
        return "↘️";
      case "neutral":
        return "→";
      default:
        return "→";
    }
  };

  return (
    <div className="dashboard-cards">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">{stat.icon}</div>
            <div
              className="stat-change"
              style={{ color: getChangeColor(stat.changeType) }}
            >
              <span className="change-icon">
                {getChangeIcon(stat.changeType)}
              </span>
              <span className="change-value">{stat.change}</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-description">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
