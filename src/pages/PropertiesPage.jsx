import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SortAsc, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyFilters from '../components/properties/PropertyFilters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {Button} from '../components/ui/Button';
import {Select} from '../components/ui/Select';
import { cn } from '../lib/utils';
import SEOHead from '../components/seo/SEOHead';
import { PropertiesListStructuredData } from '../components/seo/StructuredData';
import { seoConfig } from '../utils/seoData';
import PageHero from '../components/layout/PageHero';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    properties, 
    loading, 
    pagination, 
    filters,
    fetchProperties, 
    setFilters 
  } = useProperty();
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date-desc');
  const [restored, setRestored] = useState(false);

  const sortOptions = [
    { value: 'date-desc', label: 'Plus récent' },
    { value: 'date-asc', label: 'Plus ancien' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating-desc', label: 'Mieux notés' },
    { value: 'surface-desc', label: 'Plus grande surface' },
  ];

  useEffect(() => {
    const initialFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      city: searchParams.get('city') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      transactionType: searchParams.get('transactionType') || '',
      minSurface: searchParams.get('minSurface') || '',
      maxSurface: searchParams.get('maxSurface') || '',
      sortBy: searchParams.get('sortBy') || 'date-desc',
    };

    const pageParam = parseInt(searchParams.get('page') || '1', 10);

    setSortBy(initialFilters.sortBy);
    setFilters(initialFilters);
    fetchProperties(pageParam, initialFilters);
    setRestored(true);
  }, [searchParams, setFilters, fetchProperties]);

  useEffect(() => {
    if (!restored) return;

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', String(pagination.page || 1));

    const next = params.toString();
    const current = searchParams.toString();

    if (next !== current) {
      setSearchParams(params, { replace: true });
    }
  }, [filters, pagination.page, restored, searchParams, setSearchParams]);

  const handlePageChange = (page) => {
    fetchProperties(page, filters);
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const nextFilters = { ...filters, sortBy: newSortBy };
    setFilters({ sortBy: newSortBy });
    fetchProperties(1, nextFilters);
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pages.map(page => (
          <Button
            key={page}
            variant={page === pagination.page ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(page)}
            className="min-w-[40px]"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  // Restore scroll position after data loads
  useEffect(() => {
    if (loading) return;
    if (restored) return;
    const y = parseInt(sessionStorage.getItem('propertiesScrollY') || 'NaN', 10);
    if (!Number.isNaN(y)) {
      window.scrollTo(0, y);
      sessionStorage.removeItem('propertiesScrollY');
      setRestored(true);
    }
  }, [loading, properties.length, restored]);

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-gold-primary/30 pb-20">
      <SEOHead 
        title={seoConfig.properties.title}
        description={seoConfig.properties.description}
        keywords={seoConfig.properties.keywords}
        image={seoConfig.properties.image}
      />
      <PropertiesListStructuredData properties={properties} />

      <PageHero
        badgeText="Catalogue Exclusif"
        title={
          <>
            Découvrez nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-200">Propriétés d'Exception</span>
          </>
        }
        description={`Explorez notre sélection de ${pagination.total} biens immobiliers rigoureusement sélectionnés pour leur qualité et leur emplacement.`}
        backgroundImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        className="mb-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {/* Filters Section with glassmorphism */}
        <div className="bg-zinc-900/60 rounded-[32px] shadow-2xl border border-white/10 p-6 mb-12">
          <PropertyFilters />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
             <div className="h-10 w-1 bg-gold-primary rounded-full" />
             <div>
                <h2 className="text-xl font-black text-white tracking-tight italic uppercase">Liste des Biens<span className="text-gold-primary">.</span></h2>
                <p className="text-sm text-zinc-500 font-medium">
                  {loading ? 'Chargement...' : `${pagination.total} propriétés trouvées`}
                </p>
             </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/80 p-2 rounded-2xl border border-white/10 shadow-sm">
            {/* Sort */}
            <Select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              options={sortOptions}
              className="border-none bg-transparent focus:ring-0 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
              leftIcon={<SortAsc className="w-4 h-4 text-gold-primary" />}
            />

            <div className="w-px h-6 bg-white/10 mx-2" />

            {/* View Mode */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-300',
                  viewMode === 'grid'
                    ? 'bg-gold-primary text-black shadow-lg shadow-gold-primary/20'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-300',
                  viewMode === 'list'
                    ? 'bg-gold-primary text-black shadow-lg shadow-gold-primary/20'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <LoadingSpinner size="lg" />
            <p className="text-zinc-400 font-medium animate-pulse">Recherche des meilleures opportunités...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-20 text-center bg-zinc-900/60 rounded-3xl border border-white/10 shadow-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-2xl mb-6 text-gold-primary">
               <Home className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase italic">
              Aucune propriété trouvée
            </h3>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto font-medium text-sm">
              Nous n'avons pas trouvé de biens correspondant à vos critères actuels.
            </p>
            <Button 
               onClick={() => window.location.reload()}
               className="bg-zinc-950 text-white hover:bg-black px-10 py-6 rounded-2xl font-black uppercase tracking-widest"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            <div
              className={cn(
                'grid gap-8',
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              )}
            >
              {properties.map((property, index) => (
                <div
                  key={property._id}
                  className="animate-in fade-in slide-in-from-bottom-5 duration-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PropertyCard
                    property={property}
                    className={cn(
                      "group border-none bg-transparent shadow-none",
                      viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pt-10 border-t border-zinc-100">
               {renderPagination()}
            </div>
          </div>
        )}

        {/* Load More Button (Alternative to pagination) */}
        {!loading && properties.length > 0 && pagination.page < pagination.totalPages && (
          <div className="text-center mt-12">
            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              size="lg"
              className="bg-white border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white px-12 py-7 rounded-2xl font-black uppercase tracking-widest transition-all"
            >
              Charger plus de propriétés
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;



