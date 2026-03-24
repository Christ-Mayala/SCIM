import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';

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
    if (!token && (!emailParam || !codeParam)) {
      toast.error('Paramètres manquants');
      navigate('/forgot-password');
      return;
    }

    if (token) {
      verifyToken();
    } else {
      setIsTokenValid(true);
      setUserEmail(emailParam);
    }
  }, [token, navigate]);

  const verifyToken = async () => {
    try {
      const { authAPI } = await import('../lib/api');
      const response = await authAPI.verifyResetCode(emailParam, codeParam);
      setIsTokenValid(true);
      setUserEmail(response?.data?.email || emailParam || '');
    } catch (error) {
      setIsTokenValid(false);
      const message = error?.response?.data?.message || error?.message || 'Erreur de connexion au serveur';
      toast.error(message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const { newPassword, confirmPassword } = formData;
    const newErrors = {};

    const passwordError = validatePassword(newPassword);
    if (passwordError) newErrors.newPassword = passwordError;
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { authAPI } = await import('../lib/api');
      await authAPI.resetPassword(
        token ? userEmail : emailParam,
        token ? undefined : codeParam,
        newPassword
      );
      setIsPasswordReset(true);
      toast.success('Mot de passe réinitialisé avec succès !');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Erreur de connexion au serveur';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gold-primary/10 rounded-full blur-[120px] will-change-transform" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gold-dark/5 rounded-full blur-[120px] will-change-transform" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
    </div>
  );

  const renderBrandExperience = () => (
    <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-gold-primary transition-all duration-500 shadow-2xl">
            <img src="/images/scim-logo.jpg" alt="SCIM" className="h-10 w-10 rounded-full object-cover" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-white tracking-widest leading-none">SCIM</div>
            <div className="text-[10px] font-black text-gold-primary uppercase tracking-[0.3em]">Immobilier de Luxe</div>
          </div>
        </Link>
      </div>

      <div className="relative z-10 space-y-8">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gold-primary/10 rounded-full border border-gold-primary/20 text-[10px] font-black text-gold-primary uppercase tracking-widest">
          <Shield className="w-4 h-4" />
          Réinitialisation Maîtrisée
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-[1.1]">
          Définissez votre <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-200 to-gold-dark">Nouvel Accès</span> <br />
          en toute sécurité.
        </h1>
        <p className="text-lg text-zinc-400 font-medium max-w-sm leading-relaxed">
          Choisissez un mot de passe robuste pour protéger vos opportunités exclusives.
        </p>
      </div>

      <div className="relative z-10 pt-10 border-t border-white/5">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
          Congo-Brazzaville <span className="w-1 h-1 bg-gold-primary rounded-full" /> Excellence
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 flex items-center justify-center p-6">
      {renderBackground()}

      <div className="relative w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-zinc-900 rounded-[40px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden">
        {renderBrandExperience()}

        <div className="p-8 lg:p-16 bg-zinc-900 flex flex-col justify-center relative border-l border-white/5">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-12">
            <Link to="/" className="mb-6">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                <img src="/images/scim-logo.jpg" alt="SCIM" className="h-12 w-12 rounded-full object-cover" />
              </div>
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight text-center">SCIM <span className="text-gold-primary">REBOOT</span></h1>
          </div>

          <div className="max-w-md mx-auto w-full">
            {isTokenValid === null ? (
               <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-primary mx-auto mb-4" />
                  <p className="text-zinc-400 font-medium">Vérification de sécurité...</p>
               </div>
            ) : isTokenValid === false ? (
               <div className="text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_20px_40px_rgba(239,68,68,0.1)]">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-4">Lien Expiré</h2>
                  <p className="text-zinc-400 font-medium mb-8">Ce jeton de sécurité n'est plus valide. Veuillez demander une nouvelle réinitialisation.</p>
                  <Link to="/forgot-password" title="Demander un nouveau lien">
                    <Button className="w-full h-16 bg-gold-primary text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-xs">Recommencer</Button>
                  </Link>
               </div>
            ) : isPasswordReset ? (
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_20px_40px_rgba(16,185,129,0.1)]">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-4">Mise à Jour Réussie</h2>
                <p className="text-zinc-400 font-medium mb-8">Votre nouveau mot de passe est actif. Vous pouvez maintenant rejoindre votre espace membre.</p>
                <Link to="/login">
                  <Button className="w-full h-16 bg-gold-primary text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-xs">Accéder à la Connexion</Button>
                </Link>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-12 text-center lg:text-left">
                  <h2 className="text-3xl font-black text-white tracking-tight mb-3">Nouveau Mot de Passe</h2>
                  <p className="text-zinc-400 font-medium">Définissez vos nouveaux identifiants pour {userEmail}.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nouveau Mot de Passe</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-gold-primary">
                        <Lock className="w-5 h-5 text-zinc-500 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full h-16 pl-16 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-mono font-bold"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.newPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Confirmer le Mot de Passe</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-gold-primary">
                        <Lock className="w-5 h-5 text-zinc-500 transition-colors" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full h-16 pl-16 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-mono font-bold"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.confirmPassword}</p>}
                  </div>

                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full h-16 bg-gold-primary hover:bg-amber-300 text-zinc-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(201,162,39,0.2)]"
                  >
                    Réinitialiser mon Accès
                  </Button>
                </form>

                <div className="mt-12 text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 group text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] transition-all">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Annuler et Retourner
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
