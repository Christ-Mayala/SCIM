import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const AddPropertyPage = React.lazy(() => import('../../pages/AddPropertyPage'));
const EditPropertyPage = React.lazy(() => import('../../pages/EditPropertyPage'));

const AdminDashboardPage = React.lazy(() => import('../../features/admin/pages/AdminDashboardPage'));
const AdminPropertiesPage = React.lazy(() => import('../../features/admin/pages/AdminPropertiesPage'));
const AdminReservationsPage = React.lazy(() => import('../../features/admin/pages/AdminReservationsPage'));
const AdminUsersPage = React.lazy(() => import('../../features/admin/pages/AdminUsersPage'));
const AdminMessagesPage = React.lazy(() => import('../../features/admin/pages/AdminMessagesPage'));
const AdminAnalyticsPage = React.lazy(() => import('../../features/admin/pages/AdminAnalyticsPage'));
const AdminSettingsPage = React.lazy(() => import('../../features/admin/pages/AdminSettingsPage'));
const AdminSubmissionsPage = React.lazy(() => import('../../features/admin/pages/AdminSubmissionsPage'));

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