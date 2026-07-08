import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Search, Heart, User, LogOut, Plus, Settings, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import {Button} from '../ui/Button';
import {Badge} from '../ui/Badge';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useMessage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/home');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { path: '/home', label: 'Accueil', icon: Home },
    { path: '/properties', label: 'Propriétés', icon: Search },
    { path: '/offres-speciales', label: 'Offres', icon: null },
    { path: '/about', label: 'À propos', icon: null },
    { path: '/contact', label: 'Contact', icon: null },
  ];

  const baseAuthLinks = [
    { path: '/dashboard', label: 'Tableau de bord', icon: Settings },
    { path: '/messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
    { path: '/favorites', label: 'Favoris', icon: Heart },
    { path: '/profile', label: 'Profil', icon: User },
  ];
  const authenticatedLinks = user?.role === 'admin'
    ? [...baseAuthLinks.slice(0, 1), { path: '/add-property', label: 'Ajouter', icon: Plus }, ...baseAuthLinks.slice(1)]
    : baseAuthLinks;

  return (
    <nav className="bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-4 group">
            <div className="p-1 bg-gradient-to-br from-gold-primary to-gold-dark rounded-full">
              <img src="/images/scim-logo.jpg" alt="SCIM" className="h-10 w-10 rounded-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight">SCIM</span>
              <span className="text-[10px] font-black text-gold-primary uppercase tracking-[0.2em]">Immobilier Prestige</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300',
                  isActive(link.path) && 'text-gold-primary bg-gold-primary/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {authenticatedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 relative',
                      isActive(link.path) && 'text-gold-primary bg-gold-primary/10'
                    )}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    <span>{link.label}</span>
                    {typeof link.badge === 'number' && link.badge > 0 && (
                      <Badge variant="primary" size="sm" className="ml-1">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
                <div className="flex items-center text-sm text-zinc-500 max-w-[160px] pl-3 border-l border-white/10">
                  <span className="truncate font-bold">Bonjour, {user?.nom}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-zinc-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
                >
                  Connexion
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gold-primary hover:bg-amber-300 text-zinc-950 font-black">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <Link to="/dashboard" className="mr-3 text-zinc-400 hover:text-gold-primary">
                <Settings className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl">
            <div className="space-y-2">
              {/* Public Links */}
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all',
                    isActive(link.path) && 'text-gold-primary bg-gold-primary/10'
                  )}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
                  <div className="px-4 py-2 text-sm text-zinc-500 mb-2 font-bold">
                    Bonjour, {user?.nom} {user?.role === 'admin' ? '(admin)' : ''}
                  </div>
                  {authenticatedLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all',
                        isActive(link.path) && 'text-gold-primary bg-gold-primary/10'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {link.icon && <link.icon className="w-5 h-5" />}
                        <span>{link.label}</span>
                      </div>
                      {typeof link.badge === 'number' && link.badge > 0 && (
                        <Badge variant="primary" size="sm">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-all w-full text-left mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-2xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-gold-primary hover:bg-amber-300 text-zinc-950 font-black">
                      Inscription
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
