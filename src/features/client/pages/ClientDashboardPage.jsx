import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, History, User, CalendarDays, Search, MapPin, Star, Clock, CheckCircle2, XCircle, MessageCircle, Home, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { favoritesAPI, formatDate, formatPrice, reservationAPI, userAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

const ClientDashboardPage = () => {
  const { user } = useAuth();
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
    if (s.includes('confirm')) return { label: 'Confirmée', className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    if (s.includes('annul') || s.includes('cancel')) return { label: 'Annulée', className: 'bg-red-500/10 text-red-400 border border-red-500/20' };
    return { label: 'En attente', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
  };

  const getReservationReference = (r) => r?.reference || r?.support?.reference || r?._id || '-';
  const getReservationLastUpdate = (r) => {
    const history = Array.isArray(r?.statusHistory) ? r.statusHistory : [];
    const lastEvent = history.length ? history[history.length - 1] : null;
    const dt = lastEvent?.at || r?.updatedAt || r?.createdAt || r?.date;
    return dt ? formatDate(dt) : '-';
  };
  const isConfirmedReservation = (r) => String(r?.status || '').toLowerCase().includes('confirm');
  const isAcknowledgedReservation = (r) => Boolean(r?.support?.acknowledgedAt);

  const handleAckReservation = async (id) => {
    try {
      setAckLoadingId(id);
      const res = await reservationAPI.ack(id);
      const updated = res?.data || null;
      if (updated?._id) setReservations((prev) => prev.map((r) => (r._id === id ? updated : r)));
      toast.success('Accusé réception enregistré.');
    } catch (error) {
      toast.error(error?.response?.data?.message || "Impossible d'enregistrer l'accusé.");
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
      toast.error(error?.response?.data?.message || "Impossible d'annuler la réservation.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Ambient BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gold-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-gold-dark/5 rounded-full blur-[120px]" />
      </div>

      {/* Header Banner */}
      <div className="relative bg-zinc-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary mb-4">
            <Sparkles className="h-3 w-3" />
            Espace Membre
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight italic uppercase">
            Bonjour{user?.prenom ? `, ${user.prenom}` : ''}
          </h1>
          <p className="text-zinc-400 font-medium mt-1">Gérez vos favoris, visites et réservations depuis votre espace personnel.</p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="bg-zinc-900 rounded-3xl border border-white/10 p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-5 bg-gold-primary rounded-full" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Actions Rapides</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/favorites', icon: Heart, label: 'Favoris', color: 'text-red-400' },
              { to: '/profile', icon: User, label: 'Mon Profil', color: 'text-blue-400' },
              { to: '/properties', icon: Search, label: 'Rechercher', color: 'text-gold-primary' },
              { to: '/contact', icon: MessageCircle, label: 'Contact', color: 'text-emerald-400' },
            ].map(({ to, icon: Icon, label, color }) => (
              <Link key={to} to={to}>
                <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-gold-primary/30 hover:bg-white/10 transition-all group cursor-pointer">
                  <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Reservations */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gold-primary/10 rounded-xl border border-gold-primary/20">
                <CalendarDays className="h-4 w-4 text-gold-primary" />
              </div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Mes Réservations</h2>
            </div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-5">Suivi statut & WhatsApp</p>

            {recentReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-500 font-medium">Aucune réservation</p>
                <Link to="/properties">
                  <Button className="mt-2 bg-gold-primary/10 text-gold-primary border border-gold-primary/20 hover:bg-gold-primary hover:text-zinc-950 text-xs font-black uppercase tracking-widest rounded-2xl">
                    Explorer les biens
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReservations.map((r) => {
                  const statusMeta = getReservationStatusMeta(r.status);
                  const reference = getReservationReference(r);
                  const whatsappUrl = r?.support?.whatsappUrl || '';
                  const acknowledgedAt = r?.support?.acknowledgedAt ? formatDate(r.support.acknowledgedAt) : '';
                  const showAckAction = isConfirmedReservation(r) && !isAcknowledgedReservation(r);

                  return (
                    <div key={r._id} className="rounded-2xl border border-white/10 p-4 bg-white/5 space-y-3 hover:border-white/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.property?.images?.[0]?.url || '/images/og/og-property.jpg'}
                          alt={r.property?.titre || 'Bien'}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/properties/${r.property?._id}`} className="font-black text-white hover:text-gold-primary truncate block text-sm transition-colors">
                            {r.property?.titre || 'Bien'}
                          </Link>
                          <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {r.date ? formatDate(r.date) : '-'}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest flex-shrink-0 ${statusMeta.className}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                        Réf: <span className="text-zinc-300">{reference}</span> · {getReservationLastUpdate(r)}
                      </div>
                      {acknowledgedAt && (
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" />
                          Accusé le {acknowledgedAt}
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                        <span className="font-black text-gold-primary text-sm">
                          {r.property?.prix != null ? formatPrice(r.property.prix) : '-'}
                        </span>
                        <div className="flex gap-2">
                          {showAckAction && (
                            <button
                              disabled={ackLoadingId === r._id}
                              onClick={() => handleAckReservation(r._id)}
                              className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:border-white/30 transition-all disabled:opacity-50"
                            >
                              {ackLoadingId === r._id ? '...' : "J'accuse réception"}
                            </button>
                          )}
                          {whatsappUrl ? (
                            <Button 
                              size="sm" 
                              className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-all"
                              onClick={() => {
                                const phone = whatsappUrl.split('wa.me/')[1]?.split('?')[0] || '+242061234567';
                                const price = r.property?.prix ? new Intl.NumberFormat('fr-CG').format(r.property.prix) + ' XAF' : 'sur demande';
                                const typeLabel = r.property?.transactionType === 'vente' ? 'Vente' : 'Location';
                                const propertyUrl = `${window.location.origin}/properties/${r.property?._id}`;
                                
                                const message = encodeURIComponent(
                                  `[SCIM Immobilier — Suivi Réservation]\n` +
                                  `━━━━━━━━━━━━━━━━━━━━\n\n` +
                                  `Bonjour, je vous contacte concernant ma réservation (Réf: ${reference}) pour le bien suivant :\n\n` +
                                  `* ${r.property?.titre || 'Bien'}\n` +
                                  `- ${r.property?.adresse ? r.property.adresse + ', ' : ''}${r.property?.ville || ''}\n` +
                                  `- Type : ${r.property?.categorie || ''} — ${typeLabel}\n` +
                                  `- Prix : ${price}\n\n` +
                                  `Lien de l'annonce : ${propertyUrl}\n\n` +
                                  `Merci de me renseigner sur la suite de la procédure.`
                                );
                                window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                              }}
                            >
                              WhatsApp
                            </Button>
                          ) : null}
                          {r.status === 'pending' && (
                            <button
                              onClick={() => handleCancelReservation(r._id)}
                              className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Favorites */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                  <Heart className="h-4 w-4 text-red-400" />
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Favoris</h2>
              </div>
              <Link to="/favorites">
                <span className="text-[10px] font-black text-gold-primary uppercase tracking-widest hover:text-amber-300 transition-colors">
                  Tout voir →
                </span>
              </Link>
            </div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-5">Vos biens sauvegardés</p>

            {favoriteProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-500 font-medium">Aucun favori</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteProperties.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/15 transition-colors group">
                    <img
                      src={p.images?.[0]?.url || '/images/og/og-property.jpg'}
                      alt={p.titre}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/properties/${p._id}`} className="font-black text-white hover:text-gold-primary truncate block text-sm transition-colors">
                        {p.titre}
                      </Link>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-gold-primary" />
                        {p.ville}
                      </div>
                    </div>
                    <div className="font-black text-gold-primary text-sm whitespace-nowrap">{formatPrice(p.prix)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Visited */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <History className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Récemment Visités</h2>
            </div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-5">Vos dernières consultations</p>

            {visited.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-500 font-medium">Aucun bien visité</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visited.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/15 transition-colors group">
                    <img
                      src={(p.images?.[0]?.url || p.image) || '/images/og/og-property.jpg'}
                      alt={p.titre}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/properties/${p._id}`} className="font-black text-white hover:text-gold-primary truncate block text-sm transition-colors">
                        {p.titre}
                      </Link>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-gold-primary" />
                        {p.ville}
                      </div>
                    </div>
                    <div className="font-black text-gold-primary text-sm whitespace-nowrap">{formatPrice(p.prix)}</div>
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
