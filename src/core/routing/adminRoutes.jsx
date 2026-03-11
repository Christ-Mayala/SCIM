import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import AddPropertyPage from '../../pages/AddPropertyPage';
import EditPropertyPage from '../../pages/EditPropertyPage';

import AdminDashboardPage from '../../features/admin/pages/AdminDashboardPage';
import AdminPropertiesPage from '../../features/admin/pages/AdminPropertiesPage';
import AdminReservationsPage from '../../features/admin/pages/AdminReservationsPage';
import AdminUsersPage from '../../features/admin/pages/AdminUsersPage';
import AdminMessagesPage from '../../features/admin/pages/AdminMessagesPage';
import AdminAnalyticsPage from '../../features/admin/pages/AdminAnalyticsPage';
import AdminSettingsPage from '../../features/admin/pages/AdminSettingsPage';
import AdminSubmissionsPage from '../../features/admin/pages/AdminSubmissionsPage';

const LegacyEditPropertyRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/admin/properties/${id}/edit`} replace />;
};

export const adminAliasRoutes = [
  { key: 'legacy-add-property', path: '/add-property', element: <Navigate to="/admin/properties/new" replace /> },
  { key: 'legacy-edit-property', path: '/edit-property/:id', element: <LegacyEditPropertyRedirect /> },
];

export const adminRoutes = [
  { key: 'admin-index', index: true, element: <Navigate to="dashboard" replace /> },
  { key: 'admin-dashboard', path: 'dashboard', element: <AdminDashboardPage /> },
  { key: 'admin-properties', path: 'properties', element: <AdminPropertiesPage /> },
  { key: 'admin-properties-new', path: 'properties/new', element: <AddPropertyPage /> },
  { key: 'admin-properties-edit', path: 'properties/:id/edit', element: <EditPropertyPage /> },
  { key: 'admin-reservations', path: 'reservations', element: <AdminReservationsPage /> },
  { key: 'admin-users', path: 'users', element: <AdminUsersPage /> },
  { key: 'admin-messages', path: 'messages', element: <AdminMessagesPage /> },
  { key: 'admin-analytics', path: 'analytics', element: <AdminAnalyticsPage /> },
  { key: 'admin-settings', path: 'settings', element: <AdminSettingsPage /> },
  { key: 'admin-submissions', path: 'submissions', element: <AdminSubmissionsPage /> },
];