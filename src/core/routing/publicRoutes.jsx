import React from 'react';

import HomePage from '../../pages/HomePage';
import PropertiesPage from '../../pages/PropertiesPage';
import PropertyDetailPage from '../../pages/PropertyDetailPage';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import ForgotPasswordPage from '../../pages/ForgotPasswordPage';
import VerifyCodePage from '../../pages/VerifyCodePage';
import ResetPasswordPage from '../../pages/ResetPasswordPage';
import ContactPage from '../../pages/ContactPage';
import AboutPage from '../../pages/AboutPage';
import PrivacyPage from '../../pages/PrivacyPage';
import TermsPage from '../../pages/TermsPage';
import CookiesPage from '../../pages/CookiesPage';
import SpecialOffersPage from '../../pages/SpecialOffersPage';
import AuthCallbackPage from '../../pages/AuthCallbackPage';

export const publicRoutes = [
  { path: '/home', element: <HomePage /> },
  { path: '/properties', element: <PropertiesPage /> },
  { path: '/properties/:id', element: <PropertyDetailPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/verify-code', element: <VerifyCodePage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/cookies', element: <CookiesPage /> },
  { path: '/offres-speciales', element: <SpecialOffersPage /> },
];
