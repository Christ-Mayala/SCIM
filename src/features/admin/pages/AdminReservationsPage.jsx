import React, { useEffect, useMemo, useState } from 'react';
import { adminAPI, formatPrice, formatDate, reservationAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Search, Filter, RefreshCw, X, ChevronLeft, ChevronRight, Eye, Clock, CheckCircle, XCircle, AlertCircle, CalendarDays, Download, Zap, MousePointer2, Building2, Phone, Mail, User, MapPin } from 'lucide-react';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const LIMIT = 5;

const statusMap = {
  en_attente:  { label: 'En attente',  cls: 'bg-amber-50 text-amber-600 border-amber-100',  icon: Clock },
  confirmee:   { label: 'Confirmée',   cls: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle },
  confirmée:   { label: 'Confirmée',   cls: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle },
  annulee:     { label: 'Annulée',     cls: 'bg-red-50 text-red-600 border-red-100',  icon: XCircle },
  annulée:     { label: 'Annulée',     cls: 'bg-red-50 text-red-600 border-red-100',  icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const s = statusMap[status] || { label: status || '—', cls: 'bg-zinc-100 text-zinc-500 border-zinc-200', icon: AlertCircle };
  const Icon = s.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border', s.cls)}>
      <Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
};

const StatCard = ({ label, value, icon: Icon, color, variant = 'default' }) => (
  <div className="bg-white rounded-[2rem] border border-zinc-200/80 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
    <div className={cn("absolute inset-x-0 top-0 h-1", color.split(' ')[0].replace('text-', 'bg-'))} />
    <div className="flex items-center gap-4">
      <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/5", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-1.5">{label}</p>
        <p className="text-2xl font-black text-zinc-900 leading-none tracking-tight">{value}</p>
      </div>
    </div>
  </div>
);

const AdminReservationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState('');

  const exportToExcel = async () => {
    try {
      setExporting(true);
      const res = await adminAPI.getReservations({ page: 1, limit: 2000, ...(filters.search && { search: filters.search }), ...(filters.status && { status: filters.status }) });
      const rd = res.data?.data || res.data;
      const all = Array.isArray(rd?.reservations) ? rd.reservations : Array.isArray(rd?.items) ? rd.items : [];

      const rows = all.map(r => ({
        'REF':             r.reference || r._id?.slice(-8).toUpperCase() || '—',
        'DATE VISITE':     r.date ? new Date(r.date).toLocaleDateString('fr-FR') : '—',
        'STATUT':          statusMap[r.status]?.label || r.status?.toUpperCase() || 'PÉNDING',
        'CLIENT':          (r.user?.nom || r.user?.name || '—').toUpperCase(),
        'TEL CLIENT':      r.user?.telephone || '—',
        'EMAIL CLIENT':    r.user?.email || '—',
        'PROPRIÉTÉ':       (r.property?.titre || '—').toUpperCase(),
        'VILLE':           (r.property?.ville || '—').toUpperCase(),
        'PRIX (FCFA)':     r.property?.prix || 0,
        'SOUMIS LE':       r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—',
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = [
          { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 18 },
          { wch: 35 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Rapport Reservations');
      XLSX.writeFile(wb, `SCIM_Reservations_${new Date().toISOString().slice(0,10)}.xlsx`);
      toast.success(`${all.length} réservations exportées`);
    } catch (e) {
      toast.error('Erreur lors de l\'export Excel');
    } finally {
      setExporting(false);
    }
  };

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
      setStatusUpdatingId(id);
      await adminAPI.updateReservationStatus(id, status);
      setReservations(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      toast.success(status === 'confirmee' ? 'Réservation confirmée' : 'Réservation annulée');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Mise à jour impossible');
    } finally {
      setStatusUpdatingId('');
    }
  };

  const clearFilters = () => {
    const reset = { search: '', status: '' };
    setFilters(reset);
    load(1, reset);
  };

  const stats = useMemo(() => {
    const total = pagination.total;
    const enAttente  = reservations.filter(r => r.status === 'en_attente').length;
    const confirmees = reservations.filter(r => r.status === 'confirmee' || r.status === 'confirmée').length;
    return { total, enAttente, confirmees };
  }, [reservations, pagination.total]);

  const buildWhatsappUrl = (r) => {
    const phone = r?.user?.telephone?.replace(/[^\d]/g, '');
    if (!phone) return null;
    const ref = r?.reference || r?._id?.slice(-6).toUpperCase() || '';
    const txt = `Bonjour ${r?.user?.nom || 'Client'}, concernant votre visite SCIM (Réf: ${ref})...`;
    return `https://wa.me/${phone.startsWith('242') ? phone : '242' + phone}?text=${encodeURIComponent(txt)}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header Section ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white mb-4 shadow-lg shadow-zinc-900/10">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Journal des Visites
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Réservations</h1>
            <p className="mt-1 text-sm font-medium text-zinc-500">Gérez le planning des visites et la relation client.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button 
               variant="outline" 
               onClick={exportToExcel} 
               loading={exporting}
               className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] border-zinc-200 bg-white hover:bg-zinc-50 transition-all shadow-sm gap-2"
             >
               <Download className="h-4 w-4" /> Export Excel
             </Button>
             <Button 
               onClick={() => load(1)} 
               className="h-12 w-12 rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/10 flex items-center justify-center p-0"
             >
               <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
             </Button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
           <StatCard label="Volume Total" value={stats.total} icon={CalendarDays} color="bg-zinc-100 text-zinc-900" />
           <StatCard label="En Attente" value={stats.enAttente} icon={Clock} color="bg-amber-50 text-amber-600" />
           <StatCard label="Confirmées" value={stats.confirmees} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" />
           <StatCard label="Taux d'Action" value={stats.total > 0 ? `${Math.round(((stats.confirmees) / stats.total) * 100)}%` : '0%'} icon={Zap} color="bg-blue-50 text-blue-600" />
        </div>

        {/* ── Search & Filter Panel ── */}
        <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm p-2 mb-8">
           <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-100">
              <div className="flex-1 p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-zinc-300" />
                  </div>
                  <input
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && load(1)}
                    placeholder="Chercher client, référence, bien..."
                    className="block w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-[1.25rem] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
                  />
                </div>
              </div>
              <div className="p-4 flex items-center gap-3 px-6">
                 <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="h-12 rounded-xl border border-zinc-100 bg-zinc-50 px-4 text-xs font-black uppercase tracking-widest text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                 >
                    <option value="">Tous les statuts</option>
                    <option value="en_attente">En attente</option>
                    <option value="confirmee">Confirmées</option>
                    <option value="annulee">Annulées</option>
                 </select>
                 <Button onClick={() => load(1)} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] bg-zinc-900 border-none text-white hover:bg-gold-primary hover:text-zinc-900 transition-all shadow-lg active:scale-95">Appliquer</Button>
                 {(filters.search || filters.status) && (
                   <Button variant="outline" onClick={clearFilters} className="h-12 w-12 rounded-xl border-zinc-200 p-0 text-zinc-400 hover:text-red-500 hover:bg-red-50">
                      <X className="h-5 w-5" />
                   </Button>
                 )}
              </div>
           </div>
        </div>

        {/* ── Table Section ── */}
        <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden mb-12">
          {loading && pagination.page === 1 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Scan des réservations...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-zinc-400">
               <CalendarDays className="h-12 w-12 opacity-20 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest">Aucune donnée trouvée</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-zinc-50 bg-zinc-50/30">
                      <th className="py-5 pl-10 pr-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Référence & Date</th>
                      <th className="py-5 px-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Bien Immobilier</th>
                      <th className="hidden sm:table-cell py-5 px-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Visiteur</th>
                      <th className="py-5 px-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Statut</th>
                      <th className="py-5 pl-4 pr-10 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {reservations.map(r => {
                      const isPending = /attente|pending/i.test(r.status || '');
                      const waUrl = buildWhatsappUrl(r);
                      return (
                        <tr key={r._id} className="hover:bg-zinc-50/50 transition-colors group">
                          <td className="py-5 pl-10 pr-4">
                             <div className="text-xs font-black text-zinc-900 uppercase tracking-tight">#{r.reference || r._id?.slice(-8).toUpperCase()}</div>
                             <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase mt-0.5">
                                <Clock className="h-3 w-3" /> {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                             </div>
                          </td>
                          <td className="py-5 px-4">
                            <div className="flex items-center gap-3">
                               <div className="h-12 w-12 shrink-0 rounded-2xl overflow-hidden bg-zinc-100 ring-1 ring-zinc-200 group-hover:ring-amber-400/30 transition-all">
                                  <img src={r.property?.images?.[0]?.url || '/images/scim-logo.jpg'} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                               </div>
                               <div className="min-w-0">
                                  <div className="text-sm font-black text-zinc-900 leading-tight line-clamp-2 group-hover:text-gold-dark truncate max-w-[200px] uppercase tracking-tight">{r.property?.titre || 'Bien supprimé'}</div>
                                  <div className="text-[10px] font-bold text-zinc-400 mt-0.5 truncate max-w-[150px] uppercase tracking-wider">{r.property?.ville || '—'}</div>
                               </div>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell py-5 px-4">
                             <div className="text-sm font-black text-zinc-900 uppercase tracking-tight truncate max-w-[150px]">{r.user?.nom || r.user?.name || 'Client'}</div>
                             <div className="text-[10px] font-bold text-zinc-400 mt-0.5 truncate max-w-[150px]">{r.user?.email || '—'}</div>
                          </td>
                          <td className="py-5 px-4">
                             <StatusBadge status={r.status} />
                          </td>
                          <td className="py-5 pl-4 pr-10">
                             <div className="flex items-center justify-end gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                                {isPending ? (
                                  <>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleStatusUpdate(r._id, 'confirmee')}
                                      className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 border-none text-white shadow-lg shadow-emerald-500/10"
                                    >
                                      Confirmer
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleStatusUpdate(r._id, 'annulee')}
                                      className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 border-red-100 hover:bg-red-50"
                                    >
                                      Annuler
                                    </Button>
                                  </>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => setSelectedReservation(r)}
                                    className="h-9 w-9 p-0 rounded-xl border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                {waUrl && (
                                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-12 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm">
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

              {/* ── Pagination ── */}
              <div className="flex items-center justify-between px-10 py-6 bg-zinc-50 border-t border-zinc-100">
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Page <span className="text-zinc-900">{pagination.page}</span> / <span className="text-zinc-900">{pagination.totalPages}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => load(pagination.page - 1)} 
                      disabled={pagination.page <= 1}
                      className="h-10 px-6 rounded-xl text-[10px] font-black uppercase border-zinc-200 bg-white"
                    >
                      Précédent
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => load(pagination.page + 1)} 
                      disabled={pagination.page >= pagination.totalPages}
                      className="h-10 px-6 rounded-xl text-[10px] font-black uppercase border-zinc-200 bg-white"
                    >
                      Suivant
                    </Button>
                  </div>
              </div>
            </>
          )}
        </div>

        {/* ── Detail Modal ── */}
        {selectedReservation && (
           <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-zinc-950/95" onClick={() => setSelectedReservation(null)} />
              <div className="relative w-full max-w-2xl rounded-[2.5rem] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                 <div className="flex items-center justify-between px-10 py-8 border-b border-zinc-100">
                    <div>
                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em]">Détails du Rendez-vous</h3>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Réf: {selectedReservation.reference || selectedReservation._id}</p>
                    </div>
                    <button onClick={() => setSelectedReservation(null)} className="h-11 w-11 rounded-2xl bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                       <X className="h-5 w-5 text-zinc-500" />
                    </button>
                 </div>
                 <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Property side */}
                        <div className="space-y-6">
                           <div className="aspect-video rounded-[1.5rem] overflow-hidden bg-zinc-100 border border-zinc-100 shadow-inner">
                              <img src={selectedReservation.property?.images?.[0]?.url || '/images/scim-logo.jpg'} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{selectedReservation.property?.categorie}</div>
                              <h4 className="text-xl font-black text-zinc-900 leading-tight uppercase tracking-tight">{selectedReservation.property?.titre}</h4>
                              <p className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 mt-2 uppercase tracking-wide">
                                 <MapPin className="h-3.5 w-3.5 text-amber-500" /> {selectedReservation.property?.ville}
                              </p>
                              <div className="mt-4 text-xl font-black text-zinc-900">{formatPrice(selectedReservation.property?.prix)}</div>
                           </div>
                        </div>
                        {/* Client side */}
                        <div className="space-y-8 bg-zinc-50/50 rounded-[2rem] p-8 border border-zinc-100">
                           <div className="space-y-5">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-amber-400 shadow-lg">
                                    <User className="h-5 w-5" />
                                 </div>
                                 <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Visiteur</div>
                                    <div className="text-sm font-black text-zinc-900 uppercase truncate">{selectedReservation.user?.nom || selectedReservation.user?.name || 'Inconnu'}</div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 border border-zinc-100 shadow-sm">
                                    <Mail className="h-4 w-4" />
                                 </div>
                                 <div className="min-w-0">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email</div>
                                    <div className="text-[11px] font-black text-zinc-900 truncate">{selectedReservation.user?.email || '—'}</div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 border border-zinc-100 shadow-sm">
                                    <Phone className="h-4 w-4" />
                                 </div>
                                 <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Téléphone</div>
                                    <div className="text-[11px] font-black text-zinc-900 tracking-widest">{selectedReservation.user?.telephone || '—'}</div>
                                 </div>
                              </div>
                           </div>

                           <div className="pt-6 border-t border-zinc-200/50">
                              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Statut Actuel</div>
                              <StatusBadge status={selectedReservation.status} />
                           </div>
                        </div>
                    </div>
                 </div>
                 <div className="px-10 py-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3">
                    {buildWhatsappUrl(selectedReservation) && (
                       <a href={buildWhatsappUrl(selectedReservation)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 h-12 px-8 rounded-2xl bg-[#25D366] text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-[#128C7E] transition-all">
                          <MousePointer2 className="h-4 w-4" /> Contacter
                       </a>
                    )}
                    <Button onClick={() => setSelectedReservation(null)} className="h-12 px-8 rounded-2xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest border-none">Fermer</Button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservationsPage;
