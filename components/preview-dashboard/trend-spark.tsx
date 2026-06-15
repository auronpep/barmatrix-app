import type { CommandDeckTrendPoint } from "@/lib/api-client";

// Inline-SVG sparkline of rolling % correct. Ported verbatim from the
// prototype's TrendPanel — no charting dependency.
export function TrendSpark({ points }: { points: CommandDeckTrendPoint[] }) {
  if (points.length < 2) {
    return (
      <p className="px-5 py-6 text-sm leading-6 text-zinc-500">
        Your mastery trend builds after a few days of practice.
      </p>
    );
  }

  const w = 320;
  const h = 70;
  const pad = 6;
  const pcts = points.map((d) => d.pct);
  const max = Math.max(...pcts);
  const min = Math.min(...pcts);
  const range = max - min || 1;

  const pts = points.map((d, i) => {
    const x = pad + (i / (points.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.pct - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
  const fillPath = `${path} L ${w - pad},${h} L ${pad},${h} Z`;

  const current = points[points.length - 1]!.pct;
  const weekAgo = points[Math.max(0, points.length - 8)]!.pct;
  const delta = current - weekAgo;

  const firstDay = points[0]!.day.slice(5);
  const midDay = points[Math.floor(points.length / 2)]!.day.slice(5);
  const lastDay = points[points.length - 1]!.day.slice(5);

  return (
    <div className="p-5">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-serif text-3xl font-bold tabular-nums text-zinc-900">
          {current}%
        </span>
        <span
          className="font-mono text-xs tracking-[0.05em]"
          style={{ color: delta >= 0 ? "#059669" : "var(--red)" }}
        >
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}pts · 7d
        </span>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-[80px] w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Rolling accuracy trend, currently ${current}%`}
      >
        <defs>
          <linearGradient id="cd-sparkfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--red)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill="url(#cd-sparkfill)" />
        <path d={path} stroke="var(--red)" strokeWidth="1.5" fill="none" />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={i === pts.length - 1 ? 3 : 1.5}
            fill="var(--red)"
          />
        ))}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] tracking-[0.05em] text-zinc-400">
        <span>{firstDay}</span>
        <span>{midDay}</span>
        <span>{lastDay}</span>
      </div>
    </div>
  );
}
