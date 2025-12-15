import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Building2, Home, LogOut, Menu, MessageSquare, Settings, Users, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessage } from '../../../contexts/MessageContext';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const AdminHeader = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useMessage();
  const location = useLocation();
  const navigate = useNavigate();

  const links = useMemo(
    () => [
      { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
      { to: '/admin/properties', label: 'Annonces', icon: Building2 },
      { to: '/admin/users', label: 'Utilisateurs', icon: Users },
      { to: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
      { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/admin/settings', label: 'Paramètres', icon: Settings },
    ],
    [unreadCount],
  );

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  const onLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/home');
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard" className="flex items-center gap-3">
                <img src="/images/scim-logo.jpg" alt="SCIM" className="h-10 w-10 rounded-full object-cover ring-2 ring-gold-primary/40" />
                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-wide">SCIM</div>
                  <div className="text-xs text-zinc-300">Administration</div>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm font-medium text-zinc-200 hover:text-white hover:bg-white/10 transition flex items-center gap-2',
                    isActive(l.to) && 'bg-white/10 text-white ring-1 ring-gold-primary/25',
                  )}
                >
                  <l.icon className="h-4 w-4" />
                  <span>{l.label}</span>
                  {typeof l.badge === 'number' && l.badge > 0 ? (
                    <Badge className="ml-1" variant="default">
                      {l.badge}
                    </Badge>
                  ) : null}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/home" className="text-zinc-300 hover:text-white flex items-center gap-2 text-sm">
                <Home className="h-4 w-4" />
                Site
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <div className="text-sm text-zinc-300 max-w-[200px] truncate">{user?.nom || user?.name || user?.email}</div>
              <Button variant="outline" size="sm" onClick={onLogout} className="border-white/20 bg-transparent text-white hover:bg-white/10">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <Link to="/home" className="text-zinc-300 hover:text-white">
                <Home className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"
                aria-label="Menu admin"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {open ? (
          <div className="md:hidden border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/10',
                    isActive(l.to) && 'bg-white/10 ring-1 ring-gold-primary/25',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </span>
                  {typeof l.badge === 'number' && l.badge > 0 ? <Badge>{l.badge}</Badge> : null}
                </Link>
              ))}

              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-zinc-300 truncate">{user?.nom || user?.name || user?.email}</div>
                <button onClick={onLogout} className="text-sm text-white inline-flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="h-px bg-gradient-to-r from-gold-primary/40 via-white/0 to-gold-primary/40" />
    </div>
  );
};

export default AdminHeader;
