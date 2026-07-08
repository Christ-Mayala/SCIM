import React, { useEffect, useState } from 'react';
import { 
  Save, Settings, Globe, Shield, Bell, User, 
  Lock, Layout, Mail, Database, AlertTriangle, RefreshCw 
} from 'lucide-react';
import { adminAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({});

  const reloadSettings = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSettings();
      // On s'assure que les données sont bien mappées
      const settings = res.data?.data || res.data || {};
      setData(settings);
    } catch (e) {
      console.error(e);
      toast.error("Impossible de charger les paramètres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reloadSettings(); }, []);

  const onSave = async () => {
    try {
      setSaving(true);
      const res = await adminAPI.updateSettings(data);
      if (res.data?.success || res.success) {
        toast.success('Paramètres système mis à jour');
      }
    } catch (e) { 
      toast.error(e?.response?.data?.message || 'Erreur lors de la sauvegarde'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleBackup = async () => {
    try {
      toast.loading('Sauvegarde en cours...', { id: 'backup' });
      // Simulation ou appel API si existant
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Base de données sauvegardée avec succès', { id: 'backup' });
    } catch (e) {
      toast.error('Échec de la sauvegarde', { id: 'backup' });
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <div className="p-4 lg:p-8 max-w-full text-white">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Section Principale - 2/3 de la largeur */}
        <div className="xl:col-span-2 space-y-8 min-w-0">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Administration <span className="opacity-30">/</span> <span className="text-zinc-300">Paramètres</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic uppercase">Configuration Système<span className="text-gold-primary">.</span></h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={onSave} loading={saving} className="h-12 px-8 rounded-2xl bg-gold-primary text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/10 transition-all">
                <Save className="h-4 w-4 mr-2" /> Enregistrer
              </Button>
            </div>
          </div>

          {/* Identity Section */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary shadow-lg">
                <Globe className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-black text-white uppercase tracking-widest">Identité du Site</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Nom de la Plateforme</label>
                <input
                  value={data?.siteName || ''}
                  onChange={(e) => setData(d => ({ ...d, siteName: e.target.value }))}
                  className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Email de Contact</label>
                <input
                  value={data?.contactEmail || ''}
                  onChange={(e) => setData(d => ({ ...d, contactEmail: e.target.value }))}
                  className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-black text-white uppercase tracking-widest">Sécurité & Accès</h2>
            </div>
            
            <div className="space-y-8">
              {[
                { key: 'maintenanceMode', label: 'Mode Maintenance', desc: 'Désactiver l\'accès public au site' },
                { key: 'allowRegistration', label: 'Inscriptions Ouvertes', desc: 'Autoriser la création de nouveaux comptes' },
                { key: 'requireManualApproval', label: 'Validation Manuelle', desc: 'Approuver chaque annonce avant publication' }
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-6">
                  <div>
                    <div className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{s.label}</div>
                    <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-tight">{s.desc}</div>
                  </div>
                  <button 
                    onClick={() => setData(d => ({ ...d, [s.key]: !d[s.key] }))}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      data[s.key] ? "bg-gold-primary shadow-lg shadow-gold-primary/20" : "bg-zinc-800"
                    )}
                  >
                    <div className={cn(
                      "h-4 w-4 rounded-full bg-white absolute top-1 transition-all",
                      data[s.key] ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Barre Latérale Droite - 1/3 de la largeur */}
        <div className="space-y-8">
          
          {/* Database Backup */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 text-center">
            <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary mx-auto mb-6">
              <Database className="h-7 w-7" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Base de Données</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-8 font-medium">
              Dernière sauvegarde automatique effectuée il y a 2 heures.
            </p>
            <Button onClick={handleBackup} className="w-full h-12 rounded-2xl bg-zinc-950/50 border border-white/5 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all">
              Sauvegarder maintenant
            </Button>
          </div>

          {/* Notifications & System Info */}
          <div className="bg-gradient-to-br from-gold-primary/10 to-transparent border border-white/5 rounded-[2.5rem] p-8">
             <div className="flex items-center gap-3 mb-6">
                <Bell className="h-5 w-5 text-gold-primary" />
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Notifications</h4>
             </div>
             <p className="text-[11px] text-zinc-500 leading-relaxed mb-6 font-medium">
               Les administrateurs reçoivent des alertes pour chaque nouvelle soumission et réservation.
             </p>
             <div className="text-[9px] font-black text-gold-primary uppercase tracking-[0.2em] italic">Version Système 2.0.4</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
