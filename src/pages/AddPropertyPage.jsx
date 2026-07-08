import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProperty } from '../contexts/PropertyContext';
import PropertyForm, { AMENITY_KEYS } from '../components/admin/PropertyForm';

const INITIAL = {
  titre: '', description: '', prix: '', prixOriginal: '', devise: 'XAF',
  transactionType: 'location', categorie: 'Autre', ville: '', adresse: '',
  status: 'active', isBonPlan: false, bonPlanLabel: '', bonPlanExpiresAt: '',
  superficie: '', nombre_chambres: '', nombre_salles_bain: '', nombre_salons: '',
  nb_etages: '', annee_construction: '', capacite_personnes: '', nb_wc: '',
  // Équipements dynamiques
  ...Object.fromEntries(AMENITY_KEYS.map(k => [k, false])),
};

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { createProperty, loading } = useProperty();
  const [formData, setFormData] = useState(INITIAL);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!String(formData.titre || '').trim()) next.titre = 'Le titre est requis';
    if (!String(formData.description || '').trim() || formData.description.length < 20)
      next.description = 'La description doit faire au moins 20 caractères';
    if (!Number(formData.prix) || Number(formData.prix) <= 0) next.prix = 'Prix invalide';
    if (!String(formData.ville || '').trim()) next.ville = 'Ville requise';
    if (images.length === 0) next.images = 'Au moins une image est requise';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { toast.error('Corrigez les champs obligatoires'); return; }
    try {
      const result = await createProperty({ ...formData, images: images.map((i) => i.file) });
      if (result.success) {
        toast.success('Annonce publiée avec succès !');
        navigate('/admin/properties');
      } else {
        toast.error(result.error || 'Erreur lors de la création');
      }
    } catch { toast.error('Erreur lors de la création'); }
  };

  return (
    <PropertyForm
      mode="add"
      formData={formData}
      images={images}
      errors={errors}
      onChange={handleChange}
      onImagesChange={setImages}
      onSubmit={handleSubmit}
      loading={loading}
      onCancel={() => navigate('/admin/properties')}
    />
  );
};

export default AddPropertyPage;
