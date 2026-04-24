// src/pages/home/PricingSection.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PricingSection({ farm }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!farm) return null;

  const includes = [
    '🏠 Accès à la maison complète',
    '🏊 Piscine privée toute la journée',
    '🌿 Espace vert et jardins',
    '🅿️ Parking gratuit sur place',
    '🔒 Accès exclusif et privatif',
    '📞 Support disponible 7j/7',
  ];

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-4xl mx-auto text-center">

        {/* Header */}
        <div className="space-y-4 mb-14">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: 'var(--gold)' }} />
            <span className="text-xs uppercase tracking-widest font-medium"
              style={{ color: 'var(--gold)' }}>Tarification</span>
            <div className="w-12 h-px" style={{ backgroundColor: 'var(--gold)' }} />
          </div>
          <h2 className="font-display text-5xl font-light" style={{ color: 'var(--green-deep)' }}>
            Une offre simple,<br />
            <em style={{ color: 'var(--earth)' }}>tout compris</em>
          </h2>
        </div>

        {/* Carte prix */}
        <div className="relative inline-block w-full max-w-lg mx-auto">
          <div className="rounded-3xl p-10 text-white text-left relative overflow-hidden"
            style={{ backgroundColor: 'var(--green-deep)' }}>

            {/* Décor */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, var(--gold), transparent)', transform: 'translate(30%, -30%)' }} />

            <div className="relative space-y-6">
              {/* Prix */}
              <div>
                <div className="font-display text-7xl font-light">
                  {farm.price_per_day}
                  <span className="text-3xl ml-2 opacity-60">DH</span>
                </div>
                <div className="text-sm mt-1 opacity-50 tracking-widest uppercase">par jour</div>
              </div>

              <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

              {/* Ce qui est inclus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm"
                    style={{ color: 'rgba(255,255,255,0.75)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--gold)' }} />
                    {item}
                  </div>
                ))}
              </div>

              <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

              {/* CTA */}
              <button
                onClick={() => navigate(isAuthenticated() ? '/reservation' : '/login')}
                className="w-full py-4 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: 'var(--gold)', color: 'var(--green-deep)' }}>
                Réserver ce domaine
              </button>

              <p className="text-xs text-center opacity-40">
                Réservation confirmée par l'administrateur sous 24h
              </p>
            </div>
          </div>

          {/* Badge décoratif */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
            style={{ backgroundColor: 'var(--gold)', color: 'var(--green-deep)' }}>
            BEST<br />PRICE
          </div>
        </div>
      </div>
    </section>
  );
}