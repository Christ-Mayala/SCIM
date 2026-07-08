import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const IncompleteProfileBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('profileBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (user?.telephone) {
      localStorage.removeItem('profileBannerDismissed');
      setIsDismissed(false);
    }
  }, [user?.telephone]);

  const isIncomplete = !user?.telephone;

  if (!isIncomplete || isDismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem('profileBannerDismissed', 'true');
    setIsDismissed(true);
  };

  const handleComplete = () => {
    navigate('/profile');
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border-y border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-white">Profil incomplet</h4>
              <p className="text-sm text-zinc-400">Ajoutez votre numéro de téléphone pour profiter de toutes les fonctionnalités</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              onClick={handleComplete}
              className="flex-1 sm:flex-none h-10 px-6 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl font-black uppercase tracking-widest text-[10px]"
            >
              Compléter le profil
            </Button>
            <button 
              onClick={handleDismiss}
              className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-all"
              title="Ignorer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
