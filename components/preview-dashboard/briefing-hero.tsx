import type { CommandDeckStudent } from "@/lib/api-client";
import type { Readiness } from "@/lib/readiness";
import { ReadinessRing } from "@/components/preview-dashboard/readiness-ring";

function Driver({
  value,
  valueClass,
  label,
  sub,
}: {
  value: string;
  valueClass?: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="border-r border-[var(--rule-soft)] px-6 py-[18px] last:border-r-0">
      <div
        className={`font-serif text-[34px] font-bold leading-none tracking-tight tabular-nums text-zinc-950 ${valueClass ?? ""}`}
      >
        {value}
      </div>
      <div className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-900">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-[10px] tracking-[0.05em] text-zinc-500">
        {sub}
      </div>
    </div>
  );
}

// Direction B "Briefing" hero: a single readiness signal (ring) framed as an
// internal study signal — explicitly NOT a bar-result prediction — with the
// four real drivers that compose it.
export function BriefingHero({
  student,
  r,
  examDateLabel,
}: {
  student: CommandDeckStudent;
  r: Readiness;
  examDateLabel: string;
}) {
  const eyebrow =
    student.days_to_exam !== null
      ? `▌ Exam readiness · ${student.days_to_exam} days out${examDateLabel ? ` · ${examDateLabel}` : ""}`
      : "▌ Exam readiness";

  return (
    <div className="mb-6 border border-zinc-950 bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)]">
      <div className="grid grid-cols-1 items-center gap-7 border-b border-[var(--rule)] px-8 py-7 sm:grid-cols-[auto_1fr]">
        <ReadinessRing pct={r.readiness} band={r.band} size={150} />
        <div>
          <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
            {eyebrow}
          </div>
          <div className="mb-3 font-serif text-3xl font-bold leading-[1.04] tracking-tight text-zinc-950 sm:text-[34px]">
            You&apos;re <span className="italic text-[var(--red)]">{r.band.toLowerCase()}</span>
            {r.delta7d > 0 ? " — and trending up." : "."}
          </div>
          <p className="max-w-[64ch] text-sm leading-relaxed text-zinc-500">
            A blend of recent accuracy, question-bank coverage, and red-zone
            burn-down. It&apos;s an internal study signal to steer your week —
            not a prediction of your bar result.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4">
        <Driver
          value={`${r.accuracy}%`}
          label="Recent accuracy"
          sub={`${r.attempted.toLocaleString()} attempts · 14d`}
        />
        <Driver
          value={`${r.coverage}%`}
          label="Bank covered"
          sub={`${r.covered.toLocaleString()} / ${r.bankTotal.toLocaleString()} Q`}
        />
        <Driver
          value={`${r.rzBurn}%`}
          label="Red zones burned"
          sub={`${r.rzDone} / ${r.rzTotal} drills done`}
        />
        <Driver
          value={`${r.delta7d >= 0 ? "▲" : "▼"}${Math.abs(r.delta7d)}`}
          valueClass={r.delta7d >= 0 ? "!text-[var(--correct)]" : "!text-[var(--red)]"}
          label="Daily acc · 7d"
          sub={`now ${r.dailyNow}% rolling`}
        />
      </div>
    </div>
  );
}
