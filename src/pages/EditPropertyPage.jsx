import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadCloud, X, Plus, Save, Tag, CalendarClock, Banknote, Percent, Ruler, BedDouble, Bath, Sofa, MapPin, Building2, Home, Key, Eye, Coins } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Checkbox } from '../components/ui/checkbox';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProperty, updateProperty, fetchPropertyById, loading } = useProperty();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(null);
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
    setImages(
      existing.map((img) => ({
        id: img.public_id || img._id || Math.random().toString(36).slice(2),
        url: img.url,
        existing: true,
      })),
    );
  }, [currentProperty?._id]);

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
      existing: false,
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 10));
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

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer?.files || []);
    addFiles(files);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...(prev || {}),
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const reduction = useMemo(() => {
    if (!formData?.isBonPlan || !Number(formData?.prixOriginal) || !Number(formData?.prix)) return null;
    const p = Number(formData.prix);
    const o = Number(formData.prixOriginal);
    if (o <= p) return null;
    return Math.round(((o - p) / o) * 100);
  }, [formData?.isBonPlan, formData?.prix, formData?.prixOriginal]);

  const validateForm = () => {
    const next = {};

    if (!String(formData?.titre || '').trim()) next.titre = 'Le titre est requis';
    if (!Number(formData?.prix) || Number(formData.prix) <= 0) next.prix = 'Le prix doit être un nombre positif';
    if (!String(formData?.ville || '').trim()) next.ville = 'La ville est requise';
    if (!String(formData?.adresse || '').trim()) next.adresse = "L'adresse est requise";

    if (formData?.isBonPlan) {
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
    const toNumberOrEmpty = (v) => (String(v ?? '').trim() === '' ? '' : Number(v));

    return {
      ...formData,
      prix: toNumberOrEmpty(formData.prix),
      prixOriginal: toNumberOrEmpty(formData.prixOriginal),
      superficie: toNumberOrEmpty(formData.superficie),
      nombre_chambres: toNumberOrEmpty(formData.nombre_chambres),
      nombre_salles_bain: toNumberOrEmpty(formData.nombre_salles_bain),
      nombre_salons: toNumberOrEmpty(formData.nombre_salons),
      bonPlanExpiresAt: formData.bonPlanExpiresAt ? new Date(formData.bonPlanExpiresAt).toISOString() : '',
      images: images.filter((i) => !i.existing).map((i) => i.file),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await updateProperty(id, normalizePayload());
    if (result.success) {
      navigate(`/properties/${id}`);
    }
  };

  if (loading && !currentProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentProperty || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-zinc-900">Bien introuvable</div>
          <div className="mt-3">
            <Button onClick={() => navigate('/dashboard')}>Retour</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-light/30 px-3 py-1 text-xs text-zinc-800 ring-1 ring-gold-primary/25">
            <Building2 className="w-4 h-4" />
            Édition
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-900">Modifier un bien</h1>
          <p className="mt-1 text-zinc-600">Si vous ajoutez de nouvelles photos, l’API remplacera les anciennes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Informations générales</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Titre de l'annonce"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  error={errors.titre}
                  leftIcon={<Tag className="w-4 h-4" />}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Description (optionnel)"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <Select
                label="Type de transaction"
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                options={transactionOptions}
                leftIcon={<Key className="w-4 h-4" />}
              />

              <Select
                label="Catégorie"
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                options={categoryOptions}
                leftIcon={<Home className="w-4 h-4" />}
              />

              <Select
                label="Statut de publication"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
                leftIcon={<Eye className="w-4 h-4" />}
              />

              <Input
                label="Prix"
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                error={errors.prix}
                leftIcon={<Banknote className="w-4 h-4" />}
              />

              <Select
                label="Devise"
                name="devise"
                value={formData.devise}
                onChange={handleChange}
                options={deviseOptions}
                leftIcon={<Coins className="w-4 h-4" />}
              />

              {formData.isBonPlan ? (
                <Input
                  label="Prix original (barré)"
                  type="number"
                  name="prixOriginal"
                  value={formData.prixOriginal}
                  onChange={handleChange}
                  error={errors.prixOriginal}
                  leftIcon={<Percent className="w-4 h-4" />}
                />
              ) : (
                <div />
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Localisation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Ville"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                error={errors.ville}
                leftIcon={<MapPin className="w-4 h-4" />}
              />

              <Input
                label="Adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                error={errors.adresse}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Détails</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Input
                label="Superficie (m²)"
                type="number"
                name="superficie"
                value={formData.superficie}
                onChange={handleChange}
                leftIcon={<Ruler className="w-4 h-4" />}
              />

              <Input
                label="Chambres"
                type="number"
                name="nombre_chambres"
                value={formData.nombre_chambres}
                onChange={handleChange}
                leftIcon={<BedDouble className="w-4 h-4" />}
              />

              <Input
                label="Salles de bain"
                type="number"
                name="nombre_salles_bain"
                value={formData.nombre_salles_bain}
                onChange={handleChange}
                leftIcon={<Bath className="w-4 h-4" />}
              />

              <Input
                label="Salons"
                type="number"
                name="nombre_salons"
                value={formData.nombre_salons}
                onChange={handleChange}
                leftIcon={<Sofa className="w-4 h-4" />}
              />
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium text-zinc-900 mb-3">Équipements</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'garage', label: 'Garage' },
                  { key: 'piscine', label: 'Piscine' },
                  { key: 'jardin', label: 'Jardin' },
                  { key: 'balcon', label: 'Balcon' },
                  { key: 'gardien', label: 'Gardien' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={key}
                      checked={Boolean(formData[key])}
                      onCheckedChange={(checked) =>
                        handleChange({ target: { name: key, type: 'checkbox', checked } })
                      }
                      className="border-gray-300 data-[state=checked]:bg-gold-primary data-[state=checked]:text-white"
                    />
                    <label htmlFor={key} className="text-sm text-zinc-700 cursor-pointer select-none">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Bon plan</h2>

            <div className="rounded-xl bg-gold-light/30 p-4 ring-1 ring-gold-primary/25">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <Checkbox
                  id="isBonPlan"
                  checked={Boolean(formData.isBonPlan)}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { name: 'isBonPlan', type: 'checkbox', checked } })
                  }
                  className="border-gold-primary data-[state=checked]:bg-gold-primary data-[state=checked]:text-white"
                />
                <div className="flex-1">
                  <div className="font-semibold text-zinc-900 inline-flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gold-primary" />
                    Marquer comme "Bon Plan"
                  </div>
                  <div className="text-xs text-zinc-700">Affiche un badge spécial et un prix barré.</div>
                </div>
              </label>

              {formData.isBonPlan ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gold-primary/25 pt-4">
                  <Input
                    label="Libellé (ex: Promo Flash)"
                    name="bonPlanLabel"
                    value={formData.bonPlanLabel}
                    onChange={handleChange}
                    error={errors.bonPlanLabel}
                    leftIcon={<Tag className="w-4 h-4" />}
                  />

                  <Input
                    label="Date de fin"
                    type="datetime-local"
                    name="bonPlanExpiresAt"
                    value={formData.bonPlanExpiresAt}
                    onChange={handleChange}
                    error={errors.bonPlanExpiresAt}
                    leftIcon={<CalendarClock className="w-4 h-4" />}
                  />
                  {reduction && (
                    <div className="md:col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gold-primary/15 text-gold-dark font-semibold text-sm p-3">
                      <Percent className="w-4 h-4" />
                      <span>Réduction calculée : {reduction}%</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Photos (max 10)</h2>

            <div
              role="button"
              tabIndex={0}
              onClick={onPickFiles}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPickFiles();
                }
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDrop={onDrop}
              className={`rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
                dragActive ? 'border-gold-primary bg-gold-light/20' : 'border-zinc-300'
              }`}
            >
              <UploadCloud className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <div className="text-sm text-zinc-700">Glissez-déposez des images ici</div>
              <div className="text-xs text-zinc-500 mt-1">ou cliquez sur le bouton ci-dessous</div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="mt-4">
                <Button type="button" variant="outline" onClick={onPickFiles} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Sélectionner des images
                </Button>
              </div>
            </div>

            {images.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img src={image.preview || image.url} alt="Aperçu" className="w-full h-32 object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Retirer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {image.existing ? (
                      <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-1 rounded-full">Existante</div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={loading} className="gap-2">
              <Save className="w-4 h-4" />
              Enregistrer
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(`/properties/${id}`)}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage;
