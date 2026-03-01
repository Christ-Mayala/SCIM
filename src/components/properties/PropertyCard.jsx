import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProperty } from '../../contexts/PropertyContext';
import { formatPrice, getImageUrl, getPropertyTypeIcon } from '../../lib/utils';
import {Button} from '../ui/Button';
import { cn } from '../../lib/utils';
import StarRating from '../common/StarRating';

const PropertyCard = ({ property, className, onFavoriteChange }) => {
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, favorites } = useProperty();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const isFavorite = favorites.includes(property._id);
  const mainImage = property.images?.[0]?.url || '/images/og/og-property.jpg';

  const isListView = className?.includes('flex-row');

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
      'property-card group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden', 
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
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
              <span className="sr-only">Chargement...</span>
            </div>
          )}
          <img
            src={imageError ? '/images/og/og-property.jpg' : getImageUrl(mainImage)}
            alt={property.titre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 inline-flex items-center gap-1.5 shadow-sm border border-white/20">
              {(() => {
                const Icon = getPropertyTypeIcon(property.categorie);
                return <Icon className="w-3.5 h-3.5 text-gold-primary" />;
              })()}
              <span className="uppercase tracking-wide text-[10px]">{property.categorie}</span>
            </div>

            {isAuthenticated && (
              <button
                onClick={handleFavoriteClick}
                className={cn(
                  'p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm',
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                )}
                aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
              </button>
            )}
        </div>

        {/* Price Tag Overlay (Bottom Left) - Only for Grid or Mobile List */}
        <div className="absolute bottom-4 left-4 z-20">
             <div className="text-white font-bold text-xl sm:text-2xl drop-shadow-md">
                {formatPrice(property.prix)}
             </div>
             <div className="flex items-center gap-1 text-white/90 text-xs sm:text-sm font-medium drop-shadow-md">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{property.ville}</span>
             </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
          "flex flex-col justify-between p-5 sm:p-6",
          isListView ? "flex-1" : "flex-1"
      )}>
        <div>
            <div className="flex justify-between items-start mb-2">
                 <Link to={`/properties/${property._id}`} onClick={rememberScroll} className="group-hover:text-gold-primary transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 leading-tight mb-1">
                        {property.titre}
                    </h3>
                 </Link>
            </div>

            <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {property.description}
            </p>

            {/* Rating - moved below description */}
            {property.noteMoyenne > 0 && (
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                        <StarRating value={property.noteMoyenne} readOnly count={5} className="text-xs" />
                        <span className="text-sm font-bold text-gray-700">{property.noteMoyenne.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-500">{property.nombreAvis || 0} avis</span>
                </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
            {property.nombre_chambres > 0 && (
                <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <Bed className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">{property.nombre_chambres} <span className="font-normal text-gray-400 hidden sm:inline">Ch.</span></span>
                </div>
            )}
            {property.nombre_salles_bain > 0 && (
                <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <Bath className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">{property.nombre_salles_bain} <span className="font-normal text-gray-400 hidden sm:inline">Sdb.</span></span>
                </div>
            )}
            {property.superficie > 0 && (
                <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <Square className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">{property.superficie} <span className="font-normal text-gray-400">m²</span></span>
                </div>
            )}
            </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4 mt-auto">
            <Link to={`/properties/${property._id}`} onClick={rememberScroll} className="w-full">
                <Button className="w-full bg-gray-900 hover:bg-black text-white rounded-lg py-2.5 shadow-sm hover:shadow-md transition-all">
                    Voir détails
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

