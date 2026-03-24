import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2, Building, Shield, Sparkles, Star, ArrowRight, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/checkbox';
import { cn, validateEmail, validatePhone } from '../lib/utils';
import toast from 'react-hot-toast';

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
        toast.success('Compte créé avec succès ! Bienvenue chez SCIM.');
        navigate('/dashboard', { replace: true });
      } else {
        const fieldErrors = result.fieldErrors || {};
        setErrors({ ...fieldErrors, general: result.message || '' });
        toast.error(result.message || 'Erreur lors de l\'inscription');
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
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 flex items-center justify-center p-6">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gold-primary/10 rounded-full blur-[120px] will-change-transform" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gold-dark/10 rounded-full blur-[120px] will-change-transform" style={{ animationDelay: '2s' }} />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
                           linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-2 bg-zinc-900 rounded-[40px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Left Side: Luxury Experience */}
        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden border-r border-white/5">
           <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/20 via-transparent to-transparent pointer-events-none" />
           
           <div className="relative z-10">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-gold-primary transition-all duration-500 shadow-2xl">
                   <img 
                    src="/images/scim-logo.jpg" 
                    alt="SCIM" 
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                   <div className="text-2xl font-black text-white tracking-widest leading-none uppercase">SCIM</div>
                   <div className="text-[10px] font-black text-gold-primary uppercase tracking-[0.3em]">Signature Immobilière</div>
                </div>
              </Link>
           </div>

           <div className="relative z-10 space-y-12">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gold-primary/10 rounded-full border border-gold-primary/20 text-[10px] font-black text-gold-primary uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    Accès Prestige
                 </div>
                 <h1 className="text-5xl font-black text-white tracking-tighter leading-[1.1] mb-4">
                   L'élégance <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-200 to-gold-dark">aux sommets.</span>
                 </h1>
                 <p className="text-lg text-zinc-400 font-medium max-w-sm leading-relaxed">
                   Devenez membre privilége et accédez aux opportunités les plus prestigieuses du marché.
                 </p>
              </div>

              {/* Benefits List Refined */}
              <div className="space-y-6">
                 {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-center gap-5 group/item cursor-default">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary group-hover/item:bg-gold-primary group-hover/item:text-zinc-950 transition-all duration-500 group-hover/item:scale-110 shadow-lg">
                            <Icon className="w-5 h-5" />
                         </div>
                         <span className="text-xs font-black text-zinc-400 group-hover/item:text-white uppercase tracking-widest transition-colors">{benefit.text}</span>
                      </div>
                    );
                 })}
              </div>
           </div>

           <div className="relative z-10 pt-10 border-t border-white/5">
              <div className="flex items-center justify-between">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Congo-Brazzaville • Excellence</p>
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-zinc-900 bg-zinc-800 ring-2 ring-gold-primary/5" />
                    ))}
                    <div className="w-9 h-9 rounded-full border-2 border-zinc-900 bg-gold-primary flex items-center justify-center text-[8px] font-black text-zinc-950">+5k</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 bg-zinc-900 flex flex-col justify-center relative border-l border-white/5 overflow-y-auto scrollbar-hide">
          {/* Mobile Header (Visible only on mobile) */}
          <div className="lg:hidden flex flex-col items-center mb-12">
             <Link to="/" className="mb-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                   <img src="/images/scim-logo.jpg" alt="SCIM" className="h-12 w-12 rounded-full object-cover" />
                </div>
             </Link>
             <h1 className="text-3xl font-black text-white tracking-tight text-center">SCIM <span className="text-gold-primary">SIGNATURE</span></h1>
          </div>

          <div className="max-w-md mx-auto w-full py-4">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-2xl font-black text-white tracking-tight mb-3">Création de Profil</h2>
              <p className="text-zinc-400 font-medium">Rejoignez notre cercle privé en quelques instants.</p>
            </div>

            {errors.general && (
              <div className="mb-8 p-5 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                   <Lock className="w-5 h-5" />
                </div>
                <p className="text-sm font-black text-red-400 leading-tight">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Identité Complète</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-gold-primary">
                    <User className="w-5 h-5 text-zinc-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Prénoms & Nom de famille"
                    className="w-full h-14 pl-16 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-bold text-sm"
                    required
                  />
                </div>
                {errors.nom && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{errors.nom}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">E-mail</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-gold-primary">
                      <Mail className="w-5 h-5 text-zinc-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className="w-full h-14 pl-16 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-bold text-sm"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Téléphone</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-gold-primary">
                      <Phone className="w-5 h-5 text-zinc-500 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+242 06..."
                      className="w-full h-14 pl-16 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-bold text-sm"
                      required
                    />
                  </div>
                  {errors.telephone && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{errors.telephone}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Série de Caractères (Pass)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-gold-primary">
                    <Lock className="w-5 h-5 text-zinc-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-14 pl-16 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-mono font-bold text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{errors.password}</p>}
                
                {formData.password && (
                  <div className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Niveau de Sécurisation</span>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          passwordStrength < 3 ? 'text-red-500' : passwordStrength < 4 ? 'text-amber-500' : 'text-emerald-500'
                        )}>
                           {passwordStrength < 3 ? 'Inadéquat' : passwordStrength < 4 ? 'Standard' : 'Optimal'}
                        </span>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-700",
                            passwordStrength < 3 ? 'bg-red-500' : passwordStrength < 4 ? 'bg-amber-500' : 'bg-emerald-500'
                          )}
                          style={{ width: `${passwordStrength * 20}%` }}
                        />
                     </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Validation du Pass</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-gold-primary">
                    <Lock className="w-5 h-5 text-zinc-500 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Répétez le mot de passe"
                    className="w-full h-14 pl-16 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-mono font-bold text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleChange({ target: { name: 'acceptTerms', type: 'checkbox', checked: !formData.acceptTerms } })}>
                 <div className={"w-6 h-6 rounded-lg border transition-all flex items-center justify-center flex-shrink-0 " + (formData.acceptTerms ? 'bg-gold-primary border-gold-primary shadow-[0_0_15px_rgba(201,162,39,0.3)]' : 'border-white/20 bg-white/5 group-hover:border-gold-primary/50')}>
                    {formData.acceptTerms && <Key className="w-3 h-3 text-zinc-950" />}
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 leading-relaxed uppercase tracking-widest">
                       J'atteste avoir lu et j'accepte sans réserve les <Link to="/terms" className="text-gold-primary hover:underline underline-offset-4">conditions d'exclusion</Link> et la <Link to="/privacy" className="text-gold-primary hover:underline underline-offset-4">politique de confidentialité</Link>.
                    </p>
                 </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full h-16 bg-gold-primary hover:bg-amber-300 text-zinc-950 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] shadow-[0_20px_40px_rgba(201,162,39,0.2)] hover:shadow-[0_25px_50px_rgba(201,162,39,0.3)] transition-all duration-500 hover:-translate-y-1 active:scale-[0.98]"
                disabled={!formData.acceptTerms || loading}
              >
                Initialiser mon Profil Prestige
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">
                Adhérent de longue date ?{' '}
                <Link
                  to="/login"
                  className="ml-2 text-gold-primary hover:text-amber-200 transition-colors underline underline-offset-8 transition-all"
                >
                  Authentification Directe
                </Link>
              </p>
            </div>

            {/* Security Info */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center justify-center gap-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                <Shield className="w-3 h-3 text-gold-primary" />
                <span>Protection Signature • Données Chiffrées AES-256</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;