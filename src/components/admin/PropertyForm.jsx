/**
 * PropertyForm — partagé entre AddPropertyPage et EditPropertyPage
 */
import React, { useRef } from 'react';
import {
  UploadCloud, X, Plus, Save, Tag, Banknote, Percent,
  Ruler, BedDouble, Bath, Sofa, Image as ImageIcon, Layout,
  ChevronLeft, Globe, Wifi, Car, Waves, Trees, Shield,
  Zap, Wind, Flame, Lock, Tv, Dumbbell, Building2,
  Utensils, AlignJustify, AlertTriangle, Sun, ParkingCircle, Warehouse,
  Dog, Accessibility, GitFork,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const F = 'w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-medium text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-gold-primary/30 focus:border-gold-primary/20 transition-all';
const L = 'block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2';
const E = 'mt-1.5 text-[9px] font-bold text-red-400 uppercase tracking-widest';

const Card = ({ icon: Icon, color = 'text-gold-primary', title, children }) => (
  <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 lg:p-7 space-y-5">
    <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
      <div className="h-9 w-9 rounded-xl bg-zinc-800/80 flex items-center justify-center shrink-0">
        <Icon className={cn('h-4 w-4', color)} />
      </div>
      <h2 className="text-sm font-black text-white uppercase tracking-widest">{title}</h2>
    </div>
    {children}
  </div>
);

const categoryOptions = [
  { value: 'Appartement', label: 'Appartement' },
  { value: 'Maison',      label: 'Maison' },
  { value: 'Hôtel',       label: 'Hôtel' },
  { value: 'Terrain',     label: 'Terrain' },
  { value: 'Commercial',  label: 'Commercial' },
  { value: 'Autre',       label: 'Autre' },
];

const transactionOptions = [
  { value: 'location', label: 'Location' },
  { value: 'vente',    label: 'Vente' },
];

const statusOptions = [
  { value: 'active',   label: 'En ligne (Visible)' },
  { value: 'inactive', label: 'Hors ligne (Masqué)' },
];

const AMENITY_GROUPS = [
  {
    label: 'Extérieur & Sécurité',
    items: [
      { key: 'garage',        label: 'Garage',           icon: Car },
      { key: 'parking',       label: 'Parking',          icon: ParkingCircle },
      { key: 'piscine',       label: 'Piscine',          icon: Waves },
      { key: 'jardin',        label: 'Jardin',           icon: Trees },
      { key: 'balcon',        label: 'Balcon / Terrasse', icon: Sun },
      { key: 'cloture',       label: 'Clôture',          icon: GitFork },
      { key: 'gardien',       label: 'Gardien',          icon: Shield },
      { key: 'alarme',        label: 'Alarme',           icon: AlertTriangle },
      { key: 'interphone',    label: 'Interphone',       icon: Lock },
    ],
  },
  {
    label: 'Intérieur & Confort',
    items: [
      { key: 'wifi',           label: 'Wi-Fi / Internet',  icon: Wifi },
      { key: 'climatisation',  label: 'Climatisation',     icon: Wind },
      { key: 'chauffage',      label: 'Chauffage',         icon: Flame },
      { key: 'cuisine_equipee',label: 'Cuisine équipée',   icon: Utensils },
      { key: 'salle_sport',    label: 'Salle de sport',    icon: Dumbbell },
      { key: 'cave',           label: 'Cave / Remise',     icon: Warehouse },
      { key: 'cheminee',       label: 'Cheminée',          icon: AlignJustify },
      { key: 'animaux',        label: 'Animaux admis',     icon: Dog },
      { key: 'pmr',            label: 'Accès PMR',         icon: Accessibility },
    ],
  },
  {
    label: 'Énergie & Services',
    items: [
      { key: 'groupe_electrogene', label: 'Groupe électrogène', icon: Zap },
      { key: 'panneau_solaire',    label: 'Panneaux solaires',  icon: Sun },
      { key: 'eau_courante',       label: 'Eau courante 24/7',  icon: Wind },
      { key: 'ascenseur',          label: 'Ascenseur',          icon: Building2 },
      { key: 'tv_cable',           label: 'TV câblée / Satellite', icon: Tv },
    ],
  },
];

// All boolean keys that need to be in formData initial state
export const AMENITY_KEYS = AMENITY_GROUPS.flatMap(g => g.items.map(i => i.key));

const AmenityChip = ({ item, checked, onChange }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onChange({ target: { name: item.key, type: 'checkbox', checked: !checked } })}
    className={cn(
      'flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all select-none text-left',
      checked
        ? 'border-gold-primary/40 bg-gold-primary/[0.07] text-white'
        : 'border-white/[0.06] bg-zinc-900/30 text-zinc-500 hover:border-white/10 hover:text-zinc-300',
    )}
  >
    <div className={cn(
      'h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-all',
      checked ? 'bg-gold-primary text-black' : 'bg-zinc-800 text-zinc-500',
    )}>
      <item.icon className="h-3 w-3" />
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{item.label}</span>
  </button>
);

const PropertyForm = ({
  formData, images, errors = {}, onChange, onImagesChange,
  onSubmit, loading = false, mode = 'add', onCancel,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      preview: URL.createObjectURL(f),
      existing: false,
    }));
    onImagesChange(prev => [...prev, ...newImgs]);
    e.target.value = '';
  };

  const removeImage = (id) => {
    onImagesChange(prev => {
      const img = prev.find(i => i.id === id);
      if (img?.preview && !img.existing) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  return (
    <div className="bg-[#0d0d0d] text-white w-full pb-20">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-lg border-b border-white/5 px-6 lg:px-10 py-3.5">
        <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={onCancel}
              className="h-9 w-9 rounded-xl bg-zinc-900/60 border border-white/5 text-zinc-500 hover:text-white flex items-center justify-center transition-all shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-0.5">
                Admin / {mode === 'edit' ? 'Édition' : 'Nouvelle annonce'}
              </p>
              <h1 className="text-base font-black text-white uppercase italic truncate">
                {mode === 'edit' ? "Modifier l'annonce" : 'Ajouter un bien'}
                <span className="text-gold-primary">.</span>
              </h1>
            </div>
          </div>
          <Button onClick={onSubmit} loading={loading}
            className="h-10 px-6 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/20 flex items-center gap-2 shrink-0"
          >
            <Save className="h-3.5 w-3.5" />
            {mode === 'edit' ? 'Enregistrer' : 'Publier'}
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-7">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

          {/* ─── Main column ─── */}
          <div className="space-y-6 min-w-0">

            {/* 1. Infos générales */}
            <Card icon={Tag} title="Informations Générales">
              <div>
                <label className={L}>Titre de l'annonce *</label>
                <input name="titre" value={formData.titre} onChange={onChange}
                  placeholder="Ex: Villa moderne avec piscine — Pointe-Noire"
                  className={cn(F, errors.titre && 'border-red-500/40')} />
                {errors.titre && <p className={E}>{errors.titre}</p>}
              </div>
              <div>
                <label className={L}>Description *</label>
                <textarea name="description" value={formData.description} onChange={onChange} rows={5}
                  placeholder="Décrivez les atouts du bien, son environnement, les accès..."
                  className={cn(F, 'resize-none', errors.description && 'border-red-500/40')} />
                {errors.description && <p className={E}>{errors.description}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={L}>Ville *</label>
                  <input name="ville" value={formData.ville} onChange={onChange}
                    placeholder="Ex: Brazzaville"
                    className={cn(F, errors.ville && 'border-red-500/40')} />
                  {errors.ville && <p className={E}>{errors.ville}</p>}
                </div>
                <div>
                  <label className={L}>Quartier / Adresse</label>
                  <input name="adresse" value={formData.adresse} onChange={onChange}
                    placeholder="Ex: Quartier Bacongo, Av. de la Paix"
                    className={F} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={L}>Type de transaction</label>
                  <select name="transactionType" value={formData.transactionType} onChange={onChange} className={cn(F, 'appearance-none')}>
                    {transactionOptions.map(o => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={L}>Catégorie</label>
                  <select name="categorie" value={formData.categorie} onChange={onChange} className={cn(F, 'appearance-none')}>
                    {categoryOptions.map(o => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            {/* 2. Prix & Visibilité */}
            <Card icon={Banknote} title="Prix & Visibilité">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={L}>Prix du bien *</label>
                  <div className="relative">
                    <input type="number" name="prix" value={formData.prix} onChange={onChange} placeholder="0"
                      className={cn(F, 'pr-14', errors.prix && 'border-red-500/40')} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gold-primary pointer-events-none">
                      {formData.devise || 'XAF'}
                    </span>
                  </div>
                  {errors.prix && <p className={E}>{errors.prix}</p>}
                </div>
                <div>
                  <label className={L}>Statut</label>
                  <select name="status" value={formData.status} onChange={onChange} className={cn(F, 'appearance-none')}>
                    {statusOptions.map(o => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}
                  </select>
                </div>
              </div>
              {/* Bon Plan */}
              <div className={cn('rounded-2xl border p-4 transition-all', formData.isBonPlan ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-white/5 bg-zinc-950/30')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-gold-primary" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Mode Bon Plan</span>
                  </div>
                  <button type="button"
                    onClick={() => onChange({ target: { name: 'isBonPlan', type: 'checkbox', checked: !formData.isBonPlan } })}
                    className={cn('w-11 h-6 rounded-full transition-all relative', formData.isBonPlan ? 'bg-gold-primary' : 'bg-zinc-700')}
                  >
                    <div className={cn('h-4 w-4 rounded-full bg-white absolute top-1 transition-all', formData.isBonPlan ? 'right-1' : 'left-1')} />
                  </button>
                </div>
                {formData.isBonPlan ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className={L}>Prix original</label>
                      <input type="number" name="prixOriginal" value={formData.prixOriginal} onChange={onChange} className={F} />
                    </div>
                    <div>
                      <label className={L}>Badge promo</label>
                      <input name="bonPlanLabel" value={formData.bonPlanLabel} onChange={onChange} placeholder="OFFRE LIMITÉE" className={cn(F, 'text-gold-primary')} />
                    </div>
                    <div>
                      <label className={L}>Expire le</label>
                      <input type="datetime-local" name="bonPlanExpiresAt" value={formData.bonPlanExpiresAt} onChange={onChange} className={F} />
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-600 mt-2">Activez pour afficher un prix barré et un badge promotionnel.</p>
                )}
              </div>
            </Card>

            {/* 3. Surfaces & Pièces */}
            <Card icon={Layout} title="Surfaces & Pièces">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'superficie',         label: 'Surface m²',   icon: Ruler },
                  { name: 'nombre_chambres',    label: 'Chambres',     icon: BedDouble },
                  { name: 'nombre_salles_bain', label: 'Salles de bain', icon: Bath },
                  { name: 'nombre_salons',      label: 'Salons',       icon: Sofa },
                  { name: 'nb_etages',          label: 'Étages',       icon: Building2 },
                  { name: 'annee_construction', label: 'Année constr.', icon: Tag },
                  { name: 'capacite_personnes', label: 'Personnes max', icon: Shield },
                  { name: 'nb_wc',              label: 'WC séparés',   icon: Bath },
                ].map(f => (
                  <div key={f.name}>
                    <label className={L}>
                      <span className="flex items-center gap-1">
                        <f.icon className="h-3 w-3 shrink-0" /> {f.label}
                      </span>
                    </label>
                    <input type="number" name={f.name} value={formData[f.name] ?? ''} onChange={onChange} min="0"
                      className={cn(F, 'text-center')} />
                  </div>
                ))}
              </div>
            </Card>

            {/* 4. Équipements complets */}
            <Card icon={Zap} color="text-emerald-400" title="Équipements & Services">
              {AMENITY_GROUPS.map(group => (
                <div key={group.label}>
                  <p className={cn(L, 'mb-3')}>{group.label}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {group.items.map(item => (
                      <AmenityChip
                        key={item.key}
                        item={item}
                        checked={Boolean(formData[item.key])}
                        onChange={onChange}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="space-y-5">

            {/* Photos */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-gold-primary" />
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Photos</h4>
                  <span className="text-[9px] font-black text-zinc-600">({images.length})</span>
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="h-7 w-7 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-primary hover:bg-gold-primary hover:text-black flex items-center justify-center transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div key={img.id} className={cn(
                      'relative rounded-xl overflow-hidden border border-white/5 group',
                      idx === 0 ? 'col-span-3 aspect-video' : 'aspect-square',
                    )}>
                      <img src={img.url || img.preview} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-gold-primary rounded text-[7px] font-black text-black uppercase">
                          Principale
                        </div>
                      )}
                      <button type="button" onClick={() => removeImage(img.id)}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg bg-black/60 hover:bg-red-500 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full py-10 border-2 border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center gap-2 text-zinc-600 hover:border-gold-primary/20 hover:text-zinc-400 transition-all"
                >
                  <UploadCloud className="h-8 w-8 opacity-40" />
                  <p className="text-[9px] font-black uppercase tracking-widest">Cliquez ou glissez</p>
                </button>
              )}
              <input type="file" ref={fileInputRef} multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              {errors.images && <p className={cn(E, 'text-center mt-2')}>{errors.images}</p>}
            </div>

            {/* Récap + bouton submit */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-4 w-4 text-gold-primary" />
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Récapitulatif</h4>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Titre',       value: formData.titre || '—',  truncate: true },
                  { label: 'Ville',       value: formData.ville || '—' },
                  { label: 'Catégorie',   value: formData.categorie },
                  { label: 'Transaction', value: formData.transactionType === 'vente' ? 'Vente' : 'Location' },
                  {
                    label: 'Statut',
                    value: formData.status === 'active' ? '● En ligne' : '○ Hors ligne',
                    color: formData.status === 'active' ? 'text-emerald-400' : 'text-zinc-500',
                  },
                  { label: 'Photos', value: `${images.length} photo${images.length !== 1 ? 's' : ''}` },
                ].map(({ label, value, truncate, color }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0">{label}</span>
                    <span className={cn('text-[10px] font-bold text-right', truncate && 'truncate max-w-[130px]', color || 'text-zinc-300')}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <Button onClick={onSubmit} loading={loading}
                  className="w-full h-11 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/20 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {mode === 'edit' ? 'Enregistrer' : "Publier l'annonce"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
