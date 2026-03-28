import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Building2, Home, LogOut, Menu, 
  MessageSquare, Settings, Users, X, ClipboardList,
  LayoutDashboard, Bell, ChevronDown, ShieldCheck,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessage } from '../../../contexts/MessageContext';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const AdminHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'community' | 'config'
  const menuRef = useRef(null);
  
  const { user, logout } = useAuth();
  const { unreadCount } = useMessage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  const mainLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/properties', label: 'Annonces', icon: Building2 },
    { to: '/admin/submissions', label: 'Soumissions', icon: ClipboardList },
  ];

  const communityLinks = [
    { to: '/admin/users', label: 'Utilisateurs', icon: Users },
    { to: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
  ];

  const configLinks = [
    { to: '/admin/analytics', label: 'Statistiques', icon: BarChart3 },
    { to: '/admin/settings', label: 'Configuration', icon: Settings },
  ];

  const onLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/home');
  };

  const isHome = location.pathname.startsWith('/home');

  // Portal content for mobile menu
  const mobileMenuOverlay = createPortal(
    <div className={cn(
      "fixed inset-0 z-[110] bg-zinc-950 transition-all duration-500 px-6 py-10 flex flex-col",
      mobileMenuOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible pointer-events-none"
    )}>
      <div className="flex items-center justify-between mb-10">
         <div className="flex items-center gap-3">
            <img src="/images/scim-logo.jpg" alt="Logo" className="h-10 w-10 rounded-full ring-2 ring-gold-primary/40" />
            <span className="font-black text-white text-2xl tracking-tighter italic uppercase">Admin<span className="text-gold-primary">SCIM</span></span>
         </div>
         <button onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-full bg-white/10 text-white">
           <X className="h-6 w-6" />
         </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
         {[...mainLinks, ...communityLinks, ...configLinks].map((l) => (
           <Link
            key={l.to}
            to={l.to}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-3xl text-lg font-black uppercase tracking-wider transition-all",
              isActive(l.to) ? "bg-gold-primary text-black" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
           >
             <l.icon className={cn("h-6 w-6", isActive(l.to) ? "text-black" : "text-gold-primary")} />
             {l.label}
           </Link>
         ))}
      </nav>

      <div className="pt-8 border-t border-white/10 mt-6 flex flex-col gap-4">
         <Link to="/home" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full h-16 rounded-3xl font-black text-lg border-white/10 text-white">
              <Home className="w-5 h-5 mr-3" /> Retour au site
            </Button>
         </Link>
         <Button 
          onClick={onLogout}
          className="w-full h-16 rounded-3xl font-black text-lg bg-red-500/10 text-red-500 border border-red-500/20"
        >
          Déconnexion
        </Button>
      </div>
    </div>,
    document.body
  );

  return (
    <div className={cn(
      "z-[100] w-full transition-all duration-500",
      isHome ? "fixed top-0 left-0 right-0" : "sticky top-0 bg-transparent mb-4"
    )}>
      <div className={cn(
        "transition-all duration-500 flex justify-center px-4",
        isScrolled ? "pt-2" : "pt-4"
      )}>
        <div className={cn(
          "flex items-center justify-between gap-4 px-3 py-2 w-full max-w-6xl transition-all duration-700",
          isScrolled 
            ? "bg-zinc-950 border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]" 
            : "bg-zinc-950/70 border-white/20 shadow-sm",
          "backdrop-blur-2xl border rounded-full ring-1 ring-white/5"
        )}>
          {/* Left: Admin Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2 pl-2 group">
             <div className="relative">
                <div className="absolute -inset-1 bg-gold-primary/20 rounded-full blur group-hover:bg-gold-primary/40 transition duration-500" />
                <img src="/images/scim-logo.jpg" alt="Admin" className="relative h-9 w-9 rounded-full object-cover ring-1 ring-gold-primary/30" />
             </div>
             <div className="hidden sm:block leading-none">
                <span className="font-black text-white text-sm italic uppercase">SCIM <span className="text-gold-primary">ADMIN</span></span>
             </div>
          </Link>

          {/* Center: Management Navigation */}
          <nav className="hidden lg:flex items-center gap-1" ref={menuRef}>
            {mainLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2",
                  isActive(l.to) 
                    ? "bg-gold-primary text-black shadow-lg shadow-gold-primary/20" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <l.icon className="h-3.5 w-3.5" />
                <span>{l.label}</span>
              </Link>
            ))}

            {/* Community Dropdown */}
            <div className="relative">
               <button
                onClick={() => setActiveMenu(activeMenu === 'community' ? null : 'community')}
                className={cn(
                  "px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-white/5",
                  activeMenu === 'community' && "bg-white/5 text-white"
                )}
               >
                 <Users className="h-3.5 w-3.5" />
                 <span>Communauté</span>
                 <ChevronDown className={cn("h-3 w-3 transition-transform", activeMenu === 'community' && "rotate-180")} />
                 {unreadCount > 0 && <Badge className="ml-1 h-3.5 w-3.5 p-0 bg-red-500 border-none flex items-center justify-center text-[8px]" />}
               </button>

               {activeMenu === 'community' && (
                 <div className="absolute top-full mt-2 left-0 w-48 bg-zinc-900 border border-white/10 rounded-[20px] shadow-2xl p-1.5 animate-in fade-in zoom-in duration-200">
                    {communityLinks.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setActiveMenu(null)}
                        className={cn(
                          "flex items-center justify-between px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          isActive(l.to) ? "bg-white/10 text-gold-primary" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <l.icon className="h-3.5 w-3.5" />
                          {l.label}
                        </span>
                        {l.badge > 0 && <Badge className="bg-red-500 text-white border-none h-4 px-1">{l.badge}</Badge>}
                      </Link>
                    ))}
                 </div>
               )}
            </div>

            {/* Config Dropdown */}
            <div className="relative">
               <button
                onClick={() => setActiveMenu(activeMenu === 'config' ? null : 'config')}
                className={cn(
                  "px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-white/5",
                  activeMenu === 'config' && "bg-white/5 text-white"
                )}
               >
                 <Settings className="h-3.5 w-3.5" />
                 <span>Gestion</span>
                 <ChevronDown className={cn("h-3 w-3 transition-transform", activeMenu === 'config' && "rotate-180")} />
               </button>

               {activeMenu === 'config' && (
                 <div className="absolute top-full mt-2 right-0 w-48 bg-zinc-900 border border-white/10 rounded-[20px] shadow-2xl p-1.5 animate-in fade-in zoom-in duration-200">
                    {configLinks.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setActiveMenu(null)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          isActive(l.to) ? "bg-white/10 text-gold-primary" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <l.icon className="h-3.5 w-3.5" />
                        {l.label}
                      </Link>
                    ))}
                 </div>
               )}
            </div>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 pr-1">
             <Link 
              to="/home" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
             >
                <Home className="h-3.5 w-3.5" />
                <span>Site</span>
             </Link>

             <div className="h-6 w-px bg-white/10 hidden sm:block mx-1" />

             <div className="flex items-center gap-2 pl-1">
                <div className="hidden md:block text-right mr-1">
                   <p className="text-[10px] font-black text-white uppercase tracking-tighter">Master Admin</p>
                   <p className="text-[9px] text-gold-primary/70 font-bold uppercase truncate max-w-[80px]">
                      {user?.nom || 'Admin'}
                   </p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
             </div>

             {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full bg-white/10 text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Rendu du menu mobile via Portal */}
      {mobileMenuOverlay}
    </div>
  );
};

export default AdminHeader;
