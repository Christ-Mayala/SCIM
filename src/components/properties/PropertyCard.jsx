import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Square, Star, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProperty } from '../../contexts/PropertyContext';
import { formatPrice, getImageUrl, getPropertyTypeIcon } from '../../lib/utils';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, className, onFavoriteChange }) => {
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, favorites } = useProperty();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isFav = favorites.includes(property._id);
  const isListView = className?.includes('flex-row');
  const mainImage = property.images?.[0]?.url || property.images?.[0] || null;

  const handleFav = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { toast.error('Connectez-vous pour sauvegarder'); return; }
    const result = await toggleFavorite(property._id);
    if (result?.success && typeof onFavoriteChange === 'function')
      onFavoriteChange(property._id, result.isFavorite);
  };

  const rememberScroll = () => {
    try { sessionStorage.setItem('propertiesScrollY', String(window.scrollY || 0)); } catch (_) {}
  };

  const transactionLabel = property.transactionType === 'vente' ? 'Vente' : 'Location';
  const transactionColor = property.transactionType === 'vente'
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

  return (
    <Link
      to={`/properties/${property._id}`}
      onClick={rememberScroll}
      className={cn(
        'group block bg-zinc-900 rounded-3xl overflow-hidden border border-white/5',
        'hover:border-gold-primary/25 hover:shadow-2xl hover:shadow-gold-primary/5',
        'transition-all duration-500 hover:-translate-y-1',
        isListView ? 'flex flex-col sm:flex-row' : 'flex flex-col',
        className,
      )}
    >
      {/* ── Image ── */}
      <div className={cn(
        'relative overflow-hidden shrink-0',
        isListView ? 'w-full sm:w-72 h-56 sm:h-auto' : 'w-full aspect-[4/3]',
      )}>
        {!imgLoaded && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
        )}
        <img
          src={imgError || !mainImage ? '/images/scim-logo.jpg' : getImageUrl(mainImage)}
          alt={property.titre}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          className={cn(
            'w-full h-full object-cover transition-all duration-700 group-hover:scale-105',
            !imgLoaded && 'opacity-0',
          )}
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          <div className="flex flex-col gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-sm text-[9px] font-black text-gold-primary uppercase tracking-widest border border-white/10">
              {property.categorie}
            </span>
            <span className={cn('px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border backdrop-blur-sm', transactionColor)}>
              {transactionLabel}
            </span>
            {property.isBonPlan && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                <Zap className="h-2.5 w-2.5" />
                {property.bonPlanLabel || 'Bon Plan'}
              </span>
            )}
          </div>
          {isAuthenticated && (
            <button
              onClick={handleFav}
              aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={cn(
                'h-9 w-9 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all border',
                isFav
                  ? 'bg-red-500 border-red-400/50 text-white scale-110'
                  : 'bg-zinc-950/60 border-white/10 text-white/60 hover:text-red-400 hover:border-red-500/30',
              )}
            >
              <Heart className={cn('w-4 h-4', isFav && 'fill-current')} />
            </button>
          )}
        </div>

        {/* Price bottom left */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="text-xl font-black text-white drop-shadow-lg leading-none">
            {formatPrice(property.prix)}
          </div>
          {property.prixOriginal && property.prixOriginal > property.prix && (
            <div className="text-xs text-zinc-400 line-through leading-none mt-0.5">
              {formatPrice(property.prixOriginal)}
            </div>
          )}
        </div>

        {/* Rating bottom right */}
        {property.noteMoyenne > 0 && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-sm border border-white/10">
            <Star className="h-3 w-3 text-gold-primary fill-current" />
            <span className="text-[10px] font-black text-white">{property.noteMoyenne.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className={cn('flex flex-col p-5', isListView ? 'flex-1' : '')}>
        {/* Location */}
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold mb-2">
          <MapPin className="h-3 w-3 text-gold-primary shrink-0" />
          <span className="truncate">{[property.adresse, property.ville].filter(Boolean).join(', ') || '—'}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-black text-white tracking-tight uppercase italic leading-tight line-clamp-2 mb-3 group-hover:text-gold-primary transition-colors">
          {property.titre}
        </h3>

        {/* Description */}
        {property.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4 font-medium">
            {property.description}
          </p>
        )}

        {/* Features */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/5 flex-wrap">
          {property.nombre_chambres > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <Bed className="h-3 w-3 text-zinc-600" />
              {property.nombre_chambres} ch.
            </span>
          )}
          {property.nombre_salles_bain > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <Bath className="h-3 w-3 text-zinc-600" />
              {property.nombre_salles_bain} sdb.
            </span>
          )}
          {property.superficie > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <Square className="h-3 w-3 text-zinc-600" />
              {property.superficie} m²
            </span>
          )}
          {/* Extra amenities as dots */}
          {[property.piscine && 'Piscine', property.jardin && 'Jardin', property.garage && 'Garage']
            .filter(Boolean)
            .slice(0, 2)
            .map(a => (
              <span key={a} className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                · {a}
              </span>
            ))
          }
        </div>

        {/* CTA */}
        <div className="mt-4">
          <div className="w-full h-10 rounded-xl bg-zinc-950/60 border border-white/5 group-hover:border-gold-primary/30 group-hover:bg-gold-primary/5 flex items-center justify-center transition-all">
            <span className="text-[10px] font-black text-zinc-400 group-hover:text-gold-primary uppercase tracking-widest transition-colors">
              Voir les détails →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
