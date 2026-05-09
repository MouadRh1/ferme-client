// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  HiOutlineViewGrid,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineHome,
  HiOutlineMail,
} from "react-icons/hi";
import api from "../../api/axios";
import Overview from "./components/Overview";
import ReservationsTable from "./components/ReservationsTable";
import UsersTable from "./components/UsersTable";
import FarmSettings from "./components/FarmSettings";
import ContactsTable from "./components/ContactsTable";

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
  {
    id: "farm",
    label: "Ferme",
    icon: <HiOutlineHome className="w-4 h-4" />,
  },
  {
    id: "contacts",
    label: "Messages",
    icon: <HiOutlineMail className="w-4 h-4" />,
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await api.put(`/reservations/${id}/status`, {
        status: status,
      });

      if (response.data.reservation) {
        setReservations((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status: response.data.reservation.status }
              : r,
          ),
        );
      } else {
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
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative h-[30vh] min-h-[250px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: farm?.image
                ? `url(${farm.image})`
                : 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
              backgroundPosition: "center 30%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5), var(--green-deep) 95%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full text-center text-white px-6">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-3">
            <span className="font-semibold" style={{ color: "var(--gold)" }}>
              Dashboard
            </span>{" "}
            Administrateur
          </h1>
          <p className="text-base max-w-2xl mx-auto opacity-90">
            Gérez les réservations, utilisateurs et paramètres de la ferme
          </p>
        </div>
      </section>

      {/* ==================== CONTENU PRINCIPAL ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
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

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-6">
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
        {activeTab === "contacts" && <ContactsTable />}
      </div>

      {/* Animation CSS */}
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
