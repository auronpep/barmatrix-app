"use client";

import { useState } from "react";
import type { CommandDeckTensionMatrix } from "@/lib/api-client";

// Heat ramp from the prototype's .mcell h0..h5.
const HEAT: Array<{ bg: string; fg: string }> = [
  { bg: "#fafaf7", fg: "#a8a29e" },
  { bg: "#fff0c2", fg: "#1c1917" },
  { bg: "#ffd4a0", fg: "#1c1917" },
  { bg: "#ff8a5f", fg: "#1c1917" },
  { bg: "#c8102e", fg: "#ffffff" },
  { bg: "#8b0a1e", fg: "#ffffff" },
];

interface HoverCell {
  row: string;
  col: string;
  heat: number;
  attempts: number;
}

// Personal axis-signal heatmap: subject x choice-pattern dimension. Renders a
// "building" state when the server returns null (e.g. JSON_TABLE unsupported or
// not enough data). Ported from the prototype's MiniMatrix.
export function TensionMatrix({ matrix }: { matrix: CommandDeckTensionMatrix | null }) {
  const [hover, setHover] = useState<HoverCell | null>(null);

  if (!matrix || matrix.rows.length === 0) {
    return (
      <p className="px-5 py-6 text-sm leading-6 text-zinc-500">
        Your personal axis signal is building. Once validated diagnostics attach
        to attempts, this panel can show subject by choice-pattern pressure.
      </p>
    );
  }

  const cols = matrix.cols;
  return (
    <div className="min-w-0 p-5">
      <div className="mb-3.5 flex min-w-0 flex-wrap items-baseline justify-between gap-2">
        <span className="min-w-0 font-mono text-[11px] tracking-[0.05em] text-zinc-500">
          {hover
            ? `${hover.row} x ${hover.col} - ${hover.attempts} misses, heat ${hover.heat}/5`
            : "Hover any cell - darker = more validated attempt pressure"}
        </span>
        <span className="whitespace-nowrap font-mono text-[10px] tracking-[0.05em] text-zinc-400">
          {matrix.rows.length} SUBJECTS × {cols.length} TRAP DIMS
        </span>
      </div>

      <div
        className="max-w-full grid gap-1 overflow-x-auto"
        style={{ gridTemplateColumns: `120px repeat(${cols.length}, minmax(34px, 1fr))` }}
      >
        <div />
        {cols.map((c) => (
          <div
            key={c}
            className="px-1 text-center font-mono text-[9px] uppercase leading-tight tracking-[0.04em] text-zinc-500"
          >
            {c}
          </div>
        ))}

        {matrix.rows.map((row) => (
          <FragmentRow
            key={row.name}
            name={row.name}
            heat={row.heat}
            attempts={row.attempts}
            cols={cols}
            onHover={setHover}
          />
        ))}
      </div>
    </div>
  );
}

function FragmentRow({
  name,
  heat,
  attempts,
  cols,
  onHover,
}: {
  name: string;
  heat: number[];
  attempts: number[];
  cols: string[];
  onHover: (c: HoverCell | null) => void;
}) {
  return (
    <>
      <div className="flex items-center truncate pr-2 text-xs font-medium text-zinc-700">
        {name}
      </div>
      {heat.map((h, ci) => {
        const level = HEAT[h] ?? HEAT[0]!;
        return (
          <div
            key={ci}
            className="flex aspect-square items-center justify-center font-mono text-[10px] transition-transform hover:scale-[1.08]"
            style={{ background: level.bg, color: level.fg }}
            onMouseEnter={() =>
              onHover({
                row: name,
                col: cols[ci] ?? "",
                heat: h,
                attempts: attempts[ci] ?? 0,
              })
            }
            onMouseLeave={() => onHover(null)}
          >
            {h >= 3 ? "●" : ""}
          </div>
        );
      })}
    </>
  );
}
