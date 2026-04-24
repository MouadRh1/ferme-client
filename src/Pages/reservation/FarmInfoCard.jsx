// src/components/reservation/FarmInfoCard.jsx (Version Font Awesome)
import {
  FaHome,
  FaSwimmingPool,
  FaLeaf,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function FarmInfoCard({ farm }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{farm.name}</h2>
          <FaHome className="text-4xl text-amber-600" />
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {farm.description}
        </p>

        {/* Équipements avec Font Awesome */}
        <div className="flex flex-wrap gap-2 mb-6">
          {farm.has_house && (
            <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl text-sm font-medium">
              <FaHome className="text-base" />
              Maison
            </span>
          )}
          {farm.has_pool && (
            <span className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-xl text-sm font-medium">
              <FaSwimmingPool className="text-base" />
              Piscine
            </span>
          )}
          {farm.has_garden && (
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-sm font-medium">
              <FaLeaf className="text-base" />
              Espace vert
            </span>
          )}
        </div>

        {/* Prix */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="text-2xl text-green-600" />
              <span className="text-gray-700 font-medium">Prix par nuit</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-green-700">
                {farm.price_per_day}
              </span>
              <span className="text-gray-500 ml-1">DH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
