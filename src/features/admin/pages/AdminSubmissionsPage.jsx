import React, { useEffect, useState } from 'react';
import { CheckCircle2, Trash2, User, Phone, Mail, MapPin, Building2, ClipboardList, Eye, ExternalLink } from 'lucide-react';
import { adminAPI, formatPrice, formatDate } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import toast from 'react-hot-toast';

const AdminSubmissionsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
        totalItems: 0,
    });

    const loadSubmissions = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const res = await adminAPI.getPropertySubmissions({ page, limit: pagination.limit });
            setSubmissions(Array.isArray(res.data?.submissions) ? res.data.submissions : []);
            setPagination({
                page: res.data?.page || 1,
                limit: res.data?.limit || 10,
                totalPages: res.data?.totalPages || 1,
                totalItems: res.data?.totalSubmissions || 0,
            });
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || 'Erreur lors du chargement des soumissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions(1);
    }, []);

    const handleAction = async (id, status) => {
        const confirmMsg = status === 'approved' 
            ? 'Approuver cette soumission ? Le bien sera immédiatement publié sur le site.' 
            : 'Rejeter cette soumission ?';
            
        if (!window.confirm(confirmMsg)) return;

        try {
            await adminAPI.updatePropertySubmissionStatus(id, status);
            toast.success(status === 'approved' ? 'Propriété approuvée et publiée !' : 'Soumission rejetée.');
            loadSubmissions(pagination.page);
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Action impossible');
        }
    };

    if (loading && pagination.page === 1) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200 mb-3">
                            <ClipboardList className="h-3 w-3" />
                            Validation Administrative
                        </div>
                        <h1 className="text-3xl font-bold text-zinc-900">Soumissions de propriétés</h1>
                        <p className="mt-1 text-sm text-zinc-500">Examinez et validez les biens soumis par les clients.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 bg-white px-4 py-2 rounded-xl border border-zinc-200">
                        <span className="font-bold text-zinc-900">{pagination.totalItems}</span> soumissions en attente
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <Trash2 className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="grid gap-6">
                    {submissions.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-zinc-200 p-20 text-center shadow-sm">
                            <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="h-10 w-10 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900">Aucune soumission en attente</h3>
                            <p className="mt-2 text-zinc-500 max-w-sm mx-auto">Toutes les demandes ont été traitées. Bon travail !</p>
                        </div>
                    ) : (
                        submissions.map((sub) => (
                            <div key={sub._id} className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="grid grid-cols-1 lg:grid-cols-4">
                                    {/* Property Preview */}
                                    <div className="lg:col-span-1 h-48 lg:h-full relative overflow-hidden bg-zinc-100 border-r border-zinc-100">
                                        {sub.propertyDraft?.images?.[0]?.url ? (
                                            <img src={sub.propertyDraft.images[0].url} alt={sub.propertyDraft.titre} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <Building2 className="h-12 w-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white/90 backdrop-blur-md text-zinc-900 border-none shadow-sm capitalize">
                                                {sub.propertyDraft?.transactionType}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="lg:col-span-2 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-zinc-900 mb-1">{sub.propertyDraft?.titre || 'Sans titre'}</h3>
                                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                    <MapPin className="h-4 w-4 text-gold-primary" />
                                                    {sub.propertyDraft?.adresse}, {sub.propertyDraft?.ville}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-gold-primary">{formatPrice(sub.propertyDraft?.prix || 0)}</div>
                                                <div className="text-xs text-zinc-400">Soumis le {formatDate(sub.createdAt)}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Informations Client</h4>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-xs">
                                                        {sub.submitter?.nomComplet?.charAt(0) || 'C'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-zinc-900">{sub.submitter?.nomComplet}</div>
                                                        <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                                                            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {sub.submitter?.telephone}</span>
                                                            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {sub.submitter?.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Détails Technique</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-lg text-xs font-medium">{sub.propertyDraft?.categorie}</span>
                                                    {sub.propertyDraft?.superficie && <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-lg text-xs font-medium">{sub.propertyDraft.superficie} m²</span>}
                                                    {sub.propertyDraft?.nombre_chambres && <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-lg text-xs font-medium">{sub.propertyDraft.nombre_chambres} Ch</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="lg:col-span-1 bg-zinc-50 p-6 flex flex-col justify-center gap-3 border-l border-zinc-100">
                                        <Button 
                                            onClick={() => handleAction(sub._id, 'approved')}
                                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white gap-2 h-11"
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                            Approuver le bien
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            onClick={() => handleAction(sub._id, 'rejected')}
                                            className="w-full bg-white border-zinc-200 text-red-600 hover:bg-red-50 hover:border-red-200 gap-2 h-11"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Rejeter
                                        </Button>
                                        <div className="mt-2 text-center">
                                            <button className="text-xs font-bold text-gold-primary hover:underline inline-flex items-center gap-1.5">
                                                <Eye className="h-3 w-3" /> Examiner en détail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {pagination.totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={pagination.page <= 1}
                            onClick={() => loadSubmissions(pagination.page - 1)}
                            className="rounded-xl"
                        >
                            Précèdent
                        </Button>
                        <div className="px-4 text-sm text-zinc-500 font-medium">
                            {pagination.page} / {pagination.totalPages}
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => loadSubmissions(pagination.page + 1)}
                            className="rounded-xl"
                        >
                            Suivant
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSubmissionsPage;
