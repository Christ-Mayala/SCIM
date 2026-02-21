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
    <div className={cn('bg-white rounded-xl shadow-lg p-4 sm:p-6', className)}>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher par titre, ville, adresse..."
          value={localFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gold-primary transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filtres avances</span>
          {hasActiveFilters && (
            <span className="bg-gold-primary text-zinc-900 text-xs px-2 py-1 rounded-full">
              {Object.values(localFilters).filter((v) => String(v || '').trim() !== '').length}
            </span>
          )}
        </button>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleSearch} size="sm">
            Rechercher
          </Button>
          {hasActiveFilters && (
            <Button onClick={handleReset} variant="outline" size="sm">
              <X className="w-4 h-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 animate-fade-in">
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
            <label className="block text-sm font-medium text-gray-700">Prix (CFA)</label>
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
            <label className="block text-sm font-medium text-gray-700">Superficie (m2)</label>
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
            <Button onClick={handleSearch} className="flex-1">
              Appliquer
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reinitialiser
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
