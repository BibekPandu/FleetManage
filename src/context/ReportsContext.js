import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReportsContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export const ReportsProvider = ({ children }) => {
  const [vehicleStats, setVehicleStats] = useState(null);
  const [staffStats, setStaffStats] = useState(null);
  const [logbookStats, setLogbookStats] = useState(null);
  const [expensesStats, setExpensesStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('fleetfox_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchVehicleStats = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/stats/overview`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch vehicle stats');
      }
      const data = await response.json();
      setVehicleStats(data);
    } catch (err) {
      console.error('Error fetching vehicle stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffStats = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/staff/stats/overview`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch staff stats');
      }
      const data = await response.json();
      setStaffStats(data);
    } catch (err) {
      console.error('Error fetching staff stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogbookStats = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/logbook/stats/overview`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch logbook stats');
      }
      const data = await response.json();
      setLogbookStats(data);
    } catch (err) {
      console.error('Error fetching logbook stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesStats = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/expences/stats/overview`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch expenses stats');
      }
      const data = await response.json();
      setExpensesStats(data);
    } catch (err) {
      console.error('Error fetching expenses stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStats = async () => {
    if (!isAuthenticated()) return;
    
    await Promise.all([
      fetchVehicleStats(),
      fetchStaffStats(),
      fetchLogbookStats(),
      fetchExpensesStats(),
    ]);
  };

  // Only fetch stats when user is authenticated
  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchAllStats();
    }
  }, [user, isAuthenticated]);

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
