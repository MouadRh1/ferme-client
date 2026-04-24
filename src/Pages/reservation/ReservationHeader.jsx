// src/components/reservation/ReservationHeader.jsx
import { HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";

export default function ReservationHeader({ userName }) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
        <HiOutlineCalendar className="text-lg" />
        Réservation en ligne
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
        Réserver la{" "}
        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Ferme
        </span>
      </h1>
      <p className="text-gray-500 flex items-center justify-center gap-2">
        <HiOutlineUser className="text-gray-400" />
        Bonjour <strong className="text-gray-700">{userName}</strong>, 
        réservez votre séjour en quelques clics
      </p>
    </div>
  );
}