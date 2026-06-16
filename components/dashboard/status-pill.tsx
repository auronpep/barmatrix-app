// Presentational status pill shared across dashboard surfaces.
// Extracted from the identical pill markup in StatusPill (app/dashboard/path/
// page.tsx) and DayStatusPill (app/dashboard/day-cards.tsx). Status→tone mapping
// stays at the call site because the status enums differ per surface.

export type PillTone = "positive" | "active" | "neutral";

const TONE_CLASS: Record<PillTone, string> = {
  positive: "border-emerald-700 text-emerald-800",
  active: "border-red-700 text-red-800",
  neutral: "border-zinc-300 text-zinc-600",
};

export function StatusPill({
  tone,
  children,
}: {
  tone: PillTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}
