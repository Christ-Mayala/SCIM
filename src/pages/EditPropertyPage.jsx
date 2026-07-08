import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProperty } from '../contexts/PropertyContext';
import PropertyForm, { AMENITY_KEYS } from '../components/admin/PropertyForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProperty, updateProperty, fetchPropertyById, loading } = useProperty();
  const [formData, setFormData] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) fetchPropertyById(id);
  }, [id]); // eslint-disable-line

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
      // Surfaces & pièces
      superficie: currentProperty.superficie ?? '',
      nombre_chambres: currentProperty.nombre_chambres ?? '',
      nombre_salles_bain: currentProperty.nombre_salles_bain ?? '',
      nombre_salons: currentProperty.nombre_salons ?? '',
      nb_etages: currentProperty.nb_etages ?? '',
      annee_construction: currentProperty.annee_construction ?? '',
      capacite_personnes: currentProperty.capacite_personnes ?? '',
      nb_wc: currentProperty.nb_wc ?? '',
      // Tous les équipements dynamiques
      ...Object.fromEntries(
        AMENITY_KEYS.map(k => [k, Boolean(currentProperty[k])])
      ),
    });
    setImages(
      (currentProperty.images || []).map((img) => ({
        id: img.public_id || img._id || Math.random().toString(36).slice(2),
        url: img.url,
        existing: true,
      }))
    );
  }, [currentProperty?._id]); // eslint-disable-line

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...(prev || {}), [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!String(formData?.titre || '').trim()) next.titre = 'Le titre est requis';
    if (!Number(formData?.prix) || Number(formData.prix) <= 0) next.prix = 'Prix invalide';
    if (!String(formData?.ville || '').trim()) next.ville = 'Ville requise';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { toast.error('Corrigez les champs obligatoires'); return; }
    setSaving(true);
    try {
      const result = await updateProperty(id, {
        ...formData,
        images: images.filter((i) => !i.existing).map((i) => i.file),
      });
      if (result.success) {
        toast.success('Annonce mise à jour !');
        navigate('/admin/properties');
      } else {
        toast.error(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch { toast.error('Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  if (loading && !currentProperty) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (!formData) return null;

  return (
    <PropertyForm
      mode="edit"
      formData={formData}
      images={images}
      errors={errors}
      onChange={handleChange}
      onImagesChange={setImages}
      onSubmit={handleSubmit}
      loading={saving}
      onCancel={() => navigate('/admin/properties')}
    />
  );
};

export default EditPropertyPage;
