import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'SCIM Immobilier',
    siteDescription: 'Plateforme immobiliere',
    maintenanceMode: false,
    allowRegistration: true,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/settings`, { withCredentials: true });
      const data = response.data?.data || response.data || {};
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
      {settings.maintenanceMode && !window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/login') && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">
            Maintenance en cours<span className="text-gold-primary">.</span>
          </h1>
          <p className="text-zinc-400 max-w-md">
            Notre plateforme est actuellement en cours de maintenance pour améliorer votre expérience. 
            Nous serons de retour très bientôt !
          </p>
          <div className="mt-8 h-1 w-24 bg-gold-primary rounded-full animate-pulse" />
        </div>
      )}
    </SettingsContext.Provider>
  );
};
