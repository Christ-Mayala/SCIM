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
    <div
      className="min-h-screen bg-zinc-50"
      style={{
        ["--scim-gold"]: "#C9A227",
        ["--scim-ink"]: "#0F172A",
      }}
    >
      <PageHero
        badgeIcon={Sparkles}
        badgeText="Offres Speciales SCIM"
        title={
          <>
            Bon plans, promotions et <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-amber-200">services SCIM</span>
          </>
        }
        description="Retrouvez nos offres speciales du moment et le parcours complet pour publier votre bien avec l'administration SCIM."
        backgroundImage="https://images.unsplash.com/photo-1560185007-5f0bb1866cabixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
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

      <section className="-mt-1 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center gap-2 text-zinc-900">
          <Gift className="h-5 w-5 text-[var(--scim-gold)]" />
          <h2 className="text-xl font-semibold">Offres speciales en cours</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                <BadgePercent className="h-3.5 w-3.5" />
                {offer.highlight}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-zinc-900">
                {offer.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {offer.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-zinc-900">
              <Star className="h-5 w-5 text-[var(--scim-gold)]" />
              <h2 className="text-lg font-semibold">
                Nos services immobiliers
              </h2>
            </div>
            <ul className="space-y-3">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-2 text-sm text-zinc-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-zinc-900">
              <UserCheck className="h-5 w-5 text-[var(--scim-gold)]" />
              <h2 className="text-lg font-semibold">
                Publication encadree par SCIM
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-zinc-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                Dossier verifie par l'administration avant mise en ligne.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                Controle qualite des visuels, prix et informations du proprietaire.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                Mise en relation client-proprietaire suivie par l'equipe SCIM.
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/soumettre-bien">
                <Button>
                  <Building2 className="mr-2 h-4 w-4" />
                  Soumettre un bien
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Contacter l'administration
                </Button>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-zinc-900">
            <HardHat className="h-5 w-5 text-[var(--scim-gold)]" />
            <h2 className="text-lg font-semibold">Pôle BTP et suivi de chantier</h2>
          </div>
          <p className="mb-5 text-sm text-zinc-600">
            SCIM n'est pas seulement une agence immobiliere. Nous accompagnons aussi les proprietaires
            sur la phase travaux pour livrer un bien pret a exploiter, vendre ou louer.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {btpServices.map((service) => (
              <div key={service.title} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <service.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">{service.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{service.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default SpecialOffersPage;
