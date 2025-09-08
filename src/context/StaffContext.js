import React, { createContext, useContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const StaffContext = createContext();

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};

export const StaffProvider = ({ children }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("fleetfox_token");
  // Keep hook available for future use. Not required for token-based checks now.
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

  const fetchStaff = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch staff");
      }

      const data = await response.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createStaff = async (staffData) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("DB  POST", staffData);
    }
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/staff`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add staff");
      }

      const data = await response.json();
      setStaff((prev) => [data.staff, ...prev]);
      return data.staff;
    } catch (err) {
      console.error("Error adding staff:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (id, staffData) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update staff");
      }

      const data = await response.json();
      setStaff((prev) => prev.map((s) => (s.id === id ? data.staff : s)));
      return data.staff;
    } catch (err) {
      console.error("Error updating staff:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete staff");
      }

      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting staff:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStaffById = async (id) => {
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch staff member");
      }

      const data = await response.json();
      return data.staff;
    } catch (err) {
      console.error("Error fetching staff member:", err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      fetchStaff();
    }
  }, [token]);

  const value = {
    staff,
    loading,
    error,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    getStaffById,
  };

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
};
