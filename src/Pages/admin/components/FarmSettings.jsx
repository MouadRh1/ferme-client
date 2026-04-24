// src/pages/admin/components/FarmSettings.jsx
import { useState, useEffect } from 'react';
import {
  HiOutlineSave,
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlinePencil,
} from 'react-icons/hi';
import api from '../../../api/axios';

export default function FarmSettings({ farm, onUpdate }) {
  const [form, setForm]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  useEffect(() => {
    if (farm) setForm({ ...farm });
  }, [farm]);

  if (!form) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/farm/${farm.id}`, form);
      setSuccess('Ferme mise à jour avec succès !');
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: 'name',
      label: 'Nom de la ferme',
      type: 'text',
      icon: <HiOutlineHome className="w-4 h-4" />,
      placeholder: 'Ex: Ferme Khadija',
    },
    {
      key: 'price_per_day',
      label: 'Prix par jour (DH)',
      type: 'number',
      icon: <HiOutlineCurrencyDollar className="w-4 h-4" />,
      placeholder: '800',
    },
    {
      key: 'location',
      label: 'Localisation',
      type: 'text',
      icon: <HiOutlineLocationMarker className="w-4 h-4" />,
      placeholder: 'Ex: Casablanca, Maroc',
    },
  ];

  const amenities = [
    { key: 'has_house',  label: 'Maison',      emoji: '🏠' },
    { key: 'has_pool',   label: 'Piscine',     emoji: '🏊' },
    { key: 'has_garden', label: 'Espace vert', emoji: '🌿' },
  ];

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <HiOutlinePencil className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Paramètres de la ferme</h3>
            <p className="text-xs text-gray-400 mt-0.5">Modifiez les informations de la ferme</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

          {/* Champs texte */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {f.label}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                    {f.icon}
                  </span>
                  <input
                    type={f.type}
                    value={form[f.key] || ''}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
              placeholder="Description de la ferme..."
            />
          </div>

          {/* Équipements */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Équipements
            </label>
            <div className="flex flex-wrap gap-3">
              {amenities.map(a => (
                <label
                  key={a.key}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                    form[a.key]
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form[a.key] || false}
                    onChange={e => setForm({ ...form, [a.key]: e.target.checked })}
                    className="sr-only"
                  />
                  <span className="text-lg">{a.emoji}</span>
                  <span className="text-sm font-medium">{a.label}</span>
                  {form[a.key] && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Bouton */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-xl hover:bg-green-600 transition font-semibold text-sm disabled:opacity-50 shadow-sm"
            >
              <HiOutlineSave className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}