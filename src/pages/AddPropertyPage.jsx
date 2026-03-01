import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UploadCloud, X, Plus, Save, Tag, CalendarClock, Banknote, Percent, Ruler, BedDouble, Bath, Sofa, MapPin, Building2, Home, Key, Eye, Coins } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Checkbox } from '../components/ui/checkbox';

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { createProperty, loading } = useProperty();

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
  const [dragActive, setDragActive] = useState(false);

  const categoryOptions = useMemo(
    () => [
      { value: 'Appartement', label: 'Appartement' },
      { value: 'Maison', label: 'Maison' },
      { value: 'Hôtel', label: 'Hôtel' },
      { value: 'Terrain', label: 'Terrain' },
      { value: 'Commercial', label: 'Commercial' },
      { value: 'Autre', label: 'Autre' },
    ],
    [],
  );

  const transactionOptions = useMemo(
    () => [
      { value: 'location', label: 'Location' },
      { value: 'vente', label: 'Vente' },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'active', label: 'Actif (visible)' },
      { value: 'inactive', label: 'Inactif (caché)' },
    ],
    [],
  );

  const deviseOptions = useMemo(
    () => [
      { value: 'XAF', label: 'XAF' },
      { value: 'EUR', label: 'EUR' },
      { value: 'USD', label: 'USD' },
    ],
    [],
  );

  const onPickFiles = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const isImageFile = (f) => {
    if (!f) return false;
    const type = String(f.type || '');
    const name = String(f.name || '');
    if (type.startsWith('image/')) return true;
    return /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(name);
  };

  const makeImageId = () => {
    const c = globalThis?.crypto;
    if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  };

  const addFiles = (files) => {
    const allowed = (files || []).filter(isImageFile);
    const newImages = allowed.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: makeImageId(),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 25));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === imageId);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const reduction = useMemo(() => {
    if (!formData.isBonPlan || !Number(formData.prixOriginal) || !Number(formData.prix)) return null;
    const p = Number(formData.prix);
    const o = Number(formData.prixOriginal);
    if (o <= p) return null;
    return Math.round(((o - p) / o) * 100);
  }, [formData.isBonPlan, formData.prix, formData.prixOriginal]);

  const validateForm = () => {
    const next = {};

    if (!String(formData.titre || '').trim()) next.titre = 'Le titre est requis';
    if (!String(formData.description || '').trim()) {
      next.description = 'La description est requise';
    } else if (String(formData.description).trim().length < 20) {
      next.description = 'La description doit faire au moins 20 caractères';
    }
    if (!Number(formData.prix) || Number(formData.prix) <= 0) next.prix = 'Le prix doit être un nombre positif';
    // Ville et adresse sont optionnels mais images sont obligatoires
    if (!String(formData.ville || '').trim()) next.ville = 'La ville est requise';
    if (!String(formData.adresse || '').trim()) {
      next.adresse = "L'adresse est requise";
    } else if (String(formData.adresse).trim().length < 5) {
      next.adresse = "L'adresse doit faire au moins 5 caractères";
    }
    if (images.length === 0) next.images = 'Au moins une image est requise';

    if (formData.isBonPlan) {
      if (!Number(formData.prixOriginal) || Number(formData.prixOriginal) <= 0) {
        next.prixOriginal = 'Le prix original est requis pour un bon plan';
      } else if (Number(formData.prixOriginal) <= Number(formData.prix || 0)) {
        next.prixOriginal = 'Le prix original doit être supérieur au prix actuel';
      }
      
      if (!String(formData.bonPlanLabel || '').trim()) {
        next.bonPlanLabel = 'Le libellé est requis (ex: -20%)';
      }

      if (!formData.bonPlanExpiresAt) {
        next.bonPlanExpiresAt = 'La date de fin est requise';
      } else if (new Date(formData.bonPlanExpiresAt) <= new Date()) {
        next.bonPlanExpiresAt = 'La date de fin doit être dans le futur';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const normalizePayload = () => {
    const toNumberOrNull = (v) => {
      const trimmed = String(v ?? '').trim();
      if (trimmed === '') return null;
      const num = Number(trimmed);
      return isNaN(num) ? null : num;
    };

    return {
      ...formData,
      prix: toNumberOrNull(formData.prix),
      prixOriginal: toNumberOrNull(formData.prixOriginal),
      superficie: toNumberOrNull(formData.superficie),
      nombre_chambres: toNumberOrNull(formData.nombre_chambres),
      nombre_salles_bain: toNumberOrNull(formData.nombre_salles_bain),
      nombre_salons: toNumberOrNull(formData.nombre_salons),
      bonPlanExpiresAt: formData.bonPlanExpiresAt ? new Date(formData.bonPlanExpiresAt).toISOString() : null,
      images: images.map((img) => img.file),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    const result = await createProperty(normalizePayload());
    if (result.success) {
      navigate('/admin/properties');
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer?.files || []);
    addFiles(files);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-light/30 px-3 py-1 text-xs text-zinc-800 ring-1 ring-gold-primary/25">
            <Building2 className="w-4 h-4" />
            Publication
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-900">Ajouter un bien</h1>
          <p className="mt-1 text-zinc-600">Champs alignés au schéma API (transaction, bon plan, devises, etc.).</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre et Catégorie */}
            <div className="p-6 rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Informations principales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Titre de l'annonce" name="titre" value={formData.titre} onChange={handleChange} error={errors.titre} placeholder="Ex: Appartement moderne au centre-ville" />
                <Select label="Catégorie" name="categorie" value={formData.categorie} onChange={handleChange} options={categoryOptions} error={errors.categorie} />
              </div>
              <div className="mt-4">
                <Textarea label="Description détaillée" name="description" value={formData.description} onChange={handleChange} error={errors.description} rows={5} placeholder="Décrivez le bien, ses atouts, le quartier..." />
              </div>
            </div>

            {/* Localisation */}
            <div className="p-6 rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Localisation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Ville" name="ville" value={formData.ville} onChange={handleChange} error={errors.ville} placeholder="Ex: Brazzaville" />
                <Input label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} error={errors.adresse} placeholder="Ex: 123, avenue de la République" />
              </div>
            </div>

            {/* Prix et Transaction */}
            <div className="p-6 rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Prix et Transaction</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Prix" name="prix" type="number" value={formData.prix} onChange={handleChange} error={errors.prix} icon={Banknote} />
                {formData.isBonPlan && (
                  <Input label="Prix Original (barré)" name="prixOriginal" type="number" value={formData.prixOriginal} onChange={handleChange} error={errors.prixOriginal} icon={Coins} />
                )}
              </div>

              <div className="mt-4 rounded-xl bg-gold-light/30 p-4 ring-1 ring-gold-primary/25">
                <label className="flex items-center gap-3">
                  <Checkbox checked={formData.isBonPlan} onCheckedChange={(checked) => setFormData((p) => ({ ...p, isBonPlan: checked }))} id="isBonPlan" />
                  <div>
                    <div className="font-semibold text-zinc-900">Marquer comme "Bon Plan"</div>
                    <div className="text-xs text-zinc-700">Affiche un badge spécial et un prix barré.</div>
                  </div>
                </label>

                {formData.isBonPlan && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gold-primary/25 pt-4">
                    <Input label="Libellé (ex: Promo Flash)" name="bonPlanLabel" value={formData.bonPlanLabel} onChange={handleChange} error={errors.bonPlanLabel} icon={Tag} />
                    <Input label="Date de fin" name="bonPlanExpiresAt" type="date" value={formData.bonPlanExpiresAt} onChange={handleChange} error={errors.bonPlanExpiresAt} icon={CalendarClock} />
                    {reduction && (
                      <div className="md:col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gold-primary/15 text-gold-dark font-semibold text-sm p-3">
                        <Percent className="w-4 h-4" />
                        <span>Réduction calculée : {reduction}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Type de transaction" name="transactionType" value={formData.transactionType} onChange={handleChange} options={transactionOptions} />
                <Select label="Devise" name="devise" value={formData.devise} onChange={handleChange} options={deviseOptions} />
              </div>
            </div>

            {/* Images */}
            <div className="p-6 rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Images (25 max)</h2>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                className={`relative grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 rounded-2xl border-2 border-dashed p-4 transition-colors ${dragActive ? 'border-gold-primary bg-gold-light/30' : 'border-zinc-300'}`}
              >
                {images.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={img.preview || img.url} alt="Aperçu" className="h-full w-full object-cover" />
                    <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 25 && (
                  <button
                    type="button"
                    onClick={onPickFiles}
                    className="relative aspect-square rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-500 flex flex-col items-center justify-center gap-1 ring-1 ring-zinc-200"
                  >
                    <UploadCloud className="w-6 h-6" />
                    <span className="text-xs text-center">Ajouter</span>
                  </button>
                )}
              </div>
              {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
            </div>

            {/* Caractéristiques */}
            <div className="p-6 rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input label="Superficie (m²)" name="superficie" type="number" value={formData.superficie} onChange={handleChange} error={errors.superficie} icon={Ruler} />
                <Input label="Chambres" name="nombre_chambres" type="number" value={formData.nombre_chambres} onChange={handleChange} error={errors.nombre_chambres} icon={BedDouble} />
                <Input label="Salles de bain" name="nombre_salles_bain" type="number" value={formData.nombre_salles_bain} onChange={handleChange} error={errors.nombre_salles_bain} icon={Bath} />
                <Input label="Salons" name="nombre_salons" type="number" value={formData.nombre_salons} onChange={handleChange} error={errors.nombre_salons} icon={Sofa} />
              </div>
            </div>

            {/* Commodités */}
            <div className="p-6 rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Commodités</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <label className="flex items-center gap-2"><Checkbox name="garage" checked={formData.garage} onCheckedChange={(checked) => handleChange({ target: { name: 'garage', type: 'checkbox', checked } })} /> Garage</label>
                <label className="flex items-center gap-2"><Checkbox name="piscine" checked={formData.piscine} onCheckedChange={(checked) => handleChange({ target: { name: 'piscine', type: 'checkbox', checked } })} /> Piscine</label>
                <label className="flex items-center gap-2"><Checkbox name="jardin" checked={formData.jardin} onCheckedChange={(checked) => handleChange({ target: { name: 'jardin', type: 'checkbox', checked } })} /> Jardin</label>
                <label className="flex items-center gap-2"><Checkbox name="balcon" checked={formData.balcon} onCheckedChange={(checked) => handleChange({ target: { name: 'balcon', type: 'checkbox', checked } })} /> Balcon</label>
                <label className="flex items-center gap-2"><Checkbox name="gardien" checked={formData.gardien} onCheckedChange={(checked) => handleChange({ target: { name: 'gardien', type: 'checkbox', checked } })} /> Gardien</label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/properties')}>Annuler</Button>
              <Button type="submit" loading={loading} className="gap-2">
                <Save className="w-4 h-4" />
                Enregistrer le bien
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;
