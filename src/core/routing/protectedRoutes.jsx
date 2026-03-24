import React from 'react';

const DashboardPage = React.lazy(() => import('../../pages/DashboardPage'));
const ProfilePage = React.lazy(() => import('../../pages/ProfilePage'));
const FavoritesPage = React.lazy(() => import('../../pages/FavoritesPage'));
const MessagesPage = React.lazy(() => import('../../pages/MessagesPage'));
const SubmitPropertyPage = React.lazy(() => import('../../pages/SubmitPropertyPage'));

export const protectedRoutes = [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/favorites', element: <FavoritesPage /> },
  { path: '/messages', element: <MessagesPage /> },
  { path: '/soumettre-bien', element: <SubmitPropertyPage /> },
];
