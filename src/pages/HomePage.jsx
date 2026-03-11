import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, TrendingUp, Shield, Award, ArrowRight, Star, MapPin, Home, Building, Users, CheckCircle, Target, Heart, ChevronRight, Sparkles } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import PropertyCard from '../components/properties/PropertyCard';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { HomeStructuredData } from '../components/seo/StructuredData';
import { seoConfig, organizationStructuredData } from '../utils/seoData';

const HomePage = () => {
  const { properties, loading, fetchProperties } = useProperty();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [activeStat, setActiveStat] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties(1, { limit: 6 });
  }, [fetchProperties]);

  useEffect(() => {
    const featured = [...(properties || [])]
      .sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0))
      .slice(0, 3);
    setFeaturedProperties(featured);
  }, [properties]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (categoryValue) => {
    navigate(`/properties?category=${encodeURIComponent(categoryValue)}`);
  };

  const stats = [
    { 
      icon: TrendingUp, 
      label: 'Propriétés vendues', 
      value: '500+',
      description: 'Transactions d\'excellence'
    },
    { 
      icon: Shield, 
      label: 'Satisfaction client', 
      value: '98%',
      description: 'Prestige & Confiance'
    },
    { 
      icon: Award, 
      label: "Années d'expertise", 
      value: '5+',
      description: 'Leader du marché'
    },
  ];

  const features = [
    {
      icon: Search,
      title: 'Recherche Intelligente',
      description: 'Algorithme prédictif et filtres exclusifs pour trouver votre domaine idéal.',
      gradient: 'from-gold-primary/20 to-gold-dark/20'
    },
    {
      icon: Shield,
      title: 'Sécurité Totale',
      description: 'Protocoles de vérification blindés pour des transactions en toute discrétion.',
      gradient: 'from-amber-500/20 to-amber-600/20'
    },
    {
      icon: Award,
      title: 'Expertise Locale',
      description: "Une connaissance chirurgicale du patrimoine immobilier congolais.",
      gradient: 'from-gold-primary/20 to-gold-dark/20'
    },
  ];

  const categories = [
    { name: 'Appartements', value: 'Appartement', icon: Building, color: 'text-blue-400' },
    { name: 'Maisons', value: 'Maison', icon: Home, color: 'text-emerald-400' },
    { name: 'Terrains', value: 'Terrain', icon: MapPin, color: 'text-amber-400' },
    { name: 'Commercial', value: 'Commercial', icon: Building, color: 'text-purple-400' },
  ];

  const testimonials = [
    {
      name: 'Marie K.',
      role: 'Acheteuse Prestige',
      content: "SCIM a su comprendre mes exigences les plus élevées. Un service d'exception pour une propriété d'exception.",
      rating: 5,
      date: 'Janvier 2024'
    },
    {
      name: 'Jean-Paul M.',
      role: 'Investisseur',
      content: "Une plateforme qui redéfinit le haut de gamme au Congo. Transparence et efficacité inégalées.",
      rating: 5,
      date: 'Décembre 2023'
    },
    {
      name: 'Sarah D.',
      role: 'Propriétaire',
      content: "La gestion immobilière n'a jamais été aussi sereine. Un partenaire luxe de confiance.",
      rating: 5,
      date: 'Novembre 2023'
    },
  ];

  const backgroundEffects = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-gold-primary/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-0 -right-1/4 w-[800px] h-[800px] bg-gold-dark/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/2 rounded-full blur-[200px]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-gold-primary/30">
      <SEOHead 
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        keywords={seoConfig.home.keywords}
        image={seoConfig.home.image}
        structuredData={organizationStructuredData}
      />
      <HomeStructuredData />

      {/* Hero Section Luxe */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 sm:pt-40">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-110"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-gold-primary" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/80">L'Immobilier de Prestige au Congo</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">
            Votre Patrimoine <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-200 to-gold-dark">D'Exception</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed px-4">
            Accédez à une sélection exclusive de propriétés luxueuses et d'opportunités d'investissement uniques au Congo-Brazzaville.
          </p>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-16 px-4">
            <div className="relative group p-1 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-[32px] backdrop-blur-2xl">
              <div className="flex flex-col md:flex-row gap-2 bg-zinc-900/60 rounded-[30px] p-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 group-focus-within:text-gold-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Quartier, ville, référence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-16 pl-16 pr-6 bg-transparent text-white placeholder-zinc-500 outline-none font-bold text-lg"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-16 px-12 rounded-2xl bg-gold-primary hover:bg-amber-300 text-zinc-950 font-black uppercase tracking-widest text-xs shadow-2xl transition-all"
                >
                  Découvrir
                </Button>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => handleCategoryClick(cat.value)}
                className="group flex flex-col items-center gap-3 p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-gold-primary/50 hover:bg-zinc-800/60 transition-all duration-500 min-w-[140px]"
              >
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${cat.color}`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Dark */}
      <section className="py-32 relative overflow-hidden">
        {backgroundEffects}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className={`group p-10 rounded-[40px] border transition-all duration-700 ${
                  activeStat === idx 
                    ? 'bg-zinc-900/60 border-gold-primary/30 shadow-[0_40px_80px_rgba(0,0,0,0.5)] scale-105' 
                    : 'bg-zinc-900/20 border-white/5'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-12 ${
                  activeStat === idx ? 'bg-gold-primary text-zinc-950' : 'bg-white/5 text-gold-primary'
                }`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">{stat.value}</div>
                <h3 className="text-lg font-black uppercase tracking-widest text-zinc-500 mb-2">{stat.label}</h3>
                <p className="text-zinc-500 font-medium">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary">
                Selection Collector
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                Nos <span className="text-gold-primary">Joyaux</span> Immobiliers
              </h2>
            </div>
            <Link to="/properties" className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
              Voir toute la collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
              {featuredProperties.map((property, idx) => (
                <div key={property._id} className="animate-in fade-in slide-in-from-bottom-5" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">
            <Target className="w-3 h-3 text-gold-primary" />
            Notre Philosophie
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-none">
            L'Excellence <span className="text-gold-primary">sans Compromis</span>
          </h2>
          <p className="text-zinc-400 font-medium text-lg max-w-2xl mx-auto">
            Chaque transaction est traitée avec le plus haut niveau de professionnalisme, de sécurité et d'expertise.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group bg-zinc-900/40 backdrop-blur-xl rounded-[40px] border border-white/5 p-12 hover:border-gold-primary/30 transition-all duration-700">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">
              <Heart className="w-3 h-3 text-gold-primary" />
              Témoignages
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              Une Confiance <span className="text-gold-primary">Inébranlable</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-zinc-900/40 backdrop-blur-xl rounded-[40px] p-10 border border-white/5 hover:border-white/10 transition-all duration-500">
                <div className="flex gap-1 mb-8">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-primary fill-gold-primary" />
                  ))}
                </div>
                <p className="text-zinc-300 font-medium text-lg italic mb-10 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-8">
                  <div>
                    <div className="font-black text-white uppercase tracking-widest text-xs mb-1">{t.name}</div>
                    <div className="text-[10px] font-black text-gold-primary uppercase tracking-[0.2em]">{t.role}</div>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{t.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Luxe */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-primary to-gold-dark rounded-[50px] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-gradient-to-r from-gold-primary to-gold-dark rounded-[50px] p-12 lg:p-24 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/luxury-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-zinc-950 tracking-tighter mb-8 leading-[1]">
              Devenez <br /> Propriétaire
            </h2>
            
            <p className="text-zinc-950 font-bold text-lg mb-12 max-w-2xl mx-auto opacity-80">
              Rejoignez le cercle restreint des investisseurs privilégiés de SCIM Immobilier.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register">
                <Button className="h-20 px-12 bg-zinc-950 text-white hover:bg-black rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl">
                   S'inscrire Maintenant
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="h-20 px-12 border-zinc-950/20 text-zinc-950 hover:bg-zinc-950 hover:text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs">
                   Consultation Privée
                </Button>
              </Link>
            </div>
            
            <p className="text-zinc-950/50 mt-12 text-[10px] font-black uppercase tracking-[0.3em]">
              Assistance 24/7 • Expertise Locale • Sécurité Garantie
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;