// src/pages/home/HeroSection.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import {
  MapPin,
  Home,
  Leaf,
  ChevronDown,
  Star,
  ArrowRight,
} from "lucide-react";
import { FaSwimmer } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Images de la ferme
const farmImages = [
  {
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Vue aérienne de la ferme",
  },
  {
    url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Piscine avec vue sur les montagnes",
  },
  {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    title: "Maison traditionnelle rénovée",
  },
  {
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Espace vert et jardin luxuriant",
  },
  {
    url: "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Intérieur moderne et chaleureux",
  },
];

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Swiper Background */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        loop={true}
        className="absolute inset-0 z-0"
      >
        {farmImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image.url})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay gradient avec green-deep */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5), var(--green-deep) 90%)",
        }}
      />

      {/* Navigation buttons personnalisées */}
      <button
        className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Contenu principal */}
      <div className="relative z-20 h-full flex items-center pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Colonne gauche - Texte */}
            <div className="text-white space-y-6 animate-fade-in-up">
              {/* Badge localisation */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 border"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                <MapPin
                  className="text-gold"
                  size={16}
                  style={{ color: "var(--gold)" }}
                />
                <span className="text-sm font-medium">
                  El Haj Kedour · Meknès, Maroc
                </span>
              </div>

              {/* Titre principal */}
              <div className="space-y-3">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  Ferme
                  <span className="block" style={{ color: "var(--gold)" }}>
                    Khadija
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-white/90 max-w-lg leading-relaxed">
                  Découvrez un havre de paix authentique au cœur de la campagne
                  marocaine. Un cadre idyllique alliant tradition et modernité.
                </p>
              </div>

              {/* Caractéristiques */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Home
                    className="text-sm"
                    size={14}
                    style={{ color: "var(--gold)" }}
                  />
                  <span className="text-xs font-medium">Maison confort</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <FaSwimmer
                    className="text-sm"
                    size={14}
                    style={{ color: "var(--gold)" }}
                  />
                  <span className="text-xs font-medium">Piscine privée</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Leaf
                    className="text-sm"
                    size={14}
                    style={{ color: "var(--gold)" }}
                  />
                  <span className="text-xs font-medium">Jardin luxuriant</span>
                </div>
              </div>

              {/* Prix et CTA */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div
                  className="rounded-2xl px-5 py-3 border"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "var(--gold)" }}
                    >
                      800
                    </span>
                    <span className="text-base">DH</span>
                    <span className="text-white/60 text-xs ml-1">/ nuit</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(isAuthenticated() ? "/reservation" : "/login")
                  }
                  className="group relative px-8 py-3.5 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: "var(--gold)",
                    color: "var(--green-deep)",
                  }}
                >
                  <span className="relative flex items-center gap-2">
                    Réserver maintenant
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition"
                    />
                  </span>
                </button>
              </div>

              {/* Avis rapide */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background:
                          "linear-gradient(to bottom right, var(--gold), #a07840)",
                      }}
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        style={{ color: "var(--gold)", fill: "var(--gold)" }}
                      />
                    ))}
                    <span className="text-sm ml-2 text-white/90">
                      5.0 · 128 avis
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Carte d'information */}
            <div className="hidden lg:block animate-fade-in-right">
              <div
                className="rounded-3xl p-6 border shadow-2xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(16px)",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">🌾</div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Pourquoi choisir Ferme Khadija ?
                  </h3>
                  <p className="text-white/60 text-xs">
                    Découvrez ce qui nous rend unique
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 p-3 rounded-xl transition hover:bg-white/10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(to right, var(--gold), #a07840)",
                      }}
                    >
                      <Home className="text-white text-lg" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        Maison Authentique
                      </h4>
                      <p className="text-white/50 text-xs">
                        3 chambres, salon marocain, cuisine équipée
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-xl transition hover:bg-white/10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(to right, var(--gold), #a07840)",
                      }}
                    >
                      <FaSwimmer className="text-white text-lg" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        Piscine à débordement
                      </h4>
                      <p className="text-white/50 text-xs">
                        Vue panoramique sur les montagnes du Moyen Atlas
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-xl transition hover:bg-white/10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(to right, var(--gold), #a07840)",
                      }}
                    >
                      <Leaf className="text-white text-lg" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        Espace vert
                      </h4>
                      <p className="text-white/50 text-xs">
                        Jardin botanique, potager bio, terrasse ombragée
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-white/70 text-xs">
                    <span>✨ Check-in: 15h</span>
                    <span>✨ Check-out: 11h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <button
          onClick={() =>
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition"
        >
          <span className="text-xs font-medium tracking-widest uppercase">
            Découvrir
          </span>
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Styles personnalisés */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out 0.2s both;
        }

        :global(.swiper-pagination) {
          bottom: 20px !important;
        }

        :global(.swiper-pagination-bullet) {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          margin: 0 6px !important;
        }

        :global(.swiper-pagination-bullet-active) {
          background: var(--gold) !important;
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
}
