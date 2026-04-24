// src/pages/home/GallerySection.jsx
import { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ZoomIn,
} from "lucide-react";

// Images de la galerie
const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Vue aérienne de la ferme",
    category: "extérieur",
    likes: 45,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Piscine à débordement",
    category: "piscine",
    likes: 32,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    title: "Architecture traditionnelle",
    category: "extérieur",
    likes: 28,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Jardin luxuriant",
    category: "jardin",
    likes: 56,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Intérieur moderne",
    category: "intérieur",
    likes: 39,
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Terrasse extérieure",
    category: "extérieur",
    likes: 41,
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Chambre principale",
    category: "intérieur",
    likes: 27,
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Cuisine équipée",
    category: "intérieur",
    likes: 34,
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Coucher de soleil",
    category: "paysage",
    likes: 67,
  },
];

const categories = [
  { id: "all", label: "Tous", icon: "🎨" },
  { id: "extérieur", label: "Extérieur", icon: "🌳" },
  { id: "intérieur", label: "Intérieur", icon: "🏠" },
  { id: "piscine", label: "Piscine", icon: "🏊" },
  { id: "jardin", label: "Jardin", icon: "🌿" },
  { id: "paysage", label: "Paysage", icon: "⛰️" },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [likedImages, setLikedImages] = useState([]);

  // Filtrer les images par catégorie
  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  // Gérer les likes
  const handleLike = (imageId) => {
    if (likedImages.includes(imageId)) {
      setLikedImages(likedImages.filter((id) => id !== imageId));
    } else {
      setLikedImages([...likedImages, imageId]);
    }
  };

  // Ouvrir la modal
  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  // Fermer la modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // Navigation dans la modal
  const nextImage = () => {
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    const prevIndex =
      (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "Escape") closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <section
      id="gallery"
      className="py-24 px-6"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="max-w-6xl mx-auto">
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
              Notre Galerie
            </span>
            <div
              className="w-12 h-px"
              style={{ backgroundColor: "var(--gold)" }}
            />
          </div>

          <h2
            className="font-display text-5xl font-light leading-tight"
            style={{ color: "var(--green-deep)" }}
          >
            Découvrez notre
            <em
              className="block font-display text-5xl font-light mt-2"
              style={{ color: "var(--earth)" }}
            >
              paradis
            </em>
          </h2>

          <p
            className="text-base max-w-2xl mx-auto mt-4"
            style={{ color: "rgba(26,58,42,0.6)" }}
          >
            Plongez dans l'ambiance unique de notre ferme à travers ces images
            qui capturent l'essence de ce lieu d'exception.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`group px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === cat.id
                  ? "text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              style={
                activeCategory === cat.id
                  ? { backgroundColor: "var(--gold)" }
                  : {}
              }
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleLike(image.id)}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition"
                    >
                      <Heart
                        size={18}
                        className={`transition ${
                          likedImages.includes(image.id)
                            ? "fill-red-500 text-red-500"
                            : "text-white"
                        }`}
                      />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition">
                      <Share2 size={18} className="text-white" />
                    </button>
                  </div>

                  <div className="text-white">
                    <h3
                      className="font-display text-lg font-semibold mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {image.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/80 uppercase tracking-wider">
                        {image.category}
                      </p>
                      <button
                        onClick={() => openModal(image)}
                        className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full hover:bg-white/30 transition"
                      >
                        <ZoomIn size={12} />
                        Voir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Like counter badge */}
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md rounded-full px-2 py-1 text-xs text-white flex items-center gap-1">
                  <Heart size={10} className="fill-red-500 text-red-500" />
                  {image.likes + (likedImages.includes(image.id) ? 1 : 0)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button
            className="group px-8 py-3 rounded-full font-medium text-sm transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg"
            style={{ backgroundColor: "var(--gold)", color: "#fff" }}
          >
            Voir plus de photos
            <svg
              className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative max-w-6xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image principale */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[85vh] object-contain"
              />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3
                  className="font-display text-2xl text-white font-semibold mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {selectedImage.title}
                </h3>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Heart size={14} className="fill-red-500 text-red-500" />
                    {selectedImage.likes +
                      (likedImages.includes(selectedImage.id) ? 1 : 0)}{" "}
                    likes
                  </span>
                  <span className="uppercase tracking-wider">
                    {selectedImage.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
