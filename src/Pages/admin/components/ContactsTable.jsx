// src/pages/admin/components/ContactsTable.jsx
import { useState, useEffect } from "react";
import {
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineMail,
  HiOutlineEye,
  HiOutlineReply,
  HiOutlineCheck,
  HiOutlineX,
} from "react-icons/hi";
import api from "../../../api/axios";

const statusConfig = {
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-700",
    icon: "⏳",
  },
  read: { label: "Lu", color: "bg-blue-100 text-blue-700", icon: "👁️" },
  replied: {
    label: "Répondu",
    color: "bg-green-100 text-green-700",
    icon: "✅",
  },
};

export default function ContactsTable() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, replied

  // Charger les contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/contacts");
      setContacts(response.data.contacts);
    } catch (error) {
      console.error("Erreur chargement contacts:", error);
      showToast("Erreur lors du chargement des messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Marquer comme lu
  const markAsRead = async (contact) => {
    if (contact.is_read) return;
    try {
      await api.get(`/admin/contacts/${contact.id}`);
      fetchContacts();
      showToast("Message marqué comme lu", "success");
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Supprimer un message
  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      fetchContacts();
      showToast("Message supprimé avec succès", "success");
    } catch (error) {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  // Répondre à un message
  const handleReply = async () => {
    if (!replyMessage.trim()) {
      showToast("Veuillez écrire une réponse", "error");
      return;
    }
    setReplyLoading(true);
    try {
      const res = await api.post(`/admin/contacts/${replyModal.id}/reply`, {
        reply_message: replyMessage,
      });

      // ✅ Succès avec email envoyé
      showToast(`✉️ Réponse envoyée à ${replyModal.email}`, "success");
      setReplyModal(null);
      setReplyMessage("");
      fetchContacts();
    } catch (error) {
      const msg = error.response?.data?.message || "Erreur lors de l'envoi";
      showToast(`❌ ${msg}`, "error");
    } finally {
      setReplyLoading(false);
    }
  };

  // Voir le détail du message
  const viewMessage = async (contact) => {
    setSelectedContact(contact);
    if (!contact.is_read) {
      await markAsRead(contact);
    }
  };

  // Filtrer les contacts
  const filteredContacts = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    if (filter === "unread") return matchSearch && !c.is_read;
    if (filter === "replied") return matchSearch && c.status === "replied";
    return matchSearch;
  });

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-slide-in ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-gray-900 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              📬 Messages de contact
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount} non lus
                </span>
              )}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Gérez les demandes de renseignements
            </p>
          </div>

          {/* Recherche */}
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold w-52"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "all"
                ? "bg-gold text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Tous ({contacts.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "unread"
                ? "bg-gold text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Non lus ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("replied")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "replied"
                ? "bg-gold text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Répondus ({contacts.filter((c) => c.status === "replied").length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Expéditeur
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Sujet
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Message
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-400">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-sm">Aucun message trouvé</p>
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition cursor-pointer ${
                    !contact.is_read ? "bg-yellow-50/30" : ""
                  }`}
                  onClick={() => viewMessage(contact)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {statusConfig[contact.status]?.icon || "📧"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusConfig[contact.status]?.color
                        }`}
                      >
                        {statusConfig[contact.status]?.label || contact.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-800">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-400">{contact.email}</p>
                      {contact.phone && (
                        <p className="text-xs text-gray-400">{contact.phone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-700 max-w-xs truncate">
                      {contact.subject}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-500 text-sm max-w-md truncate">
                      {contact.message}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {new Date(contact.created_at).toLocaleDateString("fr-FR")}
                    <br />
                    <span className="text-xs text-gray-400">
                      {new Date(contact.created_at).toLocaleTimeString("fr-FR")}
                    </span>
                  </td>
                  <td
                    className="px-5 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => viewMessage(contact)}
                        title="Voir le message"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setReplyModal(contact);
                          setReplyMessage("");
                        }}
                        title="Répondre"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition"
                      >
                        <HiOutlineReply className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        title="Supprimer"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Détail du message */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Détail du message
              </h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
              >
                <HiOutlineX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">
                    Nom
                  </label>
                  <p className="text-gray-800">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">
                    Email
                  </label>
                  <p className="text-gray-800">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase">
                      Téléphone
                    </label>
                    <p className="text-gray-800">{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">
                    Date
                  </label>
                  <p className="text-gray-800">
                    {new Date(selectedContact.created_at).toLocaleString(
                      "fr-FR",
                    )}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Sujet
                </label>
                <p className="text-gray-800 font-medium">
                  {selectedContact.subject}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Message
                </label>
                <div className="bg-gray-50 rounded-xl p-4 mt-1">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setReplyModal(selectedContact);
                    setSelectedContact(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gold text-white font-semibold hover:opacity-90 transition"
                >
                  <HiOutlineReply className="inline mr-2 w-4 h-4" />
                  Répondre
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedContact.id);
                    setSelectedContact(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition"
                >
                  <HiOutlineTrash className="inline mr-2 w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Réponse */}
      {replyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setReplyModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Répondre à {replyModal.name}
              </h3>
              <button
                onClick={() => setReplyModal(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <HiOutlineX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email du destinataire
                </label>
                <p className="text-gray-600 text-sm mt-1">{replyModal.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Votre réponse
                </label>
                <textarea
                  rows={6}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  placeholder="Écrivez votre réponse ici..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setReplyModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReply}
                  disabled={replyLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gold text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {replyLoading ? "Envoi..." : "Envoyer la réponse"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        .bg-gold {
          background-color: var(--gold);
        }
        .focus\\:ring-gold:focus {
          --tw-ring-color: var(--gold);
        }
      `}</style>
    </div>
  );
}
