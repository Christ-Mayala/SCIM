import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Trash2, Pencil, CheckCircle2, PauseCircle, Building2, Plus, 
  Eye, Zap, RefreshCw, MapPin, Tag, TrendingUp, XCircle, Filter, 
  ChevronDown, MoreHorizontal, Calendar, ArrowRight
} from 'lucide-react';
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
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const load = async (page = 1, currentStatus = statusFilter, q = debouncedSearch) => {
    try {
      setLoading(true);
      setError(null);
      
      // On vide les items avant de charger pour éviter de voir les anciens
      setItems([]);
      
      const apiStatus = (!currentStatus || currentStatus === 'all') ? undefined : currentStatus;
      
      const res = await adminAPI.getProperties({ 
        page, 
        limit: 10, 
        search: q || undefined, 
        status: apiStatus 
      });
      
      const responseData = res.data?.data || res.data;
      const properties = responseData?.properties || responseData?.items || [];
      
      if (Array.isArray(properties)) {
        setItems(properties);
      } else {
        setItems([]);
      }

      setPagination({
        page: responseData?.page || 1,
        limit: 10,
        totalPages: responseData?.totalPages || 1,
        totalItems: responseData?.total || responseData?.totalProperties || 0,
      });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur de chargement');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    // Si on clique sur le filtre déjà actif, on ne fait rien pour éviter des doubles appels
    if (statusFilter === newStatus) return;
    
    // Normalisation du statut pour l'API
    const status = newStatus === 'all' ? '' : newStatus;
    setStatusFilter(newStatus); // On garde l'ID original pour l'UI
    
    // On force le rechargement immédiat à la page 1 avec le nouveau statut
    load(1, newStatus, debouncedSearch);
  };

  useEffect(() => { load(1, statusFilter, debouncedSearch); }, [statusFilter, debouncedSearch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette annonce définitivement ?')) return;
    try {
      await adminAPI.deleteProperty(id);
      toast.success('Annonce supprimée');
      // Recharger la page actuelle pour recalculer la pagination
      load(pagination.page, statusFilter, debouncedSearch);
    } catch (e) { toast.error(e?.response?.data?.message || 'Suppression impossible'); }
  };

  const handleToggleStatus = async (p) => {
    const active = p.status === 'active';
    const next = active ? 'inactive' : 'active';
    try {
      await adminAPI.updatePropertyStatus(p._id, next);
      
      // Si on filtre par un statut spécifique, on retire l'élément de la liste
      if (statusFilter && statusFilter !== 'all') {
        setItems((prev) => prev.filter((x) => x._id !== p._id));
      } else {
        // Sinon on met juste à jour le statut visuellement
        setItems((prev) => prev.map((x) => (x._id === p._id ? { ...x, status: next } : x)));
      }
      
      toast.success(next === 'active' ? 'Annonce publiée' : 'Annonce suspendue');
    } catch (e) { toast.error(e?.response?.data?.message || 'Mise à jour impossible'); }
  };

  return (
    <div className="p-4 lg:p-8 max-w-full text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            Administration <span className="opacity-30">/</span> <span className="text-zinc-300">Annonces</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic uppercase">Catalogue Immobilière<span className="text-gold-primary">.</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-4 bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-3 mr-4">
            <div className="flex flex-col items-end border-r border-white/10 pr-4 mr-4">
               <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Total Biens</span>
               <span className="text-sm font-black text-white leading-none">{pagination.totalItems}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Statut Actuel</span>
               <span className="text-[10px] font-black text-gold-primary uppercase leading-none">{statusFilter || 'Tous'}</span>
            </div>
          </div>
          <Button onClick={() => load(1)} className="h-12 w-12 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center p-0 transition-all">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Link to="/admin/properties/new">
            <Button className="h-12 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-gold-primary/20 transition-all hover:-translate-y-1">
              <Plus className="h-4 w-4 mr-2" /> Nouvelle annonce
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex flex-col gap-8">
        
        {/* Full Width Table Section */}
        <div className="w-full space-y-8">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-8 py-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && load(1, statusFilter, search)}
                  placeholder="Rechercher un bien..."
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: 'pending', label: 'En attente' },
                  { id: 'active', label: 'Publiées' },
                  { id: 'inactive', label: 'Suspendues' }
                ].map((f) => (
                  <button 
                    key={f.id}
                    onClick={() => handleStatusChange(f.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      (statusFilter === f.id || (f.id === 'all' && !statusFilter) || (f.id === '' && !statusFilter)) ? "bg-gold-primary text-black" : "text-zinc-500 hover:text-white"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="px-6 py-6">Bien</th>
                    <th className="px-6 py-6">Localisation</th>
                    <th className="px-6 py-6">Prix</th>
                    <th className="px-6 py-6">Vues</th>
                    <th className="px-6 py-6">Statut</th>
                    <th className="px-6 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan="6" className="py-20 text-center"><LoadingSpinner size="md" /></td></tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="h-16 w-16 rounded-3xl bg-zinc-900/50 flex items-center justify-center text-zinc-700">
                             <Building2 className="h-8 w-8" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-white uppercase tracking-widest">Aucune donnée trouvée</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Essayez d'ajuster vos filtres ou votre recherche</p>
                          </div>
                          <Button onClick={() => { setSearch(''); setStatusFilter('active'); }} variant="outline" className="h-9 rounded-xl border-white/5 bg-zinc-950/50 text-[9px] font-black uppercase tracking-widest">Réinitialiser</Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((p) => (
                      <tr key={p._id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 border border-white/5 shadow-lg">
                              <img src={p.images?.[0]?.url || '/images/scim-logo.jpg'} alt={p.titre} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-white truncate uppercase tracking-tight">{p.titre}</div>
                              <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{p.categorie}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                            <MapPin className="h-3.5 w-3.5 text-gold-primary" /> {p.ville}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-xs font-black text-white whitespace-nowrap">
                          {formatPrice(p.prix)}
                        </td>
                        <td className="px-6 py-6 text-[10px] font-bold text-zinc-500">
                          {p.views || 0} vues
                        </td>
                        <td className="px-6 py-6">
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em]",
                            p.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-800 text-zinc-500"
                          )}>
                            {p.status === 'active' ? 'Publiée' : 'Suspendue'}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <Link to={`/properties/${p._id}`} className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-white/5">
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link to={`/admin/properties/${p._id}/edit`} className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-white/5">
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button 
                              onClick={() => handleToggleStatus(p)}
                              className={cn(
                                "p-2.5 rounded-xl transition-all border border-white/5",
                                p.status === 'active' ? "bg-zinc-800 text-amber-500 hover:text-amber-400" : "bg-zinc-800 text-emerald-500 hover:text-emerald-400"
                              )}
                            >
                              {p.status === 'active' ? <PauseCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            </button>
                            <button 
                              onClick={() => handleDelete(p._id)}
                              className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-red-500 transition-all border border-white/5"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && items.length > 0 && (
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
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-8">Statistiques Annonces</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-gold-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Total Actifs</span>
                </div>
                <span className="text-lg font-black text-white">{pagination.totalItems}</span>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Taux d'occupation</span>
                  <span className="text-xs font-black text-emerald-500">82%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-gold-primary rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Aide Rapide</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-8 font-medium">
              Les annonces suspendues ne sont plus visibles sur le site public mais restent accessibles ici pour modification.
            </p>
            <Button variant="outline" className="w-full h-12 rounded-2xl border-white/5 bg-zinc-950/50 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              Guide de publication
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPropertiesPage;
