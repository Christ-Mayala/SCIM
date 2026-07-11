import React, { useState, useMemo, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, User, LayoutDashboard, Building2, CalendarDays, ClipboardList, BarChart3, Users, MessageSquare, Settings } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { adminAPI } from '../../lib/api';

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Meme source que le compteur de la sidebar (adminAPI.getMessages), pour que la
  // cloche affiche exactement le meme nombre — plutot que le compteur de messagerie
  // "personnelle" (useMessage) qui ne se rafraichissait pas assez souvent et restait bloque.
  useEffect(() => {
    let cancelled = false;
    const fetchUnread = async () => {
      try {
        const res = await adminAPI.getMessages({ page: 1, limit: 1, status: 'unread' });
        if (cancelled) return;
        const d = res.data?.data || res.data;
        setUnreadCount(Number(d?.total ?? 0));
      } catch { /* silent */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [location.pathname]);

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
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 lg:px-8 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2.5 bg-zinc-900/50 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/5"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-0.5">Navigation</div>
              <h2 className="text-sm font-black text-white tracking-tight uppercase italic leading-none">
                {pageTitle}<span className="text-gold-primary">.</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden xl:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Recherche globale..."
                className="h-9 w-64 bg-zinc-900/40 border border-white/5 rounded-xl pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 p-1 bg-zinc-900/30 border border-white/5 rounded-xl">
              <Link to="/admin/messages" className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all relative" aria-label="Notifications" title="Notifications">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-[#0d0d0d]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-lg hover:bg-white/5 transition-all group">
                <div className="h-7 w-7 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-primary border border-gold-primary/20 group-hover:bg-gold-primary group-hover:text-black transition-all">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[9px] font-black text-white uppercase leading-none">Admin</div>
                  <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-0.5">Connecté</div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content — overflow-y-auto ensures the page content scrolls independently of the sidebar */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#09090b]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
