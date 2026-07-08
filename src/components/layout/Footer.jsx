import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-dark/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-2xl">
                <img src="/images/scim-logo.jpg" alt="SCIM" className="h-10 w-10 rounded-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-widest text-white leading-none">SCIM</span>
                <span className="text-[10px] font-black text-gold-primary uppercase tracking-[0.2em]">Excellence Immobilière</span>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium max-w-sm">
              Votre partenaire de confiance pour l'achat, la vente et la location de propriétés d'exception au Congo-Brazzaville. Une expérience immobilière redéfinie par le prestige.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold-primary hover:border-gold-primary transition-all duration-300 hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Navigation</h3>
            <ul className="space-y-4">
              {[
                { label: 'Accueil', path: '/home' },
                { label: 'Propriétés', path: '/properties' },
                { label: 'Offres spéciales', path: '/offres-speciales' },
                { label: 'À propos', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Connexion', path: '/login' }
              ].map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="text-zinc-500 hover:text-gold-primary transition-all duration-300 text-sm font-bold flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-[1px] bg-gold-primary transition-all duration-300 mr-0 group-hover:mr-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Expertises</h3>
            <ul className="space-y-4">
              {['Achat de propriétés', 'Vente immobilière', 'Location de prestige', 'Estimation experte', 'Conseil patrimonial', 'Gestion locative'].map((service) => (
                <li key={service} className="text-zinc-500 text-sm font-bold flex items-center cursor-default hover:text-zinc-300 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-primary/30 mr-3" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Contact Direct</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary group-hover:bg-gold-primary group-hover:text-zinc-950 transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Siège Social</span>
                  <span className="text-zinc-400 text-sm font-bold">123 Avenue des Ball, Bacongo, Brazzaville</span>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary group-hover:bg-gold-primary group-hover:text-zinc-950 transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Assistance</span>
                  <span className="text-zinc-400 text-sm font-bold">+242 06 123 45 67</span>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary group-hover:bg-gold-primary group-hover:text-zinc-950 transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Email</span>
                  <span className="text-zinc-400 text-sm font-bold">contact@scim.app</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/5 mt-24 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
                © {currentYear} SCIM Signature. Tous droits réservés.
              </div>
              <div className="text-zinc-700 text-[8px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                Conçu avec <span className="text-gold-primary"> Excellence </span> au Congo
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {['Privacy', 'Terms', 'Cookies'].map((link) => (
                <Link key={link} to={`/${link.toLowerCase()}`} className="text-zinc-600 hover:text-gold-primary transition-colors text-[10px] font-black uppercase tracking-widest underline underline-offset-8 decoration-white/5 hover:decoration-gold-primary/30">
                  {link === 'Privacy' ? 'Politique' : link === 'Terms' ? 'Conditions' : 'Cookies'}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

