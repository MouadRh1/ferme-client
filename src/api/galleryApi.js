import api from './axios';

export const galleryApi = {
  // Public
  getAll: ()         => api.get('/gallery'),
  like:   (id)       => api.post(`/gallery/${id}/like`),

  // Admin
  adminGetAll: ()    => api.get('/admin/gallery'),

  add: (formData)    => api.post('/admin/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  update: (id, formData) => api.post(`/admin/gallery/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  remove: (id)       => api.delete(`/admin/gallery/${id}`),
};