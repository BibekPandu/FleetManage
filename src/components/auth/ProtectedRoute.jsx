import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Sidebar from '../common/Sidebar';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute; 