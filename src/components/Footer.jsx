// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
//   Facebook, 
//   Instagram, 
//   WhatsApp,
  Send,
  ChevronRight,
  Heart,
  Home,
//   Swimmer,
  Leaf
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaWhatsapp , FaSwimmer } from 'react-icons/fa';
import { PiFlowerLotus } from 'react-icons/pi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Réservation', path: '/reservation' },
    { name: 'Galerie', path: '/#gallery' },
    { name: 'À propos', path: '/#about' },
  ];

  const services = [
    { icon: Home, name: 'Maison de caractère' },
    { icon: FaSwimmer, name: 'Piscine privée' },
    { icon: Leaf, name: 'Espace verdoyant' },
  ];

  const contactInfo = [
    { icon: MapPin, text: 'El Haj Kedour, Meknès, Maroc' },
    { icon: Phone, text: '+212 6 12 34 56 78' },
    { icon: Mail, text: 'contact@fermekhadija.ma' },
    { icon: Clock, text: 'Check-in: 15h | Check-out: 11h' },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: 'var(--green-deep)' }}>
      {/* Motif décoratif en arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, var(--gold) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Colonne 1 - Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--gold)' }}>
                <PiFlowerLotus className="w-6 h-6" style={{ color: 'var(--green-deep)' }} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Ferme Khadija
                </h3>
                <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(201,169,110,0.7)' }}>
                  Domaine Privé
                </p>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Un havre de paix authentique au cœur de la campagne marocaine. 
              Découvrez l'art de vivre à la ferme dans un cadre d'exception.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12"
                style={{ backgroundColor: 'rgba(201,169,110,0.15)', color: 'var(--gold)' }}
              >
                <FaFacebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12"
                style={{ backgroundColor: 'rgba(201,169,110,0.15)', color: 'var(--gold)' }}
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12"
                style={{ backgroundColor: 'rgba(201,169,110,0.15)', color: 'var(--gold)' }}
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Navigation
              <span className="absolute -bottom-2 left-0 w-full h-0.5" style={{ backgroundColor: 'var(--gold)' }} />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 text-sm transition-all duration-300 hover:translate-x-1 group"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--gold)' }} />
                    <span className="hover:text-white transition">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 - Services */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Nos Services
              <span className="absolute -bottom-2 left-0 w-full h-0.5" style={{ backgroundColor: 'var(--gold)' }} />
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <service.icon size={16} style={{ color: 'var(--gold)' }} />
                  <span>{service.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 - Contact & Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-full h-0.5" style={{ backgroundColor: 'var(--gold)' }} />
            </h4>
            <ul className="space-y-3 mb-6">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <info.icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-white text-sm font-semibold mb-3">Newsletter</h5>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Votre email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                />
                <button 
                  className="px-4 py-2 rounded-r-lg transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: 'var(--gold)' }}
                >
                  <Send size={18} style={{ color: 'var(--green-deep)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--gold), transparent)' }} />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <div>
            © {currentYear} Ferme Khadija. Tous droits réservés.
          </div>
          
          {/* <div className="flex items-center gap-2">
            <span>Fait avec</span>
            <Heart size={14} className="text-red-400 fill-red-400 animate-pulse" />
            <span>au Maroc</span>
          </div> */}

          <div className="flex gap-6">
            <Link to="/mentions-legales" className="hover:text-white transition">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-white transition">Confidentialité</Link>
            <Link to="/cgv" className="hover:text-white transition">CGV</Link>
          </div>
        </div>

        {/* Badge flottant */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: 'var(--gold)' }} />
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}