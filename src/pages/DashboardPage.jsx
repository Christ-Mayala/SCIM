import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import ClientDashboardPage from '../features/client/pages/ClientDashboardPage';

const DashboardPage = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <ClientDashboardPage />;
};

export default DashboardPage;
