import React, { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { adminAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await adminAPI.getSettings();
        setData(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Erreur');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const onChange = (key, value) => {
    setData((prev) => ({ ...(prev || {}), [key]: value }));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await adminAPI.updateSettings(data || {});
      setData(res.data);
      alert('Paramètres enregistrés');
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900">Paramètres</h1>
            <div className="mt-1 text-sm text-zinc-600">Configuration du système</div>
          </div>
          <Button onClick={onSave} loading={saving} className="gap-2">
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-red-500/20 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-zinc-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-primary/10 text-gold-primary">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-zinc-900">Site</div>
              <div className="text-sm text-zinc-600">Nom, description, options</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div>
              <div className="text-sm font-medium text-zinc-900">Nom du site</div>
              <input
                value={data?.siteName || ''}
                onChange={(e) => onChange('siteName', e.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-gold-primary"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-zinc-900">Description</div>
              <textarea
                value={data?.siteDescription || ''}
                onChange={(e) => onChange('siteDescription', e.target.value)}
                className="mt-2 min-h-24 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4">
                <input
                  type="checkbox"
                  checked={Boolean(data?.maintenanceMode)}
                  onChange={(e) => onChange('maintenanceMode', e.target.checked)}
                />
                <div>
                  <div className="text-sm font-medium text-zinc-900">Mode maintenance</div>
                  <div className="text-xs text-zinc-600">Bloquer l'accès public</div>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4">
                <input
                  type="checkbox"
                  checked={Boolean(data?.allowRegistration)}
                  onChange={(e) => onChange('allowRegistration', e.target.checked)}
                />
                <div>
                  <div className="text-sm font-medium text-zinc-900">Autoriser l'inscription</div>
                  <div className="text-xs text-zinc-600">Nouveaux comptes</div>
                </div>
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4">
              <input
                type="checkbox"
                checked={Boolean(data?.emailNotifications)}
                onChange={(e) => onChange('emailNotifications', e.target.checked)}
              />
              <div>
                <div className="text-sm font-medium text-zinc-900">Notifications email</div>
                <div className="text-xs text-zinc-600">Activer/désactiver</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
