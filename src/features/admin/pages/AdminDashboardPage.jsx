import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, MessageSquare, Users, CalendarDays, CheckCircle, Clock,
  Plus, ArrowRight, Home, BarChart3, Activity, RefreshCw, TrendingUp,
  XCircle, Eye, CheckCheck,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { adminAPI, formatPrice } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';
import KpiCard from '../../../components/admin/KpiCard';
import ActivityTimeline from '../../../components/admin/ActivityTimeline';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboardStats();
      setData(res.data?.data || res.data);
    } catch (e) {
      console.error('Dashboard stats error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats       = data?.stats       || {};
  const feed        = data?.feed        || {};
  const salesData   = data?.salesData   || [];
  const recentProps = data?.recentProperties || feed?.properties || [];

  const chartData = salesData.map(item => ({
    name:         item.name         || '—',
    proprietes:   item.properties   || 0,
    reservations: item.reservations || 0,
    utilisateurs: item.users        || 0,
  }));

  const timeAgo = (value) => {
    if (!value) return 'Récemment';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Récemment';
    const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    return `Il y a ${Math.floor(diffH / 24)}j`;
  };

  const RESERVATION_ACTIVITY_CONFIG = {
    confirmee:  { status: 'success', badge: 'Confirmé', icon: CheckCircle },
    annulee:    { status: 'warning', badge: 'Annulé',   icon: XCircle },
    terminee:   { status: 'success', badge: 'Terminé',  icon: CheckCheck },
    en_attente: { status: 'pending', badge: 'En attente', icon: Clock },
  };

  const activities = (feed?.reservations || []).map(r => {
    const cfg = RESERVATION_ACTIVITY_CONFIG[r.status] || RESERVATION_ACTIVITY_CONFIG.en_attente;
    return {
      title:       r.propertyTitle || 'Demande de visite',
      description: r.customer      || 'Client',
      time:        timeAgo(r.updatedAt || r.createdAt),
      status:      cfg.status,
      badge:       cfg.badge,
      icon:        cfg.icon,
    };
  });

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gold-primary animate-pulse">
        Chargement...
      </p>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-full bg-[#0d0d0d] text-white min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
        <div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Administration</p>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight italic uppercase">
            Tableau de bord<span className="text-gold-primary">.</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="h-10 w-10 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link to="/admin/properties/new">
            <Button className="h-10 px-6 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/20 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Ajouter un bien
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Annonces actives" value={stats.activeProperties  ?? 0} icon={Building2}    trend="up"      trendValue="+12"       trendLabel="ce mois"    color="gold"    />
        <KpiCard title="Réservations"     value={stats.totalReservations ?? 0} icon={CalendarDays}  trend="pending" trendValue="en cours"                          color="orange"  />
        <KpiCard title="Utilisateurs"     value={stats.totalUsers        ?? 0} icon={Users}         trend="up"      trendValue="+32"       trendLabel="nouveaux"   color="emerald" />
        <KpiCard title="Messages non lus" value={stats.unreadMessages    ?? 0} icon={MessageSquare} trend="pending" trendValue="à traiter"                         color="blue"    />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Graphique — 2 colonnes */}
        <div className="xl:col-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Vue d'ensemble</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Activité des 6 derniers mois</p>
            </div>
            <div className="flex items-center gap-5">
              {[
                { color: 'bg-gold-primary', label: 'Biens' },
                { color: 'bg-emerald-500', label: 'Utilisateurs' },
                { color: 'bg-orange-500', label: 'Réservations' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] font-black text-zinc-500 uppercase">
                  <span className={cn('h-2 w-2 rounded-full', color)} /> {label}
                </div>
              ))}
            </div>
          </div>
          <div className="h-64">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-700">
                <p className="text-xs font-black uppercase tracking-widest">Pas encore de données</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    {[
                      { id: 'cBiens', color: '#d4af37' },
                      { id: 'cUsers', color: '#10b981' },
                      { id: 'cRes',   color: '#f59e0b' },
                    ].map(({ id, color }) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={color} stopOpacity={0}   />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="proprietes"   stroke="#d4af37" strokeWidth={2.5} fill="url(#cBiens)" name="Biens"         dot={false} />
                  <Area type="monotone" dataKey="utilisateurs" stroke="#10b981" strokeWidth={2}   fill="url(#cUsers)" name="Utilisateurs"   dot={false} />
                  <Area type="monotone" dataKey="reservations" stroke="#f59e0b" strokeWidth={2}   fill="url(#cRes)"   name="Réservations"   dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Actions rapides — 1 colonne */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-7 flex flex-col gap-5">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Actions Rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/admin/properties',   icon: Home,        label: 'Annonces',     color: 'text-gold-primary',   bg: 'bg-gold-primary/10' },
              { to: '/admin/reservations', icon: CalendarDays, label: 'Visites',     color: 'text-orange-400',     bg: 'bg-orange-500/10' },
              { to: '/admin/users',        icon: Users,        label: 'Membres',     color: 'text-emerald-400',    bg: 'bg-emerald-500/10' },
              { to: '/admin/analytics',    icon: BarChart3,    label: 'Rapports',    color: 'text-violet-400',     bg: 'bg-violet-500/10' },
              { to: '/admin/messages',     icon: MessageSquare,label: 'Messages',    color: 'text-blue-400',       bg: 'bg-blue-500/10' },
              { to: '/admin/submissions',  icon: Activity,     label: 'Soumissions', color: 'text-amber-400',      bg: 'bg-amber-500/10' },
            ].map(({ to, icon: Icon, label, color, bg }) => (
              <Link key={to} to={to}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-white/5 bg-zinc-950/30 hover:border-gold-primary/20 hover:bg-zinc-900/60 transition-all group"
              >
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', bg)}>
                  <Icon className={cn('h-4 w-4', color)} />
                </div>
                <span className="text-[9px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Stats résumé */}
          <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-3 gap-3">
            {[
              { label: 'Total Biens', value: stats.totalProperties ?? 0, color: 'text-gold-primary' },
              { label: 'Actifs',      value: stats.activeProperties ?? 0, color: 'text-emerald-400' },
              { label: 'Suspendus',   value: (stats.totalProperties ?? 0) - (stats.activeProperties ?? 0), color: 'text-red-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-zinc-950/30 rounded-xl p-3 border border-white/5 text-center">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
                <p className={cn('text-lg font-black', color)}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente — 2 colonnes */}
        <div className="xl:col-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Activité Récente</h2>
            <Link to="/admin/reservations"
              className="text-[10px] font-black text-zinc-500 hover:text-gold-primary uppercase tracking-widest flex items-center gap-1 transition-colors"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-700">
              <CalendarDays className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-xs font-black uppercase tracking-widest">Aucune activité récente</p>
            </div>
          ) : (
            <ActivityTimeline activities={activities} />
          )}
        </div>

        {/* Dernières annonces — 1 colonne */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Dernières Annonces</h3>
            <Link to="/admin/properties"
              className="text-[10px] font-black text-zinc-500 hover:text-gold-primary uppercase tracking-widest transition-colors"
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {recentProps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-700">
                <Building2 className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-[10px] font-black uppercase tracking-widest">Aucune annonce récente</p>
              </div>
            ) : recentProps.slice(0, 5).map((p, i) => (
              <Link key={p._id || i} to={`/admin/properties/${p._id}/edit`}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/30 border border-white/5 hover:border-gold-primary/20 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl overflow-hidden bg-zinc-800 border border-white/5 shrink-0">
                  {p.images?.[0]?.url
                    ? <img src={p.images[0].url} alt={p.titre} className="h-full w-full object-cover" />
                    : <Building2 className="h-5 w-5 text-zinc-600 m-auto mt-2.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white truncate group-hover:text-gold-primary transition-colors">
                    {p.titre || 'Bien immobilier'}
                  </p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{p.ville || '—'}</p>
                </div>
                <span className="text-[10px] font-black text-gold-primary shrink-0">{formatPrice(p.prix)}</span>
              </Link>
            ))}
          </div>

          {/* Profil admin */}
          <div className="mt-5 pt-5 border-t border-white/5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold-primary flex items-center justify-center text-black font-black text-sm shrink-0">
              {(user?.nom || user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white uppercase truncate">
                {user?.nom || user?.name || 'Administrateur'}
              </p>
              <p className="text-[9px] font-black text-gold-primary uppercase tracking-widest">Super Admin</p>
            </div>
            <Link to="/profile" className="ml-auto">
              <button className="h-8 w-8 rounded-lg border border-white/5 bg-zinc-900 hover:bg-white/5 text-zinc-500 hover:text-white flex items-center justify-center transition-all">
                <Eye className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
