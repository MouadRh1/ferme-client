// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  HiOutlineViewGrid,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineHome,
} from "react-icons/hi";
import api from "../../api/axios";
import Overview from "./components/Overview";
import ReservationsTable from "./components/ReservationsTable";
import UsersTable from "./components/UsersTable";
import FarmSettings from "./components/FarmSettings";

const TABS = [
  {
    id: "overview",
    label: "Vue d'ensemble",
    icon: <HiOutlineViewGrid className="w-4 h-4" />,
  },
  {
    id: "reservations",
    label: "Réservations",
    icon: <HiOutlineCalendar className="w-4 h-4" />,
  },
  {
    id: "users",
    label: "Utilisateurs",
    icon: <HiOutlineUsers className="w-4 h-4" />,
  },
  { id: "farm", label: "Ferme", icon: <HiOutlineHome className="w-4 h-4" /> },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [resRes, usersRes, farmRes] = await Promise.all([
        api.get("/reservations"),
        api.get("/admin/users"),
        api.get("/farm"),
      ]);
      setReservations(resRes.data);
      setUsers(usersRes.data);
      setFarm(farmRes.data);
    } catch (err) {
      console.error("Erreur dashboard:", err);
      showToast("Erreur lors du chargement des données", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      // Envoyer uniquement le statut de réservation
      // Le backend gère automatiquement le payment_status
      const response = await api.put(`/reservations/${id}/status`, {
        status: status,
      });

      // Mettre à jour l'état local avec les données retournées par le backend
      if (response.data.reservation) {
        setReservations((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status: response.data.reservation.status }
              : r,
          ),
        );
      } else {
        // Fallback : mise à jour manuelle
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r)),
        );
      }

      showToast(
        status === "confirmed"
          ? "✅ Réservation confirmée avec succès"
          : "❌ Réservation annulée avec succès",
        "success",
      );
    } catch (error) {
      console.error("Erreur détaillée:", error);
      console.error("Réponse:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        "⚠️ Erreur lors de la mise à jour du statut";
      showToast(errorMessage, "error");
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "⚠️ Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      showToast("🗑️ Réservation supprimée avec succès", "success");
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "⚠️ Erreur lors de la suppression";
      showToast(errorMessage, "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-5xl animate-bounce">🌾</div>
          <p className="text-gray-400 text-sm font-medium">
            Chargement du dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 animate-slide-in ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-gray-900 text-white"
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-400 text-sm mt-1">
            Ferme Khadija · Gestion complète
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {activeTab === "overview" && (
          <Overview reservations={reservations} users={users} farm={farm} />
        )}
        {activeTab === "reservations" && (
          <ReservationsTable
            reservations={reservations}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
        {activeTab === "users" && <UsersTable users={users} />}
        {activeTab === "farm" && (
          <FarmSettings farm={farm} onUpdate={fetchData} />
        )}
      </div>

      {/* Animation CSS pour le toast */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
