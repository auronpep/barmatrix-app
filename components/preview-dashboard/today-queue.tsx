import type { CommandDeckQueueItem } from "@/lib/api-client";
import { formatStudyLabel } from "@/lib/study-labels";

// Sequenced repair queue. Ported from the prototype's QueueItem list.
export function TodayQueue({
  items,
  onStart,
}: {
  items: CommandDeckQueueItem[];
  onStart: (item: CommandDeckQueueItem) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="px-5 py-6 text-sm leading-6 text-zinc-500">
        No assignments queued yet. Finish the diagnostic or a drill and your
        sequenced queue will appear here.
      </p>
    );
  }
  return (
    <div>
      {items.map((q, i) => (
        <button
          key={`${q.drill_slug}:${i}`}
          type="button"
          onClick={() => onStart(q)}
          className="grid w-full grid-cols-[1fr_auto] items-start gap-4 border-b border-zinc-100 px-5 py-3.5 text-left last:border-b-0 hover:bg-black/[0.025]"
        >
          <span className="min-w-0">
            <span className="mb-1.5 flex items-center gap-2">
              <span className="bg-[var(--red)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white">
                {i === 0 ? "Red-Zone Drill" : "Mixed Set"}
              </span>
              <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                · {q.subject}
              </span>
            </span>
            <span className="block font-serif text-base font-semibold text-zinc-900">
              {i + 1}. {q.title}
            </span>
            <span className="mt-0.5 block truncate text-sm text-zinc-600">
              ▸ {formatQueueReason(q.reason)}
            </span>
          </span>
          <span className="whitespace-nowrap text-right font-mono text-xs text-zinc-500">
            {q.est_min > 0 ? (
              <span className="block text-sm font-semibold text-zinc-900">
                {q.est_min}m
              </span>
            ) : null}
            {q.question_count > 0 ? `${q.question_count}Q` : "Start →"}
          </span>
        </button>
      ))}
    </div>
  );
}

function formatQueueReason(reason: string): string {
  const trimmed = reason.trim();
  if (/^[a-z0-9]+(?:[_-][a-z0-9]+)+$/i.test(trimmed)) {
    return formatStudyLabel(trimmed);
  }
  return reason;
}
