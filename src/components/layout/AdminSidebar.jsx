import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  X,
  ClipboardList,
  CalendarDays,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { adminAPI } from '../../lib/api';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [collapsed, setCollapsed] = useState(false);
  const [adminUnread, setAdminUnread] = useState(0);

  /* ── poll admin unread count every 30s ── */
  useEffect(() => {
    let cancelled = false;
    const fetchAdminUnread = async () => {
      try {
        const res = await adminAPI.getMessages({ page: 1, limit: 1, status: 'unread' });
        if (cancelled) return;
        const d = res.data?.data || res.data;
        setAdminUnread(Number(d?.total ?? 0));
      } catch { /* silent */ }
    };
    fetchAdminUnread();
    const interval = setInterval(fetchAdminUnread, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [location.pathname]); // re-fetch when navigating (including after reading messages)

  const handleLogout = async () => {
    await logout();
    window.location.href = '/home';
  };

  const navLinks = [
    {
      section: 'MENU PRINCIPAL',
      items: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
        { to: '/admin/properties', icon: Building2, label: 'Annonces' },
        { to: '/admin/submissions', icon: ClipboardList, label: 'Soumissions' },
        { to: '/admin/reservations', icon: CalendarDays, label: 'Visites' },
      ],
    },
    {
      section: 'ANALYTIQUE & COMMUNICATION',
      items: [
        { to: '/admin/analytics', icon: BarChart3, label: 'Statistiques' },
        { to: '/admin/messages', icon: MessageSquare, label: 'Messages', badge: adminUnread },
        { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
      ],
    },
    {
      section: 'COMPTE',
      items: [
        { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === '/admin/dashboard' && location.pathname === '/admin/dashboard') return true;
    return path !== '/admin/dashboard' && location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className={cn(
      "flex h-full flex-col bg-[#0d0d0d] text-zinc-400 transition-all duration-300",
      collapsed ? "w-20" : "w-full"
    )}>
      {/* Header / Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-white/5">
        <Link to="/admin/dashboard" className={cn("flex items-center gap-3 transition-all", collapsed && "hidden")} onClick={() => setMobileOpen(false)}>
          <div className="h-10 w-10 rounded-xl overflow-hidden ring-2 ring-gold-primary/20 shadow-lg shadow-gold-primary/10">
             <img src="/images/scim-logo.jpg" alt="Logo" className="w-full h-full object-cover scale-110" />
          </div>
          <span className="font-black text-white text-xl tracking-tighter uppercase italic">
            {settings.siteName.split(' ')[0]}
            <span className="text-gold-primary">.</span>
          </span>
        </Link>
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2.5 rounded-xl bg-zinc-900/50 text-zinc-500 hover:text-white transition-all border border-white/5"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-500", collapsed && "rotate-180")} />
        </button>

        {/* Mobile close button */}
        <button className="lg:hidden p-2 rounded-xl bg-zinc-900/50 text-zinc-400 hover:text-white ml-2" onClick={() => setMobileOpen(false)}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-10 custom-scrollbar">
        {navLinks.map((group) => (
          <div key={group.section} className="space-y-3">
            <h3 className={cn(
              "px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600",
              collapsed && "hidden"
            )}>
              {group.section}
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                      active
                        ? "bg-gold-primary text-black font-black shadow-xl shadow-gold-primary/10"
                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon
                        className={cn("h-5 w-5 transition-transform group-hover:scale-110", active ? "text-black" : "text-zinc-500 group-hover:text-gold-primary")}
                      />
                      {!collapsed && <span className="text-[13px] font-bold tracking-wide uppercase">{item.label}</span>}
                    </div>
                    
                    {!collapsed && (
                      <div className="flex items-center gap-2">
                        {item.badge > 0 && (
                          <span className={cn(
                            "flex h-5 min-w-[20px] items-center justify-center rounded-lg px-1.5 text-[9px] font-black",
                            active ? "bg-black text-gold-primary" : "bg-gold-primary text-black"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Déconnexion */}
      <div className="p-6 border-t border-white/5">
        <div className="space-y-2">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all group",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            {!collapsed && <span className="text-[13px] font-black tracking-widest uppercase">Déconnexion</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[110] transform transition-all duration-300 lg:translate-x-0 lg:static lg:shrink-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar;
