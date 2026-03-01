import React, { useEffect, useMemo, useState } from 'react';
import { adminAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Search } from 'lucide-react';

const AdminReservationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getReservations({ page: 1, limit: 100 });
      setItems(Array.isArray(res.data?.reservations) ? res.data.reservations : []);
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
    return items.filter((r) => {
      const t = `${r.property?.titre || ''} ${r.user?.nom || ''} ${r.user?.email || ''} ${r.reference || ''}`.toLowerCase();
      return t.includes(q);
    });
  }, [items, search]);

  const handleStatus = async (id, status) => {
    try {
      const res = await adminAPI.updateReservationStatus(id, status);
      const updated = res.data;
      setItems((prev) => prev.map((r) => (r._id === id ? { ...r, ...updated } : r)));
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
            <h1 className="text-3xl font-semibold text-zinc-900">Réservations</h1>
            <div className="mt-1 text-sm text-zinc-600">Gestion des demandes de visite</div>
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
              placeholder="Rechercher (propriété, client, référence)"
              className="h-10 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-gold-primary"
            />
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-red-500/20 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Propriété</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Date de visite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filtered.map((r) => (
                <tr key={r._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">{r.property?.titre || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{r.user?.nom || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{new Date(r.startDate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      r.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      r.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatus(r._id, e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-zinc-600">Aucune réservation trouvée.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReservationsPage;
