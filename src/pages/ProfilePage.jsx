import React, { useEffect, useMemo, useState } from 'react';
import { User, Mail, Phone, Lock, Save, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn, validateEmail, validatePhone } from '../lib/utils';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();

  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwdErrors, setPwdErrors] = useState({});

  const [stats, setStats] = useState({ favoritesCount: 0, visitedCount: 0, ratingsCount: 0, avgGiven: 0 });

  useEffect(() => {
    setFormData({
      nom: user?.nom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
    });
  }, [user?._id]);

  useEffect(() => {
    (async () => {
      try {
        const { userAPI } = await import('../lib/api');
        const res = await userAPI.getStats();
        setStats(res.data || {});
      } catch (_) {}
    })();
  }, []);

  const initials = useMemo(() => {
    const n = user?.nom || user?.name || user?.email || '';
    const parts = String(n).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
  }, [user?.nom, user?.name, user?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const next = {};

    if (!formData.nom.trim()) next.nom = 'Le nom est requis';

    if (!formData.email) next.email = "L'email est requis";
    else if (!validateEmail(formData.email)) next.email = "Format d'email invalide";

    if (!formData.telephone) next.telephone = 'Le téléphone est requis';
    else if (!validatePhone(formData.telephone)) next.telephone = 'Format de téléphone invalide';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await updateProfile({ ...formData, _id: user?._id || user?.id });
    if (result.success) setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nom: user?.nom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const validatePwd = () => {
    const e = {};
    if (!pwdData.currentPassword) e.currentPassword = 'Mot de passe actuel requis';
    if (!pwdData.newPassword) e.newPassword = 'Nouveau mot de passe requis';
    else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwdData.newPassword)) {
      e.newPassword = 'Doit contenir majuscule, minuscule, chiffre et symbole';
    }
    if (pwdData.newPassword !== pwdData.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    setPwdErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePwdSave = async () => {
    if (!validatePwd()) return;
    try {
      const { userAPI } = await import('../lib/api');
      await userAPI.changePassword(user?._id || user?.id, pwdData.currentPassword, pwdData.newPassword);
      setPwdOpen(false);
      setPwdData({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-32">
       {/* Premium Hero Header */}
       <div className="relative h-80 overflow-hidden">
          <div className="absolute inset-0 bg-zinc-900">
             <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201,162,39,0.2) 1px, transparent 0)`,
                backgroundSize: '32px 32px'
             }} />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
             <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 md:gap-8 text-center sm:text-left">
                <div className="relative group">
                   <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl sm:rounded-[40px] bg-zinc-800 border-4 border-zinc-950 overflow-hidden shadow-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-gold-primary transition-all duration-500 group-hover:scale-105">
                      {initials}
                   </div>
                   <div className="absolute -bottom-2 -right-2 p-2 sm:p-3 bg-gold-primary rounded-xl sm:rounded-2xl shadow-xl text-zinc-950 group-hover:rotate-12 transition-all">
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                   </div>
                </div>
                
                <div className="flex-1 space-y-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black text-gold-primary uppercase tracking-widest">
                      Profil Prestige
                   </div>
                   <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                      {user?.nom || user?.name || 'Utilisateur'}
                   </h1>
                   <p className="text-zinc-400 font-medium flex items-center gap-4">
                      <span>{user?.email}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                      <span>Membre depuis {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'récemment'}</span>
                   </p>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                   {!isEditing ? (
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        className="h-14 px-8 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Paramètres
                      </Button>
                   ) : (
                      <Button 
                        onClick={handleCancel} 
                        variant="outline"
                        className="h-14 px-8 bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest"
                      >
                        Annuler
                      </Button>
                   )}
                </div>
             </div>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             {/* Left Column: Form & Security */}
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-zinc-900/50 backdrop-blur-xl rounded-[40px] border border-white/5 p-10 shadow-2xl">
                   <div className="flex items-center justify-between mb-12">
                      <h3 className="text-xl font-black text-white tracking-tight">Identité Numérique</h3>
                      <div className="w-12 h-1 bg-gold-primary/20 rounded-full" />
                   </div>

                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">Nom Patronyme</label>
                            <Input
                              type="text"
                              name="nom"
                              value={formData.nom}
                              onChange={handleChange}
                              error={errors.nom}
                              disabled={!isEditing}
                              className="h-16 px-8 bg-zinc-950/50 border-white/5 rounded-[24px] text-white focus:ring-gold-primary transition-all font-bold disabled:opacity-50"
                              leftIcon={<User className="w-5 h-5 text-gold-primary/40" />}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">Communication Professionnelle</label>
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              error={errors.email}
                              disabled={!isEditing}
                              className="h-16 px-8 bg-zinc-950/50 border-white/5 rounded-[24px] text-white focus:ring-gold-primary transition-all font-bold disabled:opacity-50"
                              leftIcon={<Mail className="w-5 h-5 text-gold-primary/40" />}
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">Ligne Directe</label>
                         <Input
                           type="tel"
                           name="telephone"
                           value={formData.telephone}
                           onChange={handleChange}
                           error={errors.telephone}
                           disabled={!isEditing}
                           className="h-16 px-8 bg-zinc-950/50 border-white/5 rounded-[24px] text-white focus:ring-gold-primary transition-all font-bold disabled:opacity-50"
                           leftIcon={<Phone className="w-5 h-5 text-gold-primary/40" />}
                         />
                      </div>

                      {isEditing && (
                        <Button 
                          type="submit" 
                          loading={loading} 
                          className="w-full h-18 bg-gold-primary hover:bg-gold-dark text-zinc-950 rounded-[28px] font-black uppercase tracking-[0.25em] text-xs shadow-2xl transition-all duration-500 hover:-translate-y-1"
                        >
                          Enregistrer les Modifications
                        </Button>
                      )}
                   </form>
                </div>

                {/* Security Section */}
                <div className="bg-zinc-900/50 backdrop-blur-xl rounded-[32px] md:rounded-[40px] border border-white/5 p-6 md:p-10 shadow-2xl">
                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-zinc-950 rounded-2xl text-gold-primary">
                            <Lock className="w-6 h-6" />
                         </div>
                         <h3 className="text-xl font-black text-white tracking-tight">Sécurisation du Compte</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={() => setPwdOpen(!pwdOpen)}
                        className="text-gold-primary font-black uppercase tracking-widest text-[10px] hover:bg-gold-primary/10"
                      >
                         {pwdOpen ? 'Annuler' : 'Changer le Pass'}
                      </Button>
                   </div>

                   {pwdOpen && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <Input
                             type="password"
                             placeholder="Pass actuel"
                             value={pwdData.currentPassword}
                             onChange={(e) => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                             error={pwdErrors.currentPassword}
                             className="h-16 px-8 bg-zinc-950/50 border-white/5 rounded-[24px] text-white font-mono"
                           />
                           <Input
                             type="password"
                             placeholder="Nouveau Pass"
                             value={pwdData.newPassword}
                             onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                             error={pwdErrors.newPassword}
                             className="h-16 px-8 bg-zinc-950/50 border-white/5 rounded-[24px] text-white font-mono"
                           />
                        </div>
                        <Button 
                          onClick={handlePwdSave}
                          className="w-full h-16 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px]"
                        >
                           Mettre à jour la Sécurité
                        </Button>
                     </div>
                   )}
                </div>
             </div>

             {/* Right Column: Stats & Meta */}
             <div className="space-y-8">
                <div className="bg-gradient-to-br from-gold-primary to-gold-dark rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-2xl shadow-gold-primary/20 text-zinc-950">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-60">Volume d'Activité</h4>
                   <div className="space-y-10">
                      <div className="flex items-end justify-between">
                         <div>
                            <div className="text-5xl font-black tracking-tighter leading-none">{stats.favoritesCount ?? 0}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest mt-2">Favoris Sélectionnés</div>
                         </div>
                         <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-gold-primary">
                            <Star className="w-6 h-6" />
                         </div>
                      </div>
                      
                      <div className="h-px bg-zinc-950/10" />

                      <div className="flex items-end justify-between">
                         <div>
                            <div className="text-5xl font-black tracking-tighter leading-none">{stats.ratingsCount ?? 0}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest mt-2">Critiques Émises</div>
                         </div>
                         <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-gold-primary">
                            <Save className="w-6 h-6" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-8">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Assistance Premium</h4>
                   <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8">
                      Bénéficiez d'une assistance prioritaire 24/7 pour toutes vos transactions et recherches exclusives.
                   </p>
                   <Button className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                      Contacter le Concierge
                   </Button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ProfilePage;
