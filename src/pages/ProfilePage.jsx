import React, { useEffect, useMemo, useState } from 'react';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { validateEmail, validatePhone } from '../lib/utils';

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
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Mon profil</h1>
          <p className="text-zinc-600">Gérez vos informations personnelles.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gold-primary to-gold-dark px-6 py-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/15 ring-1 ring-white/20 flex items-center justify-center text-white text-3xl font-semibold">
                {initials}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-semibold">{user?.nom || user?.name || 'Utilisateur'}</h2>
                <p className="text-white/80">{user?.email}</p>
                {user?.createdAt ? (
                  <p className="text-white/80 text-sm">
                    Membre depuis{' '}
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-zinc-900">Informations personnelles</h3>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Modifier
                </Button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Input
                  label="Nom complet"
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  error={errors.nom}
                  disabled={!isEditing}
                  className="pl-10"
                />
                <User className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Adresse email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={!isEditing}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Numéro de téléphone"
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  error={errors.telephone}
                  disabled={!isEditing}
                  className="pl-10"
                />
                <Phone className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              </div>

              {isEditing ? (
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" loading={loading} className="gap-2">
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                </div>
              ) : null}
            </form>
          </div>

          <div className="border-t border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Sécurité</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl ring-1 ring-zinc-200">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="font-medium text-zinc-900">Mot de passe</p>
                    <p className="text-sm text-zinc-600">Changez votre mot de passe</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPwdOpen((v) => !v)}>
                  {pwdOpen ? 'Fermer' : 'Modifier'}
                </Button>
              </div>

              {pwdOpen ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      type="password"
                      placeholder="Mot de passe actuel"
                      value={pwdData.currentPassword}
                      onChange={(e) => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                      error={pwdErrors.currentPassword}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Nouveau mot de passe"
                      value={pwdData.newPassword}
                      onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                      error={pwdErrors.newPassword}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Confirmer"
                      value={pwdData.confirm}
                      onChange={(e) => setPwdData({ ...pwdData, confirm: e.target.value })}
                      error={pwdErrors.confirm}
                    />
                  </div>
                  <div className="sm:col-span-2 md:col-span-3 flex flex-col sm:flex-row justify-end gap-3">
                    <Button variant="outline" onClick={() => setPwdOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handlePwdSave}>Enregistrer</Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Statistiques</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-zinc-50 rounded-xl ring-1 ring-zinc-200">
                <div className="text-2xl font-semibold text-zinc-900">{stats.favoritesCount ?? 0}</div>
                <div className="text-sm text-zinc-600">Favoris</div>
              </div>
              <div className="text-center p-4 bg-zinc-50 rounded-xl ring-1 ring-zinc-200">
                <div className="text-2xl font-semibold text-zinc-900">{stats.visitedCount ?? 0}</div>
                <div className="text-sm text-zinc-600">Visites</div>
              </div>
              <div className="text-center p-4 bg-zinc-50 rounded-xl ring-1 ring-zinc-200">
                <div className="text-2xl font-semibold text-zinc-900">{stats.ratingsCount ?? 0}</div>
                <div className="text-sm text-zinc-600">Notes données</div>
              </div>
              <div className="text-center p-4 bg-zinc-50 rounded-xl ring-1 ring-zinc-200">
                <div className="text-2xl font-semibold text-zinc-900">{Number(stats.avgGiven || 0).toFixed(1)}</div>
                <div className="text-sm text-zinc-600">Moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
