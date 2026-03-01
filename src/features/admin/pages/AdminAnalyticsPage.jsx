import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Building2 } from 'lucide-react';
import { adminAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const AnalyticsCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 ring-1 ring-zinc-200 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-600">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900">{value}</div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-primary/10 text-gold-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

const AdminAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyAnalytics, setPropertyAnalytics] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const [p, u, r] = await Promise.all([
          adminAPI.getPropertyAnalytics(),
          adminAPI.getUserAnalytics(),
          adminAPI.getRevenueAnalytics(),
        ]);
        setPropertyAnalytics(p.data);
        setUserAnalytics(u.data);
        setRevenueAnalytics(r.data);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Erreur');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Analytics</h1>
          <div className="mt-1 text-sm text-zinc-600">Indicateurs clés (propriétés, utilisateurs, revenus)</div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-red-500/20 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnalyticsCard title="Annonces" value={propertyAnalytics?.totalProperties ?? '—'} icon={Building2} />
          <AnalyticsCard title="Utilisateurs" value={userAnalytics?.totalUsers ?? '—'} icon={Users} />
          <AnalyticsCard title="Revenus" value={revenueAnalytics?.totalRevenue ?? '—'} icon={TrendingUp} />
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-zinc-200 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gold-primary" />
            <div className="font-semibold text-zinc-900">Détails</div>
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
              <div className="font-medium text-zinc-900">Propriétés</div>
              <div className="mt-2 space-y-1">
                {propertyAnalytics ? (
                  Object.entries(propertyAnalytics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-zinc-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                      <span className="font-medium text-zinc-800">{String(value)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-500">Aucune donnée</div>
                )}
              </div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
              <div className="font-medium text-zinc-900">Utilisateurs</div>
              <div className="mt-2 space-y-1">
                {userAnalytics ? (
                  Object.entries(userAnalytics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-zinc-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                      <span className="font-medium text-zinc-800">{String(value)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-500">Aucune donnée</div>
                )}
              </div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
              <div className="font-medium text-zinc-900">Revenus</div>
              <div className="mt-2 space-y-1">
                {revenueAnalytics ? (
                  Object.entries(revenueAnalytics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-zinc-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                      <span className="font-medium text-zinc-800">{String(value)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-500">Aucune donnée</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
