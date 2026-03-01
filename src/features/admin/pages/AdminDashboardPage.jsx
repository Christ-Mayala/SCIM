import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Building2, MessageSquare, Users, AlertCircle, Settings, ArrowRight, Star, CalendarDays, PhoneCall, MessageCircle, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { adminAPI, formatDate, formatPrice, reservationAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const COLORS = ['#FFB703', '#FB8500', '#8ECAE6', '#219EBC', '#023047', '#FF0000'];

const PropertyTypeChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="count" nameKey="_id">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

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

const QuickLinkCard = ({ title, icon: Icon, to }) => (
  <Link to={to} className="group rounded-xl bg-white p-4 ring-1 ring-zinc-200 shadow-sm hover:ring-gold-primary transition-all">
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-primary/10 text-gold-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-medium text-zinc-900">{title}</div>
    </div>
  </Link>
);

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

  const quickLinks = useMemo(
    () => [
      { to: '/admin/properties', title: 'Gérer les annonces', icon: Building2 },
      { to: '/admin/users', title: 'Utilisateurs', icon: Users },
      { to: '/admin/messages', title: 'Messages', icon: MessageSquare },
      { to: '/admin/analytics', title: 'Analytics', icon: BarChart3 },
      { to: '/admin/settings', title: 'Paramètres', icon: Settings },
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
                <Button onClick={() => window.location.reload()}>Réessayer</Button>
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
            <div className="mt-1 text-sm text-zinc-600">Vue d'ensemble de votre activité immobilière.</div>
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
          <StatCard title="Réservations" value={reservationStats.total} icon={CalendarDays} hint={`${reservationStats.pending} en attente`} />
          <StatCard title="Confirmées" value={reservationStats.confirmed} icon={BarChart3} hint="Réservations confirmées" />
        </div>

        <div className="mt-8">
          <h2 className="font-semibold text-zinc-900">Accès rapide</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickLinks.map((link) => (
              <QuickLinkCard key={link.to} {...link} />
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 ring-1 ring-zinc-200 shadow-sm">
            <h2 className="font-semibold text-zinc-900">Annonces populaires</h2>
            <div className="mt-4 space-y-4">
              {topProperties.map((p) => (
                <div key={p._id} className="flex items-center gap-4">
                  <img src={p.images?.[0]?.url || '/images/scim-logo.jpg'} alt={p.titre} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <Link to={`/properties/${p._id}`} className="font-medium text-zinc-800 hover:text-gold-primary transition-colors">{p.titre}</Link>
                    <div className="mt-1 text-xs text-zinc-500 flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5"><Eye className="w-3 h-3" /> {p.views || 0} vues</span>
                      <span className="inline-flex items-center gap-1.5"><Star className="w-3 h-3" /> {p.favoritedBy?.length || 0} favoris</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-zinc-900">{formatPrice(p.prix)}</div>
                    <div className="text-xs text-zinc-500">{p.ville}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-zinc-200 shadow-sm">
            <h2 className="font-semibold text-zinc-900">Répartition par type</h2>
            <PropertyTypeChart data={propertyTypes} />
            <div className="mt-4 space-y-2">
              {propertyTypes.map((pt, index) => (
                <div key={pt._id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {pt._id}
                  </span>
                  <span className="font-medium">{pt.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold text-zinc-900">Réservations récentes</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-zinc-300">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 sm:pl-6">Propriété</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">Client</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">Date / Statut</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      {recentReservations.map((r) => (
                        <tr key={r._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-zinc-900">{r.property?.titre || 'Annonce supprimée'}</div>
                            <div className="text-zinc-500">{r.property?.ville}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                            <div className="font-medium text-zinc-900">{r.user?.nom || r.user?.name || 'Utilisateur supprimé'}</div>
                            <div className="text-zinc-500">{r.user?.email}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                            <div>{formatDate(r.date)}</div>
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${r.status === 'confirmée' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex items-center gap-2">
                              {r.status !== 'confirmée' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateReservationStatus(r._id, 'confirm')}
                                  loading={statusActionId === `confirm:${r._id}`}
                                  className="text-xs"
                                >
                                  Confirmer
                                </Button>
                              )}
                              {r.status !== 'annulee' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateReservationStatus(r._id, 'cancel')}
                                  loading={statusActionId === `cancel:${r._id}`}
                                  className="text-xs"
                                >
                                  Annuler
                                </Button>
                              )}
                              <a href={buildClientWhatsappUrl(r)} target="_blank" rel="noopener noreferrer" className="text-gold-primary hover:text-gold-dark text-xs">
                                WhatsApp
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

