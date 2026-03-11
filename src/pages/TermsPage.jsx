import React from 'react';
import SEOHead from '../components/seo/SEOHead';
import { FileText } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead title="Conditions d'utilisation" description="Conditions d'utilisation SCIM" />

      {/* Mini Hero */}
      <div className="relative overflow-hidden bg-zinc-900/60 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary mb-4">
            <FileText className="h-3 w-3" />
            Documents légaux
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Conditions d'utilisation</h1>
          <p className="mt-2 text-sm text-zinc-400">En utilisant SCIM, vous acceptez les conditions ci-dessous.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
          <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">1. Compte</h2>
              <p>Vous êtes responsable de la confidentialité de vos identifiants et des actions effectuées depuis votre compte.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">2. Contenu &amp; annonces</h2>
              <p>Les annonces et messages doivent être exacts et respectueux. Les contenus illégaux, trompeurs ou abusifs sont interdits.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">3. Modération</h2>
              <p>L'administration peut modifier, désactiver ou supprimer des contenus et comptes en cas de non-respect des règles.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">4. Disponibilité</h2>
              <p>SCIM est fourni "en l'état". Des interruptions peuvent survenir pour maintenance ou incidents techniques.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">5. Limitation</h2>
              <p>SCIM n'est pas responsable des litiges entre utilisateurs. Les transactions restent sous la responsabilité des parties.</p>
            </section>
            <section>
              <h2 className="text-base font-black text-white uppercase italic tracking-widest mb-2">6. Contact</h2>
              <p>Support: <a className="text-gold-primary hover:text-amber-300 transition-colors" href="mailto:support@scim.app">support@scim.app</a></p>
            </section>
          </div>
          <div className="mt-10 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
