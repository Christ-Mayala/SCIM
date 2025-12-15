import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { MessageProvider } from './contexts/MessageContext';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';

import IntroPage from './pages/IntroPage';
import AppShell from './core/layout/AppShell';

import './App.css';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <PropertyProvider>
              <MessageProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<IntroPage />} />
                    <Route path="/*" element={<AppShell />} />
                  </Routes>
                </Router>
              </MessageProvider>
            </PropertyProvider>
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
