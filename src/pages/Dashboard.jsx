import React, { useMemo } from "react";
import "../styles/Dashboard.css";
import DashboardCards from "../components/dashboard/DashboardCards";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import { useVehicles } from "../context/VehiclesContext";
import { useStaff } from "../context/StaffContext";
import { useLogbook } from "../context/LogbookContext";
import { useSchedules } from "../context/SchedulesContext";
import { useExpenses } from "../context/ExpensesContext";

const Dashboard = () => {
  const { vehicles } = useVehicles();
  const { staff } = useStaff();
  const { schedules } = useSchedules();
  const { entries: logbookEntries } = useLogbook();
  const { expenses } = useExpenses();

  // Dashboard cards data
  const cards = [
    {
      title: "Total Vehicles",
      value: vehicles.length,
      icon: "🚗",
      change: "",
      changeType: "neutral",
      description: "",
    },
    {
      title: "Active Staff",
      value: staff.length,
      icon: "👥",
      change: "",
      changeType: "neutral",
      description: "",
    },
    {
      title: "Schedules (Total)",
      value: schedules.length,
      icon: "📅",
      change: "",
      changeType: "neutral",
      description: "",
    },
    {
      title: "Expenses (Total)",
      value: expenses.length,
      icon: "💸",
      change: "",
      changeType: "neutral",
      description: "",
    },
    {
      title: "Logbook Entries",
      value: logbookEntries.length,
      icon: "📖",
      change: "",
      changeType: "neutral",
      description: "",
    },
  ];

  // Recent activity summary (show latest from each section)
  const summary = useMemo(() => {
    const items = [];
    if (vehicles[0]) {
      items.push({
        date: vehicles[0].created_at || "",
        time: vehicles[0].created_at
          ? new Date(vehicles[0].created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        activity: `Vehicle added: ${vehicles[0].make} ${vehicles[0].model} (${
          vehicles[0].license_plate || vehicles[0].vehicle_number || ""
        })`,
        status: "Completed",
        icon: "🚗",
      });
    }
    if (staff[0]) {
      items.push({
        date: staff[0].created_at || "",
        time: staff[0].created_at
          ? new Date(staff[0].created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        activity: `Staff added: ${staff[0].username || staff[0].name || ""} (${
          staff[0].role
        })`,
        status: staff[0].status === "active" ? "Completed" : "In Progress",
        icon: "👥",
      });
    }
    if (schedules[0]) {
      items.push({
        date: schedules[0].created_at || schedules[0].date || "",
        time: schedules[0].created_at
          ? new Date(schedules[0].created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        activity: `Schedule: ${schedules[0].task || ""} for ${
          schedules[0].vehicle || ""
        } (${schedules[0].status})`,
        status: schedules[0].status
          ? schedules[0].status.charAt(0).toUpperCase() +
            schedules[0].status.slice(1)
          : "Scheduled",
        icon: "📅",
      });
    }
    if (logbookEntries[0]) {
      items.push({
        date: logbookEntries[0].created_at || logbookEntries[0].date || "",
        time: logbookEntries[0].created_at
          ? new Date(logbookEntries[0].created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        activity: `Logbook: ${logbookEntries[0].description || ""} (${
          logbookEntries[0].vehicle || ""
        })`,
        status: "Completed",
        icon: "📖",
      });
    }
    if (expenses[0]) {
      items.push({
        date: expenses[0].created_at || expenses[0].date || "",
        time: expenses[0].created_at
          ? new Date(expenses[0].created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        activity: `Expense: ${expenses[0].category || ""} - $${
          expenses[0].amount || ""
        }`,
        status: "Completed",
        icon: "💸",
      });
    }
    return items;
  }, [vehicles, staff, schedules, logbookEntries, expenses]);

  // For now, keep the bar chart static or you can add logic to aggregate weekly/monthly data
  const barChartData = [];

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
              <span style={{ color: "#2196f3" }}>● Active</span>
              <span style={{ color: "#ffd600" }}>● In Maintenance</span>
              <span style={{ color: "#bdbdbd" }}>● Inactive</span>
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
