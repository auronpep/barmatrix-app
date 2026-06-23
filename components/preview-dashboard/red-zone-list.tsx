import type { CommandDeckRedZone } from "@/lib/api-client";
import { humanizeSubject } from "@/lib/format-subject";

function TrendPill({ trend }: { trend: CommandDeckRedZone["trend"] }) {
  const cls =
    trend === "rising"
      ? "bg-[var(--red)] text-white"
      : trend === "falling"
        ? "bg-emerald-600 text-white"
        : "border border-zinc-200 bg-zinc-100 text-zinc-500";
  const label =
    trend === "rising" ? "▲ RISING" : trend === "falling" ? "▼ FALLING" : "─ FLAT";
  return (
    <span className={`ml-2 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.12em] ${cls}`}>
      {label}
    </span>
  );
}

function RedZoneRow({ rz, onClick }: { rz: CommandDeckRedZone; onClick: () => void }) {
  const subjectLabel = displaySubject(rz.subject);

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-zinc-100 px-5 py-3.5 text-left last:border-b-0 hover:bg-black/[0.025]"
    >
      <span className="font-mono text-2xl font-bold tabular-nums text-zinc-300">
        {String(rz.rank).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-serif text-base font-semibold text-zinc-900">
          {rz.name}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[11px] tracking-[0.05em] text-zinc-500">
          ▸ {subjectLabel} · {rz.miss_count}/{rz.total_attempts} missed
          {rz.last_missed ? ` · last: ${rz.last_missed}` : ""}
          <TrendPill trend={rz.trend} />
        </span>
      </span>
      <span className="text-right">
        <span className="block font-mono text-sm font-semibold tabular-nums text-zinc-900">
          {rz.drills_complete}/{rz.drills_total}
        </span>
        <span className="block font-mono text-[9px] tracking-[0.12em] text-zinc-400">
          DRILLS
        </span>
      </span>
    </button>
  );
}

function displaySubject(subject: string): string {
  const cleanSubject = subject.includes("·") ? subject.split("·").at(-1) : subject;
  return humanizeSubject(cleanSubject?.trim() || subject);
}

export function RedZoneList({
  items,
  onOpen,
}: {
  items: CommandDeckRedZone[];
  onOpen: () => void;
}) {
  if (items.length === 0) {
    return (
      <p className="px-5 py-6 text-sm leading-6 text-zinc-500">
        No active attempt signals yet. Use the Red-Zone V5 catalog while the
        personal bridge builds.
      </p>
    );
  }
  return (
    <div>
      {items.map((rz) => (
        <RedZoneRow key={`${rz.dimension}:${rz.tag}`} rz={rz} onClick={onOpen} />
      ))}
    </div>
  );
}
