import React, { useEffect, useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { adminAPI, formatPrice } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import {
  TrendingUp, Users, Home, Zap, RefreshCw, Shield, Building2,
  Clock, CheckCircle, AlertTriangle, User, Download,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/Button';
import KpiCard from '../../../components/admin/KpiCard';
import toast from 'react-hot-toast';

const PERIOD_LABELS = {
  week: 'Cette semaine',
  month: 'Ce mois-ci',
  quarter: 'Ce trimestre',
  year: 'Cette année',
};

// Calcule la plage [from, to] correspondant à la période sélectionnée (Sem./Mois/Trim./Année).
const getPeriodRange = (period) => {
  const to = new Date();
  const from = new Date();
  if (period === 'week') {
    from.setDate(to.getDate() - 7);
  } else if (period === 'quarter') {
    from.setMonth(to.getMonth() - 3);
  } else if (period === 'year') {
    from.setFullYear(to.getFullYear() - 1);
  } else {
    from.setMonth(to.getMonth() - 1);
  }
  return { from: from.toISOString(), to: to.toISOString() };
};

const AdminAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ properties: null, users: null, revenue: null, dashboard: null });
  const [activePeriod, setActivePeriod] = useState('month');
  const [reportDownloading, setReportDownloading] = useState(false);

  const handleDownloadReport = async () => {
    try {
      setReportDownloading(true);
      const { from, to } = getPeriodRange(activePeriod);
      await adminAPI.downloadActivityReport({ from, to, periodLabel: PERIOD_LABELS[activePeriod] });
      toast.success('Rapport d\'activité généré.');
    } catch (e) {
      toast.error('Téléchargement du rapport impossible.');
    } finally {
      setReportDownloading(false);
    }
  };

  const loadAll = async (period = activePeriod) => {
    try {
      setLoading(true);
      const { from, to } = getPeriodRange(period);
      const [pR, uR, rR, dR] = await Promise.all([
        adminAPI.getPropertyAnalytics({ from, to }),
        adminAPI.getUserAnalytics({ from, to }),
        adminAPI.getRevenueAnalytics({ from, to }),
        adminAPI.getDashboardStats(),
      ]);
      setData({
        properties: pR.data?.data || pR.data,
        users: uR.data?.data || uR.data,
        revenue: rR.data?.data || rR.data,
        dashboard: dR.data?.data || dR.data,
      });
    } catch (e) {
      console.error('Analytics fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(activePeriod); }, [activePeriod]); // eslint-disable-line react-hooks/exhaustive-deps

  const today = useMemo(() => {
    const d = new Date();
    return {
      str: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    };
  }, []);

  const revenueData = useMemo(() => {
    if (!data.revenue?.monthlyRevenue?.length) return [];
    return data.revenue.monthlyRevenue.map((d) => ({
      month: d.month?.slice(-2) || '',
      revenue: d.revenue || 0,
      completed: d.completed || 0,
    }));
  }, [data.revenue]);

  const typeData = useMemo(() => {
    if (!data.properties?.propertiesByCategory?.length) return [];
    return data.properties.propertiesByCategory.map((c) => ({ type: c.category || 'Autre', count: c.count || 0 }));
  }, [data.properties]);

  const cityCount = useMemo(() => data.properties?.topLocations?.length || 0, [data.properties]);
  const agentsCount = useMemo(() => data.properties?.distinctOwners || 0, [data.properties]);

  const confirmationRate = useMemo(() => {
    const total = data.dashboard?.stats?.totalReservations || 0;
    const confirmed = data.dashboard?.stats?.confirmedReservations || 0;
    if (!total) return 0;
    return Math.round((confirmed / total) * 100);
  }, [data.dashboard]);

  const userData = useMemo(() => {
    if (!data.users?.usersByRole?.length) return [];
    return data.users.usersByRole.map((r) => ({ role: r.role || 'Client', count: r.count || 0, revenue: r.revenue || 0 }));
  }, [data.users]);

  const timeAgo = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    return `Il y a ${Math.floor(diffH / 24)}j`;
  };

  const recentActivities = useMemo(() => {
    if (!data.dashboard?.recentActivities?.length) return [];
    return data.dashboard.recentActivities.slice(0, 5).map((item, i) => ({
      id: i,
      title: item.title || item.description || 'Activité',
      status: item.status === 'warning' || item.status === 'danger' ? 'pending' : 'success',
      time: timeAgo(item.time),
      by: item.description || '—',
    }));
  }, [data.dashboard]);

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gold-primary animate-pulse">Chargement des rapports...</p>
    </div>
  );

  const stats = {
    totalProperties: data.properties?.totalProperties || 0,
    activeProperties: data.properties?.activeProperties || 0,
    totalUsers: data.users?.totalUsers || 0,
    totalRevenue: data.revenue?.totalRevenue || 0,
    completedReservations: data.revenue?.totalCompletedReservations || 0,
    newUsers: data.users?.newUsers,
    newProperties: data.properties?.newProperties,
  };

  const periods = [
    { id: 'week', label: 'Sem.' },
    { id: 'month', label: 'Mois' },
    { id: 'quarter', label: 'Trim.' },
    { id: 'year', label: 'Année' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-full text-white bg-[#0d0d0d] min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Rapports & Analyses</p>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight uppercase italic">
            Statistiques<span className="text-gold-primary">.</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 capitalize">{today.str}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-zinc-900/60 border border-white/5 rounded-xl p-1">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePeriod(p.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                  activePeriod === p.id ? 'bg-gold-primary text-black' : 'text-zinc-500 hover:text-white',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button
            onClick={() => loadAll(activePeriod)}
            className="h-10 w-10 rounded-xl bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-white p-0 flex items-center justify-center"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <KpiCard title="Total Revenus"       value={formatPrice(stats.totalRevenue)}      icon={Zap}       trend="pending" trendLabel={PERIOD_LABELS[activePeriod]} color="gold" />
        <KpiCard title="Transactions terminées" value={stats.completedReservations} icon={CheckCircle} trend="pending" trendValue={`${confirmationRate}%`} trendLabel="taux de finalisation" color="emerald" />
        <KpiCard title="Annonces Actives"    value={stats.activeProperties}               icon={Home}      trend="pending" trendValue={`${stats.totalProperties} total`} trendLabel={typeof stats.newProperties === 'number' ? `+${stats.newProperties} (${PERIOD_LABELS[activePeriod].toLowerCase()})` : undefined} color="violet" />
        <KpiCard title="Utilisateurs"        value={stats.totalUsers}                     icon={Users}     trend="pending" trendLabel={typeof stats.newUsers === 'number' ? `+${stats.newUsers} (${PERIOD_LABELS[activePeriod].toLowerCase()})` : 'Comptes enregistrés'} color="blue" />
      </div>

      {/* ── Charts row 1 — pleine largeur ── */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-widest">Revenus & Performances</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Évolution sur {revenueData.length} mois
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-gold-primary" /> Revenus
            </span>
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Terminées
              </span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gConf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} tickFormatter={(v) => v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : v} />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }} formatter={(v, n) => n === 'revenue' ? [formatPrice(v), 'Revenus'] : [v, 'Terminées']} />
              <Area type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2.5} fill="url(#gRev)" dot={{ fill: '#d4af37', r: 3, stroke: '#0d0d0d', strokeWidth: 2 }} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fill="url(#gConf)" dot={{ fill: '#10b981', r: 3, stroke: '#0d0d0d', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

        {/* Biens par Type */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gold-primary" /> Par type
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} barSize={28}>
                <defs>
                  <linearGradient id="gType" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 9 }} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="url(#gType)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clients par Catégorie */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-500" /> Clients
          </h3>
          <div className="space-y-4">
            {userData.length === 0 ? (
              <p className="text-xs text-zinc-600 text-center py-8">Pas de données</p>
            ) : userData.map((item, i) => {
              const max = Math.max(...userData.map((u) => u.count), 1);
              const colors = ['#d4af37', '#10b981', '#8b5cf6'];
              return (
                <div key={item.role}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                      <span className="text-xs font-black text-white uppercase">{item.role}</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-400">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(item.count / max) * 100}%`, background: colors[i % colors.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Résumé Performance */}
        <div className="bg-gradient-to-br from-gold-primary/10 to-transparent border border-white/5 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-gold-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Performance</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Taux de confirmation</p>
              </div>
              <p className="text-3xl font-black text-white">{confirmationRate}%</p>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${confirmationRate}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 text-center">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Villes</p>
                <p className="text-xl font-black text-white">{cityCount}</p>
              </div>
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 text-center">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Agents</p>
                <p className="text-xl font-black text-white">{agentsCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Activité + Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6">Activité Récente</h2>
          {recentActivities.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-8">Aucune activité récente</p>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((a, i) => (
                <div key={a.id} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950/30 border border-white/5">
                  <div className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                    a.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500',
                  )}>
                    {a.status === 'success' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{a.title}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{a.by} · {a.time}</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-gold-primary/60 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-gold-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Actions</h3>
          </div>
          <Button
            disabled={reportDownloading}
            onClick={handleDownloadReport}
            className="w-full h-12 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {reportDownloading ? 'Génération...' : 'Exporter Rapport'}
          </Button>
          <Button variant="outline" className="w-full h-12 rounded-2xl border-white/5 bg-zinc-950/50 hover:bg-white/5 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all">
            Voir Historique
          </Button>
          <div className="mt-auto pt-4 border-t border-white/5">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Dernière mise à jour</p>
            <p className="text-xs font-bold text-zinc-400 capitalize">{today.str}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
