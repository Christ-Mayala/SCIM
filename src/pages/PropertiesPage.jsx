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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-gray-50 py-8">
      <SEOHead 
        title={seoConfig.properties.title}
        description={seoConfig.properties.description}
        keywords={seoConfig.properties.keywords}
        image={seoConfig.properties.image}
      />
      <PropertiesListStructuredData properties={properties} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Propriétés
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez notre sélection de {pagination.total} propriétés exceptionnelles
          </p>
        </div>

        {/* Filters */}
        <PropertyFilters className="mb-8" />

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* Results Count */}
            <div className="text-gray-600">
              {loading ? (
                'Chargement...'
              ) : (
                `${pagination.total} propriété${pagination.total > 1 ? 's' : ''} trouvée${pagination.total > 1 ? 's' : ''}`
              )}
            </div>

            {/* Controls */}
            <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Sort */}
              <Select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                options={sortOptions}
                className="w-full sm:w-auto"
                leftIcon={<SortAsc className="w-4 h-4" />}
              />

              {/* View Mode */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-white text-gold-primary shadow-sm'
                      : 'text-gray-600 hover:text-gold-primary'
                  )}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'list'
                      ? 'bg-white text-gold-primary shadow-sm'
                      : 'text-gray-600 hover:text-gold-primary'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche pour voir plus de résultats.
            </p>
            <Button onClick={() => window.location.reload()}>
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <>
            <div
              className={cn(
                'grid gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              )}
            >
              {properties.map((property, index) => (
                <div
                  key={property._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PropertyCard
                    property={property}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}

        {/* Load More Button (Alternative to pagination) */}
        {!loading && properties.length > 0 && pagination.page < pagination.totalPages && (
          <div className="text-center mt-8">
            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              size="lg"
              variant="outline"
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



