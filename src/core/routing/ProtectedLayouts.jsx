import React from 'react';
import { Outlet } from 'react-router-dom';

import ProtectedRoute from '../../components/auth/ProtectedRoute';

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
      <Outlet />
    </ProtectedRoute>
  );
};
