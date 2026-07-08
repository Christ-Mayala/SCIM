import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud, X, Phone, Send, Building2, Tag, Banknote, Ruler,
  BedDouble, Bath, Sofa, Image as ImageIcon, Layout, Globe,
  Wifi, Car, Waves, Trees, Shield, Zap, Wind, Flame, Lock, Tv,
  Dumbbell, Building, Utensils, Sun, ParkingCircle, Warehouse,
  Dog, Accessibility, GitFork, AlertTriangle, MapPin, User, Mail,
  CheckCircle2, Sparkles, ChevronRight, Home
} from 'lucide-react';
import SEO from '../components/layout/SEO';
import { seoConfig } from '../utils/seoData';
import { Button } from '../components/ui/Button';
import { propertyAPI } from '../lib/api';
import { validateEmail } from '../lib/utils';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

/* ─── style tokens ─── */
const F = 'w-full bg-zinc-900/60 border border-white/8 rounded-2xl px-4 py-3.5 text-sm font-medium text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-gold-primary/40 focus:border-gold-primary/20 transition-all';
const L = 'block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2';
const E = 'mt-1.5 text-[9px] font-bold text-red-400 uppercase tracking-widest';

/* ─── section card ─── */
const Section = ({ step, icon: Icon, title, children }) => (
  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
    <div className="flex items-center gap-4 px-6 py-5 border-b border-white/[0.06] bg-zinc-900/30">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-primary font-black text-sm shrink-0">
        {step}
      </div>
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-gold-primary" />
        <h2 className="text-sm font-black text-white uppercase tracking-widest">{title}</h2>
      </div>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

/* ─── amenity chip ─── */
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
    <div className={cn('h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-all',
      checked ? 'bg-gold-primary text-black' : 'bg-zinc-800 text-zinc-500')}>
      <item.icon className="h-3 w-3" />
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{item.label}</span>
  </button>
);

const AMENITY_GROUPS = [
  { label: 'Extérieur & Sécurité', items: [
    { key: 'garage', label: 'Garage', icon: Car },
    { key: 'parking', label: 'Parking', icon: ParkingCircle },
    { key: 'piscine', label: 'Piscine', icon: Waves },
    { key: 'jardin', label: 'Jardin', icon: Trees },
    { key: 'balcon', label: 'Balcon / Terrasse', icon: Sun },
    { key: 'cloture', label: 'Clôture', icon: GitFork },
    { key: 'gardien', label: 'Gardien', icon: Shield },
    { key: 'alarme', label: 'Alarme', icon: AlertTriangle },
    { key: 'interphone', label: 'Interphone', icon: Lock },
  ]},
  { label: 'Intérieur & Confort', items: [
    { key: 'wifi', label: 'Wi-Fi / Internet', icon: Wifi },
    { key: 'climatisation', label: 'Climatisation', icon: Wind },
    { key: 'chauffage', label: 'Chauffage', icon: Flame },
    { key: 'cuisine_equipee', label: 'Cuisine équipée', icon: Utensils },
    { key: 'salle_sport', label: 'Salle de sport', icon: Dumbbell },
    { key: 'cave', label: 'Cave / Remise', icon: Warehouse },
    { key: 'cheminee', label: 'Cheminée', icon: Utensils },
    { key: 'animaux', label: 'Animaux admis', icon: Dog },
    { key: 'pmr', label: 'Accès PMR', icon: Accessibility },
  ]},
  { label: 'Énergie & Services', items: [
    { key: 'groupe_electrogene', label: 'Groupe électrogène', icon: Zap },
    { key: 'panneau_solaire', label: 'Panneaux solaires', icon: Sun },
    { key: 'eau_courante', label: 'Eau courante 24/7', icon: Wind },
    { key: 'ascenseur', label: 'Ascenseur', icon: Building },
    { key: 'tv_cable', label: 'TV câblée / Satellite', icon: Tv },
  ]},
];

const ALL_AMENITY_KEYS = AMENITY_GROUPS.flatMap(g => g.items.map(i => i.key));

const normalizePhone = (v) => {
  const raw = String(v || '').trim();
  if (!raw) return '';
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return raw;
  if (raw.startsWith('+')) return `+${digits}`;
  if (digits.startsWith('242')) return `+${digits}`;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  const local = digits.replace(/^0+/, '');
  return local ? `+242${local}` : raw;
};

const INITIAL = {
  nomComplet: '', email: '', telephone: '',
  titre: '', description: '', transactionType: '', categorie: '',
  prix: '', devise: 'XAF', ville: '', adresse: '',
  superficie: '', nombre_chambres: '', nombre_salles_bain: '', nombre_salons: '',
  nb_etages: '', annee_construction: '', capacite_personnes: '', nb_wc: '',
  ...Object.fromEntries(ALL_AMENITY_KEYS.map(k => [k, false])),
};

const SubmitPropertyPage = () => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(INITIAL);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => () => images.forEach(i => { if (i.preview) URL.revokeObjectURL(i.preview); }), [images]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const newImgs = files.map(f => ({ id: Math.random().toString(36).slice(2), file: f, preview: URL.createObjectURL(f) }));
    setImages(p => [...p, ...newImgs]);
    e.target.value = '';
    if (errors.images) setErrors(p => ({ ...p, images: '' }));
  };

  const removeImage = (id) => {
    setImages(p => {
      const img = p.find(i => i.id === id);
      if (img?.preview) URL.revokeObjectURL(img.preview);
      return p.filter(i => i.id !== id);
    });
  };

  const validate = () => {
    const n = {};
    if (!form.nomComplet.trim()) n.nomComplet = 'Nom requis';
    if (!form.email.trim()) n.email = 'Email requis';
    else if (!validateEmail(form.email)) n.email = 'Email invalide';
    if (!form.telephone.trim()) n.telephone = 'Téléphone requis';
    if (!form.titre.trim()) n.titre = 'Titre requis';
    if (!form.description.trim() || form.description.length < 20) n.description = 'Description trop courte (20 min)';
    if (!form.transactionType) n.transactionType = 'Transaction requise';
    if (!form.categorie) n.categorie = 'Catégorie requise';
    if (!form.prix || Number(form.prix) <= 0) n.prix = 'Prix invalide';
    if (!form.ville.trim()) n.ville = 'Ville requise';
    if (!form.adresse.trim()) n.adresse = 'Adresse requise';
    if (!images.length) n.images = 'Au moins une image requise';
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError(''); setSuccess(false);
    if (!validate()) { toast.error('Veuillez corriger les champs requis'); return; }
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === 'boolean') fd.append(k, String(v));
        else if (v !== '' && v !== null && v !== undefined) fd.append(k, String(v));
      });
      images.forEach(i => fd.append('images', i.file));
      await propertyAPI.submitForPublication(fd);
      setSuccess(true);
      toast.success('Votre bien a été soumis avec succès !');
      setForm(INITIAL);
      setImages([]);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la soumission';
      setApiError(msg); toast.error(msg);
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-4">Soumission Envoyée<span className="text-gold-primary">.</span></h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">Votre dossier est en attente de validation par l'équipe SCIM. Nous reviendrons vers vous très prochainement.</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => setSuccess(false)} className="h-12 px-8 bg-gold-primary hover:bg-amber-300 text-black font-black uppercase tracking-widest text-xs rounded-2xl">
            Soumettre un autre bien
          </Button>
          <Link to="/properties">
            <Button variant="outline" className="h-12 px-8 border-white/10 bg-zinc-900 text-zinc-300 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs">
              Voir les biens
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEO title={seoConfig.contact?.title || 'Soumettre un bien - SCIM'}
        description="Soumettez votre bien à SCIM. Vérification et publication par nos experts." />

      <div className="min-h-screen bg-zinc-950 text-white">
        {/* ── Hero ── */}
        <div className="relative pt-28 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img src="/images/intro-bg.jpg" alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-zinc-950" />
          </div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary mb-6">
              <Sparkles className="w-3 h-3" /> Service Premium SCIM
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-none mb-5">
              Mettez votre bien en<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-300">Lumière</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Confiez votre propriété à des experts. Chaque annonce est vérifiée pour garantir une qualité exceptionnelle.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          {/* guide steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { n: '01', t: 'Préparez', d: 'Infos & documents' },
              { n: '02', t: 'Remplissez', d: 'Formulaire complet' },
              { n: '03', t: 'Validation', d: 'Équipe SCIM' },
              { n: '04', t: 'Publication', d: 'Mise en ligne' },
            ].map((s) => (
              <div key={s.n} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4">
                <div className="text-[10px] font-black text-gold-primary uppercase tracking-widest mb-1">{s.n}</div>
                <div className="text-sm font-black text-white">{s.t}</div>
                <div className="text-xs text-zinc-500">{s.d}</div>
              </div>
            ))}
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400">{apiError}</div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* ── 1. Coordonnées ── */}
            <Section step="1" icon={User} title="Vos Coordonnées">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name:'nomComplet', label:'Nom complet *', type:'text', placeholder:'Jean Dupont', icon: User },
                  { name:'email', label:'Email *', type:'email', placeholder:'jean@exemple.com', icon: Mail },
                  { name:'telephone', label:'Téléphone *', type:'tel', placeholder:'+242 06 000 00 00', icon: Phone },
                ].map(f => (
                  <div key={f.name}>
                    <label className={L}><span className="flex items-center gap-1"><f.icon className="h-3 w-3"/>{f.label}</span></label>
                    <input name={f.name} type={f.type} value={form[f.name]} onChange={onChange}
                      onBlur={f.name === 'telephone' ? () => setForm(p => ({...p, telephone: normalizePhone(p.telephone)})) : undefined}
                      placeholder={f.placeholder} className={cn(F, errors[f.name] && 'border-red-500/40')} />
                    {errors[f.name] && <p className={E}>{errors[f.name]}</p>}
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 2. Infos du bien ── */}
            <Section step="2" icon={Tag} title="Informations du Bien">
              <div>
                <label className={L}>Titre de l'annonce *</label>
                <input name="titre" value={form.titre} onChange={onChange}
                  placeholder="Ex: Villa moderne avec piscine — Pointe-Noire"
                  className={cn(F, errors.titre && 'border-red-500/40')} />
                {errors.titre && <p className={E}>{errors.titre}</p>}
              </div>
              <div>
                <label className={L}>Description détaillée *</label>
                <textarea name="description" value={form.description} onChange={onChange} rows={5}
                  placeholder="Décrivez les atouts du bien, son environnement, les accès, l'état général..."
                  className={cn(F, 'resize-none', errors.description && 'border-red-500/40')} />
                {errors.description && <p className={E}>{errors.description}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={L}>Type de transaction *</label>
                  <select name="transactionType" value={form.transactionType} onChange={onChange} className={cn(F, 'appearance-none', errors.transactionType && 'border-red-500/40')}>
                    <option value="" className="bg-zinc-900">Choisir...</option>
                    <option value="location" className="bg-zinc-900">Location</option>
                    <option value="vente" className="bg-zinc-900">Vente</option>
                  </select>
                  {errors.transactionType && <p className={E}>{errors.transactionType}</p>}
                </div>
                <div>
                  <label className={L}>Catégorie *</label>
                  <select name="categorie" value={form.categorie} onChange={onChange} className={cn(F, 'appearance-none', errors.categorie && 'border-red-500/40')}>
                    <option value="" className="bg-zinc-900">Choisir...</option>
                    {['Appartement','Maison','Hôtel','Terrain','Commercial','Autre'].map(c => (
                      <option key={c} value={c} className="bg-zinc-900">{c}</option>
                    ))}
                  </select>
                  {errors.categorie && <p className={E}>{errors.categorie}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={L}>Ville *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    <input name="ville" value={form.ville} onChange={onChange} placeholder="Ex: Brazzaville"
                      className={cn(F, 'pl-10', errors.ville && 'border-red-500/40')} />
                  </div>
                  {errors.ville && <p className={E}>{errors.ville}</p>}
                </div>
                <div>
                  <label className={L}>Adresse / Quartier *</label>
                  <input name="adresse" value={form.adresse} onChange={onChange} placeholder="Ex: Quartier Bacongo, Av. de la Paix"
                    className={cn(F, errors.adresse && 'border-red-500/40')} />
                  {errors.adresse && <p className={E}>{errors.adresse}</p>}
                </div>
              </div>
              <div>
                <label className={L}>Prix *</label>
                <div className="relative">
                  <input type="number" name="prix" value={form.prix} onChange={onChange} placeholder="0"
                    className={cn(F, 'pr-14', errors.prix && 'border-red-500/40')} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gold-primary pointer-events-none">XAF</span>
                </div>
                {errors.prix && <p className={E}>{errors.prix}</p>}
              </div>
            </Section>

            {/* ── 3. Surfaces ── */}
            <Section step="3" icon={Ruler} title="Surfaces & Pièces">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name:'superficie', label:'Surface m²', icon: Ruler },
                  { name:'nombre_chambres', label:'Chambres', icon: BedDouble },
                  { name:'nombre_salles_bain', label:'Salles de bain', icon: Bath },
                  { name:'nombre_salons', label:'Salons', icon: Sofa },
                  { name:'nb_etages', label:'Étages', icon: Building },
                  { name:'annee_construction', label:'Année constr.', icon: Tag },
                  { name:'capacite_personnes', label:'Personnes max', icon: User },
                  { name:'nb_wc', label:'WC séparés', icon: Bath },
                ].map(f => (
                  <div key={f.name}>
                    <label className={L}><span className="flex items-center gap-1"><f.icon className="h-3 w-3"/>{f.label}</span></label>
                    <input type="number" name={f.name} value={form[f.name] ?? ''} onChange={onChange}
                      min="0" className={cn(F, 'text-center')} />
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 4. Équipements ── */}
            <Section step="4" icon={Zap} title="Équipements & Services">
              {AMENITY_GROUPS.map(group => (
                <div key={group.label}>
                  <p className={cn(L, 'mb-3')}>{group.label}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {group.items.map(item => (
                      <AmenityChip key={item.key} item={item} checked={Boolean(form[item.key])} onChange={onChange} />
                    ))}
                  </div>
                </div>
              ))}
            </Section>

            {/* ── 5. Photos ── */}
            <Section step="5" icon={ImageIcon} title="Photos du Bien">
              <p className="text-xs text-zinc-500 -mt-2">Sélectionnez des photos nettes et représentatives (max 10). La première sera la photo principale.</p>
              {images.length === 0 ? (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full py-14 border-2 border-dashed border-white/[0.07] rounded-2xl flex flex-col items-center gap-3 text-zinc-600 hover:border-gold-primary/30 hover:text-zinc-400 transition-all group">
                  <UploadCloud className="h-10 w-10 group-hover:text-gold-primary transition-colors" />
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest">Cliquez ou glissez vos images</p>
                    <p className="text-[10px] mt-1">JPG, PNG, WEBP — max 10 MB par image</p>
                  </div>
                </button>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {images.map((img, idx) => (
                    <div key={img.id} className={cn('relative rounded-xl overflow-hidden border border-white/5 group',
                      idx === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square')}>
                      <img src={img.preview} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-gold-primary rounded text-[7px] font-black text-black uppercase">Principale</div>
                      )}
                      <button type="button" onClick={() => removeImage(img.id)}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg bg-black/60 hover:bg-red-500 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-white/[0.07] hover:border-gold-primary/30 flex flex-col items-center justify-center gap-1 text-zinc-600 hover:text-zinc-400 transition-all">
                      <UploadCloud className="h-5 w-5" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Ajouter</span>
                    </button>
                  )}
                </div>
              )}
              {errors.images && <p className={cn(E, 'text-center')}>{errors.images}</p>}
              <input type="file" ref={fileInputRef} multiple accept="image/*" className="hidden" onChange={handleFiles} />
            </Section>

            {/* ── Submit ── */}
            <div className="sticky bottom-6 pt-4">
              <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-white">{images.length} photo{images.length !== 1 ? 's' : ''} • {Object.values(form).filter(v => v === true).length} équipements</p>
                  <p className="text-xs text-zinc-500">Vérifiez vos informations avant d'envoyer</p>
                </div>
                <Button type="submit" loading={loading}
                  className="h-12 px-10 rounded-2xl bg-gold-primary hover:bg-amber-300 text-black font-black uppercase tracking-widest text-xs shadow-xl shadow-gold-primary/20 flex items-center gap-2 shrink-0">
                  <Send className="h-4 w-4" />
                  {loading ? 'Envoi en cours...' : "Envoyer à l'administration"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SubmitPropertyPage;
