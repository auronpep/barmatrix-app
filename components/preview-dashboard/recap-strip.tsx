import type { DashboardRecentAttempt } from "@/lib/api-client";

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

// "Since your last session" recap — closes the drill -> dashboard loop. Built
// entirely from the real recent-attempts feed; renders nothing when there is
// no activity yet (no fabricated counts or deltas).
export function RecapStrip({
  items,
  onResume,
  canResume,
}: {
  items: DashboardRecentAttempt[];
  onResume: () => void;
  canResume: boolean;
}) {
  if (items.length === 0) return null;

  const n = items.length;
  const correct = items.filter((a) => a.correct).length;
  const lastMiss = items.find((a) => !a.correct);
  // Relative time reads the wall clock, so the server prerender and the client
  // hydration can differ by a minute. The value is intentionally allowed to
  // diverge — suppress the hydration warning on just this node.
  const when = timeAgo(items[0]!.attempted_at);

  return (
    <div className="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-[18px] border border-zinc-950 border-l-4 border-l-[var(--red)] bg-[var(--paper)] px-5 py-3.5">
      <div className="grid h-[34px] w-[34px] place-items-center border border-[var(--rule-soft)] font-mono text-xl text-[var(--red)]">
        ↻
      </div>
      <div>
        <div className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          ▌ Since your last session
          <span suppressHydrationWarning>{when ? ` · ${when}` : ""}</span>
        </div>
        <div className="max-w-[88ch] text-sm leading-relaxed text-zinc-700">
          You worked <b className="font-semibold text-zinc-950">{n} recent {n === 1 ? "question" : "questions"}</b> ·{" "}
          <b className="font-semibold" style={{ color: "var(--correct)" }}>{correct} correct</b>.{" "}
          {lastMiss ? (
            <>
              Latest miss: <b className="font-semibold" style={{ color: "var(--red)" }}>{lastMiss.trap_name}</b>
              {lastMiss.subject ? <> in {lastMiss.subject}</> : null} — repair it next.
            </>
          ) : (
            <>All correct — keep the streak going.</>
          )}
        </div>
      </div>
      {canResume ? (
        <button
          type="button"
          onClick={onResume}
          className="whitespace-nowrap bg-[var(--red)] px-5 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[var(--red-deep)]"
        >
          Resume →
        </button>
      ) : null}
    </div>
  );
}
