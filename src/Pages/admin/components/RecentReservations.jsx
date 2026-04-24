// src/pages/admin/components/RecentReservations.jsx
import StatusBadge from './StatusBadge';

const fmt = (d) => new Date(d).toLocaleDateString('fr-FR');

export default function RecentReservations({ reservations }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-800">Dernières réservations</h3>
        <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
          {reservations.length} au total
        </span>
      </div>

      <div className="space-y-3">
        {reservations.slice(0, 5).map(r => (
          <div
            key={r.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {r.user?.name?.charAt(0).toUpperCase() || '?'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {r.user?.name || 'N/A'}
              </p>
              <p className="text-xs text-gray-400">
                {fmt(r.start_date)} → {fmt(r.end_date)}
              </p>
            </div>

            {/* Droite */}
            <div className="text-right flex-shrink-0">
              <StatusBadge status={r.status} />
              <p className="text-xs font-semibold text-green-700 mt-1">
                {r.total_price} DH
              </p>
            </div>
          </div>
        ))}

        {reservations.length === 0 && (
          <div className="text-center py-8 text-gray-300">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">Aucune réservation</p>
          </div>
        )}
      </div>
    </div>
  );
}