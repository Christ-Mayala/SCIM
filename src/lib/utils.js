import { Building2, Home, Landmark, MapPinned, Store } from 'lucide-react';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  const cleaned = String(phone || '').replace(/\s|\-|\(|\)/g, '');
  return /^\+?\d{6,15}$/.test(cleaned);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/og/og-property.jpg';
  if (String(imagePath).startsWith('http')) return imagePath;

  const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  let origin = raw;
  try {
    origin = new URL(raw).origin;
  } catch (_) {
    origin = String(raw).replace(/\/api\/.*$/i, '') || raw;
  }

  const path = String(imagePath).startsWith('/') ? String(imagePath) : `/${imagePath}`;
  return `${origin}${path}`;
};

export const getPropertyTypeIcon = (category) => {
  const icons = {
    Appartement: Building2,
    Maison: Home,
    Terrain: MapPinned,
    Commercial: Store,
    Autre: Landmark,
  };

  return icons[category] || icons.Autre;
};

export const getPropertyFeatures = (property) => {
  const features = [];

  if (property.nombre_chambres) {
    features.push(`${property.nombre_chambres} chambre${property.nombre_chambres > 1 ? 's' : ''}`);
  }

  if (property.nombre_salles_bain) {
    features.push(`${property.nombre_salles_bain} salle${property.nombre_salles_bain > 1 ? 's' : ''} de bain`);
  }

  if (property.superficie) {
    features.push(`${property.superficie} m²`);
  }

  if (property.garage) features.push('Garage');
  if (property.piscine) features.push('Piscine');
  if (property.jardin) features.push('Jardin');
  if (property.balcon) features.push('Balcon');
  if (property.gardien) features.push('Gardien');

  return features;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
};
