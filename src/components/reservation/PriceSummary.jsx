export default function PriceSummary({ calc, loading }) {
  if (loading) return (
    <div className="animate-pulse bg-gray-50 rounded-2xl p-5 space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded-lg w-full" />
      ))}
    </div>
  );

  if (!calc) return null;

  const rows = [
    { label: 'Durée',         value: `${calc.total_days} jour(s)`,    highlight: false },
    { label: 'Prix / jour',   value: `${calc.price_per_day} DH`,      highlight: false },
    { label: 'Prix total',    value: `${calc.total_price} DH`,        highlight: false },
    { label: 'Avance / jour', value: `${calc.advance_per_day} DH`,    highlight: false },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="bg-green-700 px-5 py-3">
        <p className="text-white text-sm font-semibold">Récapitulatif</p>
      </div>

      <div className="bg-white p-5 space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-500">{r.label}</span>
            <span className="font-semibold text-gray-800">{r.value}</span>
          </div>
        ))}

        {/* Séparateur */}
        <div className="border-t border-dashed border-gray-200 my-2" />

        {/* Avance à payer */}
        <div className="flex justify-between items-center bg-amber-50 rounded-xl px-4 py-3">
          <div>
            <p className="text-xs text-amber-600 font-medium">À payer maintenant</p>
            <p className="text-xs text-gray-400 mt-0.5">Avance requise</p>
          </div>
          <span className="text-2xl font-bold text-amber-600">
            {calc.advance_amount} DH
          </span>
        </div>

        {/* Reste */}
        <div className="flex justify-between text-sm px-1">
          <span className="text-gray-400">Reste à payer sur place</span>
          <span className="font-semibold text-gray-600">
            {calc.remaining_amount} DH
          </span>
        </div>
      </div>
    </div>
  );
}