import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminHeader from './headers/AdminHeader';
import ClientHeader from './headers/ClientHeader';

const AppHeader = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isAdminContent = useMemo(() => {
    const p = location.pathname || '';
    return p.startsWith('/admin');
  }, [location.pathname]);

  if (isAdminContent) return null; // L'admin utilise maintenant son propre AdminLayout structuré
  return <ClientHeader />;
};

export default AppHeader;
