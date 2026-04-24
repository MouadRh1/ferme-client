import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialiser Stripe une seule fois
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ── Formulaire de carte ───────────────────────────
function CardForm({ clientSecret, reservationId, advanceAmount, onSuccess, onError }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // Confirmer le paiement Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        onError(error.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(reservationId);
      }
    } catch (err) {
      onError('Erreur inattendue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Montant */}
      <div className="bg-green-50 rounded-xl p-4 flex justify-between items-center">
        <span className="text-sm text-green-700 font-medium">Montant à débiter</span>
        <span className="text-xl font-bold text-green-700">{advanceAmount} DH</span>
      </div>

      {/* Champ carte Stripe */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Informations de carte
        </label>
        <div className="border-2 border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-green-500 transition-colors">
          <CardElement options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#1f2937',
                fontFamily: 'DM Sans, sans-serif',
                '::placeholder': { color: '#9ca3af' },
              },
              invalid: { color: '#ef4444' },
            },
          }} />
        </div>
      </div>

      {/* Info test */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-600">
        <p className="font-semibold mb-1">🧪 Mode test Stripe</p>
        <p>Carte : <strong>4242 4242 4242 4242</strong></p>
        <p>Date : n'importe quelle date future · CVC : n'importe quel chiffre</p>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Traitement en cours...
          </>
        ) : (
          `💳 Payer ${advanceAmount} DH`
        )}
      </button>
    </form>
  );
}

// ── Wrapper avec Elements ─────────────────────────
export default function StripePayment({ clientSecret, reservationId, advanceAmount, onSuccess, onError }) {
  if (!clientSecret) return null;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CardForm
        clientSecret={clientSecret}
        reservationId={reservationId}
        advanceAmount={advanceAmount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}