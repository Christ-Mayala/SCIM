import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Globe, Clock, CheckCircle2, XCircle, Eye, Edit, Trash2,
  Plus, ChevronRight, MapPin, TrendingUp, Users, Zap, AlertTriangle, Calendar, RefreshCw,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { adminAPI, formatPrice } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import KpiCard from '../../../components/admin/KpiCard';
import DataTable from '../../../components/admin/DataTable';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const AdminPropertiesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  // Filtre statut : 'all' | 'active' | 'inactive'  (le schéma n'a que ces deux valeurs)
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState(null);
  const loadIdRef = useRef(0);
  const isMountedRef = useRef(false);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    load(1, statusFilter, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const load = async (page = 1, currentStatus = statusFilter, q = debouncedSearch) => {
    const callId = ++loadIdRef.current;
    try {
      setLoading(true);
      const [statsRes, propertiesRes] = await Promise.all([
        adminAPI.getPropertyAnalytics(),
        adminAPI.getProperties({
          page,
          limit: 10,
          search: q || undefined,
          // On n'envoie 'status' que si ce n'est pas 'all'
          ...(currentStatus && currentStatus !== 'all' ? { status: currentStatus } : {}),
        }),
      ]);
      if (callId !== loadIdRef.current) return;
      setData(statsRes.data?.data || statsRes.data);
      const rd = propertiesRes.data?.data || propertiesRes.data;
      setItems(rd?.properties || rd?.items || []);
      setPagination({
        page: rd?.page || 1,
        limit: 10,
        totalPages: rd?.totalPages || 1,
        totalItems: rd?.total || rd?.totalProperties || 0,
      });
    } catch (e) {
      if (callId !== loadIdRef.current) return;
      setError(e?.response?.data?.message || e?.message || 'Erreur de chargement');
    } finally {
      if (callId === loadIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    load(1, statusFilter, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = (newStatus) => {
    if (statusFilter === newStatus) return;
    setStatusFilter(newStatus);
    load(1, newStatus, debouncedSearch);
  };

  const handleDelete = async (row) => {
    if (!window.confirm('Supprimer cette annonce définitivement ?')) return;
    try {
      await adminAPI.deleteProperty(row._id);
      toast.success('Annonce supprimée');
      load(pagination.page, statusFilter, debouncedSearch);
    } catch (e) { toast.error(e?.response?.data?.message || 'Suppression impossible'); }
  };

  const handleToggleStatus = async (row) => {
    const newStatus = row.status === 'active' ? 'inactive' : 'active';
    try {
      await adminAPI.updatePropertyStatus(row._id, newStatus);
      toast.success(newStatus === 'active' ? 'Annonce activée' : 'Annonce suspendue');
      // mise à jour locale immédiate
      setItems(prev => prev.map(p => p._id === row._id ? { ...p, status: newStatus } : p));
    } catch (e) { toast.error('Mise à jour impossible'); }
  };

  // Charts — données réelles issues de l'API analytics (aucune valeur statique)
  const monthLabel = (ym) => {
    if (!ym) return '';
    const [y, m] = ym.split('-');
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('fr-FR', { month: 'short' });
  };
  const publicationTrendData = useMemo(
    () => (data?.publicationTrend || []).map((x) => ({ name: monthLabel(x.month), value: x.count || 0 })),
    [data],
  );
  const topViewedData = useMemo(
    () => (data?.topViewedProperties || []).map((p) => ({ name: p.titre || 'Bien', value: p.vues || 0 })),
    [data],
  );
  const categoryData = useMemo(
    () => (data?.propertiesByCategory || []).map((x) => ({ name: x.category || 'Autre', value: x.count || 0 })),
    [data],
  );
  const cityData = useMemo(
    () => (data?.topLocations || []).map((x) => ({ name: x.city || 'Autre', value: x.count || 0 })),
    [data],
  );
  const colors = ['#d4af37', '#10b981', '#6366f1', '#f59e0b'];

  const statusConfig = {
    active:   { label: 'Publié',   cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    inactive: { label: 'Suspendu', cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
  };

  const columns = [
    {
      key: 'photo', label: 'Photo',
      render: (p) => (
        <div className="h-12 w-12 rounded-xl overflow-hidden bg-zinc-800 border border-white/5 flex items-center justify-center">
          {p.images?.[0]?.url
            ? <img src={p.images[0].url} alt={p.titre} className="h-full w-full object-cover" />
            : <Building2 className="h-5 w-5 text-zinc-600" />}
        </div>
      ),
    },
    {
      key: 'titre', label: 'Bien',
      render: (p) => (
        <div>
          <p className="text-sm font-black text-white truncate max-w-[180px]">{p.titre || 'Sans titre'}</p>
          <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
            <MapPin className="h-2.5 w-2.5" /> {p.ville || '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'categorie', label: 'Type',
      render: (p) => (
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-zinc-400 border border-white/5">
          {p.categorie || '—'}
        </span>
      ),
    },
    {
      key: 'prix', label: 'Prix',
      render: (p) => <span className="text-sm font-black text-gold-primary">{formatPrice(p.prix)}</span>,
    },
    {
      key: 'vues', label: 'Vues',
      render: (p) => <span className="text-sm font-bold text-white">{p.vues ?? 0}</span>,
    },
    {
      key: 'status', label: 'Statut',
      render: (p) => {
        const cfg = statusConfig[p.status] || statusConfig.inactive;
        return (
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleStatus(p); }}
            title="Cliquer pour changer le statut"
            className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all hover:opacity-80', cfg.cls)}
          >
            {cfg.label}
          </button>
        );
      },
    },
  ];

  const stats = data || {};
  const recentItems = useMemo(() => items.slice(0, 5), [items]);

  return (
    <div className="p-6 lg:p-10 max-w-full bg-[#0d0d0d] text-white min-h-screen">
      <div className="space-y-10">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <Link to="/admin/dashboard" className="hover:text-zinc-300 transition-colors">Tableau de bord</Link>
                <ChevronRight className="h-3 w-3 opacity-30" />
                <span className="text-zinc-300">Annonces</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight uppercase italic">
                Gestion des Annonces<span className="text-gold-primary">.</span>
              </h1>
              <p className="text-sm text-zinc-500 max-w-lg">
                Pilotez l'ensemble de votre portefeuille immobilier depuis une interface centralisée.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => load(pagination.page, statusFilter, debouncedSearch)}
                className="h-11 w-11 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              </button>
              <Link to="/admin/properties/new">
                <Button className="h-11 px-6 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/20 flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Ajouter un bien
                </Button>
              </Link>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Total biens"    value={stats.totalProperties || 0}   icon={Building2}   trend="pending" trendValue={`${stats.activeProperties || 0} actifs`} color="gold" />
            <KpiCard title="Publiés"        value={stats.activeProperties || 0}  icon={Globe}       trend="up"      trendLabel="En ligne"     color="emerald" />
            <KpiCard title="Suspendus"      value={stats.inactiveProperties || 0} icon={XCircle}    trend="pending" trendLabel="Hors ligne"   color="red" />
            <KpiCard title="Total vues"     value={(stats.totalViews || 0).toLocaleString('fr-FR')} icon={TrendingUp} trend="pending" trendLabel="Cumulées" color="violet" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gold-primary" /> Évolution publications
              </h3>
              <div className="h-56">
                {publicationTrendData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-600">Pas de données</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={publicationTrendData}>
                      <defs>
                        <linearGradient id="gPub" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={2.5} fill="url(#gPub)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-500" /> Biens les plus vus
              </h3>
              <div className="h-56">
                {topViewedData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-600">Pas de données</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topViewedData} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={110} tick={{ fill: '#a1a1aa', fontSize: 9 }} tickFormatter={(v) => (v.length > 16 ? `${v.slice(0, 16)}…` : v)} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                      <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-violet-500" /> Par catégorie
              </h3>
              <div className="h-56">
                {categoryData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-600">Pas de données</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                        {categoryData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: '800' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" /> Par ville
              </h3>
              <div className="h-56">
                {cityData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-600">Pas de données</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cityData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                      <Bar dataKey="value" fill="#d4af37" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* DataTable — pleine largeur */}
          <DataTable
            columns={columns}
            data={items}
            loading={loading}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Rechercher une annonce..."
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            statusOptions={[
              { value: 'all',      label: 'Toutes' },
              { value: 'active',   label: 'Publiées' },
              { value: 'inactive', label: 'Suspendues' },
            ]}
            pagination={pagination}
            onPageChange={(page) => load(page, statusFilter, debouncedSearch)}
            onView={(row) => navigate(`/properties/${row._id}`)}
            onEdit={(row) => navigate(`/admin/properties/${row._id}/edit`)}
            onDelete={handleDelete}
            emptyState="Aucune annonce trouvée"
            emptyIcon={Building2}
          />
      </div>
    </div>
  );
};

export default AdminPropertiesPage;
