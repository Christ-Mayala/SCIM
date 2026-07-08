import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { validateEmail } from '../lib/utils';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useNavigate();

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

      setIsEmailSent(true);
      setShowCodeInput(false);
      setResetCode('');
      toast.success(response?.data?.message || 'Email de réinitialisation envoyé');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Erreur de connexion au serveur';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    const trimmedCode = String(resetCode || '').trim();
    if (!trimmedCode) {
      setErrors((prev) => ({ ...prev, code: 'Le code est requis' }));
      return;
    }

    setErrors((prev) => ({ ...prev, code: '' }));
    setIsVerifyingCode(true);

    try {
      const { authAPI } = await import('../lib/api');
      await authAPI.verifyResetCode(email, trimmedCode);
      toast.success('Code valide');
      navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(trimmedCode)}`);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Code invalide';
      setErrors((prev) => ({ ...prev, code: message }));
      toast.error(message);
    } finally {
      setIsVerifyingCode(false);
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
          <KeyRound className="w-4 h-4" />
          Récupération Sécurisée
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-[1.1]">
          Protégez votre <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-200 to-gold-dark">Patrimoine</span> <br />
          en toute confiance.
        </h1>
        <p className="text-lg text-zinc-400 font-medium max-w-sm leading-relaxed">
          Accédez à vos actifs en quelques clics grâce à notre protocole de récupération blindé.
        </p>
      </div>

      <div className="relative z-10 pt-10 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
            Congo-Brazzaville <span className="w-1 h-1 bg-gold-primary rounded-full" /> Excellence
          </p>
        </div>
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
            <h1 className="text-3xl font-black text-white tracking-tight text-center">SCIM <span className="text-gold-primary">RÉCUPÉRATION</span></h1>
          </div>

          <div className="max-w-md mx-auto w-full">
            {isEmailSent ? (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_20px_40px_rgba(16,185,129,0.1)]">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                
                <h2 className="text-3xl font-black text-white tracking-tight mb-4">Email Envoyé</h2>
                <p className="text-zinc-400 font-medium mb-8">
                  Instructions de réinitialisation transmises à <span className="text-white font-bold">{email}</span>.
                </p>

                {!showCodeInput ? (
                  <Button
                    onClick={() => setShowCodeInput(true)}
                    className="w-full h-16 bg-white/5 border border-white/10 hover:border-gold-primary/50 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all mb-4"
                  >
                    Entrer le code manuel
                  </Button>
                ) : (
                  <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-[32px] text-left">
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Code de Vérification</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center text-zinc-500 transition-colors group-focus-within:text-gold-primary">
                            <KeyRound className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full h-16 pl-16 pr-6 bg-zinc-950/50 border border-white/10 rounded-2xl text-white text-center text-xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all"
                            placeholder="000000"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        loading={isVerifyingCode}
                        className="w-full h-14 bg-gold-primary text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                      >
                        Valider le Code
                      </Button>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  <Link to="/login">
                    <Button variant="outline" className="w-full h-16 border-white/10 text-white hover:bg-white/5 rounded-2xl font-black uppercase tracking-widest text-xs">
                      Retour à la Connexion
                    </Button>
                  </Link>
                  <button
                    onClick={() => { setIsEmailSent(false); setShowCodeInput(false); }}
                    className="text-xs font-black text-gold-primary uppercase tracking-[0.2em] hover:text-amber-200 transition-colors"
                  >
                    Renvoyer la demande
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-12 text-center lg:text-left">
                  <h2 className="text-3xl font-black text-white tracking-tight mb-3">Oubli de Mot de Passe ?</h2>
                  <p className="text-zinc-400 font-medium">Récupérez l'accès à votre profil prestige en quelques secondes.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">E-mail de Récupération</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-gold-primary">
                        <Mail className="w-5 h-5 text-zinc-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@prestige.com"
                        className="w-full h-16 pl-16 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-bold"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full h-16 bg-gold-primary hover:bg-amber-300 text-zinc-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(201,162,39,0.2)] hover:shadow-[0_25px_50px_rgba(201,162,39,0.3)] transition-all duration-500"
                  >
                    Envoyer le lien de secours
                  </Button>
                </form>

                <div className="mt-12 text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 group text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] transition-all">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Retour à la Conciergerie
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

export default ForgotPasswordPage;

