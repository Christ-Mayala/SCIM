// Normalisation des numeros de telephone pour les liens WhatsApp (wa.me).
// Miroir de la logique backend (dryApi/dryApp/SCIM/features/reservation/controller/reservation.support.util.js).
//
// Important : contrairement a l'E.164 "telecom" standard, WhatsApp attend ici le numero
// congolais avec son "0" initial CONSERVE (ex: +242 06 78 96 752, jamais +242 6 78 96 752).
// On ne retire donc jamais ce zero, on l'ajoute au contraire s'il est absent.

const DEFAULT_COUNTRY_DIGITS = '242';

export const normalizePhoneE164 = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const digits = raw.replace(/[^\d]/g, '');
  if (!digits || digits.length < 8) return '';

  if (raw.startsWith('+')) return `+${digits}`;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;

  if (digits.startsWith(DEFAULT_COUNTRY_DIGITS)) {
    const rest = digits.slice(DEFAULT_COUNTRY_DIGITS.length).replace(/^0+/, '');
    return rest ? `+${DEFAULT_COUNTRY_DIGITS}${rest}` : '';
  }

  const local = digits.replace(/^0+/, '');
  if (!local) return '';
  return `+${DEFAULT_COUNTRY_DIGITS}${local}`;
};

// Retourne le numero au format attendu par wa.me (chiffres uniquement, sans "+"),
// avec le "0" local conserve/ajoute, ou '' si le numero ne ressemble pas a un mobile
// congolais valide (prefixe 04/05/06/07). Un numero mal forme affiche "numero inconnu"
// sur WhatsApp : on prefere ne pas proposer de lien plutot que d'en proposer un faux.
export const toWhatsAppNumber = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  let digits = raw.replace(/[^\d]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) digits = digits.slice(2);

  let local = digits.startsWith(DEFAULT_COUNTRY_DIGITS) ? digits.slice(DEFAULT_COUNTRY_DIGITS.length) : digits;
  if (!local.startsWith('0')) local = `0${local}`;

  if (!/^0[4-7]\d{7}$/.test(local)) return '';

  return `${DEFAULT_COUNTRY_DIGITS}${local}`;
};

export const buildWhatsappLink = (value, text = '') => {
  const number = toWhatsAppNumber(value);
  if (!number) return '';
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${number}${query}`;
};
