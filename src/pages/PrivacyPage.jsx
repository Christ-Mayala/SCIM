import React from 'react';
import SEOHead from '../components/seo/SEOHead';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SEOHead title="Politique de confidentialité" description="Politique de confidentialité SCIM" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl bg-white p-8 ring-1 ring-zinc-200 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-light/30 px-3 py-1 text-xs text-zinc-800 ring-1 ring-gold-primary/25">
            Confidentialité
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-900">Politique de confidentialité</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Cette page décrit comment SCIM collecte, utilise et protège vos données.
          </p>

          <div className="mt-8 space-y-6 text-sm text-zinc-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">1. Données collectées</h2>
              <p className="mt-2">
                Lors de l'utilisation de SCIM, nous pouvons collecter des informations de compte (nom, email, téléphone),
                des données d'usage (pages visitées, recherches) et des contenus que vous envoyez via la messagerie.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">2. Utilisation</h2>
              <p className="mt-2">
                Les données sont utilisées pour fournir le service, sécuriser l'accès, améliorer l'expérience,
                et permettre la communication entre utilisateurs et administration.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">3. Conservation</h2>
              <p className="mt-2">
                Nous conservons les données pendant la durée nécessaire au fonctionnement du service et au respect des obligations légales.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">4. Partage</h2>
              <p className="mt-2">
                Nous ne vendons pas vos données. Certaines données peuvent être traitées par des prestataires techniques (hébergement,
                envoi d'emails, stockage) uniquement pour fournir le service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">5. Sécurité</h2>
              <p className="mt-2">
                Nous mettons en œuvre des mesures de sécurité (authentification, contrôle d'accès) pour protéger vos données.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">6. Vos droits</h2>
              <p className="mt-2">
                Vous pouvez demander l'accès, la rectification ou la suppression de vos données, selon les règles applicables.
                Contact: <a className="text-gold-primary hover:underline" href="mailto:support@scim.app">support@scim.app</a>
              </p>
            </section>
          </div>

          <div className="mt-10 text-xs text-zinc-500">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
