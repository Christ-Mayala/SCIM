import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Pencil, CheckCircle2, PauseCircle, Building2, Plus, Eye, Zap, RefreshCw, MapPin, Tag, TrendingUp, XCircle } from 'lucide-react';
import { adminAPI, formatPrice } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const AdminPropertiesPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });

  const load = async (page = 1, currentStatus = statusFilter, q = search) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getProperties({ page, limit: 5, search: q || undefined, status: currentStatus });
      const data = res.data?.data || res.data;
      setItems(Array.isArray(data?.properties) ? data.properties : Array.isArray(data?.items) ? data.items : []);
      setPagination({
        page: data?.page || 1,
        limit: 5,
        totalPages: data?.totalPages || 1,
        totalItems: data?.totalProperties || data?.total || 0,
      });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, statusFilter, search); }, [statusFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => `${p.titre || ''} ${p.ville || ''} ${p.categorie || ''}`.toLowerCase().includes(q));
  }, [items, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette annonce définitivement ?')) return;
    try {
      await adminAPI.deleteProperty(id);
      setItems((prev) => prev.filter((p) => p._id !== id));
      setPagination(prev => ({ ...prev, totalItems: Math.max(0, prev.totalItems - 1) }));
      toast.success('Annonce supprimée');
    } catch (e) { toast.error(e?.response?.data?.message || 'Suppression impossible'); }
  };

  const handleToggleStatus = async (p) => {
    const active = p.status === 'active';
    const next = active ? 'inactive' : 'active';
    try {
      await adminAPI.updatePropertyStatus(p._id, next);
      setItems((prev) => prev.map((x) => (x._id === p._id ? { ...x, status: next } : x)));
      toast.success(next === 'active' ? 'Annonce publiée' : 'Annonce suspendue');
    } catch (e) { toast.error(e?.response?.data?.message || 'Mise à jour impossible'); }
  };

  const StatusTab = ({ id, label, icon: Icon }) => {
    const active = statusFilter === id;
    return (
      <button
        onClick={() => setStatusFilter(id)}
        className={cn(
          "flex items-center gap-2.5 px-6 py-4 border-b-2 font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap",
          active 
          ? `border-gold-primary text-zinc-900 bg-gold-primary/5` 
          : "border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
        )}
      >
        <Icon className={cn("h-4 w-4", active ? "text-gold-primary" : "text-zinc-400")} />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header Section ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white mb-4 shadow-lg shadow-zinc-900/10">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Pilotage Immobilier
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Annonces</h1>
            <p className="mt-1 text-sm font-medium text-zinc-500">Supervisez et maintenez votre catalogue de biens d'exception.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/properties/new">
              <Button className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-gold-primary/20 bg-gold-primary hover:bg-amber-300 text-zinc-900 gap-2 hover:-translate-y-1 transition-all">
                <Plus className="h-4 w-4" /> Nouvelle annonce
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Search & Filter Panel ── */}
        <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-100">
            {/* Search Part */}
            <div className="flex-1 p-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-zinc-300" />
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && load(1, statusFilter, search)}
                  placeholder="Rechercher par titre, ville, catégorie..."
                  className="block w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-[1.25rem] text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-medium"
                />
              </div>
            </div>
            
            {/* Tabs Part */}
            <div className="flex items-center overflow-x-auto min-w-[300px]">
              <StatusTab id="active" label="Actives" icon={CheckCircle2} />
              <StatusTab id="inactive" label="Désactivées" icon={PauseCircle} />
              <div className="flex-1 px-8 py-4 text-right">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span className="text-zinc-900">{pagination.totalItems}</span> annonces
                 </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-5 rounded-[1.5rem] bg-red-50 border border-red-100 flex items-center gap-4 text-sm text-red-600 font-bold uppercase tracking-tight">
            <XCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* ── List Layout ── */}
        {loading && pagination.page === 1 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Scan du catalogue...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[2.5rem] bg-white border border-dashed border-zinc-200 py-32 text-center flex flex-col items-center justify-center">
            <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center mb-6 ring-1 ring-zinc-100">
              <Building2 className="h-10 w-10 text-zinc-200" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
              {statusFilter === 'active' ? 'Aucune annonce active' : 'Aucune annonce désactivée'}
            </h3>
            <p className="mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Votre sélection est actuellement vide.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((p) => {
              const isActive = p.status === 'active';
              return (
                <div key={p._id} className="group overflow-hidden bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col lg:flex-row">
                  {/* Image Side */}
                  <div className="lg:w-80 h-64 lg:h-auto shrink-0 relative overflow-hidden bg-zinc-100 border-b lg:border-b-0 lg:border-r border-zinc-100">
                    <img
                      src={p.images?.[0]?.url || '/images/scim-logo.jpg'}
                      alt={p.titre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg",
                        isActive ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-white'
                      )}>
                        {isActive ? 'En ligne' : 'Suspendue'}
                      </span>
                    </div>
                    {p.transactionType && (
                       <div className="absolute bottom-6 left-6">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white text-zinc-900 shadow-lg border border-white/20">
                           {p.transactionType}
                        </span>
                       </div>
                    )}
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between gap-8">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg ring-1 ring-white/10 shrink-0">
                              <Building2 className="h-5 w-5 text-amber-400" />
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{p.categorie}</div>
                              <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight leading-tight group-hover:text-gold-dark transition-colors line-clamp-2 mt-0.5">
                                {p.titre}
                              </h3>
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                           <div className="text-2xl font-black text-zinc-900 tracking-tighter">{formatPrice(p.prix)}</div>
                           {p.views > 0 && (
                             <div className="flex items-center justify-end gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1">
                                <Eye className="h-3 w-3" /> {p.views} vues
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                         <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10px] font-black text-zinc-600 uppercase tracking-tight">
                            <MapPin className="h-3.5 w-3.5 text-amber-500" /> {p.ville}
                         </span>
                         <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10px] font-black text-zinc-600 uppercase tracking-tight">
                            <Tag className="h-3.5 w-3.5 text-blue-500" /> Réf: {p._id.slice(-6).toUpperCase()}
                         </span>
                         {p.status === 'active' && (
                           <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-tight">
                              <TrendingUp className="h-3.5 w-3.5" /> Performance : Optimale
                           </span>
                         )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:opacity-0 sm:translate-x-4 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-500 pt-8 border-t border-zinc-50">
                      <Button
                        variant="outline"
                        onClick={() => handleToggleStatus(p)}
                        className={cn(
                          "h-11 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border-zinc-200",
                          isActive 
                            ? "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" 
                            : "hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-emerald-500/10"
                        )}
                      >
                        {isActive ? <PauseCircle className="h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                        {isActive ? 'Suspendre' : 'Publier'}
                      </Button>
                      
                      <Link to={`/admin/properties/${p._id}/edit`} className="flex-1 lg:flex-none">
                        <Button 
                          variant="outline" 
                          className="w-full h-11 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Editer
                        </Button>
                      </Link>

                      <Button 
                        variant="outline" 
                        onClick={() => handleDelete(p._id)} 
                        className="h-11 w-12 p-0 rounded-2xl border-zinc-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm shrink-0 flex items-center justify-center"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && items.length > 0 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-6 bg-white rounded-[2rem] border border-zinc-200 shadow-sm">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              Page <span className="text-zinc-900">{pagination.page}</span> <span className="mx-2 opacity-30">/</span> <span className="text-zinc-900">{pagination.totalPages}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => load(pagination.page - 1, statusFilter, search)} 
                disabled={pagination.page <= 1} 
                className="h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200 bg-white shadow-sm"
              >
                Précédent
              </Button>
              <Button 
                variant="outline" size="sm" 
                onClick={() => load(pagination.page + 1, statusFilter, search)} 
                disabled={pagination.page >= pagination.totalPages} 
                className="h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200 bg-white shadow-sm"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPropertiesPage;
