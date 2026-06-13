import type { DayPlanSummary } from "@/lib/api-client";

export function DayCards({ cards }: { cards: DayPlanSummary[] }) {
  if (cards.length === 0) return null;
  return (
    <section className="mt-6" aria-labelledby="guided-days">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            First 3 Days
          </p>
          <h2 id="guided-days" className="mt-2 font-serif text-2xl font-semibold text-zinc-950">
            Criminal Law and Procedure Questline
          </h2>
        </div>
        <p className="hidden font-mono text-[11px] uppercase tracking-wider text-zinc-600 sm:block">
          {cards.reduce((sum, card) => sum + card.step_count, 0)} tasks
        </p>
      </div>
      <ol className="mt-4 grid gap-3 md:grid-cols-3">
        {cards.map((card) => (
          <li
            key={card.plan_key}
            aria-current={card.current ? "step" : undefined}
            className={`border bg-white p-5 ${
              card.current
                ? "border-red-700 shadow-[0_0_0_1px_rgba(185,28,28,0.25)]"
                : "border-zinc-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
                Day {card.day_index}
              </p>
              <DayStatusPill status={card.status} />
            </div>
            <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-zinc-950">
              {stripDayPrefix(card.title)}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-700">{card.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-200 pt-4">
              <InfoCell label="Milestones" value={String(card.milestone_count)} />
              <InfoCell label="Tasks" value={String(card.step_count)} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DayStatusPill({ status }: { status: DayPlanSummary["status"] }) {
  const classes =
    status === "complete"
      ? "border-emerald-700 text-emerald-800"
      : status === "active"
        ? "border-red-700 text-red-800"
        : "border-zinc-300 text-zinc-600";
  return (
    <span className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${classes}`}>
      {status}
    </span>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-6 text-zinc-950">{value}</p>
    </div>
  );
}

function stripDayPrefix(title: string) {
  return title.replace(/^Day \d+:\s*/i, "");
}
