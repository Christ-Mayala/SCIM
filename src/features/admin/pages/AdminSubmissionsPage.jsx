import React, { useEffect, useState } from 'react';
import {
  CheckCircle2, Trash2, User, Phone, Mail, MapPin, Building2,
  ClipboardList, Eye, ExternalLink, Clock, XCircle, X, Save,
  ArrowRight, Tag, Maximize2, Home, Bath, Bed, Layout, ShieldCheck, Zap, RefreshCw, AlertTriangle
} from 'lucide-react';
import { adminAPI, formatPrice, formatDate } from '../../../lib/api';
import { cn } from '../../../lib/utils';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import toast from 'react-hot-toast';

const LIMIT = 5;

const StatusTab = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
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

const AdminSubmissionsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, totalPages: 1, totalItems: 0 });
    const [statusFilter, setStatusFilter] = useState('pending');
    
    // Edit Modal State
    const [selected, setSelected] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [draft, setDraft] = useState({});
    const [saving, setSaving] = useState(false);

    const loadSubmissions = async (page = 1, currentStatus = statusFilter) => {
        try {
            setLoading(true);
            setError(null);
            const res = await adminAPI.getPropertySubmissions({ page, limit: LIMIT, status: currentStatus });
            const data = res.data?.data || res.data;
            setSubmissions(Array.isArray(data?.items) ? data.items : []);
            setPagination({
                page: data?.page || 1,
                limit: LIMIT,
                totalPages: data?.totalPages || 1,
                totalItems: data?.total || 0,
            });
        } catch (e) {
            setError(e?.response?.data?.message || 'Erreur lors du chargement des soumissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSubmissions(1, statusFilter); }, [statusFilter]);

    const handleAction = async (id, status) => {
        const confirmMsg = status === 'approved' 
            ? 'Approuver cette soumission ? Le bien sera immédiatement publié sur le site.' 
            : 'Rejeter cette soumission ?';
            
        if (!window.confirm(confirmMsg)) return;

        try {
            await adminAPI.updatePropertySubmissionStatus(id, status);
            toast.success(status === 'approved' ? 'Propriété approuvée et publiée !' : 'Soumission rejetée.');
            setSubmissions(prev => prev.filter(s => s._id !== id));
            setPagination(prev => ({ ...prev, totalItems: Math.max(0, prev.totalItems - 1) }));
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Action impossible');
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                // Submitter info
                nomComplet: draft.nomComplet,
                email: draft.email,
                telephone: draft.telephone,
                
                // Property info
                titre: draft.titre,
                description: draft.description,
                prix: draft.prix ? Number(draft.prix) : undefined,
                ville: draft.ville,
                adresse: draft.adresse,
                categorie: draft.categorie,
                transactionType: draft.transactionType,
                superficie: draft.superficie ? Number(draft.superficie) : undefined,
                nombre_chambres: draft.nombre_chambres ? Number(draft.nombre_chambres) : undefined,
                nombre_salles_bain: draft.nombre_salles_bain ? Number(draft.nombre_salles_bain) : undefined,
                nombre_salons: draft.nombre_salons ? Number(draft.nombre_salons) : undefined,
            };
            await adminAPI.updatePropertySubmission(selected._id, payload);
            toast.success("Modifications enregistrées");
            loadSubmissions(pagination.page, statusFilter);
            setEditOpen(false);
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer DÉFINITIVEMENT cette soumission ?')) return;
        try {
            await adminAPI.deletePropertySubmission(id);
            setSubmissions(prev => prev.filter(s => s._id !== id));
            toast.success('Soumission supprimée');
        } catch (e) { toast.error('Erreur suppression'); }
    };

    return (
      <div className="min-h-screen bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* ── Header Section ── */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white mb-4 shadow-lg shadow-zinc-900/10">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Modération Editoriale
              </div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Soumissions</h1>
              <p className="mt-1 text-sm font-medium text-zinc-500">Examinez et approuvez les nouveaux biens soumis par les partenaires.</p>
            </div>
            <div className="flex items-center gap-3">
               <Button 
                 variant="outline" 
                 onClick={() => loadSubmissions(1)} 
                 className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] border-zinc-200 bg-white hover:bg-zinc-50 transition-all shadow-sm"
               >
                 <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                 Actualiser
               </Button>
            </div>
          </div>

          {/* ── Status Tabs ── */}
          <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden mb-8">
             <div className="flex items-center overflow-x-auto divide-x divide-zinc-50">
                <StatusTab id="pending" label="En attente" icon={Clock} active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} />
                <StatusTab id="approved" label="Approuvées" icon={CheckCircle2} active={statusFilter === 'approved'} onClick={() => setStatusFilter('approved')} />
                <StatusTab id="rejected" label="Rejetées" icon={XCircle} active={statusFilter === 'rejected'} onClick={() => setStatusFilter('rejected')} />
                <div className="flex-1 px-8 py-4 text-right">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <span className="text-zinc-900">{pagination.totalItems}</span> soumissions
                   </div>
                </div>
             </div>
          </div>

          {error && (
            <div className="mb-8 p-5 rounded-[1.5rem] bg-red-50 border border-red-100 flex items-center gap-4 text-sm text-red-600 font-bold uppercase tracking-tight">
               <AlertTriangle className="h-5 w-5" />
               {error}
            </div>
          )}

          {/* ── List Layout ── */}
          {loading && pagination.page === 1 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
               <LoadingSpinner size="lg" />
               <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em]">Chargement des flux...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-[2.5rem] bg-white border border-dashed border-zinc-200 py-32 text-center flex flex-col items-center justify-center">
               <ClipboardList className="h-12 w-12 text-zinc-200 mb-4" />
               <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Aucune soumission</h3>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Tous les biens ont été modérés.</p>
            </div>
          ) : (
            <div className="space-y-6">
               {submissions.map((sub) => {
                 const draft = sub.propertyDraft || {};
                 return (
                   <div key={sub._id} className="group overflow-hidden bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col lg:flex-row">
                      <div className="lg:w-80 h-64 lg:h-auto shrink-0 relative overflow-hidden bg-zinc-100 border-b lg:border-b-0 lg:border-r border-zinc-50">
                         <img 
                           src={draft.images?.[0]?.url || '/images/scim-logo.jpg'} 
                           alt="" 
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                         />
                         <div className="absolute top-6 left-6">
                             <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-zinc-900 text-white">
                                {sub.status === 'pending' ? 'À modérer' : sub.status}
                             </span>
                         </div>
                      </div>

                      <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between gap-8">
                         <div>
                            <div className="flex items-center justify-between gap-4 mb-4">
                               <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-amber-400 shadow-lg ring-1 ring-white/10 shrink-0">
                                     <Building2 className="h-5 w-5" />
                                  </div>
                                  <div className="min-w-0">
                                     <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{draft.categorie || 'S/C'}</div>
                                     <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight leading-tight group-hover:text-gold-dark truncate max-w-[300px] mt-0.5">
                                        {draft.titre || 'Bien sans titre'}
                                     </h3>
                                  </div>
                               </div>
                               <div className="text-right shrink-0">
                                  <div className="text-2xl font-black text-zinc-900 tracking-tighter">{formatPrice(draft.prix)}</div>
                                  <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">Montant Estimé</div>
                               </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10px] font-black text-zinc-600 uppercase tracking-tight">
                                  <MapPin className="h-3.5 w-3.5 text-amber-500" /> {draft.ville || '—'}
                               </span>
                               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10px] font-black text-zinc-600 uppercase tracking-tight">
                                  <User className="h-3.5 w-3.5 text-blue-500" /> Soumis par : {sub.submitter?.nomComplet || 'Agent'}
                               </span>
                               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-tight italic">
                                  <Clock className="h-3.5 w-3.5" /> {formatDate(sub.createdAt)}
                               </span>
                            </div>
                         </div>

                         <div className="flex items-center gap-3 pt-8 border-t border-zinc-50 sm:opacity-0 sm:translate-x-4 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-500">
                            {sub.status === 'pending' && (
                               <>
                                 <Button 
                                   onClick={() => handleAction(sub._id, 'approved')} 
                                   className="h-11 px-8 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 border-none hover:bg-emerald-600 transition-all"
                                 >
                                    Approuver
                                 </Button>
                                 <Button 
                                   onClick={() => handleAction(sub._id, 'rejected')} 
                                   variant="outline"
                                   className="h-11 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border-red-100 text-red-500 hover:bg-red-50 transition-all"
                                 >
                                    Rejeter
                                 </Button>
                               </>
                            )}
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setSelected(sub);
                                setDraft({ 
                                    ...sub.propertyDraft,
                                    nomComplet: sub.submitter?.nomComplet,
                                    email: sub.submitter?.email,
                                    telephone: sub.submitter?.telephone
                                });
                                setEditOpen(true);
                              }}
                              className="h-11 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all shadow-sm"
                            >
                               <Eye className="h-4 w-4 mr-2" /> Examiner
                            </Button>
                            <Button 
                               variant="outline" 
                               onClick={() => handleDelete(sub._id)} 
                               className="h-11 w-12 p-0 rounded-2xl border-zinc-200 text-red-500 hover:bg-red-50 transition-all shadow-sm shrink-0"
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
          {!loading && submissions.length > 0 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-6 bg-white rounded-[2rem] border border-zinc-200 shadow-sm">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                   Page <span className="text-zinc-900">{pagination.page}</span> / <span className="text-zinc-900">{pagination.totalPages}</span>
                </div>
                <div className="flex items-center gap-3">
                   <Button variant="outline" onClick={() => loadSubmissions(pagination.page - 1)} disabled={pagination.page <= 1} className="h-11 px-6 rounded-xl text-[10px] font-black uppercase border-zinc-200">Précédent</Button>
                   <Button variant="outline" onClick={() => loadSubmissions(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="h-11 px-6 rounded-xl text-[10px] font-black uppercase border-zinc-200">Suivant</Button>
                </div>
            </div>
          )}
        </div>

        {/* ── Edit/Review Modal ── */}
        {editOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-zinc-950/95" onClick={() => setEditOpen(false)} />
             <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 custom-scrollbar">
                 <div className="flex items-center justify-between px-10 py-8 border-b border-zinc-100 sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em]">Contrôle Editorial</h3>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Réf Sub: {selected?._id}</p>
                    </div>
                    <button onClick={() => setEditOpen(false)} className="h-11 w-11 rounded-2xl bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                       <X className="h-5 w-5 text-zinc-500" />
                    </button>
                 </div>

                 <div className="p-10 space-y-10">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-2">Appellation du bien</label>
                          <input 
                            value={draft.titre || ''} 
                            onChange={(e) => setDraft({...draft, titre: e.target.value})}
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-sm font-black text-zinc-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/5 transition-all"
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-2">Valorisation (FCFA)</label>
                          <input 
                            type="number"
                            value={draft.prix || 0} 
                            onChange={(e) => setDraft({...draft, prix: Number(e.target.value)})}
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-sm font-black text-zinc-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/5 transition-all"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-2">Localisation VILLE</label>
                          <input 
                            value={draft.ville || ''} 
                            onChange={(e) => setDraft({...draft, ville: e.target.value})}
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-2">Catégorie</label>
                          <select 
                            value={draft.categorie || ''} 
                            onChange={(e) => setDraft({...draft, categorie: e.target.value})}
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                          >
                             <option value="Appartement">Appartement</option>
                             <option value="Maison">Maison</option>
                             <option value="Hôtel">Hôtel</option>
                             <option value="Terrain">Terrain</option>
                             <option value="Commercial">Commercial</option>
                             <option value="Autre">Autre</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-2">Transaction</label>
                          <select 
                            value={draft.transactionType || ''} 
                            onChange={(e) => setDraft({...draft, transactionType: e.target.value})}
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                          >
                             <option value="vente">Vente</option>
                             <option value="location">Location</option>
                          </select>
                       </div>
                    </div>

                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-2">Descriptif Technique</label>
                       <textarea 
                          value={draft.description || ''} 
                          onChange={(e) => setDraft({...draft, description: e.target.value})}
                          rows={6}
                          className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-8 py-6 text-sm font-medium text-zinc-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/5 transition-all resize-none"
                       />
                    </div>
                 </div>

                 <div className="px-10 py-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3 sticky bottom-0 z-10">
                    <Button variant="outline" onClick={() => setEditOpen(false)} className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border-zinc-200">Annuler</Button>
                    <Button 
                       onClick={handleSave} 
                       loading={saving}
                       className="h-12 px-8 rounded-2xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-zinc-900/20 border-none hover:bg-zinc-800 flex items-center gap-2"
                    >
                       <Save className="h-4 w-4 text-amber-400" /> Sauvegarder les modifications
                    </Button>
                 </div>
             </div>
          </div>
        )}
      </div>
    );
};

export default AdminSubmissionsPage;
