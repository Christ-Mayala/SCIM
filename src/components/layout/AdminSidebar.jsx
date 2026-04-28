import React, { useState } from 'react';
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
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useMessage();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/home';
  };

  const navLinks = [
    {
      section: 'Principal',
      items: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/properties', icon: Building2, label: 'Annonces' },
        { to: '/admin/submissions', icon: ClipboardList, label: 'Soumissions' },
        { to: '/admin/reservations', icon: CalendarDays, label: 'Réservations' },
      ],
    },
    {
      section: 'Communauté',
      items: [
        { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
        // { to: '/admin/messages', icon: MessageSquare, label: 'Messagerie', badge: unreadCount },
      ],
    },
    {
      section: 'Configuration',
      items: [
        { to: '/admin/analytics', icon: BarChart3, label: 'Statistiques' },
        { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === '/admin/dashboard' && location.pathname === '/admin/dashboard') return true;
    return path !== '/admin/dashboard' && location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-300">
      {/* Header / Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-white/5 bg-zinc-900/50">
        <Link to="/admin/dashboard" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          <div className="relative">
             <div className="absolute -inset-1 bg-gold-primary/20 rounded-full blur group-hover:bg-gold-primary/40 transition duration-500" />
             <img src="/images/scim-logo.jpg" alt="Admin" className="relative h-8 w-8 rounded-full object-cover ring-1 ring-gold-primary/30" />
          </div>
          <span className="font-black text-white text-lg tracking-tight italic uppercase">
            SCIM<span className="text-gold-primary">ADMIN</span>
          </span>
        </Link>
        {/* Mobile close button */}
        <button className="lg:hidden text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
        {navLinks.map((group) => (
          <div key={group.section}>
            <h3 className="mb-3 px-2 text-xs font-black uppercase tracking-wider text-zinc-500">
              {group.section}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200",
                      active
                        ? "bg-gold-primary text-black font-semibold shadow-md shadow-gold-primary/10"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn("h-5 w-5", active ? "text-black" : "text-zinc-400 group-hover:text-gold-primary transition-colors")}
                      />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className={cn(
                        "flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-bold",
                        active ? "bg-black/20 text-black" : "bg-gold-primary text-black"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/5 bg-zinc-900/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-sm uppercase">
            {(user?.nom || user?.name || 'A').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">{user?.nom || user?.name || 'Admin'}</p>
            <p className="text-xs text-gold-primary/70 font-medium uppercase tracking-wider">Super Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
            title="Déconnexion"
          >
            <LogOut className="h-5 w-5" />
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
          "fixed inset-y-0 left-0 z-[110] w-72 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64 xl:w-72 lg:shrink-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar;
