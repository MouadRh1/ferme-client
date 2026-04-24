// src/components/reservation/StatusBadge.jsx
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const statusConfig = {
  pending: {
    icon: HiOutlineClock,
    label: "En attente",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  confirmed: {
    icon: HiOutlineCheckCircle,
    label: "Confirmée",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  cancelled: {
    icon: HiOutlineXCircle,
    label: "Annulée",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
};

export default function StatusBadge({ status }) {
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