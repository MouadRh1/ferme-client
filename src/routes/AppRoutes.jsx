import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home/Index";
import Reservation from "../pages/Reservation";
import Dashboard from "../pages/admin/Dashboard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Route privée : utilisateur connecté seulement
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center mt-20">Chargement...</div>;
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Route admin : admin seulement
function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="text-center mt-20">Chargement...</div>;
  return isAdmin() ? children : <Navigate to="/" />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes privées */}
        <Route
          path="/reservation"
          element={
            <PrivateRoute>
              <Reservation />
            </PrivateRoute>
          }
        />

        {/* Routes admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
