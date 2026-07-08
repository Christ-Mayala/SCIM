import React, { useEffect, useRef, useState } from 'react';
import { adminAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import {
  Search, RefreshCw, CalendarDays, CheckCircle, XCircle,
  Phone, Trash2, MessageCircle, Shield,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const LIMIT = 10;

const STATUS_CONFIG = {
  confirmee:  { label: 'Confirmée',  cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  en_attente: { label: 'En attente', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  annulee:    { label: 'Annulée',    cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

const AdminReservationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const loadIdRef = useRef(0);
  const isMountedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    load(1, statusFilter, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const load = async (page = 1, status = statusFilter, q = debouncedSearch) => {
    const callId = ++loadIdRef.current;
    try {
      setLoading(true);
      setError(null);
      setReservations([]);
      const res = await adminAPI.getReservations({
        page, limit: LIMIT,
        ...(q ? { search: q } : {}),
        ...(status ? { status } : {}),
      });
      if (callId !== loadIdRef.current) return;
      const d = res.data?.data || res.data;
      const items = d?.reservations || d?.items || [];
      setReservations(items);
      const total = d?.total ?? items.length;
      setPagination({ page, total, totalPages: Math.ceil(total / LIMIT) || 1 });
    } catch (e) {
      if (callId !== loadIdRef.current) return;
      setError(e?.response?.data?.message || e?.message || 'Erreur de chargement');
      setReservations([]);
    } finally {
      if (callId === loadIdRef.current) setLoading(false);
    }
  };

  useEffect(() => { isMountedRef.current = true; load(1, '', ''); }, []); // eslint-disable-line

  const handleStatusFilter = (v) => {
    if (statusFilter === v) return;
    setStatusFilter(v);
    load(1, v, debouncedSearch);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateReservationStatus(id, status);
      setReservations(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      toast.success(status === 'confirmee' ? 'Visite confirmée' : 'Visite annulée');
    } catch (e) { toast.error(e?.response?.data?.message || 'Mise à jour impossible'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette demande de visite ?')) return;
    setReservations(prev => prev.filter(r => r._id !== id));
    toast.success('Visite supprimée');
  };

  const openWhatsApp = (r) => {
    const phone = (r.user?.telephone || '').replace(/[^\d+]/g, '');
    if (!phone) return;
    const msg = encodeURIComponent(
      `[SCIM Immobilier — Visite]\n\n` +
      `Bonjour, nous vous contactons concernant votre demande de visite (Réf: ${r.reference || r._id?.slice(-6).toUpperCase()}) ` +
      `pour le bien : ${r.property?.titre || 'Bien'} à ${r.property?.ville || ''}.\n\n` +
      `Merci de confirmer votre disponibilité.`
    );
    window.open(`https://wa.me/${phone.startsWith('+') ? phone.slice(1) : phone}?text=${msg}`, '_blank');
  };

  const statusTabs = [
    { value: '',           label: 'Toutes' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'confirmee',  label: 'Confirmées' },
    { value: 'annulee',    label: 'Annulées' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-full text-white">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ── Main ── */}
        <div className="xl:col-span-2 space-y-8 min-w-0">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                Administration / <span className="text-zinc-300">Visites</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase italic">
                Planning des Visites<span className="text-gold-primary">.</span>
              </h1>
            </div>
            <button
              onClick={() => load(1, statusFilter, debouncedSearch)}
              className="h-11 w-11 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-all shrink-0"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>
          </div>

          {/* Search + Status tabs */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { setDebouncedSearch(search); load(1, statusFilter, search); }
                }}
                placeholder="Rechercher un client ou un bien..."
                className="w-full pl-11 pr-4 py-3 bg-zinc-950/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {statusTabs.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleStatusFilter(t.value)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                    statusFilter === t.value
                      ? 'bg-gold-primary text-black border-gold-primary'
                      : 'text-zinc-500 border-white/5 hover:text-white hover:border-white/10',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 bg-zinc-950/30">
                    <th className="px-6 py-4">Réf & Date</th>
                    <th className="px-6 py-4">Propriété</th>
                    <th className="px-6 py-4">Visiteur</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {loading ? (
                    <tr><td colSpan="5" className="py-20 text-center"><LoadingSpinner size="md" /></td></tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-sm text-red-400 font-bold">{error}</td>
                    </tr>
                  ) : reservations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="h-16 w-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-600">
                            <CalendarDays className="h-8 w-8" />
                          </div>
                          <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">Aucune visite</p>
                          <button
                            onClick={() => { setSearch(''); setStatusFilter(''); setDebouncedSearch(''); load(1, '', ''); }}
                            className="px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                          >
                            Réinitialiser
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : reservations.map((r) => {
                    const scfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.en_attente;
                    return (
                      <tr key={r._id} className="group hover:bg-white/[0.025] transition-colors">
                        <td className="px-6 py-5">
                          <p className="text-[11px] font-black text-white uppercase">#{r.reference || r._id?.slice(-6).toUpperCase()}</p>
                          <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl overflow-hidden bg-zinc-800 border border-white/5 shrink-0">
                              <img
                                src={r.property?.images?.[0]?.url || '/images/scim-logo.jpg'}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-white truncate max-w-[150px]">{r.property?.titre || 'Bien supprimé'}</p>
                              <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{r.property?.ville || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-black text-white truncate max-w-[140px]">{r.user?.nom || r.user?.name || 'Client'}</p>
                          <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5">{r.user?.telephone || '—'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn('inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border whitespace-nowrap', scfg.cls)}>
                            {scfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {r.user?.telephone && (
                              <>
                                <button
                                  onClick={() => window.location.href = `tel:${r.user.telephone}`}
                                  title="Appeler"
                                  className="h-8 w-8 rounded-lg border border-white/5 bg-zinc-900 hover:bg-white/5 text-zinc-500 hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => openWhatsApp(r)}
                                  title="WhatsApp"
                                  className="h-8 w-8 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleStatusUpdate(r._id, 'confirmee')}
                              title="Confirmer"
                              className="h-8 w-8 rounded-lg border border-emerald-500/20 bg-zinc-900 hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-500 flex items-center justify-center transition-all"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(r._id, 'annulee')}
                              title="Annuler"
                              className="h-8 w-8 rounded-lg border border-red-500/20 bg-zinc-900 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 flex items-center justify-center transition-all"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(r._id)}
                              title="Supprimer"
                              className="h-8 w-8 rounded-lg border border-white/5 bg-zinc-900 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && reservations.length > 0 && (
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-4">
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                  {pagination.total} visite{pagination.total > 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => load(pagination.page - 1, statusFilter, debouncedSearch)}
                    className="h-9 px-4 rounded-xl border border-white/5 bg-zinc-950/50 text-xs font-black text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest transition-all"
                  >
                    Précédent
                  </button>
                  <span className="px-3 py-1.5 text-xs font-black text-zinc-500 bg-zinc-950/30 rounded-lg border border-white/5">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => load(pagination.page + 1, statusFilter, debouncedSearch)}
                    className="h-9 px-4 rounded-xl border border-white/5 bg-zinc-950/50 text-xs font-black text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest transition-all"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-8">
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Vue d'ensemble</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-gold-primary">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Visites</span>
              </div>
              <span className="text-xl font-black text-white">{pagination.total}</span>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Taux de confirmation</span>
                <span className="text-xs font-black text-emerald-500">64%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-[64%] bg-gold-primary rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 text-center">
            <div className="h-12 w-12 rounded-2xl bg-gold-primary flex items-center justify-center text-black mx-auto mb-4 shadow-lg shadow-gold-primary/20">
              <Shield className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Support Expert</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-6 font-medium">
              Nos conseillers sont disponibles pour organiser vos journées de visites.
            </p>
            <Button className="w-full h-11 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px]">
              Contacter un conseiller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservationsPage;
