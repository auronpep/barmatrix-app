import type { DashboardRecentAttempt } from "@/lib/api-client";
import { humanizeSubject } from "@/lib/format-subject";

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

// Live attempts feed: miss = red dot + trap tag; correct = ✓ CORRECT.
// Ported from the prototype's RecentActivityPanel.
export function RecentFeed({ items }: { items: DashboardRecentAttempt[] }) {
  if (items.length === 0) {
    return (
      <p className="px-5 py-6 text-sm leading-6 text-zinc-500">
        No attempts yet. Your recent questions will stream in here.
      </p>
    );
  }
  return (
    <div>
      {items.map((a) => (
        <div
          key={a.attempt_id}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-zinc-100 px-5 py-2.5 last:border-b-0"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: a.correct ? "#059669" : "var(--red)" }}
            aria-hidden
          />
          <span className="min-w-0">
            <span className="block truncate text-sm text-zinc-700">
              <span className="font-medium text-zinc-900">
                {humanizeSubject(a.subject)}
              </span>
            </span>
            {a.correct ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-600">
                ✓ Correct
              </span>
            ) : (
              <span className="block truncate font-mono text-[10px] uppercase tracking-[0.05em] text-[var(--red)]">
                ▸ {a.trap_name}
              </span>
            )}
          </span>
          <span className="whitespace-nowrap font-mono text-[10px] text-zinc-400">
            {timeAgo(a.attempted_at)}
          </span>
        </div>
      ))}
    </div>
  );
}
