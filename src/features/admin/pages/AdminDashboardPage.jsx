import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Building2, MessageSquare, Users, AlertCircle, Settings, ArrowRight, Star, CalendarDays, PhoneCall, MessageCircle } from 'lucide-react';
import { adminAPI, formatDate, formatPrice, reservationAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const StatCard = ({ title, value, icon: Icon, hint, variant = 'default' }) => {
  const ring =
    variant === 'gold'
      ? 'ring-1 ring-gold-primary/25'
      : variant === 'danger'
      ? 'ring-1 ring-red-500/20'
      : 'ring-1 ring-zinc-200';

  const iconBg =
    variant === 'gold'
      ? 'bg-gold-primary/15 text-gold-primary'
      : variant === 'danger'
      ? 'bg-red-500/10 text-red-600'
      : 'bg-zinc-100 text-zinc-700';

  return (
    <div className={cn('rounded-2xl bg-white p-5 shadow-sm', ring)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-600">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900">{value}</div>
          {hint ? <div className="mt-1 text-xs text-zinc-500">{hint}</div> : null}
        </div>
        <div className={cn('grid h-10 w-10 place-items-center rounded-xl', iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [statusActionId, setStatusActionId] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, reservationsRes] = await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getReservations({ page: 1, limit: 50 }).catch(() => ({ data: { reservations: [] } })),
        ]);

        setData(statsRes.data);
        setReservations(Array.isArray(reservationsRes.data?.reservations) ? reservationsRes.data.reservations : []);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Erreur lors du chargement du dashboard');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const normalizePhone = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const digits = raw.replace(/[^\d]/g, '');
    if (!digits) return '';
    if (raw.startsWith('+')) return `+${digits}`;
    if (digits.startsWith('00')) return `+${digits.slice(2)}`;
    if (digits.startsWith('242')) return `+${digits}`;
    const local = digits.replace(/^0+/, '');
    return local ? `+242${local}` : '';
  };

  const getReservationReference = (reservation) => reservation?.reference || reservation?.support?.reference || reservation?._id || '';

  const getReservationClientPhone = (reservation) =>
    normalizePhone(reservation?.user?.telephone || reservation?.support?.requesterPhone || '');

  const buildClientWhatsappUrl = (reservation) => {
    const phone = getReservationClientPhone(reservation);
    if (!phone) return '';
    const ref = getReservationReference(reservation);
    const title = reservation?.property?.titre || 'votre reservation';
    const visitDate = reservation?.date ? formatDate(reservation.date) : 'date a confirmer';
    const text = `Bonjour, suivi SCIM pour ${title}. Reference: ${ref}. Date: ${visitDate}.`;
    return `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const updateReservationStatus = async (reservationId, action) => {
    try {
      setStatusActionId(`${action}:${reservationId}`);
      const res = action === 'confirm' ? await reservationAPI.confirm(reservationId) : await reservationAPI.cancel(reservationId);
      const updated = res?.data || null;
      if (updated?._id) {
        setReservations((prev) => prev.map((r) => (r._id === reservationId ? updated : r)));
      }
    } catch (e) {
      alert(e?.response?.data?.message || 'Mise a jour impossible');
    } finally {
      setStatusActionId('');
    }
  };

  const stats = data?.stats || {};
  const topProperties = Array.isArray(data?.topProperties) ? data.topProperties : [];
  const propertyTypes = Array.isArray(data?.propertyTypes) ? data.propertyTypes : [];

  const reservationStats = useMemo(() => {
    const total = reservations.length;
    const pending = reservations.filter((r) => {
      const s = String(r.status || '').toLowerCase();
      return s.includes('attente') || s.includes('pending');
    }).length;
    const confirmed = reservations.filter((r) => String(r.status || '').toLowerCase().includes('confirm')).length;
    return { total, pending, confirmed };
  }, [reservations]);

  const recentReservations = useMemo(() => {
    return [...reservations]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);
  }, [reservations]);

  const quick = useMemo(
    () => [
      { to: '/admin/properties', title: 'GÃ©rer les annonces', icon: Building2 },
      { to: '/admin/users', title: 'Utilisateurs', icon: Users },
      { to: '/admin/messages', title: 'Messages', icon: MessageSquare },
      { to: '/admin/analytics', title: 'Analytics', icon: BarChart3 },
      { to: '/admin/settings', title: 'ParamÃ¨tres', icon: Settings },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-red-500/20">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-red-500/10 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-zinc-900">Dashboard indisponible</div>
              <div className="mt-1 text-sm text-zinc-600">{error}</div>
              <div className="mt-4">
                <Button onClick={() => window.location.reload()}>RÃ©essayer</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-zinc-700 ring-1 ring-gold-primary/20">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-primary" />
              Administration
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-900">Dashboard</h1>
            <div className="mt-1 text-sm text-zinc-600">Statistiques rÃ©elles + rÃ©servations.</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/properties/new">
              <Button className="shadow-sm">Ajouter un bien</Button>
            </Link>
            <Link to="/admin/messages">
              <Button variant="outline">Messages</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Biens" value={stats.totalProperties ?? 0} icon={Building2} hint={`${stats.activeProperties ?? 0} actifs`} variant="gold" />
          <StatCard title="Utilisateurs" value={stats.totalUsers ?? 0} icon={Users} hint={`${stats.newUsersThisMonth ?? 0} ce mois`} />
          <StatCard title="Messages" value={stats.totalMessages ?? 0} icon={MessageSquare} hint={`${stats.unreadMessages ?? 0} non lus`} variant={(stats.unreadMessages || 0) > 0 ? 'danger' : 'default'} />
          <StatCard title="RÃ©servations" value={reservationStats.total} icon={CalendarDays} hint={`${reservationStats.pending} en attente`} />
          <StatCard title="ConfirmÃ©es" value={reservationStats.confirmed} icon={BarChart3} hint="RÃ©servations confirmÃ©es" />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-zinc-200 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-zinc-900">Derniers biens</div>
                  <div className="mt-1 text-sm text-zinc-600">Top 5 rÃ©cents</div>
                </div>
                <Link to="/admin/properties" className="text-sm text-gold-primary hover:underline inline-flex items-center gap-1">
                  Tout voir <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 divide-y divide-zinc-100">
                {topProperties.length === 0 ? (
                  <div className="py-10 text-center text-sm text-zinc-600">Aucun bien.</div>
                ) : (
                  topProperties.map((p) => (
                    <div key={p._id} className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-medium text-zinc-900 truncate">{p.titre}</div>
                        <div className="mt-1 text-xs text-zinc-600 flex flex-wrap gap-x-3 gap-y-1">
                          <span className="inline-flex items-center gap-1"><span className="text-zinc-400">Ville:</span> {p.ville}</span>
                          <span className="inline-flex items-center gap-1"><span className="text-zinc-400">CatÃ©gorie:</span> {p.categorie}</span>
                          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-gold-primary" /><span className="text-zinc-400">Bon plan:</span> {p.isBonPlan ? 'Oui' : 'Non'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-zinc-900 whitespace-nowrap">{formatPrice(p.prix)}</div>
                        <Link to={`/properties/${p._id}`}>
                          <Button variant="outline" size="sm">Voir</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-zinc-200 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-zinc-900">RÃ©servations reÃ§ues</div>
                  <div className="mt-1 text-sm text-zinc-600">DonnÃ©es via /admin/reservations</div>
                </div>
              </div>

              <div className="mt-5 divide-y divide-zinc-100">
                {recentReservations.length === 0 ? (
                  <div className="py-10 text-center text-sm text-zinc-600">Aucune rÃ©servation.</div>
                ) : (
                  recentReservations.map((r) => {
                    const clientPhone = getReservationClientPhone(r);
                    const whatsappHref = buildClientWhatsappUrl(r);
                    const statusRaw = String(r.status || '').toLowerCase();
                    const canConfirm = !statusRaw.includes('confirm') && !statusRaw.includes('annul') && !statusRaw.includes('cancel');
                    const canCancel = !statusRaw.includes('annul') && !statusRaw.includes('cancel');

                    return (
                      <div key={r._id} className="py-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-medium text-zinc-900 truncate">{r.property?.titre || 'Bien'}</div>
                          <div className="mt-1 text-xs text-zinc-600 flex flex-wrap gap-x-3 gap-y-1">
                            <span><span className="text-zinc-400">Client:</span> {r.user?.email || r.user?.nom || '—'}</span>
                            <span><span className="text-zinc-400">Telephone:</span> {clientPhone || '—'}</span>
                            <span><span className="text-zinc-400">Date:</span> {r.date ? formatDate(r.date) : '—'}</span>
                            <span><span className="text-zinc-400">Statut:</span> {r.status}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {clientPhone ? (
                              <a href={`tel:${clientPhone}`}>
                                <Button size="sm" variant="outline" className="h-8 px-3">
                                  <PhoneCall className="h-3.5 w-3.5 mr-1" />
                                  Appeler
                                </Button>
                              </a>
                            ) : null}
                            {whatsappHref ? (
                              <a href={whatsappHref} target="_blank" rel="noreferrer">
                                <Button size="sm" className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white">
                                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                                  WhatsApp
                                </Button>
                              </a>
                            ) : null}
                            {canConfirm ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3"
                                disabled={statusActionId === `confirm:${r._id}`}
                                onClick={() => updateReservationStatus(r._id, 'confirm')}
                              >
                                {statusActionId === `confirm:${r._id}` ? '...' : 'Confirmer'}
                              </Button>
                            ) : null}
                            {canCancel ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-red-600 border-red-200 hover:border-red-300 hover:text-red-700"
                                disabled={statusActionId === `cancel:${r._id}`}
                                onClick={() => updateReservationStatus(r._id, 'cancel')}
                              >
                                {statusActionId === `cancel:${r._id}` ? '...' : 'Annuler'}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900 whitespace-nowrap">{r.property?.prix != null ? formatPrice(r.property.prix) : '—'}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-zinc-200 shadow-sm">
            <div className="text-lg font-semibold text-zinc-900">AccÃ¨s rapide</div>
            <div className="mt-1 text-sm text-zinc-600">Navigation Admin</div>
            <div className="mt-5 grid gap-3">
              {quick.map((q) => (
                <Link key={q.to} to={q.to} className="group rounded-xl px-4 py-3 ring-1 ring-zinc-200 hover:ring-gold-primary/30 hover:bg-zinc-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-primary/10 text-gold-primary">
                        <q.icon className="h-5 w-5" />
                      </div>
                      <div className="font-medium text-zinc-900">{q.title}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-gold-primary" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium text-zinc-900">RÃ©partition par catÃ©gorie</div>
              <div className="mt-3 space-y-2">
                {propertyTypes.length === 0 ? (
                  <div className="text-sm text-zinc-600">â€”</div>
                ) : (
                  propertyTypes.map((t) => (
                    <div key={t.name} className="flex items-center justify-between text-sm">
                      <div className="text-zinc-700">{t.name || 'Autre'}</div>
                      <div className="font-semibold text-zinc-900">{t.value}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gradient-to-r from-gold-primary/15 to-gold-primary/5 p-4 ring-1 ring-gold-primary/20">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-gold-primary">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900">Info</div>
                  <div className="mt-1 text-xs text-zinc-700">Les rÃ©servations affichÃ©es viennent de lâ€™endpoint admin.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

