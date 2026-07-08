import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2, Trash2, ClipboardList, Eye, XCircle,
  RefreshCw, ShieldCheck, X, Phone, Mail, User, MapPin,
  Tag, Banknote, Ruler, BedDouble, Bath, Sofa, Zap,
  Car, Trees, Waves, Shield, Wifi, Wind, Flame, Building2,
  Image as ImageIcon, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { adminAPI, formatPrice, formatDate } from '../../../lib/api';
import { cn } from '../../../lib/utils';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';

const LIMIT = 10;

const STATUS_CONFIG = {
  pending:  { label: 'En attente', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  approved: { label: 'Approuvée',  cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  rejected: { label: 'Rejetée',    cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

/* ── small info row ── */
const Row = ({ label, value, color = '' }) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0 pt-0.5">{label}</span>
    <span className={cn('text-xs font-bold text-right break-words max-w-[60%]', color || 'text-zinc-200')}>{value || '—'}</span>
  </div>
);

/* ── amenity badge ── */
const Chip = ({ label, active }) => active ? (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-[9px] font-black text-gold-primary uppercase tracking-widest">
    <span className="w-1.5 h-1.5 rounded-full bg-gold-primary" />{label}
  </span>
) : null;

/* ── Submission Detail Drawer ── */
const SubmissionDrawer = ({ sub, onClose, onApprove, onReject }) => {
  const draft = sub.propertyDraft || {};
  const scfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
  const images = Array.isArray(draft.images) ? draft.images : [];
  const [imgIdx, setImgIdx] = useState(0);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const amenities = [
    { key: 'garage',   label: 'Garage' },
    { key: 'gardien',  label: 'Gardien' },
    { key: 'balcon',   label: 'Balcon' },
    { key: 'piscine',  label: 'Piscine' },
    { key: 'jardin',   label: 'Jardin' },
    { key: 'wifi',     label: 'Wi-Fi' },
    { key: 'climatisation', label: 'Climatisation' },
    { key: 'chauffage', label: 'Chauffage' },
    { key: 'parking',  label: 'Parking' },
    { key: 'alarme',   label: 'Alarme' },
    { key: 'interphone', label: 'Interphone' },
    { key: 'ascenseur', label: 'Ascenseur' },
    { key: 'cuisine_equipee', label: 'Cuisine équipée' },
    { key: 'groupe_electrogene', label: 'Groupe électrogène' },
    { key: 'panneau_solaire', label: 'Panneaux solaires' },
    { key: 'eau_courante', label: 'Eau 24/7' },
    { key: 'tv_cable', label: 'TV câblée' },
    { key: 'salle_sport', label: 'Salle de sport' },
    { key: 'cave', label: 'Cave' },
    { key: 'animaux', label: 'Animaux admis' },
    { key: 'pmr', label: 'Accès PMR' },
  ].filter(a => Boolean(draft[a.key]));

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      {/* backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" />

      {/* drawer panel */}
      <div
        className="w-full max-w-xl bg-[#111] border-l border-white/10 flex flex-col h-full overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* drawer header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3 min-w-0">
            <span className={cn('inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border whitespace-nowrap', scfg.cls)}>
              {scfg.label}
            </span>
            <h2 className="text-sm font-black text-white uppercase truncate">{draft.titre || 'Sans titre'}</h2>
          </div>
          <button onClick={onClose}
            className="h-9 w-9 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* ── photo gallery ── */}
          {images.length > 0 ? (
            <div className="relative bg-zinc-950">
              <img
                src={images[imgIdx]?.url}
                alt=""
                className="w-full aspect-video object-cover"
              />
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all disabled:opacity-30"
                    disabled={imgIdx === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setImgIdx(i => Math.min(images.length - 1, i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all disabled:opacity-30"
                    disabled={imgIdx === images.length - 1}>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={cn('w-1.5 h-1.5 rounded-full transition-all', i === imgIdx ? 'bg-gold-primary w-4' : 'bg-white/30')} />
                    ))}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded-lg text-[9px] font-black text-white">
                    {imgIdx + 1} / {images.length}
                  </div>
                </>
              )}
              {/* thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 bg-zinc-950/80 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={cn('h-12 w-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all', i === imgIdx ? 'border-gold-primary' : 'border-transparent opacity-50 hover:opacity-80')}>
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-zinc-900 flex items-center justify-center border-b border-white/5">
              <ImageIcon className="h-12 w-12 text-zinc-700" />
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* ── Soumetteur ── */}
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User className="h-3 w-3" /> Coordonnées soumetteur
              </p>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 divide-y divide-white/[0.05]">
                <Row label="Nom" value={sub.submitter?.nomComplet} />
                <Row label="Email" value={sub.submitter?.email} />
                <Row label="Téléphone" value={sub.submitter?.telephone} />
                <Row label="Date soumission" value={formatDate(sub.createdAt)} />
                <Row label="Source" value={sub.source === 'authenticated_form' ? 'Utilisateur connecté' : 'Formulaire public'} />
              </div>
            </div>

            {/* ── Infos bien ── */}
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Tag className="h-3 w-3" /> Informations du bien
              </p>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 divide-y divide-white/[0.05]">
                <Row label="Titre" value={draft.titre} />
                <Row label="Transaction" value={draft.transactionType === 'vente' ? 'Vente' : 'Location'} color={draft.transactionType === 'vente' ? 'text-emerald-400' : 'text-blue-400'} />
                <Row label="Catégorie" value={draft.categorie} />
                <Row label="Prix" value={formatPrice(draft.prix)} color="text-gold-primary" />
                <Row label="Ville" value={draft.ville} />
                <Row label="Adresse" value={draft.adresse} />
              </div>
            </div>

            {/* ── Surfaces ── */}
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Ruler className="h-3 w-3" /> Surfaces & Pièces
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Surface', value: draft.superficie ? `${draft.superficie} m²` : null },
                  { label: 'Chambres', value: draft.nombre_chambres > 0 ? draft.nombre_chambres : null },
                  { label: 'Salles de bain', value: draft.nombre_salles_bain > 0 ? draft.nombre_salles_bain : null },
                  { label: 'Salons', value: draft.nombre_salons > 0 ? draft.nombre_salons : null },
                ].filter(f => f.value !== null).map(f => (
                  <div key={f.label} className="bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-center">
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{f.label}</p>
                    <p className="text-base font-black text-white">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Équipements ── */}
            {amenities.length > 0 && (
              <div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap className="h-3 w-3" /> Équipements
                </p>
                <div className="flex flex-wrap gap-2">
                  {amenities.map(a => <Chip key={a.key} label={a.label} active />)}
                </div>
              </div>
            )}

            {/* ── Description ── */}
            {draft.description && (
              <div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3">Description</p>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{draft.description}</p>
                </div>
              </div>
            )}

            {/* ── Review note if rejected ── */}
            {sub.status === 'rejected' && sub.reviewNote && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2">Motif de rejet</p>
                <p className="text-sm text-red-300 leading-relaxed">{sub.reviewNote}</p>
              </div>
            )}

            {/* ── Actions ── */}
            {sub.status === 'pending' && (
              <div className="space-y-3 pt-2">
                {showRejectForm ? (
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Motif du rejet (optionnel)</p>
                    <textarea
                      value={rejectNote}
                      onChange={e => setRejectNote(e.target.value)}
                      placeholder="Expliquez pourquoi ce bien est rejeté..."
                      rows={3}
                      className="w-full bg-zinc-950/60 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/30 resize-none transition-all"
                    />
                    <div className="flex gap-3">
                      <Button onClick={() => { onReject(sub._id, rejectNote); onClose(); }}
                        className="flex-1 h-11 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-black uppercase tracking-widest text-[10px] border border-red-500/20">
                        Confirmer le rejet
                      </Button>
                      <button onClick={() => setShowRejectForm(false)}
                        className="px-4 h-11 rounded-2xl border border-white/5 bg-zinc-900 text-zinc-400 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button onClick={() => { onApprove(sub._id); onClose(); }}
                      className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20">
                      ✓ Approuver & Publier
                    </Button>
                    <Button onClick={() => setShowRejectForm(true)}
                      className="flex-1 h-12 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-black uppercase tracking-widest text-[10px] border border-red-500/20">
                      ✕ Rejeter
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main page ── */
const AdminSubmissionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selected, setSelected] = useState(null);
  const loadIdRef = useRef(0);

  const load = async (page = 1, status = statusFilter) => {
    const callId = ++loadIdRef.current;
    try {
      setLoading(true);
      setSubmissions([]);
      const res = await adminAPI.getPropertySubmissions({ page, limit: LIMIT, status });
      if (callId !== loadIdRef.current) return;
      const d = res.data?.data || res.data;
      setSubmissions(Array.isArray(d?.items) ? d.items : []);
      setPagination({ page: d?.page || 1, totalPages: d?.totalPages || 1, totalItems: d?.total || 0 });
    } catch {
      if (callId !== loadIdRef.current) return;
      setSubmissions([]);
    } finally {
      if (callId === loadIdRef.current) setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []); // eslint-disable-line

  const handleStatusChange = (v) => { if (statusFilter === v) return; setStatusFilter(v); load(1, v); };

  const handleAction = async (id, status, note = '') => {
    try {
      await adminAPI.updatePropertySubmissionStatus(id, status, note);
      toast.success(status === 'approved' ? '✓ Bien approuvé et publié' : 'Soumission rejetée');
      load(pagination.page, statusFilter);
    } catch { toast.error('Action impossible'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette soumission définitivement ?')) return;
    try {
      await adminAPI.deletePropertySubmission(id);
      setSubmissions(prev => prev.filter(s => s._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Soumission supprimée');
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  const statusTabs = [
    { value: 'pending',  label: 'En attente' },
    { value: 'approved', label: 'Approuvées' },
    { value: 'rejected', label: 'Rejetées' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-full text-white">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ── Main ── */}
        <div className="xl:col-span-2 space-y-8 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                Administration / <span className="text-zinc-300">Soumissions</span>
              </p>
              <h1 className="text-3xl font-black tracking-tight uppercase italic">
                Modération Éditoriale<span className="text-gold-primary">.</span>
              </h1>
            </div>
            <button onClick={() => load(1, statusFilter)}
              className="h-11 w-11 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-all shrink-0">
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>
          </div>

          {/* tabs */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5">
            <div className="flex flex-wrap gap-2">
              {statusTabs.map(t => (
                <button key={t.value} onClick={() => handleStatusChange(t.value)}
                  className={cn(
                    'px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                    statusFilter === t.value ? 'bg-gold-primary text-black border-gold-primary' : 'text-zinc-500 border-white/5 hover:text-white hover:border-white/10',
                  )}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* table */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 bg-zinc-950/30">
                    <th className="px-6 py-4">Propriété</th>
                    <th className="px-6 py-4">Soumis par</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {loading ? (
                    <tr><td colSpan="5" className="py-20 text-center"><LoadingSpinner size="md" /></td></tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="h-16 w-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-600">
                            <ClipboardList className="h-8 w-8" />
                          </div>
                          <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">Flux vide</p>
                        </div>
                      </td>
                    </tr>
                  ) : submissions.map(sub => {
                    const draft = sub.propertyDraft || {};
                    const scfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={sub._id} className="group hover:bg-white/[0.025] transition-colors cursor-pointer" onClick={() => setSelected(sub)}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl overflow-hidden bg-zinc-800 border border-white/5 shrink-0">
                              <img src={draft.images?.[0]?.url || '/images/scim-logo.jpg'} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-white truncate max-w-[160px]">{draft.titre || 'Sans titre'}</p>
                              <p className="text-[10px] text-gold-primary font-bold">{formatPrice(draft.prix)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-black text-white">{sub.submitter?.nomComplet || 'Agent'}</p>
                          <p className="text-[9px] text-zinc-600 truncate max-w-[140px]">{sub.submitter?.email}</p>
                        </td>
                        <td className="px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase whitespace-nowrap">
                          {formatDate(sub.createdAt)}
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn('inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border whitespace-nowrap', scfg.cls)}>
                            {scfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setSelected(sub)} title="Voir les détails"
                              className="h-8 w-8 rounded-lg border border-white/5 bg-zinc-900 hover:bg-white/5 text-zinc-500 hover:text-white flex items-center justify-center transition-all">
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            {sub.status === 'pending' && (
                              <>
                                <button onClick={() => handleAction(sub._id, 'approved')} title="Approuver"
                                  className="h-8 w-8 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => handleAction(sub._id, 'rejected')} title="Rejeter"
                                  className="h-8 w-8 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all">
                                  <XCircle className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                            <button onClick={() => handleDelete(sub._id)} title="Supprimer"
                              className="h-8 w-8 rounded-lg border border-white/5 bg-zinc-900 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 flex items-center justify-center transition-all">
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
            {!loading && submissions.length > 0 && (
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                  {pagination.totalItems} soumission{pagination.totalItems > 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2">
                  <button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1, statusFilter)}
                    className="h-9 px-4 rounded-xl border border-white/5 bg-zinc-950/50 text-xs font-black text-zinc-500 hover:text-white disabled:opacity-30 uppercase tracking-widest transition-all">
                    Précédent
                  </button>
                  <span className="px-3 py-1.5 text-xs font-black text-zinc-500 bg-zinc-950/30 rounded-lg border border-white/5">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button disabled={pagination.page >= pagination.totalPages} onClick={() => load(pagination.page + 1, statusFilter)}
                    className="h-9 px-4 rounded-xl border border-white/5 bg-zinc-950/50 text-xs font-black text-zinc-500 hover:text-white disabled:opacity-30 uppercase tracking-widest transition-all">
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
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-5">Statistiques</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-gold-primary">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Flux</span>
              </div>
              <span className="text-xl font-black text-white">{pagination.totalItems}</span>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 text-center">
            <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary mx-auto mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Modération Rapide</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
              Cliquez sur une ligne pour voir tous les détails avant de statuer.
            </p>
          </div>
        </div>
      </div>

      {/* ── Drawer ── */}
      {selected && (
        <SubmissionDrawer
          sub={selected}
          onClose={() => setSelected(null)}
          onApprove={(id) => handleAction(id, 'approved')}
          onReject={(id, note) => handleAction(id, 'rejected', note)}
        />
      )}
    </div>
  );
};

export default AdminSubmissionsPage;
