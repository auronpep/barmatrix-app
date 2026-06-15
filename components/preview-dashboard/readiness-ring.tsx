// SVG readiness ring — brand-red arc over a hairline track, big serif number
// centered. Ported from the prototype's ReadinessRing.
export function ReadinessRing({
  pct,
  band,
  size = 150,
}: {
  pct: number;
  band: string;
  size?: number;
}) {
  const stroke = 9;
  const rad = (size - stroke - 6) / 2;
  const circ = 2 * Math.PI * rad;
  const clamped = Math.max(0, Math.min(100, pct));
  const off = circ * (1 - clamped / 100);
  const cx = size / 2;

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label={`Readiness ${pct} of 100 — ${band}`}
      >
        <circle
          cx={cx}
          cy={cx}
          r={rad}
          fill="none"
          stroke="var(--rule-soft)"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cx}
          r={rad}
          fill="none"
          stroke="var(--red)"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={off}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-serif text-[44px] font-bold leading-none tracking-tight tabular-nums text-zinc-950">
          {pct}
        </div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">
          {band}
        </div>
      </div>
    </div>
  );
}
