import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { adminAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { 
  BarChart3, TrendingUp, Users, Home, Calendar, ArrowUpRight, ArrowDownRight, 
  Target, Zap, RefreshCw, LayoutDashboard, Database
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/Button';

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
  <div className="bg-white rounded-[2rem] border border-zinc-200/80 p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
    <div className={cn("absolute inset-x-0 top-0 h-1", color.split(' ')[0].replace('text-', 'bg-'))} />
    <div className="flex items-start justify-between">
      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/5 group-hover:scale-110 transition-transform duration-500", color)}>
        <Icon className="w-7 h-7" />
      </div>
      {change && (
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest leading-none border shadow-sm",
          trend === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
        )}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {change}%
        </div>
      )}
    </div>
    <div className="mt-8">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
         <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">{value}</h3>
      </div>
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="flex items-center gap-4 mb-8 px-2">
     <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg ring-1 ring-white/10 shrink-0">
        <Icon className="h-5 w-5 text-amber-400" />
     </div>
     <div>
        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">{title}</h3>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">{subtitle}</p>
     </div>
  </div>
);

const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAnalytics();
      setData(res.data?.data || res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Compilation des algorithmes...</p>
    </div>
  );

  const stats = data?.stats || {};
  const COLORS = ['#18181b', '#f59e0b', '#71717a', '#a1a1aa'];

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* ── Header Section ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white mb-4 shadow-lg shadow-zinc-900/10">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Ingénierie de Données
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Analytics</h1>
            <p className="mt-1 text-sm font-medium text-zinc-500">Visualisez les indices de performance et la croissance du réseau.</p>
          </div>
          <Button 
            onClick={load} 
            className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-zinc-900 text-white shadow-xl shadow-zinc-900/10 gap-2 hover:bg-gold-primary hover:text-zinc-900 transition-all active:scale-95"
          >
            <RefreshCw className="h-4 w-4 text-amber-400" /> Actualiser le flux
          </Button>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard title="Total Propriétés" value={stats.totalProperties || 0} change={12} trend="up" icon={Home} color="bg-zinc-900 text-amber-400" />
          <StatCard title="Utilisateurs" value={stats.totalUsers || 0} change={8} trend="up" icon={Users} color="bg-blue-50 text-blue-600" />
          <StatCard title="Réservations" value={stats.totalReservations || 0} change={4} trend="down" icon={Calendar} color="bg-emerald-50 text-emerald-600" />
          <StatCard title="Conversion" value="68%" change={15} trend="up" icon={TrendingUp} color="bg-amber-50 text-amber-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Properties by Type Chart */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-10 shadow-sm overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-xl">
            <SectionHeader title="Répartition Asset Class" subtitle="Distribution par catégorie de bien" icon={Database} />
            <div className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.propertiesByType || []}
                    cx="50%" cy="50%"
                    innerRadius={110}
                    outerRadius={150}
                    paddingAngle={8}
                    dataKey="count"
                    nameKey="_id"
                    stroke="none"
                  >
                    {(data?.propertiesByType || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    itemStyle={{ color: '#18181b' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    formatter={(val) => <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mx-2">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Properties Over Time */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-10 shadow-sm overflow-hidden flex flex-col transition-all duration-500 hover:shadow-xl">
             <SectionHeader title="Croissance Portfolio" subtitle="Nouveaux listings par cycle temporel" icon={LayoutDashboard} />
             <div className="flex-1 min-h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data?.propertiesOverTime || []}>
                   <defs>
                     <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis 
                      dataKey="_id" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }} 
                      dy={10}
                   />
                   <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                   />
                   <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                   />
                   <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Global Performance Summary */}
        <div className="bg-zinc-900 rounded-[2.5rem] p-12 shadow-2xl shadow-zinc-900/40 relative overflow-hidden group border border-white/5">
           <Zap className="absolute -right-20 -bottom-20 h-80 w-80 text-white opacity-[0.02] rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
           <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="max-w-xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest mb-6">
                    <Target className="h-3.5 w-3.5" /> Intelligence Suite
                 </div>
                 <h2 className="text-4xl font-black text-white tracking-tight leading-[1.1] mb-6 uppercase">Indice de performance globale SCIM</h2>
                 <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                   Vos actifs immobiliers affichent une progression stable de <strong>+12.4%</strong> ce trimestre. 
                   Le segment des villas luxe domine le marché local avec une rétention client record.
                 </p>
              </div>
              <div className="grid grid-cols-2 gap-6 shrink-0">
                 {[
                   { label: 'Référencement', val: '99.4%', col: 'text-emerald-400' },
                   { label: 'Visites Conclues', val: '1.2K', col: 'text-amber-400' },
                   { label: 'Satisfaction', val: '4.9/5', col: 'text-blue-400' },
                   { label: 'Retention', val: '86%', col: 'text-white' },
                 ].map((idx, i) => (
                   <div key={i} className="bg-zinc-800 rounded-[1.5rem] p-6 border border-white/5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">{idx.label}</div>
                      <div className={cn("text-2xl font-black italic", idx.col)}>{idx.val}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
