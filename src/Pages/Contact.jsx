// src/pages/Contact.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import api from "../api/axios";

export default function Contact() {
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Charger les informations de la ferme
  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const response = await api.get("/farm");
        setFarm(response.data.farm);
      } catch (err) {
        console.error("Erreur chargement ferme:", err);
      }
    };
    fetchFarm();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    setErrors({});

    try {
      await api.post("/contact", formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setError(
          err.response?.data?.message ||
            "Une erreur est survenue. Veuillez réessayer.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    { icon: MapPin, text: farm?.location || "El Haj Kedour, Meknès, Maroc" },
    {
      icon: Phone,
      text: farm?.phone || "+212 6 27 24 85 80",
      href: `tel:${farm?.phone?.replace(/\s/g, "") || "+212627248580"}`,
    },
    {
      icon: Mail,
      text: farm?.email || "contact@fermekhadija.ma",
      href: `mailto:${farm?.email || "contact@fermekhadija.ma"}`,
    },
    {
      icon: FaWhatsapp,
      text: "WhatsApp",
      href: `https://wa.me/${farm?.whatsapp?.replace(/[^0-9]/g, "") || "212627248580"}`,
      isWhatsApp: true,
    },
    { icon: Clock, text: "Réponse sous 24h", subtext: "Lun-Ven: 9h-18h" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      url: farm?.facebook_url,
      label: "Facebook",
      color: "#1877f2",
    },
    {
      icon: Instagram,
      url: farm?.instagram_url,
      label: "Instagram",
      color: "#e4405f",
    },
    {
      icon: Youtube,
      url: farm?.youtube_url,
      label: "YouTube",
      color: "#ff0000",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: farm?.image
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
            Contactez-{" "}
            <span className="font-semibold" style={{ color: "var(--gold)" }}>
              nous
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Une question ? Une réservation spéciale ? Nous sommes là pour vous
            aider
          </p>
        </div>
      </section>

      {/* ==================== CONTENU PRINCIPAL ==================== */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-px"
              style={{ backgroundColor: "var(--gold)" }}
            />
            <span
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: "var(--gold)" }}
            >
              Restons connectés
            </span>
            <div
              className="w-12 h-px"
              style={{ backgroundColor: "var(--gold)" }}
            />
          </div>

          <h2
            className="font-display text-4xl lg:text-5xl font-light leading-tight"
            style={{ color: "var(--green-deep)" }}
          >
            Prenons
            <em
              className="block text-4xl lg:text-5xl font-light mt-2"
              style={{ color: "var(--earth)" }}
            >
              contact
            </em>
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto mt-6"
            style={{ color: "rgba(26,58,42,0.7)" }}
          >
            Une question sur la disponibilité ? Une demande spéciale ? Nous
            sommes à votre écoute pour rendre votre séjour inoubliable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Colonne gauche - Formulaire */}
          <div>
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--green-deep)" }}
              >
                Envoyez-nous un message
              </h2>

              {success && (
                <div
                  className="mb-6 p-4 rounded-xl flex items-start gap-3 animate-fade-in"
                  style={{
                    backgroundColor: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <CheckCircle
                    className="text-green-500 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-green-700">
                      Message envoyé !
                    </p>
                    <p className="text-sm text-green-600">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div
                  className="mb-6 p-4 rounded-xl flex items-start gap-3"
                  style={{
                    backgroundColor: "rgba(220,38,38,0.1)",
                    border: "1px solid rgba(220,38,38,0.2)",
                  }}
                >
                  <AlertCircle
                    className="text-red-500 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--green-deep)" }}
                    >
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        errors.name
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:ring-gold"
                      }`}
                      placeholder="Votre nom"
                      style={{ backgroundColor: "#f9fafb" }}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--green-deep)" }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:ring-gold"
                      }`}
                      placeholder="votre@email.com"
                      style={{ backgroundColor: "#f9fafb" }}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--green-deep)" }}
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                    placeholder="06 12 34 56 78"
                    style={{ backgroundColor: "#f9fafb" }}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--green-deep)" }}
                  >
                    Sujet *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      errors.subject
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:ring-gold"
                    }`}
                    placeholder="Réservation, Information, Demande spéciale..."
                    style={{ backgroundColor: "#f9fafb" }}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.subject[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--green-deep)" }}
                  >
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                      errors.message
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:ring-gold"
                    }`}
                    placeholder="Votre message ici..."
                    style={{ backgroundColor: "#f9fafb" }}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message[0]}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--gold)" }}
                >
                  {submitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Envoyer le message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Colonne droite - Informations */}
          <div className="space-y-8">
            {/* Carte d'informations */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--green-deep)" }}
              >
                Informations
              </h2>

              <div className="space-y-5">
                {infoItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
                    >
                      <item.icon size={18} style={{ color: "var(--gold)" }} />
                    </div>
                    <div>
                      {item.href && !item.isWhatsApp ? (
                        <a
                          href={item.href}
                          className="text-gray-700 hover:underline transition"
                        >
                          {item.text}
                        </a>
                      ) : item.isWhatsApp ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:underline transition flex items-center gap-1"
                        >
                          <span>Ecrivez-nous sur</span>
                          <span className="font-semibold text-green-600">
                            WhatsApp
                          </span>
                        </a>
                      ) : (
                        <>
                          <p className="text-gray-700">{item.text}</p>
                          {item.subtext && (
                            <p className="text-gray-400 text-sm mt-1">
                              {item.subtext}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Prix */}
              {farm && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Prix par nuit</span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--gold)" }}
                    >
                      {farm.price_per_day} DH
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Carte Google Maps */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="h-64 bg-gray-200 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13257.68108151439!2d-5.435700461692841!3d33.82727079732081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda0485b4d36b5ab%3A0xbfc8c0350e3f5fda!2sEl%20Haj%20Kaddour!5e0!3m2!1sfr!2sma!4v1777308305033!5m2!1sfr!2sma"
                  title="Ferme Khadija Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <MapPin size={16} style={{ color: "var(--gold)" }} />
                  <span className="text-gray-600 text-sm">
                    {farm?.location ||
                      "El Haj Kedour, Province de Meknès, Maroc"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  À 20 minutes du centre de Meknès, accès facile par la route
                  nationale
                </p>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: "var(--green-deep)" }}
              >
                Suivez-nous
              </h3>
              <div className="flex gap-4">
                {socialLinks.map(
                  (social, idx) =>
                    social.url && (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                        style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
                      >
                        <social.icon
                          size={18}
                          style={{ color: social.color }}
                        />
                      </a>
                    ),
                )}
                {!farm?.facebook_url &&
                  !farm?.instagram_url &&
                  !farm?.youtube_url && (
                    <p className="text-gray-400 text-sm">
                      Aucun réseau social configuré
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
