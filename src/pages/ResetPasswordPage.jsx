import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../components/ui/Input';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');
  const codeParam = searchParams.get('code');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    // Si on utilise le flux par code (email+code), on n'a pas de token
    if (!token && (!emailParam || !codeParam)) {
      toast.error('Paramètres manquants');
      navigate('/forgot-password');
      return;
    }

    if (token) {
      verifyToken();
    } else {
      // Flux code: on peut afficher directement le formulaire
      setIsTokenValid(true);
      setUserEmail(emailParam);
    }
  }, [token, navigate]);

  const verifyToken = async () => {
    try {
      const { authAPI } = await import('../lib/api');
      const response = await authAPI.verifyResetCode(emailParam, codeParam);

      const data = response.data;

      if (data?.success === true) {
        setIsTokenValid(true);
        setUserEmail(data.email);
      } else {
        setIsTokenValid(false);
        toast.error(data.message || 'Code invalide ou expiré');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setIsTokenValid(false);
      toast.error('Erreur de connexion au serveur');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const { newPassword, confirmPassword } = formData;
    const newErrors = {};

    // Validation
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { authAPI } = await import('../lib/api');
      const response = await authAPI.resetPassword(
        token ? userEmail : emailParam,
        token ? undefined : codeParam,
        newPassword
      );

      const data = response.data;

      if (data?.success === true) {
        setIsPasswordReset(true);
        toast.success('Mot de passe réinitialisé avec succès !');
      } else {
        toast.error(data.message || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Token invalide ou expiré
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-light/40 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Lien invalide ou expiré
            </h1>
            
            <p className="text-gray-600 mb-8">
              Ce lien de réinitialisation n'est plus valide. Veuillez demander un nouveau lien.
            </p>
            
            <div className="space-y-4">
              <Link
                to="/forgot-password"
                className="w-full bg-gold-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors block text-center"
              >
                Demander un nouveau lien
              </Link>
              
              <Link
                to="/login"
                className="w-full text-gold-primary py-3 px-4 rounded-lg font-medium hover:bg-gold-light/30 transition-colors block text-center"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mot de passe réinitialisé avec succès
  if (isPasswordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-light/40 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Mot de passe réinitialisé !
            </h1>
            
            <p className="text-gray-600 mb-8">
              Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
            
            <Link
              to="/login"
              className="w-full bg-gold-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors block text-center"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Chargement de la vérification du token
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-light/40 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification du lien...</p>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire de réinitialisation
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-light/40 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Nouveau mot de passe
            </h1>
            
            <p className="text-gray-600">
              Créez un nouveau mot de passe pour <strong>{userEmail}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Nouveau mot de passe"
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Minimum 6 caractères"
                required
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.newPassword}
              />
            </div>

            <div>
              <Input
                label="Confirmer le mot de passe"
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Répétez le mot de passe"
                required
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.confirmPassword}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-gold-primary hover:text-gold-dark font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

