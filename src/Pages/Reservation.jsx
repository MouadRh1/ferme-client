// src/pages/Reservation.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCalculator } from "../hooks/useCalculator";
import { reservationApi } from "../api/reservationApi";
import PriceSummary from "../components/reservation/PriceSummary";
import StripePayment from "../components/reservation/StripePayment";
import BankTransferPayment from "../components/reservation/BankTransferPayment";
import {
  Calendar,
  CreditCard,
  Landmark,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import api from "../api/axios";

// ── Étapes du formulaire ──────────────────────────
const STEPS = ["Dates", "Paiement", "Confirmation"];

export default function Reservation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [proofFile, setProofFile] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [farm, setFarm] = useState(null);
  const [farmId, setFarmId] = useState(null);

  // Stripe
  const [clientSecret, setClientSecret] = useState("");
  const [reservationId, setReservationId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  // ── Charger les informations de la ferme ─────────
  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const response = await api.get("/farm");
        setFarm(response.data.farm);
        setFarmId(response.data.farm?.id); // ← Important !
        console.log(response.data.farm.farmId)
      } catch (error) {
        console.error("Erreur chargement ferme:", error);
      }
    };
    fetchFarm();
  }, []);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  // ── Calcul dynamique ──────────────────────────────
  const {
    calc,
    loading: calcLoading,
    error: calcError,
  } = useCalculator(startDate, endDate);

  // ── Charger les dates bloquées ────────────────────
  useEffect(() => {
    reservationApi.bookedDates(1).then((r) => setBookedDates(r.data));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // ── Vérifier conflits de dates ────────────────────
  const hasConflict = () => {
    if (!startDate || !endDate) return false;
    return bookedDates.some(({ start_date, end_date }) => {
      const s = new Date(start_date);
      const e = new Date(end_date);
      const a = new Date(startDate);
      const b = new Date(endDate);
      return a <= e && b >= s;
    });
  };

  // ── Étape 1 → 2 : valider les dates ──────────────
  const handleDateNext = () => {
    setError("");
    if (!startDate || !endDate) return setError("Sélectionnez les deux dates.");
    if (new Date(endDate) <= new Date(startDate))
      return setError("La date de fin doit être après le début.");
    if (hasConflict()) return setError("Ces dates sont déjà réservées.");
    if (!calc) return setError("Calcul en cours, attendez...");
    setStep(1);
  };

  // ── Soumettre paiement carte ──────────────────────
  const handleCardSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await reservationApi.createStripeIntent({
        farm_id: farmId.toString(),
        start_date: startDate,
        end_date: endDate,
        payment_method: "card",
      });
      setClientSecret(res.data.farm.client_secret);
      setReservationId(res.data.farm.reservation_id);
    } catch (err) {
      setError(err.response?.data.farm?.message || "Erreur Stripe");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Succès Stripe ─────────────────────────────────
  const handleStripeSuccess = async (resId) => {
    try {
      await reservationApi.confirmStripe(resId);
      setConfirmed(true);
      setStep(2);
    } catch {
      setError("Paiement validé mais erreur de confirmation. Contactez-nous.");
    }
  };

  // ── Soumettre virement ────────────────────────────
  const handleBankSubmit = async () => {
    setError("");
    if (!proofFile) return setError("Veuillez joindre la preuve de virement.");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("farm_id", farmId.toString());
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("payment_method", "bank_transfer");
    formData.append("payment_proof", proofFile);
    console.log(farmId.toString())
    try {
      await reservationApi.createBankTransfer(formData);
      setConfirmed(true);
      setStep(2);
    } catch (err) {
      setError(err.response?.data.farm?.message || "Erreur lors de la réservation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--cream)" }}
    >
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: farm?.image
                ? `url(${farm.image})`
                : 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
              backgroundPosition: "center 30%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4), var(--green-deep) 90%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full text-center text-white px-6">
          <h1 className="font-display text-5xl md:text-6xl font-light mb-4">
            Réserver votre{" "}
            <span className="font-semibold" style={{ color: "var(--gold)" }}>
              séjour
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Complétez vos informations pour réserver votre séjour à la Ferme Khadija
          </p>
        </div>
      </section>

      {/* ==================== FORMULAIRE ==================== */}
      <div className="max-w-2xl mx-auto space-y-6 py-12 px-4 sm:px-6">
        {/* ── Header ──────────────────────────────── */}
        <div className="text-center px-2">
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-6 h-px sm:w-8"
              style={{ backgroundColor: "var(--gold)" }}
            />
            <span
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: "var(--gold)" }}
            >
              Réservation
            </span>
            <div
              className="w-6 h-px sm:w-8"
              style={{ backgroundColor: "var(--gold)" }}
            />
          </div>
          <h2
            className="font-display text-2xl sm:text-3xl font-light"
            style={{ color: "var(--green-deep)" }}
          >
            Complétez votre réservation
          </h2>
          <p
            className="text-xs sm:text-sm mt-2 px-4"
            style={{ color: "rgba(26,58,42,0.6)" }}
          >
            Bonjour{" "}
            <strong style={{ color: "var(--gold)" }}>{user?.name}</strong>,
            veuillez remplir le formulaire ci-dessous
          </p>
        </div>

        {/* ── Stepper (version mobile compacte) ────── */}
        <div className="flex items-center gap-1 sm:gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-1 sm:gap-2 flex-1">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  i < step
                    ? "text-white"
                    : i === step
                      ? "text-white ring-4"
                      : ""
                }`}
                style={{
                  backgroundColor:
                    i < step || i === step ? "var(--gold)" : "#e5e7eb",
                  color:
                    i < step || i === step ? "var(--green-deep)" : "#9ca3af",
                  boxShadow:
                    i === step ? `0 0 0 3px rgba(201,169,110,0.2)` : "none",
                }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium hidden xs:block ${
                  i === step ? "font-semibold" : ""
                }`}
                style={{
                  color: i === step ? "var(--gold)" : "rgba(26,58,42,0.4)",
                }}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-full ${
                    i < step ? "bg-gold" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor: i < step ? "var(--gold)" : "#e5e7eb",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Erreur globale ───────────────────────── */}
        {error && (
          <div
            className="border rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm flex items-start gap-2 mx-2 sm:mx-0"
            style={{
              backgroundColor: "rgba(220,38,38,0.1)",
              borderColor: "rgba(220,38,38,0.2)",
              color: "#dc2626",
            }}
          >
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span className="break-words">{error}</span>
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/* ÉTAPE 0 : Sélection des dates             */}
        {/* ══════════════════════════════════════════ */}
        {step === 0 && (
          <div
            className="rounded-2xl border shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5 mx-2 sm:mx-0"
            style={{
              backgroundColor: "white",
              borderColor: "rgba(26,58,42,0.08)",
            }}
          >
            <h2
              className="font-semibold flex items-center gap-2 text-base sm:text-lg"
              style={{ color: "var(--green-deep)" }}
            >
              <Calendar size={18} style={{ color: "var(--gold)" }} />
              Choisissez vos dates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "rgba(26,58,42,0.6)" }}
                >
                  Date d'arrivée
                </label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setError("");
                  }}
                  className="w-full border rounded-xl px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: "rgba(26,58,42,0.15)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "rgba(26,58,42,0.6)" }}
                >
                  Date de départ
                </label>
                <input
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setError("");
                  }}
                  className="w-full border rounded-xl px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 transition"
                  style={{ borderColor: "rgba(26,58,42,0.15)" }}
                />
              </div>
            </div>

            {/* Dates bloquées */}
            {bookedDates.length > 0 && (
              <div
                className="rounded-xl p-2 sm:p-3"
                style={{
                  backgroundColor: "rgba(220,38,38,0.05)",
                  border: "1px solid rgba(220,38,38,0.1)",
                }}
              >
                <p
                  className="text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2"
                  style={{ color: "#dc2626" }}
                >
                  🚫 Dates indisponibles
                </p>
                <div className="flex flex-wrap gap-1">
                  {bookedDates.slice(0, 4).map((d, i) => (
                    <span
                      key={i}
                      className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-lg"
                      style={{
                        backgroundColor: "rgba(220,38,38,0.1)",
                        color: "#dc2626",
                      }}
                    >
                      {new Date(d.start_date).toLocaleDateString("fr-FR")}
                    </span>
                  ))}
                  {bookedDates.length > 4 && (
                    <span
                      className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-lg"
                      style={{
                        backgroundColor: "rgba(220,38,38,0.1)",
                        color: "#dc2626",
                      }}
                    >
                      +{bookedDates.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Calcul */}
            {calcError && <p className="text-red-500 text-xs">{calcError}</p>}
            <PriceSummary calc={calc} loading={calcLoading} />

            <button
              onClick={handleDateNext}
              disabled={!startDate || !endDate || calcLoading}
              className="w-full py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--gold)",
                color: "var(--green-deep)",
              }}
            >
              Continuer
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/* ÉTAPE 1 : Choix du paiement               */}
        {/* ══════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-3 sm:space-y-4 mx-2 sm:mx-0">
            {/* Récap */}
            <PriceSummary calc={calc} loading={false} />

            {/* Choix méthode */}
            <div
              className="rounded-2xl border shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5"
              style={{
                backgroundColor: "white",
                borderColor: "rgba(26,58,42,0.08)",
              }}
            >
              <h2
                className="font-semibold text-base sm:text-lg"
                style={{ color: "var(--green-deep)" }}
              >
                Paiement
              </h2>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  {
                    key: "card",
                    label: "Carte",
                    icon: CreditCard,
                    sub: "Sécurisé",
                  },
                  {
                    key: "bank_transfer",
                    label: "Virement",
                    icon: Landmark,
                    sub: "RIB fourni",
                  },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => {
                      setPaymentMethod(m.key);
                      setClientSecret("");
                      setError("");
                    }}
                    className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === m.key
                        ? "border-gold"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={
                      paymentMethod === m.key
                        ? {
                            borderColor: "var(--gold)",
                            backgroundColor: "rgba(201,169,110,0.05)",
                          }
                        : {}
                    }
                  >
                    <div
                      className={`mb-1 sm:mb-2 ${paymentMethod === m.key ? "text-gold" : "text-gray-400"}`}
                    >
                      <m.icon
                        size={16}
                        style={
                          paymentMethod === m.key
                            ? { color: "var(--gold)" }
                            : {}
                        }
                      />
                    </div>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${paymentMethod === m.key ? "text-gold" : "text-gray-700"}`}
                    >
                      {m.label}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                      {m.sub}
                    </p>
                  </button>
                ))}
              </div>

              {/* ── Paiement carte ── */}
              {paymentMethod === "card" && (
                <div className="space-y-3 sm:space-y-4">
                  {!clientSecret ? (
                    <button
                      onClick={handleCardSubmit}
                      disabled={submitting}
                      className="w-full py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                      style={{
                        backgroundColor: "var(--gold)",
                        color: "var(--green-deep)",
                      }}
                    >
                      {submitting ? "⏳ Préparation..." : "💳 Payer"}
                    </button>
                  ) : (
                    <StripePayment
                      clientSecret={clientSecret}
                      reservationId={reservationId}
                      advanceAmount={calc?.advance_amount}
                      onSuccess={handleStripeSuccess}
                      onError={(msg) => setError(msg)}
                    />
                  )}
                </div>
              )}

              {/* ── Virement ── */}
              {paymentMethod === "bank_transfer" && (
                <div className="space-y-3 sm:space-y-4">
                  <BankTransferPayment
                    advanceAmount={calc?.advance_amount}
                    onFileSelect={setProofFile}
                    selectedFile={proofFile}
                  />
                  <button
                    onClick={handleBankSubmit}
                    disabled={submitting || !proofFile}
                    className="w-full py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--gold)",
                      color: "var(--green-deep)",
                    }}
                  >
                    {submitting ? "⏳ Envoi..." : "✅ Confirmer"}
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setStep(0);
                  setClientSecret("");
                  setError("");
                }}
                className="w-full py-2 text-xs sm:text-sm transition flex items-center justify-center gap-1"
                style={{ color: "rgba(26,58,42,0.5)" }}
              >
                <ArrowLeft size={12} />
                Modifier les dates
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/* ÉTAPE 2 : Confirmation                    */}
        {/* ══════════════════════════════════════════ */}
        {step === 2 && confirmed && (
          <div
            className="rounded-2xl border shadow-sm p-6 sm:p-10 text-center space-y-4 sm:space-y-5 mx-2 sm:mx-0"
            style={{
              backgroundColor: "white",
              borderColor: "rgba(26,58,42,0.08)",
            }}
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
            >
              <CheckCircle size={28} style={{ color: "var(--gold)" }} />
            </div>

            <div>
              <h2
                className="text-lg sm:text-xl font-bold"
                style={{ color: "var(--green-deep)" }}
              >
                Réservation envoyée !
              </h2>
              <p
                className="text-xs sm:text-sm mt-2 max-w-sm mx-auto px-2"
                style={{ color: "rgba(26,58,42,0.6)" }}
              >
                {paymentMethod === "card"
                  ? "Votre paiement a été accepté. Réservation confirmée."
                  : "Preuve envoyée. Confirmation après validation."}
              </p>
            </div>

            {/* Récap final */}
            {calc && (
              <div
                className="rounded-xl p-3 sm:p-4 text-xs sm:text-sm space-y-2 text-left max-w-xs mx-auto w-full"
                style={{ backgroundColor: "rgba(201,169,110,0.05)" }}
              >
                <div className="flex justify-between">
                  <span style={{ color: "rgba(26,58,42,0.6)" }}>Dates</span>
                  <span
                    className="font-medium text-xs sm:text-sm"
                    style={{ color: "var(--green-deep)" }}
                  >
                    {new Date(startDate).toLocaleDateString("fr-FR")} → {new Date(endDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(26,58,42,0.6)" }}>Total</span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--green-deep)" }}
                  >
                    {calc.total_price} DH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(26,58,42,0.6)" }}>Avance</span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--gold)" }}
                  >
                    {calc.advance_amount} DH
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-4 sm:px-6 py-2 rounded-xl border text-xs sm:text-sm font-medium transition order-2 sm:order-1"
                style={{
                  borderColor: "rgba(26,58,42,0.15)",
                  color: "rgba(26,58,42,0.7)",
                }}
              >
                Accueil
              </button>
              <button
                onClick={() => {
                  setStep(0);
                  setStartDate("");
                  setEndDate("");
                  setProofFile(null);
                  setConfirmed(false);
                  setClientSecret("");
                }}
                className="px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium transition hover:opacity-90 order-1 sm:order-2"
                style={{
                  backgroundColor: "var(--gold)",
                  color: "var(--green-deep)",
                }}
              >
                Nouvelle réservation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}