import React, { useEffect, useMemo, useState } from 'react';
import { Heart, Grid, List, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/properties/PropertyCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { favoritesAPI } from '../lib/api';

const FavoritesPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await favoritesAPI.getAll();
      const list = Array.isArray(res.data) ? res.data : [];
      setItems(list);
    } catch (e) {
      setItems([]);
      setError(e?.response?.data?.message || e?.message || 'Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const count = useMemo(() => items.length, [items]);

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Ambient BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500 mb-6">
            <Heart className="h-3 w-3 fill-current" />
            Coups de cœur
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight italic uppercase mb-4">
            Vos biens <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-gold-dark">Favoris</span>
          </h1>
          <p className="text-zinc-400 font-medium text-lg max-w-2xl">
            Retrouvez ici toute votre sélection d'immobilier de prestige au Congo-Brazzaville.
          </p>
        </div>

        {count > 0 ? (
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-5 mb-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-white font-black uppercase tracking-widest text-sm">
                {count} {count > 1 ? 'biens sauvegardés' : 'bien sauvegardé'}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={load}
                className="w-full sm:w-auto bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Actualiser
              </Button>

              <div className="flex items-center bg-zinc-950 rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2.5 rounded-lg transition-all',
                    viewMode === 'grid' 
                      ? 'bg-gold-primary text-zinc-950 shadow-[0_0_15px_rgba(201,162,39,0.3)]' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  )}
                  aria-label="Vue grille"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2.5 rounded-lg transition-all',
                    viewMode === 'list' 
                      ? 'bg-gold-primary text-zinc-950 shadow-[0_0_15px_rgba(201,162,39,0.3)]' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  )}
                  aria-label="Vue liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-bold">{error}</p>
            <Button onClick={load} className="mt-4 bg-red-500/20 text-red-400 hover:bg-red-500/30">Réessayer</Button>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 group hover:scale-110 transition-transform cursor-pointer border border-red-500/20">
              <Heart className="w-10 h-10 text-red-500 fill-current opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight mb-4">
              Aucun coup de cœur
            </h3>
            <p className="text-zinc-400 font-medium mb-10 max-w-md">
              Vous n'avez pas encore de biens dans vos favoris. Parcourez notre catalogue exclusif et ajoutez ceux qui attirent votre attention.
            </p>
            <Link to="/properties">
              <Button className="h-14 px-8 bg-gold-primary hover:bg-amber-300 text-zinc-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(201,162,39,0.2)] hover:shadow-[0_25px_50px_rgba(201,162,39,0.3)] transition-all hover:-translate-y-1">
                <Search className="w-4 h-4 mr-2" />
                Explorer la collection
              </Button>
            </Link>
          </div>
        ) : (
          <div
            className={cn(
              'grid gap-8',
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-5xl mx-auto'
            )}
          >
            {items.map((property, index) => (
              <div
                key={property._id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PropertyCard
                  property={property}
                  className={viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}
                  onFavoriteChange={(id, isFav) => {
                    if (!isFav) {
                      setItems((prev) => prev.filter((p) => p._id !== id));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
