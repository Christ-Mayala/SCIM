import React, { useEffect, useMemo, useState } from 'react';
import { Search, Shield, Trash2, UserCheck, Pencil, X, Save, Users, ShieldCheck, Zap, RefreshCw, XCircle, MoreHorizontal, Eye } from 'lucide-react';
import { adminAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const load = async (page = 1, currentRole = roleFilter, currentStatus = statusFilter, q = debouncedSearch) => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers({ 
        page, 
        limit: 10, 
        search: q || undefined, 
        role: currentRole || undefined,
        status: currentStatus || undefined
      });
      const data = res.data?.data || res.data;
      setItems(Array.isArray(data?.users) ? data.users : Array.isArray(data?.items) ? data.items : []);
      setPagination({
        page: data?.page || 1,
        limit: 10,
        totalPages: data?.totalPages || 1,
        totalItems: data?.totalUsers || data?.total || 0,
      });
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, roleFilter, statusFilter, debouncedSearch); }, [roleFilter, statusFilter, debouncedSearch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await adminAPI.deleteUser(id);
      setItems((prev) => prev.filter((u) => u._id !== id));
      toast.success('Utilisateur supprimé');
    } catch (e) { toast.error('Erreur lors de la suppression'); }
  };

  return (
    <div className="p-4 lg:p-8 max-w-full text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            Administration <span className="opacity-30">/</span> <span className="text-zinc-300">Utilisateurs</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic uppercase">Gestion des Membres<span className="text-gold-primary">.</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={() => load(1)} className="h-12 w-12 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center p-0 transition-all">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left: Table Section */}
        <div className="flex-1 space-y-8 min-w-0">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-8 py-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && load(1)}
                  placeholder="Rechercher par nom ou email..."
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-11 rounded-xl border border-white/5 bg-zinc-950/50 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-1 focus:ring-gold-primary/30"
                >
                  <option value="">Tous les rôles</option>
                  <option value="user">Clients</option>
                  <option value="admin">Admins</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 rounded-xl border border-white/5 bg-zinc-950/50 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-1 focus:ring-gold-primary/30"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                  <option value="banned">Bannis</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="px-6 py-4">Utilisateur</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan="5" className="py-20 text-center"><LoadingSpinner size="md" /></td></tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="h-16 w-16 rounded-3xl bg-zinc-900/50 flex items-center justify-center text-zinc-700">
                             <Users className="h-8 w-8" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-white uppercase tracking-widest">Aucun membre trouvé</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Votre recherche n'a retourné aucun résultat</p>
                          </div>
                          <Button onClick={() => { setSearch(''); setRoleFilter('user'); }} variant="outline" className="h-9 rounded-xl border-white/5 bg-zinc-950/50 text-[9px] font-black uppercase tracking-widest">Réinitialiser</Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((u) => (
                      <tr key={u._id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center font-black text-gold-primary">
                              {(u.nom || u.name || 'U').charAt(0)}
                            </div>
                            <div className="min-w-0">
                               <div className="text-[11px] font-black text-white uppercase tracking-tight truncate">{u.nom || u.name || 'Sans nom'}</div>
                               <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">#{u._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-[11px] font-black text-white truncate">{u.email}</div>
                          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{u.telephone || '—'}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn("text-[9px] font-black uppercase tracking-widest", u.role === 'admin' ? "text-amber-500" : "text-zinc-500")}>
                            {u.role === 'admin' ? 'Admin' : 'Client'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                            u.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-800 text-zinc-500"
                          )}>
                            {u.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-zinc-500 hover:text-white transition-colors" title="Modifier"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(u._id)} className="text-zinc-500 hover:text-red-500 transition-colors" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
                            <button className="text-zinc-500 hover:text-white transition-colors" title="Plus d'actions"><MoreHorizontal className="h-4 w-4" /></button>
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
                  <button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)} className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 text-zinc-500 hover:text-white disabled:opacity-30 transition-all">Précédent</button>
                  <button disabled={pagination.page >= pagination.totalPages} onClick={() => load(pagination.page + 1)} className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 text-zinc-500 hover:text-white disabled:opacity-30 transition-all">Suivant</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-[360px] space-y-8 shrink-0">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-8">Communauté</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-gold-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Total Membres</span>
                </div>
                <span className="text-lg font-black text-white">{pagination.totalItems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
