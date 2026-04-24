// src/components/reservation/LoadingSpinner.jsx
import { HiOutlineRefresh } from "react-icons/hi";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-green-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-green-600 rounded-full animate-spin border-t-transparent"></div>
          <HiOutlineRefresh className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-green-600 animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 font-medium">Chargement des données...</p>
      </div>
    </div>
  );
}