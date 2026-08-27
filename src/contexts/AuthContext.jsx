import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import toast from 'react-hot-toast';
import api, { authAPI } from '../lib/api';

const AuthContext = createContext();

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch (_) {
    return null;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const persistSession = useCallback((token, user, refreshToken) => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (token && token !== 'cookie_managed') localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    } catch (_) {}
  }, []);

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } catch (_) {}
  }, []);

  useEffect(() => {
    const run = async () => {
      // Lecture directe et fraîche du localStorage
      let token = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const cachedUser = readStoredUser();

      // Si aucun token et aucun user en cache → déconnecté
      if (!token && !cachedUser) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Si token est 'cookie_managed' mais qu'on a un refreshToken → tenter un vrai refresh
      if ((!token || token === 'cookie_managed') && storedRefreshToken) {
        try {
          const refreshRes = await api.post('/users/refresh-token', { refreshToken: storedRefreshToken });
          const newToken = refreshRes.data?.token;
          const newRefreshToken = refreshRes.data?.refreshToken;
          if (newToken) {
            localStorage.setItem('token', newToken);
            token = newToken;
          }
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
        } catch (_) {
          // Refresh échoué → déconnexion
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
      }

      // Pas de token valide → déconnecté
      if (!token || token === 'cookie_managed') {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Sync initiale rapide avec le cache
      if (cachedUser && !state.isAuthenticated) {
        dispatch({ type: 'SET_USER', payload: { user: cachedUser, token } });
      }

      try {
        const me = await authAPI.getProfile();
        let profileUser = me.data;
        if (profileUser && profileUser.data && profileUser.success) {
            profileUser = profileUser.data;
        }
        
        if (profileUser) {
          persistSession(token, profileUser);
          dispatch({ type: 'SET_USER', payload: { user: profileUser, token } });
        } else {
          throw new Error('No profile data');
        }
      } catch (error) {
        const msg = error?.response?.data?.message || error?.message || '';
        const isAuth = String(msg).toLowerCase().includes('non autorisé') || String(msg).toLowerCase().includes('token');

        if (isAuth) {
          clearSession();
          dispatch({ type: 'LOGOUT' });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    run();
  }, [clearSession, persistSession]); // eslint-disable-line

  const login = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await authAPI.login(email, password);
        // api.js interceptor already unwraps: response.data = payload.data
        // So response.data = { token, refreshToken, user }
        const data = response.data || {};
        
        const { user } = data;
        const safeToken = data?.token || null;
        const safeRefreshToken = data?.refreshToken || null;

        if (!user || !safeToken) {
           throw new Error('Réponse de connexion invalide');
        }

        persistSession(safeToken, user, safeRefreshToken);

        let profileUser = null;
        try {
          const me = await authAPI.getProfile();
          profileUser = me.data;
          if (profileUser && profileUser.data && profileUser.success) {
              profileUser = profileUser.data;
          }
          if (profileUser) {
             persistSession(safeToken, profileUser, safeRefreshToken);
          }
        } catch (err) {
          // Profile fetch failed but login was successful
        }

        dispatch({ type: 'SET_USER', payload: { user: profileUser || user, token: safeToken } });
        toast.success('Connexion réussie');
        return { success: true };
      } catch (error) {
        const data = error.response?.data || {};
        const fieldErrors = {};
        if (Array.isArray(data.errors)) {
          data.errors.forEach((e) => {
            if (e?.param && e?.msg) fieldErrors[e.param] = e.msg;
          });
        }
        const message = data.message || 'Erreur de connexion';
        dispatch({ type: 'SET_ERROR', payload: message });
        toast.error(message);
        return { success: false, message, fieldErrors };
      }
    },
    [persistSession],
  );

  const socialLogin = useCallback(
    async (token, refreshToken) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const me = await authAPI.getProfile();
        const profileUser = me.data;

        if (!profileUser) {
          throw new Error("Impossible de récupérer le profil utilisateur.");
        }

        persistSession(token, profileUser, refreshToken);
        dispatch({ type: 'SET_USER', payload: { user: profileUser, token } });
        toast.success('Connexion réussie !');
        return { success: true };

      } catch (error) {
        clearSession();
        const message = error.response?.data?.message || "L'authentification a échoué.";
        dispatch({ type: 'SET_ERROR', payload: message });
        toast.error(message);
        return { success: false, message };
      }
    },
    [persistSession, clearSession]
  );

  const register = useCallback(
    async (userData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await authAPI.register(userData);
        // api.js interceptor already unwraps: response.data = payload.data
        const data = response.data || {};
        
        const { user } = data;
        const safeToken = data?.token || null;
        const safeRefreshToken = data?.refreshToken || null;

        if (!user || !safeToken) {
             throw new Error("Réponse d'inscription invalide");
        }

        persistSession(safeToken, user, safeRefreshToken);

        let profileUser = null;
        try {
          const me = await authAPI.getProfile();
          profileUser = me.data;
          if (profileUser && profileUser.data && profileUser.success) {
              profileUser = profileUser.data;
          }
          if (profileUser) {
            persistSession(safeToken, profileUser, safeRefreshToken);
          }
        } catch (_) {}

        dispatch({ type: 'SET_USER', payload: { user: profileUser || user, token: safeToken } });
        toast.success('Inscription réussie');
        return { success: true };
      } catch (error) {
        const data = error.response?.data || {};
        const fieldErrors = {};
        if (Array.isArray(data.errors)) {
          data.errors.forEach((e) => {
            if (e?.param && e?.msg) fieldErrors[e.param] = e.msg;
          });
        }
        const message = data.message || "Erreur d'inscription";
        dispatch({ type: 'SET_ERROR', payload: message });
        toast.error(message);
        return { success: false, message, fieldErrors };
      }
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    // On vide le stockage local IMMÉDIATEMENT pour éviter les conflits
    clearSession();
    dispatch({ type: 'LOGOUT' });
    
    try {
      await authAPI.logout?.();
    } catch (_) {
      // On ignore l'erreur d'API si on a déjà tout vidé localement
    } finally {
      toast.success('Déconnexion');
    }
  }, [clearSession]);

  const updateProfile = useCallback(
    async (payload) => {
      try {
        // PUT /users/:id — backend users.routes.js has router.put('/:id', protect, updateUser)
        const id = state.user?._id || state.user?.id || payload?._id || payload?.id;
        if (!id) throw new Error('ID utilisateur manquant');
        const response = await api.put(`/users/${id}`, payload);
        const updated = response.data;
        if (!updated) throw new Error("Réponse de mise à jour invalide");

        persistSession(state.token, updated);
        dispatch({ type: 'SET_USER', payload: { user: updated, token: state.token } });
        toast.success('Profil mis à jour');
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || 'Erreur de mise à jour';
        toast.error(message);
        return { success: false, message };
      }
    },
    [persistSession, state.token, state.user],
  );

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      socialLogin,
      register,
      logout,
      updateProfile,
      clearError,
    }),
    [state, login, socialLogin, register, logout, updateProfile, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Retourner des valeurs par défaut au lieu de lancer une erreur
    return {
      user: null,
      token: null,
      loading: false,
      login: async () => {},
      logout: () => {},
      register: async () => {},
      updateUser: () => {},
      isAuthenticated: false,
      isAdmin: false,
      isClient: false
    };
  }
  return context;
};
