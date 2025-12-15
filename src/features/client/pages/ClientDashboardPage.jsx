import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, History, User, CalendarDays } from 'lucide-react';
import { favoritesAPI, formatDate, formatPrice, reservationAPI, userAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';

const ClientDashboardPage = () => {
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [visited, setVisited] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const res = await favoritesAPI.getAll();
        const list = Array.isArray(res.data) ? res.data : [];
        setFavoriteProperties(list);
      } catch (_) {
        setFavoriteProperties([]);
      }
    };
    fetchFavs();
  }, []);

  useEffect(() => {
    const loadVisited = async () => {
      try {
        const res = await userAPI.getVisited({ limit: 10 });
        const items = res.data?.items || [];
        if (Array.isArray(items) && items.length > 0) {
          setVisited(items);
          return;
        }
      } catch (_) {}

      try {
        const key = 'visitedProperties';
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        setVisited(Array.isArray(data) ? data : []);
      } catch (_) {
        setVisited([]);
      }
    };

    loadVisited();
  }, []);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const res = await reservationAPI.my();
        const list = Array.isArray(res.data?.reservations) ? res.data.reservations : [];
        setReservations(list);
      } catch (_) {
        setReservations([]);
      }
    };

    loadReservations();
  }, []);

  const recentReservations = useMemo(() => {
    return [...reservations]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);
  }, [reservations]);

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900">Mon espace</h1>
          <div className="mt-1 text-sm text-zinc-600">Favoris, visites récentes et réservations.</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Link to="/favorites">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                <span>Favoris</span>
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                <span>Profil</span>
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline" className="w-full">Messages</Button>
            </Link>
            <Link to="/properties">
              <Button className="w-full">Rechercher</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-gold-primary" />
                <h2 className="text-lg font-semibold text-zinc-900">Mes réservations</h2>
              </div>
            </div>

            {recentReservations.length === 0 ? (
              <div className="text-sm text-zinc-600">Aucune réservation.</div>
            ) : (
              <div className="space-y-4">
                {recentReservations.map((r) => (
                  <div key={r._id} className="flex items-center gap-4">
                    <img
                      src={r.property?.images?.[0]?.url || '/images/og/og-property.jpg'}
                      alt={r.property?.titre || 'Bien'}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/properties/${r.property?._id}`} className="font-medium text-zinc-900 hover:text-gold-primary truncate block">
                        {r.property?.titre || 'Bien'}
                      </Link>
                      <div className="text-xs text-zinc-600">
                        {r.date ? formatDate(r.date) : '—'} · {r.status}
                      </div>
                    </div>
                    <div className="font-semibold text-zinc-900 whitespace-nowrap">
                      {r.property?.prix != null ? formatPrice(r.property.prix) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-gold-primary" />
                <h2 className="text-lg font-semibold text-zinc-900">Favoris</h2>
              </div>
              <Link to="/favorites">
                <Button size="sm" variant="outline">Tout voir</Button>
              </Link>
            </div>

            {favoriteProperties.length === 0 ? (
              <div className="text-sm text-zinc-600">Aucun favori.</div>
            ) : (
              <div className="space-y-4">
                {favoriteProperties.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center gap-4">
                    <img src={p.images?.[0]?.url || '/images/og/og-property.jpg'} alt={p.titre} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/properties/${p._id}`} className="font-medium text-zinc-900 hover:text-gold-primary truncate block">
                        {p.titre}
                      </Link>
                      <div className="text-sm text-zinc-600">{p.ville}</div>
                    </div>
                    <div className="font-semibold text-zinc-900 whitespace-nowrap">{formatPrice(p.prix)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <History className="h-5 w-5 text-gold-primary" />
              <h2 className="text-lg font-semibold text-zinc-900">Récemment visités</h2>
            </div>

            {visited.length === 0 ? (
              <div className="text-sm text-zinc-600">Aucun bien visité.</div>
            ) : (
              <div className="space-y-4">
                {visited.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center gap-4">
                    <img
                      src={(p.images?.[0]?.url || p.image) ? (p.images?.[0]?.url || p.image) : '/images/og/og-property.jpg'}
                      alt={p.titre}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/properties/${p._id}`} className="font-medium text-zinc-900 hover:text-gold-primary truncate block">
                        {p.titre}
                      </Link>
                      <div className="text-sm text-zinc-600">{p.ville}</div>
                    </div>
                    <div className="font-semibold text-zinc-900 whitespace-nowrap">{formatPrice(p.prix)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
