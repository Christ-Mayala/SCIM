import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, Building2, MessageSquare, Users, AlertCircle,
  Settings, Star, CalendarDays, Eye, ClipboardList, TrendingUp,
  CheckCircle, Clock, XCircle, Heart, Zap, ArrowRight, MousePointer2
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { adminAPI, formatDate, formatPrice, reservationAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const COLORS = ['#FFB703', '#FB8500', '#219EBC', '#8ECAE6', '#023047', '#E63946'];
const PALETTE = ['#f59e0b', '#f97316', '#3b82f6', '#06b6d4', '#1d4ed8', '#ef4444', '#10b981'];

/* ─── Stat Card ─── */
const STAT_VARIANTS = {
  gold:    { wrap: 'bg-white', bar: 'bg-amber-400',   icon: 'bg-amber-50 text-amber-500',   num: 'text-zinc-900', lbl: 'text-zinc-500', hint: 'text-amber-600'    },
  danger:  { wrap: 'bg-white', bar: 'bg-red-500',     icon: 'bg-red-50 text-red-500',       num: 'text-zinc-900', lbl: 'text-zinc-500', hint: 'text-red-600'      },
  success: { wrap: 'bg-white', bar: 'bg-emerald-500', icon: 'bg-emerald-50 text-emerald-600', num: 'text-zinc-900', lbl: 'text-zinc-500', hint: 'text-emerald-600' },
  info:    { wrap: 'bg-white', bar: 'bg-blue-500',    icon: 'bg-blue-50 text-blue-500',     num: 'text-zinc-900', lbl: 'text-zinc-500', hint: 'text-blue-600'     },
  default: { wrap: 'bg-white', bar: 'bg-zinc-400',    icon: 'bg-zinc-100 text-zinc-500',    num: 'text-zinc-900', lbl: 'text-zinc-500', hint: 'text-zinc-500'     },
};

const StatCard = ({ title, value, icon: Icon, hint, variant = 'default' }) => {
  const v = STAT_VARIANTS[variant] || STAT_VARIANTS.default;
  return (
    <div className={cn('relative overflow-hidden rounded-[2rem] border border-zinc-200/80 shadow-sm p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1', v.wrap)}>
      <div className={cn('absolute inset-x-0 top-0 h-1.5', v.bar)} />
      <div className="flex items-start gap-3">
        <div className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', v.icon)}>
          <Icon className="h-5.5 w-5.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn('text-[9px] font-black uppercase tracking-wider leading-tight mb-1', v.lbl)}>{title}</p>
          <p className={cn('text-3xl font-black leading-none tracking-tight', v.num)}>{value ?? '—'}</p>
          {hint && <p className={cn('mt-2 text-[9px] font-bold uppercase tracking-widest opacity-80', v.hint)}>{hint}</p>}
        </div>
      </div>
    </div>
  );
};

/* ─── Quick Link ─── */
const QuickLinkCard = ({ title, icon: Icon, to }) => (
  <Link to={to} className="group block h-full">
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 rounded-2xl bg-white p-3 sm:p-4 h-full border border-zinc-200 shadow-sm transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1">
      <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-zinc-900 text-amber-400 transition-colors group-hover:bg-amber-400 group-hover:text-zinc-900 shadow-lg shadow-zinc-900/10">
        <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </div>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center sm:text-left text-zinc-700 group-hover:text-zinc-900 leading-tight truncate w-full">
        {title}
      </span>
    </div>
  </Link>
);

/* ─── Donut Chart with legend ─── */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="relative bg-zinc-900 border-b border-white/10 shadow-2xl rounded-2xl px-4 py-3 text-xs">
      <span className="font-black text-white uppercase tracking-widest">{payload[0].name}</span>
      <div className="mt-1 font-bold text-amber-400">{payload[0].value} biens</div>
    </div>
  );
};

const TypeDonut = ({ data }) => {
  if (!data?.length) return (
    <div className="flex flex-col items-center justify-center h-52 text-zinc-400">
      <BarChart3 className="h-10 w-10 mb-2 opacity-30" />
      <span className="text-sm">Aucune donnée</span>
    </div>
  );
  const chartData = data.map((d, i) => ({ name: d._id || 'Autre', value: d.count, color: PALETTE[i % PALETTE.length] }));
  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" nameKey="name">
            {chartData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
        {chartData.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-zinc-500">{d.name}</span>
            <span className="text-zinc-900">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Status Badge ─── */
const ReserStatus = ({ status }) => {
  const map = {
    confirmee:  { label: 'Confirmée', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    confirmée:  { label: 'Confirmée', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    en_attente: { label: 'En attente', cls: 'bg-amber-50 text-amber-600 border-amber-100' },
    annulee:    { label: 'Annulée', cls: 'bg-red-50 text-red-600 border-red-100' },
    annulée:    { label: 'Annulée', cls: 'bg-red-50 text-red-600 border-red-100' },
  };
  const s = map[status] || { label: status || '—', cls: 'bg-zinc-50 text-zinc-600 border-zinc-100' };
  return <span className={cn('px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border', s.cls)}>{s.label}</span>;
};

/* ─── Main Page ─── */
const AdminDashboardPage = () => {
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [data, setData]             = useState(null);
  const [reservations, setReservations] = useState([]);
  const [statusActionId, setStatusActionId] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, reservationsRes] = await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getReservations({ page: 1, limit: 5 }).catch(() => ({ data: {} })),
        ]);
        const statsData = statsRes.data?.data || statsRes.data;
        setData(statsData);
        const rd = reservationsRes.data?.data || reservationsRes.data;
        setReservations(Array.isArray(rd?.reservations) ? rd.reservations : Array.isArray(rd?.items) ? rd.items : []);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Erreur');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const normalizePhone = (v) => {
    const raw = String(v || '').trim();
    if (!raw) return '';
    const d = raw.replace(/[^\d]/g, '');
    if (!d) return '';
    if (raw.startsWith('+')) return `+${d}`;
    if (d.startsWith('00')) return `+${d.slice(2)}`;
    const local = d.replace(/^0+/, '');
    return local ? `+242${local}` : '';
  };

  const buildWhatsappUrl = (r) => {
    const phone = normalizePhone(r?.user?.telephone || '');
    if (!phone) return null;
    const ref = r?.reference || r?._id || '';
    const title = r?.property?.titre || 'votre réservation';
    const txt = `Bonjour, suivi SCIM – ${title}. Réf: ${ref}.`;
    return `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(txt)}`;
  };

  const updateStatus = async (id, action) => {
    try {
      setStatusActionId(`${action}:${id}`);
      const res = action === 'confirm' ? await reservationAPI.confirm(id) : await reservationAPI.cancel(id);
      const updated = res?.data?.data || res?.data;
      if (updated?._id) setReservations(prev => prev.map(r => r._id === id ? { ...r, ...updated } : r));
    } catch (e) {
      alert(e?.response?.data?.message || 'Erreur');
    } finally {
      setStatusActionId('');
    }
  };

  const stats         = data?.stats || {};
  const topProperties = Array.isArray(data?.topProperties) ? data.topProperties : [];
  const propertyTypes = Array.isArray(data?.propertyTypes) ? data.propertyTypes : [];

  const reservationStats = useMemo(() => {
    const total     = reservations.length;
    const pending   = reservations.filter(r => /attente|pending/i.test(r.status || '')).length;
    const confirmed = reservations.filter(r => /confirm/i.test(r.status || '')).length;
    return { total, pending, confirmed };
  }, [reservations]);

  const recentReservations = useMemo(
    () => [...reservations].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0, 5),
    [reservations]
  );

  const quickLinks = [
    { to: '/admin/properties', title: 'Annonces', icon: Building2 },
    { to: '/admin/submissions', title: 'Soumissions', icon: ClipboardList },
    { to: '/admin/reservations', title: 'Visites', icon: CalendarDays },
    { to: '/admin/users', title: 'Membres', icon: Users },
    { to: '/admin/messages', title: 'Messages', icon: MessageSquare },
    { to: '/admin/analytics', title: 'Analyse', icon: BarChart3 },
    { to: '/admin/settings', title: 'Réglages', icon: Settings },
  ];

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (error) return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="rounded-[2rem] bg-white p-10 border border-red-200 shadow-sm flex flex-col items-center gap-6">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600 shrink-0">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black text-zinc-900 uppercase tracking-widest leading-none">Problème de connexion</h3>
          <p className="text-sm font-medium text-zinc-500 mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-8 rounded-xl px-8 h-12 shadow-lg shadow-zinc-900/10 bg-zinc-900">Actualiser</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ── Header Section ── */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white mb-4 shadow-lg shadow-zinc-900/10">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Intelligence Administrative
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Bonjour, Admin</h1>
            <p className="text-sm font-medium text-zinc-500 mt-1">Voici ce qui se passe sur votre plateforme aujourd'hui.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/properties/new">
              <Button className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-6 shadow-xl shadow-gold-primary/20 bg-gold-primary hover:bg-amber-300 text-zinc-900 gap-2 hover:-translate-y-1 transition-all">
                <Building2 className="h-4 w-4" /> Publier un bien
              </Button>
            </Link>
            <Link to="/admin/messages">
              <Button variant="outline" className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-6 border-zinc-200 bg-white hover:bg-zinc-50 transition-all">
                Messagerie
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          <StatCard title="Biens Publics"  value={stats.totalProperties ?? '—'} icon={Building2}    hint={stats.activeProperties != null ? `${stats.activeProperties} actifs`      : undefined} variant="gold"    />
          <StatCard title="Utilisateurs"   value={stats.totalUsers       ?? '—'} icon={Users}        hint={stats.newUsersThisMonth != null ? `+${stats.newUsersThisMonth} ce mois` : undefined} variant="info"    />
          <StatCard title="Messages"       value={stats.totalMessages    ?? '—'} icon={MessageSquare} hint={stats.unreadMessages != null ? `${stats.unreadMessages} non lus`       : undefined} variant={(stats.unreadMessages || 0) > 0 ? 'danger' : 'default'} />
          <StatCard title="Visites"        value={reservationStats.total}         icon={CalendarDays}  hint={`${reservationStats.pending} en attente`} variant="default" />
          <StatCard title="Confirmées"     value={reservationStats.confirmed}     icon={CheckCircle}   hint="Visites approuvées" variant="success" />
        </div>

        {/* ── Quick Links ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
             <div className="h-2 w-2 rounded-full bg-gold-primary animate-pulse" />
             <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Raccourcis de gestion</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {quickLinks.map(l => <QuickLinkCard key={l.to} {...l} />)}
          </div>
        </section>

        {/* ── Middle Row: Top Properties + Donut ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Top Properties */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-sm p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-amber-500" /> Annonces populaires
              </h2>
              <Link to="/admin/properties" className="text-[10px] font-black uppercase tracking-widest text-gold-dark hover:text-amber-600 transition-colors flex items-center gap-2">
                 Voir tout <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="flex-1">
              {topProperties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-400 h-full">
                  <div className="h-16 w-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-4">
                     <Building2 className="h-8 w-8 opacity-20" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Aucune donnée d'audience</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {topProperties.map((p, i) => (
                    <div key={p._id} className="flex items-center gap-5 group py-1">
                      {/* Rank */}
                      <div className={cn(
                        'h-8 w-8 shrink-0 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ring-1 ring-inset',
                        i === 0 ? 'bg-zinc-900 text-gold-primary ring-zinc-800' : 'bg-zinc-50 text-zinc-400 ring-zinc-200'
                      )}>
                        {i + 1}
                      </div>
                      {/* Thumbnail */}
                      <div className="h-16 w-16 shrink-0 rounded-2xl overflow-hidden bg-zinc-100 ring-1 ring-zinc-200">
                        <img
                          src={p.images?.[0]?.url || '/images/scim-logo.jpg'}
                          alt={p.titre}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/properties/${p._id}`} className="font-black text-zinc-900 hover:text-gold-dark transition-colors text-sm uppercase tracking-tight leading-tight line-clamp-2">
                          {p.titre}
                        </Link>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-tight">{p.ville} · <span className="text-zinc-500">{p.categorie}</span></p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                            <Eye className="h-3 w-3 text-zinc-300" />
                            <span className="text-zinc-900">{p.views || 0}</span> vues
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                            <Heart className="h-3 w-3 text-rose-300" />
                            <span className="text-zinc-900">{p.favoritedBy?.length || p.favorites || 0}</span> favoris
                          </span>
                        </div>
                      </div>
                      {/* Price */}
                      <div className="text-right shrink-0">
                        <div className="text-lg font-black text-zinc-900 tracking-tighter">{formatPrice?.(p.prix)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-sm p-8 flex flex-col">
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-blue-500" /> Répartition
            </h2>
            <div className="flex-1 flex flex-col justify-center">
               <TypeDonut data={propertyTypes} />
            </div>
          </div>
        </div>

        {/* ── Recent Reservations ── */}
        <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-sm overflow-hidden mb-12">
          <div className="flex items-center justify-between px-10 py-8 border-b border-zinc-100 bg-zinc-50/30">
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-amber-500" /> Visites Récentes
            </h2>
            <Link to="/admin/reservations" className="text-[10px] font-black uppercase tracking-widest text-gold-dark hover:text-amber-600 transition-colors flex items-center gap-2">
               Journal complet <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-2">
            {recentReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <CalendarDays className="h-10 w-10 mb-2 opacity-10" />
                <span className="text-[10px] font-black uppercase tracking-widest">Aucune visite planifiée</span>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-zinc-50">
                      <th className="py-4 pl-8 pr-3 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Propriété</th>
                      <th className="py-4 px-3 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Visiteur</th>
                      <th className="hidden md:table-cell py-4 px-3 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Planifié le</th>
                      <th className="py-4 px-3 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Statut</th>
                      <th className="py-4 pl-3 pr-8 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {recentReservations.map(r => {
                      const isPending = /attente|pending/i.test(r.status || '');
                      const waUrl = buildWhatsappUrl(r);
                      return (
                        <tr key={r._id} className="hover:bg-zinc-50/50 transition-colors group">
                          <td className="py-5 pl-8 pr-3">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 shrink-0 rounded-[1rem] overflow-hidden bg-zinc-100 ring-1 ring-zinc-200">
                                <img
                                  src={r.property?.images?.[0]?.url || '/images/scim-logo.jpg'}
                                  alt={r.property?.titre || ''}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-black text-zinc-900 leading-tight line-clamp-2 uppercase tracking-tight">
                                  {r.property?.titre || 'Bien supprimé'}
                                </div>
                                <div className="text-[10px] font-bold text-zinc-400 mt-0.5 uppercase tracking-wide">{r.property?.ville}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-3">
                            <div className="text-sm font-black text-zinc-900 uppercase tracking-tighter">{r.user?.nom || r.user?.name || 'Client'}</div>
                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{r.user?.email || '—'}</div>
                          </td>
                          <td className="hidden md:table-cell py-5 px-3 text-center md:text-left">
                            <div className="inline-flex flex-col">
                               <span className="text-xs font-black text-zinc-900 tracking-tight">
                                  {r.date ? new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—'}
                               </span>
                               <span className="text-[9px] font-bold text-zinc-400 uppercase">{r.date ? new Date(r.date).getFullYear() : ''}</span>
                            </div>
                          </td>
                          <td className="py-5 px-3">
                            <ReserStatus status={r.status} />
                          </td>
                          <td className="py-4 pl-3 pr-8">
                            <div className="flex items-center justify-end gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              {isPending && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateStatus(r._id, 'confirm')}
                                    loading={statusActionId === `confirm:${r._id}`}
                                    className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 border-none text-white shadow-lg shadow-emerald-500/10"
                                  >
                                    Confirmer
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateStatus(r._id, 'cancel')}
                                    loading={statusActionId === `cancel:${r._id}`}
                                    className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 border-red-100 hover:bg-red-50"
                                  >
                                    Décliner
                                  </Button>
                                </>
                              )}
                              {waUrl && (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-9 w-12 inline-flex items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all shadow-sm ring-1 ring-[#25D366]/20"
                                  title="WhatsApp"
                                >
                                  <MousePointer2 className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
