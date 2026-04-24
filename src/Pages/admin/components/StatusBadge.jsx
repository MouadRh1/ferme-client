// src/pages/admin/components/StatusBadge.jsx
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

export default function StatusBadge({ status }) {
  const statusConfig = {
    // Statuts de réservation
    pending: {
      icon: HiOutlineClock,
      label: "En attente",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
    },
    confirmed: {
      icon: HiOutlineCheckCircle,
      label: "Confirmée",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    },
    cancelled: {
      icon: HiOutlineXCircle,
      label: "Annulée",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
    },
    // Statuts de paiement
    paid: {
      icon: HiOutlineCheckCircle,
      label: "Payé",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    },
    verified: {
      icon: HiOutlineCheckCircle,
      label: "Vérifié",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
    },
    failed: {
      icon: HiOutlineXCircle,
      label: "Échoué",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
    >
      <Icon className="text-sm" />
      {config.label}
    </span>
  );
}