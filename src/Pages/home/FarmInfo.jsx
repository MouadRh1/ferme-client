// src/pages/home/FarmInfo.jsx
export default function FarmInfo({ farm }) {
  if (!farm) return null;

  return (
    <section id="about" className="py-24 px-6" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Texte */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-px" style={{ backgroundColor: 'var(--gold)' }} />
              <span className="text-xs uppercase tracking-widest font-medium"
                style={{ color: 'var(--gold)' }}>À propos</span>
            </div>

            <h2 className="font-display text-5xl font-light leading-tight"
              style={{ color: 'var(--green-deep)' }}>
              Un domaine d'exception<br />
              <em style={{ color: 'var(--earth)' }}>au cœur du Maroc</em>
            </h2>

            <p className="text-base leading-relaxed" style={{ color: 'rgba(26,58,42,0.7)' }}>
              {farm.description}
            </p>

            {/* Localisation */}
            {farm.location && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--earth)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{farm.location}</span>
              </div>
            )}

            {/* Infos clés */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: '🌅', label: 'Location journalière', value: 'Disponible' },
                { icon: '👨‍👩‍👧‍👦', label: 'Idéal pour', value: 'Familles & Groupes' },
                { icon: '🎉', label: 'Événements', value: 'Acceptés' },
                { icon: '📞', label: 'Réservation', value: 'En ligne' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{ backgroundColor: 'rgba(26,58,42,0.04)', border: '1px solid rgba(26,58,42,0.06)' }}>
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">{item.label}</div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--green-deep)' }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visuel décoratif */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl"
              style={{ backgroundColor: 'var(--green-mid)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-8">
                  <div className="text-7xl">🏡</div>
                  <p className="font-display text-3xl font-light italic">
                    {farm.name}
                  </p>
                  <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--gold)' }} />
                  <p className="text-sm opacity-60">{farm.location}</p>
                </div>
              </div>
              {/* Overlay décoratif */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 70% 30%, var(--gold), transparent 60%)'
                }} />
            </div>
            {/* Carte flottante */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl max-w-[180px]">
              <div className="font-display text-3xl font-semibold" style={{ color: 'var(--green-deep)' }}>
                {farm.price_per_day}
                <span className="text-lg ml-1 font-normal text-gray-400">DH</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">par jour · tout inclus</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}