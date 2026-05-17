import React, { useEffect, useState } from 'react';
import {
  CheckCircle2, Trash2, User, Phone, Mail, MapPin, Building2,
  ClipboardList, Eye, ExternalLink, Clock, XCircle, X, Save,
  ArrowRight, Tag, Maximize2, Home, Bath, Bed, Layout, ShieldCheck, Zap, RefreshCw, AlertTriangle, MoreHorizontal
} from 'lucide-react';
import { adminAPI, formatPrice, formatDate } from '../../../lib/api';
import { cn } from '../../../lib/utils';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';

const LIMIT = 10;

const AdminSubmissionsPage = () => {
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, totalPages: 1, totalItems: 0 });
    const [statusFilter, setStatusFilter] = useState('pending');

    const loadSubmissions = async (page = 1, currentStatus = statusFilter) => {
        try {
            setLoading(true);
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
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSubmissions(1, statusFilter); }, [statusFilter]);

    const handleAction = async (id, status) => {
        try {
            await adminAPI.updatePropertySubmissionStatus(id, status);
            toast.success(status === 'approved' ? 'Approuvé' : 'Rejeté');
            loadSubmissions(pagination.page, statusFilter);
        } catch (e) { toast.error('Action impossible'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette soumission ?')) return;
        try {
            await adminAPI.deletePropertySubmission(id);
            setSubmissions(prev => prev.filter(s => s._id !== id));
            toast.success('Supprimé');
        } catch (e) { toast.error('Erreur'); }
    };

    return (
      <div className="p-4 lg:p-8 max-w-full text-white">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Administration <span className="opacity-30">/</span> <span className="text-zinc-300">Soumissions</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic uppercase">Modération Editoriale<span className="text-gold-primary">.</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={() => loadSubmissions(1)} className="h-12 w-12 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center p-0 transition-all">
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Left: Content Section */}
          <div className="flex-1 space-y-8 min-w-0">
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between px-8 py-6 gap-4">
                <div className="flex items-center gap-2">
                  {['pending', 'approved', 'rejected'].map((s) => (
                    <button 
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        statusFilter === s ? "bg-gold-primary text-black" : "text-zinc-500 hover:text-white"
                      )}
                    >
                      {s === 'pending' ? 'En attente' : s === 'approved' ? 'Approuvées' : 'Rejetées'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="px-6 py-4">Propriété</th>
                      <th className="px-6 py-4">Soumis par</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                    <tr><td colSpan="4" className="py-20 text-center"><LoadingSpinner size="md" /></td></tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="h-16 w-16 rounded-3xl bg-zinc-900/50 flex items-center justify-center text-zinc-700">
                             <ClipboardList className="h-8 w-8" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-white uppercase tracking-widest">Flux vide</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Aucune soumission en attente pour ce statut</p>
                          </div>
                          <Button onClick={() => setStatusFilter('pending')} variant="outline" className="h-9 rounded-xl border-white/5 bg-zinc-950/50 text-[9px] font-black uppercase tracking-widest">Réinitialiser</Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                      submissions.map((sub) => {
                        const draft = sub.propertyDraft || {};
                        return (
                          <tr key={sub._id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl overflow-hidden bg-zinc-800 border border-white/5 shrink-0">
                                  <img src={draft.images?.[0]?.url || '/images/scim-logo.jpg'} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                   <div className="text-[11px] font-black text-white uppercase tracking-tight truncate">{draft.titre || 'Sans titre'}</div>
                                   <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{formatPrice(draft.prix)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                               <div className="text-[11px] font-black text-white uppercase tracking-tight">{sub.submitter?.nomComplet || 'Agent'}</div>
                               <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5 truncate max-w-[150px]">{sub.submitter?.email}</div>
                            </td>
                            <td className="px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase whitespace-nowrap">
                               {formatDate(sub.createdAt)}
                            </td>
                            <td className="px-6 py-5 text-right">
                               <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {statusFilter === 'pending' && (
                                    <>
                                      <button onClick={() => handleAction(sub._id, 'approved')} className="text-emerald-500 hover:text-emerald-400 transition-colors" title="Approuver"><CheckCircle2 className="h-4 w-4" /></button>
                                      <button onClick={() => handleAction(sub._id, 'rejected')} className="text-red-500 hover:text-red-400 transition-colors" title="Rejeter"><XCircle className="h-4 w-4" /></button>
                                    </>
                                  )}
                                  <button onClick={() => handleDelete(sub._id)} className="text-zinc-500 hover:text-red-500 transition-colors" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
                                  <button className="text-zinc-500 hover:text-white transition-colors" title="Détails"><Eye className="h-4 w-4" /></button>
                               </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && submissions.length > 0 && (
                <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    Page {pagination.page} / {pagination.totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button disabled={pagination.page <= 1} onClick={() => loadSubmissions(pagination.page - 1)} className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 text-zinc-500 hover:text-white disabled:opacity-30 transition-all">Précédent</button>
                    <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadSubmissions(pagination.page + 1)} className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 text-zinc-500 hover:text-white disabled:opacity-30 transition-all">Suivant</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full xl:w-[360px] space-y-8 shrink-0">
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-8">Statistiques</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-gold-primary">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Total Flux</span>
                  </div>
                  <span className="text-lg font-black text-white">{pagination.totalItems}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 text-center">
               <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary mx-auto mb-6">
                  <ShieldCheck className="h-7 w-7" />
               </div>
               <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Modération Rapide</h4>
               <p className="text-[11px] text-zinc-500 leading-relaxed mb-8 font-medium">
                 Toutes les soumissions doivent être examinées avec soin avant d'être publiées sur le catalogue.
               </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default AdminSubmissionsPage;
