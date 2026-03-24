import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import toast from 'react-hot-toast';
import { favoritesAPI, propertyAPI } from '../lib/api';
import { useAuth } from './AuthContext';

const PropertyContext = createContext();

const initialState = {
  properties: [],
  currentProperty: null,
  favorites: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  filters: {
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
    sortBy: 'date-desc',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PROPERTIES':
      return {
        ...state,
        properties: action.payload.properties,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      };
    case 'SET_CURRENT_PROPERTY':
      return { ...state, currentProperty: action.payload, loading: false };
    case 'ADD_PROPERTY':
      return { ...state, properties: [action.payload, ...state.properties], loading: false };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map((p) => (p._id === action.payload._id ? action.payload : p)),
        currentProperty: state.currentProperty?._id === action.payload._id ? action.payload : state.currentProperty,
        loading: false,
      };
    case 'DELETE_PROPERTY':
      return { ...state, properties: state.properties.filter((p) => p._id !== action.payload), loading: false };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const toApiFilters = (filters = {}) => {
  const apiFilters = {};

  if (filters?.search) apiFilters.search = filters.search;
  if (filters?.city) apiFilters.ville = filters.city;
  if (filters?.category) apiFilters.categorie = filters.category;
  if (filters?.minPrice) apiFilters.prixMin = filters.minPrice;
  if (filters?.maxPrice) apiFilters.prixMax = filters.maxPrice;

  if (filters?.transactionType) apiFilters.transactionType = filters.transactionType;
  if (filters?.isBonPlan !== undefined && filters?.isBonPlan !== '') apiFilters.isBonPlan = filters.isBonPlan;

  if (filters?.bedrooms) apiFilters.nombre_chambres = filters.bedrooms;
  if (filters?.bathrooms) apiFilters.nombre_salles_bain = filters.bathrooms;

  if (filters?.minSurface) apiFilters.superficieMin = filters.minSurface;
  if (filters?.maxSurface) apiFilters.superficieMax = filters.maxSurface;
  if (filters?.sortBy) apiFilters.sortBy = filters.sortBy;

  if (filters?.limit) apiFilters.limit = filters.limit;

  return apiFilters;
};

export const PropertyProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const favoritesRef = useRef(state.favorites);
  useEffect(() => {
    favoritesRef.current = state.favorites;
  }, [state.favorites]);

  const fetchProperties = useCallback(
    async (page = 1, filters = {}) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const apiFilters = toApiFilters(filters);
        const response = await propertyAPI.getAll({ page, ...apiFilters });
        const data = response.data || {};

        dispatch({
          type: 'SET_PROPERTIES',
          payload: {
            properties: Array.isArray(data.properties) ? data.properties : [],
            pagination: {
              page: data.page || page || 1,
              limit: data.limit || apiFilters.limit || state.pagination.limit,
              total: data.total || 0,
              totalPages: data.totalPages || 1,
            },
          },
        });
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Erreur lors du chargement des propriétés';
        dispatch({ type: 'SET_ERROR', payload: message });
        toast.error(message);
      }
    },
    [state.pagination.limit],
  );

  const fetchPropertyById = useCallback(async (id) => {
    if (!id) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await propertyAPI.getById(id);
      dispatch({ type: 'SET_CURRENT_PROPERTY', payload: response.data });
    } catch (error) {
      const message = error.response?.data?.message || 'Propriété introuvable';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  }, []);

  const createProperty = useCallback(async (propertyData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const data = new FormData();
      const { images, ...rest } = propertyData;

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          data.append(key, value);
        }
      });

      if (Array.isArray(images)) {
        images.forEach((imgFile) => {
          if (imgFile) {
            data.append('images', imgFile);
          }
        });
      }

      const response = await propertyAPI.create(data);
      dispatch({ type: 'ADD_PROPERTY', payload: response.data });
      toast.success('Annonce créée avec succès !');
      return { success: true, property: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const updateProperty = useCallback(async (id, propertyData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const data = new FormData();
      const { images, ...rest } = propertyData;

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          data.append(key, value);
        }
      });

      if (Array.isArray(images)) {
        images.forEach((imgFile) => {
          if (imgFile) {
            data.append('images', imgFile);
          }
        });
      }

      const response = await propertyAPI.update(id, data);
      dispatch({ type: 'UPDATE_PROPERTY', payload: response.data });
      toast.success('Annonce mise à jour avec succès !');
      return { success: true, property: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const deleteProperty = useCallback(async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await propertyAPI.delete(id);
      dispatch({ type: 'DELETE_PROPERTY', payload: id });
      toast.success('Annonce supprimée');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'SET_FAVORITES', payload: [] });
      return [];
    }

    try {
      const res = await favoritesAPI.getAll();
      const list = Array.isArray(res.data) ? res.data : [];
      const ids = list.map((p) => p?._id).filter(Boolean);
      dispatch({ type: 'SET_FAVORITES', payload: ids });
      return ids;
    } catch (error) {
      dispatch({ type: 'SET_FAVORITES', payload: [] });
      return [];
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites, user?._id]);

  const toggleFavorite = useCallback(
    async (propertyId) => {
      if (!isAuthenticated) {
        toast.error('Connectez-vous pour ajouter aux favoris');
        return { success: false };
      }

      const previous = favoritesRef.current || [];
      const isFavorite = previous.includes(propertyId);

      dispatch({
        type: 'SET_FAVORITES',
        payload: isFavorite ? previous.filter((id) => id !== propertyId) : [...previous, propertyId],
      });

      try {
        const response = await propertyAPI.toggleFavorite(propertyId);
        const favoris = Array.isArray(response.data?.favoris) ? response.data.favoris.map(String) : null;
        if (favoris) dispatch({ type: 'SET_FAVORITES', payload: favoris });

        toast.success(response.data?.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
        return { success: true, isFavorite: Boolean(response.data?.isFavorite) };
      } catch (error) {
        dispatch({ type: 'SET_FAVORITES', payload: previous });
        const message = error.response?.data?.message || 'Erreur favoris';
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [isAuthenticated],
  );

  const rateProperty = useCallback(async (propertyId, rating) => {
    try {
      await propertyAPI.rate(propertyId, rating);
      const refreshed = await propertyAPI.getById(propertyId);
      dispatch({ type: 'UPDATE_PROPERTY', payload: refreshed.data });
      toast.success('Note enregistrée');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la notation';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      fetchProperties,
      fetchPropertyById,
      createProperty,
      updateProperty,
      deleteProperty,
      fetchFavorites,
      toggleFavorite,
      rateProperty,
      setFilters,
      resetFilters,
      clearError,
    }),
    [
      state,
      fetchProperties,
      fetchPropertyById,
      createProperty,
      updateProperty,
      deleteProperty,
      fetchFavorites,
      toggleFavorite,
      rateProperty,
      setFilters,
      resetFilters,
      clearError,
    ],
  );

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    return {
      properties: [],
      loading: false,
      error: null,
      fetchProperties: async () => {},
      getProperty: async () => null,
      createProperty: async () => null,
      updateProperty: async () => null,
      deleteProperty: async () => {},
      searchProperties: async () => [],
      addToFavorites: async () => {},
      removeFromFavorites: async () => {},
      toggleFavorite: async () => {},
      isFavorite: () => false
    };
  }
  return context;
};
