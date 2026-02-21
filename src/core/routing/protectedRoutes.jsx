import React from 'react';

import DashboardPage from '../../pages/DashboardPage';
import ProfilePage from '../../pages/ProfilePage';
import FavoritesPage from '../../pages/FavoritesPage';
import MessagesPage from '../../pages/MessagesPage';

export const protectedRoutes = [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/favorites', element: <FavoritesPage /> },
  { path: '/messages', element: <MessagesPage /> },
];
