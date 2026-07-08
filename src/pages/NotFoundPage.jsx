import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, Building2 } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-gold-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[100px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-24 w-24 rounded-3xl bg-zinc-900/80 border border-white/10 flex items-center justify-center shadow-2xl">
            <Building2 className="h-12 w-12 text-zinc-600" />
          </div>
        </div>

        {/* 404 */}
        <div className="mb-4">
          <span className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-300 to-gold-primary leading-none block">
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight mb-3">
          Page introuvable<span className="text-gold-primary">.</span>
        </h1>
        <p className="text-zinc-400 font-medium text-base leading-relaxed mb-10 max-w-sm mx-auto">
          Cette page n'existe pas ou a été déplacée. Retournez au catalogue ou à l'accueil.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 h-12 px-8 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/20 transition-all hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Accueil
          </Link>
          <Link
            to="/properties"
            className="flex items-center justify-center gap-2 h-12 px-8 rounded-2xl border border-white/10 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-white/20 font-black uppercase tracking-widest text-[10px] transition-all"
          >
            <Search className="h-4 w-4" />
            Catalogue
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 h-12 px-8 rounded-2xl border border-white/5 bg-zinc-950/60 text-zinc-500 hover:text-zinc-300 font-black uppercase tracking-widest text-[10px] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
        </div>

        {/* Quick links */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {[
            { to: '/about',   label: 'À propos' },
            { to: '/contact', label: 'Contact' },
            { to: '/login',   label: 'Connexion' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-[10px] font-black text-zinc-600 hover:text-gold-primary uppercase tracking-widest transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
