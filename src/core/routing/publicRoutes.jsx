import React from 'react';

const HomePage = React.lazy(() => import('../../pages/HomePage'));
const PropertiesPage = React.lazy(() => import('../../pages/PropertiesPage'));
const PropertyDetailPage = React.lazy(() => import('../../pages/PropertyDetailPage'));
const LoginPage = React.lazy(() => import('../../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../../pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../../pages/ForgotPasswordPage'));
const VerifyCodePage = React.lazy(() => import('../../pages/VerifyCodePage'));
const ResetPasswordPage = React.lazy(() => import('../../pages/ResetPasswordPage'));
const ContactPage = React.lazy(() => import('../../pages/ContactPage'));
const AboutPage = React.lazy(() => import('../../pages/AboutPage'));
const PrivacyPage = React.lazy(() => import('../../pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('../../pages/TermsPage'));
const CookiesPage = React.lazy(() => import('../../pages/CookiesPage'));
const SpecialOffersPage = React.lazy(() => import('../../pages/SpecialOffersPage'));
const AuthCallbackPage = React.lazy(() => import('../../pages/AuthCallbackPage'));

export const publicRoutes = [
  { path: '/', element: <HomePage /> },
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
