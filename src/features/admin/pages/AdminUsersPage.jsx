import React, { useEffect, useMemo, useState } from 'react';
import { Search, Shield, Trash2, UserCheck, Pencil, X, Save } from 'lucide-react';
import { adminAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Input } from '../../../components/ui/Input';

const StatusPill = ({ status }) => {
  const cls =
    status === 'active'
      ? 'bg-green-50 text-green-800 ring-1 ring-green-200'
      : status === 'inactive'
      ? 'bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200'
      : status === 'banned'
      ? 'bg-red-50 text-red-800 ring-1 ring-red-200'
      : 'bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200';

  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status || '—'}</span>;
};

const AdminUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({ name: '', nom: '', email: '', telephone: '', status: 'active' });

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getUsers({ page: 1, limit: 100 });
      setItems(Array.isArray(res.data?.users) ? res.data.users : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((u) => `${u.nom || ''} ${u.name || ''} ${u.email || ''} ${u.telephone || ''}`.toLowerCase().includes(q));
  }, [items, search]);

  const openEdit = (u) => {
    setSelected(u);
    setDraft({
      name: u?.name || '',
      nom: u?.nom || '',
      email: u?.email || '',
      telephone: u?.telephone || '',
      status: u?.status || 'active',
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setSelected(null);
  };

  const handleRole = async (id, role) => {
    try {
      const res = await adminAPI.updateUserRole(id, role);
      const updated = res.data;
      setItems((prev) => prev.map((u) => (u._id === id ? { ...u, ...updated } : u)));
    } catch (e) {
      alert(e?.response?.data?.message || 'Mise à jour impossible');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await adminAPI.deleteUser(id);
      setItems((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Suppression impossible');
    }
  };

  const handleSave = async () => {
    if (!selected?._id) return;
    try {
      setSaving(true);
      const res = await adminAPI.updateUser(selected._id, {
        name: draft.name,
        nom: draft.nom,
        email: draft.email,
        telephone: draft.telephone,
        status: draft.status,
      });
      const updated = res.data;
      setItems((prev) => prev.map((u) => (u._id === selected._id ? { ...u, ...updated } : u)));
      closeEdit();
    } catch (e) {
      alert(e?.response?.data?.message || 'Enregistrement impossible');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900">Utilisateurs</h1>
            <div className="mt-1 text-sm text-zinc-600">Gestion des comptes (champs réels)</div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={load}>Rafraîchir</Button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-zinc-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold-primary/10 text-gold-primary">
              <Search className="h-4 w-4" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (nom, email, téléphone)"
              className="h-10 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-gold-primary"
            />
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-red-500/20 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="text-left font-medium px-3 sm:px-4 py-3">Nom</th>
                  <th className="text-left font-medium px-3 sm:px-4 py-3">Email</th>
                  <th className="hidden sm:table-cell text-left font-medium px-3 sm:px-4 py-3">Téléphone</th>
                  <th className="hidden md:table-cell text-left font-medium px-3 sm:px-4 py-3">Statut</th>
                  <th className="text-left font-medium px-3 sm:px-4 py-3">Rôle</th>
                  <th className="text-right font-medium px-3 sm:px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td className="px-3 sm:px-4 py-3 font-medium text-zinc-900">{u.nom || u.name || '—'}</td>
                    <td className="px-3 sm:px-4 py-3 text-zinc-700">{u.email}</td>
                    <td className="hidden sm:table-cell px-3 sm:px-4 py-3 text-zinc-700">{u.telephone || '—'}</td>
                    <td className="hidden md:table-cell px-3 sm:px-4 py-3">
                      <StatusPill status={u.status} />
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className={u.role === 'admin' ? 'text-gold-primary font-semibold' : 'text-zinc-700'}>{u.role}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <Button variant="outline" size="icon" onClick={() => openEdit(u)} className="sm:hidden" aria-label="Modifier">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEdit(u)} className="gap-2 hidden sm:inline-flex">
                          <Pencil className="h-4 w-4" />
                          Modifier
                        </Button>
                        {u.role !== 'admin' ? (
                          <>
                            <Button variant="outline" size="icon" onClick={() => handleRole(u._id, 'admin')} className="sm:hidden" aria-label="Passer admin">
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleRole(u._id, 'admin')} className="gap-2 hidden sm:inline-flex">
                              <Shield className="h-4 w-4" />
                              Admin
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="icon" onClick={() => handleRole(u._id, 'user')} className="sm:hidden" aria-label="Passer user">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleRole(u._id, 'user')} className="gap-2 hidden sm:inline-flex">
                              <UserCheck className="h-4 w-4" />
                              User
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(u._id)}
                          className="sm:hidden text-red-600 hover:text-red-700 hover:border-red-300"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(u._id)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:border-red-300 hidden sm:inline-flex"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editOpen ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/50" onClick={closeEdit} />
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200 max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-200">
                <div>
                  <div className="text-lg font-semibold text-zinc-900">Modifier l'utilisateur</div>
                  <div className="text-sm text-zinc-600">{selected?.email}</div>
                </div>
                <button className="p-2 rounded-xl hover:bg-zinc-100" onClick={closeEdit} aria-label="Fermer">
                  <X className="h-5 w-5 text-zinc-700" />
                </button>
              </div>

              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
                <Input label="Name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
                <Input label="Nom" value={draft.nom} onChange={(e) => setDraft((d) => ({ ...d, nom: e.target.value }))} />
                <Input label="Email" type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
                <Input label="Téléphone" value={draft.telephone} onChange={(e) => setDraft((d) => ({ ...d, telephone: e.target.value }))} />

                <div className="md:col-span-2">
                  <div className="text-sm font-medium text-zinc-900">Statut</div>
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                    className="mt-2 h-10 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-gold-primary"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="banned">banned</option>
                    <option value="deleted">deleted</option>
                  </select>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 border-t border-zinc-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <Button variant="outline" onClick={closeEdit}>Annuler</Button>
                <Button onClick={handleSave} loading={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminUsersPage;
