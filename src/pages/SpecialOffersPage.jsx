import React from "react";
import { Link } from "react-router-dom";
import {
  BadgePercent,
  Building2,
  ClipboardCheck,
  CheckCircle2,
  HardHat,
  Gift,
  Hammer,
  Megaphone,
  Phone,
  Sparkles,
  Star,
  UserCheck,
  Wrench,
  ArrowRight,
  Zap,
  Shield,
  Clock
} from "lucide-react";
import { Button } from "../components/ui/Button";
import PageHero from "../components/layout/PageHero";

const offers = [
  {
    title: "Pack Visite Prioritaire",
    description:
      "Visites planifiées sous 24h avec accompagnement SCIM sur place pour une expérience personnalisée.",
    highlight: "Délai express",
    icon: Clock,
    color: "text-amber-400"
  },
  {
    title: "Bon Plan Location",
    description:
      "Sélection de biens avec conditions préférentielles et dossiers simplifiés pour un accès rapide.",
    highlight: "Frais réduits",
    icon: BadgePercent,
    color: "text-emerald-400"
  },
  {
    title: "Offre Investisseur",
    description:
      "Accompagnement rentabilité, stratégie et projection de revenus locatifs pour maximiser votre ROI.",
    highlight: "Conseil premium",
    icon: Zap,
    color: "text-purple-400"
  },
];

const services = [
  "Achat, vente et location de biens résidentiels et commerciaux",
  "Étude de marché, estimation et audit de rentabilité",
  "Constitution de dossier locatif et accompagnement juridique",
  "Gestion locative complète: quittances, relances, suivi administratif",
  "Conseil investissement et arbitrage patrimonial",
  "Mise en relation notaire, banque, assurance et partenaires terrain",
];

const btpServices = [
  {
    icon: HardHat,
    title: "Pilotage BTP",
    description:
      "Coordination des intervenants (architecte, ingénieur, entreprises) et planning chantier optimisé.",
  },
  {
    icon: ClipboardCheck,
    title: "Suivi de chantier",
    description:
      "Contrôle des étapes, qualité d'exécution, points de blocage et reporting hebdomadaire détaillé.",
  },
  {
    icon: Hammer,
    title: "Travaux et rénovation",
    description:
      "Accompagnement rénovation, extension, remise à niveau avant mise en vente ou location.",
  },
  {
    icon: Wrench,
    title: "Maintenance préventive",
    description:
      "Plan de maintenance pour protéger la valeur du bien et éviter les urgences coûteuses.",
  },
];

const SpecialOffersPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <PageHero
        badgeIcon={Sparkles}
        badgeText="Offres Spéciales SCIM"
        title={
          <>
            Bon plans, promotions et <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-200">services SCIM</span>
          </>
        }
        description="Retrouvez nos offres spéciales du moment et le parcours complet pour publier votre bien avec l'administration SCIM."
        backgroundImage="https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        className="pb-10"
        actions={(
          <>
            <Link to="/contact">
              <Button className="bg-gold-primary text-zinc-950 hover:bg-amber-300 font-black">
                <Megaphone className="mr-2 h-4 w-4" />
                Contacter SCIM
              </Button>
            </Link>
            <Link to="/properties">
              <Button
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/10"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Voir les biens
              </Button>
            </Link>
          </>
        )}
      />

      {/* Offres Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-[2px] w-12 bg-gold-primary/30" />
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gold-primary/10 rounded-2xl border border-gold-primary/20">
              <Gift className="h-6 w-6 text-gold-primary" />
            </div>
            <div>
              <p className="text-xs font-black text-gold-primary uppercase tracking-[0.3em] mb-1">NOS BONS PLANS</p>
              <h2 className="text-2xl font-black text-white tracking-tight italic uppercase">Offres Spéciales en cours</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {offers.map((offer, idx) => (
            <article
              key={offer.title}
              className="group relative rounded-[32px] border border-white/10 bg-zinc-900/80 p-8 shadow-2xl hover:border-gold-primary/30 hover:shadow-[0_20px_60px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-primary/5 rounded-full blur-2xl group-hover:bg-gold-primary/10 transition-colors" />
              
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl bg-zinc-800 ${offer.color}`}>
                  <offer.icon className="h-6 w-6" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 px-4 py-1.5">
                  <BadgePercent className="h-4 w-4 text-gold-primary" />
                  <span className="text-[10px] font-black text-gold-primary uppercase tracking-widest">{offer.highlight}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-4">
                {offer.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {offer.description}
              </p>
              
              <div className="mt-8 pt-6 border-t border-white/5">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-gold-primary hover:text-white hover:bg-gold-primary/10 font-black uppercase text-xs tracking-widest"
                >
                  En savoir plus
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Services & Publication Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Nos Services */}
          <article className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gold-primary/10 rounded-2xl border border-gold-primary/20">
                <Star className="h-6 w-6 text-gold-primary" />
              </div>
              <div>
                <p className="text-xs font-black text-gold-primary uppercase tracking-[0.3em] mb-1">EXPERTISE</p>
                <h2 className="text-xl font-black text-white tracking-tight italic uppercase">Nos services immobiliers</h2>
              </div>
            </div>
            <ul className="space-y-4">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-4 group"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-zinc-400 font-medium leading-relaxed">{service}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Publication Encadrée */}
          <article className="rounded-[32px] border border-gold-primary/20 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-primary/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gold-primary/10 rounded-2xl border border-gold-primary/20">
                  <Shield className="h-6 w-6 text-gold-primary" />
                </div>
                <div>
                  <p className="text-xs font-black text-gold-primary uppercase tracking-[0.3em] mb-1">SÉCURITÉ</p>
                  <h2 className="text-xl font-black text-white tracking-tight italic uppercase">Publication encadrée</h2>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 group">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-gold-primary flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-zinc-400 font-medium">Dossier vérifié par l'administration avant mise en ligne.</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-gold-primary flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-zinc-400 font-medium">Contrôle qualité des visuels, prix et informations du propriétaire.</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-gold-primary flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-zinc-400 font-medium">Mise en relation client-propriétaire suivie par l'équipe SCIM.</span>
                </li>
              </ul>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/soumettre-bien">
                  <Button className="bg-gold-primary text-zinc-950 hover:bg-amber-300 font-black text-xs uppercase tracking-widest rounded-2xl px-8 py-6">
                    <Building2 className="mr-2 h-4 w-4" />
                    Soumettre un bien
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-widest rounded-2xl px-8 py-6">
                    <Megaphone className="mr-2 h-4 w-4" />
                    Contacter SCIM
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Pôle BTP Section */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <article className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gold-primary/10 rounded-2xl border border-gold-primary/20">
                <HardHat className="h-6 w-6 text-gold-primary" />
              </div>
              <div>
                <p className="text-xs font-black text-gold-primary uppercase tracking-[0.3em] mb-1">POLE EXPERTISE</p>
                <h2 className="text-2xl font-black text-white tracking-tight italic uppercase">Pôle BTP & Suivi de Chantier</h2>
              </div>
            </div>
            <p className="text-zinc-400 max-w-xl">
              SCIM n'est pas seulement une agence immobilière. Nous accompagnons aussi les propriétaires
              sur la phase travaux pour livrer un bien prêt à exploiter, vendre ou louer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {btpServices.map((service) => (
              <div key={service.title} className="group rounded-2xl border border-white/5 bg-zinc-950/60 p-6 hover:border-gold-primary/20 hover:bg-zinc-900 transition-all duration-300">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-primary/10 border border-gold-primary/20 text-gold-primary group-hover:bg-gold-primary group-hover:text-zinc-950 transition-all duration-300">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">{service.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default SpecialOffersPage;
