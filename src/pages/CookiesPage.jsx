import React from 'react';
import SEOHead from '../components/seo/SEOHead';

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SEOHead title="Cookies" description="Information cookies SCIM" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl bg-white p-8 ring-1 ring-zinc-200 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-light/30 px-3 py-1 text-xs text-zinc-800 ring-1 ring-gold-primary/25">
            Cookies
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-900">Cookies</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Cette page explique l'utilisation des cookies et technologies similaires sur SCIM.
          </p>

          <div className="mt-8 space-y-6 text-sm text-zinc-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">1. Cookies essentiels</h2>
              <p className="mt-2">
                SCIM peut utiliser des cookies essentiels au fonctionnement (ex: cookie de session/refresh token côté API si activé).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">2. Préférences</h2>
              <p className="mt-2">
                Certaines préférences peuvent être stockées localement (ex: mode d'affichage) pour améliorer l'expérience.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">3. Mesure d'audience</h2>
              <p className="mt-2">
                Si des outils de mesure d'audience sont ajoutés, ils seront utilisés de manière transparente et configurable.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">4. Contact</h2>
              <p className="mt-2">
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

export default CookiesPage;
