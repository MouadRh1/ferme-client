// src/pages/home/CTASection.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CTASection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--green-mid)' }}>

      {/* Décor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--gold), transparent)' }} />
      </div>

      <div className="relative max-w-3xl mx-auto text-center space-y-8">
        <div className="text-6xl">🌾</div>

        <h2 className="font-display text-5xl lg:text-6xl font-light text-white leading-tight">
          Prêt à vivre une<br />
          <em style={{ color: 'var(--gold)' }}>expérience inoubliable ?</em>
        </h2>

        <p className="text-lg font-light" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Réservez la Ferme Khadija pour votre prochain séjour.
          Disponibilité en temps réel, confirmation rapide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <button
            onClick={() => navigate(isAuthenticated() ? '/reservation' : '/register')}
            className="px-10 py-4 rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: 'var(--gold)', color: 'var(--green-deep)' }}>
            {isAuthenticated() ? '📅 Faire une réservation' : '✨ Créer un compte'}
          </button>
          {!isAuthenticated() && (
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 rounded-full font-semibold text-sm border transition-all hover:bg-white hover:text-green-900 text-white"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              Se connecter
            </button>
          )}
        </div>
      </div>
    </section>
  );
}