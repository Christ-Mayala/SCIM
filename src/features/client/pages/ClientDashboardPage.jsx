import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, History, User, CalendarDays, Search, MapPin, Star, Clock, CheckCircle2, XCircle, MessageCircle, Home, Sparkles, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { favoritesAPI, formatDate, formatPrice, reservationAPI, userAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessage } from '../../../contexts/MessageContext';
import { toWhatsAppNumber } from '../../../lib/phone';
import { IncompleteProfileBanner } from '../../../components/features/IncompleteProfileBanner';

const ClientDashboardPage = () => {
  const { user } = useAuth();
  const { unreadCount, fetchUnreadCount } = useMessage();
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [visited, setVisited] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [ackLoadingId, setAckLoadingId] = useState('');
  const [downloadingId, setDownloadingId] = useState('');

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
    if (s.includes('termin') || s.includes('complet')) return { label: 'Terminée', className: 'bg-sky-500/10 text-sky-400 border border-sky-500/20' };
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
  const getRequestTypeLabel = (r) => r?.requestTypeLabel || (r?.requestType === 'location' ? 'Location' : r?.requestType === 'achat' ? 'Achat' : 'Visite');
  const isContractEligible = (r) => isConfirmedReservation(r) && r?.requestType && r.requestType !== 'visite';

  const handleDownloadReceipt = async (id) => {
    try {
      setDownloadingId(`receipt-${id}`);
      await reservationAPI.downloadReceipt(id);
    } catch (error) {
      toast.error('Téléchargement du reçu impossible.');
    } finally {
      setDownloadingId('');
    }
  };

  const handleDownloadContract = async (id) => {
    try {
      setDownloadingId(`contract-${id}`);
      await reservationAPI.downloadContract(id);
    } catch (error) {
      toast.error('Téléchargement du contrat impossible.');
    } finally {
      setDownloadingId('');
    }
  };

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
    <div className="min-h-screen bg-zinc-950 text-white">
      <IncompleteProfileBanner />

      {/* ── Hero ── */}
      <div className="relative bg-zinc-900/60 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-primary/8 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary mb-3">
            <Sparkles className="h-3 w-3" />
            Espace Membre
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase text-white">
            Bonjour{user?.nom ? `, ${user.nom.split(' ')[0]}` : ''}<span className="text-gold-primary">.</span>
          </h1>
          <p className="text-zinc-400 text-sm font-medium mt-1">
            Gérez vos favoris, visites et réservations depuis votre espace personnel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Quick actions ── */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-1 w-6 bg-gold-primary rounded-full" />
            <h2 className="text-xs font-black text-white uppercase tracking-widest">Actions Rapides</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/favorites', icon: Heart,          label: 'Favoris',    color: 'text-red-400',      bg: 'bg-red-500/10' },
              { to: '/profile',   icon: User,           label: 'Mon Profil', color: 'text-blue-400',     bg: 'bg-blue-500/10' },
              { to: '/properties',icon: Search,         label: 'Rechercher', color: 'text-gold-primary', bg: 'bg-gold-primary/10' },
              { to: '/contact',   icon: MessageCircle,  label: 'Contact',    color: 'text-emerald-400',  bg: 'bg-emerald-500/10' },
            ].map(({ to, icon: Icon, label, color, bg }) => (
              <Link key={to} to={to}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-zinc-950/40 rounded-2xl border border-white/5 hover:border-gold-primary/25 hover:bg-zinc-900/60 transition-all group"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-black text-zinc-500 group-hover:text-white uppercase tracking-widest transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Reservations */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[24px] md:rounded-3xl border border-white/10 p-4 md:p-6 shadow-xl">
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
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest ${statusMeta.className}`}>
                            {statusMeta.label}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-white/5 border border-white/10 text-zinc-400">
                            {getRequestTypeLabel(r)}
                          </span>
                        </div>
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
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
                        <span className="font-black text-gold-primary text-sm flex-shrink-0">
                          {r.property?.prix != null ? formatPrice(r.property.prix) : '-'}
                        </span>
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                          <button
                            disabled={downloadingId === `receipt-${r._id}`}
                            onClick={() => handleDownloadReceipt(r._id)}
                            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:border-white/30 transition-all disabled:opacity-50"
                          >
                            {downloadingId === `receipt-${r._id}` ? '...' : 'Reçu'}
                          </button>
                          {isContractEligible(r) && (
                            <button
                              disabled={downloadingId === `contract-${r._id}`}
                              onClick={() => handleDownloadContract(r._id)}
                              className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-gold-primary/10 border border-gold-primary/20 rounded-xl text-gold-primary hover:bg-gold-primary/20 transition-all disabled:opacity-50"
                            >
                              {downloadingId === `contract-${r._id}` ? '...' : 'Contrat'}
                            </button>
                          )}
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
                                const phone = whatsappUrl.split('wa.me/')[1]?.split('?')[0] || toWhatsAppNumber(r?.support?.requesterPhone || r?.user?.telephone);
                                if (!phone) return;
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

          {/* Messages */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[24px] md:rounded-3xl border border-white/10 p-4 md:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Mail className="h-4 w-4 text-emerald-400" />
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Messages</h2>
              </div>
              <Link to="/messages">
                <span className="text-[10px] font-black text-gold-primary uppercase tracking-widest hover:text-amber-300 transition-colors">
                  Tout voir →
                </span>
              </Link>
            </div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-5">Vos messages non lus</p>

            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center relative">
                <MessageCircle className="w-6 h-6 text-zinc-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold-primary text-black text-[9px] font-black flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500 font-medium">
                {unreadCount > 0 ? `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}` : 'Aucun message non lu'}
              </p>
              <Link to="/messages">
                <Button className="mt-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-zinc-950 text-xs font-black uppercase tracking-widest rounded-2xl">
                  Voir mes messages
                </Button>
              </Link>
            </div>
          </div>

          {/* Favorites */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[24px] md:rounded-3xl border border-white/10 p-4 md:p-6 shadow-xl">
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
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[24px] md:rounded-3xl border border-white/10 p-4 md:p-6 shadow-xl">
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
