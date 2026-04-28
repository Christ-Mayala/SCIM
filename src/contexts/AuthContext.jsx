import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../lib/api';

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

  const persistSession = useCallback((token, user) => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (token && token !== 'cookie_managed') localStorage.setItem('token', token);
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
      const token = localStorage.getItem('token') || (localStorage.getItem('user') ? 'cookie_managed' : null);
      const cachedUser = readStoredUser();

      // Si on n'a rien en local, on arrête le chargement (on est déconnecté)
      if (!token) {
        if (state.isAuthenticated) {
            dispatch({ type: 'LOGOUT' });
        }
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
  }, [clearSession, persistSession]);

  const login = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await authAPI.login(email, password);
        
        // Extraction robuste des données
        let data = response.data;
        if (data && typeof data === 'object') {
             // Si la réponse est { success: true, data: { ... } }
             if (data.data && (data.success || data.token === undefined)) {
                 data = data.data;
             }
        }
        
        const { user } = data || {};
        const safeToken = data?.token || 'cookie_managed';

        if (!user) {
           console.error('Login failed: User missing', { data });
           throw new Error('Réponse de connexion invalide');
        }

        persistSession(safeToken, user);

        let profileUser = null;
        try {
          const me = await authAPI.getProfile();
          profileUser = me.data;
          // Si me.data est enveloppé
          if (profileUser && profileUser.data && profileUser.success) {
              profileUser = profileUser.data;
          }

          if (profileUser) {
             persistSession(safeToken, profileUser);
          }
        } catch (err) {
          console.error('Erreur récupération profil après login:', err);
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
        
        // Stocker les tokens avant de récupérer le profil
        if (token && token !== 'cookie_managed') {
            localStorage.setItem('token', token);
        }
        if (refreshToken) {
            // Si vous avez un mécanisme pour le refresh token côté client
            localStorage.setItem('refreshToken', refreshToken);
        }
        
        const me = await authAPI.getProfile();
        const profileUser = me.data;

        if (!profileUser) {
          throw new Error("Impossible de récupérer le profil utilisateur.");
        }

        persistSession(token, profileUser);
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
        
        // Extraction robuste
        let data = response.data;
        if (data && data.data && (data.success || data.token === undefined)) {
            data = data.data;
        }
        
        const { user } = data || {};
        const safeToken = data?.token || 'cookie_managed';

        if (!user) {
             throw new Error("Réponse d'inscription invalide");
        }

        persistSession(safeToken, user);

        let profileUser = null;
        try {
          const me = await authAPI.getProfile();
          profileUser = me.data;
          if (profileUser && profileUser.data && profileUser.success) {
              profileUser = profileUser.data;
          }
          if (profileUser) {
            persistSession(safeToken, profileUser);
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
        const response = await authAPI.updateProfile(payload);
        let updated = response.data;
        if (updated && updated.data && (updated.success || !updated._id)) {
            updated = updated.data;
        }
        
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
    [persistSession, state.token],
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
