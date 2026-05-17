import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  UploadCloud, X, Plus, Save, Tag, CalendarClock, Banknote, Percent, 
  Ruler, BedDouble, Bath, Sofa, MapPin, Building2, Home, Key, Eye, 
  Coins, Trash2, Image as ImageIcon, ChevronLeft, Layout, Database, CheckCircle2
} from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Checkbox } from '../components/ui/checkbox';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProperty, updateProperty, fetchPropertyById, loading } = useProperty();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const categoryOptions = useMemo(() => [
    { value: 'Appartement', label: 'Appartement' },
    { value: 'Maison', label: 'Maison' },
    { value: 'Hôtel', label: 'Hôtel' },
    { value: 'Terrain', label: 'Terrain' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Autre', label: 'Autre' },
  ], []);

  const transactionOptions = useMemo(() => [
    { value: 'location', label: 'Location' },
    { value: 'vente', label: 'Vente' },
  ], []);

  const statusOptions = useMemo(() => [
    { value: 'active', label: 'En ligne (Visible)' },
    { value: 'inactive', label: 'Hors ligne (Masqué)' },
  ], []);

  const deviseOptions = useMemo(() => [
    { value: 'XAF', label: 'XAF (FCFA)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'USD', label: 'USD ($)' },
  ], []);

  useEffect(() => {
    if (id) fetchPropertyById(id);
  }, [id]);

  useEffect(() => {
    if (!currentProperty) return;

    setFormData({
      titre: currentProperty.titre || '',
      description: currentProperty.description || '',
      prix: currentProperty.prix ?? '',
      prixOriginal: currentProperty.prixOriginal ?? '',
      devise: currentProperty.devise || 'XAF',
      transactionType: currentProperty.transactionType || 'location',
      categorie: currentProperty.categorie || 'Autre',
      ville: currentProperty.ville || '',
      adresse: currentProperty.adresse || '',
      status: currentProperty.status || 'active',
      isBonPlan: Boolean(currentProperty.isBonPlan),
      bonPlanLabel: currentProperty.bonPlanLabel || '',
      bonPlanExpiresAt: currentProperty.bonPlanExpiresAt
        ? new Date(currentProperty.bonPlanExpiresAt).toISOString().slice(0, 16)
        : '',
      superficie: currentProperty.superficie ?? '',
      nombre_chambres: currentProperty.nombre_chambres ?? '',
      nombre_salles_bain: currentProperty.nombre_salles_bain ?? '',
      nombre_salons: currentProperty.nombre_salons ?? '',
      garage: Boolean(currentProperty.garage),
      piscine: Boolean(currentProperty.piscine),
      jardin: Boolean(currentProperty.jardin),
      balcon: Boolean(currentProperty.balcon),
      gardien: Boolean(currentProperty.gardien),
    });

    const existing = Array.isArray(currentProperty.images) ? currentProperty.images : [];
    setImages(existing.map((img) => ({
      id: img.public_id || img._id || Math.random().toString(36).slice(2),
      url: img.url,
      existing: true,
    })));
  }, [currentProperty?._id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...(prev || {}),
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const next = {};
    if (!String(formData?.titre || '').trim()) next.titre = 'Le titre est requis';
    if (!Number(formData?.prix) || Number(formData.prix) <= 0) next.prix = 'Prix invalide';
    if (!String(formData?.ville || '').trim()) next.ville = 'Ville requise';
    
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        images: images.filter(img => !img.existing).map(img => img.file)
      };
      const result = await updateProperty(id, payload);
      if (result.success) {
        toast.success('Annonce mise à jour avec succès');
        navigate('/admin/properties');
      }
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !currentProperty) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (!formData) return null;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-4 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Administration <span className="opacity-30">/</span> <span className="text-zinc-300">Édition</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic uppercase">
              Modifier l'Annonce<span className="text-gold-primary">.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/properties')}
              className="h-12 px-6 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Annuler
            </button>
            <Button 
              onClick={handleSubmit} 
              loading={saving}
              className="h-12 px-8 rounded-2xl bg-gold-primary text-black font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gold-primary/20 transition-all hover:-translate-y-1"
            >
              <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Form Area */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* General Info */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary shadow-lg">
                  <Tag className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-widest">Informations Générales</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Titre de l'annonce</label>
                  <input
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    placeholder="Ex: Villa de luxe avec piscine à Pointe-Noire"
                    className={cn(
                      "w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all",
                      errors.titre && "border-red-500/50 ring-1 ring-red-500/20"
                    )}
                  />
                  {errors.titre && <p className="mt-2 text-[9px] font-bold text-red-500 uppercase tracking-widest">{errors.titre}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Description détaillée</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Décrivez les atouts majeurs de ce bien..."
                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-zinc-300 outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Transaction</label>
                    <select
                      name="transactionType"
                      value={formData.transactionType}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all appearance-none"
                    >
                      {transactionOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Catégorie</label>
                    <select
                      name="categorie"
                      value={formData.categorie}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all appearance-none"
                    >
                      {categoryOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Status */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary shadow-lg">
                  <Banknote className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-widest">Prix & Visibilité</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Prix du bien</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl pl-6 pr-16 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gold-primary">{formData.devise}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Statut de l'annonce</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all appearance-none"
                  >
                    {statusOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Features & Details */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary shadow-lg">
                  <Layout className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-widest">Détails & Équipements</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {[
                  { name: 'superficie', label: 'Superficie (m²)', icon: Ruler },
                  { name: 'nombre_chambres', label: 'Chambres', icon: BedDouble },
                  { name: 'nombre_salles_bain', label: 'Salles de bain', icon: Bath },
                  { name: 'nombre_salons', label: 'Salons', icon: Sofa },
                ].map((item) => (
                  <div key={item.name}>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">{item.label}</label>
                    <input
                      type="number"
                      name={item.name}
                      value={formData[item.name]}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all text-center"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { key: 'garage', label: 'Garage' },
                  { key: 'piscine', label: 'Piscine' },
                  { key: 'jardin', label: 'Jardin' },
                  { key: 'balcon', label: 'Balcon' },
                  { key: 'gardien', label: 'Gardien' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn(
                      "h-5 w-5 rounded border border-white/10 flex items-center justify-center transition-all",
                      formData[key] ? "bg-gold-primary border-gold-primary" : "bg-zinc-950/50 group-hover:border-gold-primary/30"
                    )}>
                      {formData[key] && <CheckCircle2 className="h-3 w-3 text-black" />}
                      <input 
                        type="checkbox" 
                        name={key} 
                        checked={formData[key]} 
                        onChange={handleChange} 
                        className="hidden"
                      />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors",
                      formData[key] ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    )}>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Media Gallery */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-5 w-5 text-gold-primary" />
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Photos</h4>
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 w-8 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-primary flex items-center justify-center hover:bg-gold-primary hover:text-black transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 {images.map((img, idx) => (
                   <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 group">
                      <img src={img.url || img.preview} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                           type="button"
                           onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                           className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all scale-75 group-hover:scale-100"
                         >
                           <X className="h-4 w-4" />
                         </button>
                      </div>
                   </div>
                 ))}
                 {images.length === 0 && (
                   <div className="col-span-2 py-10 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-zinc-600">
                      <UploadCloud className="h-10 w-10 mb-2 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Aucune photo</p>
                   </div>
                 )}
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 multiple 
                 className="hidden" 
                 onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const newImgs = files.map(f => ({
                      id: Math.random().toString(36).slice(2),
                      file: f,
                      preview: URL.createObjectURL(f),
                      existing: false
                    }));
                    setImages(prev => [...prev, ...newImgs]);
                 }}
               />
            </div>

            {/* Bon Plan Module */}
            <div className={cn(
              "bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 transition-all",
              formData.isBonPlan && "ring-1 ring-gold-primary/30 bg-gold-primary/[0.02]"
            )}>
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                   <Percent className="h-5 w-5 text-gold-primary" />
                   <h4 className="text-sm font-black text-white uppercase tracking-widest">Bon Plan</h4>
                 </div>
                 <button 
                   type="button"
                   onClick={() => setFormData(d => ({ ...d, isBonPlan: !d.isBonPlan }))}
                   className={cn(
                     "w-10 h-5 rounded-full transition-all relative",
                     formData.isBonPlan ? "bg-gold-primary" : "bg-zinc-800"
                   )}
                 >
                   <div className={cn(
                     "h-3 w-3 rounded-full bg-white absolute top-1 transition-all",
                     formData.isBonPlan ? "right-1" : "left-1"
                   )} />
                 </button>
              </div>

              {formData.isBonPlan && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">Prix Original (XAF)</label>
                    <input
                      type="number"
                      name="prixOriginal"
                      value={formData.prixOriginal}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">Libellé Badge</label>
                    <input
                      name="bonPlanLabel"
                      value={formData.bonPlanLabel}
                      onChange={handleChange}
                      placeholder="Ex: OFFRE LIMITÉE"
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-gold-primary uppercase tracking-widest outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">Expire le</label>
                    <input
                      type="datetime-local"
                      name="bonPlanExpiresAt"
                      value={formData.bonPlanExpiresAt}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-white uppercase outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                    />
                  </div>
                </div>
              )}
              {!formData.isBonPlan && (
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                  Activez cette option pour mettre en avant ce bien avec un prix barré et un badge promotionnel.
                </p>
              )}
            </div>

            {/* Quick Audit Info */}
            <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-8 text-center">
               <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary mx-auto mb-6">
                  <Database className="h-7 w-7" />
               </div>
               <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Données Système</h4>
               <p className="text-[11px] text-zinc-600 leading-relaxed mb-6 font-medium italic">
                 Dernière modification par vous le {new Date().toLocaleDateString('fr-FR')}. 
               </p>
               <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full animate-pulse" />
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyPage;
