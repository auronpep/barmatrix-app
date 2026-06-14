import type { CommandDeckStudent, CommandDeckQueueItem } from "@/lib/api-client";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// The dark "command deck" hero: greeting, exam countdown (or streak when no
// countdown), session progress, and the next-up drill. Ported from the
// prototype's `.today-tile`.
export function TodayTile({
  student,
  nextUp,
  onStart,
}: {
  student: CommandDeckStudent;
  nextUp: CommandDeckQueueItem | null;
  onStart: () => void;
}) {
  const g = greeting();
  const pct = Math.min(
    100,
    student.session_goal_min > 0
      ? Math.round((student.session_done_min / student.session_goal_min) * 100)
      : 0,
  );

  const eyebrow =
    student.days_to_exam !== null
      ? `${g.toUpperCase()} · ${student.days_to_exam} DAYS TO MBE`
      : `${g.toUpperCase()} · ${student.streak_days}-DAY STREAK`;

  return (
    <div className="relative overflow-hidden bg-zinc-950 px-8 pb-8 pt-7 text-zinc-300">
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--red)]" aria-hidden />

      <div className="mb-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
        ▌ {eyebrow}
      </div>
      <div className="mb-2 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-white">
        {g}, <span className="italic text-[var(--red)]">{student.first_name}.</span>
      </div>
      <p className="mb-6 max-w-[56ch] text-[15px] leading-relaxed text-zinc-400">
        {nextUp ? (
          <>
            Your next repair is queued — sequenced to close your top red zone
            first.
          </>
        ) : (
          <>
            Work a drill or the diagnostic and your repair queue will build
            here.
          </>
        )}
      </p>

      <div className="mb-6 flex items-center gap-3.5">
        <span className="font-mono text-[11px] tracking-[0.12em] text-zinc-400">
          SESSION · {student.session_done_min}/{student.session_goal_min} MIN
        </span>
        <div className="relative h-1.5 flex-1 bg-white/10">
          <div className="h-full bg-[var(--red)] transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-[11px] tracking-[0.12em] text-zinc-400">
          {pct}%
        </span>
      </div>

      {nextUp ? (
        <button
          type="button"
          onClick={onStart}
          className="grid w-full grid-cols-[1fr_auto] items-center gap-4 !border !border-white/20 bg-transparent px-5 py-[18px] text-left transition-colors hover:!border-[var(--red)] hover:bg-[rgba(200,16,46,0.08)]"
        >
          <span>
            <span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
              ▶ NEXT UP · DUE NOW
            </span>
            <span className="mb-1.5 block font-serif text-xl font-bold tracking-tight text-white">
              {nextUp.title}
            </span>
            <span className="block font-mono text-[11px] tracking-[0.05em] text-zinc-500">
              {nextUp.subject.toUpperCase()}
              {nextUp.question_count > 0 ? ` · ${nextUp.question_count}Q` : ""}
              {nextUp.est_min > 0 ? ` · ~${nextUp.est_min} MIN` : ""}
            </span>
          </span>
          <span className="whitespace-nowrap bg-[var(--red)] px-5 py-3 font-sans text-[13px] font-semibold uppercase tracking-wide text-white">
            Start Drill →
          </span>
        </button>
      ) : null}
    </div>
  );
}
