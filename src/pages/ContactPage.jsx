import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, User, FileText, Calendar, CheckCircle, Shield, Building } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { validateEmail } from '../lib/utils';
import SEO from '../components/layout/SEO';
import { seoConfig } from '../utils/seoData';

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                filter: 'brightness(0.7)'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/95"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Contactez-nous</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Votre Projet Immobilier <br />
                <span className="text-gold-primary">Mérite Notre Expertise</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Notre équipe d'experts vous accompagne à chaque étape. 
                Discutons de votre projet et trouvons ensemble la meilleure solution.
              </p>
            </div>
          </div>
          
          {/* Shape divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-12 text-white" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,0 L0,100 L1000,100 L1000,0 Q500,80 0,0 Z" fill="currentColor"/>
            </svg>
          </div>
        </section>

        {/* Success Message */}
        {submitted && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-8 h-8" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Message envoyé avec succès !</h3>
                  <p className="text-emerald-100">
                    Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gold-primary to-gold-dark rounded-2xl mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Parlons de votre projet
                  </h2>
                  <p className="text-gray-600">
                    Remplissez ce formulaire et nous vous recontacterons sous 24h
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        label="Nom complet *"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        error={errors.nom}
                        placeholder="Votre nom et prénom"
                        className="w-full"
                        leftIcon={<User className="w-5 h-5" />}
                      />
                    </div>

                    <div>
                      <Input
                        label="Email *"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="votre@email.com"
                        className="w-full"
                        leftIcon={<Mail className="w-5 h-5" />}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        label="Téléphone"
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="+242 06 123 45 67"
                        className="w-full"
                        leftIcon={<Phone className="w-5 h-5" />}
                      />
                    </div>

                    <div>
                      <Select
                        label="Sujet *"
                        name="sujet"
                        value={formData.sujet}
                        onChange={handleChange}
                        options={subjectOptions}
                        error={errors.sujet}
                        placeholder="Sélectionnez un sujet"
                        leftIcon={<FileText className="w-5 h-5" />}
                      />
                    </div>
                  </div>

                  <div>
                    <Textarea
                      label={
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message *
                        </span>
                      }
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      rows={6}
                      placeholder="Décrivez-nous votre projet en détail..."
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full group py-4 bg-gradient-to-r from-gold-primary to-gold-dark hover:from-gold-dark hover:to-gold-primary text-lg font-semibold shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center">
                      <Send className="mr-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      {loading ? 'Envoi en cours...' : 'Envoyer mon message'}
                    </span>
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                  </p>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-gold-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <info.icon className={`w-6 h-6 ${info.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-800 font-semibold text-lg mb-1">
                          {info.details}
                        </p>
                        <p className="text-sm text-gray-600">
                          {info.subtitle}
                        </p>
                        {info.action && (
                          <a
                            href={info.action}
                            className="inline-flex items-center mt-2 text-sm font-medium text-gold-primary hover:text-gold-dark"
                          >
                            Contactez-nous →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact CTA */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-primary to-gold-dark"></div>
                <div className="relative p-8 text-white">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Besoin d'une réponse immédiate ?</h3>
                      <p className="mb-6 opacity-90">
                        Notre équipe est disponible dès maintenant pour répondre à vos questions les plus urgentes.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={() => window.location.href = 'tel:+242061234567'}
                          className="bg-white text-gold-primary hover:bg-gray-100 px-6"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Appeler maintenant
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.location.href = 'mailto:contact@scim.cg'}
                          className="border-white text-white hover:bg-white/10"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Envoyer un email
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-6 h-6 text-gold-primary" />
                  <h3 className="text-xl font-bold text-gray-900">Notre agence à Brazzaville</h3>
                </div>
                
                <div className="relative aspect-video rounded-xl overflow-hidden ring-1 ring-gray-200">
                  <iframe
                    title="SCIM Immobilier — Brazzaville"
                    src="https://www.google.com/maps?q=SCIM+Immobilier,+Bacongo,+Brazzaville&output=embed"
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <a
                    href="https://maps.app.goo.gl/9LoE7pMV6gA9vee87"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 bg-black/50 text-white rounded-xl px-3 py-2 backdrop-blur-sm hover:bg-black/60"
                    aria-label="Voir l’emplacement sur Google Maps"
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Voir sur Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="w-12 h-px bg-gold-primary"></div>
                <span className="text-gold-primary font-semibold uppercase tracking-wider text-sm">Questions courantes</span>
                <div className="w-12 h-px bg-gold-primary"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                FAQ - <span className="text-gold-primary">Réponses rapides</span>
              </h2>
              
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Retrouvez les réponses aux questions les plus fréquentes concernant nos services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-gold-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <faq.icon className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600">
                Vous ne trouvez pas la réponse à votre question ? 
                <a href="#form" className="ml-2 font-semibold text-gold-primary hover:text-gold-dark">
                  Contactez-nous directement →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
