import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, History, User, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import { favoritesAPI, formatDate, formatPrice, reservationAPI, userAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';

const ClientDashboardPage = () => {
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [visited, setVisited] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [ackLoadingId, setAckLoadingId] = useState('');

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

  const getReservationStatusMeta = (statusValue) => {
    const s = String(statusValue || '').toLowerCase();
    if (s.includes('confirm')) {
      return { label: 'Confirmee', className: 'bg-emerald-100 text-emerald-700' };
    }
    if (s.includes('annul') || s.includes('cancel')) {
      return { label: 'Annulee', className: 'bg-red-100 text-red-700' };
    }
    return { label: 'En attente', className: 'bg-amber-100 text-amber-700' };
  };

const getReservationReference = (reservation) => {
    return reservation?.reference || reservation?.support?.reference || reservation?._id || '-';
  };

  const getReservationLastUpdate = (reservation) => {
    const history = Array.isArray(reservation?.statusHistory) ? reservation.statusHistory : [];
    const lastEvent = history.length ? history[history.length - 1] : null;
    const dt = lastEvent?.at || reservation?.updatedAt || reservation?.createdAt || reservation?.date;
    return dt ? formatDate(dt) : '-';
  };

  const isConfirmedReservation = (reservation) => String(reservation?.status || '').toLowerCase().includes('confirm');

  const isAcknowledgedReservation = (reservation) => Boolean(reservation?.support?.acknowledgedAt);

  const handleAckReservation = async (id) => {
    try {
      setAckLoadingId(id);
      const res = await reservationAPI.ack(id);
      const updated = res?.data || null;
      if (updated?._id) {
        setReservations((prev) => prev.map((r) => (r._id === id ? updated : r)));
      }
      toast.success('Accuse reception enregistre.');
    } catch (error) {
      toast.error(error?.response?.data?.message || "Impossible d'enregistrer l'accuse.");
    } finally {
      setAckLoadingId('');
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
    try {
      const res = await reservationAPI.cancel(id);
      const updated = res?.data || null;
      if (updated?._id) {
        setReservations((prev) => prev.map((r) => (r._id === id ? updated : r)));
        toast.success('Réservation annulée.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Impossible d\'annuler la réservation.');
    }
  };

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
            {/* <Link to="/messages">
              <Button variant="outline" className="w-full">Messages</Button>
            </Link> */}
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

            <div className="mb-4 text-xs text-zinc-500">
              Suivi web asynchrone: statut, reference et reprise rapide sur WhatsApp si necessaire.
            </div>

            {recentReservations.length === 0 ? (
              <div className="text-sm text-zinc-600">Aucune réservation.</div>
            ) : (
              <div className="space-y-4">
                {/* LEGACY_RESERVATION_LIST_START
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
                LEGACY_RESERVATION_LIST_END */}
                {recentReservations.map((r) => {
                  const statusMeta = getReservationStatusMeta(r.status);
                  const reference = getReservationReference(r);
                  const whatsappUrl = r?.support?.whatsappUrl || '';
                  const acknowledgedAt = r?.support?.acknowledgedAt ? formatDate(r.support.acknowledgedAt) : '';
                  const showAckAction = isConfirmedReservation(r) && !isAcknowledgedReservation(r);

                  return (
                    <div key={r._id} className="rounded-xl border border-zinc-200 p-3 space-y-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.property?.images?.[0]?.url || '/images/og/og-property.jpg'}
                          alt={r.property?.titre || 'Bien'}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/properties/${r.property?._id}`} className="font-medium text-zinc-900 hover:text-gold-primary truncate block">
                            {r.property?.titre || 'Bien'}
                          </Link>
                          <div className="text-xs text-zinc-600">Visite: {r.date ? formatDate(r.date) : '-'}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusMeta.className}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-600">
                        Ref: <span className="font-medium text-zinc-800">{reference}</span> · Mise a jour: {getReservationLastUpdate(r)}
                      </div>
                      {acknowledgedAt ? (
                        <div className="text-xs text-emerald-700">
                          Accuse reception enregistre le {acknowledgedAt}.
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-zinc-900 whitespace-nowrap">
                          {r.property?.prix != null ? formatPrice(r.property.prix) : '-'}
                        </div>
                        <div className="flex items-center gap-2">
                          {showAckAction ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={ackLoadingId === r._id}
                              onClick={() => handleAckReservation(r._id)}
                            >
                              {ackLoadingId === r._id ? '...' : "J'accuse reception"}
                            </Button>
                          ) : null}
                          {whatsappUrl ? (
                            <a href={whatsappUrl} target="_blank" rel="noreferrer">
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                WhatsApp
                              </Button>
                            </a>
                          ) : null}
                          {r.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelReservation(r._id)}
                            >
                              Annuler
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
