import React, { useEffect, useMemo, useState } from 'react';
import { Heart, Grid, List } from 'lucide-react';
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
      setError(e?.response?.data?.message || e?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const count = useMemo(() => items.length, [items]);

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-semibold text-zinc-900">Mes favoris</h1>
          </div>
          <p className="text-zinc-600">Retrouvez toutes les annonces que vous avez ajoutées en favoris.</p>
        </div>

        {count > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-4 mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-zinc-700">{count} annonce{count > 1 ? 's' : ''} en favoris</div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={load}>Rafraîchir</Button>

                <div className="flex items-center space-x-1 bg-zinc-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      viewMode === 'grid' ? 'bg-white text-gold-primary shadow-sm' : 'text-zinc-700 hover:text-zinc-900',
                    )}
                    aria-label="Vue grille"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      viewMode === 'list' ? 'bg-white text-gold-primary shadow-sm' : 'text-zinc-700 hover:text-zinc-900',
                    )}
                    aria-label="Vue liste"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-6 ring-1 ring-red-500/20 text-sm text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-24 h-24 text-zinc-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-zinc-900 mb-4">Aucun favori</h3>
            <p className="text-zinc-600 mb-8 max-w-md mx-auto">
              Explorez les annonces et ajoutez celles qui vous intéressent à vos favoris.
            </p>
            <Button onClick={() => (window.location.href = '/properties')}>Découvrir les annonces</Button>
          </div>
        ) : (
          <div
            className={cn(
              'grid gap-6',
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
            )}
          >
            {items.map((property, index) => (
              <div
                key={property._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <PropertyCard
                  property={property}
                  className={viewMode === 'list' ? 'flex flex-row' : ''}
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
