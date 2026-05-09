import { useState, useRef, useEffect } from "react";
import { HiX, HiOutlinePhotograph, HiOutlineUpload } from "react-icons/hi";
import { galleryApi } from "../../api/galleryApi";

const CATEGORIES = [
  { value: "extérieur", label: "🌳 Extérieur" },
  { value: "intérieur", label: "🏠 Intérieur" },
  { value: "piscine", label: "🏊 Piscine" },
  { value: "jardin", label: "🌿 Jardin" },
  { value: "paysage", label: "⛰️ Paysage" },
];

export default function GalleryAdminModal({ photo, onClose, onSaved }) {
  const isEdit = !!photo;
  const fileRef = useRef();

  const [form, setForm] = useState({
    title: photo?.title ?? "",
    category: photo?.category ?? "extérieur",
    order: photo?.order ?? 0,
    is_visible: photo?.is_visible ?? true,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(photo?.url ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Préview locale
  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.title) return setError("Le titre est obligatoire.");
    if (!isEdit && !file) return setError("Veuillez choisir une image.");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("order", form.order);
      fd.append("is_visible", form.is_visible ? "1" : "0");
      if (file) fd.append("image", file);

      if (isEdit) {
        await galleryApi.update(photo.id, fd);
      } else {
        await galleryApi.add(fd);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'enregistrement.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <HiOutlinePhotograph className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">
              {isEdit ? "Modifier la photo" : "Ajouter une photo"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Upload image */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Image *
            </label>
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(isEdit ? photo.url : null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                >
                  <HiX className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fileRef.current.click()}
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs font-medium hover:bg-black/70 transition"
                >
                  Changer
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all"
              >
                <HiOutlineUpload className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-500">
                  Cliquez ou glissez une image
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  JPG, PNG, WebP · Max 8 MB
                </p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* Titre */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Titre *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Vue aérienne de la ferme"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Catégorie + Ordre */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Catégorie
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Ordre d'affichage
              </label>
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: parseInt(e.target.value) })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Visibilité */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, is_visible: !form.is_visible })}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
                form.is_visible ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.is_visible ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Visible sur le site
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading
              ? "⏳ Enregistrement..."
              : isEdit
                ? "✅ Modifier"
                : "➕ Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
