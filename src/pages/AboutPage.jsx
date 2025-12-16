import React from 'react';
import { Award, Users, TrendingUp, Shield, Heart, Star, ChevronRight, Building, Target, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import SEO from '../components/layout/SEO';
import { seoConfig } from '../utils/seoData';

const AboutPage = () => {
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
        {/* Hero Section améliorée */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/90"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Building className="w-5 h-5" />
                <span className="text-sm font-medium">SCIM Immobilier</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                À Propos de
                <span className="text-gold-primary block mt-2">SCIM Immobilier</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Leader dans l'accompagnement immobilier depuis 2018, 
                nous transformons vos ambitions en réalités tangibles 
                avec expertise et passion.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-gold-primary hover:bg-gold-dark text-white px-8"
                  >
                    Rencontrer notre équipe
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Shape divider - Même que sur Home */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-12 text-white" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,0 L0,100 L1000,100 L1000,0 Q500,80 0,0 Z" fill="currentColor"/>
            </svg>
          </div>
        </section>

        {/* Stats Section améliorée - Avec -mt-1 comme sur Home */}
        <section className="py-20 bg-white -mt-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Chiffres Clés
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Une croissance constante et une satisfaction client exceptionnelle
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gold-primary to-gold-dark rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="pt-8 text-center">
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl lg:text-5xl font-bold text-gray-900">{stat.value}</span>
                      <span className="text-2xl text-gold-primary font-bold">{stat.suffix}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</h3>
                    <p className="text-gray-500 text-sm">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section avec timeline */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 mb-6">
                  <div className="w-12 h-px bg-gold-primary"></div>
                  <span className="text-gold-primary font-semibold uppercase tracking-wider text-sm">Notre Histoire</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                  Plus de 5 ans d'innovation <br />
                  <span className="text-gold-primary">et d'excellence</span>
                </h2>
                
                <div className="space-y-6">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    SCIM Immobilier a été fondée avec une vision claire : 
                    révolutionner l'expérience immobilière en plaçant 
                    <span className="font-semibold text-gray-900"> l'humain au cœur de chaque transaction</span>.
                  </p>
                  
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Notre parcours est marqué par une croissance organique, 
                    bâtie sur la confiance de nos clients et l'expertise de notre équipe.
                  </p>
                  
                  <ul className="space-y-3">
                    {['Expertise certifiée', 'Transparence totale', 'Accompagnement personnalisé', 'Solutions innovantes'].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-gold-primary mr-3 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Équipe SCIM Immobilier"
                    className="w-full h-96 object-cover"
                  />
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Notre Parcours en Chiffres</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {milestones.map((milestone, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-2xl font-bold text-gold-primary mb-1">{milestone.year}</div>
                          <div className="text-sm font-medium text-gray-900">{milestone.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section améliorée */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="w-12 h-px bg-gold-primary"></div>
                <span className="text-gold-primary font-semibold uppercase tracking-wider text-sm">Notre ADN</span>
                <div className="w-12 h-px bg-gold-primary"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Les Valeurs qui <span className="text-gold-primary">Nous Guident</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Notre succès repose sur des principes fondamentaux qui définissent 
                notre approche et notre engagement envers chaque client.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:border-gold-primary/30"
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gold-primary to-gold-dark rounded-xl group-hover:scale-110 transition-transform">
                        <value.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{value.description}</p>
                      
                      <div className="space-y-2">
                        {value.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="w-2 h-2 bg-gold-primary rounded-full mr-3"></div>
                            <span className="text-gray-700">{feature}</span>
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

        {/* Team Section améliorée */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Rencontrez <span className="text-gold-primary">Notre Équipe</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Des professionnels passionnés, experts dans leur domaine, 
                dédiés à la réussite de votre projet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-gold-primary font-semibold">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{member.description}</p>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-900">Expertises :</div>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 bg-gold-light text-gold-dark rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <Link to="/contact" className="inline-flex items-center text-gold-primary font-medium hover:text-gold-dark">
                        Contacter {member.name.split(' ')[0]}
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-white px-8"
                >
                  Réserver une consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section améliorée */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Target className="w-16 h-16 text-gold-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission & <span className="text-gold-primary">Engagement</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Transformer votre vision immobilière en réalité tangible, 
                avec une approche stratégique et personnalisée.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gold-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 mt-4">Accompagner avec Expertise</h3>
                <p className="text-gray-700 mb-8">
                  Nous accompagnons chaque client dans son parcours immobilier,
                  de la définition stratégique de ses besoins à la concrétisation 
                  optimale de son projet, grâce à notre expertise approfondie.
                </p>
                <ul className="space-y-3">
                  {['Analyse de besoins', 'Stratégie personnalisée', 'Suivi dédié'].map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-gold-primary mr-3" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gold-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 mt-4">Conseiller avec Précision</h3>
                <p className="text-gray-700 mb-8">
                  Notre expertise nous permet de fournir des conseils avisés,
                  basés sur une analyse rigoureuse du marché et une compréhension 
                  approfondie des enjeux immobiliers.
                </p>
                <ul className="space-y-3">
                  {['Étude de marché', 'Analyse financière', 'Optimisation fiscale'].map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-gold-primary mr-3" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gold-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 mt-4">Garantir la Réussite</h3>
                <p className="text-gray-700 mb-8">
                  Votre réussite est notre priorité absolue. Nous mettons tout 
                  en œuvre pour transformer votre projet immobilier en un succès 
                  durable et valorisant.
                </p>
                <ul className="space-y-3">
                  {['Négociation experte', 'Gestion du processus', 'Suivi post-transaction'].map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-gold-primary mr-3" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à concrétiser votre projet immobilier ?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Notre équipe d'experts vous attend pour une consultation personnalisée 
              et sans engagement. Transformons ensemble vos ambitions en réalité.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-gold-primary hover:bg-gray-50 px-10 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all"
                >
                  <div className="flex items-center">
                    <span>Démarrer mon projet</span>
                    <ChevronRight className="ml-3 w-5 h-5" />
                  </div>
                </Button>
              </Link>
              
              <Link to="/properties">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm"
                >
                  Explorer nos propriétés
                </Button>
              </Link>
            </div>
            
            <p className="text-white/70 mt-10 text-sm">
              Consultation gratuite • Réponse sous 24h • Expertise garantie
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;