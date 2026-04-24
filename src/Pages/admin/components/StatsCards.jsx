// src/pages/admin/components/StatsCards.jsx
import {
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
} from 'react-icons/hi';

export default function StatsCards({ reservations, users }) {
  const total     = reservations.length;
  const pending   = reservations.filter(r => r.status === 'pending').length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;
  const revenue   = reservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, r) => sum + parseFloat(r.total_price), 0);

  const stats = [
    {
      label: 'Total réservations',
      value: total,
      icon: <HiOutlineClipboardList className="w-5 h-5" />,
      gradient: 'from-slate-700 to-slate-800',
      accent: '#94a3b8',
    },
    {
      label: 'En attente',
      value: pending,
      icon: <HiOutlineClock className="w-5 h-5" />,
      gradient: 'from-amber-500 to-orange-600',
      accent: '#fcd34d',
    },
    {
      label: 'Confirmées',
      value: confirmed,
      icon: <HiOutlineCheckCircle className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-600',
      accent: '#6ee7b7',
    },
    {
      label: 'Revenus',
      value: `${revenue.toLocaleString()} DH`,
      icon: <HiOutlineCurrencyDollar className="w-5 h-5" />,
      gradient: 'from-green-600 to-green-700',
      accent: '#86efac',
    },
    {
      label: 'Utilisateurs',
      value: users.length,
      icon: <HiOutlineUsers className="w-5 h-5" />,
      gradient: 'from-blue-500 to-indigo-600',
      accent: '#93c5fd',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 text-white shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200`}
        >
          {/* Cercle décoratif */}
          <div
            className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10"
            style={{ backgroundColor: s.accent }}
          />
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            {s.icon}
          </div>
          <div className="text-2xl font-bold tracking-tight">{s.value}</div>
          <div className="text-xs mt-1 opacity-70 font-medium">{s.label}</div>
        </div>
      ))}
    </div>
  );
}