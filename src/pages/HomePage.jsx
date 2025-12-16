import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Shield, Award, ArrowRight, Star, MapPin, Home, Building, Users, CheckCircle, Target, Heart, ChevronRight } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import PropertyCard from '../components/properties/PropertyCard';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatPrice } from '../lib/utils';
import SEOHead from '../components/seo/SEOHead';
import { HomeStructuredData } from '../components/seo/StructuredData';
import { seoConfig, organizationStructuredData } from '../utils/seoData';

const HomePage = () => {
  const { properties, loading, fetchProperties } = useProperty();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [activeStat, setActiveStat] = useState(0);

  useEffect(() => {
    fetchProperties(1, { limit: 6 });
  }, [fetchProperties]);

  useEffect(() => {
    // Get featured properties (highest rated or most expensive)
    const featured = [...(properties || [])]
      .sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0))
      .slice(0, 3);
    setFeaturedProperties(featured);
  }, [properties]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/properties?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const stats = [
    { 
      icon: TrendingUp, 
      label: 'Propriétés vendues', 
      value: '500+',
      description: 'Transactions réussies'
    },
    { 
      icon: Shield, 
      label: 'Satisfaction client', 
      value: '98%',
      description: 'Taux de recommandation'
    },
    { 
      icon: Award, 
      label: "Années d'expertise", 
      value: '5+',
      description: 'Sur le marché congolais'
    },
  ];

  const features = [
    {
      icon: Search,
      title: 'Recherche Intelligente',
      description: 'Algorithme avancé et filtres personnalisés pour trouver votre bien idéal en quelques clics.',
      gradient: 'from-blue-500/20 to-blue-600/20'
    },
    {
      icon: Shield,
      title: 'Sécurité Totale',
      description: 'Transactions sécurisées avec vérification KYC et accompagnement par des experts certifiés.',
      gradient: 'from-emerald-500/20 to-emerald-600/20'
    },
    {
      icon: Award,
      title: 'Expertise Locale',
      description: "Notre équipe connaît parfaitement le marché immobilier congolais et ses spécificités.",
      gradient: 'from-amber-500/20 to-amber-600/20'
    },
  ];

  const categories = [
    { name: 'Appartements', icon: Building, count: 125, color: 'bg-blue-500/10 text-blue-600' },
    { name: 'Maisons', icon: Home, color: 'bg-emerald-500/10 text-emerald-600' },
    { name: 'Terrains', icon: MapPin, color: 'bg-amber-500/10 text-amber-600' },
    { name: 'Hôtel', icon: Building, color: 'bg-purple-500/10 text-purple-600' },
    { name: 'Commercial', icon: Building, color: 'bg-purple-500/10 text-purple-600' },
  ];

  const testimonials = [
    {
      name: 'Marie K.',
      role: 'Acheteuse',
      content: "SCIM m'a aidée à trouver la maison parfaite pour ma famille. Leur accompagnement a été exceptionnel !",
      rating: 5,
      date: 'Janvier 2024'
    },
    {
      name: 'Jean-Paul M.',
      role: 'Investisseur',
      content: "Plateforme professionnelle et fiable. J'ai pu investir en toute sérénité grâce à leur expertise.",
      rating: 5,
      date: 'Décembre 2023'
    },
    {
      name: 'Sarah D.',
      role: 'Propriétaire',
      content: "La gestion de ma location est devenue tellement plus simple avec SCIM. Je recommande vivement !",
      rating: 5,
      date: 'Novembre 2023'
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        keywords={seoConfig.home.keywords}
        image={seoConfig.home.image}
        structuredData={organizationStructuredData}
      />
      <HomeStructuredData />

      {/* Hero Section améliorée */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background avec parallax effect */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
              transform: 'scale(1.1)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/95"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px'
            }}></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Congo-Brazzaville</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              Votre
              <span className="text-gold-primary block mt-2">Avenir Immobilier</span>
              Commence Ici
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Découvrez la plateforme immobilière premium qui transforme vos projets en réalités tangibles.
            </p>

            {/* Search Bar améliorée */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/20 to-gold-dark/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 z-10" />
                  <input
                    type="text"
                    placeholder="Recherchez un bien, un quartier, une opportunité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-32 py-5 text-lg rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent transition-all duration-300"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gold-primary to-gold-dark hover:from-gold-dark hover:to-gold-primary"
                  >
                    <span className="flex items-center">
                      Explorer
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category, index) => (
                <Link 
                  key={index}
                  to={`/properties?category=${category.name.toLowerCase()}`}
                  className="group flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-gold-primary/50 hover:bg-white/10 transition-all duration-300"
                >
                  <category.icon className={`w-4 h-4 ${category.color.split(' ')[2]}`} />
                  <span className="text-sm font-medium text-white">{category.name}</span> 
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <Button 
                  size="lg" 
                  className="group px-8 py-4 bg-gradient-to-r from-gold-primary to-gold-dark hover:from-gold-dark hover:to-gold-primary shadow-xl hover:shadow-2xl"
                >
                  <span className="flex items-center">
                    Découvrir les biens
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group px-8 py-4 backdrop-blur-sm border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  <span className="flex items-center">
                    Notre expertise
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Shape divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M0,0 L0,100 L1000,100 L1000,0 Q500,80 0,0 Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* Stats Section améliorée */}
      <section className="py-20 bg-white -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`group relative p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ${
                  activeStat === index ? 'bg-gradient-to-br from-white to-gray-50 scale-105' : 'bg-white'
                }`}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg transition-all duration-300 ${
                    activeStat === index 
                      ? 'bg-gradient-to-r from-gold-primary to-gold-dark scale-110' 
                      : 'bg-gradient-to-r from-gray-100 to-gray-200'
                  }`}>
                    <stat.icon className={`w-8 h-8 transition-all duration-300 ${
                      activeStat === index ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                
                <div className="pt-8 text-center">
                  <div className={`text-4xl lg:text-5xl font-bold mb-2 transition-all duration-300 ${
                    activeStat === index ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {stat.value}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</h3>
                  <p className="text-gray-500 text-sm">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties améliorée */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-px bg-gold-primary"></div>
              <span className="text-gold-primary font-semibold uppercase tracking-wider text-sm">Sélection Exclusive</span>
              <div className="w-12 h-px bg-gold-primary"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nos <span className="text-gold-primary">Coup de Cœur</span>
            </h2>
            
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Une sélection de propriétés exceptionnelles choisies pour leur caractère unique et leur potentiel.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredProperties.map((property, index) => (
                <div 
                  key={property._id} 
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PropertyCard 
                    property={property}
                    className="group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/properties">
              <Button 
                size="lg" 
                variant="outline"
                className="group px-8 py-4 border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-white"
              >
                <span className="flex items-center">
                  Explorer tout le catalogue
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section améliorée */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-6">
              <Target className="w-6 h-6 text-gold-primary" />
              <span className="text-gold-primary font-semibold uppercase tracking-wider text-sm">Notre Différence</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pourquoi <span className="text-gold-primary">Choisir SCIM</span> ?
            </h2>
            
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Une approche innovante qui place l'excellence et la confiance au cœur de chaque transaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-gold-primary/30"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-gray-900" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-6">
              <Heart className="w-6 h-6 text-gold-primary" />
              <span className="text-gold-primary font-semibold uppercase tracking-wider text-sm">Ils Nous Font Confiance</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Témoignages <span className="text-gold-primary">Clients</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                  <div className="text-sm text-gray-500">{testimonial.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section améliorée */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-primary via-gold-primary to-gold-dark"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Prêt à concrétiser <br />
            <span className="text-white/95">votre projet immobilier ?</span>
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Rejoignez notre communauté et accédez à des opportunités immobilières exclusives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-10 py-4 bg-white text-gold-primary hover:bg-gray-50 shadow-2xl hover:shadow-3xl text-lg font-semibold"
              >
                <span className="flex items-center justify-center">
                  Créer mon compte gratuit
                  <CheckCircle className="ml-3 w-5 h-5" />
                </span>
              </Button>
            </Link>
            
            <Link to="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-10 py-4 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  Contactez notre équipe
                  <Users className="ml-3 w-5 h-5" />
                </span>
              </Button>
            </Link>
          </div>
          
          <p className="text-white/70 mt-10 text-sm">
            Consultation gratuite • Réponse sous 24h • Expertise locale garantie
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;