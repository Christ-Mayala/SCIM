import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { MessageProvider } from './contexts/MessageContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppShell from './core/layout/AppShell';

import './App.css';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <>
          <Toaster position="top-right" reverseOrder={false} />
          <AuthProvider>
            <PropertyProvider>
              <MessageProvider>
                <Router>
                  <Routes>
                    <Route path="/*" element={<AppShell />} />
                  </Routes>
                </Router>
              </MessageProvider>
            </PropertyProvider>
          </AuthProvider>
        </>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
