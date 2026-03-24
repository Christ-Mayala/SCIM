import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, ClipboardList, Home, ImagePlus, Mail, MapPin, Phone, Send, User, Sparkles } from 'lucide-react';
import SEO from '../components/layout/SEO';
import { seoConfig } from '../utils/seoData';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import PageHero from '../components/layout/PageHero';
import { propertyAPI } from '../lib/api';
import { validateEmail } from '../lib/utils';
import toast from 'react-hot-toast';

const categoryOptions = [
  { value: 'Appartement', label: 'Appartement' },
  { value: 'Maison', label: 'Maison' },
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Terrain', label: 'Terrain' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Autre', label: 'Autre' },
];

const transactionOptions = [
  { value: 'vente', label: 'Vente' },
  { value: 'location', label: 'Location' },
];

const submissionGuide = [
  {
    title: '1. Preparez votre dossier',
    description:
      'Rassemblez les informations personnelles du proprietaire et les details complets du bien (localisation, prix, type, caracteristiques).',
  },
  {
    title: '2. Ajoutez les visuels',
    description:
      "Selectionnez des photos nettes et representatives. Les images sont envoyées sur nos serveurs.",
  },
  {
    title: '3. Validation administrative SCIM',
    description:
      "L'administration vérifie la conformite du dossier, peut corriger des champs, puis approuvé ou rejetté la publication.",
  },
  {
    title: '4. Mise en ligne et mise en relation',
    description:
      "Une fois approuve, le bien est publie dans la liste proprietés et SCIM reste l'intermediaire principal avec les clients.",
  },
];

const normalizeCongoPhone = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return raw;
  if (raw.startsWith('+')) return `+${digits}`;
  if (digits.startsWith('242')) return `+${digits}`;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  const local = digits.replace(/^0+/, '');
  if (!local) return raw;
  return `+242${local}`;
};

const SubmitPropertyPage = () => {
  const [form, setForm] = useState({
    nomComplet: '',
    email: '',
    telephone: '',
    titre: '',
    description: '',
    transactionType: '',
    categorie: '',
    prix: '',
    ville: '',
    adresse: '',
    superficie: '',
    nombre_chambres: '',
    nombre_salles_bain: '',
    nombre_salons: '',
    garage: false,
    gardien: false,
    balcon: false,
    piscine: false,
    jardin: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const checkboxes = useMemo(
    () => [
      { key: 'garage', label: 'Garage' },
      { key: 'gardien', label: 'Gardien' },
      { key: 'balcon', label: 'Balcon' },
      { key: 'piscine', label: 'Piscine' },
      { key: 'jardin', label: 'Jardin' },
    ],
    [],
  );

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onPhoneBlur = () => {
    setForm((prev) => ({
      ...prev,
      telephone: normalizeCongoPhone(prev.telephone),
    }));
  };

  const onImagesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    
    imagePreviews.forEach(p => URL.revokeObjectURL(p));
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(previews);

    if (errors.images) setErrors((prev) => ({ ...prev, images: '' }));
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(p => URL.revokeObjectURL(p));
    };
  }, [imagePreviews]);

  const validate = () => {
    const next = {};
    if (!form.nomComplet.trim()) next.nomComplet = 'Nom requis';
    if (!form.email.trim()) next.email = 'Email requis';
    else if (!validateEmail(form.email)) next.email = 'Email invalide';
    if (!form.telephone.trim()) next.telephone = 'Telephone requis';
    if (!form.titre.trim()) next.titre = 'Titre requis';
    if (!form.description.trim() || form.description.trim().length < 20) next.description = 'Description trop courte (20 caracteres min)';
    if (!form.transactionType) next.transactionType = 'Transaction requise';
    if (!form.categorie) next.categorie = 'Categorie requise';
    if (!form.prix || Number(form.prix) <= 0) next.prix = 'Prix invalide';
    if (!form.ville.trim()) next.ville = 'Ville requise';
    if (!form.adresse.trim()) next.adresse = 'Adresse requise';

    if (!imageFiles.length) {
      next.images = 'Au moins une image est requise';
    } else {
      const hasNonImage = imageFiles.some((f) => !(f.type || '').startsWith('image/'));
      if (hasNonImage) next.images = 'Seules les images sont autorisees';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append('nomComplet', form.nomComplet.trim());
      payload.append('email', form.email.trim());
      payload.append('telephone', form.telephone.trim());
      payload.append('titre', form.titre.trim());
      payload.append('description', form.description.trim());
      payload.append('transactionType', form.transactionType);
      payload.append('categorie', form.categorie);
      payload.append('prix', String(Number(form.prix)));
      payload.append('ville', form.ville.trim());
      payload.append('adresse', form.adresse.trim());
      if (form.superficie) payload.append('superficie', String(Number(form.superficie)));
      if (form.nombre_chambres) payload.append('nombre_chambres', String(Number(form.nombre_chambres)));
      if (form.nombre_salles_bain) payload.append('nombre_salles_bain', String(Number(form.nombre_salles_bain)));
      if (form.nombre_salons) payload.append('nombre_salons', String(Number(form.nombre_salons)));
      payload.append('garage', String(Boolean(form.garage)));
      payload.append('gardien', String(Boolean(form.gardien)));
      payload.append('balcon', String(Boolean(form.balcon)));
      payload.append('piscine', String(Boolean(form.piscine)));
      payload.append('jardin', String(Boolean(form.jardin)));
      imageFiles.forEach((file) => payload.append('images', file));

      await propertyAPI.submitForPublication(payload);

      setSuccess(true);
      toast.success('Votre bien a été soumis avec succès !');
      setForm({
        nomComplet: '',
        email: '',
        telephone: '',
        titre: '',
        description: '',
        transactionType: '',
        categorie: '',
        prix: '',
        ville: '',
        adresse: '',
        superficie: '',
        nombre_chambres: '',
        nombre_salles_bain: '',
        nombre_salons: '',
        garage: false,
        gardien: false,
        balcon: false,
        piscine: false,
        jardin: false,
      });
      setImageFiles([]);
      setImagePreviews([]);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur pendant la soumission';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={seoConfig.contact.title || 'Soumettre un bien - SCIM'}
        description="Soumettez votre bien a SCIM. Le dossier est recu et traite par l administration avant publication."
      />
      <div className="min-h-screen bg-zinc-950 transition-colors duration-300">
      <PageHero
        badgeIcon={Sparkles}
        badgeText="Service Premium SCIM"
        title={
          <>
            Mettez votre bien en <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-200">lumière</span>
          </>
        }
        description="Confiez votre propriété à des experts. Toutes les annonces sont vérifiées pour garantir une qualité exceptionnelle."
        actions={
          <>
            <Link to="/contact">
              <Button className="h-12 px-8 bg-gold-primary text-zinc-950 font-bold hover:bg-amber-300 shadow-lg shadow-gold-primary/20">
                <Phone className="mr-2 h-4 w-4" />
                Contacter SCIM
              </Button>
            </Link>
            <Link to="/properties">
              <Button variant="outline" className="h-12 px-8 border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-md">
                <Building2 className="mr-2 h-4 w-4" />
                Voir les biens
              </Button>
            </Link>
          </>
        }
      />

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 -mt-16 relative z-20">
          <section className="mb-6 rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3 text-white">
              <div className="p-2 bg-gold-primary/10 rounded-xl border border-gold-primary/20">
                <ClipboardList className="h-5 w-5 text-gold-primary" />
              </div>
              <h2 className="text-base font-black text-white uppercase tracking-widest italic">Guide de Soumission</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {submissionGuide.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/5 bg-zinc-950/50 p-4 transition-all hover:border-gold-primary/20">
                  <h3 className="text-sm font-black text-white italic">{item.title}</h3>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mb-5 rounded-2xl border border-gold-primary/20 bg-gold-primary/5 p-4 text-sm text-zinc-400">
            Besoin d'assistance ? Vous pouvez aussi passer par la page <Link to="/contact" className="font-black text-gold-primary hover:text-amber-300">Contact</Link>.
          </div>

          {success ? (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <div className="inline-flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-5 w-5" />
                Soumission envoyee.
              </div>
              <p className="mt-1 text-sm">Votre dossier est maintenant en attente de validation par l administration SCIM.</p>
            </div>
          ) : null}

          {apiError ? <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400 backdrop-blur-xl">{apiError}</div> : null}

          <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl md:p-8 mb-12 animate-fade-in-up">
            <section>
              <h2 className="text-sm font-black text-white uppercase tracking-widest italic mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-gold-primary rounded-full"></span>
                Vos Coordonnées
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Input label="Nom complet *" name="nomComplet" value={form.nomComplet} onChange={onChange} error={errors.nomComplet} leftIcon={<User className="h-4 w-4" />} />
                <Input label="Email *" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} leftIcon={<Mail className="h-4 w-4" />} />
                <Input label="Telephone *" name="telephone" value={form.telephone} onChange={onChange} onBlur={onPhoneBlur} error={errors.telephone} leftIcon={<Phone className="h-4 w-4" />} />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-white uppercase tracking-widest italic mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-gold-primary rounded-full"></span>
                Informations du Bien
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="Titre du bien *" name="titre" value={form.titre} onChange={onChange} error={errors.titre} leftIcon={<Home className="h-4 w-4" />} />
                <Select label="Categorie *" name="categorie" value={form.categorie} onChange={onChange} options={categoryOptions} placeholder="Choisir une categorie" error={errors.categorie} />
                <Select label="Transaction *" name="transactionType" value={form.transactionType} onChange={onChange} options={transactionOptions} placeholder="Choisir une transaction" error={errors.transactionType} />
                <Input label="Prix (FCFA) *" name="prix" type="number" value={form.prix} onChange={onChange} error={errors.prix} />
                <Input label="Ville *" name="ville" value={form.ville} onChange={onChange} error={errors.ville} leftIcon={<MapPin className="h-4 w-4" />} />
                <Input label="Adresse *" name="adresse" value={form.adresse} onChange={onChange} error={errors.adresse} leftIcon={<MapPin className="h-4 w-4" />} />
                <Input label="Superficie (m2)" name="superficie" type="number" value={form.superficie} onChange={onChange} />
                <Input label="Chambres" name="nombre_chambres" type="number" value={form.nombre_chambres} onChange={onChange} />
                <Input label="Salles de bain" name="nombre_salles_bain" type="number" value={form.nombre_salles_bain} onChange={onChange} />
                <Input label="Salons" name="nombre_salons" type="number" value={form.nombre_salons} onChange={onChange} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                {checkboxes.map((f) => (
                  <label key={f.key} className="inline-flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm font-medium transition-all hover:border-gold-primary/30 hover:bg-white/5 group">
                    <span className="text-zinc-400 group-hover:text-white transition-colors">{f.label}</span>
                    <input type="checkbox" name={f.key} checked={Boolean(form[f.key])} onChange={onChange} className="h-4 w-4 accent-gold-primary" />
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <Textarea
                  label="Description detaillée *"
                  name="description"
                  rows={6}
                  value={form.description}
                  onChange={onChange}
                  error={errors.description}
                  placeholder="Decrivez le bien en detail: etat, atouts, environnement, disponibilite..."
                />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-white uppercase tracking-widest italic mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-gold-primary rounded-full"></span>
                Visuels du Bien
              </h2>
              <p className="mb-4 text-xs text-zinc-500">Sélectionnez des fichiers image (max 10).</p>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-6 text-sm text-zinc-400 hover:border-gold-primary/50 hover:bg-white/10 transition-all">
                  <ImagePlus className="h-4 w-4" />
                  Choisir des images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImagesSelected}
                    className="hidden"
                  />
                </label>
                {imageFiles.length > 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-4 mt-2">
                    <div className="mb-4 flex items-center justify-between">
                         <div className="font-black text-white uppercase tracking-widest text-[10px]">{imageFiles.length} image(s) sélectionnée(s)</div>
                         <button type="button" onClick={() => { setImageFiles([]); setImagePreviews([]); }} className="text-xs text-rose-500 hover:text-rose-400 font-bold transition-colors">
                            Tout supprimer
                         </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 group bg-zinc-900">
                            <img src={src} alt={`preview-${idx}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              {errors.images ? <div className="mt-2 text-xs text-rose-600">{errors.images}</div> : null}
            </section>

            <div className="pt-5 border-t border-white/10 flex items-center justify-center">
              <Button type="submit" loading={loading} className="h-14 px-12 font-black gap-3 rounded-2xl bg-gold-primary hover:bg-amber-300 text-zinc-950 shadow-xl transition-all transform hover:scale-[1.02] uppercase tracking-widest text-xs">
                <Send className="h-5 w-5" />
                {loading ? 'Soumission en cours...' : 'Envoyer à l\'administration'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SubmitPropertyPage;

