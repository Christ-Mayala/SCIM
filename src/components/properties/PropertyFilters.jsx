import React, { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useProperty } from '../../contexts/PropertyContext';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const DEFAULT_FILTERS = {
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  city: '',
  bedrooms: '',
  bathrooms: '',
  transactionType: '',
  minSurface: '',
  maxSurface: '',
};

const PropertyFilters = ({ className }) => {
  const { filters, setFilters, resetFilters, fetchProperties } = useProperty();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...DEFAULT_FILTERS, ...filters });

  useEffect(() => {
    setLocalFilters((prev) => ({ ...prev, ...DEFAULT_FILTERS, ...filters }));
  }, [filters]);

  const categoryOptions = [
    { value: 'Appartement', label: 'Appartement' },
    { value: 'Maison', label: 'Maison' },
    { value: 'Terrain', label: 'Terrain' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Autre', label: 'Autre' },
  ];

  const transactionOptions = [
    { value: 'location', label: 'Location' },
    { value: 'vente', label: 'Vente' },
  ];

  const bedroomOptions = [
    { value: '1', label: '1+ chambre' },
    { value: '2', label: '2+ chambres' },
    { value: '3', label: '3+ chambres' },
    { value: '4', label: '4+ chambres' },
    { value: '5', label: '5+ chambres' },
  ];

  const bathroomOptions = [
    { value: '1', label: '1+ salle de bain' },
    { value: '2', label: '2+ salles de bain' },
    { value: '3', label: '3+ salles de bain' },
    { value: '4', label: '4+ salles de bain' },
  ];

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const nextFilters = { ...DEFAULT_FILTERS, ...localFilters };
    setFilters(nextFilters);
    fetchProperties(1, nextFilters);
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
    resetFilters();
    fetchProperties(1, DEFAULT_FILTERS);
  };

  const hasActiveFilters = Object.values(localFilters).some((value) => {
    if (typeof value === 'string') return value.trim() !== '';
    return value !== '' && value !== null && value !== undefined;
  });

  return (
    <div className={cn('bg-zinc-900/40 backdrop-blur-xl rounded-[32px] border border-white/10 p-4 sm:p-6 shadow-2xl', className)}>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher par titre, ville, adresse..."
          value={localFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-gold-primary focus:border-transparent outline-none text-white font-bold placeholder-zinc-500 transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-3 text-zinc-400 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
        >
          <div className={cn(
            "p-2 rounded-lg bg-white/5 border border-white/5 transition-all",
            isExpanded && "bg-gold-primary border-gold-primary text-zinc-950"
          )}>
            <Filter className="w-4 h-4" />
          </div>
          <span>Affiner la recherche</span>
          {hasActiveFilters && (
            <span className="bg-gold-primary text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full">
              {Object.values(localFilters).filter((v) => String(v || '').trim() !== '').length}
            </span>
          )}
        </button>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleSearch} 
            className="bg-gold-primary text-zinc-950 hover:bg-amber-300 rounded-2xl font-black uppercase tracking-widest text-[10px] px-6 py-4 shadow-xl transition-all hover:-translate-y-0.5"
          >
            Rechercher
          </Button>
          {hasActiveFilters && (
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] px-6 py-4"
            >
              <X className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-white/10 animate-fade-in mt-2">
          <Select
            label="Type de propriete"
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={categoryOptions}
            placeholder="Tous les types"
          />

          <Select
            label="Transaction"
            value={localFilters.transactionType}
            onChange={(e) => handleFilterChange('transactionType', e.target.value)}
            options={transactionOptions}
            placeholder="Vente ou location"
          />

          <Input
            label="Ville"
            value={localFilters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Entrez une ville"
          />

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Prix (CFA)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Min"
              />
              <Input
                type="number"
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Superficie (m2)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={localFilters.minSurface}
                onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                placeholder="Min"
              />
              <Input
                type="number"
                value={localFilters.maxSurface}
                onChange={(e) => handleFilterChange('maxSurface', e.target.value)}
                placeholder="Max"
              />
            </div>
          </div>

          <Select
            label="Chambres"
            value={localFilters.bedrooms}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            options={bedroomOptions}
            placeholder="Nombre de chambres"
          />

          <Select
            label="Salles de bain"
            value={localFilters.bathrooms}
            onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
            options={bathroomOptions}
            placeholder="Nombre de salles de bain"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:col-span-2 lg:col-span-1">
            <Button 
              onClick={handleSearch} 
              className="flex-1 bg-gold-primary text-zinc-950 hover:bg-amber-300 rounded-2xl font-black uppercase tracking-widest text-[10px] h-12"
            >
              Appliquer
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] h-12"
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
