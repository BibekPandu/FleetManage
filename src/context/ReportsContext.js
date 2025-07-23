import React, { createContext, useState, useContext } from 'react';

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
  const [vehicleStats, setVehicleStats] = useState(null);
  const [staffStats, setStaffStats] = useState(null);
  const [logbookStats, setLogbookStats] = useState(null);
  const [expensesStats, setExpensesStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('fleetfox_token');

  const fetchVehicleStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/vehicles/stats/overview', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch vehicle stats');
      const data = await response.json();
      setVehicleStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/staff/stats/overview', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch staff stats');
      const data = await response.json();
      setStaffStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogbookStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/logbook/stats/overview', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch logbook stats');
      const data = await response.json();
      setLogbookStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/expences/stats/overview', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch expenses stats');
      const data = await response.json();
      setExpensesStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStats = async () => {
    await Promise.all([
      fetchVehicleStats(),
      fetchStaffStats(),
      fetchLogbookStats(),
      fetchExpensesStats(),
    ]);
  };

  const value = {
    vehicleStats,
    staffStats,
    logbookStats,
    expensesStats,
    loading,
    error,
    fetchVehicleStats,
    fetchStaffStats,
    fetchLogbookStats,
    fetchExpensesStats,
    fetchAllStats,
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);
