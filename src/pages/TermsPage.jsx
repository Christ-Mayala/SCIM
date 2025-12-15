import React from 'react';
import SEOHead from '../components/seo/SEOHead';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SEOHead title="Conditions d'utilisation" description="Conditions d'utilisation SCIM" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl bg-white p-8 ring-1 ring-zinc-200 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-light/30 px-3 py-1 text-xs text-zinc-800 ring-1 ring-gold-primary/25">
            Conditions
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-900">Conditions d'utilisation</h1>
          <p className="mt-2 text-sm text-zinc-600">
            En utilisant SCIM, vous acceptez les conditions ci-dessous.
          </p>

          <div className="mt-8 space-y-6 text-sm text-zinc-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">1. Compte</h2>
              <p className="mt-2">
                Vous êtes responsable de la confidentialité de vos identifiants et des actions effectuées depuis votre compte.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">2. Contenu & annonces</h2>
              <p className="mt-2">
                Les annonces et messages doivent être exacts et respectueux. Les contenus illégaux, trompeurs ou abusifs sont interdits.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">3. Modération</h2>
              <p className="mt-2">
                L'administration peut modifier, désactiver ou supprimer des contenus et comptes en cas de non-respect des règles.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">4. Disponibilité</h2>
              <p className="mt-2">
                SCIM est fourni "en l'état". Des interruptions peuvent survenir pour maintenance ou incidents techniques.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">5. Limitation</h2>
              <p className="mt-2">
                SCIM n'est pas responsable des litiges entre utilisateurs. Les transactions restent sous la responsabilité des parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">6. Contact</h2>
              <p className="mt-2">
                Support: <a className="text-gold-primary hover:underline" href="mailto:support@scim.app">support@scim.app</a>
              </p>
            </section>
          </div>

          <div className="mt-10 text-xs text-zinc-500">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
