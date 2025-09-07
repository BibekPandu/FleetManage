import React, { useState, useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { login, register, shouldRedirectToLogin, clearRedirectFlag } =
    useAuth();

  // Handle redirect to login after registration
  useEffect(() => {
    if (shouldRedirectToLogin) {
      setIsLoginView(true);
      setSuccessMessage(
        "Registration successful! Please login with your credentials."
      );
      clearRedirectFlag();
    }
  }, [shouldRedirectToLogin, clearRedirectFlag]);

  const handleLogin = async (credentials) => {
    try {
      setError("");
      setSuccessMessage("");
      await login(credentials);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = (userData) => {
    try {
      setError("");
      setSuccessMessage("");
      register(userData);
      // Don't navigate here - let useEffect handle the redirect
    } catch (err) {
      setError(err.message);
    }
  };

  const setView = (view) => {
    setIsLoginView(view === "login");
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">FleetFox</h1>
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLoginView ? "active" : ""}`}
            onClick={() => setView("login")}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${!isLoginView ? "active" : ""}`}
            onClick={() => setView("register")}
          >
            Register
          </button>
        </div>
        {isLoginView ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <RegisterForm onRegister={handleRegister} />
        )}
        {error && <p className="auth-error">{error}</p>}
        {successMessage && <p className="auth-success">{successMessage}</p>}
      </div>
    </div>
  );
};

export default AuthPage;
