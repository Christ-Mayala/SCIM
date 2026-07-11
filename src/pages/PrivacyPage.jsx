import React from 'react';
import SEOHead from '../components/seo/SEOHead';
import { Shield } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead title="Politique de confidentialité" description="Politique de confidentialité SCIM" />

      {/* Mini Hero */}
      <div className="relative overflow-hidden bg-zinc-900/60 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary mb-4">
            <Shield className="h-3 w-3" />
            Vie privée
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Politique de confidentialité</h1>
          <p className="mt-2 text-sm text-zinc-400">Cette page décrit comment SCIM collecte, utilise et protège vos données.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
          <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">1. Données collectées</h2>
              <p>Lors de l'utilisation de SCIM, nous pouvons collecter des informations de compte (nom, email, téléphone), des données d'usage (pages visitées, recherches) et des contenus que vous envoyez via la messagerie.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">2. Utilisation</h2>
              <p>Les données sont utilisées pour fournir le service, sécuriser l'accès, améliorer l'expérience, et permettre la communication entre utilisateurs et administration.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">3. Conservation</h2>
              <p>Nous conservons les données pendant la durée nécessaire au fonctionnement du service et au respect des obligations légales.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">4. Partage</h2>
              <p>Nous ne vendons pas vos données. Certaines données peuvent être traitées par des prestataires techniques (hébergement, envoi d'emails, stockage) uniquement pour fournir le service.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">5. Sécurité</h2>
              <p>Nous mettons en œuvre des mesures de sécurité (authentification, contrôle d'accès) pour protéger vos données.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">6. Vos droits</h2>
              <p>Vous pouvez demander l'accès, la rectification ou la suppression de vos données. Contact: <a className="text-gold-primary hover:text-amber-300 transition-colors" href="mailto:contact@scim.com">contact@scim.com</a></p>
            </section>
          </div>
          <div className="mt-10 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
