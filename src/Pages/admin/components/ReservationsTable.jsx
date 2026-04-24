// src/pages/admin/components/ReservationsTable.jsx
import { useState } from 'react';
import {
  HiOutlineSearch,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineEye,
} from 'react-icons/hi';
import StatusBadge from './StatusBadge';

const fmt = (d) => new Date(d).toLocaleDateString('fr-FR');

// Badge personnalisé pour le statut de paiement
function PaymentStatusBadge({ status }) {
  const config = {
    pending: { label: 'En attente', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
    paid: { label: 'Payé', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
    verified: { label: 'Vérifié ✓', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
    failed: { label: 'Échoué', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
  };
  
  const c = config[status] || config.pending;
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.bgColor} ${c.textColor} border ${c.borderColor}`}>
      {c.label}
    </span>
  );
}

export default function ReservationsTable({ reservations, onStatusChange, onDelete }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = reservations.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter;
    const matchSearch =
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).includes(search);
    return matchStatus && matchSearch;
  });

  const filters = [
    { key: 'all',       label: 'Tout',        count: reservations.length },
    { key: 'pending',   label: 'En attente',  count: reservations.filter(r => r.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmées',  count: reservations.filter(r => r.status === 'confirmed').length },
    { key: 'cancelled', label: 'Annulées',    count: reservations.filter(r => r.status === 'cancelled').length },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h3 className="font-semibold text-gray-800 text-base">
            Toutes les réservations
          </h3>

          {/* Recherche */}
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-52"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-1.5 mt-4 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === f.key
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f.label}
              <span className={`px-1.5 py-0.5 rounded-md text-xs ${
                filter === f.key ? 'bg-white/20' : 'bg-gray-200 text-gray-500'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Période</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Durée</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Montant</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Avance</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-300">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-sm">Aucune réservation trouvée</p>
                </td>
              </tr>
            ) : filtered.map(r => {
              const days = Math.ceil(
                (new Date(r.end_date) - new Date(r.start_date)) / 86400000
              );
              return (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/70 transition">
                  <td className="px-5 py-4 text-gray-300 font-mono text-xs">#{r.id}</td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {r.user?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{r.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{r.user?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-gray-700 text-sm">{fmt(r.start_date)}</p>
                    <p className="text-xs text-gray-400">→ {fmt(r.end_date)}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-xs font-medium">
                      {days}j
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <span className="font-semibold text-green-700">{r.total_price} DH</span>
                      {r.advance_amount && (
                        <p className="text-xs text-gray-400">
                          (dont avance: {r.advance_amount} DH)
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {r.advance_amount && (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-amber-600 text-sm">
                          {r.advance_amount} DH
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                          r.payment_method === 'card'
                            ? 'bg-purple-50 text-purple-600'
                            : 'bg-orange-50 text-orange-600'
                        }`}>
                          {r.payment_method === 'card' ? '💳 Carte' : '🏦 Virement'}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5">
                      <StatusBadge status={r.status} />
                      {r.payment_status && (
                        <PaymentStatusBadge status={r.payment_status} />
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      {/* Bouton voir preuve */}
                      {r.payment_proof_url && (
                        <a
                          href={r.payment_proof_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Voir preuve de paiement"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                        >
                          <HiOutlineEye className="w-3.5 h-3.5" />
                        </a>
                      )}
                      
                      {/* Actions selon statut */}
                      {r.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onStatusChange(r.id, 'confirmed')}
                            title="Confirmer"
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                          >
                            <HiOutlineCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onStatusChange(r.id, 'cancelled')}
                            title="Annuler"
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition"
                          >
                            <HiOutlineX className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      
                      {r.status === 'cancelled' && (
                        <button
                          onClick={() => onStatusChange(r.id, 'confirmed')}
                          title="Rétablir"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                        >
                          <HiOutlineCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDelete(r.id)}
                        title="Supprimer"
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}