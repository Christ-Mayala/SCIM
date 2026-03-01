import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, MapPin, Bed, Bath, Square, Star, Phone, Mail, 
  ArrowLeft, Share2, Calendar, Eye, Car, Waves, TreePine,
  Home, Shield, Award, ChevronLeft, ChevronRight, Clock, AlertCircle, MessageCircle
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
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [userRating, setUserRating] = useState(0);

  const [reservationDate, setReservationDate] = useState('');
  const [isWhatsapp, setIsWhatsapp] = useState(true);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationAck, setReservationAck] = useState(null);

  const images = property?.images || [];
  const owner = property?.utilisateur || property?.proprietaire || null;

  useEffect(() => {
    if (user) {
      setContactForm(prev => ({
        ...prev,
        name: user.nom || '',
        email: user.email || '',
        phone: user.telephone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (property) {
      setContactForm(prev => ({
        ...prev,
        message: `Bonjour, je suis intéressé(e) par la propriété "${property.titre}" à ${property.ville}.`
      }));
    }
  }, [property]);

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

    // Récupérer la note de l'utilisateur pour cette propriété
    (async () => {
      try {
        if (isAuthenticated) {
          const userNoteResponse = await propertyAPI.getUserNote(property._id);
          if (userNoteResponse?.data?.note) {
            setUserRating(userNoteResponse.data.note);
          }
        }
      } catch (_) {}
    })();

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

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      toggleFavorite(id);
    } else {
      navigate('/login');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const subject = `Demande d'information • ${property?.titre || ''}`;
      const lines = [
        `Nom: ${contactForm.name}`,
        `Email: ${contactForm.email}`,
        `Téléphone: ${contactForm.phone}`,
        `Propriété: ${property?.titre || ''} (#${property?._id || ''})`,
        `Ville: ${property?.ville || ''}`,
        '',
        'Message:',
        contactForm.message
      ];
      const content = lines.join('\n');
      const result = await contactScim(subject, content);
      if (result?.success) {
        toast.success('Message envoyé avec succès !');
        setShowContactModal(false);
      } else {
        toast.error("Échec de l'envoi du message.");
      }
    } catch (err) {
      toast.error("Échec de l'envoi du message.");
    }
  };


  const handleRating = async (rating) => {
    if (isAuthenticated) {
      try {
        setUserRating(rating);
        const result = await rateProperty(id, rating);
        if (result?.data?.userNote) {
          toast.success('✓ Note enregistrée avec succès !');
        }
      } catch (error) {
        const message = error?.response?.data?.message || error?.message || 'Erreur lors de la notation';
        if (message.includes('déjà noté')) {
          toast.error('✗ Vous avez déjà noté cette propriété.');
        } else {
          toast.error(`✗ ${message}`);
        }
        // Réinitialiser la note actuelle
        setUserRating(0);
      }
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
            {/* Header Section */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                 <span className="px-3 py-1 bg-gold-primary/10 text-gold-primary text-sm font-semibold rounded-full uppercase tracking-wider">
                    {property.categorie}
                 </span>
                 <span className={cn(
                   "px-3 py-1 text-sm font-semibold rounded-full uppercase tracking-wider",
                   property.transactionType === 'vente' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                 )}>
                    {property.transactionType === 'vente' ? 'Vente' : 'Location'}
                 </span>
                 {property.isBonPlan && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full uppercase tracking-wider animate-pulse">
                      Bon Plan
                    </span>
                 )}
              </div>
              
              <div className="flex justify-between items-start gap-4">
                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                   {property.titre}
                 </h1>
                 <div className="text-right shrink-0">
                    <div className="text-3xl md:text-4xl font-bold text-gold-primary">
                      {formatPrice(property.prix)}
                    </div>
                    {property.prixOriginal && property.prixOriginal > property.prix && (
                      <div className="text-sm text-gray-500 line-through mt-1">
                        {formatPrice(property.prixOriginal)}
                      </div>
                    )}
                 </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-lg">
                <MapPin className="w-5 h-5 text-gold-primary" />
                <span>{property.adresse}, {property.ville}</span>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-100">
              {images.length > 0 ? (
                <>
                  <div 
                    className="relative aspect-[16/10] bg-gray-100 cursor-zoom-in group"
                    onClick={() => setShowImageModal(true)}
                  >
                    <img
                      src={getImageUrl(images[selectedImageIndex]?.url)}
                      alt={property.titre}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                       <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                         Voir les photos
                       </span>
                    </div>
                    <button 
                      className="absolute bottom-4 right-4 bg-white/90 text-gray-900 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg backdrop-blur-md"
                      onClick={(e) => { e.stopPropagation(); setShowImageModal(true); }}
                    >
                      {selectedImageIndex + 1} / {images.length}
                    </button>
                  </div>
                  
                  {images.length > 1 && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={cn(
                              'relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all duration-200',
                              selectedImageIndex === index 
                                ? 'ring-2 ring-gold-primary ring-offset-2 opacity-100 scale-105' 
                                : 'opacity-70 hover:opacity-100 hover:scale-105'
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
                <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <Home className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Aucune image disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold-primary rounded-full"></span>
                Description
              </h3>
              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                {property.description ? (
                  property.description.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))
                ) : (
                  <p className="italic text-gray-400">Aucune description fournie pour ce bien.</p>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold-primary rounded-full"></span>
                Caractéristiques détaillées
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[
                   { label: 'Type de bien', value: property.categorie },
                   { label: 'Statut', value: property.status || 'Actif' },
                   { label: 'Surface', value: property.superficie ? `${property.superficie} m²` : null },
                   { label: 'Chambres', value: property.nombre_chambres },
                   { label: 'Salles de bain', value: property.nombre_salles_bain },
                   { label: 'Salons', value: property.nombre_salons },
                   { label: 'Garage', value: property.garage ? 'Oui' : 'Non' },
                   { label: 'Piscine', value: property.piscine ? 'Oui' : 'Non' },
                   { label: 'Jardin', value: property.jardin ? 'Oui' : 'Non' },
                 ].map((item, i) => item.value != null && (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500 font-medium">{item.label}</span>
                      <span className="text-gray-900 font-semibold">{item.value}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold-primary rounded-full"></span>
                Noter ce bien
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {isAuthenticated ? 'Cliquez sur les étoiles pour noter cette propriété' : 'Connectez-vous pour noter cette propriété'}
                    </p>
                    <div className="flex items-center gap-4">
                      <StarRating 
                        value={userRating} 
                        interactive={isAuthenticated}
                        onRate={handleRating}
                        disabled={!isAuthenticated}
                        className="text-lg"
                      />
                      {property.noteMoyenne && (
                        <div className="text-sm text-gray-500">
                          <span className="font-semibold">{property.noteMoyenne.toFixed(1)}</span>
                          <span className="text-gray-400"> ({property.nombreAvis || 0} avis)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {isAuthenticated && userRating > 0 && (
                  <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
                    ✅ Merci pour votre note de {userRating}/5 !
                  </div>
                )}
                {!isAuthenticated && (
                  <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100">
                    ℹ️ Connectez-vous pour noter cette propriété
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                   {owner?.avatar ? (
                     <img src={getImageUrl(owner.avatar)} alt={owner.nom} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-gold-primary flex items-center justify-center text-white text-xl font-bold">
                       {owner?.nom?.charAt(0) || 'A'}
                     </div>
                   )}
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-gray-900">{owner?.nom || 'Agence SCIM'}</h3>
                   <p className="text-sm text-gray-500">Agent immobilier certifié</p>
                   <div className="flex items-center gap-1 text-gold-primary text-sm mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">4.9</span>
                      <span className="text-gray-400 font-normal">(12 avis)</span>
                   </div>
                 </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button 
                  className="w-full bg-gray-900 hover:bg-black text-white h-12 text-lg font-medium shadow-md transition-all hover:shadow-lg"
                  onClick={() => setShowContactModal(true)}
                >
                  Contacter l'agent
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg font-medium border-gray-300 hover:border-gray-900 hover:bg-gray-50"
                  onClick={() => window.location.href = `tel:${owner?.telephone || '+242061234567'}`}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {owner?.telephone || '+242 06 123 45 67'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg font-medium border-green-500 hover:border-green-600 hover:bg-green-50 text-green-600"
                  onClick={() => {
                    const message = encodeURIComponent(
                      `🏠 *Demande de visite - SCIM Immobilier*\n\n` +
                      `*Bien:* ${property.titre}\n` +
                      `*Localisation:* ${property.ville || 'Lieu non spécifié'}\n` +
                      `*Prix:* ${property.prix ? new Intl.NumberFormat('fr-FR').format(property.prix) + ' XAF' : 'Prix sur demande'}\n\n` +
                      `Bonjour, je suis intéressé(e) par cette propriété et j'aimerais planifier une visite.\n\n` +
                      `*Lien direct vers le bien:* ${window.location.href}\n\n` +
                      `Merci de me contacter pour plus d'informations.`
                    );
                    window.open(`https://wa.me/${(owner?.telephone || '+242061234567').replace(/[^\d]/g, '')}?text=${message}`, '_blank');
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Direct
                </Button>
              </div>

              <div className="text-center">
                 <p className="text-xs text-gray-400">Réponse moyenne: &lt; 1h</p>
              </div>
            </div>

            {isAuthenticated && user?.role !== 'admin' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <Calendar className="w-5 h-5 text-gold-primary" />
                   Réserver une visite
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date et heure souhaitées</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <input
                        type="datetime-local"
                        value={reservationDate}
                        min={minDateTimeLocal}
                        step={900}
                        onChange={(e) => {
                          setReservationDate(e.target.value);
                          if (reservationAck) setReservationAck(null);
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-primary focus:border-transparent transition-all outline-none appearance-none"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Sélectionnez une date et une heure (10h-17h)</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="whatsapp"
                      checked={isWhatsapp}
                      onChange={(e) => setIsWhatsapp(e.target.checked)}
                      className="w-4 h-4 text-gold-primary border-gray-300 rounded focus:ring-gold-primary focus:ring-2"
                    />
                    <label htmlFor="whatsapp" className="text-sm text-gray-700">
                      Ce numéro est un numéro WhatsApp
                    </label>
                  </div>

                  {reservationValidationMessage && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-3 border border-red-100 animate-fade-in">
                       <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                       <span className="font-medium">{reservationValidationMessage}</span>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gold-primary hover:bg-gold-dark text-white font-semibold h-12 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
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
                        const reservationPhone = String(user?.telephone || contactForm.phone || '').trim();
                        if (!reservationPhone) {
                          toast.error('Ajoutez votre numero de telephone dans le profil avant de reserver.');
                          return;
                        }

                        const res = await reservationAPI.create(property._id, reservationDate, reservationPhone, isWhatsapp);
                        const payload = res?.data || {};
                        const reservation = payload?.reservation || payload;
                        const support = payload?.support || reservation?.support || {};

                        if (reservation?._id) {
                          const reference = reservation?.reference || support?.reference || '';
                          setReservationAck({
                            reservationId: reservation._id,
                            reference,
                            expectedResponseMinutes: support?.expectedResponseMinutes || 30,
                            asyncNotice: support?.asyncNotice || 'Demande enregistree. Notre equipe vous repond rapidement.',
                            whatsappUrl: support?.whatsappUrl || '',
                          });
                          toast.success(reference ? `Demande envoyee (${reference})` : 'Demande de reservation envoyee');
                          setReservationDate('');
                        }
                      } catch (err) {
                        toast.error(err?.response?.data?.message || 'Réservation impossible');
                      } finally {
                        setReservationLoading(false);
                      }
                    }}
                  >
                    Confirmer la demande
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    Flux web asynchrone: suivi dans votre espace client. Aucun paiement requis. Telephone requis pour la reservation.
                  </p>

                  {reservationAck && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                      <div className="text-sm font-semibold text-emerald-800">Demande enregistree avec succes</div>
                      <div className="text-xs text-emerald-700">
                        Reference: <span className="font-semibold">{reservationAck.reference || reservationAck.reservationId}</span>
                      </div>
                      <div className="text-xs text-emerald-700">
                        {reservationAck.asyncNotice} (SLA cible: {reservationAck.expectedResponseMinutes} min)
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link to="/dashboard" className="w-full sm:w-auto">
                          <Button variant="outline" className="w-full">
                            Suivre mes reservations
                          </Button>
                        </Link>
                        {reservationAck.whatsappUrl ? (
                          <a href={reservationAck.whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                              Continuer sur WhatsApp
                            </Button>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : !isAuthenticated ? (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 text-center">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Intéressé par ce bien ?</h3>
                <p className="text-sm text-blue-700 mb-4">Connectez-vous pour planifier une visite ou contacter l'agent.</p>
                <Link to="/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">Se connecter</Button>
                </Link>
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
        <form className="space-y-4" onSubmit={handleContactSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre nom
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              placeholder="Votre nom complet"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
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
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
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
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
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
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
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

