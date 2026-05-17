import React, { useState, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, User, LayoutDashboard, Building2, CalendarDays, ClipboardList, BarChart3, Users, MessageSquare, Settings } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Tableau de bord';
    if (path.includes('/properties')) return 'Gestion des Annonces';
    if (path.includes('/submissions')) return 'Soumissions de biens';
    if (path.includes('/reservations')) return 'Planning des Visites';
    if (path.includes('/analytics')) return 'Statistiques & Rapports';
    if (path.includes('/users')) return 'Gestion des Utilisateurs';
    if (path.includes('/messages')) return 'Centre de Messagerie';
    if (path.includes('/settings')) return 'Paramètres Système';
    return 'Administration';
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full bg-[#0d0d0d] overflow-hidden text-white font-sans">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Optimized and professional */}
        <header className="h-24 shrink-0 flex items-center justify-between px-8 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-3 bg-zinc-900/50 rounded-2xl text-zinc-400 hover:text-white transition-all border border-white/5"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col">
              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-none mb-1">Navigation</div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">{pageTitle}<span className="text-gold-primary">.</span></h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden xl:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Recherche globale..." 
                className="h-12 w-72 bg-zinc-900/30 border border-white/5 rounded-2xl pl-12 pr-4 text-xs text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 p-1 bg-zinc-900/30 border border-white/5 rounded-2xl">
              <button className="p-3 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all relative" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-gold-primary rounded-full border-2 border-[#0d0d0d]"></span>
              </button>
              
              <Link to="/profile" className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl hover:bg-white/5 transition-all group">
                <div className="h-8 w-8 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-primary border border-gold-primary/20 group-hover:bg-gold-primary group-hover:text-black transition-all">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[10px] font-black text-white uppercase leading-none mb-0.5">Admin</div>
                  <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Connecté</div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#09090b]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
