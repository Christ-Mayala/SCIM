import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SortAsc, ChevronLeft, ChevronRight, Home, Building2 } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyFilters from '../components/properties/PropertyFilters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { cn } from '../lib/utils';
import SEOHead from '../components/seo/SEOHead';
import { PropertiesListStructuredData } from '../components/seo/StructuredData';
import { seoConfig } from '../utils/seoData';

const SORT_OPTIONS = [
  { value: 'date-desc',    label: 'Plus récents'      },
  { value: 'date-asc',     label: 'Plus anciens'      },
  { value: 'price-asc',    label: 'Prix croissant'    },
  { value: 'price-desc',   label: 'Prix décroissant'  },
  { value: 'rating-desc',  label: 'Mieux notés'       },
  { value: 'surface-desc', label: 'Grande surface'    },
];

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, loading, pagination, filters, fetchProperties, setFilters } = useProperty();

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy]     = useState('date-desc');
  const [initialized, setInitialized] = useState(false);
  const syncRef = useRef(false); // avoid URL loop

  // ── Init from URL params once ──
  useEffect(() => {
    if (initialized) return;
    const init = {
      search:          searchParams.get('search')          || '',
      category:        searchParams.get('category')        || '',
      minPrice:        searchParams.get('minPrice')        || '',
      maxPrice:        searchParams.get('maxPrice')        || '',
      city:            searchParams.get('city')            || '',
      bedrooms:        searchParams.get('bedrooms')        || '',
      bathrooms:       searchParams.get('bathrooms')       || '',
      transactionType: searchParams.get('transactionType') || '',
      minSurface:      searchParams.get('minSurface')      || '',
      maxSurface:      searchParams.get('maxSurface')      || '',
      sortBy:          searchParams.get('sortBy')          || 'date-desc',
    };
    const page = parseInt(searchParams.get('page') || '1', 10);
    setSortBy(init.sortBy);
    setFilters(init);
    fetchProperties(page, init);
    setInitialized(true);
  }, []); // eslint-disable-line

  // ── Sync filters → URL (after init, debounced) ──
  useEffect(() => {
    if (!initialized) return;
    if (syncRef.current) { syncRef.current = false; return; }
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    if (pagination.page > 1) params.set('page', String(pagination.page));
    setSearchParams(params, { replace: true });
  }, [filters, pagination.page, initialized]); // eslint-disable-line

  const handlePageChange = (page) => {
    syncRef.current = true;
    fetchProperties(page, filters);
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    const v = e.target.value;
    setSortBy(v);
    const next = { ...filters, sortBy: v };
    setFilters({ sortBy: v });
    fetchProperties(1, next);
  };

  // Pagination pages array
  const pages = (() => {
    const total = pagination.totalPages || 1;
    const cur   = pagination.page || 1;
    const max   = 5;
    const start = Math.max(1, cur - Math.floor(max / 2));
    const end   = Math.min(total, start + max - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <SEOHead
        title={seoConfig.properties.title}
        description={seoConfig.properties.description}
        keywords={seoConfig.properties.keywords}
        image={seoConfig.properties.image}
      />
      <PropertiesListStructuredData properties={properties} />

      {/* ── Hero banner ── */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=70"
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-primary/15 border border-gold-primary/30 text-gold-primary text-[10px] font-black uppercase tracking-widest mb-4">
            Catalogue Exclusif
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase italic mb-3">
            Propriétés <span className="text-gold-primary">d'Exception</span>
          </h1>
          <p className="text-zinc-400 font-medium max-w-2xl mx-auto">
            {loading
              ? 'Chargement du catalogue...'
              : `${pagination.total ?? 0} biens sélectionnés pour leur qualité et leur emplacement.`}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gold-primary rounded-full" />
            <div>
              <h2 className="text-base font-black text-white uppercase italic tracking-tight">
                Catalogue<span className="text-gold-primary">.</span>
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                {loading ? '…' : `${pagination.total ?? 0} bien${(pagination.total ?? 0) !== 1 ? 's' : ''} trouvé${(pagination.total ?? 0) !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/60 border border-white/8 rounded-2xl p-1.5">
            {/* Sort */}
            <div className="relative flex items-center">
              <SortAsc className="absolute left-3 h-3.5 w-3.5 text-gold-primary pointer-events-none" />
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="pl-8 pr-4 py-1.5 bg-transparent text-xs font-bold text-zinc-400 outline-none appearance-none cursor-pointer hover:text-white transition-colors"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}
              </select>
            </div>
            <div className="w-px h-5 bg-white/10" />
            {/* View toggle */}
            {[{ mode: 'grid', Icon: Grid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'p-2 rounded-xl transition-all',
                  viewMode === mode
                    ? 'bg-gold-primary text-black shadow-sm shadow-gold-primary/30'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5',
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Grid / List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-zinc-500 font-bold text-sm animate-pulse">Chargement des propriétés...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-24 text-center bg-zinc-900/40 rounded-3xl border border-white/5">
            <div className="h-20 w-20 rounded-3xl bg-zinc-800/60 flex items-center justify-center text-zinc-600 mx-auto mb-5">
              <Building2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic mb-2">Aucun bien trouvé</h3>
            <p className="text-zinc-500 text-sm font-medium mb-6 max-w-xs mx-auto">
              Aucun bien ne correspond à vos critères actuels.
            </p>
            <button
              onClick={() => { setFilters({}); fetchProperties(1, {}); }}
              className="px-8 h-11 rounded-2xl bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div
            className={cn(
              'grid gap-6',
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1',
            )}
          >
            {properties.map((property, i) => (
              <div
                key={property._id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${Math.min(i * 60, 300)}ms` }}
              >
                <PropertyCard
                  property={property}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            <button
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="h-10 w-10 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pages[0] > 1 && (
              <>
                <button onClick={() => handlePageChange(1)}
                  className="h-10 w-10 rounded-xl border border-white/10 bg-zinc-900/60 text-xs font-black text-zinc-400 hover:text-white transition-all">
                  1
                </button>
                {pages[0] > 2 && <span className="text-zinc-600 font-black">…</span>}
              </>
            )}

            {pages.map(p => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={cn(
                  'h-10 w-10 rounded-xl border text-xs font-black transition-all',
                  p === pagination.page
                    ? 'bg-gold-primary text-black border-gold-primary shadow-lg shadow-gold-primary/20'
                    : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white',
                )}
              >
                {p}
              </button>
            ))}

            {pages[pages.length - 1] < pagination.totalPages && (
              <>
                {pages[pages.length - 1] < pagination.totalPages - 1 && (
                  <span className="text-zinc-600 font-black">…</span>
                )}
                <button onClick={() => handlePageChange(pagination.totalPages)}
                  className="h-10 w-10 rounded-xl border border-white/10 bg-zinc-900/60 text-xs font-black text-zinc-400 hover:text-white transition-all">
                  {pagination.totalPages}
                </button>
              </>
            )}

            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="h-10 w-10 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
