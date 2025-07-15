import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Staff from './pages/Staff';
import Logbook from './pages/Logbook';
import Scheduling from './pages/Scheduling';
import Reports from './pages/Reports';
import FuelPrediction from './pages/FuelPrediction';
import Settings from './pages/Settings';
import AuthPage from './pages/AuthPage';
import Expenses from './pages/Expenses';

import ProtectedRoute from './components/auth/ProtectedRoute';
import useAuth from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/logbook" element={<Logbook />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/fuel-prediction" element={<FuelPrediction />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/auth"} />} />
      </Routes>
    </Router>
  );
}

export default App;
