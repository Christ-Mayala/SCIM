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

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-amber-400 shadow-lg shadow-zinc-900/10">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em]">{title}</h3>
      <p className="text-xs font-medium text-zinc-500 mt-1">{description}</p>
    </div>
  </div>
);

const SettingItem = ({ label, description, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 first:pt-0 last:pb-0 border-b border-zinc-100 last:border-none">
    <div className="max-w-md">
      <div className="text-sm font-black text-zinc-900 mb-1">{label}</div>
      <div className="text-xs font-medium text-zinc-500 leading-relaxed">{description}</div>
    </div>
    <div className="sm:min-w-[200px] flex justify-end">
      {children}
    </div>
  </div>
);

const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  const reloadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getSettings();
      setData(res.data?.data || res.data || {});
    } catch (e) {
      setError(e?.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadSettings();
  }, []);

  const onChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await adminAPI.updateSettings(data);
      toast.success('Paramètres enregistrés avec succès');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Action impossible');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 shadow-sm">
              <Settings className="h-3.5 w-3.5 text-gold-primary" />
              Configuration Système
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Paramètres</h1>
            <p className="mt-1 text-sm font-medium text-zinc-500">Gérez le fonctionnement global de SCIM.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button 
                variant="outline" 
                onClick={reloadSettings}
                className="h-12 px-6 rounded-2xl border-zinc-200 font-bold bg-white hover:bg-zinc-50 gap-2"
             >
                <RefreshCw className="h-4 w-4" />
             </Button>
             <Button 
                onClick={onSave} 
                loading={saving} 
                className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-gold-primary/20 bg-gold-primary hover:bg-amber-300 text-zinc-900 gap-2"
             >
                <Save className="h-4 w-4" />
                Mettre à jour
             </Button>
          </div>
        </div>

        {error && (
          <div className="mb-10 p-6 rounded-[2rem] bg-red-50 border border-red-100 text-red-700 text-sm font-medium flex items-center gap-4">
            <AlertTriangle className="h-6 w-6" /> {error}
          </div>
        )}

        <div className="space-y-12">
          
          {/* Section 1: Global */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm p-10">
            <SectionHeader 
               icon={Globe} 
               title="Identité & Site" 
               description="Configurez les informations publiques de votre plateforme." 
            />
            <div className="space-y-2">
               <SettingItem 
                  label="Nom du site" 
                  description="Le nom qui apparaîtra dans les emails et sur l'onglet du navigateur."
               >
                  <input
                    value={data?.siteName || ''}
                    onChange={(e) => onChange('siteName', e.target.value)}
                    placeholder="SCIM Immobilier"
                    className="h-12 w-full max-w-[300px] rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-gold-primary transition-all"
                  />
               </SettingItem>
               
               <SettingItem 
                  label="Description" 
                  description="Une brève description utilisée pour le SEO et les métadonnées."
               >
                  <textarea
                    value={data?.siteDescription || ''}
                    onChange={(e) => onChange('siteDescription', e.target.value)}
                    placeholder="La plateforme immobilière de référence au Congo..."
                    rows={3}
                    className="w-full max-w-[300px] rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-900 outline-none focus:bg-white focus:border-gold-primary transition-all resize-none"
                  />
               </SettingItem>

               <SettingItem 
                  label="Email de contact" 
                  description="Adresse mail officielle pour recevoir les demandes clients."
               >
                  <input
                    type="email"
                    value={data?.contactEmail || ''}
                    onChange={(e) => onChange('contactEmail', e.target.value)}
                    placeholder="contact@scim.cg"
                    className="h-12 w-full max-w-[300px] rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-gold-primary"
                  />
               </SettingItem>
            </div>
          </div>

          {/* Section 2: Security & Privacy */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm p-10">
            <SectionHeader 
               icon={Shield} 
               title="Sécurité & Accès" 
               description="Contrôlez les inscriptions et la visibilité du site." 
            />
            <div className="space-y-2">
               <SettingItem 
                  label="Mode Maintenance" 
                  description="Si activé, seuls les administrateurs pourront accéder au site."
               >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={Boolean(data?.maintenanceMode)}
                      onChange={(e) => onChange('maintenanceMode', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-zinc-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-primary"></div>
                  </label>
               </SettingItem>

               <SettingItem 
                  label="Inscriptions" 
                  description="Autoriser les nouveaux visiteurs à créer un compte client."
               >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={Boolean(data?.allowRegistration)}
                      onChange={(e) => onChange('allowRegistration', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-zinc-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-primary"></div>
                  </label>
               </SettingItem>

               <SettingItem 
                  label="Validation manuelle" 
                  description="Exiger une validation admin pour chaque nouvelle annonce soumise."
               >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={Boolean(data?.requireManualApproval ?? true)}
                      onChange={(e) => onChange('requireManualApproval', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-zinc-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-primary"></div>
                  </label>
               </SettingItem>
            </div>
          </div>

          {/* Section 3: Notifications */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm p-10">
            <SectionHeader 
               icon={Bell} 
               title="Notifications & Emails" 
               description="Gérez les alertes automatiques envoyées par le système." 
            />
            <div className="space-y-2">
               <SettingItem 
                  label="Emails de soumission" 
                  description="Prévenir l'admin par email lorsqu'un bien est soumis."
               >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={Boolean(data?.emailNotifications)}
                      onChange={(e) => onChange('emailNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-zinc-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-primary"></div>
                  </label>
               </SettingItem>

               <SettingItem 
                  label="Alertes WhatsApp" 
                  description="Recevoir une alerte WhatsApp pour les réservations critiques."
               >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={Boolean(data?.whatsappAlerts)}
                      onChange={(e) => onChange('whatsappAlerts', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-zinc-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-primary"></div>
                  </label>
               </SettingItem>
            </div>
          </div>

          {/* Section 4: Advance / Cache */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm p-10 opacity-60 grayscale-[0.5] pointer-events-none">
             <SectionHeader 
                icon={Database} 
                title="Données & Cache (Bientôt)" 
                description="Optimisez les performances et gérez les sauvegardes." 
             />
             <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest italic mt-4">
                Cette section sera disponible dans une prochaine mise à jour.
             </div>
          </div>

        </div>

        <div className="mt-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">SCIM Admin Version 2.0.4 — © 2026</p>
        </div>

      </div>
    </div>
  );
};

export default AdminSettingsPage;
