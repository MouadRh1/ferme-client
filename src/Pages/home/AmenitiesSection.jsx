// src/pages/home/AmenitiesSection.jsx
export default function AmenitiesSection({ farm }) {
  if (!farm) return null;

  const allAmenities = [
    {
      key: 'has_house',
      icon: '🏠',
      title: 'Maison principale',
      desc: 'Spacieuse et entièrement équipée pour accueillir vos proches dans un confort optimal.',
      features: ['Cuisine équipée', 'Salons spacieux', 'Chambres confortables', 'Salle de bain moderne'],
    },
    {
      key: 'has_pool',
      icon: '🏊',
      title: 'Piscine privée',
      desc: 'Plongez dans notre piscine exclusive et profitez de longues journées de détente au soleil.',
      features: ['Accès privatif', 'Eau traitée', 'Espace bain de soleil', 'Serviettes fournies'],
    },
    {
      key: 'has_garden',
      icon: '🌿',
      title: 'Espace vert',
      desc: 'Un jardin luxuriant pour vos barbecues, jeux en plein air et moments de sérénité.',
      features: ['Gazon entretenu', 'Zone barbecue', 'Aire de jeux', 'Terrasse ombragée'],
    },
  ];

  const available = allAmenities.filter(a => farm[a.key]);

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'var(--green-deep)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: 'var(--gold)' }} />
            <span className="text-xs uppercase tracking-widest font-medium"
              style={{ color: 'var(--gold)' }}>Nos espaces</span>
            <div className="w-12 h-px" style={{ backgroundColor: 'var(--gold)' }} />
          </div>
          <h2 className="font-display text-5xl font-light text-white">
            Tout ce dont vous avez<br />
            <em style={{ color: 'var(--gold)' }}>besoin pour profiter</em>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {available.map((amenity, i) => (
            <div key={i}
              className="group relative rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201,169,110,0.1), transparent 70%)' }} />

              <div className="relative space-y-4">
                {/* Icône */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'rgba(201,169,110,0.15)' }}>
                  {amenity.icon}
                </div>

                {/* Titre */}
                <h3 className="font-display text-2xl font-light text-white">
                  {amenity.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {amenity.desc}
                </p>

                {/* Features */}
                <ul className="space-y-2 pt-2">
                  {amenity.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm"
                      style={{ color: 'rgba(255,255,255,0.65)' }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: 'var(--gold)' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}