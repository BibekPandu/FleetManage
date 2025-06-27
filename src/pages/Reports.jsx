import React from 'react';
import './Reports.css';
import { useVehicles } from '../context/VehiclesContext';
import { useStaff } from '../context/StaffContext';
import { useLogbook } from '../context/LogbookContext';
import { useSchedules } from '../context/SchedulesContext';
import StatCard from '../components/reports/StatCard';
import SchedulesBarChart from '../components/reports/SchedulesBarChart';

const Reports = () => {
  const { vehicles } = useVehicles();
  const { staff } = useStaff();
  const { entries: logbookEntries } = useLogbook();
  const { schedules } = useSchedules();

  const getSchedulesByDay = () => {
    if (!schedules) return [];
    const schedulesByDate = schedules.reduce((acc, schedule) => {
      const date = schedule.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    return Object.keys(schedulesByDate).map(date => ({
      date,
      tasks: schedulesByDate[date],
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const scheduleChartData = getSchedulesByDay();

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
      </div>
      <div className="stat-cards-container">
        <StatCard title="Total Vehicles" value={vehicles.length} />
        <StatCard title="Total Staff" value={staff.length} />
        <StatCard title="Total Logbook Entries" value={logbookEntries.length} />
        <StatCard title="Total Schedules" value={schedules.length} />
      </div>
      <div className="charts-container">
        <h2>Schedules per Day</h2>
        <SchedulesBarChart data={scheduleChartData} />
      </div>
    </div>
  );
};

export default Reports;
