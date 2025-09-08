import React, { createContext, useContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const LogbookContext = createContext();

export const useLogbook = () => {
  const context = useContext(LogbookContext);
  if (!context) {
    throw new Error("useLogbook must be used within a LogbookProvider");
  }
  return context;
};

export const LogbookProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("fleetfox_token");
  const { isAuthenticated } = useAuth();

  const fetchEntries = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/logbook`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logbook entries");
      }

      const data = await response.json();
      setEntries(data.entries || []);
    } catch (err) {
      console.error("Error fetching logbook entries:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entryData) => {
    console.log("DB  POST", entryData);

    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      console.log("DB  POST", entryData);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/logbook`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add logbook entry");
      }

      const data = await response.json();
      setEntries((prev) => [data.entry, ...prev]);
      return data.entry;
    } catch (err) {
      console.error("Error adding logbook entry:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id, entryData) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/logbook/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update logbook entry");
      }

      const data = await response.json();
      setEntries((prev) => prev.map((e) => (e.id === id ? data.entry : e)));
      return data.entry;
    } catch (err) {
      console.error("Error updating logbook entry:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/logbook/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete logbook entry");
      }

      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting logbook entry:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEntryById = async (id) => {
    if (!token) return null;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/logbook/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logbook entry");
      }

      const data = await response.json();
      return data.entry;
    } catch (err) {
      console.error("Error fetching logbook entry:", err);
      setError(err.message);
      return null;
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (token) {
      fetchEntries();
    }
  }, [token]);

  const value = {
    entries,
    loading,
    error,
    fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    clearError,
  };

  return (
    <LogbookContext.Provider value={value}>{children}</LogbookContext.Provider>
  );
};
