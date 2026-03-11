import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';

export default function VerifyCodePage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email) newErrors.email = 'Email requis';
    if (!code) newErrors.code = 'Code requis';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { authAPI } = await import('../lib/api');
      const res = await authAPI.verifyResetCode(email, code);
      toast.success(res?.data?.message || 'Code valide');
      navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Erreur';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gold-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gold-dark/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
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
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gold-primary/10 rounded-full border border-gold-primary/20 text-[10px] font-black text-gold-primary uppercase tracking-widest backdrop-blur-md">
          <Shield className="w-4 h-4" />
          Vérification de Sécurité
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-[1.1]">
          Validez votre <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-200 to-gold-dark">Identité</span> <br />
          pour continuer.
        </h1>
        <p className="text-lg text-zinc-400 font-medium max-w-sm leading-relaxed">
          Nous veillons à ce que vous soyez le seul à accéder à vos privilèges immobiliers.
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

      <div className="relative w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-zinc-900/40 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden">
        {renderBrandExperience()}

        <div className="p-8 lg:p-16 bg-zinc-900/80 backdrop-blur-3xl flex flex-col justify-center relative border-l border-white/5">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-12">
            <Link to="/" className="mb-6">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                <img src="/images/scim-logo.jpg" alt="SCIM" className="h-12 w-12 rounded-full object-cover" />
              </div>
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight text-center">SCIM <span className="text-gold-primary">SECURITY</span></h1>
          </div>

          <div className="max-w-md mx-auto w-full">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-3xl font-black text-white tracking-tight mb-3">Vérification du Code</h2>
              <p className="text-zinc-400 font-medium">Saisissez l'email et le code reçu pour sécuriser votre accès.</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">E-mail</label>
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
                {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Code Secret</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-gold-primary">
                    <KeyRound className="w-5 h-5 text-zinc-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    className="w-full h-16 pl-16 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white text-center text-xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all"
                    required
                  />
                </div>
                {errors.code && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.code}</p>}
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full h-16 bg-gold-primary hover:bg-amber-300 text-zinc-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(201,162,39,0.2)]"
              >
                Confirmer l'Identité
              </Button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full h-16 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
