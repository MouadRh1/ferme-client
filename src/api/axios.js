import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ferme-api-production.up.railway.app/api', // URL de ton backend Laravel
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur : ajoute automatiquement le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : gère les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;