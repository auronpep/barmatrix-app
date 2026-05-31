// Circular progress indicator — replaces the flat session-hub bar. Pure SVG, no
// motion. Keeps an aria-label equivalent to the previous bar for screen readers.

export default function ProgressRing({
  pct,
  size = 72,
  stroke = 8,
  label,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (clamped / 100) * circumference;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={label ?? `Progress ${clamped}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f4f4f5" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#047857"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute font-mono text-xs font-semibold text-zinc-800">{clamped}%</span>
    </div>
  );
}
