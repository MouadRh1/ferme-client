// src/components/FloatingNav.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, Camera, Mail, ChevronUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import api from "../api/axios";


export default function FloatingNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState("212612345678"); // Numéro par défaut
  const [farmName, setFarmName] = useState("Ferme Khadija");

  // Récupérer les informations de la ferme depuis l'API
  useEffect(() => {
    const fetchFarmInfo = async () => {
      try {
        const response = await api.get("/farm");
        if (response.data.farm) {
          // Récupérer le numéro WhatsApp
          if (response.data.farm.whatsapp) {
            // Nettoyer le numéro (enlever le + et les espaces)
            const cleanNumber = response.data.farm.whatsapp.replace(
              /[^0-9]/g,
              "",
            );
            setWhatsappNumber(cleanNumber);
          }
          if (response.data.farm.name) {
            setFarmName(response.data.farm.name);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des infos de la ferme:",
          error,
        );
        // Garder les valeurs par défaut
      }
    };

    fetchFarmInfo();
  }, []);

  // Gérer le scroll masquer/afficher la navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Navigation vers une page avec scroll en haut
  const navigateToPage = (path) => {
    if (location.pathname !== path) {
      navigate(path);
      // Scroll en haut après la navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }
  };

  // Bouton retour en haut
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bouton WhatsApp flottant avec le numéro dynamique
  const openWhatsApp = () => {
    const message = `Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20${encodeURIComponent(farmName)}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <>

      {/* Bouton retour en haut */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-green-700 hover:scale-110 ${
          window.scrollY > 300
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        style={{ transition: "all 0.3s ease" }}
      >
        <ChevronUp size={20} />
      </button>

      {/* Bouton WhatsApp flottant - numéro dynamique depuis l'API */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-green-600 hover:scale-110 group"
      >
        <FaWhatsapp size={24} />
        {/* Tooltip WhatsApp */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
          WhatsApp
        </span>
      </button>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}
