import type { CommandDeckQueueItem } from "@/lib/api-client";

function metaLine(q: CommandDeckQueueItem): string {
  const parts = [q.subject.toUpperCase()];
  if (q.question_count > 0) parts.push(`${q.question_count}Q`);
  if (q.est_min > 0) parts.push(`~${q.est_min} min`);
  return parts.join(" · ");
}

// Direction B "move band": the single next action up front, the rest of today's
// queue beside it, and one Start CTA. Dark, full-bleed, brand-red accents.
export function MoveBand({
  queue,
  onStart,
}: {
  queue: CommandDeckQueueItem[];
  onStart: (slug: string) => void;
}) {
  const next = queue[0];
  if (!next) return null;
  const rest = queue.slice(1);
  const totalMin = queue.reduce((a, q) => a + q.est_min, 0);

  return (
    <div className="mb-6 grid grid-cols-1 items-stretch bg-zinc-950 text-zinc-300 lg:grid-cols-[1.3fr_1fr_auto]">
      <button
        type="button"
        onClick={() => onStart(next.drill_slug)}
        className="border-b border-white/10 bg-transparent px-6 py-5 text-left transition-colors hover:bg-[rgba(200,16,46,0.1)] lg:border-b-0 lg:border-r"
      >
        <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--red)]">
          ▶ Your move now
        </div>
        <div className="mb-1.5 font-serif text-[22px] font-bold leading-tight tracking-tight text-white">
          {next.title}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-zinc-500">
          {metaLine(next)}
        </div>
      </button>

      <div className="flex flex-col justify-center border-b border-white/10 px-6 py-5 lg:border-b-0">
        <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Then today
        </div>
        {rest.length > 0 ? (
          rest.map((q) => (
            <div
              key={q.drill_slug || q.title}
              className="py-0.5 font-serif text-sm text-zinc-400"
            >
              {q.title}
              {q.est_min > 0 ? ` · ${q.est_min}m` : ""}
            </div>
          ))
        ) : (
          <div className="py-0.5 font-serif text-sm text-zinc-500">
            Your queue builds as you work — clear this, the next move appears.
          </div>
        )}
        <div className="mt-2 border-t border-white/10 pt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500">
          {queue.length} {queue.length === 1 ? "drill" : "drills"}
          {totalMin > 0 ? ` · ${totalMin} min` : ""}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onStart(next.drill_slug)}
        className="flex items-center justify-center bg-[var(--red)] px-9 py-4 font-sans text-[15px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[var(--red-deep)]"
      >
        Start →
      </button>
    </div>
  );
}
