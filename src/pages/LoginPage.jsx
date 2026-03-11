import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Key, Building, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/checkbox';
import { validateEmail } from '../lib/utils';
import { API_BASE_URL } from '../lib/api';

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
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 flex items-center justify-center p-6">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gold-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gold-dark/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-zinc-900/40 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Left Side: Brand Experience */}
        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
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
                   <div className="text-2xl font-black text-white tracking-widest leading-none">SCIM</div>
                   <div className="text-[10px] font-black text-gold-primary uppercase tracking-[0.3em]">Immobilier de Luxe</div>
                </div>
              </Link>
           </div>

           <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gold-primary/10 rounded-full border border-gold-primary/20 text-[10px] font-black text-gold-primary uppercase tracking-widest backdrop-blur-md">
                 <Shield className="w-4 h-4" />
                 Accès Privilégié
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter leading-[1.1]">
                Redéfinissons <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-200 to-gold-dark">l'Excellence</span> <br />
                Immobilière.
              </h1>
              <p className="text-lg text-zinc-400 font-medium max-w-sm leading-relaxed">
                Reprenez le contrôle de votre patrimoine avec notre interface haute performance.
              </p>
           </div>

           <div className="relative z-10 pt-10 border-t border-white/5 flex items-center justify-between">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 ring-2 ring-gold-primary/5" />
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-gold-primary flex items-center justify-center text-[10px] font-black text-zinc-950 shadow-[0_0_20px_rgba(201,162,39,0.4)]">+5k</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 text-right">
                   Congo-Brazzaville <span className="w-1 h-1 bg-gold-primary rounded-full" /> Excellence
                 </p>
                 <p className="text-[10px] font-black text-gold-primary uppercase tracking-[0.3em] flex items-center gap-2">
                   <Sparkles className="w-3 h-3 animate-pulse" /> Rejoignez l'élite
                 </p>
              </div>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 bg-zinc-900/80 backdrop-blur-3xl flex flex-col justify-center relative border-l border-white/5">
          {/* Mobile Header (Visible only on mobile) */}
          <div className="lg:hidden flex flex-col items-center mb-12">
             <Link to="/" className="mb-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                   <img src="/images/scim-logo.jpg" alt="SCIM" className="h-12 w-12 rounded-full object-cover" />
                </div>
             </Link>
             <h1 className="text-3xl font-black text-white tracking-tight text-center">SCIM <span className="text-gold-primary">PRESTIGE</span></h1>
          </div>

          <div className="max-w-md mx-auto w-full">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-2xl font-black text-white tracking-tight mb-3">Ravis de vous revoir</h2>
              <p className="text-zinc-400 font-medium">Saisissez vos identifiants pour accéder à votre espace.</p>
            </div>

            {errors.general && (
              <div className="mb-8 p-5 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="p-2 bg-red-500/20 rounded-xl text-red-500">
                   <Lock className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-red-400">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">E-mail Professionnel</label>
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
                    className="w-full h-16 pl-16 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Mot de Passe</label>
                   <Link 
                    to="/forgot-password" 
                    className="text-[10px] font-black text-gold-primary hover:text-gold-dark uppercase tracking-widest transition-colors"
                  >
                    Oublié ?
                  </Link>
                </div>
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
                    className="w-full h-16 pl-16 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-mono font-bold"
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
              </div>

              <div className="flex items-center gap-3 py-2 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                 <div className={"w-5 h-5 rounded-md border transition-all flex items-center justify-center " + (rememberMe ? 'bg-gold-primary border-gold-primary shadow-[0_0_10px_rgba(201,162,39,0.3)]' : 'border-white/20 bg-white/5 group-hover:border-gold-primary/50')}>
                    {rememberMe && <Key className="w-3 h-3 text-zinc-950" />}
                 </div>
                 <span className="text-xs font-black text-zinc-500 group-hover:text-white uppercase tracking-widest transition-colors">Rester connecté</span>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full h-16 bg-gold-primary hover:bg-amber-300 text-zinc-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(201,162,39,0.2)] hover:shadow-[0_25px_50px_rgba(201,162,39,0.3)] transition-all duration-500 hover:-translate-y-1 active:scale-95"
              >
                Accéder au Dashboard
              </Button>
            </form>

              {/* Social Login Separator */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-zinc-900 text-zinc-500 text-[10px] font-black uppercase tracking-widest">Ou continuez avec</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  <a href={API_BASE_URL + "/api/auth/google"} className="w-full inline-flex items-center justify-center gap-3 h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white hover:bg-white/10 hover:border-white/20 transition-all tracking-widest uppercase">
                    <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.8 0-5.18-1.88-6.04-4.42H2.34v2.84C4.13 20.98 7.79 23 12 23z" />
                      <path fill="#FBBC05" d="M5.96 14.25c-.14-.42-.22-.86-.22-1.31s.08-.89.22-1.31V8.79H2.34C1.5 10.33 1 12.09 1 14s.5 3.67 1.34 5.21l3.62-2.96z" />
                      <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.79 1 4.13 3.02 2.34 6.21l3.62 2.96c.86-2.54 3.24-4.42 6.04-4.42z" />
                    </svg>
                    Continuer avec Google
                  </a>
                  {/* Facebook désactivé temporairement */}
                </div>
              </div>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <div className="text-zinc-400">
                  Pas encore de compte ?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-gold-primary hover:text-gold-dark transition-colors group"
                  >
                    <span className="inline-flex items-center justify-center">
                      S'inscrire gratuitement
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-center space-x-2 text-xs text-zinc-400">
                  <Shield className="w-3 h-3" />
                  <span>Connexion sécurisée • SSL encrypté</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;