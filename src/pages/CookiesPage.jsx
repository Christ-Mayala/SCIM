import React from 'react';
import SEOHead from '../components/seo/SEOHead';
import { Cookie } from 'lucide-react';

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead title="Cookies" description="Information cookies SCIM" />

      {/* Mini Hero */}
      <div className="relative overflow-hidden bg-zinc-900/60 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary mb-4">
            <Cookie className="h-3 w-3" />
            Cookies
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Gestion des Cookies</h1>
          <p className="mt-2 text-sm text-zinc-400">Cette page explique l'utilisation des cookies et technologies similaires sur SCIM.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
          <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">1. Cookies essentiels</h2>
              <p>SCIM peut utiliser des cookies essentiels au fonctionnement (ex: cookie de session/refresh token côté API si activé).</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">2. Préférences</h2>
              <p>Certaines préférences peuvent être stockées localement (ex: mode d'affichage) pour améliorer l'expérience.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">3. Mesure d'audience</h2>
              <p>Si des outils de mesure d'audience sont ajoutés, ils seront utilisés de manière transparente et configurable.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">4. Contact</h2>
              <p>Contact: <a className="text-gold-primary hover:text-amber-300 transition-colors" href="mailto:contact@scim.com">contact@scim.com</a></p>
            </section>
          </div>
          <div className="mt-10 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
