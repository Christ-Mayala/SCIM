import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Shield, Award, ArrowRight, Star, MapPin, Home,
  Building, Building2, Users, Heart, Target, TrendingUp,
  ChevronRight, Sparkles, Play, Phone, Mail, Zap
} from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import PropertyCard from '../components/properties/PropertyCard';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { HomeStructuredData } from '../components/seo/StructuredData';
import { seoConfig, organizationStructuredData } from '../utils/seoData';
import { cn } from '../lib/utils';

/* ─── tiny animated counter ─── */
const AnimatedNumber = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = () => {
        start += Math.ceil(target / 60);
        if (start >= target) { setVal(target); return; }
        setVal(start);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
};

const HomePage = () => {
  const { properties, loading, fetchProperties } = useProperty();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTransaction, setActiveTransaction] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchProperties(1, { limit: 6 }); }, [fetchProperties]);
  useEffect(() => {
    const featured = [...(properties || [])]
      .sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0))
      .slice(0, 3);
    setFeaturedProperties(featured);
  }, [properties]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (activeTransaction) params.set('transactionType', activeTransaction);
    navigate(`/properties?${params.toString()}`);
  };

  const handleCategory = (cat) => navigate(`/properties?category=${encodeURIComponent(cat)}`);
  const handleTransaction = (t) => {
    const next = activeTransaction === t ? '' : t;
    setActiveTransaction(next);
  };

  const stats = [
    { icon: TrendingUp, value: 500, suffix: '+', label: 'Biens vendus',     sub: "Transactions d'excellence" },
    { icon: Users,      value: 98,  suffix: '%', label: 'Clients satisfaits', sub: 'Prestige & Confiance'      },
    { icon: Award,      value: 5,   suffix: '+', label: "Années d'expertise", sub: 'Leader au Congo'           },
  ];

  const categories = [
    { name: 'Appartements', value: 'Appartement', icon: Building2,  color: 'from-blue-500/20 to-blue-600/10',    text: 'text-blue-400',    border: 'border-blue-500/20' },
    { name: 'Maisons',      value: 'Maison',      icon: Home,       color: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    { name: 'Terrains',     value: 'Terrain',     icon: MapPin,     color: 'from-amber-500/20 to-amber-600/10',  text: 'text-amber-400',   border: 'border-amber-500/20' },
    { name: 'Commercial',   value: 'Commercial',  icon: Building,   color: 'from-purple-500/20 to-purple-600/10', text: 'text-purple-400',  border: 'border-purple-500/20' },
  ];

  const features = [
    { icon: Search,  title: 'Recherche Intelligente', desc: 'Algorithme prédictif et filtres exclusifs pour trouver votre domaine idéal.',       grad: 'from-gold-primary/30 to-amber-600/10' },
    { icon: Shield,  title: 'Sécurité Totale',        desc: 'Protocoles de vérification blindés pour des transactions en toute discrétion.',      grad: 'from-emerald-500/20 to-emerald-600/5' },
    { icon: Award,   title: 'Expertise Locale',       desc: 'Connaissance chirurgicale du patrimoine immobilier congolais depuis 5 ans.',          grad: 'from-blue-500/20 to-blue-600/5'       },
  ];

  const testimonials = [
    { name: 'Marie K.',      role: 'Acheteuse Prestige',  content: "SCIM a su comprendre mes exigences les plus élevées. Un service d'exception.", rating: 5, date: 'Jan 2024' },
    { name: 'Jean-Paul M.',  role: 'Investisseur',        content: 'Une plateforme qui redéfinit le haut de gamme au Congo. Transparence inégalée.', rating: 5, date: 'Déc 2023' },
    { name: 'Sarah D.',      role: 'Propriétaire',        content: "La gestion immobilière n'a jamais été aussi sereine. Un partenaire luxe.",       rating: 5, date: 'Nov 2023' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-gold-primary/30 overflow-x-hidden">
      <SEOHead title={seoConfig.home.title} description={seoConfig.home.description} keywords={seoConfig.home.keywords} image={seoConfig.home.image} structuredData={organizationStructuredData} />
      <HomeStructuredData />

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-24 sm:pt-28 overflow-hidden">
        {/* bg */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=75"
            alt="" className="absolute inset-0 w-full h-full object-cover scale-105" loading="eager" fetchpriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/75 to-zinc-950" />
          {/* glow blobs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-3.5 h-3.5 text-gold-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">L'Immobilier de Prestige au Congo</span>
          </div>

          {/* headline */}
          <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            Votre Patrimoine<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-200 to-amber-500">
              D'Exception
            </span>
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 text-base sm:text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Accédez à une sélection exclusive de propriétés luxueuses et d'opportunités d'investissement uniques au Congo-Brazzaville.
          </p>

          {/* transaction toggle + search */}
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 max-w-2xl mx-auto mb-10">
            {/* tabs */}
            <div className="flex items-center justify-center gap-1 mb-4">
              {[{ v: '', l: 'Tous les biens' }, { v: 'location', l: 'Location' }, { v: 'vente', l: 'Vente' }].map(t => (
                <button key={t.v} onClick={() => handleTransaction(t.v)}
                  className={cn(
                    'px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
                    activeTransaction === t.v
                      ? 'bg-gold-primary text-black shadow-lg shadow-gold-primary/30'
                      : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                  )}>
                  {t.l}
                </button>
              ))}
            </div>
            {/* search bar */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-gold-primary/10 rounded-3xl blur-xl group-focus-within:bg-gold-primary/15 transition-all pointer-events-none" />
              <div className="relative flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 group-focus-within:border-gold-primary/30 transition-all">
                <Search className="w-5 h-5 text-zinc-500 ml-4 shrink-0" />
                <input type="text" placeholder="Quartier, ville, type de bien..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 h-14 bg-transparent text-white placeholder-zinc-500 outline-none font-bold text-base" />
                <Button type="submit"
                  className="h-12 px-8 rounded-2xl bg-gold-primary hover:bg-amber-300 text-zinc-950 font-black uppercase tracking-widest text-xs shadow-xl shadow-gold-primary/30 shrink-0 transition-all hover:-translate-y-0.5">
                  Découvrir
                </Button>
              </div>
            </form>
          </div>

          {/* category chips */}
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button key={cat.value} onClick={() => handleCategory(cat.value)}
                className={cn(
                  'group flex items-center gap-2.5 px-5 py-3 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1',
                  `bg-gradient-to-br ${cat.color} ${cat.border} hover:border-opacity-60`
                )}>
                <cat.icon className={cn('w-4 h-4', cat.text)} />
                <span className={cn('text-[10px] font-black uppercase tracking-widest', cat.text)}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-gold-primary rounded-full" />
          <div className="w-2 h-2 bg-gold-primary rounded-full" />
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/20 to-zinc-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="group relative overflow-hidden bg-zinc-900/40 border border-white/5 rounded-[40px] p-10 hover:border-gold-primary/20 hover:bg-zinc-900/60 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px] pointer-events-none" />
                <div className="w-14 h-14 rounded-2xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <s.icon className="w-7 h-7 text-gold-primary" />
                </div>
                <div className="text-5xl font-black mb-1 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  <AnimatedNumber target={s.value} suffix={s.suffix} />
                </div>
                <p className="text-sm font-black text-zinc-300 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-xs text-zinc-500 font-medium">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED PROPERTIES ══════════ */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* section header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary">
                <Sparkles className="w-3 h-3" /> Sélection Collector
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                Nos <span className="text-gold-primary">Joyaux</span><br className="hidden md:block" /> Immobiliers
              </h2>
              <p className="text-zinc-400 max-w-md">Les biens les mieux notés, sélectionnés pour leur qualité et leur emplacement.</p>
            </div>
            <Link to="/properties"
              className="group flex items-center gap-3 px-6 py-3 bg-zinc-900/60 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/20 transition-all">
              Voir tout le catalogue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((p, i) => (
                <div key={p._id} className="animate-in fade-in slide-in-from-bottom-5 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )}

          {/* quick transaction links */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Biens en Location', desc: 'Appartements, maisons et studios disponibles maintenant.', t: 'location', color: 'from-blue-600/20', border: 'border-blue-500/20', icon: Home },
              { title: 'Biens en Vente',    desc: 'Investissez dans un bien d\'exception au Congo.',          t: 'vente',    color: 'from-gold-primary/20', border: 'border-gold-primary/20', icon: Building2 },
            ].map((item) => (
              <button key={item.t} onClick={() => navigate(`/properties?transactionType=${item.t}`)}
                className={cn(
                  'group text-left relative overflow-hidden rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl',
                  `bg-gradient-to-br ${item.color} to-zinc-900/40 ${item.border}`
                )}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-white/60" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400 font-medium">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="py-28 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">
              <Target className="w-3 h-3 text-gold-primary" /> Notre Philosophie
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-5">
              L'Excellence <span className="text-gold-primary">sans Compromis</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Chaque transaction est traitée avec le plus haut niveau de professionnalisme, de sécurité et d'expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group relative overflow-hidden bg-zinc-900/40 border border-white/5 rounded-[40px] p-10 hover:border-white/10 transition-all duration-500">
                <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px] pointer-events-none', f.grad)} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-gold-primary/30 transition-all">
                    <f.icon className="w-7 h-7 text-white/60 group-hover:text-gold-primary transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">
              <Heart className="w-3 h-3 text-rose-400" /> Témoignages
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              Une Confiance <span className="text-gold-primary">Inébranlable</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="group bg-zinc-900/40 border border-white/5 rounded-[40px] p-10 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-500">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-gold-primary fill-gold-primary" />
                  ))}
                </div>
                <p className="text-zinc-300 font-medium text-base italic mb-8 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                  <div>
                    <div className="font-black text-white uppercase tracking-widest text-xs mb-0.5">{t.name}</div>
                    <div className="text-[10px] font-black text-gold-primary uppercase tracking-widest">{t.role}</div>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{t.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-gold-primary via-amber-400 to-amber-600 p-1">
            <div className="relative bg-zinc-950 rounded-[46px] overflow-hidden">
              {/* bg pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
              <div className="relative z-10 py-24 px-8 lg:px-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary mb-8">
                  <Zap className="w-3 h-3" /> Rejoindre le Cercle
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-none">
                  Devenez<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-300 to-amber-500">
                    Propriétaire
                  </span>
                </h2>
                <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                  Rejoignez le cercle restreint des investisseurs privilégiés de SCIM Immobilier.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                  <Link to="/register">
                    <Button className="h-16 px-10 bg-gold-primary text-zinc-950 hover:bg-amber-300 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-gold-primary/30 transition-all hover:-translate-y-1">
                      S'inscrire Maintenant
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="h-16 px-10 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-3xl font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-1">
                      <Phone className="mr-2 w-4 h-4" /> Consultation Privée
                    </Button>
                  </Link>
                </div>
                <p className="text-zinc-600 mt-10 text-[10px] font-black uppercase tracking-[0.3em]">
                  Assistance 24/7 · Expertise Locale · Sécurité Garantie
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
