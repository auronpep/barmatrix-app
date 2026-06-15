import type { CommandDeckSubjectMastery } from "@/lib/api-client";

function fillColor(pct: number): string {
  if (pct >= 70) return "bg-emerald-600";
  if (pct >= 60) return "bg-zinc-400";
  return "bg-[var(--red)]";
}

function MasteryRow({
  data,
  onClick,
}: {
  data: CommandDeckSubjectMastery;
  onClick?: () => void;
}) {
  const arrow = data.delta > 0 ? "▲" : data.delta < 0 ? "▼" : "─";
  const deltaColor =
    data.delta > 0
      ? "text-emerald-600"
      : data.delta < 0
        ? "text-[var(--red)]"
        : "text-zinc-400";
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[120px_1fr_auto_auto] items-center gap-3 border-b border-zinc-100 px-5 py-2.5 text-left last:border-b-0 hover:bg-black/[0.025]"
    >
      <span className="truncate text-sm font-medium text-zinc-900">
        {data.subject}
      </span>
      <span className="h-2 bg-zinc-100">
        <span
          className={`block h-full ${fillColor(data.pct)}`}
          style={{ width: `${data.pct}%` }}
        />
      </span>
      <span className="w-10 text-right font-mono text-sm tabular-nums text-zinc-900">
        {data.pct}%
      </span>
      <span className={`w-8 text-right font-mono text-xs tabular-nums ${deltaColor}`}>
        {arrow}
        {Math.abs(data.delta)}
      </span>
    </button>
  );
}

export function MasteryList({
  items,
  onSubject,
}: {
  items: CommandDeckSubjectMastery[];
  onSubject?: (subject: string) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="px-5 py-6 text-sm leading-6 text-zinc-500">
        Subject mastery builds as you practice. Work a few questions in each
        subject and your last-14-day accuracy will appear here.
      </p>
    );
  }
  return (
    <div>
      {items.map((m) => (
        <MasteryRow
          key={m.subject}
          data={m}
          onClick={onSubject ? () => onSubject(m.subject) : undefined}
        />
      ))}
    </div>
  );
}
