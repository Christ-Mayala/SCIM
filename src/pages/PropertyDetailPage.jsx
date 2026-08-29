import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, MapPin, Bed, Bath, Square, Star, Phone, Mail, Send,
  ArrowLeft, Share2, Calendar, Eye, Car, Waves, TreePine,
  Home, Shield, Award, ChevronLeft, ChevronRight, Clock, AlertCircle, MessageCircle, Sparkles, CheckCircle2, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useMessage } from '../contexts/MessageContext';
import { useProperty } from '../contexts/PropertyContext';
import {Button} from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { formatPrice, formatDate, getImageUrl, getPropertyTypeIcon } from '../lib/utils';
import { toWhatsAppNumber, normalizePhoneE164 } from '../lib/phone';
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
  const [reservationType, setReservationType] = useState('visite');
  const [isWhatsapp, setIsWhatsapp] = useState(true);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationAck, setReservationAck] = useState(null);
  const [receiptDownloading, setReceiptDownloading] = useState(false);

  const availableReservationTypes = useMemo(() => {
    const types = [{ value: 'visite', label: 'Visite' }];
    if (property?.transactionType === 'location') types.push({ value: 'location', label: 'Location' });
    if (property?.transactionType === 'vente') types.push({ value: 'achat', label: 'Achat' });
    return types;
  }, [property?.transactionType]);

  useEffect(() => {
    if (!availableReservationTypes.some((t) => t.value === reservationType)) {
      setReservationType('visite');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableReservationTypes]);

  // Normalisation des images : gérer à la fois {url: '...'} et '...'
  const images = useMemo(() => {
    if (!property?.images) return [];
    return property.images.map(img => {
      if (typeof img === 'string') return { url: img };
      return img;
    });
  }, [property?.images]);

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

    if (reservationType === 'visite') {
      const minutes = when.getHours() * 60 + when.getMinutes();
      const min = 10 * 60;
      const max = 17 * 60;

      if (minutes < min || minutes > max) return 'Réservation possible uniquement entre 10h00 et 17h00.';
    }

    return null;
  }, [reservationDate, reservationType]);

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
      const normalizedPhone = normalizePhoneE164(contactForm.phone);
      if (!normalizedPhone) {
        toast.error('Numero de telephone invalide. Ex: 06 123 45 67');
        return;
      }
      const subject = `Demande d'information • ${property?.titre || ''}`;
      const lines = [
        `Nom: ${contactForm.name}`,
        `Email: ${contactForm.email}`,
        `Téléphone: ${normalizedPhone}`,
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
    const url = window.location.href;
    const title = property?.titre || 'Bien immobilier';
    const text = property?.description || '';

    // Essai 1 : Web Share API (mobile natif)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (e) {
        // AbortError = l'utilisateur a annulé → pas d'erreur à afficher
        if (e?.name === 'AbortError') return;
        // Autre erreur → continuer vers le fallback clipboard
      }
    }

    // Essai 2 : Clipboard API moderne (HTTPS uniquement)
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Lien copié dans le presse-papiers !');
        return;
      } catch (_) {
        // Contexte non sécurisé ou permission refusée → fallback
      }
    }

    // Essai 3 : execCommand (compatibilité max)
    try {
      const el = document.createElement('textarea');
      el.value = url;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      toast.success('Lien copié dans le presse-papiers !');
    } catch (_) {
      toast.error('Impossible de copier le lien. Copiez manuellement : ' + url);
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Propriété non trouvée</h2>
          <Button onClick={() => navigate('/properties')}>
            Retour aux propriétés
          </Button>
        </div>
      </div>
    );
  }

  // images already defined above
  const features = [];
  
  if (property.nombre_chambres) features.push({ icon: Bed, label: `${property.nombre_chambres} chambre${property.nombre_chambres > 1 ? 's' : ''}` });
  if (property.nombre_salles_bain) features.push({ icon: Bath, label: `${property.nombre_salles_bain} salle${property.nombre_salles_bain > 1 ? 's' : ''} de bain` });
  if (property.nombre_salons) features.push({ icon: Home, label: `${property.nombre_salons} salon${property.nombre_salons > 1 ? 's' : ''}` });
  if (property.superficie) features.push({ icon: Square, label: `${property.superficie} m²` });
  if (property.garage) features.push({ icon: Car, label: 'Garage' });
  if (property.gardien) features.push({ icon: Shield, label: 'Gardien' });
  if (property.balcon) features.push({ icon: Home, label: 'Balcon' });
  if (property.piscine) features.push({ icon: Waves, label: 'Piscine' });
  if (property.jardin) features.push({ icon: TreePine, label: 'Jardin' });

  const seoData = seoConfig.propertyDetail(property);
  const structuredData = generatePropertyStructuredData(property);

  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
        structuredData={structuredData}
      />
      {/* Header / Breadcrumb */}
      <div className="bg-zinc-950 sticky top-20 z-30 border-b border-white/10 shadow-2xl shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
               onClick={() => navigate(-1)}
               className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
             >
               <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 group-hover:-translate-x-1 transition-all border border-white/5">
                 <ArrowLeft className="w-3.5 h-3.5 text-gold-primary" />
               </div>
               <span>Retour</span>
             </button>
            
            <div className="flex items-center gap-6">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-[0.2em]"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </button>
              
              <button
                onClick={handleFavoriteClick}
                className={cn(
                  'flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-[0.2em]',
                  isFavorite ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'
                )}
              >
                <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
                <span className="hidden sm:inline">{isFavorite ? 'Sauvegardé' : 'Favoris'}</span>
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
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                 <div className="px-4 py-1.5 bg-zinc-950 text-gold-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full ring-1 ring-gold-primary/20">
                    {property.categorie}
                 </div>
                 <div className={cn(
                   "px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full",
                   property.transactionType === 'vente' ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20"
                 )}>
                    {property.transactionType === 'vente' ? 'En Vente' : 'En Location'}
                 </div>
                 {property.isBonPlan && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full ring-1 ring-amber-500/20">
                      <Sparkles className="w-3 h-3" />
                      Opportunité
                    </div>
                 )}
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="space-y-3">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight italic uppercase">
                    {property.titre}
                  </h1>
                  <div className="flex items-center gap-2 text-zinc-400 font-medium">
                    <div className="p-1.5 bg-white/5 rounded-lg text-gold-primary border border-white/10">
                      <MapPin className="w-4 h-4 text-gold-primary" />
                    </div>
                    <span className="text-base">{property.adresse}, {property.ville}</span>
                  </div>
                </div>
                
                <div className="md:text-right w-full md:w-auto p-6 rounded-3xl bg-zinc-900 border border-white/10 flex flex-col justify-center shadow-xl">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Prix de présentation</div>
                  <div className="text-2xl font-black text-gold-primary">
                    {formatPrice(property.prix)}
                  </div>
                  {property.prixOriginal && property.prixOriginal > property.prix && (
                    <div className="text-xs text-zinc-500 font-bold line-through mt-1 decoration-red-500/50">
                      {formatPrice(property.prixOriginal)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="group relative rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl border border-white/5">
              {images.length > 0 ? (
                <>
                  <div 
                    className="relative aspect-[16/9] cursor-zoom-in overflow-hidden"
                    onClick={() => setShowImageModal(true)}
                  >
                    <img
                      src={getImageUrl(images[selectedImageIndex]?.url)}
                      alt={property.titre}
                      className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-12">
                       <div className="bg-white/20 text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                         Explorer la galerie
                       </div>
                    </div>
                    
                    {/* Navigation Overlays */}
                    <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center translate-x-[-100%] group-hover:translate-x-0 transition-transform">
                       <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors">
                          <ChevronLeft className="w-6 h-6" />
                       </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center translate-x-[100%] group-hover:translate-x-0 transition-transform">
                       <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors">
                          <ChevronRight className="w-6 h-6" />
                       </button>
                    </div>

                    <div className="absolute top-6 left-6 px-4 py-2 bg-zinc-950 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                       Image {selectedImageIndex + 1} / {images.length}
                    </div>
                  </div>
                  
                  {images.length > 1 && (
                    <div className="p-4 bg-zinc-950 border-t border-white/5 overflow-hidden">
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1 justify-start md:justify-center">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={cn(
                              'relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden transition-all duration-500 border border-white/5',
                              selectedImageIndex === index 
                                ? 'ring-2 ring-gold-primary ring-offset-2 ring-offset-zinc-950 opacity-100 scale-105 shadow-xl z-10' 
                                : 'opacity-40 hover:opacity-80 hover:scale-105'
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
                <div className="aspect-[16/9] bg-zinc-900 flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center text-zinc-600">
                    <Home className="w-10 h-10" />
                  </div>
                  <p className="font-black text-zinc-500 uppercase tracking-widest text-sm">Visualisation indisponible</p>
                </div>
              )}
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="group bg-zinc-900 p-5 rounded-3xl border border-white/10 hover:border-gold-primary/30 transition-all hover:shadow-[0_20px_40px_rgba(201,162,39,0.1)]">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-gold-primary/10 flex items-center justify-center text-zinc-500 group-hover:text-gold-primary transition-all duration-300 mb-4 border border-white/5 group-hover:border-gold-primary/20">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xl font-black text-white tracking-tight">{feature.label.split(' ')[0]}</span>
                    <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">{feature.label.split(' ').slice(1).join(' ')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Sections with cleaner layout */}
            <div className="grid grid-cols-1 gap-8">
              <section className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-6 bg-gold-primary rounded-full shadow-[0_0_15px_rgba(201,162,39,0.5)]" />
                  <h3 className="text-xl font-black text-white tracking-tight uppercase italic">Présentation<span className="text-gold-primary">.</span></h3>
                </div>
                <div className="prose prose-zinc prose-lg max-w-none text-zinc-500 font-medium leading-[1.8]">
                  {property.description ? (
                    property.description.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-6">{paragraph}</p>
                    ))
                  ) : (
                    <p className="italic text-zinc-400">Ce bien attend votre visite pour révéler tous ses secrets.</p>
                  )}
                </div>
              </section>

              <section className="bg-zinc-950 p-8 rounded-[32px] shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/10 blur-[100px] -z-0" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-gold-primary rounded-full" />
                    <h3 className="text-xl font-black text-white tracking-tight uppercase italic">Détails Techniques</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1 gap-x-12">
                     {[
                       { label: 'Catégorie', value: property.categorie },
                       { label: 'Statut Actuel', value: property.status || 'Disponible' },
                       { label: 'Surface Totale', value: property.superficie ? `${property.superficie} m²` : null },
                       { label: 'Suite Parentale', value: property.nombre_chambres },
                       { label: 'Espace Bains', value: property.nombre_salles_bain },
                       { label: 'Espace Réception', value: property.nombre_salons },
                       { label: 'Espace Véhicule', value: property.garage ? 'Équipé' : 'Non' },
                       { label: 'Sécurisation', value: property.gardien ? 'Assurée' : 'Individuelle' },
                       { label: 'Détente', value: property.piscine ? 'Privative' : 'Non' },
                     ].map((item, i) => item.value != null && (
                       <div key={i} className="flex justify-between items-center py-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-4 rounded-xl">
                          <span className="text-zinc-400 text-xs font-black uppercase tracking-widest">{item.label}</span>
                          <span className="text-zinc-100 font-bold">{item.value}</span>
                       </div>
                     ))}
                  </div>
                </div>
              </section>

              {/* Rating Section refined */}
              <section className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-6 bg-gold-primary rounded-full" />
                    <h3 className="text-xl font-black text-white tracking-tight uppercase italic">Évaluation & Avis</h3>
                  </div>
                  {property.noteMoyenne && (
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                      <Star className="w-4 h-4 text-gold-primary fill-current" />
                      <span className="text-lg font-black text-white">{property.noteMoyenne.toFixed(1)}</span>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">({property.nombreAvis || 0} avis)</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
                   <div className="space-y-2 flex-1">
                      <p className="text-zinc-400 font-medium text-base leading-relaxed">
                        {isAuthenticated 
                          ? 'Votre avis est précieux pour nous et pour la communauté.' 
                          : 'Rejoignez-nous pour partager votre expérience sur ce bien.'}
                      </p>
                      <StarRating 
                        value={userRating} 
                        interactive={isAuthenticated}
                        onRate={handleRating}
                        disabled={!isAuthenticated}
                        className="text-2xl"
                      />
                   </div>
                   
                   {!isAuthenticated && (
                     <Link to="/login">
                       <Button className="bg-zinc-950 text-white hover:bg-black px-8 py-6 rounded-2xl font-black uppercase tracking-widest">
                         Se Connecter
                       </Button>
                     </Link>
                   )}
                   {isAuthenticated && userRating > 0 && (
                     <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                       <CheckCircle2 className="w-5 h-5" />
                       Votre note : {userRating}/5
                     </div>
                   )}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar with premium cards */}
          <div className="space-y-8">
            {/* Contact Card refined */}
            <div className="bg-zinc-900 border border-white/10 rounded-[40px] shadow-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/20 blur-[60px] transform group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center mb-10">
                   <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gold-primary rounded-full blur-md opacity-20 scale-125" />
                      <div className="relative w-24 h-24 rounded-[32px] bg-zinc-900 overflow-hidden border-2 border-white/20 shadow-2xl transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
                        {owner?.avatar ? (
                          <img src={getImageUrl(owner.avatar)} alt={owner.nom} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gold-primary to-gold-dark flex items-center justify-center text-zinc-950 text-2xl font-black">
                            {owner?.nom?.charAt(0) || 'S'}
                          </div>
                        )}
                      </div>
                   </div>
                   <h3 className="text-xl font-black text-white leading-tight mb-2">{owner?.nom || 'Excellence SCIM'}</h3>
                   <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-gold-primary uppercase tracking-[0.2em] mb-4">Conseiller Privé</div>
                   <div className="flex items-center gap-1.5 text-gold-primary">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      <span className="text-xs font-black text-white ml-2">4.9/5</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gold-primary text-zinc-950 hover:bg-amber-300 h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98]"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: `/property/${id}` } });
                        return;
                      }
                      setShowContactModal(true);
                    }}
                  >
                    Demande de Renseignement
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all"
                      onClick={() => window.location.href = `tel:${owner?.telephone || '+242061234567'}`}
                    >
                      <Phone className="w-4 h-4 mr-2 text-gold-primary" />
                      Appeler
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-14 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all"
                      onClick={() => {
                        const phone = toWhatsAppNumber(owner?.telephone);
                        if (!phone) {
                          toast.error("Numéro WhatsApp indisponible pour ce bien");
                          return;
                        }
                        const price = property.prix
                          ? new Intl.NumberFormat('fr-CG').format(property.prix) + ' XAF'
                          : 'sur demande';
                        const typeLabel = property.transactionType === 'vente' ? 'Vente' : 'Location';
                        const message = encodeURIComponent(
                          `[SCIM Immobilier — Demande d'Information]\n` +
                          `━━━━━━━━━━━━━━━━━━━━\n\n` +
                          `Bonjour, je souhaite obtenir plus d'informations concernant le bien suivant :\n\n` +
                          `* ${property.titre}\n` +
                          `- ${property.adresse ? property.adresse + ', ' : ''}${property.ville}\n` +
                          `- Type : ${property.categorie} — ${typeLabel}\n` +
                          `- Prix : ${price}\n\n` +
                          `Lien de l'annonce : ${window.location.href}\n\n` +
                          `Merci de me revenir dans les plus brefs délais.`
                        );
                        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-4 py-4 border-t border-white/5 opacity-50">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-primary shadow-[0_0_8px_rgba(201,162,39,0.5)]" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Réponse &lt; 30min</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Response Avg Info */}
            <div className="text-center">
               <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest opacity-50">Réponse moyenne &lt; 30min</p>
            </div>
            
            {isAuthenticated && user?.role !== 'admin' ? (
              <div className="bg-zinc-900 border border-white/10 rounded-[32px] shadow-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2.5 bg-gold-primary/10 rounded-xl text-gold-primary border border-gold-primary/20">
                      <Calendar className="w-5 h-5" />
                   </div>
                   <h3 className="text-lg font-black text-white tracking-tight uppercase italic">
                     {reservationType === 'location' ? 'Demander une Location' : reservationType === 'achat' ? "Faire une Demande d'Achat" : 'Planifier une Visite'}
                   </h3>
                </div>

                <div className="space-y-4">
                  {availableReservationTypes.length > 1 && (
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Type de demande</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableReservationTypes.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => {
                              setReservationType(t.value);
                              if (reservationAck) setReservationAck(null);
                            }}
                            className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                              reservationType === t.value
                                ? 'bg-gold-primary text-zinc-950 border-gold-primary'
                                : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                      {reservationType === 'visite' ? 'Date et heure souhaitées' : 'Date souhaitée'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-primary">
                        <Clock className="w-4 h-4" />
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
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-gold-primary focus:border-transparent transition-all outline-none appearance-none text-white"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {reservationType === 'visite' ? 'Sélectionnez une date et une heure (10h-17h)' : 'Sélectionnez la date à laquelle vous souhaitez démarrer la démarche'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="whatsapp"
                      checked={isWhatsapp}
                      onChange={(e) => setIsWhatsapp(e.target.checked)}
                      className="w-4 h-4 text-gold-primary border-white/20 rounded focus:ring-gold-primary focus:ring-2 bg-white/5 accent-gold-primary"
                    />
                    <label htmlFor="whatsapp" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      Ce numéro est un WhatsApp
                    </label>
                  </div>

                  {reservationValidationMessage && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-3 border border-red-100 animate-fade-in">
                       <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                       <span className="font-medium">{reservationValidationMessage}</span>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gold-primary hover:bg-amber-300 text-zinc-950 font-black h-14 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5 uppercase tracking-widest text-xs"
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
                        const rawPhone = String(user?.telephone || contactForm.phone || '').trim();
                        const reservationPhone = normalizePhoneE164(rawPhone);
                        if (!reservationPhone) {
                          toast.error('Ajoutez un numéro de téléphone valide (ex: 06 123 45 67) avant de réserver.');
                          return;
                        }

                        const res = await reservationAPI.create(property._id, reservationDate, reservationPhone, isWhatsapp, reservationType);
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
                    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-4">
                      {/* success header */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-emerald-400 uppercase tracking-wide leading-snug">
                            Demande enregistrée !
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">Notre équipe reviendra vers vous sous {reservationAck.expectedResponseMinutes} min.</p>
                        </div>
                      </div>
                      {/* reference */}
                      <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/40 border border-white/[0.07] rounded-2xl">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Référence</span>
                        <span className="text-sm font-black text-white">{reservationAck.reference || '—'}</span>
                      </div>
                      {/* actions */}
                      <div className="flex flex-col gap-2.5">
                        <Link
                          to="/dashboard"
                          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-gold-primary hover:bg-amber-300 text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-gold-primary/20 hover:-translate-y-0.5"
                        >
                          Suivre mes réservations
                        </Link>
                        <button
                          type="button"
                          disabled={receiptDownloading}
                          onClick={async () => {
                            try {
                              setReceiptDownloading(true);
                              await reservationAPI.downloadReceipt(reservationAck.reservationId);
                            } catch (err) {
                              toast.error('Téléchargement du reçu impossible');
                            } finally {
                              setReceiptDownloading(false);
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-white/5 border border-white/10 text-zinc-300 hover:border-white/30 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                        >
                          {receiptDownloading ? 'Génération...' : 'Télécharger le reçu'}
                        </button>
                        {reservationAck.whatsappUrl && (
                          <a
                            href={reservationAck.whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                          >
                            <span>💬</span> Contacter via WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : !isAuthenticated ? (
              <div className="bg-blue-500/10 rounded-[32px] border border-blue-500/20 p-6 text-center">
                <h3 className="text-lg font-black text-white mb-2">Intéressé par ce bien ?</h3>
                <p className="text-sm text-blue-200 mb-4">Connectez-vous pour planifier une visite ou contacter l'agent.</p>
                <Link to="/login">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest">Se connecter</Button>
                </Link>
              </div>
            ) : null}


            {/* Trust Indicators */}
            <div className="bg-zinc-900 rounded-[32px] border border-white/10 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gold-primary rounded-full" />
                <h3 className="text-lg font-black text-white uppercase italic">Pourquoi nous faire confiance ?</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-black text-white">Transactions sécurisées</div>
                    <div className="text-sm text-zinc-400">Toutes nos transactions sont protégées</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gold-primary/10 rounded-xl flex items-center justify-center border border-gold-primary/20 flex-shrink-0">
                    <Award className="w-5 h-5 text-gold-primary" />
                  </div>
                  <div>
                    <div className="font-black text-white">Expertise reconnue</div>
                    <div className="text-sm text-zinc-400">3+ années d'expérience</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gold-primary/10 rounded-xl flex items-center justify-center border border-gold-primary/20 flex-shrink-0">
                    <Star className="w-5 h-5 text-gold-primary" />
                  </div>
                  <div>
                    <div className="font-black text-white">98% de satisfaction</div>
                    <div className="text-sm text-zinc-400">Clients satisfaits de nos services</div>
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
        size="lg"
        variant="glass"
      >
        <div className="space-y-8">
          {/* Modal Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black text-gold-primary uppercase tracking-[0.3em] mb-2">
              <Sparkles className="w-3 h-3" />
              Demande Exclusive
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">
              Demande de Renseignements <span className="text-gold-primary">Exclusive</span>
            </h2>
            <p className="text-zinc-400 font-medium max-w-md mx-auto">
              Notre équipe d'experts vous répondra sous 24h maximum.
            </p>
          </div>

          {/* Property Info Card */}
          {property && (
            <div className="bg-zinc-900/60 rounded-[32px] border border-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                {property.images?.[0] && (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                    <img 
                      src={getImageUrl(property.images[0]?.url || property.images[0])} 
                      alt={property.titre} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-gold-primary uppercase tracking-widest mb-1">
                    {property.transactionType === 'vente' ? 'En Vente' : 'En Location'} • {property.categorie}
                  </p>
                  <h3 className="text-lg font-black text-white tracking-tight mb-2 truncate">
                    {property.titre}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-400 font-medium mb-1">
                    <MapPin className="w-4 h-4 text-gold-primary" />
                    <span className="text-sm">{property.ville}</span>
                  </div>
                  <p className="text-xl font-black text-gold-primary">
                    {formatPrice(property.prix)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleContactSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-1">
                  Identité Complète
                </label>
                <input
                  type="text"
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[24px] focus:ring-2 focus:ring-gold-primary focus:border-transparent outline-none text-white font-bold placeholder-zinc-600 transition-all"
                  placeholder="Votre nom complet"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-1">
                    Email Privé
                  </label>
                  <input
                    type="email"
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[24px] focus:ring-2 focus:ring-gold-primary focus:border-transparent outline-none text-white font-bold placeholder-zinc-600 transition-all"
                    placeholder="votre@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-1">
                    Ligne Directe
                  </label>
                  <input
                    type="tel"
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[24px] focus:ring-2 focus:ring-gold-primary focus:border-transparent outline-none text-white font-bold placeholder-zinc-600 transition-all"
                    placeholder="+242 06 123 45 67"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-1">
                  Message d'Intérêt
                </label>
                <textarea
                  rows={5}
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[24px] focus:ring-2 focus:ring-gold-primary focus:border-transparent outline-none text-white font-bold placeholder-zinc-600 transition-all resize-none"
                  placeholder="Décrivez votre projet immobilier..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: Shield, label: 'Sécurisé', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { icon: Clock, label: 'Rapide', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { icon: Star, label: 'Premium', color: 'text-gold-primary', bg: 'bg-gold-primary/10', border: 'border-gold-primary/20' }
              ].map((item, i) => (
                <div key={i} className={`${item.bg} ${item.border} border rounded-2xl p-4 text-center`}>
                  <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                  <p className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                type="submit" 
                className="flex-1 bg-gold-primary text-zinc-950 hover:bg-amber-300 h-16 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-gold-primary/20 transition-all hover:-translate-y-1"
              >
                <Send className="mr-2 h-4 w-4" />
                Envoyer la Demande
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowContactModal(false)}
                className="sm:w-32 h-16 rounded-[24px] bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]"
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        size="full"
        variant="glass"
        className="!bg-transparent border-none shadow-none"
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 z-50 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full flex-1 flex items-center justify-center p-4">
            <button
              onClick={prevImage}
              className="absolute left-8 z-30 p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all hover:-translate-x-1"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-8 z-30 p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all hover:translate-x-1"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <img
              src={getImageUrl(images[selectedImageIndex]?.url)}
              alt={property.titre}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-500"
            />
          </div>

          {images.length > 1 && (
            <div className="w-full p-8 bg-zinc-950 border-t border-white/5">
              <div className="max-w-4xl mx-auto flex gap-4 overflow-x-auto pb-2 px-4 scrollbar-hide justify-center">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      'relative flex-shrink-0 w-24 h-20 rounded-2xl overflow-hidden transition-all duration-300',
                      selectedImageIndex === idx 
                        ? 'ring-4 ring-gold-primary ring-offset-4 ring-offset-zinc-950 scale-110 opacity-100 shadow-2xl' 
                        : 'opacity-40 hover:opacity-100'
                    )}
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

