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
} from "lucide-react";
import { Button } from "../components/ui/Button";
import PageHero from "../components/layout/PageHero";

const offers = [
  {
    title: "Pack Visite Prioritaire",
    description:
      "Visites planifiees sous 24h avec accompagnement SCIM sur place.",
    highlight: "Delai express",
  },
  {
    title: "Bon Plan Location",
    description:
      "Selection de biens avec conditions preferentielles et dossiers simplifies.",
    highlight: "Frais reduits",
  },
  {
    title: "Offre Investisseur",
    description:
      "Accompagnement rentabilite, strategie et projection de revenus locatifs.",
    highlight: "Conseil premium",
  },
];

const services = [
  "Achat, vente et location de biens residentiels et commerciaux",
  "Etude de marche, estimation et audit de rentabilite",
  "Constitution de dossier locatif et accompagnement juridique",
  "Gestion locative complete: quittances, relances, suivi administratif",
  "Conseil investissement et arbitrage patrimonial",
  "Mise en relation notaire, banque, assurance et partenaires terrain",
];

const btpServices = [
  {
    icon: HardHat,
    title: "Pilotage BTP",
    description:
      "Coordination des intervenants (architecte, ingenieur, entreprises) et planning chantier.",
  },
  {
    icon: ClipboardCheck,
    title: "Suivi de chantier",
    description:
      "Controle des etapes, qualite d'execution, points de blocage et reporting hebdomadaire.",
  },
  {
    icon: Hammer,
    title: "Travaux et renovation",
    description:
      "Accompagnement renovation, extension, remise a niveau avant mise en vente ou location.",
  },
  {
    icon: Wrench,
    title: "Maintenance preventive",
    description:
      "Plan de maintenance pour proteger la valeur du bien et eviter les urgences couteuses.",
  },
];

const SpecialOffersPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <PageHero
        badgeIcon={Sparkles}
        badgeText="Offres Speciales SCIM"
        title={
          <>
            Bon plans, promotions et <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-200">services SCIM</span>
          </>
        }
        description="Retrouvez nos offres speciales du moment et le parcours complet pour publier votre bien avec l'administration SCIM."
        backgroundImage="https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        className="pb-10"
        actions={(
          <>
            <Link to="/contact">
              <Button className="bg-[var(--scim-gold)] text-zinc-950 hover:bg-amber-300">
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

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3 text-white">
          <div className="p-2 bg-gold-primary/10 rounded-xl border border-gold-primary/20">
            <Gift className="h-5 w-5 text-gold-primary" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-widest italic">Offres Spéciales en cours</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.title}
              className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl hover:border-gold-primary/30 transition-all duration-300"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 px-3 py-1 text-[10px] font-black text-gold-primary uppercase tracking-widest">
                <BadgePercent className="h-3.5 w-3.5" />
                {offer.highlight}
              </div>
              <h3 className="mt-4 text-base font-black text-white italic uppercase tracking-tight">
                {offer.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {offer.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3 text-white">
              <div className="p-2 bg-gold-primary/10 rounded-xl border border-gold-primary/20">
                <Star className="h-5 w-5 text-gold-primary" />
              </div>
              <h2 className="text-base font-black uppercase tracking-widest italic">
                Nos services immobiliers
              </h2>
            </div>
            <ul className="space-y-3">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-3 text-sm text-zinc-400"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-primary" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-gold-primary/20 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3 text-white">
              <div className="p-2 bg-gold-primary/10 rounded-xl border border-gold-primary/20">
                <UserCheck className="h-5 w-5 text-gold-primary" />
              </div>
              <h2 className="text-base font-black uppercase tracking-widest italic">
                Publication encadrée par SCIM
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-gold-primary flex-shrink-0" />
                Dossier vérifié par l'administration avant mise en ligne.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-gold-primary flex-shrink-0" />
                Contrôle qualité des visuels, prix et informations du propriétaire.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-gold-primary flex-shrink-0" />
                Mise en relation client-propriétaire suivie par l'équipe SCIM.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/soumettre-bien">
                <Button className="bg-gold-primary text-zinc-950 hover:bg-amber-300 font-black text-xs uppercase tracking-widest rounded-2xl px-6 py-4">
                  <Building2 className="mr-2 h-4 w-4" />
                  Soumettre un bien
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-widest rounded-2xl px-6 py-4">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Contacter SCIM
                </Button>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <article className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3 text-white">
            <div className="p-2 bg-gold-primary/10 rounded-xl border border-gold-primary/20">
              <HardHat className="h-5 w-5 text-gold-primary" />
            </div>
            <h2 className="text-base font-black uppercase tracking-widest italic">Pôle BTP &amp; Suivi de Chantier</h2>
          </div>
          <p className="mb-6 text-sm text-zinc-400 max-w-2xl">
            SCIM n'est pas seulement une agence immobilière. Nous accompagnons aussi les propriétaires
            sur la phase travaux pour livrer un bien prêt à exploiter, vendre ou louer.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {btpServices.map((service) => (
              <div key={service.title} className="rounded-2xl border border-white/5 bg-zinc-950/60 p-5">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-primary">
                  <service.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wide">{service.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{service.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default SpecialOffersPage;
