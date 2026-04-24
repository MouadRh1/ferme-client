// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineViewGrid,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineLogin,
  HiOutlineUserAdd,
  HiMenu,
  HiX,
} from "react-icons/hi";
import { PiFlowerLotus } from "react-icons/pi";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Détecter le scroll pour changer le style de la navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer le menu mobile si on change de page
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // ── Liens de navigation ──────────────────────────
  const navLinks = [
    {
      to: "/",
      label: "Accueil",
      icon: <HiOutlineHome className="w-4 h-4" />,
      always: true,
    },
    {
      to: "/reservation",
      label: "Réserver",
      icon: <HiOutlineCalendar className="w-4 h-4" />,
      auth: true,
    },
    {
      to: "/admin",
      label: "Dashboard",
      icon: <HiOutlineViewGrid className="w-4 h-4" />,
      admin: true,
    },
  ].filter((l) => {
    if (l.admin) return isAdmin();
    if (l.auth) return isAuthenticated();
    return true;
  });

  return (
    <>
      {/* ── NAVBAR ───────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-2 shadow-xl" : "py-4"
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(26,58,42,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          background: scrolled
            ? "rgba(26,58,42,0.97)"
            : "linear-gradient(to bottom, rgba(26,58,42,0.85), transparent)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          {/* ── LOGO ─────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300"
              style={{ backgroundColor: "var(--gold, #c9a96e)" }}
            >
              <PiFlowerLotus
                className="w-5 h-5"
                style={{ color: "var(--green-deep, #1a3a2a)" }}
              />
            </div>
            <div className="leading-none">
              <span
                className="block text-white font-semibold text-sm tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Ferme Khadija
              </span>
              <span
                className="block text-xs tracking-widest uppercase"
                style={{ color: "rgba(201,169,110,0.7)", fontSize: "9px" }}
              >
                Domaine Privé
              </span>
            </div>
          </Link>

          {/* ── LIENS DESKTOP ────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                style={
                  isActive(link.to)
                    ? {
                        backgroundColor: "rgba(201,169,110,0.2)",
                        color: "#c9a96e",
                      }
                    : {}
                }
              >
                {link.icon}
                {link.label}
                {isActive(link.to) && (
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: "#c9a96e" }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── ACTIONS DESKTOP ──────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated() ? (
              <>
                {/* User pill */}
                <div
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: "var(--gold, #c9a96e)",
                      color: "#1a3a2a",
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-medium truncate max-w-[120px]">
                    {user?.name}
                  </span>
                  {isAdmin() && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md font-semibold"
                      style={{
                        backgroundColor: "rgba(201,169,110,0.2)",
                        color: "#c9a96e",
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>

                {/* Déconnexion */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-red-500/20 transition-all duration-200"
                >
                  <HiOutlineLogout className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <HiOutlineLogin className="w-4 h-4" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: "var(--gold, #c9a96e)",
                    color: "#1a3a2a",
                  }}
                >
                  <HiOutlineUserAdd className="w-4 h-4" />
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* ── BURGER MOBILE ────────────────────────── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            {menuOpen ? (
              <HiX className="w-5 h-5" />
            ) : (
              <HiMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* ── MENU MOBILE ──────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: "var(--green-deep, #1a3a2a)" }}
        >
          {/* Header du panel */}
          <div
            className="flex items-center justify-between px-5 py-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--gold, #c9a96e)" }}
              >
                <PiFlowerLotus
                  className="w-4 h-4"
                  style={{ color: "#1a3a2a" }}
                />
              </div>
              <span
                className="text-white font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Ferme Khadija
              </span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>

          {/* User info mobile */}
          {isAuthenticated() && (
            <div
              className="mx-4 my-4 p-4 rounded-2xl"
              style={{
                backgroundColor: "rgba(201,169,110,0.1)",
                border: "1px solid rgba(201,169,110,0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow"
                  style={{
                    backgroundColor: "var(--gold, #c9a96e)",
                    color: "#1a3a2a",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {user?.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(201,169,110,0.7)" }}
                  >
                    {isAdmin() ? "👑 Administrateur" : "👤 Utilisateur"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Liens */}
          <div className="px-3 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-white"
                    : "text-white/70 hover:text-white hover:bg-white/8"
                }`}
                style={
                  isActive(link.to)
                    ? {
                        backgroundColor: "rgba(201,169,110,0.15)",
                        color: "#c9a96e",
                      }
                    : {}
                }
              >
                <span className="opacity-80">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions bas du panel */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 space-y-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {isAuthenticated() ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <HiOutlineLogout className="w-4 h-4" />
                Déconnexion
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <HiOutlineLogin className="w-4 h-4" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "var(--gold, #c9a96e)",
                    color: "#1a3a2a",
                  }}
                >
                  <HiOutlineUserAdd className="w-4 h-4" />
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ SUPPRIMÉ : plus de div h-16 qui créait l'espace */}
    </>
  );
}
