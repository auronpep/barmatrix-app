import type { DashboardRecentAttempt } from "@/lib/api-client";

// One recent miss, rendered as a choice-pattern review card.
function TrapCard({ item }: { item: DashboardRecentAttempt }) {
  return (
    <article className="border border-zinc-300 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-mono text-xs uppercase tracking-wider text-[var(--red)]">
          {item.subject ?? "—"}
        </p>
        <span className="shrink-0 border border-amber-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-800">
          Missed
        </span>
      </div>
      <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-zinc-950">
        {item.trap_name ?? "Choice pattern"}
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-200 pt-4 text-sm">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-700">
            Selected
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold leading-none text-zinc-950">
            {item.selected_letter ?? "-"}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-700">
            Topic
          </p>
          <p className="mt-1 text-sm text-zinc-800">{item.subtopic ?? "General"}</p>
        </div>
      </div>
    </article>
  );
}

// Recent wrong-answer forensics from the command deck, framed as choice-pattern
// review. The payload shape is unchanged until the C3 attempt bridge lands.
export function TrapsToReread({ items }: { items: DashboardRecentAttempt[] }) {
  const misses = items.filter((a) => !a.correct).slice(0, 6);

  if (misses.length === 0) {
    return (
      <p className="p-5 text-sm leading-6 text-zinc-600">
        No recent misses to reread — your latest attempts were clean. Keep
        working drills and any validated choice patterns will surface here.
      </p>
    );
  }

  return (
    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
      {misses.map((item) => (
        <TrapCard key={item.attempt_id} item={item} />
      ))}
    </div>
  );
}
