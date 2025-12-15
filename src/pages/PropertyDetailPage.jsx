import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, MapPin, Bed, Bath, Square, Star, Phone, Mail, 
  ArrowLeft, Share2, Calendar, Eye, Car, Waves, TreePine,
  Home, Shield, Award, ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useMessage } from '../contexts/MessageContext';
import { useProperty } from '../contexts/PropertyContext';
import {Button} from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { formatPrice, formatDate, getImageUrl, getPropertyTypeIcon } from '../lib/utils';
import StarRating from '../components/common/StarRating';
import { propertyAPI, reservationAPI } from '../lib/api';
import { cn } from '../lib/utils';
import SEOHead from '../components/seo/SEOHead';
import { seoConfig, generatePropertyStructuredData } from '../utils/seoData';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { contactScim } = useMessage();
  const { 
    currentProperty: property, 
    loading, 
    fetchPropertyById, 
    toggleFavorite, 
    favorites,
    rateProperty 
  } = useProperty();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const [reservationDate, setReservationDate] = useState('');
  const [reservationLoading, setReservationLoading] = useState(false);

  const images = property?.images || [];
  const owner = property?.utilisateur || property?.proprietaire || null;

  const minDateTimeLocal = useMemo(() => {
    const d = new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }, []);

  const reservationValidationMessage = useMemo(() => {
    if (!reservationDate) return null;

    const when = new Date(reservationDate);
    if (Number.isNaN(when.getTime())) return 'Date invalide.';

    if (when.getTime() < Date.now()) return 'Choisissez une date dans le futur.';

    const minutes = when.getHours() * 60 + when.getMinutes();
    const min = 10 * 60;
    const max = 17 * 60;

    if (minutes < min || minutes > max) return 'Réservation possible uniquement entre 10h00 et 17h00.';

    return null;
  }, [reservationDate]);

  const nextImage = () => {
    if (!images.length) return;
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    if (!images.length) return;
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  useEffect(() => {
    if (!showImageModal) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setShowImageModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showImageModal, images.length]);

  useEffect(() => {
    if (id) {
      fetchPropertyById(id);
    }
  }, [id, fetchPropertyById]);

  useEffect(() => {
    if (!property?._id) return;

    try {
      const key = 'visitedProperties';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const without = existing.filter((p) => p._id !== property._id);
      const entry = {
        _id: property._id,
        titre: property.titre,
        ville: property.ville,
        prix: property.prix,
        image: property.images?.[0]?.url || null,
        noteMoyenne: property.noteMoyenne || 0,
      };
      const updated = [entry, ...without].slice(0, 10);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (_) {}

    (async () => {
      try {
        if (isAuthenticated) {
          await propertyAPI.recordVisit(property._id);
        }
      } catch (_) {}
    })();
  }, [property, isAuthenticated]);

  const isFavorite = favorites.includes(id);

  useEffect(() => {
    if (showContactModal) {
      setContactName(user?.nom || '');
      setContactEmail(user?.email || '');
      setContactPhone(user?.telephone || '');
      setContactMessage(`Bonjour, je suis intéressé(e) par la propriété "${property?.titre || ''}" à ${property?.ville || ''}.`);
    }
  }, [showContactModal, user, property]);

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      toggleFavorite(id);
    } else {
      navigate('/login');
    }
  };

  const handleRating = async (rating) => {
    if (isAuthenticated) {
      setUserRating(rating);
      await rateProperty(id, rating);
    } else {
      navigate('/login');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.titre,
          text: property.description,
          url: window.location.href,
        });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    } catch (error) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié dans le presse-papiers');
      } catch (e) {
        console.log('Share fallback error:', e);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété non trouvée</h2>
          <Button onClick={() => navigate('/properties')}>
            Retour aux propriétés
          </Button>
        </div>
      </div>
    );
  }

  // images already defined above
  const features = [];
  
  if (property.nombre_chambres !== undefined && property.nombre_chambres !== null) {
    features.push({ icon: Bed, label: `${property.nombre_chambres} chambre${property.nombre_chambres > 1 ? 's' : ''}` });
  }
  if (property.nombre_salles_bain !== undefined && property.nombre_salles_bain !== null) {
    features.push({ icon: Bath, label: `${property.nombre_salles_bain} salle${property.nombre_salles_bain > 1 ? 's' : ''} de bain` });
  }
  if (property.nombre_salons !== undefined && property.nombre_salons !== null) {
    features.push({ icon: Home, label: `${property.nombre_salons} salon${property.nombre_salons > 1 ? 's' : ''}` });
  }
  if (property.superficie) features.push({ icon: Square, label: `${property.superficie} m²` });
  if (property.garage) features.push({ icon: Car, label: 'Garage' });
  if (property.gardien) features.push({ icon: Shield, label: 'Gardien' });
  if (property.balcon) features.push({ icon: Home, label: 'Balcon' });
  if (property.piscine) features.push({ icon: Waves, label: 'Piscine' });
  if (property.jardin) features.push({ icon: TreePine, label: 'Jardin' });

  const seoData = seoConfig.propertyDetail(property);
  const structuredData = generatePropertyStructuredData(property);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
        structuredData={structuredData}
      />
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Partager</span>
              </button>
              
              <button
                onClick={handleFavoriteClick}
                className={cn(
                  'flex items-center space-x-2 transition-colors',
                  isFavorite ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                )}
              >
                <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
                <span>{isFavorite ? 'Retiré des favoris' : 'Ajouter aux favoris'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {images.length > 0 ? (
                <>
                  <div 
                    className="aspect-[16/10] bg-gray-200 cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  >
                    <img
                      src={getImageUrl(images[selectedImageIndex]?.url)}
                      alt={property.titre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {images.length > 1 && (
                    <div className="p-4">
                      <div className="flex space-x-2 overflow-x-auto">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={cn(
                              'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                              selectedImageIndex === index ? 'border-gold-primary' : 'border-gray-200'
                            )}
                          >
                            <img
                              src={getImageUrl(image.url)}
                              alt={`${property.titre} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[16/10] bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <Home className="w-16 h-16 mx-auto mb-4" />
                    <p>Aucune image disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm bg-gold-light/50 text-zinc-900 px-3 py-1 rounded-full inline-flex items-center gap-2">
                      {(() => {
                        const Icon = getPropertyTypeIcon(property.categorie);
                        return <Icon className="w-4 h-4 text-zinc-900" />;
                      })()}
                      <span>{property.categorie}</span>
                    </span>

                    <span className="text-sm bg-zinc-900 text-white px-3 py-1 rounded-full inline-flex items-center gap-2">
                      <span className="opacity-90">{property.transactionType === 'vente' ? 'Vente' : 'Location'}</span>
                    </span>

                    {property.isBonPlan ? (
                      <span className="text-sm bg-emerald-500/15 text-emerald-800 px-3 py-1 rounded-full inline-flex items-center gap-2 ring-1 ring-emerald-500/25">
                        <span className="font-medium">Bon plan</span>
                        {property.bonPlanLabel ? <span className="opacity-80">• {property.bonPlanLabel}</span> : null}
                      </span>
                    ) : null}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.titre}</h1>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{property.adresse}, {property.ville}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-gold-primary leading-none">
                    {formatPrice(property.prix)}
                  </div>
                  {property.prixOriginal && property.prixOriginal > property.prix ? (
                    <div className="text-sm text-zinc-500 line-through">
                      {formatPrice(property.prixOriginal)}
                    </div>
                  ) : null}
                  {property.isBonPlan && property.prixOriginal && property.prixOriginal > property.prix ? (
                    <div className="text-xs text-emerald-700">
                      -{Math.round(((property.prixOriginal - property.prix) / property.prixOriginal) * 100)}%
                    </div>
                  ) : null}
                  <StarRating value={property.noteMoyenne || 0} />
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-600">
                    <feature.icon className="w-5 h-5" />
                    <span>{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description || '—'}
                </p>
              </div>

              {/* Rating Section */}
              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Noter cette propriété</h3>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={cn(
                          'w-8 h-8 transition-colors',
                          star <= userRating ? 'text-gold-primary' : 'text-gray-300 hover:text-gold-light'
                        )}
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {userRating > 0 ? `${userRating}/5` : 'Cliquez pour noter'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Détails du bien</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Transaction</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.transactionType === 'vente' ? 'Vente' : 'Location'}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Statut</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.status || 'active'}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Devise</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.devise || 'XAF'}</div>
                </div>

                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Ville</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.ville || '—'}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Adresse</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.adresse || '—'}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Superficie</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.superficie ? `${property.superficie} m²` : '—'}</div>
                </div>

                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Chambres</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.nombre_chambres ?? '—'}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Salles de bain</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.nombre_salles_bain ?? '—'}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Salons</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.nombre_salons ?? '—'}</div>
                </div>

                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Publié</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.createdAt ? formatDate(property.createdAt) : '—'}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Vues</div>
                  <div className="mt-1 font-medium text-zinc-900">{property.vues || 0}</div>
                </div>

                {property.isBonPlan ? (
                  <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200 sm:col-span-2 lg:col-span-3">
                    <div className="text-xs uppercase tracking-wide text-emerald-700">Bon plan</div>
                    <div className="mt-1 text-sm text-emerald-900">
                      {property.bonPlanLabel ? <span className="font-medium">{property.bonPlanLabel}</span> : <span className="font-medium">Offre spéciale</span>}
                      {property.bonPlanExpiresAt ? <span className="opacity-80"> • expire le {formatDate(property.bonPlanExpiresAt)}</span> : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contacter l\u0027agent</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-gold-primary to-gold-dark rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {owner?.nom?.charAt(0) || owner?.name?.charAt(0) || 'O'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {owner?.nom || owner?.name || 'Agent SCIM'}
                    </div>
                    <div className="text-sm text-gray-600">Agent immobilier</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{owner?.telephone || '+242 06 123 45 67'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{owner?.email || 'contact@scim.app'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => setShowContactModal(true)}
                >
                  Demander des informations
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = `tel:${owner?.telephone || '+242061234567'}`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler maintenant
                </Button>
              </div>
            </div>

            {isAuthenticated && user?.role !== 'admin' ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Réserver une visite</h3>
                <div className="text-sm text-gray-600 mb-4">Choisissez une date et envoyez votre demande de réservation.</div>

                <label className="block text-sm font-medium text-gray-700 mb-2">Date et heure</label>
                <input
                  type="datetime-local"
                  value={reservationDate}
                  min={minDateTimeLocal}
                  step={900}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent"
                />

                <div className="mt-2 text-xs text-gray-500">Heures autorisées: 10h00 → 17h00.</div>

                {reservationValidationMessage ? (
                  <div className="mt-2 text-sm text-red-600">{reservationValidationMessage}</div>
                ) : null}

                <div className="mt-4 flex gap-3">
                  <Button
                    className="flex-1"
                    loading={reservationLoading}
                    disabled={!reservationDate || Boolean(reservationValidationMessage)}
                    onClick={async () => {
                      if (!property?._id) return;
                      if (!reservationDate) return;
                      if (reservationValidationMessage) {
                        toast.error(reservationValidationMessage);
                        return;
                      }
                      try {
                        setReservationLoading(true);
                        const res = await reservationAPI.create(property._id, reservationDate);
                        if (res?.data) {
                          toast.success('Demande de réservation envoyée');
                          setReservationDate('');
                        }
                      } catch (err) {
                        toast.error(err?.response?.data?.message || 'Réservation impossible');
                      } finally {
                        setReservationLoading(false);
                      }
                    }}
                  >
                    Envoyer la demande
                  </Button>
                </div>
              </div>
            ) : !isAuthenticated ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Réserver une visite</h3>
                <div className="text-sm text-gray-600">Connectez-vous pour réserver une visite.</div>
                <div className="mt-4">
                  <Link to="/login">
                    <Button className="w-full">Connexion</Button>
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Trust Indicators */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pourquoi nous faire confiance ?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Transactions sécurisées</div>
                    <div className="text-sm text-gray-600">Toutes nos transactions sont protégées</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-gold-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Expertise reconnue</div>
                    <div className="text-sm text-gray-600">5+ années d'expérience</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-gold-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">98% de satisfaction</div>
                    <div className="text-sm text-gray-600">Clients satisfaits de nos services</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Demander des informations"
        size="md"
      >
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          try {
            const subject = `Demande d'information • ${property?.titre || ''}`;
            const lines = [
              `Nom: ${contactName || user?.nom || ''}`,
              `Email: ${contactEmail || user?.email || ''}`,
              `Téléphone: ${contactPhone || user?.telephone || ''}`,
              `Propriété: ${property?.titre || ''} (#${property?._id || ''})`,
              `Ville: ${property?.ville || ''}`,
              '',
              'Message:',
              contactMessage || ''
            ];
            const content = lines.join('\n');
            const result = await contactScim(subject, content);
            if (result?.success) {
              toast.success("Votre demande a été envoyée à l'administration");
              setShowContactModal(false);
            } else {
              toast.error("Échec de l'envoi de la demande");
            }
          } catch (err) {
            toast.error("Échec de l'envoi de la demande");
          }
        }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre nom
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              placeholder="Votre nom complet"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              placeholder="votre@email.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              placeholder="+242 06 123 45 67"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              placeholder="Je suis intéressé(e) par cette propriété..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              Envoyer la demande
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowContactModal(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        size="full"
        className="p-0"
      >
        <div className="relative bg-black">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
          >
            ×
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="w-full h-[80vh] flex items-center justify-center">
            <img
              src={getImageUrl(images[selectedImageIndex]?.url)}
              alt={property.titre}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="p-4 bg-black/90">
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border ${selectedImageIndex === idx ? 'border-gold-primary' : 'border-transparent'}`}
                  >
                    <img src={getImageUrl(image.url)} alt={`${property.titre} ${idx+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PropertyDetailPage;

