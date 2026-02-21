import React, { useState, useEffect } from 'react';
import { Search, Filter, X, MapPin, Home, DollarSign, Calendar } from 'lucide-react';
import { debounce } from '../../utils/performance';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const SearchFilters = ({ 
  onFiltersChange,
  initialFilters = {},
  className = '' 
}) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    statut: '',
    ville: '',
    prixMin: '',
    prixMax: '',
    nombreChambres: '',
    nombreSallesBain: '',
    superficieMin: '',
    superficieMax: '',
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Types de propriétés
  const propertyTypes = [
    { value: '', label: 'Tous les types' },
    { value: 'maison', label: 'Maison' },
    { value: 'appartement', label: 'Appartement' },
    { value: 'terrain', label: 'Terrain' },
    { value: 'bureau', label: 'Bureau' },
    { value: 'commerce', label: 'Commerce' }
  ];

  // Statuts
  const statusOptions = [
    { value: '', label: 'Vente et Location' },
    { value: 'vente', label: 'À vendre' },
    { value: 'location', label: 'À louer' }
  ];

  // Villes principales du Congo-Brazzaville
  const cities = [
    { value: '', label: 'Toutes les villes' },
    { value: 'Brazzaville', label: 'Brazzaville' },
    { value: 'Pointe-Noire', label: 'Pointe-Noire' },
    { value: 'Dolisie', label: 'Dolisie' },
    { value: 'Nkayi', label: 'Nkayi' },
    { value: 'Ouesso', label: 'Ouesso' },
    { value: 'Madingou', label: 'Madingou' },
    { value: 'Owando', label: 'Owando' },
    { value: 'Sibiti', label: 'Sibiti' }
  ];

  // Nombres de chambres
  const roomOptions = [
    { value: '', label: 'Indifférent' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  // Debounce pour la recherche textuelle
  const debouncedSearch = debounce((searchValue) => {
    const newFilters = { ...filters, search: searchValue };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, 300);

  // Gérer les changements de filtres
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Gérer la recherche textuelle
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    debouncedSearch(value);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    const resetFilters = {
      search: '',
      type: '',
      statut: '',
      ville: '',
      prixMin: '',
      prixMax: '',
      nombreChambres: '',
      nombreSallesBain: '',
      superficieMin: '',
      superficieMax: ''
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  // Compter les filtres actifs
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== null && value !== undefined
  ).length;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Barre de recherche principale */}
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Rechercher par titre, adresse, quartier..."
          value={filters.search}
          onChange={handleSearchChange}
          leftIcon={<Search className="w-5 h-5" />}
          className="py-3"
        />
      </div>

      {/* Filtres rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Select
            label="Type de bien"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            options={propertyTypes}
            leftIcon={<Home className="w-4 h-4" />}
          />
        </div>

        <div>
          <Select
            label="Statut"
            value={filters.statut}
            onChange={(e) => handleFilterChange('statut', e.target.value)}
            options={statusOptions}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
        </div>

        <div>
          <Select
            label="Ville"
            value={filters.ville}
            onChange={(e) => handleFilterChange('ville', e.target.value)}
            options={cities}
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Bouton pour afficher/masquer les filtres avancés */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-gold-primary hover:text-gold-dark transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">
            Filtres avancés {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="text-sm">Réinitialiser</span>
          </button>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Prix (CFA)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Prix minimum"
                value={filters.prixMin}
                onChange={(e) => handleFilterChange('prixMin', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Prix maximum"
                value={filters.prixMax}
                onChange={(e) => handleFilterChange('prixMax', e.target.value)}
              />
            </div>
          </div>

          {/* Chambres et salles de bain */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Chambres"
                value={filters.nombreChambres}
                onChange={(e) => handleFilterChange('nombreChambres', e.target.value)}
                options={roomOptions}
              />
            </div>

            <div>
              <Select
                label="Salles de bain"
                value={filters.nombreSallesBain}
                onChange={(e) => handleFilterChange('nombreSallesBain', e.target.value)}
                options={roomOptions}
              />
            </div>
          </div>

          {/* Superficie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Superficie (m²)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Superficie minimum"
                value={filters.superficieMin}
                onChange={(e) => handleFilterChange('superficieMin', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Superficie maximum"
                value={filters.superficieMax}
                onChange={(e) => handleFilterChange('superficieMax', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;

