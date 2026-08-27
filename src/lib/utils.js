import { Building2, Home, Landmark, MapPin, Store } from 'lucide-react';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  const cleaned = String(phone || '').replace(/\s|\-|\(|\)/g, '');
  const withCountry = cleaned.startsWith('+242') ? cleaned : `+242${cleaned.replace(/^0+/, '')}`;
  if (!/^\+242\d{9}$/.test(withCountry)) return false;
  const digits = withCountry.replace(/[^\d]/g, '');
  const local = digits.slice(3);
  return /^0[4-7]\d{7}$/.test(local);
};

export const formatPrice = (price) => {
  const n = Number(price);
  if (!n || isNaN(n)) return '0 XAF';
  // Compact: ≥1B → 1,2G | ≥1M → 1,5M | ≥1K → 150K | sinon normal
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} G XAF`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')} M XAF`;
  if (n >= 10_000)        return `${(n / 1_000).toFixed(0)} K XAF`;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
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

  // Si c'est un chemin relatif commençant par /uploads ou similaire, on ajoute l'origine
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  let origin = raw;
  try {
    const urlObj = new URL(raw);
    origin = urlObj.origin;
  } catch (_) {
    origin = String(raw).replace(/\/api\/.*$/i, '') || raw;
  }

  const path = String(imagePath).startsWith('/')
    ? String(imagePath)
    : `/${imagePath}`;

  return `${origin}${path}`;
};

export const getPropertyTypeIcon = (category) => {
  const icons = {
    Appartement: Building2,
    Maison: Home,
    Terrain: MapPin,
    Commercial: Store,
    Autre: Landmark,
  };

  return icons[category] || icons.Autre;
};

export const getPropertyFeatures = (property) => {
  const features = [];
  if (property.nombre_chambres)   features.push(`${property.nombre_chambres} ch.`);
  if (property.nombre_salles_bain) features.push(`${property.nombre_salles_bain} sdb.`);
  if (property.superficie)        features.push(`${property.superficie} m²`);
  if (property.garage)            features.push('Garage');
  if (property.piscine)           features.push('Piscine');
  if (property.jardin)            features.push('Jardin');
  if (property.balcon)            features.push('Balcon');
  if (property.gardien)           features.push('Gardien');
  if (property.climatisation)     features.push('Clim.');
  if (property.wifi)              features.push('Wi-Fi');
  if (property.ascenseur)         features.push('Ascenseur');
  if (property.parking)           features.push('Parking');
  if (property.groupe_electrogene) features.push('Groupe élec.');
  return features;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
};
