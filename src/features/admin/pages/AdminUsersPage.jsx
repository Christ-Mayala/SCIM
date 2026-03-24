import React, { useEffect, useMemo, useState } from 'react';
import { Search, Shield, Trash2, UserCheck, Pencil, X, Save, Users, ShieldCheck, Zap, RefreshCw, XCircle } from 'lucide-react';
import { adminAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const StatusPill = ({ status }) => {
  const cfg = {
    active:   { label: 'Actif',   cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    inactive: { label: 'Inactif', cls: 'bg-zinc-100 text-zinc-500 border-zinc-200' },
    banned:   { label: 'Banni',   cls: 'bg-red-50 text-red-600 border-red-100' },
    deleted:  { label: 'Supprimé',cls: 'bg-zinc-900 text-white border-zinc-800' },
  };
  const s = cfg[status] || cfg.inactive;
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border", s.cls)}>
      {s.label}
    </span>
  );
};

const AdminUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('user');
  const [pagination, setPagination] = useState({ page: 1, limit: 5, totalPages: 1, totalItems: 0 });

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({ nom: '', email: '', telephone: '', status: 'active' });

  const load = async (page = 1, currentRole = roleFilter, q = search) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getUsers({ page, limit: 5, search: q || undefined, role: currentRole });
      const data = res.data?.data || res.data;
      setItems(Array.isArray(data?.users) ? data.users : Array.isArray(data?.items) ? data.items : []);
      setPagination({
        page: data?.page || 1,
        limit: 5,
        totalPages: data?.totalPages || 1,
        totalItems: data?.totalUsers || data?.total || 0,
      });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, roleFilter, search); }, [roleFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((u) => `${u.nom || ''} ${u.name || ''} ${u.email || ''} ${u.telephone || ''}`.toLowerCase().includes(q));
  }, [items, search]);

  const openEdit = (u) => {
    setSelected(u);
    setDraft({ nom: u?.nom || u?.name || '', email: u?.email || '', telephone: u?.telephone || '', status: u?.status || 'active' });
    setEditOpen(true);
  };
  const closeEdit = () => { setEditOpen(false); setSelected(null); };

  const handleRole = async (id, role) => {
    try {
      await adminAPI.updateUserRole(id, role);
      toast.success(role === 'admin' ? 'Promu Administrateur' : 'Rétrogradé Client');
      load(pagination.page, roleFilter, search);
    } catch (e) { toast.error(e?.response?.data?.message || 'Mise à jour impossible'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await adminAPI.deleteUser(id);
      setItems((prev) => prev.filter((u) => u._id !== id));
      setPagination(prev => ({ ...prev, totalItems: Math.max(0, prev.totalItems - 1) }));
      toast.success('Utilisateur supprimé');
    } catch (e) { toast.error(e?.response?.data?.message || 'Suppression impossible'); }
  };

  const handleSave = async () => {
    if (!selected?._id) return;
    try {
      setSaving(true);
      await adminAPI.updateUser(selected._id, { nom: draft.nom, email: draft.email, telephone: draft.telephone, status: draft.status });
      toast.success('Utilisateur mis à jour');
      load(pagination.page, roleFilter, search);
      closeEdit();
    } catch (e) { toast.error(e?.response?.data?.message || 'Enregistrement impossible'); }
    finally { setSaving(false); }
  };

  const StatusTab = ({ id, label, icon: Icon }) => {
    const active = roleFilter === id;
    return (
      <button
        onClick={() => setRoleFilter(id)}
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
              Gouvernance des Membres
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Utilisateurs</h1>
            <p className="mt-1 text-sm font-medium text-zinc-500">Contrôlez les accès et les profils de votre communauté.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button 
               variant="outline" 
               onClick={() => load(1, roleFilter, search)} 
               className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] border-zinc-200 bg-white hover:bg-zinc-50 transition-all shadow-sm"
             >
               <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
               Actualiser
             </Button>
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
                  onKeyDown={(e) => e.key === 'Enter' && load(1, roleFilter, search)}
                  placeholder="Rechercher par nom, email, téléphone..."
                  className="block w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-[1.25rem] text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-medium"
                />
              </div>
            </div>
            
            {/* Tabs Part */}
            <div className="flex items-center overflow-x-auto min-w-[300px]">
              <StatusTab id="user" label="Clients" icon={Users} />
              <StatusTab id="admin" label="Administrateurs" icon={ShieldCheck} />
              <div className="flex-1 px-8 py-4 text-right">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span className="text-zinc-900">{pagination.totalItems}</span> membres
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

        {/* ── Table Section ── */}
        <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden">
          {loading && pagination.page === 1 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Synchronisation des membres...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-zinc-50 bg-zinc-50/30">
                      <th className="py-5 pl-10 pr-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Profil Utilisateur</th>
                      <th className="hidden sm:table-cell py-5 px-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Coordonnées</th>
                      <th className="hidden md:table-cell py-5 px-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Statut</th>
                      <th className="py-5 pl-4 pr-10 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {filtered.map((u) => (
                      <tr key={u._id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="py-5 pl-10 pr-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "h-12 w-12 shrink-0 rounded-2xl border flex items-center justify-center font-black uppercase text-base shadow-sm ring-1 ring-inset transition-transform duration-300 group-hover:scale-105",
                              u.role === 'admin'
                                ? "bg-zinc-900 border-zinc-800 text-amber-400 ring-white/10"
                                : "bg-white border-zinc-200 text-zinc-900 ring-zinc-50"
                            )}>
                              {(u.nom || u.name || 'U').charAt(0)}
                            </div>
                            <div className="min-w-0">
                               <div className="text-sm font-black text-zinc-900 uppercase tracking-tight leading-tight group-hover:text-gold-dark transition-colors truncate max-w-[200px]">
                                 {u.nom || u.name || 'Sans nom'}
                               </div>
                               <div className="flex items-center gap-2 mt-1">
                                  {u.role === 'admin' && (
                                    <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-widest border border-amber-100">Admin</span>
                                  )}
                                  <span className="text-[10px] font-bold text-zinc-400 sm:hidden">#{u._id.slice(-5)}</span>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell py-5 px-4">
                          <div className="text-xs font-black text-zinc-900 tracking-tight leading-tight">{u.email}</div>
                          <div className="text-[10px] font-bold text-zinc-400 mt-0.5 tracking-widest">{u.telephone || '—'}</div>
                        </td>
                        <td className="hidden md:table-cell py-5 px-4">
                          <StatusPill status={u.status} />
                        </td>
                        <td className="py-5 pl-4 pr-10">
                          <div className="flex items-center justify-end gap-2.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                             <Button 
                               size="sm" 
                               variant="outline"
                               onClick={() => openEdit(u)} 
                               className="h-10 w-10 p-0 rounded-xl border-zinc-200 bg-white hover:bg-zinc-900 hover:text-white hover:border-zinc-900 shadow-sm"
                             >
                               <Pencil className="h-4 w-4" />
                             </Button>
                             
                             {u.role !== 'admin' ? (
                               <Button 
                                 size="sm" 
                                 variant="outline"
                                 onClick={() => handleRole(u._id, 'admin')} 
                                 className="h-10 w-10 p-0 rounded-xl border-zinc-200 bg-white hover:border-amber-400 hover:bg-amber-50 text-amber-600 shadow-sm"
                                 title="Promouvoir Admin"
                               >
                                 <ShieldCheck className="h-4 w-4" />
                               </Button>
                             ) : (
                               <Button 
                                 size="sm" 
                                 variant="outline"
                                 onClick={() => handleRole(u._id, 'user')} 
                                 className="h-10 w-10 p-0 rounded-xl border-zinc-200 bg-white hover:border-zinc-900 hover:bg-zinc-50 text-zinc-900 shadow-sm"
                                 title="Rétrograder Client"
                               >
                                 <UserCheck className="h-4 w-4" />
                               </Button>
                             )}

                             <Button 
                               size="sm" 
                               variant="outline" 
                               onClick={() => handleDelete(u._id)} 
                               className="h-10 w-10 p-0 rounded-xl border-zinc-200 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white shadow-sm"
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && !loading && (
                      <tr>
                        <td colSpan={4} className="py-24 text-center">
                          <div className="flex flex-col items-center justify-center opacity-40">
                             <Users className="h-12 w-12 text-zinc-300 mb-4" />
                             <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Aucun membre trouvé</h3>
                             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Essayez d'autres filtres de recherche.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ── */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-6 bg-zinc-50 border-t border-zinc-100">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  Page <span className="text-zinc-900">{pagination.page}</span> <span className="mx-2 opacity-30">/</span> <span className="text-zinc-900">{pagination.totalPages}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => load(pagination.page - 1, roleFilter, search)} 
                    disabled={pagination.page <= 1} 
                    className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200 bg-white shadow-sm"
                  >
                    Précédent
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => load(pagination.page + 1, roleFilter, search)} 
                    disabled={pagination.page >= pagination.totalPages} 
                    className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200 bg-white shadow-sm"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Edit Modal ── */}
        {editOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/95" onClick={closeEdit} />
            <div className="relative w-full max-w-lg rounded-[2.5rem] bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between px-10 py-8 border-b border-zinc-100 bg-zinc-50/50">
                <div>
                  <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em]">Paramètres de Profil</h3>
                  <p className="text-[10px] font-bold text-zinc-400 mt-1 truncate">{selected?.email}</p>
                </div>
                <button className="p-3 rounded-2xl hover:bg-zinc-200/50 transition-colors" onClick={closeEdit}>
                  <X className="h-5 w-5 text-zinc-500" />
                </button>
              </div>
              
              <div className="p-10 space-y-6">
                {[
                  { label: 'Identité Complète', key: 'nom' },
                  { label: 'Adresse Email', key: 'email', type: 'email' },
                  { label: 'Ligne Téléphonique', key: 'telephone' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">{f.label}</label>
                    <input
                      type={f.type || 'text'}
                      value={draft[f.key]}
                      onChange={(e) => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                      className="block w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm font-black text-zinc-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 transition-all uppercase tracking-tight"
                    />
                  </div>
                ))}
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Autorisation du Compte</label>
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft(d => ({ ...d, status: e.target.value }))}
                    className="block w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm font-black text-zinc-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 transition-all uppercase tracking-tight"
                  >
                    <option value="active">✓ Actif (Normal)</option>
                    <option value="inactive">○ Inactif (Bloqué)</option>
                    <option value="banned">⚠️ Banni (Avertissement)</option>
                    <option value="deleted">✕ Supprimé (Définitif)</option>
                  </select>
                </div>
              </div>

              <div className="px-10 py-8 border-t border-zinc-100 bg-zinc-50/80 flex items-center justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={closeEdit} 
                  className="rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:bg-zinc-100"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSave} 
                  loading={saving} 
                  className="rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 hover:bg-zinc-800 gap-2"
                >
                  <Save className="h-4 w-4 text-amber-400" />
                  Mettre à jour
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
