import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart, Home, LogOut, Menu, Search, User, X, 
  LayoutDashboard, Shield, Sparkles, ChevronDown, 
  PlusCircle, Info, Phone, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessage } from '../../../contexts/MessageContext';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const ClientHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const moreMenuRef = useRef(null);
  
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (to) => location.pathname === to || (to !== '/home' && location.pathname.startsWith(to));

  const mainLinks = [
    { to: '/home', label: 'Accueil', icon: Home },
    { to: '/properties', label: 'Propriétés', icon: Search },
    { to: '/offres-speciales', label: 'Offres', icon: Sparkles },
  ];

  const moreLinks = [
    { to: '/soumettre-bien', label: 'Proposer un bien', icon: PlusCircle },
    { to: '/about', label: 'À propos', icon: Info },
    { to: '/contact', label: 'Contact', icon: Phone },
  ];

  const onLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/home');
  };

  const isHome = ["/", "/home"].includes(location.pathname);

  // Portal content for mobile menu
  const mobileMenuOverlay = createPortal(
    <div className={cn(
      "fixed inset-0 z-[110] bg-zinc-950 transition-all duration-500",
      mobileMenuOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible pointer-events-none"
    )}>
      {/* Sticky top bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
          <img src="/images/scim-logo.jpg" alt="Logo" className="h-10 w-10 rounded-full ring-2 ring-gold-primary/20" />
          <span className="font-black text-white text-2xl tracking-tighter italic uppercase">SCIM<span className="text-gold-primary">.</span></span>
        </Link>
        <button onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-full bg-white/10 text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto h-[calc(100%-73px)] px-6 py-6 flex flex-col gap-4">
        {/* User info */}
        {isAuthenticated && (
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/10">
            <div className="h-12 w-12 rounded-full bg-zinc-900 shadow-sm flex items-center justify-center text-gold-primary border border-white/10 shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-white">{user?.nom || user?.name || user?.email}</p>
              <p className="text-xs text-gold-primary uppercase font-black tracking-widest">Client Privilège</p>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex flex-col gap-1">
          {[...mainLinks, ...moreLinks].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-3xl text-lg font-bold transition-all",
                isActive(l.to) ? "bg-gold-primary text-black" : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <l.icon className={cn("h-5 w-5", isActive(l.to) ? "text-black" : "text-gold-primary")} />
              {l.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-3xl text-lg font-bold text-gold-primary hover:bg-white/5"
            >
              <Shield className="h-5 w-5" />
              Panel Administrateur
            </Link>
          )}
        </nav>

        {/* Auth actions */}
        <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-3">
          {isAuthenticated ? (
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full h-14 rounded-3xl font-bold text-lg border-white/10 text-red-500 hover:bg-red-500/10"
            >
              Déconnexion
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-14 rounded-3xl font-bold text-base border-white/10 text-white">Log In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-14 rounded-3xl bg-gold-primary hover:bg-gold-dark text-white font-bold text-base">Join US</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <div className={cn(
      "z-[100] w-full transition-all duration-500 will-change-transform",
      isHome ? "fixed top-0 left-0 right-0" : "sticky top-0 bg-transparent mb-4"
    )}>
      <div className={cn(
        "transition-all duration-500 flex justify-center px-4",
        isScrolled ? "pt-2" : "pt-4"
      )}>
        <div className={cn(
          "flex items-center justify-between gap-4 px-3 py-2 w-full max-w-6xl transition-all duration-700",
          isScrolled 
            ? "bg-zinc-950/95 border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]" 
            : "bg-zinc-950/80 border-white/20 shadow-sm",
          "backdrop-blur-sm border rounded-full ring-1 ring-white/5"
        )}>
          {/* Left: Logo */}
          <Link to="/home" className="flex items-center gap-2 pl-2 group">
             <div className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-gold-primary/20 group-hover:ring-gold-primary/40 transition-all">
                <img src="/images/scim-logo.jpg" alt="SCIM" className="w-full h-full object-cover scale-110" />
             </div>
             <span className="hidden sm:block font-black text-white tracking-tighter text-base leading-none italic uppercase">
                SCIM<span className="text-gold-primary">.</span>
             </span>
          </Link>

          {/* Center: Grouped Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                  isActive(l.to) 
                    ? "bg-gold-primary text-black shadow-lg shadow-gold-primary/20" 
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                )}
              >
                <l.icon className="h-4 w-4" />
                <span>{l.label}</span>
              </Link>
            ))}

            {/* "Plus" Group */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMore(!showMore)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-white/10",
                  showMore && "bg-white/10 text-white"
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span>Explorer</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", showMore && "rotate-180")} />
              </button>

              {showMore && (
                <div className="absolute top-full mt-2 left-0 w-56 bg-zinc-900 border border-white/10 rounded-[24px] shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                   {moreLinks.map((l) => (
                     <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                        isActive(l.to) ? "bg-gold-primary text-black" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      )}
                     >
                       <l.icon className="h-4 w-4" />
                       {l.label}
                     </Link>
                   ))}
                   {user?.role === 'admin' && (
                     <Link
                        to="/admin/dashboard"
                        onClick={() => setShowMore(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gold-primary hover:bg-white/5 mt-1"
                     >
                       <Shield className="h-4 w-4" />
                       Panel Admin
                     </Link>
                   )}
                </div>
              )}
            </div>
          </nav>

          {/* Right: User / Auth */}
          <div className="flex items-center gap-1.5 pr-1">
            {isAuthenticated ? (
              <div className="flex items-center gap-1 px-1.5 py-1 bg-white/5 rounded-full border border-white/5">
                <Link
                  to="/dashboard"
                  className={cn(
                    "p-2 rounded-full transition-all",
                    isActive('/dashboard') ? "bg-white/10 text-gold-primary" : "text-zinc-400 hover:text-white"
                  )}
                  title="Mon Espace"
                >
                  <LayoutDashboard className="h-4.5 w-4.5" />
                </Link>
                <Link
                  to="/favorites"
                  className={cn(
                    "p-2 rounded-full transition-all",
                    isActive('/favorites') ? "bg-white/10 text-red-500" : "text-zinc-400 hover:text-red-500"
                  )}
                  title="Favoris"
                >
                  <Heart className="h-4.5 w-4.5" />
                </Link>
                <Link
                  to="/profile"
                  className={cn(
                    "flex items-center gap-2 pl-2 pr-1 h-9 rounded-full bg-white/5 border border-white/10 hover:border-gold-primary/30 transition-all",
                    isActive('/profile') && "border-gold-primary/50 text-gold-primary"
                  )}
                >
                   <span className="hidden sm:block text-[10px] font-black uppercase text-white truncate max-w-[80px]">
                      {user?.nom || user?.name || 'Moi'}
                   </span>
                   <div className="h-7 w-7 rounded-full bg-gold-primary/20 flex items-center justify-center text-gold-primary border border-gold-primary/30">
                      <User className="h-3.5 w-3.5" />
                   </div>
                </Link>
                <button 
                  onClick={onLogout}
                  className="p-2.5 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all ml-1"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex rounded-full text-zinc-300 hover:text-white font-bold px-5 h-9">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full bg-gold-primary hover:bg-gold-dark text-white font-bold px-6 h-9 shadow-lg shadow-gold-primary/20">
                    Join SCIM
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full bg-white/10 text-white border border-white/10"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Rendu de l'overlay mobile via Portal */}
      {mobileMenuOverlay}
    </div>
  );
};

export default ClientHeader;
