import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, Building2, MessageSquare, Users, AlertCircle,
  Settings, Star, CalendarDays, Eye, ClipboardList, TrendingUp,
  CheckCircle, Clock, XCircle, Heart, Zap, ArrowRight, MousePointer2,
  Calendar, ChevronDown, MoreHorizontal, Trash2, Shield, Lock, 
  ArrowUpRight, ArrowDownRight, Plus, MapPin, Key, Database
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { adminAPI, formatDate, formatPrice, reservationAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const PALETTE = ['#d4af37', '#8c6b1f', '#f3e5b0', '#1f2937', '#64748b', '#ef4444', '#10b981'];

/* ─── Composants Internes ─── */

const DashboardCard = ({ title, value, change, changeType, children, className }) => (
  <div className={cn("bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6", className)}>
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{title}</span>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-xl font-black text-white">{value}</span>
        {change && (
          <span className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black",
            changeType === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {changeType === 'up' ? '+' : '-'}{change}
          </span>
        )}
      </div>
    </div>
    {children && <div className="mt-4">{children}</div>}
  </div>
);

const TransactionTable = ({ reservations, updateStatus, statusActionId }) => (
  <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
    <div className="flex items-center justify-between px-8 py-6">
      <h2 className="text-lg font-black text-white">Transactions Récentes</h2>
      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
        Trier par date <ChevronDown className="h-4 w-4" />
      </button>
    </div>
    
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse table-auto">
        <thead>
          <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-white/5">
            <th className="px-4 py-4 w-10"><input type="checkbox" className="rounded border-zinc-800 bg-zinc-900" /></th>
            <th className="px-4 py-4">Date</th>
            <th className="px-4 py-4">Propriété</th>
            <th className="px-4 py-4">Montant</th>
            <th className="px-4 py-4">Client</th>
            <th className="px-4 py-4">Statut</th>
            <th className="px-4 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {reservations.map((r) => (
            <tr key={r._id} className="group hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-5"><input type="checkbox" className="rounded border-zinc-800 bg-zinc-900" /></td>
              <td className="px-4 py-5 text-[11px] font-bold text-zinc-500 whitespace-nowrap">
                {r.date ? new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}
              </td>
              <td className="px-4 py-5">
                <div className="text-[11px] font-black text-white line-clamp-1 uppercase tracking-tight">{r.property?.titre || 'Visite Immobilière'}</div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{r.property?.ville || 'Congo'}</div>
              </td>
              <td className="px-4 py-5 text-[11px] font-black text-white whitespace-nowrap">
                {r.property?.prix ? `${formatPrice(r.property.prix)}` : '—'}
              </td>
              <td className="px-4 py-5 text-[11px] font-bold text-zinc-500 whitespace-nowrap">
                @{r.user?.nom?.toLowerCase().replace(/\s/g, '_') || 'client'}
              </td>
              <td className="px-4 py-5">
                <span className={cn(
                  "px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                  /confirm/i.test(r.status) ? "bg-emerald-500/10 text-emerald-500" : 
                  /attente|pending/i.test(r.status) ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                )}>
                  {r.status === 'confirmee' ? 'Confirmé' : r.status === 'en_attente' ? 'Attente' : 'Annulé'}
                </span>
              </td>
              <td className="px-4 py-5 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/admin/reservations`} className="text-zinc-500 hover:text-white transition-colors" title="Voir détails"><Eye className="h-4 w-4" /></Link>
                  <button onClick={() => updateReservationStatus(r._id, 'annulee')} className="text-zinc-500 hover:text-red-500 transition-colors" title="Annuler la visite"><Trash2 className="h-4 w-4" /></button>
                  <button onClick={() => updateReservationStatus(r._id, 'confirmee')} className="text-zinc-500 hover:text-emerald-500 transition-colors" title="Confirmer la visite"><CheckCircle className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ─── Page Principale ─── */
const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [reservations, setReservations] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, reservationsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getReservations({ page: 1, limit: 10 }).catch(() => ({ data: {} })),
      ]);
      const statsData = statsRes.data?.data || statsRes.data;
      setData(statsData);
      const rd = reservationsRes.data?.data || reservationsRes.data;
      setReservations(Array.isArray(rd?.reservations) ? rd.reservations : Array.isArray(rd?.items) ? rd.items : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateReservationStatus = async (id, status) => {
    try {
      await adminAPI.updateReservationStatus(id, status);
      toast.success(status === 'confirmee' ? 'Visite confirmée' : 'Visite annulée');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const stats = data?.stats || {};
  
  const chartData = [
    { name: 'Jan', revenus: 2000, visites: 1200 },
    { name: 'Fév', revenus: 3200, visites: 1800 },
    { name: 'Mar', revenus: 2500, visites: 2200 },
    { name: 'Avr', revenus: 3800, visites: 1500 },
    { name: 'Mai', revenus: 2800, visites: 1900 },
  ];

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <div className="p-4 lg:p-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Section Principale */}
        <div className="flex-1 space-y-8 min-w-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Administration <span className="opacity-30">/</span> <span className="text-zinc-300">Vue d'ensemble</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic uppercase">Dashboard<span className="text-gold-primary">.</span></h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-zinc-400">
                <Calendar className="h-4 w-4 text-gold-primary" />
                <span>Mai 2026</span>
              </div>
              <Link to="/admin/properties/new">
                <Button className="h-12 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-gold-primary/20 transition-all hover:-translate-y-1">
                  Ajouter un bien
                </Button>
              </Link>
            </div>
          </div>

          {/* Cartes Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Annonces Actives" value={stats.activeProperties || '124'} change="7%" changeType="up" />
            <DashboardCard title="Visites ce mois" value={reservations.length || '42'} change="13%" changeType="up" />
            <DashboardCard title="Utilisateurs" value={stats.totalUsers || '1.2k'} change="5%" changeType="up" />
          </div>

          {/* Graphique Statistiques */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-lg font-black text-white uppercase tracking-widest">Performance Mensuelle</h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-gold-primary" /> Revenus
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> Visites
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVisites" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #ffffff10', borderRadius: '1rem' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="revenus" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenus)" />
                  <Area type="monotone" dataKey="visites" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorVisites)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Transactions */}
          <TransactionTable reservations={reservations} />

        </div>

        {/* Barre Latérale Droite */}
        <div className="w-full xl:w-[360px] space-y-8 shrink-0">
          
          {/* Profil Utilisateur */}
          <div className="flex items-center gap-4 px-4 bg-zinc-900/30 p-4 rounded-3xl border border-white/5">
            <div className="h-14 w-14 rounded-2xl bg-zinc-800 overflow-hidden ring-1 ring-white/10 p-1">
               <div className="h-full w-full rounded-xl bg-gold-primary flex items-center justify-center font-black text-black text-xl">
                 {(user?.nom || 'A').charAt(0)}
               </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-white truncate uppercase tracking-tight italic">{user?.nom || 'Administrateur'}</h3>
              <p className="text-[10px] font-black text-gold-primary uppercase tracking-[0.2em]">Super Admin SCIM</p>
            </div>
          </div>

          {/* Valeur du Parc */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Valeur du Parc</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gold-primary flex items-center justify-center text-black">
                <Shield className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tighter">842,5M FCFA</span>
                <span className="text-[10px] font-black text-emerald-500 mt-1 uppercase tracking-widest">+13% vs l'an dernier</span>
              </div>
            </div>
          </div>

          {/* Analyse Immobilière */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-lg font-black text-white uppercase tracking-widest">Analyse</h4>
              <Link to="/admin/analytics" className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Détails</Link>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="h-28 w-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={[
                        { name: 'Vente', value: 45 },
                        { name: 'Location', value: 35 },
                        { name: 'Gestion', value: 20 }
                      ]} 
                      innerRadius={30} 
                      outerRadius={50} 
                      paddingAngle={8} 
                      dataKey="value"
                    >
                      <Cell fill="#d4af37" stroke="none" />
                      <Cell fill="#a855f7" stroke="none" />
                      <Cell fill="#f59e0b" stroke="none" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-gold-primary" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Vente</span>
                    <span className="text-xs font-bold text-white">45%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Location</span>
                    <span className="text-xs font-bold text-white">35%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xs font-black text-white uppercase tracking-widest">Objectif Mandats</h5>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest">80%</span>
              </div>
              <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-gold-primary rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
              </div>
            </div>
          </div>

          {/* Types d'actifs */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-lg font-black text-white uppercase tracking-widest">Actifs</h4>
              <Link to="/admin/properties" className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Voir tout</Link>
            </div>
            
            <div className="space-y-5">
              {[
                { label: 'Villas de luxe', value: '42', icon: Building2 },
                { label: 'Appartements', value: '86', icon: MapPin },
                { label: 'Terrains', value: '15', icon: Key },
              ].map((asset, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <asset.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{asset.label}</span>
                  </div>
                  <span className="text-sm font-black text-white">{asset.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Journal d'Activité Interne */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 group">
            <div className="flex items-center gap-3 mb-6">
               <Database className="h-5 w-5 text-gold-primary" />
               <h4 className="text-sm font-black text-white uppercase tracking-widest">État du Système</h4>
            </div>
            <div className="space-y-4 mb-8">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-500 uppercase">Serveur API</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-500 uppercase">Base de données</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-500 uppercase">Stockage Cloud</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
               </div>
            </div>
            <Link to="/admin/settings" className="block">
              <Button className="w-full h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest text-[10px] border border-white/5 transition-all">
                Gérer le système
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
