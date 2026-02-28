import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, Building, Shield, Star, ArrowRight, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/checkbox';
import { validateEmail, validatePhone } from '../lib/utils';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, loading, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.telephone) {
      newErrors.telephone = 'Le téléphone est requis';
    } else if (!validatePhone(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Mot de passe trop faible';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmez le mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { confirmPassword, acceptTerms, ...userData } = formData;
      const result = await register(userData);

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        const fieldErrors = result.fieldErrors || {};
        setErrors({ ...fieldErrors, general: result.message || '' });
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, general: "Une erreur s'est produite. Veuillez réessayer." }));
    }
  };

  const benefits = [
    { icon: Building, text: "Accès à tout notre catalogue de biens" },
    { icon: Star, text: "Favoris et recherches sauvegardées" },
    { icon: Shield, text: "Transactions sécurisées et suivies" },
    { icon: User, text: "Profil personnalisé de propriétaire/locataire" },
  ];

  const passwordRequirements = [
    { label: '8 caractères minimum', met: formData.password.length >= 8 },
    { label: 'Une majuscule', met: /[A-Z]/.test(formData.password) },
    { label: 'Une minuscule', met: /[a-z]/.test(formData.password) },
    { label: 'Un chiffre', met: /[0-9]/.test(formData.password) },
    { label: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gold-dark/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gold-primary/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
                           linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      <div className="relative flex min-h-screen">
        {/* Left Panel - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80")',
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
                <span className="text-sm font-medium text-white">Création de compte</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Rejoignez notre <br />
                <span className="text-gold-primary">communauté immobilière</span>
              </h1>
              
              <p className="text-xl text-gray-200 mb-10 leading-relaxed">
                Créez votre compte gratuit et accédez à des opportunités immobilières exclusives.
              </p>

              {/* Benefits List */}
              <div className="space-y-6 mb-12">
                <h3 className="text-lg font-semibold text-white mb-4">Vos avantages :</h3>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-gold-primary" />
                    </div>
                    <span className="text-gray-200">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-200 italic mb-4">
                  "Grâce à SCIM, j'ai trouvé la maison parfaite pour ma famille en moins d'une semaine !"
                </p>
                <div className="text-sm text-gray-300">- Marie K., propriétaire depuis 2023</div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-300">
              <p>© 2024 SCIM Immobilier • Déjà 5 000+ membres</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Register Form */}
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
              <h1 className="text-2xl font-bold text-white text-center">Rejoignez SCIM Immobilier</h1>
              <p className="text-gray-300 text-center mt-2">Créez votre compte en 2 minutes</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Créez votre compte
                </h2>
                <p className="text-gray-200">
                  Rejoignez la première plateforme immobilière du Congo
                </p>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <Input
                    label="Nom complet *"
                    labelClassName="text-white"
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Votre nom et prénom"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-300"
                    leftIcon={<User className="w-5 h-5" />}
                    error={errors.nom}
                    errorClassName="text-red-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <Input
                      label="Email *"
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

                  {/* Phone */}
                  <div>
                    <Input
                      label="Téléphone *"
                      labelClassName="text-white"
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+242 06 123 45 67"
                      className="bg-white/5 border-white/10 text-white placeholder-gray-300"
                      leftIcon={<Phone className="w-5 h-5" />}
                      error={errors.telephone}
                      errorClassName="text-red-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Input
                    label="Mot de passe *"
                    labelClassName="text-white"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Créez un mot de passe sécurisé"
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
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-300">Force du mot de passe</span>
                        <span className="text-xs text-gray-300">
                          {passwordStrength < 3 ? 'Faible' : passwordStrength < 4 ? 'Moyen' : 'Fort'}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordStrength < 3 ? 'bg-red-500' : 
                            passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${passwordStrength * 20}%` }}
                        ></div>
                      </div>
                      
                      {/* Requirements */}
                      <div className="mt-3 space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center">
                            {req.met ? (
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                            ) : (
                              <div className="w-3 h-3 border border-gray-500 rounded-full mr-2"></div>
                            )}
                            <span className={`text-xs ${req.met ? 'text-green-400' : 'text-gray-300'}`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Input
                    label="Confirmer le mot de passe *"
                    labelClassName="text-white"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Retapez votre mot de passe"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-300"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="hover:text-gray-200 transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                    error={errors.confirmPassword}
                    errorClassName="text-red-400"
                  />
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        handleChange({ target: { name: 'acceptTerms', type: 'checkbox', checked } })
                      }
                      className="border-white/30 data-[state=checked]:bg-gold-primary data-[state=checked]:text-white"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-200 cursor-pointer select-none">
                      J'accepte les{' '}
                      <Link to="/terms" className="text-gold-primary hover:text-gold-dark">
                        conditions d'utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link to="/privacy" className="text-gold-primary hover:text-gold-dark">
                        politique de confidentialité
                      </Link>
                    </label>
                  </div>
                </div>
                {errors.acceptTerms && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.acceptTerms}
                  </p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full group py-4 bg-gradient-to-r from-gold-primary to-gold-dark hover:from-gold-dark hover:to-gold-primary text-lg font-semibold shadow-lg hover:shadow-xl"
                  disabled={!formData.acceptTerms || loading}
                >
                  <span className="flex items-center justify-center">
                    {loading ? 'Création en cours...' : 'Créer mon compte gratuit'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-300">
                  Vous avez déjà un compte ?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-gold-primary hover:text-gold-dark transition-colors group"
                  >
                    <span className="flex items-center justify-center">
                      Connectez-vous ici
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </p>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-300">
                  <Shield className="w-3 h-3" />
                  <span>Inscription sécurisée • Vos données sont protégées</span>
                </div>
              </div>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden mt-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Pourquoi s'inscrire ?</h3>
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

export default RegisterPage;