import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Key, Building, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/checkbox';
import { validateEmail } from '../lib/utils';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, loading, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password, rememberMe);

    if (result.success) {
      navigate(from || '/dashboard', { replace: true });
    } else {
      const fieldErrors = result.fieldErrors || {};
      setErrors({ ...fieldErrors, general: result.message || '' });
    }
  };

  const benefits = [
    { icon: Building, text: "Accès à tout notre catalogue de biens" },
    { icon: Shield, text: "Transactions sécurisées" },
    { icon: User, text: "Gestion de votre profil propriétaire/locataire" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gold-dark/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-gold-primary/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
                           linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      <div className="relative flex min-h-screen">
        {/* Left Panel - Branding & Benefits */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80")',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/95 via-zinc-900/90 to-zinc-900/80"></div>
          </div>
          
          <div className="relative flex flex-col justify-between p-12 w-full">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
                <img 
                  src="/images/scim-logo.jpg" 
                  alt="SCIM" 
                  className="h-16 w-16 rounded-full object-cover border-4 border-white/20"
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">SCIM</div>
                <div className="text-sm text-gray-200">Immobilier Congo</div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-md">
              <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Key className="w-4 h-4" />
                <span className="text-sm font-medium text-white">Accès sécurisé</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Reconnectez-vous à <br />
                <span className="text-gold-primary">votre espace</span>
              </h1>
              
              <p className="text-xl text-gray-200 mb-10 leading-relaxed">
                Retrouvez tous vos biens, messages et transactions en toute sécurité.
              </p>

              {/* Benefits List */}
              <div className="space-y-4 mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-gold-primary" />
                    </div>
                    <span className="text-gray-200">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-300">Biens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">98%</div>
                  <div className="text-sm text-gray-300">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24h</div>
                  <div className="text-sm text-gray-300">Support</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-300">
              <p>© 2024 SCIM Immobilier • Plateforme certifiée</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mb-4">
                <img 
                  src="/images/scim-logo.jpg" 
                  alt="SCIM" 
                  className="h-20 w-20 rounded-full object-cover border-4 border-white/20"
                />
              </div>
              <h1 className="text-2xl font-bold text-white text-center">SCIM Immobilier</h1>
              <p className="text-gray-300 text-center mt-2">Connectez-vous à votre compte</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Bienvenue de retour
                </h2>
                <p className="text-gray-200">
                  Connectez-vous pour accéder à votre espace personnel
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <Input
                    label="Adresse email"
                    labelClassName="text-white"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-300"
                    leftIcon={<Mail className="w-5 h-5" />}
                    error={errors.email}
                    errorClassName="text-red-400"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <Input
                    label="Mot de passe"
                    labelClassName="text-white"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-300"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-gray-200 transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                    error={errors.password}
                    errorClassName="text-red-400"
                  />
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked)}
                      className="border-gray-400 data-[state=checked]:bg-gold-primary data-[state=checked]:text-white"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-gray-200 cursor-pointer select-none"
                    >
                      Se souvenir de moi
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-gold-primary hover:text-gold-dark transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full group py-4 bg-gradient-to-r from-gold-primary to-gold-dark hover:from-gold-dark hover:to-gold-primary text-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formData.email || !formData.password || loading}
                >
                  <span className="flex items-center justify-center">
                    {loading ? 'Connexion...' : 'Se connecter'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </form>

              {/* Social Login Separator */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-zinc-900/50 text-gray-400">Ou continuez avec</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <a href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`} className="w-full inline-flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl text-sm font-medium text-gray-200 bg-white/5 hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 mr-3" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.8 0-5.18-1.88-6.04-4.42H2.34v2.84C4.13 20.98 7.79 23 12 23z" />
                      <path d="M5.96 14.25c-.14-.42-.22-.86-.22-1.31s.08-.89.22-1.31V8.79H2.34C1.5 10.33 1 12.09 1 14s.5 3.67 1.34 5.21l3.62-2.96z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.79 1 4.13 3.02 2.34 6.21l3.62 2.96c.86-2.54 3.24-4.42 6.04-4.42z" />
                    </svg>
                    Google
                  </a>
                  <a href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/facebook`} className="w-full inline-flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl text-sm font-medium text-gray-200 bg-white/5 hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                    Facebook
                  </a>
                </div>
              </div>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-300">
                  Pas encore de compte ?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-gold-primary hover:text-gold-dark transition-colors group"
                  >
                    <span className="flex items-center justify-center">
                      S'inscrire gratuitement
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </p>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-300">
                  <Shield className="w-3 h-3" />
                  <span>Connexion sécurisée • SSL encrypté</span>
                </div>
              </div>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden mt-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Pourquoi se connecter ?</h3>
                <div className="grid grid-cols-1 gap-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center justify-center space-x-3 text-gray-200">
                      <benefit.icon className="w-4 h-4 text-gold-primary" />
                      <span className="text-sm">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;