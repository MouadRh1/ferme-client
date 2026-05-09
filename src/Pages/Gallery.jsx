// src/pages/Gallery.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineHeart,
  HiHeart,
  HiOutlineZoomIn,
  HiOutlineX,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePhotograph,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { useAuth }          from "../context/AuthContext";
import { galleryApi }       from "../api/galleryApi";
import GalleryAdminModal    from "../components/gallery/GalleryAdminModal";
import api from "../api/axios";

const CATEGORIES = [
  { id: "all",        label: "Tous",       icon: "🎨" },
  { id: "extérieur",  label: "Extérieur",  icon: "🌳" },
  { id: "intérieur",  label: "Intérieur",  icon: "🏠" },
  { id: "piscine",    label: "Piscine",    icon: "🏊" },
  { id: "jardin",     label: "Jardin",     icon: "🌿" },
  { id: "paysage",    label: "Paysage",    icon: "⛰️" },
];

export default function Gallery() {
  const navigate       = useNavigate();
  const { isAdmin }    = useAuth();

  const [photos,        setPhotos]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages,   setLikedImages]   = useState([]);
  const [farm,          setFarm]          = useState(null);
  const [modal,         setModal]         = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [toast,         setToast]         = useState(null);

  // ── Ferme ─────────────────────────────────────────
  useEffect(() => {
    api.get("/farm")
      .then(r => setFarm(r.data))
      .catch(() => {});
  }, []);

  // ── Photos ────────────────────────────────────────
  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = isAdmin()
        ? await galleryApi.adminGetAll()
        : await galleryApi.getAll();
      setPhotos(res.data);
    } catch {
      showToast("Erreur lors du chargement.", "error");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  // ── Toast ─────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Filtrer ───────────────────────────────────────
  const filtered = activeCategory === "all"
    ? photos
    : photos.filter(p => p.category === activeCategory);

  // ── Like ──────────────────────────────────────────
  const handleLike = async (e, photoId) => {
    e.stopPropagation();
    try {
      await galleryApi.like(photoId);
      setLikedImages(prev =>
        prev.includes(photoId)
          ? prev.filter(id => id !== photoId)
          : [...prev, photoId]
      );
      setPhotos(prev =>
        prev.map(p =>
          p.id === photoId
            ? { ...p, likes: p.likes + (likedImages.includes(photoId) ? -1 : 1) }
            : p
        )
      );
    } catch {}
  };

  // ── Lightbox ──────────────────────────────────────
  const openLightbox  = (img) => { setSelectedImage(img); document.body.style.overflow = "hidden"; };
  const closeLightbox = ()    => { setSelectedImage(null); document.body.style.overflow = "auto"; };

  const navigateLight = (dir) => {
    const idx     = filtered.findIndex(p => p.id === selectedImage.id);
    const nextIdx = (idx + dir + filtered.length) % filtered.length;
    setSelectedImage(filtered[nextIdx]);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!selectedImage) return;
      if (e.key === "ArrowLeft")  navigateLight(-1);
      if (e.key === "ArrowRight") navigateLight(1);
      if (e.key === "Escape")     closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedImage, filtered]);

  // ── Supprimer ─────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await galleryApi.remove(deleteConfirm.id);
      setPhotos(prev => prev.filter(p => p.id !== deleteConfirm.id));
      showToast("Photo supprimée.");
      setDeleteConfirm(null);
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Toggle visibilité ─────────────────────────────
  const toggleVisibility = async (e, photo) => {
    e.stopPropagation();
    try {
      const fd = new FormData();
      fd.append("title",      photo.title);
      fd.append("category",   photo.category);
      fd.append("is_visible", photo.is_visible ? "0" : "1");
      await galleryApi.update(photo.id, fd);
      setPhotos(prev =>
        prev.map(p => p.id === photo.id ? { ...p, is_visible: !p.is_visible } : p)
      );
      showToast(photo.is_visible ? "Photo masquée." : "Photo visible.");
    } catch {
      showToast("Erreur.", "error");
    }
  };

  // ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>

      {/* ── Toast ──────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-gray-900 text-white"
        }`}>
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}

      {/* ── Modal Admin ────────────────────────────── */}
      {modal && (
        <GalleryAdminModal
          photo={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { loadPhotos(); showToast("Photo enregistrée !"); }}
        />
      )}

      {/* ── Confirm Suppression ────────────────────── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
              <HiOutlineTrash className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Supprimer cette photo ?</h3>
              <p className="text-sm text-gray-400 mt-1">
                "<strong>{deleteConfirm.title}</strong>" sera définitivement supprimée.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2070&q=80")`,
              backgroundPosition: "center 30%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4), var(--green-deep) 90%)" }}
          />
        </div>

        <div className="relative z-10 w-full text-center text-white px-6">
          <h1 className="font-display text-5xl md:text-6xl font-light mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Notre{" "}
            <span className="font-semibold" style={{ color: "var(--gold)" }}>
              Galerie
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-75">
            Découvrez tous nos magnifiques clichés qui capturent l'essence de notre ferme
          </p>
        </div>
      </section>

      {/* ── CONTENU ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto py-16 px-6">

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm mb-10 transition hover:opacity-70 font-medium"
          style={{ color: "var(--gold)" }}
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Retour
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px" style={{ backgroundColor: "var(--gold)" }} />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "var(--gold)" }}>
              Souvenirs
            </span>
            <div className="w-12 h-px" style={{ backgroundColor: "var(--gold)" }} />
          </div>

          <h2
            className="font-display text-4xl lg:text-5xl font-light"
            style={{ color: "var(--green-deep)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Toutes nos{" "}
            <em style={{ color: "var(--earth)" }}>photos</em>
          </h2>

          <p className="text-base max-w-xl mx-auto mt-3" style={{ color: "rgba(26,58,42,0.6)" }}>
            {photos.length} magnifiques clichés qui capturent l'essence de notre ferme
          </p>

          {/* Bouton Ajouter — Admin */}
          {isAdmin() && (
            <button
              onClick={() => setModal("add")}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all hover:scale-105"
              style={{ backgroundColor: "var(--gold)", color: "var(--green-deep)" }}
            >
              <HiOutlinePlus className="w-4 h-4" />
              Ajouter une photo
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-5 py-2 rounded-full font-medium text-sm transition-all duration-300"
              style={activeCategory === cat.id
                ? { backgroundColor: "var(--gold)", color: "#fff", boxShadow: "0 4px 15px rgba(201,169,110,0.4)" }
                : { backgroundColor: "#fff", color: "#6b7280" }
              }
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.label}
              <span className="ml-1.5 text-xs opacity-60">
                ({cat.id === "all" ? photos.length : photos.filter(p => p.category === cat.id).length})
              </span>
            </button>
          ))}
        </div>

        {/* Grille */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <HiOutlinePhotograph className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">Aucune photo dans cette catégorie</p>
            {isAdmin() && (
              <button
                onClick={() => setModal("add")}
                className="mt-4 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--gold)" }}
              >
                Ajouter la première photo
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(photo)}
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                  !photo.is_visible ? "opacity-60" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Badge catégorie */}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 text-xs text-white flex items-center gap-1">
                    <span>{CATEGORIES.find(c => c.id === photo.category)?.icon || "📷"}</span>
                    <span>{photo.category}</span>
                  </div>

                  {/* Badge masquée */}
                  {isAdmin() && !photo.is_visible && (
                    <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                      <HiOutlineEyeOff className="w-3 h-3" />
                      Masquée
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Contenu overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-500">

                    {/* Haut : like + actions admin */}
                    <div className="flex justify-between items-start">
                      {/* Like */}
                      <button
                        onClick={(e) => handleLike(e, photo.id)}
                        className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs hover:bg-white/30 transition"
                      >
                        {likedImages.includes(photo.id)
                          ? <HiHeart className="w-3.5 h-3.5 text-red-400" />
                          : <HiOutlineHeart className="w-3.5 h-3.5" />
                        }
                        {photo.likes + (likedImages.includes(photo.id) ? 1 : 0)}
                      </button>

                      {/* Actions admin */}
                      {isAdmin() && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={(e) => toggleVisibility(e, photo)}
                            title={photo.is_visible ? "Masquer" : "Afficher"}
                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition"
                          >
                            {photo.is_visible
                              ? <HiOutlineEye className="w-4 h-4 text-white" />
                              : <HiOutlineEyeOff className="w-4 h-4 text-white" />
                            }
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setModal(photo); }}
                            title="Modifier"
                            className="w-8 h-8 rounded-full bg-blue-500/80 backdrop-blur-md flex items-center justify-center hover:bg-blue-600/80 transition"
                          >
                            <HiOutlinePencil className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(photo); }}
                            title="Supprimer"
                            className="w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center hover:bg-red-600/80 transition"
                          >
                            <HiOutlineTrash className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bas : titre + agrandir */}
                    <div>
                      <h3
                        className="text-white font-semibold mb-1"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
                      >
                        {photo.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-xs uppercase tracking-wider">
                          {photo.category}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); openLightbox(photo); }}
                          className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full hover:bg-white/30 transition text-white"
                        >
                          <HiOutlineZoomIn className="w-3.5 h-3.5" />
                          Agrandir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ───────────────────────────────── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative max-w-5xl w-full mx-4" onClick={e => e.stopPropagation()}>

            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[85vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white font-semibold text-xl mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {selectedImage.title}
                </h3>
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <span className="flex items-center gap-1.5">
                    <HiHeart className="w-4 h-4 text-red-400" />
                    {selectedImage.likes} likes
                  </span>
                  <span className="uppercase tracking-wider text-xs">
                    {selectedImage.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Fermer */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <HiOutlineX className="w-5 h-5 text-white" />
            </button>

            {/* Précédent */}
            <button
              onClick={() => navigateLight(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <HiChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Suivant */}
            <button
              onClick={() => navigateLight(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <HiChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Compteur */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {filtered.findIndex(p => p.id === selectedImage.id) + 1} / {filtered.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}