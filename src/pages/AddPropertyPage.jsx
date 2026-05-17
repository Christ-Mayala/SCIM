import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  UploadCloud, X, Plus, Save, Tag, CalendarClock, Banknote, Percent, 
  Ruler, BedDouble, Bath, Sofa, MapPin, Building2, Home, Key, Eye, 
  Coins, ChevronLeft, Image as ImageIcon, Layout, Database, CheckCircle2
} from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { cn } from '../lib/utils';

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { createProperty, loading: creating } = useProperty();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    prixOriginal: '',
    devise: 'XAF',
    transactionType: 'location',
    categorie: 'Autre',
    ville: '',
    adresse: '',
    status: 'active',
    isBonPlan: false,
    bonPlanLabel: '',
    bonPlanExpiresAt: '',
    superficie: '',
    nombre_chambres: '',
    nombre_salles_bain: '',
    nombre_salons: '',
    garage: false,
    piscine: false,
    jardin: false,
    balcon: false,
    gardien: false,
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const next = {};
    if (!String(formData.titre || '').trim()) next.titre = 'Le titre est requis';
    if (!String(formData.description || '').trim() || formData.description.length < 20) next.description = 'La description doit faire au moins 20 caractères';
    if (!Number(formData.prix) || Number(formData.prix) <= 0) next.prix = 'Prix invalide';
    if (!String(formData.ville || '').trim()) next.ville = 'Ville requise';
    if (images.length === 0) next.images = 'Au moins une image est requise';
    
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez remplir correctement tous les champs obligatoires');
      return;
    }

    try {
      const payload = {
        ...formData,
        images: images.map(img => img.file)
      };
      const result = await createProperty(payload);
      if (result.success) {
        toast.success('Annonce créée avec succès');
        navigate('/admin/properties');
      } else if (result.error && typeof result.error === 'object') {
        // Gérer les erreurs de validation renvoyées par l'API
        const apiErrors = {};
        if (Array.isArray(result.error)) {
          result.error.forEach(err => {
            apiErrors[err.field] = err.message;
          });
        }
        setErrors(apiErrors);
        toast.error('Veuillez corriger les erreurs de validation');
      }
    } catch (err) {
      toast.error('Erreur lors de la création');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-4 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Administration <span className="opacity-30">/</span> <span className="text-zinc-300">Nouveau</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic uppercase">
              Ajouter un Bien<span className="text-gold-primary">.</span>
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
              loading={creating}
              className="h-12 px-8 rounded-2xl bg-gold-primary text-black font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gold-primary/20 transition-all hover:-translate-y-1"
            >
              <Save className="h-4 w-4 mr-2" /> Publier l'annonce
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
                    className={cn(
                      "w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-zinc-300 outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all resize-none",
                      errors.description && "border-red-500/50 ring-1 ring-red-500/20"
                    )}
                  />
                  {errors.description && <p className="mt-2 text-[9px] font-bold text-red-500 uppercase tracking-widest">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Ville</label>
                    <input
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      placeholder="Ex: Pointe-Noire"
                      className={cn(
                        "w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all",
                        errors.ville && "border-red-500/50 ring-1 ring-red-500/20"
                      )}
                    />
                    {errors.ville && <p className="mt-2 text-[9px] font-bold text-red-500 uppercase tracking-widest">{errors.ville}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Adresse Complète (Optionnel)</label>
                    <input
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Ex: 12 Rue des Eucalyptus, Mpita"
                      className={cn(
                        "w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all",
                        errors.adresse && "border-red-500/50 ring-1 ring-red-500/20"
                      )}
                    />
                    {errors.adresse && <p className="mt-2 text-[9px] font-bold text-red-500 uppercase tracking-widest">{errors.adresse}</p>}
                  </div>
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
                      className={cn(
                        "w-full bg-zinc-950/50 border border-white/5 rounded-2xl pl-6 pr-16 py-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all",
                        errors.prix && "border-red-500/50 ring-1 ring-red-500/20"
                      )}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gold-primary">{formData.devise}</div>
                  </div>
                  {errors.prix && <p className="mt-2 text-[9px] font-bold text-red-500 uppercase tracking-widest">{errors.prix}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Statut initial</label>
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
                 {images.map((img) => (
                   <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 group">
                      <img src={img.preview} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                           type="button"
                           onClick={() => {
                             URL.revokeObjectURL(img.preview);
                             setImages(prev => prev.filter(i => i.id !== img.id));
                           }}
                           className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all scale-75 group-hover:scale-100"
                         >
                           <X className="h-4 w-4" />
                         </button>
                      </div>
                   </div>
                 ))}
                 {images.length === 0 && (
                   <div className="col-span-2 py-10 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-zinc-600 cursor-pointer hover:bg-white/[0.02] transition-all" onClick={() => fileInputRef.current?.click()}>
                      <UploadCloud className="h-10 w-10 mb-2 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Ajouter des photos</p>
                   </div>
                 )}
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 multiple 
                 accept="image/*"
                 className="hidden" 
                 onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const newImgs = files.map(f => ({
                      id: Math.random().toString(36).slice(2),
                      file: f,
                      preview: URL.createObjectURL(f)
                    }));
                    setImages(prev => [...prev, ...newImgs]);
                 }}
               />
               {errors.images && <p className="mt-4 text-[9px] font-bold text-red-500 uppercase tracking-widest text-center">{errors.images}</p>}
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

            {/* Quick System Info */}
            <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-8 text-center">
               <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-primary mx-auto mb-6">
                  <Database className="h-7 w-7" />
               </div>
               <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Prêt pour publication</h4>
               <p className="text-[11px] text-zinc-600 leading-relaxed mb-6 font-medium italic">
                 Une fois publié, ce bien sera immédiatement visible dans le catalogue public de SCIM.
               </p>
               <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-primary w-1/2 animate-pulse" />
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyPage;
