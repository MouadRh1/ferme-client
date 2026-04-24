import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Créer le context
const AuthContext = createContext(null);

// Provider : englobe toute l'app
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Au démarrage, récupérer l'utilisateur si token existe
  useEffect(() => {
    if (token) {
      api.get('/me')
        .then(res => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Connexion
  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    const { user, token } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);

    return user; // Retourne l'user pour rediriger selon le rôle
  };

  // Inscription
  const register = async (name, email, password, password_confirmation) => {
    const res = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    const { user, token } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);

    return user;
  };

  // Déconnexion
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // Même si l'API échoue, on déconnecte côté client
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Helpers
  const isAdmin = () => user?.role === 'admin';
  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout,
      isAdmin, isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le context facilement
export function useAuth() {
  return useContext(AuthContext);
}