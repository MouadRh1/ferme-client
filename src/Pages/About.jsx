// src/pages/About.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  //   Kitchen,
  Wind,
  Tv,
  Facebook,
  Instagram,
  Youtube,
  Home,
  //   Swimmer,
  Leaf,
  Calendar,
  CheckCircle,
  Star,
  Award,
  Heart,
  ArrowRight,
} from "lucide-react";
import { FaWhatsapp, FaUtensils, FaSwimmer } from "react-icons/fa";
import api from "../api/axios";

export default function About() {
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("presentation");

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const response = await api.get("/farm");
        setFarm(response.data.farm);
      } catch (error) {
        console.error("Erreur chargement ferme:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarm();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p
            className="mt-4 text-gray-500"
            style={{ color: "rgba(26,58,42,0.6)" }}
          >
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🏡</div>
          <p className="text-gray-500">
            Informations de la ferme non disponibles
          </p>
        </div>
      </div>
    );
  }

  const amenitiesList = [
    { icon: Home, label: "Maison", has: farm.has_house },
    { icon: FaSwimmer, label: "Piscine", has: farm.has_pool },
    { icon: Leaf, label: "Espace vert", has: farm.has_garden },
    { icon: Wifi, label: "Wi-Fi", has: farm.has_wifi },
    { icon: Car, label: "Parking", has: farm.has_parking },
    { icon: FaUtensils, label: "Cuisine équipée", has: farm.has_kitchen },
    { icon: Wind, label: "Climatisation", has: farm.has_air_conditioning },
    { icon: Tv, label: "Smart TV", has: farm.has_tv },
  ];

  const stats = [
    { icon: Users, value: farm.max_persons || 8, label: "Personnes max" },
    { icon: Bed, value: farm.bedrooms || 3, label: "Chambres" },
    { icon: Bath, value: farm.bathrooms || 2, label: "Salles de bain" },
    {
      icon: Calendar,
      value: `${farm.min_nights || 2} nuits`,
      label: "Minimum",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      url: farm.facebook_url,
      label: "Facebook",
      color: "#1877f2",
    },
    {
      icon: Instagram,
      url: farm.instagram_url,
      label: "Instagram",
      color: "#e4405f",
    },
    {
      icon: Youtube,
      url: farm.youtube_url,
      label: "YouTube",
      color: "#ff0000",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: farm.image
                ? `url(${farm.image})`
                : 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
              backgroundPosition: "center 30%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4), var(--green-deep) 90%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full text-center text-white px-6">
          <h1 className="font-display text-5xl md:text-6xl font-light mb-4">
            À propos de{" "}
            <span className="font-semibold" style={{ color: "var(--gold)" }}>
              nous
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Découvrez l'histoire et l'authenticité de notre ferme
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Navigation rapide */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 pb-4 border-b border-gray-200">
          {[
            { id: "presentation", label: "Présentation" },
            { id: "equipements", label: "Équipements" },
            { id: "regles", label: "Règles" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === item.id
                  ? "bg-gold text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              style={
                activeSection === item.id
                  ? { backgroundColor: "var(--gold)" }
                  : {}
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Section Présentation */}
        <section id="presentation" className="scroll-mt-20 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Texte */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: "var(--gold)" }}
                />
                <span
                  className="text-xs uppercase tracking-widest font-medium"
                  style={{ color: "var(--gold)" }}
                >
                  Bienvenue
                </span>
              </div>
              <h2
                className="font-display text-4xl md:text-5xl font-light mb-6"
                style={{ color: "var(--green-deep)" }}
              >
                {farm.name}
              </h2>
              {farm.short_description && (
                <p
                  className="text-lg font-medium mb-4"
                  style={{ color: "var(--earth)" }}
                >
                  {farm.short_description}
                </p>
              )}
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-4">
                {farm.description?.split("\n").map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-base leading-relaxed"
                    style={{ color: "rgba(26,58,42,0.75)" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3
                className="text-xl font-bold mb-6 text-center"
                style={{ color: "var(--green-deep)" }}
              >
                En quelques chiffres
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="text-center p-4 rounded-2xl"
                    style={{ backgroundColor: "rgba(201,169,110,0.08)" }}
                  >
                    <stat.icon
                      className="w-8 h-8 mx-auto mb-2"
                      style={{ color: "var(--gold)" }}
                    />
                    <div
                      className="text-3xl font-bold"
                      style={{ color: "var(--green-deep)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {farm.total_reviews > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current"
                        style={{ color: "var(--gold)" }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {farm.total_reviews} avis • Note {farm.average_rating}/5
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section Localisation */}
        {farm.location && (
          <section className="mb-20">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: "var(--gold)" }}
                />
                <span
                  className="text-xs uppercase tracking-widest font-medium"
                  style={{ color: "var(--gold)" }}
                >
                  Où nous trouver
                </span>
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: "var(--gold)" }}
                />
              </div>
              <h2
                className="font-display text-3xl md:text-4xl font-light"
                style={{ color: "var(--green-deep)" }}
              >
                Notre{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--earth)" }}
                >
                  localisation
                </span>
              </h2>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <div className="h-80 bg-gray-200 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13257.68108151439!2d-5.435700461692841!3d33.82727079732081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda0485b4d36b5ab%3A0xbfc8c0350e3f5fda!2sEl%20Haj%20Kaddour!5e0!3m2!1sfr!2sma!4v1777411461114!5m2!1sfr!2sma"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Ferme Khadija Location"
                ></iframe>
              </div>
              <div className="p-6 flex items-center gap-3">
                <MapPin
                  className="flex-shrink-0"
                  size={20}
                  style={{ color: "var(--gold)" }}
                />
                <span className="text-gray-700">{farm.location}</span>
              </div>
            </div>
          </section>
        )}

        {/* Section Équipements */}
        <section id="equipements" className="scroll-mt-20 mb-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="w-12 h-px"
                style={{ backgroundColor: "var(--gold)" }}
              />
              <span
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: "var(--gold)" }}
              >
                Confort
              </span>
              <div
                className="w-12 h-px"
                style={{ backgroundColor: "var(--gold)" }}
              />
            </div>
            <h2
              className="font-display text-3xl md:text-4xl font-light"
              style={{ color: "var(--green-deep)" }}
            >
              Nos{" "}
              <span className="font-semibold" style={{ color: "var(--earth)" }}>
                équipements
              </span>
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-600">
              Tout le confort moderne dans un cadre authentique
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenitiesList.map(
              (item, idx) =>
                item.has && (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                  >
                    <item.icon
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--gold)" }}
                    />
                    <span className="text-gray-700 text-sm">{item.label}</span>
                  </div>
                ),
            )}
          </div>

          {farm.amenities &&
            typeof farm.amenities === "object" &&
            Object.values(farm.amenities).length > 0 && (
              <div className="mt-6 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <h3
                  className="font-semibold mb-4"
                  style={{ color: "var(--green-deep)" }}
                >
                  Équipements supplémentaires
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(farm.amenities).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </section>

        {/* Section Règles et Attractions */}
        <section id="regles" className="scroll-mt-20 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Règles de la maison */}
            {farm.house_rules && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3
                  className="text-xl font-bold mb-6 flex items-center gap-2"
                  style={{ color: "var(--green-deep)" }}
                >
                  <CheckCircle size={24} style={{ color: "var(--gold)" }} />
                  Règles de la maison
                </h3>
                <div className="prose prose-sm max-w-none">
                  {farm.house_rules.split("\n").map((rule, idx) => (
                    <p
                      key={idx}
                      className="text-gray-600 mb-2 text-sm flex items-start gap-2"
                    >
                      <span>•</span> {rule.replace(/^[•\-\*]\s*/, "")}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Attractions à proximité */}
            {farm.nearby_attractions && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3
                  className="text-xl font-bold mb-6 flex items-center gap-2"
                  style={{ color: "var(--green-deep)" }}
                >
                  <Award size={24} style={{ color: "var(--gold)" }} />À
                  proximité
                </h3>
                <div className="prose prose-sm max-w-none">
                  {farm.nearby_attractions
                    .split("\n")
                    .map((attraction, idx) => (
                      <p
                        key={idx}
                        className="text-gray-600 mb-2 text-sm flex items-start gap-2"
                      >
                        {attraction.startsWith("🏛️") ||
                        attraction.startsWith("🏰") ||
                        attraction.startsWith("🏙️") ? (
                          <span className="text-lg mr-1">
                            {attraction.charAt(0)}
                          </span>
                        ) : (
                          <span>📍</span>
                        )}
                        {attraction.replace(/^[🏛️🏰🏙️⛲🏺🌄🍷]\s*/, "")}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Politique d'annulation */}
          {farm.cancellation_policy && (
            <div className="mt-8 bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3
                className="text-xl font-bold mb-4 flex items-center gap-2"
                style={{ color: "var(--green-deep)" }}
              >
                📋 Politique d'annulation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farm.cancellation_policy.split("\n").map((policy, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 rounded-xl"
                    style={{ backgroundColor: "rgba(201,169,110,0.08)" }}
                  >
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm text-gray-600">
                      {policy.replace(/^[•\-\*]\s*/, "")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Section Contact */}
        <section id="contact" className="scroll-mt-20">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: "var(--gold)" }}
                />
                <span
                  className="text-xs uppercase tracking-widest font-medium"
                  style={{ color: "var(--gold)" }}
                >
                  Contactez-nous
                </span>
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: "var(--gold)" }}
                />
              </div>
              <h2
                className="font-display text-3xl md:text-4xl font-light"
                style={{ color: "var(--green-deep)" }}
              >
                Prêt à{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--earth)" }}
                >
                  réserver
                </span>{" "}
                votre séjour ?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--green-deep)" }}
                >
                  Nos coordonnées
                </h3>

                <div className="space-y-4">
                  {farm.email && (
                    <a
                      href={`mailto:${farm.email}`}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition group"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
                      >
                        <Mail size={18} style={{ color: "var(--gold)" }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-gray-700 group-hover:underline">
                          {farm.email}
                        </p>
                      </div>
                    </a>
                  )}

                  {farm.phone && (
                    <a
                      href={`tel:${farm.phone}`}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition group"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
                      >
                        <Phone size={18} style={{ color: "var(--gold)" }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Téléphone</p>
                        <p className="text-gray-700 group-hover:underline">
                          {farm.phone}
                        </p>
                      </div>
                    </a>
                  )}

                  {farm.whatsapp && (
                    <a
                      href={`https://wa.me/${farm.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition group"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
                      >
                        <FaWhatsapp
                          size={18}
                          style={{ color: "var(--gold)" }}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">WhatsApp</p>
                        <p className="text-gray-700">{farm.whatsapp}</p>
                      </div>
                    </a>
                  )}

                  {farm.location && (
                    <div className="flex items-center gap-4 p-3 rounded-xl">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
                      >
                        <MapPin size={18} style={{ color: "var(--gold)" }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Adresse</p>
                        <p className="text-gray-700">{farm.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Horaires */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
                  >
                    <Clock size={18} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Horaires</p>
                    <p className="text-gray-700">
                      Check-in: {farm.check_in_time || "15:00"} | Check-out:{" "}
                      {farm.check_out_time || "11:00"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social & CTA */}
              <div className="space-y-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--green-deep)" }}
                >
                  Suivez-nous
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map(
                    (social, idx) =>
                      social.url &&
                      social.url !== "#" && (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                          style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
                        >
                          <social.icon
                            size={22}
                            style={{ color: social.color }}
                          />
                        </a>
                      ),
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex flex-col gap-3">
                    <div className="text-center mb-2">
                      <span
                        className="text-3xl font-bold"
                        style={{ color: "var(--gold)" }}
                      >
                        {farm.price_per_day} DH
                      </span>
                      <span className="text-gray-500"> / nuit</span>
                    </div>
                    <button
                      onClick={() => navigate("/reservation")}
                      className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] flex items-center justify-center gap-2"
                      style={{ backgroundColor: "var(--gold)" }}
                    >
                      Réserver maintenant
                      <ArrowRight size={18} />
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Paiement sécurisé • Annulation gratuite sous conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
