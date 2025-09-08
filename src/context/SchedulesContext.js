import React, { createContext, useContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const SchedulesContext = createContext();

export const useSchedules = () => {
  const context = useContext(SchedulesContext);
  if (!context) {
    throw new Error("useSchedules must be used within a SchedulesProvider");
  }
  return context;
};

export const SchedulesProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user_token = localStorage.getItem("fleetfox_token");
  // Hook present for future auth-aware logic; token check suffices for now.
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

  const fetchSchedules = async () => {
    if (!user_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/schedules`, {
        headers: {
          Authorization: `Bearer ${user_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }

      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async (scheduleData) => {
    if (!user_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/schedules`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add schedule");
      }

      const data = await response.json();
      setSchedules((prev) => [data.schedule, ...prev]);
      return data.schedule;
    } catch (err) {
      console.error("Error adding schedule:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id, scheduleData) => {
    if (!user_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/schedules/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scheduleData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update schedule");
      }

      const data = await response.json();
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? data.schedule : s))
      );
      return data.schedule;
    } catch (err) {
      console.error("Error updating schedule:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    if (!user_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/schedules/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete schedule");
      }

      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting schedule:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (user_token) {
      fetchSchedules();
    }
  }, [user_token]);

  const value = {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    clearError,
  };

  return (
    <SchedulesContext.Provider value={value}>
      {children}
    </SchedulesContext.Provider>
  );
};
