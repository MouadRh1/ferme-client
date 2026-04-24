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

  // Stripe
  const [clientSecret, setClientSecret] = useState("");
  const [reservationId, setReservationId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

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
        farm_id: 1,
        start_date: startDate,
        end_date: endDate,
        payment_method: "card",
      });
      setClientSecret(res.data.client_secret);
      setReservationId(res.data.reservation_id);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur Stripe");
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
    formData.append("farm_id", 1);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("payment_method", "bank_transfer");
    formData.append("payment_proof", proofFile);

    try {
      await reservationApi.createBankTransfer(formData);
      setConfirmed(true);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la réservation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="max-w-2xl mx-auto space-y-6 pt-16 lg:pt-20">
        {/* ── Header ──────────────────────────────── */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-px"
              style={{ backgroundColor: "var(--gold)" }}
            />
            <span
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: "var(--gold)" }}
            >
              Réservation
            </span>
            <div
              className="w-8 h-px"
              style={{ backgroundColor: "var(--gold)" }}
            />
          </div>
          <h1
            className="font-display text-4xl font-light"
            style={{ color: "var(--green-deep)" }}
          >
            Réserver votre séjour
          </h1>
          <p className="text-sm mt-2" style={{ color: "rgba(26,58,42,0.6)" }}>
            Bonjour{" "}
            <strong style={{ color: "var(--gold)" }}>{user?.name}</strong>,
            complétez votre réservation
          </p>
        </div>

        {/* ── Stepper ─────────────────────────────── */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
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
                    i === step ? `0 0 0 4px rgba(201,169,110,0.2)` : "none",
                }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
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
            className="border rounded-xl px-4 py-3 text-sm flex items-start gap-2"
            style={{
              backgroundColor: "rgba(220,38,38,0.1)",
              borderColor: "rgba(220,38,38,0.2)",
              color: "#dc2626",
            }}
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/* ÉTAPE 0 : Sélection des dates             */}
        {/* ══════════════════════════════════════════ */}
        {step === 0 && (
          <div
            className="rounded-2xl border shadow-sm p-6 space-y-5"
            style={{
              backgroundColor: "white",
              borderColor: "rgba(26,58,42,0.08)",
            }}
          >
            <h2
              className="font-semibold flex items-center gap-2"
              style={{ color: "var(--green-deep)" }}
            >
              <Calendar size={18} style={{ color: "var(--gold)" }} />
              Choisissez vos dates
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
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
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: "rgba(26,58,42,0.15)",
                    focusRingColor: "var(--gold)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
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
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
                  style={{ borderColor: "rgba(26,58,42,0.15)" }}
                />
              </div>
            </div>

            {/* Dates bloquées */}
            {bookedDates.length > 0 && (
              <div
                className="rounded-xl p-3"
                style={{
                  backgroundColor: "rgba(220,38,38,0.05)",
                  border: "1px solid rgba(220,38,38,0.1)",
                }}
              >
                <p
                  className="text-xs font-semibold mb-2"
                  style={{ color: "#dc2626" }}
                >
                  🚫 Dates indisponibles
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {bookedDates.map((d, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-lg"
                      style={{
                        backgroundColor: "rgba(220,38,38,0.1)",
                        color: "#dc2626",
                      }}
                    >
                      {new Date(d.start_date).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(d.end_date).toLocaleDateString("fr-FR")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Calcul */}
            {calcError && <p className="text-red-500 text-xs">{calcError}</p>}
            <PriceSummary calc={calc} loading={calcLoading} />

            <button
              onClick={handleDateNext}
              disabled={!startDate || !endDate || calcLoading}
              className="w-full text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--gold)",
                color: "var(--green-deep)",
              }}
            >
              Continuer vers le paiement
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/* ÉTAPE 1 : Choix du paiement               */}
        {/* ══════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Récap */}
            <PriceSummary calc={calc} loading={false} />

            {/* Choix méthode */}
            <div
              className="rounded-2xl border shadow-sm p-6 space-y-5"
              style={{
                backgroundColor: "white",
                borderColor: "rgba(26,58,42,0.08)",
              }}
            >
              <h2
                className="font-semibold"
                style={{ color: "var(--green-deep)" }}
              >
                Méthode de paiement
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    key: "card",
                    label: "Carte bancaire",
                    icon: CreditCard,
                    sub: "Paiement sécurisé",
                  },
                  {
                    key: "bank_transfer",
                    label: "Virement bancaire",
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
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
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
                      className={`mb-2 ${paymentMethod === m.key ? "text-gold" : "text-gray-400"}`}
                    >
                      <m.icon
                        size={20}
                        style={
                          paymentMethod === m.key
                            ? { color: "var(--gold)" }
                            : {}
                        }
                      />
                    </div>
                    <p
                      className={`text-sm font-semibold ${paymentMethod === m.key ? "text-gold" : "text-gray-700"}`}
                    >
                      {m.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
                  </button>
                ))}
              </div>

              {/* ── Paiement carte ── */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  {!clientSecret ? (
                    <button
                      onClick={handleCardSubmit}
                      disabled={submitting}
                      className="w-full text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                      style={{
                        backgroundColor: "var(--gold)",
                        color: "var(--green-deep)",
                      }}
                    >
                      {submitting ? "⏳ Préparation..." : "💳 Payer par carte"}
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
                <div className="space-y-4">
                  <BankTransferPayment
                    advanceAmount={calc?.advance_amount}
                    onFileSelect={setProofFile}
                    selectedFile={proofFile}
                  />
                  <button
                    onClick={handleBankSubmit}
                    disabled={submitting || !proofFile}
                    className="w-full text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--gold)",
                      color: "var(--green-deep)",
                    }}
                  >
                    {submitting
                      ? "⏳ Envoi en cours..."
                      : "✅ Confirmer la réservation"}
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setStep(0);
                  setClientSecret("");
                  setError("");
                }}
                className="w-full py-2 text-sm transition flex items-center justify-center gap-1"
                style={{ color: "rgba(26,58,42,0.5)" }}
              >
                <ArrowLeft size={14} />
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
            className="rounded-2xl border shadow-sm p-10 text-center space-y-5"
            style={{
              backgroundColor: "white",
              borderColor: "rgba(26,58,42,0.08)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: "rgba(201,169,110,0.1)" }}
            >
              <CheckCircle size={36} style={{ color: "var(--gold)" }} />
            </div>

            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--green-deep)" }}
              >
                Réservation envoyée !
              </h2>
              <p
                className="text-sm mt-2 max-w-sm mx-auto"
                style={{ color: "rgba(26,58,42,0.6)" }}
              >
                {paymentMethod === "card"
                  ? "Votre paiement a été accepté. Votre réservation est confirmée."
                  : "Votre preuve de virement a été envoyée. Vous recevrez une confirmation après validation."}
              </p>
            </div>

            {/* Récap final */}
            {calc && (
              <div
                className="rounded-xl p-4 text-sm space-y-2 text-left max-w-xs mx-auto"
                style={{ backgroundColor: "rgba(201,169,110,0.05)" }}
              >
                <div className="flex justify-between">
                  <span style={{ color: "rgba(26,58,42,0.6)" }}>Dates</span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--green-deep)" }}
                  >
                    {new Date(startDate).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(endDate).toLocaleDateString("fr-FR")}
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
                  <span style={{ color: "rgba(26,58,42,0.6)" }}>
                    Avance payée
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--gold)" }}
                  >
                    {calc.advance_amount} DH
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 rounded-xl border text-sm font-medium transition"
                style={{
                  borderColor: "rgba(26,58,42,0.15)",
                  color: "rgba(26,58,42,0.7)",
                }}
              >
                Retour à l'accueil
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
                className="px-6 py-2.5 rounded-xl text-sm font-medium transition hover:opacity-90"
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
