import React from 'react';
import { Award, Users, TrendingUp, Shield, Heart, Star, ChevronRight, Building, Target, CheckCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import SEO from '../components/layout/SEO';
import { seoConfig } from '../utils/seoData';
import PageHero from '../components/layout/PageHero';
import '../animations.css';

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
      value: '3',
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
      image: 'https://api.dicebear.com/9.x/notionists/svg?seed=Theodor%20Bilongo&backgroundColor=18181b',
      description: "Fondateur, expert de l'immobilier de luxe",
      expertise: ['Immobilier de luxe', 'Stratégie', 'Management']
    },
    {
      name: 'Pierre Martin',
      role: 'Responsable Commercial',
      image: 'https://api.dicebear.com/9.x/notionists/svg?seed=Pierre%20Martin&backgroundColor=18181b',
      description: 'Expert en négociation et relation client',
      expertise: ['Négociation', 'Relation client', 'Marketing']
    },
    {
      name: 'Sophie Laurence',
      role: 'Conseillère Immobilière',
      image: 'https://api.dicebear.com/9.x/notionists/svg?seed=Sophie%20Laurence&backgroundColor=18181b',
      description: "Spécialisée dans l'immobilier résidentiel",
      expertise: ['Résidentiel', 'Accompagnement', 'Évaluation']
    },
    {
      name: 'Thomas Malonga',
      role: 'Conseiller Investissement',
      image: 'https://api.dicebear.com/9.x/notionists/svg?seed=Thomas%20Malonga&backgroundColor=18181b',
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
    { year: '2023', title: 'Création de SCIM', description: 'Fondée le 10 juillet 2023 avec une vision innovante' },
    { year: '2023', title: 'Lancement officiel', description: 'Ouverture officielle à Brazzaville le 11 novembre 2023' },
    { year: '2024', title: "Expansion de l'équipe", description: 'Renforcement de nos équipes terrain' },
    { year: '2025', title: 'Certification Qualité', description: 'Obtention de la certification ISO' },
    { year: '2026', title: '500+ transactions', description: 'Nouveau record annuel' },
  ];

  return (
    <>
      <SEO title={seoConfig.about.title} description={seoConfig.about.description} />
      <div className="min-h-screen bg-zinc-950">
        {/* Hero Section améliorée */}
        <PageHero
          badgeIcon={Building}
          badgeText="A propos SCIM"
          title={
            <>
              À propos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-200">SCIM Immobilier</span>
            </>
          }
          description="Leader dans l'accompagnement immobilier depuis 2023, nous transformons vos ambitions en realites tangibles avec expertise et passion."
          backgroundImage="https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          className="pb-10"
          actions={(
            <>
              <Link to="/contact">
                <Button className="bg-gold-primary text-zinc-950 hover:bg-amber-300">
                  Rencontrer notre equipe
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/properties">
                <Button variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10">
                  <Search className="mr-2 h-4 w-4" />
                  Explorer nos biens
                </Button>
              </Link>
            </>
          )}
        />


        {/* Stats Section - Overlapping Hero */}
        <section className="relative z-30 -mt-12 lg:-mt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group relative bg-zinc-900/80 p-8 rounded-[32px] border border-white/10 hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gold-primary/5 rounded-full blur-2xl group-hover:bg-gold-primary/10 transition-colors" />
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-800 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500 ring-4 ring-gold-primary/10">
                      {(() => {
                        const Icon = stat.icon;
                        return <Icon className="w-7 h-7 text-gold-primary" />;
                      })()}
                    </div>
                    
                    <div className="flex items-baseline justify-center mb-1">
                      <span className="text-3xl lg:text-4xl font-black text-white tracking-tight">{stat.value}</span>
                      <span className="text-lg text-gold-primary font-bold ml-0.5">{stat.suffix}</span>
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">{stat.label}</h3>
                    <p className="text-sm text-zinc-400 font-medium">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 bg-zinc-950 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-gold-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-zinc-800 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              
              {/* Image Composition (Left) */}
              <div className="relative">
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl z-10 aspect-[4/5] group bg-zinc-900">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Bureau SCIM" 
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2s] opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-10 text-white">
                    <div className="inline-block px-3 py-1 rounded-full bg-gold-primary/20 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gold-primary mb-4">
                      Depuis 2023
                    </div>
                    <h3 className="text-3xl font-bold mb-3 tracking-tight">L'excellence au quotidien</h3>
                    <p className="text-zinc-300 text-sm max-w-xs leading-relaxed">Une expertise reconnue pour chaque projet d'envergure.</p>
                  </div>
                </div>
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-10 -right-6 w-72 bg-zinc-900 p-8 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 z-20 hidden md:block">
                  <div className="flex items-center gap-5 mb-5">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-gold-primary rounded-2xl text-zinc-950 shadow-lg shadow-gold-primary/20">
                      <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Croissance</p>
                      <p className="text-xl text-white font-black">+125% <span className="text-xs font-bold text-emerald-500">↑</span></p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gold-primary to-amber-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(201,162,39,0.3)]" />
                  </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute -top-10 -left-10 opacity-10 z-0">
                  <div className="w-40 h-40 grid grid-cols-6 gap-4">
                    {[...Array(36)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content (Right) */}
              <div className="space-y-12">
                <div>
                  <div className="inline-flex items-center gap-3 mb-8">
                    <div className="h-[1px] w-12 bg-gold-primary/30" />
                    <span className="text-gold-primary font-black uppercase tracking-[0.3em] text-[10px]">Notre Histoire</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                    Une vision <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-500">
                      sans limites.
                    </span>
                  </h2>
                  
                  <blockquote className="relative p-8 rounded-[32px] bg-zinc-900 border border-white/10 italic">
                    <div className="absolute -top-4 -left-2 text-6xl text-gold-primary/20 font-serif leading-none">"</div>
                    <p className="text-lg text-zinc-300 leading-relaxed font-semibold">
                      Nous ne vendons pas seulement des biens immobiliers, nous bâtissons des futurs et concrétisons des rêves durables.
                    </p>
                  </blockquote>
                </div>

                <p className="text-lg text-zinc-400 leading-relaxed">
                  Fondée sur la conviction que l'immobilier est avant tout une aventure humaine, SCIM a su s'imposer par son <span className="text-white font-bold">intégrité</span> et sa <span className="text-gold-primary font-bold">maîtrise technique</span> unique sur le marché.
                </p>

                {/* Timeline Stylisée */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {milestones.map((item, idx) => (
                    <div key={idx} className="group relative flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex flex-col items-center justify-center group-hover:bg-gold-primary group-hover:border-gold-primary transition-all duration-300">
                        <span className="text-[10px] font-black text-zinc-400 group-hover:text-zinc-950 leading-none mb-0.5">Année</span>
                        <span className="text-xs font-black text-white leading-none">{item.year}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1 group-hover:text-gold-primary transition-colors">{item.title}</h4>
                        <p className="text-xs text-zinc-500 leading-snug">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-32 bg-zinc-900/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-primary/5 blur-[120px] -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-gold-primary/30" />
                <span className="text-gold-primary font-black uppercase tracking-[0.3em] text-[10px]">Notre ADN</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-6">
                Les Valeurs qui <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-500">Nous Guident</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Notre succès repose sur des principes fondamentaux qui définissent notre approche et notre engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="group relative bg-zinc-900/80 border border-white/10 rounded-[32px] p-10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-gold-primary/30 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-gold-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  
                  <div className="flex flex-col sm:flex-row items-start gap-8">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-2xl group-hover:scale-110 transition-transform duration-500 ring-4 ring-gold-primary/5 shadow-xl">
                        <value.icon className="w-8 h-8 text-gold-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white tracking-tight mb-4">{value.title}</h3>
                      <p className="text-zinc-400 mb-8 leading-relaxed font-medium">{value.description}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        {value.features.map((feature, idx) => (
                          <div key={idx} className="inline-flex items-center px-4 py-2 rounded-xl bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-300 group-hover:bg-gold-primary/10 group-hover:border-gold-primary/20 transition-colors">
                            <div className="w-1.5 h-1.5 bg-gold-primary rounded-full mr-2.5 shadow-[0_0_5px_rgba(201,162,39,0.5)]" />
                            {feature}
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

        {/* Team Section */}
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-gold-primary/30" />
                <span className="text-gold-primary font-black uppercase tracking-[0.3em] text-[10px]">L'ÉQUIPE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
                Rencontrez <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-500">Nos Experts</span>
              </h2>
              <p className="text-zinc-400 font-medium">Des professionnels passionnés au service de votre patrimoine.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gold-primary rounded-[32px] rotate-6 scale-95 opacity-0 group-hover:opacity-20 transition-all duration-500" />
                    <div className="relative aspect-square rounded-[32px] overflow-hidden border-4 border-zinc-800 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                      <img className="w-full h-full object-cover" src={member.image} alt={member.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-white tracking-tight leading-none mb-1">{member.name}</h3>
                    <p className="text-gold-primary font-black uppercase tracking-widest text-[10px]">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-20">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-zinc-900 text-white hover:bg-zinc-800 border border-white/10 px-10 py-7 rounded-[20px] text-base font-black uppercase tracking-widest shadow-2xl hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] group"
                >
                  Réserver une consultation
                  <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
          {/* Background visuals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-primary/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-24">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-primary/10 rounded-3xl mb-8 ring-1 ring-gold-primary/20">
                <Target className="w-10 h-10 text-gold-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-6">
                Notre Mission & <span className="text-gold-primary">Engagement</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                Transformer votre vision stratégique en une réalité immobilière concrète et valorisante.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {[
                {
                  title: "Accompagner l'Excellence",
                  content: "Nous guidons nos clients avec une précision chirurgicale, transformant chaque défi en une opportunité de croissance patrimoniale.",
                  items: ['Analyse de besoins', 'Stratégie personnalisée', 'Suivi de prestige']
                },
                {
                  title: "Conseiller la Précision",
                  content: "Nos décisions sont le fruit d'une analyse rigoureuse des données du marché et d'une intuition forgée par l'expertise.",
                  items: ['Intelligence marché', 'Analyse financière', 'Ingénierie fiscale']
                },
                {
                  title: "Garantir le Succès",
                  content: "Votre réussite est notre unique mesure de performance. Nous déployons tous nos actifs pour sécuriser vos investissements.",
                  items: ['Négociation de haut vol', 'Gestion de processus', 'Suivi long terme']
                },
              ].map((box, idx) => (
                <div key={idx} className="relative group p-10 rounded-[40px] bg-zinc-900 border border-white/5 hover:border-gold-primary/30 transition-all duration-500">
                  <div className="absolute -top-5 -left-5 w-14 h-14 bg-zinc-950 border border-gold-primary/20 rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-gold-primary font-black text-2xl">{idx + 1}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-6 mt-4 tracking-tight">{box.title}</h3>
                  <p className="text-zinc-400 mb-10 leading-relaxed font-medium">
                    {box.content}
                  </p>
                  <ul className="space-y-4">
                    {box.items.map((item, id) => (
                      <li key={id} className="flex items-center text-sm font-bold text-zinc-300">
                        <CheckCircle className="w-5 h-5 text-gold-primary mr-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A227_0%,#000000_100%)] opacity-10" />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l15 30-15 30L15 30z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-tight">
              Prêt à redéfinir votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-200">avenir immobilier ?</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
              Nos conseillers sont prêts à transformer vos ambitions en succès tangibles. L'excellence n'attend pas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact" className="group">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gold-primary text-zinc-950 hover:bg-amber-300 px-12 py-8 rounded-2xl text-lg font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(201,162,39,0.2)] transition-all group-hover:-translate-y-1"
                >
                  Démarrer maintenant
                  <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/properties">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent border-2 border-white/20 text-white hover:bg-white/5 hover:border-white px-12 py-8 rounded-2xl text-lg font-black uppercase tracking-widest transition-all"
                >
                  Nos Propriétés
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-16 text-zinc-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-primary shadow-[0_0_8px_rgba(201,162,39,0.6)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Réponse sous 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-primary shadow-[0_0_8px_rgba(201,162,39,0.6)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Expertise Garantie</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
