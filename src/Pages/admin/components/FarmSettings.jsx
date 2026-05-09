// src/pages/admin/components/FarmSettings.jsx
import { useState, useEffect } from "react";
import {
  HiOutlineSave,
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlinePencil,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineWifi,
  HiOutlineDesktopComputer,
  HiOutlinePhotograph,
  HiOutlineVideoCamera,
  HiOutlineInformationCircle,
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineKey,
} from "react-icons/hi";
import {
  FaWhatsapp,
  FaBed,
  FaCar,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import api from "../../../api/axios";

export default function FarmSettings({ farm, onUpdate }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (farm) {
      setForm({ ...farm });
    }
  }, [farm]);

  if (!form) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">🏡</div>
        <p className="text-gray-500">Chargement des informations de la ferme...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put("/farm", form);
      setSuccess(response.data.message || "Ferme mise à jour avec succès !");
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "Erreur lors de la mise à jour";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const tabs = [
    { id: "general", label: "Général", icon: <HiOutlineHome className="w-4 h-4" /> },
    { id: "contact", label: "Contact & Réseaux", icon: <HiOutlineMail className="w-4 h-4" /> },
    { id: "amenities", label: "Équipements", icon: <HiOutlineWifi className="w-4 h-4" /> },
    { id: "rules", label: "Règles & Infos", icon: <HiOutlineDocumentText className="w-4 h-4" /> },
    { id: "seo", label: "SEO & Statistiques", icon: <HiOutlineStar className="w-4 h-4" /> },
  ];

  const amenities = [
    { key: "has_house", label: "Maison", emoji: "🏠" },
    { key: "has_pool", label: "Piscine", emoji: "🏊" },
    { key: "has_garden", label: "Espace vert", emoji: "🌿" },
    { key: "has_wifi", label: "Wi-Fi", emoji: "📶" },
    { key: "has_parking", label: "Parking", emoji: "🅿️" },
    { key: "has_kitchen", label: "Cuisine équipée", emoji: "🍳" },
    { key: "has_air_conditioning", label: "Climatisation", emoji: "❄️" },
    { key: "has_tv", label: "Smart TV", emoji: "📺" },
  ];

  return (
    <div className="max-w-5xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <HiOutlinePencil className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Paramètres de la ferme</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Modifiez les informations de la ferme
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-green-50 text-green-700 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Alertes */}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-sm">
              <span className="text-lg">✅</span> {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          {/* ==================== TAB GÉNÉRAL ==================== */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Nom de la ferme
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      <HiOutlineHome className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={form.name || ""}
                      onChange={handleChange}
                      placeholder="Ex: Ferme Khadija"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Prix par jour (DH)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      <HiOutlineCurrencyDollar className="w-4 h-4" />
                    </span>
                    <input
                      type="number"
                      name="price_per_day"
                      value={form.price_per_day || ""}
                      onChange={handleChange}
                      placeholder="800"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Localisation
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      <HiOutlineLocationMarker className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="location"
                      value={form.location || ""}
                      onChange={handleChange}
                      placeholder="Ex: El Haj Kedour, Meknès, Maroc"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Image principale
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      <HiOutlinePhotograph className="w-4 h-4" />
                    </span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append("image", file);
                          // TODO: Gérer l'upload séparément
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
                    />
                  </div>
                  {form.image && (
                    <p className="text-xs text-gray-400 mt-1">Image actuelle: {form.image}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Galerie d'images (JSON)
                  </label>
                  <textarea
                    name="gallery_images"
                    value={typeof form.gallery_images === 'object' ? JSON.stringify(form.gallery_images, null, 2) : form.gallery_images || ""}
                    onChange={handleChange}
                    placeholder='["image1.jpg", "image2.jpg"]'
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1">Format JSON: ["url1", "url2"]</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description courte (SEO)
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={form.short_description || ""}
                  onChange={handleChange}
                  placeholder="Brève description pour les moteurs de recherche"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description complète
                </label>
                <textarea
                  rows={5}
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                  placeholder="Description détaillée de la ferme..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Équipements supplémentaires (JSON)
                </label>
                <textarea
                  name="amenities"
                  value={typeof form.amenities === 'object' ? JSON.stringify(form.amenities, null, 2) : form.amenities || ""}
                  onChange={handleChange}
                  placeholder='["Barbecue", "Lave-linge", "Fer à repasser"]'
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">Format JSON: ["équipement1", "équipement2"]</p>
              </div>
            </div>
          )}

          {/* ==================== TAB CONTACT & RÉSEAUX ==================== */}
          {activeTab === "contact" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      <HiOutlineMail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={form.email || ""}
                      onChange={handleChange}
                      placeholder="contact@fermekhadija.ma"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Téléphone
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      <HiOutlinePhone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone || ""}
                      onChange={handleChange}
                      placeholder="+212 6 12 34 56 78"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-500">
                      <FaWhatsapp className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={form.whatsapp || ""}
                      onChange={handleChange}
                      placeholder="+212 6 12 34 56 78"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Réseaux sociaux</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Facebook
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600">
                        <FaFacebook className="w-4 h-4" />
                      </span>
                      <input
                        type="url"
                        name="facebook_url"
                        value={form.facebook_url || ""}
                        onChange={handleChange}
                        placeholder="https://facebook.com/..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Instagram
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-600">
                        <FaInstagram className="w-4 h-4" />
                      </span>
                      <input
                        type="url"
                        name="instagram_url"
                        value={form.instagram_url || ""}
                        onChange={handleChange}
                        placeholder="https://instagram.com/..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      YouTube
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-600">
                        <FaYoutube className="w-4 h-4" />
                      </span>
                      <input
                        type="url"
                        name="youtube_url"
                        value={form.youtube_url || ""}
                        onChange={handleChange}
                        placeholder="https://youtube.com/..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB ÉQUIPEMENTS ==================== */}
          {activeTab === "amenities" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenities.map((a) => (
                  <label
                    key={a.key}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      form[a.key]
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={a.key}
                      checked={form[a.key] || false}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-xl">{a.emoji}</span>
                    <span className="text-sm font-medium">{a.label}</span>
                  </label>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Capacités
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      <HiOutlineUsers className="inline mr-1 w-3 h-3" /> Max personnes
                    </label>
                    <input
                      type="number"
                      name="max_persons"
                      value={form.max_persons || 8}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      <FaBed className="inline mr-1 w-3 h-3" /> Chambres
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={form.bedrooms || 3}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      🛁 Salles de bain
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={form.bathrooms || 2}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      📅 Nuits minimum
                    </label>
                    <input
                      type="number"
                      name="min_nights"
                      value={form.min_nights || 2}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB RÈGLES & INFOS ==================== */}
          {activeTab === "rules" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    <HiOutlineClock className="inline mr-1 w-3 h-3" /> Check-in
                  </label>
                  <input
                    type="time"
                    name="check_in_time"
                    value={form.check_in_time || "15:00"}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    <HiOutlineClock className="inline mr-1 w-3 h-3" /> Check-out
                  </label>
                  <input
                    type="time"
                    name="check_out_time"
                    value={form.check_out_time || "11:00"}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <HiOutlineInformationCircle className="inline mr-1 w-3 h-3" /> Attractions à proximité
                </label>
                <textarea
                  rows={4}
                  name="nearby_attractions"
                  value={form.nearby_attractions || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                  placeholder="Meknès, Volubilis, Moulay Idriss..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <HiOutlineDocumentText className="inline mr-1 w-3 h-3" /> Règles de la maison
                </label>
                <textarea
                  rows={4}
                  name="house_rules"
                  value={form.house_rules || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                  placeholder="Non fumeur, Pas d'animaux, etc..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  🔄 Politique d'annulation
                </label>
                <textarea
                  rows={3}
                  name="cancellation_policy"
                  value={form.cancellation_policy || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                  placeholder="Annulation gratuite jusqu'à 7 jours avant..."
                />
              </div>
            </div>
          )}

          {/* ==================== TAB SEO & STATISTIQUES ==================== */}
          {activeTab === "seo" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <HiOutlineStar className="inline mr-1 w-3 h-3" /> Meta titre
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={form.meta_title || ""}
                  onChange={handleChange}
                  placeholder="Titre pour les moteurs de recherche (max 60 caractères)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.meta_title?.length || 0}/60 caractères
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <HiOutlineDocumentText className="inline mr-1 w-3 h-3" /> Meta description
                </label>
                <textarea
                  rows={2}
                  name="meta_description"
                  value={form.meta_description || ""}
                  onChange={handleChange}
                  placeholder="Description pour les moteurs de recherche (max 160 caractères)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.meta_description?.length || 0}/160 caractères
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Statistiques</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      <HiOutlineStar className="inline mr-1 w-3 h-3" /> Nombre d'avis
                    </label>
                    <input
                      type="number"
                      name="total_reviews"
                      value={form.total_reviews || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      <HiOutlineStar className="inline mr-1 w-3 h-3" /> Note moyenne (/5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="average_rating"
                      value={form.average_rating || 5.0}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bouton submit */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-xl hover:bg-green-600 transition font-semibold text-sm disabled:opacity-50 shadow-sm"
            >
              <HiOutlineSave className="w-4 h-4" />
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}