import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { validateEmail } from '../lib/utils';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ email: "L'email est requis" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Format d'email invalide" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { authAPI } = await import('../lib/api');
      const response = await authAPI.requestPasswordReset(email);

      const data = response.data || {};

      if (data?.success !== true) {
        toast.error(data?.message || "Erreur lors de l'envoi de l'email");
        return;
      }
      setIsEmailSent(true);
      toast.success(data?.message || 'Email de réinitialisation envoyé');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-light/40 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email envoyé !
            </h1>
            
            <p className="text-gray-600 mb-8">
              Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>. 
              Vérifiez votre boîte de réception et suivez les instructions.
            </p>
            
            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full bg-gold-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
              
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                className="w-full text-gold-primary py-3 px-4 rounded-lg font-medium hover:bg-gold-light/30 transition-colors"
              >
                Renvoyer l'email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-light/40 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Mot de passe oublié ?
            </h1>
            
            <p className="text-gray-600">
              Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Adresse email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="votre@email.com"
                required
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-gold-primary hover:text-gold-dark font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

