import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { socialLogin } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const refreshToken = params.get('refreshToken');
        const error = params.get('error');

        if (token) {
            // Utiliser une nouvelle fonction dans le contexte pour gérer le login social
            socialLogin(token, refreshToken);
            // Rediriger vers le tableau de bord ou la page d'accueil
            navigate('/dashboard', { replace: true });
        } else if (error) {
            // Gérer l'erreur, peut-être afficher une notification
            console.error("Erreur d'authentification sociale:", error);
            // Rediriger vers la page de connexion avec un message d'erreur
            navigate('/login', { state: { error: "L'authentification a échoué. Veuillez réessayer." } });
        } else {
            // Si aucun token ni erreur, rediriger simplement vers la page de connexion
            navigate('/login');
        }
    }, [location, navigate, socialLogin]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
            <h1 className="text-2xl font-black text-white tracking-tight">Authentification en cours...</h1>
            <p className="text-zinc-400 mt-2 font-medium">Veuillez patienter pendant que nous vous connectons.</p>
        </div>
    </div>
    );
};

export default AuthCallbackPage;
