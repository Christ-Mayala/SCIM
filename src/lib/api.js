import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = (() => {
  let u = String(rawBaseUrl || '').trim().replace(/\/$/, '');
  
  // Si l'URL se termine déjà par le path complet (ex: /api/v1/scim), on la garde telle quelle
  if (/\/api\/v\d+\/scim$/.test(u)) return u;
  
  // Si l'URL se termine par /api, on ajoute juste /v1/scim
  if (u.endsWith('/api')) return `${u}/v1/scim`;
  
  // Sinon on ajoute le path complet /api/v1/scim
  return `${u}/api/v1/scim`;
})();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      const isFormData =
        typeof FormData !== 'undefined' &&
        config.data &&
        (config.data instanceof FormData || Object.prototype.toString.call(config.data) === '[object FormData]');

      if (isFormData) {
        const h = config.headers;
        if (h && typeof h.delete === 'function') {
          h.delete('Content-Type');
        } else if (h) {
          delete h['Content-Type'];
          delete h['content-type'];
        }
      }
    } catch (_) {}
    return config;
  },
  (error) => Promise.reject(error),
);

const isAuthEndpoint = (url = '') =>
  url.includes('/users/refresh-token') || url.includes('/users/login') || url.includes('/users/register');

const isPasswordResetEndpoint = (url = '') =>
  url.includes('/password-reset/request') || url.includes('/password-reset/verify') || url.includes('/password-reset/reset');

const makeApiError = ({ payload, response, originalRequest }) => {
  const err = new Error(payload?.message || 'Request failed');
  err.response = {
    ...response,
    data: payload,
  };
  err.config = originalRequest;
  return err;
};

api.interceptors.response.use(
  async (response) => {
    const payload = response?.data;

    if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'success')) {
      if (payload.success === false) {
        const originalRequest = response.config;
        const url = originalRequest?.url || '';

        const looksLikeAuthError =
          String(payload?.message || '').toLowerCase().includes('non autorisé') ||
          String(payload?.message || '').toLowerCase().includes('token');

        if (looksLikeAuthError && originalRequest && !originalRequest._retry && !isAuthEndpoint(url)) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await api.post('/users/refresh-token');
            const newToken = refreshResponse?.data?.token;
            if (newToken) {
              localStorage.setItem('token', newToken);
              api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${newToken}`,
              };
              return api(originalRequest);
            }
          } catch (_) {}

          return Promise.reject(makeApiError({ payload, response, originalRequest }));
        }

        return Promise.reject(makeApiError({ payload, response, originalRequest }));
      }

      response.data = payload.data;
    }

    return response;
  },
  (error) => Promise.reject(error),
);

export const authAPI = {
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (userData) => api.post('/users/register', userData),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => {
    // Utilisation du module natif /user/profile (PATCH) qui utilise le token (pas besoin d'ID)
    // Le module natif attend un FormData si avatar, ou JSON sinon. 
    // api.js gère déjà la conversion FormData dans l'interceptor si besoin, 
    // mais ici on doit s'assurer d'envoyer le bon format.
    // Pour simplifier et matcher l'existant, on envoie userData directement.
    return api.patch('/user/profile', userData);
  },
  refreshToken: () => api.post('/users/refresh-token'), // Reste sur /users
  requestPasswordReset: (email) => api.post('/users/reset-request', { email }),
  verifyResetCode: (email, code) => api.post('/users/reset-verify', { email, code }),
  resetPassword: (email, code, newPassword) => api.post('/users/reset-password', { email, code, newPassword }),
};

export const propertyAPI = {
  getAll: (params = {}) => api.get('/property', { params }),
  getById: (id) => api.get(`/property/${id}`),
  create: (propertyData) => {
    // propertyData est déjà un FormData depuis PropertyContext
    return api.post('/property', propertyData);
  },
  update: (id, propertyData) => {
    // propertyData est déjà un FormData depuis PropertyContext
    return api.put(`/property/${id}`, propertyData);
  },
  delete: (id) => api.delete(`/property/${id}`),
  toggleFavorite: (id) => api.post(`/favoris/${id}`),
  rate: (id, rating) => api.post(`/property/${id}/rate`, { rating }),
  getWithRating: (id) => api.get(`/property/${id}/rating`),
  recordVisit: (id) => api.post(`/property/${id}/visit`),
};

export const userAPI = {
  getVisited: (params = {}) => api.get('/users/visited', { params }),
  getStats: () => api.get('/users/stats'),
  changePassword: (id, currentPassword, newPassword) =>
    api.patch(`/users/${id}/password`, { currentPassword, newPassword }),
  searchUsers: (params = {}) => api.get('/users/search', { params }),
};

export const messageAPI = {
  getInbox: () => api.get('/message/inbox'),
  getMessagesWithUser: (userId) => api.get(`/message/${userId}`),
  sendMessage: (receiverId, content) => api.post(`/message/${receiverId}`, { contenu: content }),
  contactScim: (subject, content) => api.post('/message/scim', { sujet: subject, contenu: content }),
  getUnreadCount: () => api.get('/message/unread'),
  markAsRead: (messageId) => api.patch(`/message/${messageId}/read`),
  markThreadAsRead: (userId) => api.patch(`/message/thread/${userId}/read`),
  deleteThread: (userId) => api.delete(`/message/thread/${userId}`),
  deleteMessage: (messageId) => api.delete(`/message/${messageId}`),
};

export const favoritesAPI = {
  getAll: () => api.get('/favoris'),
  add: (propertyId) => api.post(`/favoris/${propertyId}`),
  remove: (propertyId) => api.post(`/favoris/${propertyId}`),
};

export const reservationAPI = {
  create: (propertyId, date, telephone = '') =>
    api.post('/reservation', { propertyId, date, ...(telephone ? { telephone } : {}) }),
  my: () => api.get('/reservation/my'),
  owner: () => api.get('/reservation/owner'),
  cancel: (id) => api.patch(`/reservation/${id}/cancel`),
  confirm: (id) => api.patch(`/reservation/${id}/confirm`),
  ack: (id) => api.patch(`/reservation/${id}/ack`),
  getById: (id) => api.get(`/reservation/${id}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getReservations: (params = {}) => api.get('/admin/reservations', { params }),

  getProperties: (params = {}) => api.get('/admin/properties', { params }),
  getPropertyById: (id) => api.get(`/admin/properties/${id}`),
  updatePropertyStatus: (id, status) => api.put(`/admin/properties/${id}/status`, { status }),
  deleteProperty: (id) => api.delete(`/admin/properties/${id}`),

  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, payload) => api.put(`/admin/users/${id}`, payload),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  restoreUser: (id) => api.patch(`/admin/users/${id}/restore`),

  getMessages: (params = {}) => api.get('/admin/messages', { params }),
  getMessageById: (id) => api.get(`/admin/messages/${id}`),
  updateMessageStatus: (id, lu) => api.put(`/admin/messages/${id}/status`, { lu: Boolean(lu) }),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),

  getPropertyAnalytics: (params = {}) => api.get('/admin/analytics/properties', { params }),
  getUserAnalytics: (params = {}) => api.get('/admin/analytics/users', { params }),
  getRevenueAnalytics: (params = {}) => api.get('/admin/analytics/revenue', { params }),

  getSettings: () => api.get('/admin/settings'),
  updateSettings: (payload) => api.put('/admin/settings', payload),
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
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const get = (url, config) => api.get(url, config);
export const post = (url, data, config) => api.post(url, data, config);
export const put = (url, data, config) => api.put(url, data, config);
export const patch = (url, data, config) => api.patch(url, data, config);
export const del = (url, config) => api.delete(url, config);

export default api;
