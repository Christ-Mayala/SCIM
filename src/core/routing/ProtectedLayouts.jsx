import React from 'react';
import { Outlet } from 'react-router-dom';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import NewAdminLayout from '../../components/layout/AdminLayout';

export const AuthenticatedLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

export const AdminLayout = () => {
  return (
    <ProtectedRoute adminOnly>
      <NewAdminLayout />
    </ProtectedRoute>
  );
};
