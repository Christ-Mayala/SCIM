import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import AppHeader from './AppHeader';
import Footer from '../../components/layout/Footer';

import HomePage from '../../pages/HomePage';
import PropertiesPage from '../../pages/PropertiesPage';
import PropertyDetailPage from '../../pages/PropertyDetailPage';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import ForgotPasswordPage from '../../pages/ForgotPasswordPage';
import VerifyCodePage from '../../pages/VerifyCodePage';
import ResetPasswordPage from '../../pages/ResetPasswordPage';
import DashboardPage from '../../pages/DashboardPage';
import ProfilePage from '../../pages/ProfilePage';
import FavoritesPage from '../../pages/FavoritesPage';
import AddPropertyPage from '../../pages/AddPropertyPage';
import EditPropertyPage from '../../pages/EditPropertyPage';
import ContactPage from '../../pages/ContactPage';
import AboutPage from '../../pages/AboutPage';
import MessagesPage from '../../pages/MessagesPage';
import NotFoundPage from '../../pages/NotFoundPage';
import PrivacyPage from '../../pages/PrivacyPage';
import TermsPage from '../../pages/TermsPage';
import CookiesPage from '../../pages/CookiesPage';

import AdminDashboardPage from '../../features/admin/pages/AdminDashboardPage';
import AdminPropertiesPage from '../../features/admin/pages/AdminPropertiesPage';
import AdminUsersPage from '../../features/admin/pages/AdminUsersPage';
import AdminMessagesPage from '../../features/admin/pages/AdminMessagesPage';
import AdminAnalyticsPage from '../../features/admin/pages/AdminAnalyticsPage';
import AdminSettingsPage from '../../features/admin/pages/AdminSettingsPage';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import ScrollToTop from '../../components/common/ScrollToTop';

const AppShell = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-zinc-50">
      <ScrollToTop />
      <AppHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-property"
            element={
              <ProtectedRoute adminOnly>
                <Navigate to="/admin/properties/new" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-property/:id"
            element={
              <ProtectedRoute adminOnly>
                <Navigate to={location.pathname.replace('/edit-property/', '/admin/properties/').concat('/edit')} replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/properties/new"
            element={
              <ProtectedRoute adminOnly>
                <AddPropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties/:id/edit"
            element={
              <ProtectedRoute adminOnly>
                <EditPropertyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Navigate to="/admin/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute adminOnly>
                <AdminPropertiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute adminOnly>
                <AdminMessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute adminOnly>
                <AdminAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminPath ? <Footer /> : null}
    </div>
  );
};

export default AppShell;
