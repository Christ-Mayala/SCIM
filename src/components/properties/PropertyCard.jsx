import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Square, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProperty } from '../../contexts/PropertyContext';
import { formatPrice, getImageUrl, getPropertyTypeIcon } from '../../lib/utils';
import {Button} from '../ui/Button';
import { cn } from '../../lib/utils';
import StarRating from '../common/StarRating';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, className, onFavoriteChange }) => {
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, favorites, rateProperty } = useProperty();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  const isFavorite = favorites.includes(property._id);
  const mainImage = property.images?.[0]?.url || '/images/og/og-property.jpg';
  const isListView = className?.includes('flex-row');

  const handleCardRating = async (rating) => {
    if (!isAuthenticated || ratingLoading) return;
    setRatingLoading(true);
    setUserRating(rating);
    try {
      await rateProperty(property._id, rating);
      toast.success(`✓ Note ${rating}/5 enregistrée`);
    } catch {
      setUserRating(0);
    } finally {
      setRatingLoading(false);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    const result = await toggleFavorite(property._id);
    if (result?.success && typeof onFavoriteChange === 'function') {
      onFavoriteChange(property._id, result.isFavorite);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  const rememberScroll = (e) => {
    try {
      sessionStorage.setItem('propertiesScrollY', String(window.scrollY || 0));
    } catch (_) {}
  };

  return (
    <div className={cn(
      'property-card group bg-zinc-900/90 rounded-[32px] shadow-2xl hover:shadow-gold-primary/5 transition-all duration-500 border border-white/10 overflow-hidden', 
      isListView ? 'flex flex-col sm:flex-row' : 'flex flex-col',
      className
    )}>
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden shrink-0",
        isListView ? "w-full sm:w-72 h-64 sm:h-auto" : "w-full aspect-[4/3]"
      )}>
        <Link to={`/properties/${property._id}`} onClick={rememberScroll} className="block w-full h-full">
          {isImageLoading && (
            <div className="absolute inset-0 bg-zinc-800 animate-pulse flex items-center justify-center z-10">
              <span className="sr-only">Chargement...</span>
            </div>
          )}
          <img
            src={imageError ? '/images/og/og-property.jpg' : getImageUrl(mainImage)}
            alt={property.titre}
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 will-change-transform"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80" />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
            <div className="bg-zinc-950/80 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black text-gold-primary inline-flex items-center gap-2 shadow-xl border border-white/10 uppercase tracking-widest">
              {(() => {
                const Icon = getPropertyTypeIcon(property.categorie);
                return <Icon className="w-3.5 h-3.5" />;
              })()}
              <span>{property.categorie}</span>
            </div>

            {isAuthenticated && (
              <button
                onClick={handleFavoriteClick}
                className={cn(
                  'p-2.5 rounded-full backdrop-blur-xl transition-all duration-500 shadow-xl border border-white/10',
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600 scale-110 border-red-400/50'
                    : 'bg-zinc-950/60 text-white/60 hover:text-red-500 hover:scale-110'
                )}
                aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
              </button>
            )}
        </div>

        {/* Price Tag Overlay (Bottom Left) */}
        <div className="absolute bottom-5 left-5 z-20">
             <div className="text-white font-black text-2xl sm:text-3xl tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                {formatPrice(property.prix)}
             </div>
             <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-bold uppercase tracking-wider drop-shadow-md">
                <MapPin className="w-3.5 h-3.5 text-gold-primary" />
                <span className="truncate max-w-[200px]">{property.ville}</span>
             </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
          "flex flex-col justify-between p-6 sm:p-8",
          isListView ? "flex-1" : "flex-1"
      )}>
        <div className="space-y-4">
            <div className="flex justify-between items-start">
                 <Link to={`/properties/${property._id}`} onClick={rememberScroll} className="group-hover:text-gold-primary transition-colors">
                    <h3 className="text-xl font-black text-white line-clamp-1 leading-none mb-1 tracking-tight italic uppercase">
                        {property.titre}
                    </h3>
                 </Link>
            </div>

            <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed font-medium opacity-80">
            {property.description}
            </p>

            {/* Rating */}
            <div className="space-y-2">
              {property.noteMoyenne > 0 && (
                <div className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <StarRating value={property.noteMoyenne} showNumber={false} />
                    <span className="text-xs font-black text-gold-primary">{property.noteMoyenne.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{property.nombreAvis || 0} avis</span>
                </div>
              )}
              {isAuthenticated && (
                <div className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-gold-primary/20 transition-colors">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{userRating > 0 ? `Ma note : ${userRating}/5` : 'Votre avis'}</span>
                  <StarRating 
                    value={userRating} 
                    interactive 
                    showNumber={false} 
                    onRate={handleCardRating}
                    disabled={ratingLoading}
                    className="scale-90"
                  />
                </div>
              )}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-3">
            {property.nombre_chambres > 0 && (
                <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-gold-primary/20 transition-all group/feat">
                    <Bed className="w-4 h-4 text-zinc-500 mb-1 group-hover/feat:text-gold-primary transition-colors" />
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">{property.nombre_chambres} Ch.</span>
                </div>
            )}
            {property.nombre_salles_bain > 0 && (
                <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-gold-primary/20 transition-all group/feat">
                    <Bath className="w-4 h-4 text-zinc-500 mb-1 group-hover/feat:text-gold-primary transition-colors" />
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">{property.nombre_salles_bain} Sdb.</span>
                </div>
            )}
            {property.superficie > 0 && (
                <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-gold-primary/20 transition-all group/feat">
                    <Square className="w-4 h-4 text-zinc-500 mb-1 group-hover/feat:text-gold-primary transition-colors" />
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">{property.superficie} m²</span>
                </div>
            )}
            </div>
        </div>

        {/* Actions */}
        <div className="pt-8 flex items-center justify-between gap-4 mt-auto">
            <Link to={`/properties/${property._id}`} onClick={rememberScroll} className="w-full">
                <Button className="w-full bg-zinc-950 hover:bg-black text-white border border-white/10 rounded-2xl py-6 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:-translate-y-1 transition-all">
                    Voir détails
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

