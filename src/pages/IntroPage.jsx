import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Home, Search, Shield, Users, Clock, CheckCircle, MapPin, Building, TrendingUp, Star, Heart } from 'lucide-react';

const IntroPage = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const skipButtonTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 2000);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          navigate('/home');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Animation des étapes
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);

    return () => {
      clearTimeout(skipButtonTimer);
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, [navigate]);

  const handleSkip = () => {
    navigate('/home');
  };

  const stats = [
    { value: '500+', label: 'Biens disponibles' },
    { value: '98%', label: 'Satisfaction client' },
    { value: '24h', label: 'Support réactif' },
    { value: '5★', label: 'Note moyenne' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Sécurité Totale',
      description: 'Toutes nos annonces sont vérifiées et certifiées pour garantir votre tranquillité d\'esprit.',
      color: 'from-blue-500/20 to-blue-600/20'
    },
    {
      icon: Search,
      title: 'Recherche Intelligente',
      description: 'Filtres avancés et algorithmes intelligents pour trouver votre bien idéal rapidement.',
      color: 'from-purple-500/20 to-purple-600/20'
    },
    {
      icon: Users,
      title: 'Communauté Vérifiée',
      description: 'Rejoignez une communauté de propriétaires et locataires authentifiés et fiables.',
      color: 'from-green-500/20 to-green-600/20'
    },
    {
      icon: CheckCircle,
      title: 'Service Premium',
      description: 'Support dédié et accompagnement personnalisé à chaque étape de votre recherche.',
      color: 'from-orange-500/20 to-orange-600/20'
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Créez votre profil',
      description: 'Inscription simple et sécurisée en moins de 2 minutes',
      active: activeStep === 0
    },
    {
      number: '02',
      title: 'Explorez les biens',
      description: 'Parcourez notre sélection de propriétés premium',
      active: activeStep === 1
    },
    {
      number: '03',
      title: 'Contactez directement',
      description: 'Échangez en toute confiance avec les propriétaires',
      active: activeStep === 2
    },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background avec gradient */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            filter: 'brightness(0.7)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95"></div>
        {/* Pattern overlay subtil */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '400px 400px'
          }}></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10 text-white px-4 sm:px-6 lg:px-8">
        {/* En-tête avec logo */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-gold-primary to-gold-dark p-3 rounded-2xl shadow-2xl mb-8 group hover:scale-105 transition-transform duration-300">
            <div className="bg-white p-2 rounded-xl">
              <img 
                src="/images/scim-logo.jpg" 
                alt="SCIM" 
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white shadow-lg" 
              />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="text-gold-primary">SCIM Immobilier</span>
          </h1>

          <div className="inline-flex items-center space-x-2 mb-6">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-lg font-medium text-gray-300">Congo-Brazzaville</span>
          </div>

          <div className="mx-auto my-8 h-px w-32 bg-white/20"></div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Votre passerelle vers l'immobilier d'exception au Congo-Brazzaville
          </p>
        </div>

        {/* Stats en ligne */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-gold-primary mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Vision et mission */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-12 border border-white/20">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-px bg-gold-primary"></div>
            <span className="text-gold-primary font-semibold uppercase tracking-wider text-sm">Notre Mission</span>
            <div className="w-8 h-px bg-gold-primary"></div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Révolutionner <span className="text-gold-primary">l'immobilier</span> au Congo
          </h2>
          
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Nous connectons propriétaires et locataires dans un écosystème moderne, 
            sécurisé et transparent. Notre plateforme transforme l'expérience immobilière 
            grâce à la technologie et l'expertise locale.
          </p>

          {/* Fonctionnalités */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/10 hover:border-gold-primary/30 hover:bg-white/15 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comment ça fonctionne */}
        <div className="relative mb-8 sm:mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/20 to-gold-dark/20 rounded-2xl sm:rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-gold-primary to-gold-dark rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px'
              }}></div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white">Comment ça fonctionne ?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 border transition-all duration-300 ${
                    step.active 
                      ? 'border-white scale-105 shadow-lg' 
                      : 'border-white/20'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                    step.active 
                      ? 'bg-white text-gold-primary' 
                      : 'bg-white/20 text-white'
                  }`}>
                    <span className="text-lg font-bold">{step.number}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white">{step.title}</h3>
                  <p className="text-sm text-white/90 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minuterie et CTA */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Clock className="w-6 h-6 text-gold-primary animate-pulse" />
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Redirection automatique dans</div>
                <div className="text-2xl font-bold text-white">{timeLeft}s</div>
              </div>
            </div>
            
            {showSkipButton && (
              <button
                onClick={handleSkip}
                className="group w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-primary to-gold-dark text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-lg">Commencer l'expérience</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Plateforme immobilière certifiée</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Made with passion in Congo</span>
            </div>
          </div>
          
          <div className="mt-6 text-xs sm:text-sm text-gray-500">
            <p>© {currentYear} SCIM Immobilier • Votre avenir commence ici</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;