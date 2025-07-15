import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon" />
        <span className="sidebar-logo-text">FleetFox</span>
      </div>
      <nav>
        <ul>
          <li><NavLink to="/" end>Dashboard</NavLink></li>
          <li><NavLink to="/logbook">Logbook</NavLink></li>
          <li><NavLink to="/vehicles">Vehicles</NavLink></li>
          <li><NavLink to="/staff">Staff</NavLink></li>
          <li><NavLink to="/scheduling">Scheduling</NavLink></li>
          <li><NavLink to="/expenses">Expenses</NavLink></li>
        </ul>
      </nav>
      
      {/* This bottom section is pushed down by the nav's flex-grow style */}
      <div className="sidebar-bottom">
        <div className="sidebar-section">
            <NavLink to="/reports" className="sidebar-bottom-link">Reports</NavLink>
            <NavLink to="/fuel-prediction" className="sidebar-bottom-link">Fuel Prediction</NavLink>
        </div>
        <div className="sidebar-section">
            <NavLink to="/settings" className="sidebar-bottom-link">Settings</NavLink>
            <button className="sidebar-bottom-link sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>
        <div className="sidebar-user">
            <div className="sidebar-user-avatar">{user?.name?.[0]?.toUpperCase() || '?'}</div>
            <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user?.name || 'User'}</div>
                <div className="sidebar-user-email">{user?.email || ''}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
