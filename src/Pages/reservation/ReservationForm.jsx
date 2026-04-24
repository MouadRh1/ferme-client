// src/components/reservation/ReservationForm.jsx
import { useState } from "react";
import { HiOutlineCalendar, HiOutlinePencil, HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import PriceCalculator from "./PriceCalculator";

export default function ReservationForm({ farm, onSubmit, isSubmitting, bookedDates }) {
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const isDateBooked = (dateStr) => {
    return bookedDates.some(({ start_date, end_date }) => {
      const d = new Date(dateStr);
      const start = new Date(start_date);
      const end = new Date(end_date);
      return d >= start && d <= end;
    });
  };

  const calculateDays = () => {
    if (!form.start_date || !form.end_date) return 0;
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const days = calculateDays();
    return days > 0 ? days * farm.price_per_day : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.start_date || !form.end_date) {
      return setError("Veuillez sélectionner les dates de début et de fin.");
    }
    if (new Date(form.end_date) <= new Date(form.start_date)) {
      return setError("La date de fin doit être après la date de début.");
    }
    if (calculateDays() < 1) {
      return setError("La réservation doit être d'au moins 1 jour.");
    }
    if (isDateBooked(form.start_date) || isDateBooked(form.end_date)) {
      return setError("Ces dates sont déjà réservées. Choisissez d'autres dates.");
    }

    const result = await onSubmit(form);
    if (result.success) {
      setSuccess(result.message);
      setForm({ start_date: "", end_date: "", notes: "" });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <HiOutlineCalendar className="text-green-600" />
        Nouvelle Réservation
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
          <HiOutlineX className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
          <HiOutlineCheck className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'arrivée
            </label>
            <div className="relative">
              <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                min={today}
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de départ
            </label>
            <div className="relative">
              <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                min={form.start_date || today}
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        {calculateDays() > 0 && (
          <PriceCalculator
            days={calculateDays()}
            pricePerDay={farm.price_per_day}
            totalPrice={calculateTotal()}
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <HiOutlinePencil className="text-gray-400" />
            Notes spéciales
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
            placeholder="Informations supplémentaires, nombre de personnes, demande spéciale..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Traitement en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <HiOutlineCheck className="text-lg" />
              Confirmer la Réservation
            </span>
          )}
        </button>
      </form>
    </div>
  );
}