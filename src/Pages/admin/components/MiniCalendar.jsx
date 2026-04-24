// src/pages/admin/components/MiniCalendar.jsx
import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function MiniCalendar({ reservations }) {
  const [current, setCurrent] = useState(new Date());
  const [tooltip, setTooltip] = useState(null); // { x, y, reservations[] }

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Retourne les réservations actives pour un jour donné
  const getDayReservations = (day) => {
    if (!day) return [];
    const date = new Date(year, month, day);
    return reservations.filter((r) => {
      if (r.status === "cancelled") return false;
      const s = new Date(r.start_date);
      const e = new Date(r.end_date);
      // Normaliser sans heures
      s.setHours(0, 0, 0, 0);
      e.setHours(23, 59, 59, 999);
      return date >= s && date <= e;
    });
  };

  const isToday = (day) => {
    const t = new Date();
    return (
      day === t.getDate() && month === t.getMonth() && year === t.getFullYear()
    );
  };

  // Stats du mois
  const totalReservedDays = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1,
  ).filter((d) => getDayReservations(d).length > 0).length;

  const occupancyPct = Math.round((totalReservedDays / daysInMonth) * 100);

  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handleMouseEnter = (e, day) => {
    const dayRes = getDayReservations(day);
    if (dayRes.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ x: rect.left + rect.width / 2, y: rect.top, items: dayRes });
  };

  const handleMouseLeave = () => setTooltip(null);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  return (
    <>
      {/* ── Tooltip ───────────────────────────────────────── */}
      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="rounded-2xl shadow-2xl overflow-hidden min-w-[180px]"
            style={{
              background: "linear-gradient(135deg, #0f2419 0%, #1a3a2a 100%)",
              border: "1px solid rgba(201,169,110,0.25)",
            }}
          >
            {/* Pointe */}
            <div
              className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rotate-45"
              style={{
                background: "#1a3a2a",
                borderRight: "1px solid rgba(201,169,110,0.25)",
                borderBottom: "1px solid rgba(201,169,110,0.25)",
              }}
            />

            <div className="px-3.5 py-2.5 space-y-2">
              {tooltip.items.map((r, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: "rgba(201,169,110,0.2)",
                      color: "#c9a96e",
                    }}
                  >
                    {r.user?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold truncate max-w-[120px]">
                      {r.user?.name || "Inconnu"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(201,169,110,0.7)" }}
                    >
                      {fmtDate(r.start_date)} → {fmtDate(r.end_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Calendrier ────────────────────────────────────── */}
      <div
        className="rounded-3xl overflow-hidden shadow-lg"
        style={{
          background:
            "linear-gradient(160deg, #0f2419 0%, #1a3a2a 60%, #0f2419 100%)",
          border: "1px solid rgba(201,169,110,0.15)",
        }}
      >
        {/* Header du mois */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-center mb-5">
            <button
              onClick={() => setCurrent(new Date(year, month - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.5)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(201,169,110,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
              }
            >
              <HiChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <h3
                className="text-base font-semibold tracking-wide"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#c9a96e",
                  fontSize: "1.1rem",
                }}
              >
                {MONTHS[month]}
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {year}
              </p>
            </div>

            <button
              onClick={() => setCurrent(new Date(year, month + 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.5)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(201,169,110,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
              }
            >
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Barre d'occupation */}
          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Occupation du mois
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: "#c9a96e" }}
                >
                  {occupancyPct}%
                </span>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${occupancyPct}%`,
                    background: "linear-gradient(90deg, #c9a96e, #e8c98a)",
                  }}
                />
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-white">
                {totalReservedDays}j
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                réservés
              </p>
            </div>
          </div>
        </div>

        {/* Grille */}
        <div className="px-4 pb-5">
          {/* Noms des jours */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d, i) => (
              <div
                key={i}
                className="text-center py-1.5 text-xs font-semibold tracking-wider"
                style={{
                  color:
                    i >= 5 ? "rgba(201,169,110,0.5)" : "rgba(255,255,255,0.2)",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Cases */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              const dayRes = day ? getDayReservations(day) : [];
              const booked = dayRes.length > 0;
              const today = day ? isToday(day) : false;
              const weekend = day ? (i - offset + 7) % 7 >= 5 : false;

              return (
                <div
                  key={i}
                  onMouseEnter={
                    booked ? (e) => handleMouseEnter(e, day) : undefined
                  }
                  onMouseLeave={booked ? handleMouseLeave : undefined}
                  className="relative aspect-square flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-200 select-none"
                  style={
                    !day
                      ? {}
                      : booked
                        ? {
                            background:
                              "linear-gradient(135deg, #c9a96e, #b8903d)",
                            color: "#0f2419",
                            fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: "0 2px 10px rgba(201,169,110,0.35)",
                            transform: "scale(1.05)",
                          }
                        : today
                          ? {
                              background: "rgba(201,169,110,0.12)",
                              color: "#c9a96e",
                              border: "1.5px solid rgba(201,169,110,0.5)",
                              cursor: "default",
                            }
                          : {
                              color: weekend
                                ? "rgba(255,255,255,0.35)"
                                : "rgba(255,255,255,0.55)",
                              cursor: "default",
                            }
                  }
                >
                  {day}

                  {/* Point multi-réservations */}
                  {booked && dayRes.length > 1 && (
                    <span
                      className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: "#0f2419", fontSize: "8px" }}
                    >
                      {dayRes.length}
                    </span>
                  )}

                  {/* Point today */}
                  {today && !booked && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#c9a96e" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer légende */}
        <div
          className="px-5 py-3.5 flex items-center gap-5 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-md inline-block"
              style={{
                background: "linear-gradient(135deg, #c9a96e, #b8903d)",
              }}
            />
            Réservé
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-md inline-block"
              style={{
                border: "1.5px solid rgba(201,169,110,0.5)",
                background: "rgba(201,169,110,0.12)",
              }}
            />
            Aujourd'hui
          </span>
          <span
            className="ml-auto flex items-center gap-1"
            style={{ color: "rgba(201,169,110,0.6)" }}
          >
            <span>✦</span>
            <span>Survole un jour réservé</span>
          </span>
        </div>
      </div>
    </>
  );
}
