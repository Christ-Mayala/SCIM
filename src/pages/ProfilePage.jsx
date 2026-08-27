import React, { useEffect, useMemo, useState } from 'react';
import {
  User, Mail, Phone, Lock, Save, Star, Eye, MessageSquare,
  Settings, Calendar, Heart, Shield, Award, Sparkles, ArrowRight,
  Home, Bell, History, LogOut, UserCircle, Camera, Edit3,
  Building2, TrendingUp, CheckCircle, AlertCircle, ChevronRight,
  Key, EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn, validateEmail, validatePhone } from '../lib/utils';
import { normalizePhoneE164 } from '../lib/phone';
import toast from 'react-hot-toast';
import { IncompleteProfileBanner } from '../components/features/IncompleteProfileBanner';

/* ── small helpers ── */
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className={cn('flex items-center justify-between p-4 rounded-2xl border border-white/[0.06] transition-all hover:border-white/10 group', bg || 'bg-zinc-950/50')}>
    <div className="flex items-center gap-3">
      <div className={cn('p-2.5 rounded-xl', `bg-${color}-500/10`)}>
        <Icon className={cn('w-4 h-4', `text-${color}-400`)} />
      </div>
      <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">{label}</span>
    </div>
    <span className="text-2xl font-black text-white">{value}</span>
  </div>
);

const FieldLabel = ({ children }) => (
  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{children}</label>
);

const ProfilePage = () => {
  const { user, updateProfile, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

  const [formData, setFormData] = useState({ nom: user?.nom || '', email: user?.email || '', telephone: user?.telephone || '' });
  const [errors, setErrors] = useState({});
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwdErrors, setPwdErrors] = useState({});
  const [stats, setStats] = useState({ favoritesCount: 0, visitedCount: 0, ratingsCount: 0 });

  useEffect(() => {
    setFormData({ nom: user?.nom || '', email: user?.email || '', telephone: user?.telephone || '' });
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
    if (!parts.length) return 'U';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [user?.nom, user?.name, user?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validateForm = () => {
    const n = {};
    if (!formData.nom.trim()) n.nom = 'Le nom est requis';
    if (!formData.email) n.email = "L'email est requis";
    else if (!validateEmail(formData.email)) n.email = "Email invalide";
    if (!formData.telephone) n.telephone = 'Le téléphone est requis';
    else if (!validatePhone(formData.telephone)) n.telephone = 'Numéro invalide. Ex: 06 123 45 67';
    setErrors(n);
    return !Object.keys(n).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const normalizedPhone = normalizePhoneE164(formData.telephone);
    if (!normalizedPhone) {
      setErrors((prev) => ({ ...prev, telephone: 'Numero de telephone invalide. Ex: 06 123 45 67' }));
      return;
    }
    const res = await updateProfile({ ...formData, telephone: normalizedPhone, _id: user?._id || user?.id });
    if (res.success) setIsEditing(false);
  };

  const validatePwd = () => {
    const e = {};
    if (!pwdData.currentPassword) e.currentPassword = 'Requis';
    if (!pwdData.newPassword) e.newPassword = 'Requis';
    else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwdData.newPassword))
      e.newPassword = 'Doit contenir MAJ, min, chiffre et symbole (8+ cars)';
    if (pwdData.newPassword !== pwdData.confirm) e.confirm = 'Mots de passe différents';
    setPwdErrors(e);
    return !Object.keys(e).length;
  };

  const handlePwdSave = async () => {
    if (!validatePwd()) return;
    try {
      const { userAPI } = await import('../lib/api');
      await userAPI.changePassword(user?._id || user?.id, pwdData.currentPassword, pwdData.newPassword);
      setPwdData({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Mot de passe mis à jour !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : 'récemment';

  const tabs = [
    { id: 'profile',   label: 'Profil',   icon: UserCircle },
    { id: 'security',  label: 'Sécurité', icon: Shield },
    { id: 'activity',  label: 'Activité', icon: History },
  ];

  const quickLinks = [
    { label: 'Tableau de bord', icon: Home,         to: '/dashboard',  color: 'gold',    colorHex: 'text-gold-primary', bg: 'bg-gold-primary/10'  },
    { label: 'Mes favoris',     icon: Heart,        to: '/favorites',  color: 'rose',    colorHex: 'text-rose-400',     bg: 'bg-rose-500/10'      },
    { label: 'Messages',        icon: MessageSquare,to: '/messages',   color: 'blue',    colorHex: 'text-blue-400',     bg: 'bg-blue-500/10'      },
    { label: 'Soumettre un bien',icon: Building2,   to: '/soumettre-bien', color:'emerald', colorHex:'text-emerald-400', bg:'bg-emerald-500/10'  },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <IncompleteProfileBanner />

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden">
        {/* bg */}
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-primary/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/30 to-zinc-950" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            {/* avatar */}
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-gold-primary/20 rounded-[36px] blur-3xl group-hover:bg-gold-primary/30 transition-colors" />
              <div className="relative w-32 h-32 rounded-[36px] bg-gradient-to-br from-gold-primary via-amber-300 to-amber-600 border-4 border-zinc-950 flex items-center justify-center text-5xl font-black text-black shadow-2xl shadow-gold-primary/30 transition-all group-hover:scale-105">
                {initials}
              </div>
              {/* role badge */}
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-zinc-950 border border-gold-primary/30 rounded-lg text-[8px] font-black text-gold-primary uppercase tracking-widest">
                {user?.role === 'admin' ? 'Admin' : 'Membre'}
              </div>
            </div>

            {/* info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black text-gold-primary uppercase tracking-[0.25em] mb-4">
                <Sparkles className="w-3 h-3" /> Profil SCIM
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic mb-2">
                {user?.nom || user?.name || 'Utilisateur'}<span className="text-gold-primary">.</span>
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-zinc-400">
                <span className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gold-primary" />{user?.email}</span>
                {user?.telephone && <span className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gold-primary" />{user.telephone}</span>}
                <span className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-gold-primary" />Membre depuis {memberSince}</span>
              </div>
            </div>

            {/* action */}
            <div className="shrink-0">
              {!isEditing ? (
                <button onClick={() => { setActiveTab('profile'); setIsEditing(true); }}
                  className="flex items-center gap-2.5 h-12 px-7 bg-gold-primary hover:bg-amber-300 text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-gold-primary/20 hover:-translate-y-0.5">
                  <Edit3 className="w-4 h-4" /> Modifier le profil
                </button>
              ) : (
                <button onClick={() => setIsEditing(false)}
                  className="h-12 px-7 border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  Annuler
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ─ Sidebar ─ */}
          <div className="lg:col-span-4 space-y-5">
            {/* quick links */}
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/[0.07] p-6">
              <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-5">Accès Rapide</h3>
              <div className="space-y-1.5">
                {quickLinks.map((l, i) => (
                  <Link key={i} to={l.to}
                    className="group flex items-center gap-3 p-3.5 rounded-2xl hover:bg-zinc-950/60 transition-all">
                    <div className={cn('p-2.5 rounded-xl', l.bg)}>
                      <l.icon className={cn('w-4 h-4', l.colorHex)} />
                    </div>
                    <span className="font-bold text-zinc-300 group-hover:text-white text-sm transition-colors flex-1">{l.label}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* stats */}
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/[0.07] p-6">
              <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-5">Vue d'ensemble</h3>
              <div className="space-y-3">
                <StatCard icon={Heart} label="Favoris" value={stats.favoritesCount ?? 0} color="rose" />
                <StatCard icon={Eye} label="Biens visités" value={stats.visitedCount ?? 0} color="blue" />
                <StatCard icon={Star} label="Avis postés" value={stats.ratingsCount ?? 0} color="yellow" />
              </div>
            </div>

            {/* logout */}
            <button onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/5 border border-red-500/10 text-red-400 rounded-3xl hover:bg-red-500/10 hover:border-red-500/20 transition-all group">
              <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span className="font-black uppercase tracking-widest text-xs">Déconnexion</span>
            </button>
          </div>

          {/* ─ Main ─ */}
          <div className="lg:col-span-8 space-y-5">
            {/* tabs */}
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/[0.07] p-2">
              <div className="flex gap-2">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all',
                      activeTab === t.id
                        ? 'bg-gold-primary text-black shadow-xl shadow-gold-primary/20'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    )}>
                    <t.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* tab content */}
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/[0.07] p-7 sm:p-9">

              {/* ── Profile tab ── */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight italic">Informations Personnelles</h3>
                    <p className="text-zinc-500 text-sm mt-1">Gérez vos coordonnées et votre profil public.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <FieldLabel>Nom complet</FieldLabel>
                      <Input type="text" name="nom" value={formData.nom} onChange={handleChange}
                        error={errors.nom} disabled={!isEditing}
                        className="h-13 bg-zinc-950/50 border-white/[0.07] rounded-2xl text-white disabled:opacity-50"
                        leftIcon={<User className="w-4 h-4 text-zinc-500" />} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel>Email</FieldLabel>
                        <Input type="email" name="email" value={formData.email} onChange={handleChange}
                          error={errors.email} disabled={!isEditing}
                          className="h-13 bg-zinc-950/50 border-white/[0.07] rounded-2xl text-white disabled:opacity-50"
                          leftIcon={<Mail className="w-4 h-4 text-zinc-500" />} />
                      </div>
                      <div>
                        <FieldLabel>Téléphone</FieldLabel>
                        <Input type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
                          error={errors.telephone} disabled={!isEditing}
                          className="h-13 bg-zinc-950/50 border-white/[0.07] rounded-2xl text-white disabled:opacity-50"
                          leftIcon={<Phone className="w-4 h-4 text-zinc-500" />} />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex gap-4 pt-2">
                        <Button type="submit" loading={loading}
                          className="flex-1 h-13 bg-gold-primary hover:bg-amber-300 text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-gold-primary/20">
                          <Save className="mr-2 w-4 h-4" /> Enregistrer
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}
                          className="h-13 px-7 bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs">
                          Annuler
                        </Button>
                      </div>
                    )}
                  </form>

                  {/* info chips */}
                  {!isEditing && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
                      {[
                        { icon: CheckCircle, label: 'Compte vérifié', ok: true },
                        { icon: Shield, label: user?.role === 'admin' ? 'Administrateur' : 'Utilisateur standard', ok: true },
                        { icon: Calendar, label: `Depuis ${memberSince}`, ok: true },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 bg-zinc-950/50 border border-white/[0.06] rounded-2xl">
                          <c.icon className={cn('w-4 h-4 shrink-0', c.ok ? 'text-emerald-400' : 'text-zinc-600')} />
                          <span className="text-xs font-medium text-zinc-400">{c.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Security tab ── */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight italic">Sécurité du Compte</h3>
                    <p className="text-zinc-500 text-sm mt-1">Mettez à jour votre mot de passe pour sécuriser votre compte.</p>
                  </div>
                  <div className="space-y-5">
                    {[
                      { key: 'currentPassword', label: 'Mot de passe actuel', pwdKey: 'current' },
                      { key: 'newPassword', label: 'Nouveau mot de passe', pwdKey: 'new' },
                      { key: 'confirm', label: 'Confirmer le mot de passe', pwdKey: 'confirm' },
                    ].map(f => (
                      <div key={f.key}>
                        <FieldLabel>{f.label}</FieldLabel>
                        <div className="relative">
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                          <input type={showPwd[f.pwdKey] ? 'text' : 'password'} placeholder="••••••••"
                            value={pwdData[f.key]}
                            onChange={e => setPwdData(p => ({...p, [f.key]: e.target.value}))}
                            className={cn(
                              'w-full pl-11 pr-12 py-3.5 bg-zinc-950/50 border rounded-2xl text-sm text-white placeholder:text-zinc-700 outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all',
                              pwdErrors[f.key] ? 'border-red-500/40' : 'border-white/[0.07]'
                            )} />
                          <button type="button" onClick={() => setShowPwd(p => ({...p, [f.pwdKey]: !p[f.pwdKey]}))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg">
                            {showPwd[f.pwdKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {pwdErrors[f.key] && <p className="mt-1.5 text-[9px] font-bold text-red-400 uppercase tracking-widest">{pwdErrors[f.key]}</p>}
                      </div>
                    ))}
                    {/* strength hint */}
                    <div className="p-4 bg-zinc-950/50 border border-white/[0.06] rounded-2xl">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Règles de sécurité</p>
                      {['8 caractères minimum', 'Une lettre majuscule', 'Une lettre minuscule', 'Un chiffre', 'Un caractère spécial'].map(r => (
                        <div key={r} className="flex items-center gap-2 mb-1">
                          <div className={cn('w-1.5 h-1.5 rounded-full',
                            pwdData.newPassword && new RegExp(
                              r.includes('8') ? '.{8,}' : r.includes('maj') ? '[A-Z]' : r.includes('min') ? '[a-z]' : r.includes('chif') ? '[0-9]' : '[^A-Za-z0-9]'
                            ).test(pwdData.newPassword) ? 'bg-emerald-400' : 'bg-zinc-700'
                          )} />
                          <span className="text-[10px] text-zinc-500">{r}</span>
                        </div>
                      ))}
                    </div>
                    <Button onClick={handlePwdSave}
                      className="h-13 w-full bg-gold-primary hover:bg-amber-300 text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-gold-primary/20">
                      <Lock className="mr-2 w-4 h-4" /> Mettre à jour le mot de passe
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Activity tab ── */}
              {activeTab === 'activity' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight italic">Activité Récente</h3>
                    <p className="text-zinc-500 text-sm mt-1">Suivez vos interactions sur la plateforme SCIM.</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10', title: 'Favoris mis à jour', desc: 'Votre liste de favoris a été actualisée', time: "Aujourd'hui" },
                      { icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'Propriétés consultées', desc: 'Vous avez consulté plusieurs biens récemment', time: 'Récemment' },
                      { icon: MessageSquare, color: 'text-gold-primary', bg: 'bg-gold-primary/10', title: 'Messagerie active', desc: 'Vos conversations avec SCIM sont accessibles', time: 'En continu' },
                    ].map((a, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 bg-zinc-950/40 border border-white/[0.06] rounded-2xl hover:border-white/10 transition-all group">
                        <div className={cn('p-3 rounded-xl shrink-0', a.bg)}>
                          <a.icon className={cn('w-5 h-5', a.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-black text-white text-sm">{a.title}</h4>
                            <span className="text-[10px] text-zinc-500 shrink-0">{a.time}</span>
                          </div>
                          <p className="text-sm text-zinc-500">{a.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/[0.06] flex gap-4">
                    <Link to="/properties"
                      className="flex items-center gap-2.5 px-6 py-3 bg-gold-primary text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-300 transition-all hover:-translate-y-0.5 shadow-lg shadow-gold-primary/20">
                      <Building2 className="w-4 h-4" /> Explorer les biens
                    </Link>
                    <Link to="/messages"
                      className="flex items-center gap-2.5 px-6 py-3 bg-zinc-900 border border-white/10 text-zinc-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
                      <MessageSquare className="w-4 h-4" /> Mes messages
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
