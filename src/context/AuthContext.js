import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("fleetfox_user");
    const token = localStorage.getItem("fleetfox_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Verify token with backend
      verifyToken(token);
    }
  }, []);

  // Verify JWT token with backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Token is invalid, clear local storage
        localStorage.removeItem("fleetfox_user");
        localStorage.removeItem("fleetfox_token");
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("fleetfox_user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Token verification failed:", error);
      // Clear invalid data
      localStorage.removeItem("fleetfox_user");
      localStorage.removeItem("fleetfox_token");
      setUser(null);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    console.log("🔐 Registration attempt with data:", userData);

    try {
      if (userData.role === "admin") {
        throw new Error("Cannot register as admin.");
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("📡 Registration response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("✅ Registration successful for user:", userData.username);

      // Set flag to redirect to login instead of auto-login
      setShouldRedirectToLogin(true);
      return data.user;
    } catch (error) {
      console.error("❌ Registration error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    console.log("🔍 Login attempt with credentials:", credentials);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      console.log("📡 Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("✅ Login successful for user:", credentials.username);

      // Store user and token
      setUser(data.user);
      localStorage.setItem("fleetfox_user", JSON.stringify(data.user));
      localStorage.setItem("fleetfox_token", data.token);
      setShouldRedirectToLogin(false);
      return data.user;
    } catch (error) {
      console.error("❌ Login error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("fleetfox_user");
    localStorage.removeItem("fleetfox_token");
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const clearRedirectFlag = () => {
    setShouldRedirectToLogin(false);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated,
        shouldRedirectToLogin,
        clearRedirectFlag,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
