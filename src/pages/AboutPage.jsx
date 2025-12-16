import React from 'react';
import { Award, Users, TrendingUp, Shield, Heart, Star, ChevronRight, Building, Target, CheckCircle, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import SEO from '../components/layout/SEO';
import { seoConfig } from '../utils/seoData';

const AboutPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const stats = [
    { 
      icon: TrendingUp, 
      label: 'Propriétés vendues', 
      value: '500+',
      suffix: '',
      description: 'Transactions réussies'
    },
    { 
      icon: Users, 
      label: 'Clients satisfaits', 
      value: '750+',
      suffix: '',
      description: 'Depuis notre création'
    },
    { 
      icon: Award, 
      label: "Années d'expérience", 
      value: '5',
      suffix: '+',
      description: "D'expertise immobilière"
    },
    { 
      icon: Star, 
      label: 'Satisfaction client', 
      value: '4.9',
      suffix: '/5',
      description: 'Note moyenne'
    },
  ];

  const team = [
    {
      name: 'Théodor Bilongo',
      role: 'Directeur Général',
      image: '/images/about/theodor.jpg',
      description: "8 ans d'expérience dans l'immobilier de luxe",
      expertise: ['Immobilier de luxe', 'Stratégie', 'Management']
    },
    {
      name: 'Pierre Martin',
      role: 'Responsable Commercial',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      description: 'Expert en négociation et relation client',
      expertise: ['Négociation', 'Relation client', 'Marketing']
    },
    {
      name: 'Sophie Laurence',
      role: 'Conseillère Immobilière',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      description: "Spécialisée dans l'immobilier résidentiel",
      expertise: ['Résidentiel', 'Accompagnement', 'Évaluation']
    },
    {
      name: 'Thomas Malonga',
      role: 'Conseiller Investissement',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      description: 'Expert en investissement immobilier',
      expertise: ['Investissement', 'Rentabilité', 'Analyse de marché']
    },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Confiance & Transparence',
      description: 'Nous bâtissons des relations durables basées sur la transparence totale et l\'intégrité absolue dans chaque transaction.',
      features: ['Contrats clairs', 'Communication honnête', 'Frais transparents']
    },
    {
      icon: Award,
      title: 'Excellence & Expertise',
      description: "Nous visons l'excellence grâce à notre expertise approfondie du marché et notre rigueur professionnelle.",
      features: ['Expertise certifiée', 'Veille marché', 'Solutions sur-mesure']
    },
    {
      icon: Heart,
      title: 'Passion & Engagement',
      description: "Notre passion pour l'immobilier se traduit par un engagement total envers la réussite de votre projet.",
      features: ['Dévouement total', 'Suivi personnalisé', 'Réactivité']
    },
    {
      icon: Users,
      title: 'Accompagnement sur-mesure',
      description: 'Un accompagnement personnalisé à chaque étape, de la conception à la réalisation de votre projet.',
      features: ['Consultation gratuite', 'Suivi dédié', 'Support continu']
    },
  ];

  const milestones = [
    { year: '2018', title: 'Fondation de SCIM', description: 'Création avec une vision innovante' },
    { year: '2019', title: '100ème transaction', description: 'Premier palier significatif' },
    { year: '2020', title: "Expansion de l'équipe", description: 'Doublement des effectifs' },
    { year: '2022', title: 'Certification Qualité', description: 'Obtenu la certification ISO' },
    { year: '2023', title: '500+ transactions', description: 'Nouveau record annuel' },
  ];

  return (
    <>
      <SEO title={seoConfig.about.title} description={seoConfig.about.description} />
      <div className="min-h-screen bg-white">
        {/* Mobile Menu Button (optional) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Hero Section - Responsive */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/90"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 mb-4 md:mb-6 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Building className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm font-medium">SCIM Immobilier</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                À Propos de
                <span className="text-gold-primary block mt-1 md:mt-2">SCIM Immobilier</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
                Leader dans l'accompagnement immobilier depuis 2018, 
                nous transformons vos ambitions en réalités tangibles 
                avec expertise et passion.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto bg-gold-primary hover:bg-gold-dark text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                  >
                    <span className="flex items-center justify-center">
                      Rencontrer notre équipe
                      <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Shape divider - Responsive */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-8 sm:h-10 md:h-12 text-white" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,0 L0,100 L1000,100 L1000,0 Q500,80 0,0 Z" fill="currentColor"/>
            </svg>
          </div>
        </section>

        {/* Stats Section - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-white -mt-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Chiffres Clés
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                Une croissance constante et une satisfaction client exceptionnelle
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-gold-primary to-gold-dark rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="pt-6 sm:pt-8 md:pt-10 text-center">
                    <div className="flex items-baseline justify-center mb-1 sm:mb-2">
                      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">{stat.value}</span>
                      <span className="text-lg sm:text-xl md:text-2xl text-gold-primary font-bold">{stat.suffix}</span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{stat.label}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section avec timeline - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 mb-4 sm:mb-6">
                  <div className="w-8 sm:w-12 h-px bg-gold-primary"></div>
                  <span className="text-gold-primary font-semibold uppercase tracking-wider text-xs sm:text-sm">Notre Histoire</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                  Plus de 5 ans d'innovation <br />
                  <span className="text-gold-primary">et d'excellence</span>
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    SCIM Immobilier a été fondée avec une vision claire : 
                    révolutionner l'expérience immobilière en plaçant 
                    <span className="font-semibold text-gray-900"> l'humain au cœur de chaque transaction</span>.
                  </p>
                  
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    Notre parcours est marqué par une croissance organique, 
                    bâtie sur la confiance de nos clients et l'expertise de notre équipe.
                  </p>
                  
                  <ul className="space-y-2 sm:space-y-3">
                    {['Expertise certifiée', 'Transparence totale', 'Accompagnement personnalisé', 'Solutions innovantes'].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gold-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-1" />
                        <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="relative mt-8 lg:mt-0">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Équipe SCIM Immobilier"
                    className="w-full h-48 sm:h-64 md:h-72 lg:h-96 object-cover"
                  />
                  <div className="p-4 sm:p-6 md:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Notre Parcours en Chiffres</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
                      {milestones.map((milestone, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gold-primary mb-1">{milestone.year}</div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">{milestone.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="w-8 sm:w-12 h-px bg-gold-primary"></div>
                <span className="text-gold-primary font-semibold uppercase tracking-wider text-xs sm:text-sm">Notre ADN</span>
                <div className="w-8 sm:w-12 h-px bg-gold-primary"></div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Les Valeurs qui <span className="text-gold-primary">Nous Guident</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4">
                Notre succès repose sur des principes fondamentaux qui définissent 
                notre approche et notre engagement envers chaque client.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:border-gold-primary/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gold-primary to-gold-dark rounded-lg sm:rounded-xl group-hover:scale-105 sm:group-hover:scale-110 transition-transform">
                        <value.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{value.title}</h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{value.description}</p>
                      
                      <div className="space-y-1.5 sm:space-y-2">
                        {value.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold-primary rounded-full mr-2 sm:mr-3"></div>
                            <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Rencontrez <span className="text-gold-primary">Notre Équipe</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                Des professionnels passionnés, experts dans leur domaine, 
                dédiés à la réussite de votre projet.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-gold-primary font-semibold text-sm sm:text-base">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{member.description}</p>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">Expertises :</div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {member.expertise.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 sm:px-3 sm:py-1 bg-gold-light text-gold-dark rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                      <Link to="/contact" className="inline-flex items-center text-gold-primary font-medium text-sm sm:text-base hover:text-gold-dark">
                        Contacter {member.name.split(' ')[0]}
                        <ChevronRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8 sm:mt-12 md:mt-16">
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg"
                >
                  Réserver une consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <Target className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gold-primary mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Notre Mission & <span className="text-gold-primary">Engagement</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4">
                Transformer votre vision immobilière en réalité tangible, 
                avec une approche stratégique et personnalisée.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-lg">
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gold-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl sm:text-2xl">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8">Accompagner avec Expertise</h3>
                <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 md:mb-8">
                  Nous accompagnons chaque client dans son parcours immobilier,
                  de la définition stratégique de ses besoins à la concrétisation 
                  optimale de son projet, grâce à notre expertise approfondie.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {['Analyse de besoins', 'Stratégie personnalisée', 'Suivi dédié'].map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold-primary mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-lg">
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gold-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl sm:text-2xl">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8">Conseiller avec Précision</h3>
                <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 md:mb-8">
                  Notre expertise nous permet de fournir des conseils avisés,
                  basés sur une analyse rigoureuse du marché et une compréhension 
                  approfondie des enjeux immobiliers.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {['Étude de marché', 'Analyse financière', 'Optimisation fiscale'].map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold-primary mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-lg">
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gold-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl sm:text-2xl">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8">Garantir la Réussite</h3>
                <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 md:mb-8">
                  Votre réussite est notre priorité absolue. Nous mettons tout 
                  en œuvre pour transformer votre projet immobilier en un succès 
                  durable et valorisant.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {['Négociation experte', 'Gestion du processus', 'Suivi post-transaction'].map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold-primary mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Responsive */}
        <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-primary via-gold-primary to-gold-dark"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Prêt à concrétiser votre projet immobilier ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4 leading-relaxed">
              Notre équipe d'experts vous attend pour une consultation personnalisée 
              et sans engagement. Transformons ensemble vos ambitions en réalité.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-white text-gold-primary hover:bg-gray-50 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center justify-center">
                    <span>Démarrer mon projet</span>
                    <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </Button>
              </Link>
              
              <Link to="/properties" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent border border-white sm:border-2 text-white hover:bg-white/10 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl backdrop-blur-sm"
                >
                  Explorer nos propriétés
                </Button>
              </Link>
            </div>
            
            <p className="text-white/70 mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm">
              Consultation gratuite • Réponse sous 24h • Expertise garantie
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;