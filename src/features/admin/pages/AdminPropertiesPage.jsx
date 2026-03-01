import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Pencil, CheckCircle2, PauseCircle } from 'lucide-react';
import { adminAPI, formatPrice } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const AdminPropertiesPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  const load = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getProperties({ page, limit: pagination.limit, search: search || undefined });
      setItems(Array.isArray(res.data?.properties) ? res.data.properties : []);
      setPagination({
        page: res.data?.page || 1,
        limit: res.data?.limit || 10,
        totalPages: res.data?.totalPages || 1,
        totalItems: res.data?.totalProperties || 0,
      });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const t = `${p.titre || ''} ${p.ville || ''} ${p.categorie || ''}`.toLowerCase();
      return t.includes(q);
    });
  }, [items, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    try {
      await adminAPI.deleteProperty(id);
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Suppression impossible');
    }
  };

  const handleToggleStatus = async (p) => {
    const next = p.status === 'active' ? 'inactive' : 'active';
    try {
      await adminAPI.updatePropertyStatus(p._id, next);
      setItems((prev) => prev.map((x) => (x._id === p._id ? { ...x, status: next } : x)));
    } catch (e) {
      alert(e?.response?.data?.message || 'Mise à jour impossible');
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
            <h1 className="text-3xl font-semibold text-zinc-900">Annonces</h1>
            <div className="mt-1 text-sm text-zinc-600">Gestion des propriétés (admin)</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/properties/new">
              <Button>Ajouter</Button>
            </Link>
            <Button variant="outline" onClick={load}>Rafraîchir</Button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); load(1); }} className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-zinc-200 shadow-sm">
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (titre, ville, catégorie)"
              className="h-10 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-gold-primary"
            />
            <Button type="submit" className="gap-2">
              <Search className="h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </form>

        {error ? (
          <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-red-500/20 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 grid gap-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-zinc-600 ring-1 ring-zinc-200">Aucune annonce.</div>
          ) : (
            filtered.map((p) => (
              <div key={p._id} className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-900 truncate">{p.titre}</div>
                    <div className="mt-1 text-sm text-zinc-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span>{p.ville}</span>
                      <span className="text-zinc-300">•</span>
                      <span>{p.categorie}</span>
                      <span className="text-zinc-300">•</span>
                      <span className="font-semibold text-zinc-900">{formatPrice(p.prix)}</span>
                      <span className="text-zinc-300">•</span>
                      <span className={p.status === 'active' ? 'text-green-700' : 'text-zinc-500'}>
                        {p.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(p)} className="gap-2">
                      {p.status === 'active' ? <PauseCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      {p.status === 'active' ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Link to={`/admin/properties/${p._id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(p._id)}
                      className="gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-600">
            Page <span className="font-semibold">{pagination.page}</span> sur <span className="font-semibold">{pagination.totalPages}</span> ({pagination.totalItems} annonces)
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => load(pagination.page - 1)} disabled={pagination.page <= 1}>
              Précédent
            </Button>
            <Button variant="outline" size="sm" onClick={() => load(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPropertiesPage;
