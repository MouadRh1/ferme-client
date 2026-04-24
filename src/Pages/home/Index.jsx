// src/pages/home/index.jsx
import { useState, useEffect } from "react";
import api from "../../api/axios";
import HeroSection from "./HeroSection";
import FarmInfo from "./FarmInfo";
import AmenitiesSection from "./AmenitiesSection";
import PricingSection from "./PricingSection";
import CTASection from "./CTASection";
import GallerySection from "./GallerySection";

export default function Home() {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/farm")
      .then((res) => setFarm(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--green-deep)" }}
      >
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🌾</div>
          <p className="font-display text-2xl text-white font-light italic">
            Ferme Khadija
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <HeroSection />
      <GallerySection/>
      <FarmInfo farm={farm} />
      <AmenitiesSection farm={farm} />
      <PricingSection farm={farm} />
      <CTASection />
    </main>
  );
}
