import api from './axios';

export const reservationApi = {

  // Calcul dynamique
  calculate: (startDate, endDate) =>
    api.get('/calculate', { params: { start_date: startDate, end_date: endDate } }),

  // Dates réservées
  bookedDates: (farmId = 1) =>
    api.get('/reservations/booked-dates', { params: { farm_id: farmId } }),

  // Créer réservation virement
  createBankTransfer: (formData) =>
    api.post('/reservations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Stripe : créer intent
  createStripeIntent: (data) =>
    api.post('/stripe/create-intent', data),

  // Stripe : confirmer paiement
  confirmStripe: (reservationId) =>
    api.post(`/stripe/confirm/${reservationId}`),

  // Upload preuve
  uploadProof: (reservationId, file) => {
    const fd = new FormData();
    fd.append('payment_proof', file);
    return api.post(`/reservations/${reservationId}/upload-proof`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Mes réservations
  myReservations: () => api.get('/reservations'),

  // Toutes (admin)
  all: (status = null) =>
    api.get('/reservations', { params: status ? { payment_status: status } : {} }),

  // Changer statut (admin)
  updateStatus: (id, payment_status) =>
    api.put(`/reservations/${id}/status`, { payment_status }),

  // Supprimer (admin)
  remove: (id) => api.delete(`/reservations/${id}`),
};