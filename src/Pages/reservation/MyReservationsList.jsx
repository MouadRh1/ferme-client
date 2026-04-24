// src/components/reservation/MyReservationsList.jsx
import {
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
} from "react-icons/hi";
import StatusBadge from "./StatusBadge";

export default function MyReservationsList({ reservations, bookedDates }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <HiOutlineCalendar className="text-green-600" />
          Mes Réservations
        </h2>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          {reservations.length}
        </span>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-3 opacity-50">📭</div>
          <p className="text-gray-400 text-sm">
            Aucune réservation pour l'instant
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Commencez par réserver votre séjour
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="group border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  #{res.id}
                </span>
                <StatusBadge status={res.status} />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <HiOutlineCalendar className="text-gray-400" />
                  <span>
                    {new Date(res.start_date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-gray-300">→</span>
                  <span>
                    {new Date(res.end_date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <HiOutlineCurrencyDollar />
                    <span>Total</span>
                  </div>
                  <span className="font-bold text-green-700">
                    {res.total_price} DH
                  </span>
                </div>

                {res.notes && (
                  <div className="flex items-start gap-1 text-gray-400 text-xs">
                    <HiOutlineDocumentText className="mt-0.5" />
                    <p className="line-clamp-1">{res.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {bookedDates.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
            <span>🚫</span>
            Dates indisponibles
          </p>
          <div className="space-y-1.5">
            {bookedDates.slice(0, 5).map((d, i) => (
              <div
                key={i}
                className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-1.5 flex items-center justify-between"
              >
                <span>
                  {new Date(d.start_date).toLocaleDateString("fr-FR")}
                </span>
                <span className="text-gray-400">→</span>
                <span>{new Date(d.end_date).toLocaleDateString("fr-FR")}</span>
              </div>
            ))}
            {bookedDates.length > 5 && (
              <p className="text-xs text-gray-400 text-center mt-2">
                +{bookedDates.length - 5} autres dates
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
