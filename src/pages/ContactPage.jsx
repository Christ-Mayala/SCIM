import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, User, FileText, Calendar, CheckCircle, Shield, Building, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { validateEmail } from '../lib/utils';
import SEO from '../components/layout/SEO';
import { seoConfig } from '../utils/seoData';

import PageHero from '../components/layout/PageHero';
import { Sparkles } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.sujet.trim()) newErrors.sujet = 'Le sujet est requis';
    if (!formData.message.trim()) newErrors.message = 'Le message est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      details: '+242 06 123 45 67',
      subtitle: 'Du lundi au vendredi, 9h-18h',
      action: 'tel:+242061234567',
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'contact@scim.cg',
      subtitle: 'Réponse garantie sous 24h',
      action: 'mailto:contact@scim.cg',
      color: 'from-emerald-500/20 to-emerald-600/20',
      iconColor: 'text-emerald-600'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: '123 Avenue des Ball',
      subtitle: 'Bacongo, Brazzaville, Congo',
      action: '#map',
      color: 'from-amber-500/20 to-amber-600/20',
      iconColor: 'text-amber-600'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: 'Lun-Ven: 9h-18h',
      subtitle: 'Samedi: 9h-12h',
      color: 'from-purple-500/20 to-purple-600/20',
      iconColor: 'text-purple-600'
    },
  ];

  const faqs = [
    {
      question: "Comment publier une annonce sur SCIM ?",
      answer: "Créez un compte gratuit, accédez à votre tableau de bord et cliquez sur 'Publier une annonce'. Notre équipe valide chaque annonce sous 24h.",
      icon: Building
    },
    {
      question: "Quels sont les frais de service ?",
      answer: "Pour les particuliers, la publication d'annonces est gratuite. Nos frais d'agence s'appliquent uniquement aux transactions accompagnées par nos experts.",
      icon: Shield
    },
    {
      question: "Comment prendre rendez-vous pour une visite ?",
      answer: "Contactez-nous via ce formulaire ou appelez directement notre équipe. Nous organisons des visites sous 48h, selon vos disponibilités.",
      icon: Calendar
    },
    {
      question: "Proposez-vous des estimations gratuites ?",
      answer: "Oui, nos experts se déplacent gratuitement pour estimer votre bien. Prenez rendez-vous par téléphone ou via notre formulaire.",
      icon: FileText
    },
  ];

  const subjects = [
    "Demande d'information",
    "Estimation de bien",
    "Visite immobilière",
    "Support technique",
    "Partnership",
    "Autre"
  ];

  const subjectOptions = subjects.map(s => ({ value: s, label: s }));

  return (
    <>
      <SEO title={seoConfig.contact.title} description={seoConfig.contact.description} />
      <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-gold-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-gold-dark/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Section */}
        <PageHero
          badgeIcon={Sparkles}
          badgeText="Contactez-nous"
          title={
            <>
              Votre Projet Immobilier <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-200 to-gold-dark">Mérite Notre Expertise</span>
            </>
          }
          description="Notre équipe d'experts vous accompagne à chaque étape. Discutons de votre projet et trouvons ensemble la meilleure solution."
          backgroundImage="https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        />

        {/* Success Message */}
        {submitted && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
            <div className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xl tracking-tight text-white">Message envoyé avec succès !</h3>
                  <p className="font-medium opacity-80">
                    Nous avons bien reçu votre demande et notre conciergerie vous répondra sous 24h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:sticky lg:top-32">
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl">
                <div className="text-center lg:text-left mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-primary/10 border border-gold-primary/20 rounded-xl mb-4">
                    <MessageCircle className="w-6 h-6 text-gold-primary" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight mb-2">
                    Parlons de <span className="text-gold-primary text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-200">votre projet</span>
                  </h2>
                  <p className="text-zinc-400 font-medium">
                    Remplissez ce formulaire et un consultant luxury vous recontactera.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nom complet</label>
                       <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 transition-colors group-focus-within:text-gold-primary">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          placeholder="Votre nom"
                          className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-bold text-sm"
                          required
                        />
                      </div>
                      {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Email</label>
                       <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 transition-colors group-focus-within:text-gold-primary">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="votre@prestige.com"
                          className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-bold text-sm"
                          required
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Téléphone</label>
                       <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 transition-colors group-focus-within:text-gold-primary">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          placeholder="+242 06 123 45 67"
                          className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Sujet</label>
                       <Select
                         name="sujet"
                         value={formData.sujet}
                         onChange={handleChange}
                         options={subjectOptions}
                         error={errors.sujet}
                         placeholder="Sélectionnez un sujet"
                         leftIcon={<FileText className="w-4 h-4" />}
                         className="h-12 bg-white/5 border-white/10 rounded-2xl text-white"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Message</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      rows={6}
                      placeholder="Décrivez-nous votre projet en détail..."
                      className="w-full bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-gold-primary/50 focus:border-gold-primary/50 transition-all font-medium py-4 px-6"
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full h-14 bg-gold-primary hover:bg-amber-300 text-zinc-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all duration-300"
                  >
                    <span className="flex items-center justify-center">
                      <Send className="mr-3 w-5 h-5" />
                      Envoyer ma demande
                    </span>
                  </Button>

                  <p className="text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Discrétion et confidentialité garanties par SCIM
                  </p>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-12">
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="group bg-zinc-900/40 backdrop-blur-3xl rounded-[32px] border border-white/10 p-8 hover:border-gold-primary/30 transition-all duration-500 shadow-2xl"
                  >
                    <div className="flex flex-col gap-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        <info.icon className={`w-7 h-7 text-gold-primary`} />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">{info.title}</h3>
                        <p className="text-white font-black text-xl mb-2 tracking-tight">{info.details}</p>
                        <p className="text-sm text-zinc-400 font-medium mb-4">{info.subtitle}</p>
                        {info.action && (
                          <a
                            href={info.action}
                            className="inline-flex items-center text-xs font-black text-gold-primary uppercase tracking-widest hover:text-white transition-colors"
                          >
                            Nous joindre <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact CTA */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-primary to-gold-dark opacity-90 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative p-6 lg:p-8 text-zinc-950 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      Assistance Immédiate
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter leading-none">
                      Besoin d'une réponse <br /> ultra-rapide ?
                    </h3>
                    <p className="font-bold text-zinc-950/70 max-w-sm">
                      Accédez à notre ligne prioritaire pour vos demandes critiques et projets urgents.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full md:w-auto">
                    <Button
                      onClick={() => window.location.href = 'tel:+242061234567'}
                      className="bg-zinc-950 text-white hover:bg-zinc-900 h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
                    >
                      <Phone className="w-4 h-4 mr-3" />
                      Appel Prioritaire
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = 'mailto:contact@scim.cg'}
                      className="border-zinc-950/20 text-zinc-950 hover:bg-zinc-950 hover:text-white h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                      Conciergerie Mail
                    </Button>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gold-primary/10 rounded-xl flex items-center justify-center border border-gold-primary/20">
                    <MapPin className="w-5 h-5 text-gold-primary" />
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight uppercase italic">Le Siège SCIM</h3>
                </div>
                
                <div className="relative aspect-[16/9] rounded-[32px] overflow-hidden ring-1 ring-white/10 shadow-2xl group">
                  <iframe
                    title="SCIM Immobilier — Brazzaville"
                    src="https://www.google.com/maps?q=SCIM+Immobilier,+Bacongo,+Brazzaville&output=embed"
                    className="absolute inset-0 w-full h-full grayscale-[0.8] opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity"></div>
                  <a
                    href="https://maps.app.goo.gl/9LoE7pMV6gA9vee87"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 left-6 z-20 inline-flex items-center gap-2 bg-gold-primary text-zinc-950 rounded-xl px-4 py-2.5 font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-white transition-all transform hover:scale-105"
                  >
                    <MapPin className="w-4 h-4" />
                    Itinéraire Prestige
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent"></div>
            
            <div className="pt-12 text-center mb-12">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gold-primary uppercase tracking-[0.3em] mb-6">
                <Shield className="w-3 h-3" />
                Informations Clients
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4 leading-none">
                FAQ — <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-amber-200 to-gold-dark">Réponses d'Excellence</span>
              </h2>
              
              <p className="text-zinc-400 font-medium max-w-xl mx-auto">
                Tout ce que vous devez savoir pour démarrer votre aventure immobilière avec SCIM dans les meilleures conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="group bg-zinc-900/30 backdrop-blur-xl rounded-3xl p-6 border border-white/5 hover:border-gold-primary/20 transition-all duration-500 hover:bg-zinc-900/50"
                >
                  <div className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-gold-primary/10 group-hover:border-gold-primary/30 transition-all duration-500">
                        <faq.icon className="w-6 h-6 text-zinc-500 group-hover:text-gold-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-black text-white mb-3 text-base tracking-tight leading-tight">
                        {faq.question}
                      </h3>
                      <p className="text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-20">
              <div className="inline-block p-1 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-2xl">
                <div className="bg-zinc-950 px-8 py-4 rounded-xl flex items-center gap-4">
                  <p className="text-zinc-500 font-medium">Vous avez une demande spécifique ?</p>
                  <a href="#form" className="font-black text-gold-primary uppercase tracking-widest text-[10px] hover:text-white transition-colors">
                    Échanger directement <ArrowLeft className="ml-2 w-4 h-4 rotate-180 inline" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ContactPage;
