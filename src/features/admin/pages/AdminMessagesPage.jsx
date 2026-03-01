import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, MailOpen, Mail } from 'lucide-react';
import { adminAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const AdminMessagesPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getMessages({ page: 1, limit: 50 });
      setItems(Array.isArray(res.data?.messages) ? res.data.messages : []);
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
    return items.filter((m) => {
      const t = `${m.contenu || ''} ${m.sujet || ''} ${m.expediteur?.email || ''} ${m.destinataire?.email || ''}`.toLowerCase();
      return t.includes(q);
    });
  }, [items, search]);

  const handleStatus = async (id, lu) => {
    try {
      const res = await adminAPI.updateMessageStatus(id, lu);
      const updated = res.data;
      setItems((prev) => prev.map((m) => (m._id === id ? { ...m, ...updated } : m)));
    } catch (e) {
      alert(e?.response?.data?.message || 'Mise à jour impossible');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await adminAPI.deleteMessage(id);
      setItems((prev) => prev.filter((m) => m._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Suppression impossible');
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
            <h1 className="text-3xl font-semibold text-zinc-900">Messages</h1>
            <div className="mt-1 text-sm text-zinc-600">Suivi des conversations et tickets</div>
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
              placeholder="Rechercher (sujet, contenu, emails)"
              className="h-10 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-gold-primary"
            />
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-red-500/20 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 grid gap-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-zinc-600 ring-1 ring-zinc-200">Aucun message.</div>
          ) : (
            filtered.map((m) => (
              <div key={m._id} className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={m.lu ? 'text-zinc-400' : 'text-gold-primary'}>{m.lu ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}</div>
                      <div className="font-semibold text-zinc-900 truncate">{m.sujet || 'Sans sujet'}</div>
                      <div className="text-xs text-zinc-400">{new Date(m.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="mt-1 text-xs text-zinc-600">
                      <span className="text-zinc-400">De:</span> {m.expediteur?.email || '—'} <span className="text-zinc-300">•</span> <span className="text-zinc-400">À:</span> {m.destinataire?.email || '—'}
                    </div>
                    <div className="mt-3 text-sm text-zinc-700 line-clamp-3">{m.contenu}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/admin/messages/thread/${m.expediteur?._id}`}>
                      <Button variant="outline" size="sm">Ouvrir</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleStatus(m._id, !m.lu)}>
                      {m.lu ? 'Marquer non lu' : 'Marquer lu'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(m._id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesPage;
