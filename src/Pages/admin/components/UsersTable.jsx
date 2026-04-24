// src/pages/admin/components/UsersTable.jsx
import { useState } from 'react';
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineUser } from 'react-icons/hi';

const fmt = (d) => new Date(d).toLocaleDateString('fr-FR');

export default function UsersTable({ users }) {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="font-semibold text-gray-800 text-base">Utilisateurs inscrits</h3>
          <p className="text-xs text-gray-400 mt-0.5">{users.length} compte(s) au total</p>
        </div>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-52"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              {['#', 'Utilisateur', 'Email', 'Rôle', 'Inscrit le', 'Réservations'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-300">
                  <div className="text-4xl mb-2">👤</div>
                  <p className="text-sm">Aucun utilisateur trouvé</p>
                </td>
              </tr>
            ) : filtered.map(u => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/70 transition">
                <td className="px-5 py-4 text-gray-300 font-mono text-xs">#{u.id}</td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: u.role === 'admin'
                          ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                          : 'linear-gradient(135deg, #059669, #047857)',
                        color: 'white'
                      }}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{u.name}</span>
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-500">{u.email}</td>

                <td className="px-5 py-4">
                  {u.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                      <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      <HiOutlineUser className="w-3.5 h-3.5" />
                      Utilisateur
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-gray-500 text-xs">
                  {u.created_at ? fmt(u.created_at) : '—'}
                </td>

                <td className="px-5 py-4">
                  <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {u.reservations_count ?? 0} rés.
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}