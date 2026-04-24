// src/components/reservation/PriceCalculator.jsx
import { HiOutlineCalculator, HiOutlineCalendar } from "react-icons/hi";

export default function PriceCalculator({ days, pricePerDay, totalPrice }) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <HiOutlineCalculator className="text-green-600 text-lg" />
        <h3 className="font-semibold text-gray-800">Détail du prix</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <HiOutlineCalendar className="text-gray-400" />
            Nombre de nuits :
          </span>
          <span className="font-semibold text-gray-800">{days} jour(s)</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Tarif / nuit :</span>
          <span className="font-semibold text-gray-800">{pricePerDay} DH</span>
        </div>
        <div className="border-t border-green-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-green-700 text-base">Total TTC :</span>
            <span className="font-bold text-green-700 text-xl">{totalPrice} DH</span>
          </div>
        </div>
      </div>
    </div>
  );
}