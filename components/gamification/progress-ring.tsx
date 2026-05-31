"use client";

// Circular progress indicator — replaces the flat session-hub bar. Animates
// on mount. Keeps proper progressbar semantics for screen readers.

import { useEffect, useState } from "react";

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
  const finalOffset = circumference - (clamped / 100) * circumference;

  // Start at full offset (empty), animate to real value after mount.
  const [offset, setOffset] = useState(circumference);
  useEffect(() => {
    const id = setTimeout(() => setOffset(finalOffset), 50);
    return () => clearTimeout(id);
  }, [finalOffset]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
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
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <span className="absolute font-mono text-xs font-semibold text-zinc-800">{clamped}%</span>
    </div>
  );
}
