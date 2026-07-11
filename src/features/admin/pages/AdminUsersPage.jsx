import React, { useEffect, useRef, useState } from 'react';
import {
  Search, Trash2, Users, RefreshCw, ShieldCheck, ShieldOff, Phone, Mail,
  X, CalendarDays, Download, FileText, Ban, PowerOff, Power, Building2, Clock,
} from 'lucide-react';
import { adminAPI, reservationAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const RESERVATION_STATUS_CONFIG = {
  confirmee:  { label: 'Confirmée',  cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  en_attente: { label: 'En attente', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  annulee:    { label: 'Annulée',    cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
  terminee:   { label: 'Terminée',   cls: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
};

const ROLE_CONFIG = {
  admin: { label: 'Admin', cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  user:  { label: 'Client', cls: 'text-zinc-400 bg-zinc-800 border-white/5' },
};

const STATUS_CONFIG = {
  active:   { label: 'Actif',   cls: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  inactive: { label: 'Inactif', cls: 'text-zinc-500 bg-zinc-800 border-white/5' },
  banned:   { label: 'Banni',   cls: 'text-red-500 bg-red-500/10 border-red-500/20' },
};

const AdminUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const loadIdRef = useRef(0);
  const isMountedRef = useRef(false);

  // ── Détail utilisateur (réservations, activité, contrats, ban/désactivation) ──
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState('');
  const detailRequestRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    load(1, roleFilter, statusFilter, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const load = async (page = 1, role = roleFilter, status = statusFilter, q = debouncedSearch) => {
    const callId = ++loadIdRef.current;
    try {
      setLoading(true);
      setItems([]);
      const res = await adminAPI.getUsers({
        page, limit: 10,
        search: q || undefined,
        role: role || undefined,
        status: status || undefined,
      });
      const d = res.data?.data || res.data;
      if (callId !== loadIdRef.current) return;
      setItems(Array.isArray(d?.users) ? d.users : Array.isArray(d?.items) ? d.items : []);
      setPagination({ page: d?.page || 1, limit: 10, totalPages: d?.totalPages || 1, totalItems: d?.totalUsers || d?.total || 0 });
    } catch {
      if (callId !== loadIdRef.current) return;
      setItems([]);
    } finally {
      if (callId === loadIdRef.current) setLoading(false);
    }
  };

  useEffect(() => { isMountedRef.current = true; load(1, '', '', ''); }, []); // eslint-disable-line

  const handleRoleChange = (v) => { if (roleFilter === v) return; setRoleFilter(v); load(1, v, statusFilter, debouncedSearch); };
  const handleStatusChange = (v) => { if (statusFilter === v) return; setStatusFilter(v); load(1, roleFilter, v, debouncedSearch); };

  const handleDelete = async (u) => {
    if (!window.confirm(`Supprimer l'utilisateur ${u.nom || u.name || u.email} ?`)) return;
    try {
      await adminAPI.deleteUser(u._id);
      setItems(prev => prev.filter(x => x._id !== u._id));
      toast.success('Utilisateur supprimé');
    } catch { toast.error('Suppression impossible'); }
  };

  const handleToggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      await adminAPI.updateUserRole(u._id, newRole);
      setItems(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x));
      toast.success(`Rôle changé : ${newRole === 'admin' ? 'Admin' : 'Client'}`);
    } catch { toast.error('Impossible de changer le rôle'); }
  };

  const openUserDetail = async (u) => {
    const requestId = ++detailRequestRef.current;
    setSelectedUser(u);
    setSelectedReservations([]);
    setDetailLoading(true);
    try {
      const [userRes, reservationsRes] = await Promise.all([
        adminAPI.getUserById(u._id),
        adminAPI.getReservations({ user: u._id, limit: 50, sort: '-createdAt' }),
      ]);
      if (requestId !== detailRequestRef.current) return;
      const fullUser = userRes.data?.data || userRes.data;
      const rd = reservationsRes.data?.data || reservationsRes.data;
      setSelectedUser(fullUser || u);
      setSelectedReservations(Array.isArray(rd?.reservations) ? rd.reservations : []);
    } catch {
      if (requestId !== detailRequestRef.current) return;
      toast.error('Impossible de charger le détail de cet utilisateur');
    } finally {
      if (requestId === detailRequestRef.current) setDetailLoading(false);
    }
  };

  const closeUserDetail = () => {
    detailRequestRef.current += 1;
    setSelectedUser(null);
    setSelectedReservations([]);
  };

  const handleSetStatus = async (status) => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await adminAPI.updateUser(selectedUser._id, { status });
      setSelectedUser(prev => prev ? { ...prev, status } : prev);
      setItems(prev => prev.map(x => x._id === selectedUser._id ? { ...x, status } : x));
      const labels = { active: 'réactivé', inactive: 'désactivé', banned: 'banni' };
      toast.success(`Compte ${labels[status] || 'mis à jour'}`);
    } catch {
      toast.error('Mise à jour du statut impossible');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadReceipt = async (id) => {
    try {
      setDownloadingId(`receipt-${id}`);
      await reservationAPI.downloadReceipt(id);
    } catch { toast.error('Téléchargement du reçu impossible'); }
    finally { setDownloadingId(''); }
  };

  const handleDownloadContract = async (id) => {
    try {
      setDownloadingId(`contract-${id}`);
      await reservationAPI.downloadContract(id);
    } catch { toast.error('Téléchargement du contrat impossible'); }
    finally { setDownloadingId(''); }
  };

  const isContractEligible = (r) => String(r?.status || '') === 'confirmee' && r?.requestType && r.requestType !== 'visite';

  const roleOptions = [
    { value: '',      label: 'Tous' },
    { value: 'user',  label: 'Clients' },
    { value: 'admin', label: 'Admins' },
  ];
  const statusOptions = [
    { value: '',         label: 'Tous' },
    { value: 'active',   label: 'Actifs' },
    { value: 'inactive', label: 'Inactifs' },
    { value: 'banned',   label: 'Bannis' },
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
                Administration / <span className="text-zinc-300">Utilisateurs</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase italic">
                Gestion des Membres<span className="text-gold-primary">.</span>
              </h1>
            </div>
            <button
              onClick={() => load(1, roleFilter, statusFilter, debouncedSearch)}
              className="h-11 w-11 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-all shrink-0"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>
          </div>

          {/* Search + Filters */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load(1, roleFilter, statusFilter, search)}
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-11 pr-4 py-3 bg-zinc-950/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Rôle</span>
              {roleOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => handleRoleChange(o.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                    roleFilter === o.value
                      ? 'bg-gold-primary text-black border-gold-primary'
                      : 'text-zinc-500 border-white/5 hover:text-white hover:border-white/10',
                  )}
                >
                  {o.label}
                </button>
              ))}
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Statut</span>
              {statusOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => handleStatusChange(o.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                    statusFilter === o.value
                      ? 'bg-gold-primary text-black border-gold-primary'
                      : 'text-zinc-500 border-white/5 hover:text-white hover:border-white/10',
                  )}
                >
                  {o.label}
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
                    <th className="px-6 py-4">Utilisateur</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <LoadingSpinner size="md" />
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="h-16 w-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-600">
                            <Users className="h-8 w-8" />
                          </div>
                          <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">Aucun membre trouvé</p>
                          <button
                            onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); load(1, '', '', ''); }}
                            className="px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-white/10 transition-all"
                          >
                            Réinitialiser
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : items.map((u) => {
                    const roleCfg = ROLE_CONFIG[u.role] || ROLE_CONFIG.user;
                    const statusCfg = STATUS_CONFIG[u.status] || STATUS_CONFIG.inactive;
                    return (
                      <tr
                        key={u._id}
                        onClick={() => openUserDetail(u)}
                        className="group hover:bg-white/[0.025] transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center font-black text-gold-primary text-sm shrink-0">
                              {(u.nom || u.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-white truncate">{u.nom || u.name || 'Sans nom'}</p>
                              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">#{u._id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <Mail className="h-3 w-3 text-zinc-600 shrink-0" />
                              <span className="truncate max-w-[160px]">{u.email}</span>
                            </div>
                            {u.telephone && (
                              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Phone className="h-3 w-3 text-zinc-600 shrink-0" />
                                {u.telephone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border', roleCfg.cls)}>
                            {roleCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border', statusCfg.cls)}>
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleRole(u); }}
                              title={u.role === 'admin' ? 'Rétrograder en client' : 'Promouvoir admin'}
                              className="h-8 w-8 rounded-lg border border-white/5 bg-zinc-900 hover:bg-amber-500/10 text-zinc-500 hover:text-amber-400 flex items-center justify-center transition-all"
                            >
                              {u.role === 'admin' ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(u); }}
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
            {!loading && items.length > 0 && (
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-4">
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                  {pagination.totalItems} membre{pagination.totalItems > 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => load(pagination.page - 1, roleFilter, statusFilter, debouncedSearch)}
                    className="h-9 px-4 rounded-xl border border-white/5 bg-zinc-950/50 text-xs font-black text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest transition-all"
                  >
                    Précédent
                  </button>
                  <span className="px-3 py-1.5 text-xs font-black text-zinc-500 bg-zinc-950/30 rounded-lg border border-white/5">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => load(pagination.page + 1, roleFilter, statusFilter, debouncedSearch)}
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
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Communauté</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-gold-primary">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Membres</span>
              </div>
              <span className="text-xl font-black text-white">{pagination.totalItems}</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Filtre Statut</h4>
            <div className="space-y-2 text-xs font-bold text-zinc-500">
              <p>• <span className="text-emerald-400">Actif</span> — compte vérifié et actif</p>
              <p>• <span className="text-zinc-400">Inactif</span> — compte désactivé</p>
              <p>• <span className="text-red-400">Banni</span> — compte suspendu par un admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Détail utilisateur (modal) ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeUserDetail} />
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border-l border-white/10 h-full overflow-y-auto">
            <div className="sticky top-0 z-10 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/5 p-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center font-black text-gold-primary text-xl shrink-0">
                  {(selectedUser.nom || selectedUser.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-black text-white truncate">{selectedUser.nom || selectedUser.name || 'Sans nom'}</p>
                  <p className="text-xs text-zinc-500 truncate">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn('px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border', (ROLE_CONFIG[selectedUser.role] || ROLE_CONFIG.user).cls)}>
                      {(ROLE_CONFIG[selectedUser.role] || ROLE_CONFIG.user).label}
                    </span>
                    <span className={cn('px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border', (STATUS_CONFIG[selectedUser.status] || STATUS_CONFIG.inactive).cls)}>
                      {(STATUS_CONFIG[selectedUser.status] || STATUS_CONFIG.inactive).label}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={closeUserDetail} className="h-9 w-9 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-8">

              {/* Activité */}
              <div>
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Activité</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Membre depuis</p>
                    <p className="text-sm font-bold text-white">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('fr-FR') : '—'}</p>
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Téléphone</p>
                    <p className="text-sm font-bold text-white truncate">{selectedUser.telephone || '—'}</p>
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Réservations</p>
                    <p className="text-sm font-bold text-white">{selectedReservations.length}</p>
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Confirmées</p>
                    <p className="text-sm font-bold text-emerald-500">{selectedReservations.filter(r => r.status === 'confirmee').length}</p>
                  </div>
                </div>
              </div>

              {/* Réservations & contrats */}
              <div>
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Réservations & contrats</h4>
                {detailLoading ? (
                  <div className="py-10 flex justify-center"><LoadingSpinner size="sm" /></div>
                ) : selectedReservations.length === 0 ? (
                  <div className="py-10 text-center">
                    <CalendarDays className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-xs text-zinc-600 font-bold">Aucune réservation</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedReservations.map((r) => {
                      const scfg = RESERVATION_STATUS_CONFIG[r.status] || RESERVATION_STATUS_CONFIG.en_attente;
                      return (
                        <div key={r._id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0">
                              <p className="text-xs font-black text-white truncate flex items-center gap-1.5">
                                <Building2 className="h-3 w-3 text-zinc-600 shrink-0" />
                                {r.property?.titre || 'Bien supprimé'}
                              </p>
                              <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                <Clock className="h-2.5 w-2.5" />
                                {r.date ? new Date(r.date).toLocaleDateString('fr-FR') : '—'} · #{r.reference || r._id?.slice(-6).toUpperCase()}
                              </p>
                            </div>
                            <span className={cn('px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shrink-0', scfg.cls)}>
                              {scfg.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              disabled={downloadingId === `receipt-${r._id}`}
                              onClick={() => handleDownloadReceipt(r._id)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/5 bg-zinc-950 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                              <Download className="h-3 w-3" /> Reçu
                            </button>
                            {isContractEligible(r) && (
                              <button
                                disabled={downloadingId === `contract-${r._id}`}
                                onClick={() => handleDownloadContract(r._id)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gold-primary/20 bg-gold-primary/10 text-gold-primary hover:bg-gold-primary/20 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                              >
                                <FileText className="h-3 w-3" /> Contrat
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions de modération */}
              <div>
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Modération du compte</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    disabled={actionLoading || selectedUser.status === 'active'}
                    onClick={() => handleSetStatus('active')}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Power className="h-3.5 w-3.5" /> Activer
                  </button>
                  <button
                    disabled={actionLoading || selectedUser.status === 'inactive'}
                    onClick={() => handleSetStatus('inactive')}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <PowerOff className="h-3.5 w-3.5" /> Désactiver
                  </button>
                  <button
                    disabled={actionLoading || selectedUser.status === 'banned'}
                    onClick={() => { if (window.confirm(`Bannir ${selectedUser.nom || selectedUser.name || selectedUser.email} ?`)) handleSetStatus('banned'); }}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Ban className="h-3.5 w-3.5" /> Bannir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
