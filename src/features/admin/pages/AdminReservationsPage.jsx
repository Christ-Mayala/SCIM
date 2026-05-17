import React, { useEffect, useMemo, useState } from 'react';
import { adminAPI, formatPrice, reservationAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { 
  Search, Filter, RefreshCw, X, ChevronLeft, ChevronRight, Eye, Clock, 
  CheckCircle, XCircle, AlertCircle, CalendarDays, Download, Zap, 
  MousePointer2, Building2, Phone, Mail, User, MapPin, Trash2, MoreHorizontal, Shield
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const LIMIT = 10;

const AdminReservationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '' });

  const load = async (page = 1, f = filters) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: LIMIT, ...(f.search && { search: f.search }), ...(f.status && { status: f.status }) };
      const res = await adminAPI.getReservations(params);
      const data = res.data?.data || res.data;
      const items = Array.isArray(data?.reservations) ? data.reservations : Array.isArray(data?.items) ? data.items : [];
      setReservations(items);
      const total = data?.total || items.length;
      setPagination({ page, total, totalPages: Math.ceil(total / LIMIT) || 1 });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur lors du chargement');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateReservationStatus(id, status);
      setReservations(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      toast.success(status === 'confirmee' ? 'Visite confirmée' : 'Visite annulée');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Mise à jour impossible');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette demande de visite ?')) return;
    try {
      // Simulation suppression (si API disponible)
      setReservations(prev => prev.filter(r => r._id !== id));
      toast.success('Visite supprimée');
    } catch (e) { toast.error('Erreur lors de la suppression'); }
  };

  return (
    <div className="p-4 lg:p-8 max-w-full text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            Administration <span className="opacity-30">/</span> <span className="text-zinc-300">Visites</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic uppercase">Planning des Visites<span className="text-gold-primary">.</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={() => load(1)} className="h-12 w-12 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center p-0 transition-all">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col gap-8">
        
        {/* Full Width Table Section */}
        <div className="w-full space-y-8">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-8 py-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && load(1)}
                  placeholder="Rechercher un client ou bien..."
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                 <select
                    value={filters.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setFilters(prev => ({ ...prev, status: newStatus }));
                      load(1, { ...filters, status: newStatus });
                    }}
                    className="h-11 rounded-xl border border-white/5 bg-zinc-950/50 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-1 focus:ring-gold-primary/30"
                 >
                    <option value="">Tous les statuts</option>
                    <option value="en_attente">En attente</option>
                    <option value="confirmee">Confirmées</option>
                    <option value="annulee">Annulées</option>
                 </select>
                 <Button onClick={() => load(1)} className="h-11 px-6 rounded-xl bg-gold-primary text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/10 transition-all">Filtrer</Button>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="px-6 py-6">Réf & Date</th>
                    <th className="px-6 py-6">Propriété</th>
                    <th className="px-6 py-6">Visiteur</th>
                    <th className="px-6 py-6">Statut</th>
                    <th className="px-6 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan="5" className="py-20 text-center"><LoadingSpinner size="md" /></td></tr>
                  ) : reservations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="h-16 w-16 rounded-3xl bg-zinc-900/50 flex items-center justify-center text-zinc-700">
                             <CalendarDays className="h-8 w-8" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-white uppercase tracking-widest">Aucune visite planifiée</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Aucun résultat ne correspond à vos critères</p>
                          </div>
                          <Button onClick={() => { setFilters({ search: '', status: '' }); load(1, { search: '', status: '' }); }} variant="outline" className="h-9 rounded-xl border-white/5 bg-zinc-950/50 text-[9px] font-black uppercase tracking-widest">Réinitialiser</Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reservations.map((r) => (
                      <tr key={r._id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-6">
                          <div className="text-[11px] font-black text-white uppercase tracking-tight">#{r.reference || r._id?.slice(-6).toUpperCase()}</div>
                          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 shrink-0 rounded-2xl overflow-hidden bg-zinc-800 border border-white/5 shadow-md">
                                <img src={r.property?.images?.[0]?.url || '/images/scim-logo.jpg'} alt="" className="h-full w-full object-cover" />
                             </div>
                             <div className="min-w-0">
                                <div className="text-[11px] font-black text-white truncate uppercase tracking-tight">{r.property?.titre || 'Bien supprimé'}</div>
                                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{r.property?.ville || '—'}</div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[200px]">{r.user?.nom || 'Client'}</div>
                           <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1 truncate max-w-[200px]">{r.user?.telephone || '—'}</div>
                        </td>
                        <td className="px-6 py-6">
                           <span className={cn(
                             "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                             /confirm/i.test(r.status) ? "bg-emerald-500/10 text-emerald-500" : 
                             /attente|pending/i.test(r.status) ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                           )}>
                             {r.status === 'confirmee' ? 'Confirmée' : r.status === 'en_attente' ? 'Attente' : 'Annulée'}
                           </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                           <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                              <button onClick={() => handleStatusUpdate(r._id, 'confirmee')} className="p-2.5 rounded-xl bg-zinc-800 text-emerald-500 hover:text-emerald-400 transition-all border border-white/5" title="Confirmer"><CheckCircle className="h-4 w-4" /></button>
                              <button onClick={() => handleDelete(r._id)} className="p-2.5 rounded-xl bg-zinc-800 text-zinc-500 hover:text-red-500 transition-all border border-white/5" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
                              <button className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-white/5" title="Plus d'actions"><MoreHorizontal className="h-4 w-4" /></button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && reservations.length > 0 && (
              <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                  Page {pagination.page} / {pagination.totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={pagination.page <= 1}
                    onClick={() => load(pagination.page - 1)}
                    className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
                  >
                    Précédent
                  </button>
                  <button 
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => load(pagination.page + 1)}
                    className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary Side */}
        <div className="w-full xl:w-[360px] space-y-8 shrink-0">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-8">Vue d'ensemble</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-gold-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Total Visites</span>
                </div>
                <span className="text-lg font-black text-white">{pagination.total}</span>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Taux de conversion</span>
                  <span className="text-xs font-black text-emerald-500">64%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[64%] bg-gold-primary rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Support Expert</h4>
            <div className="h-14 w-14 rounded-2xl bg-gold-primary flex items-center justify-center text-black mb-6 shadow-xl shadow-gold-primary/20 mx-auto">
              <Shield className="h-6 w-6" />
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-8 font-medium text-center">
              Nos conseillers sont disponibles pour vous aider à organiser vos journées de visites.
            </p>
            <Button className="w-full h-12 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/10 transition-all">
              Contacter un conseiller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservationsPage;
