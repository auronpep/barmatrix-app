import type { DayPlanSummary } from "@/lib/api-client";
import { InfoCell } from "@/components/dashboard/info-cell";
import { StatusPill } from "@/components/dashboard/status-pill";

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
              <StatusPill
                tone={
                  card.status === "complete"
                    ? "positive"
                    : card.status === "active"
                      ? "active"
                      : "neutral"
                }
              >
                {card.status}
              </StatusPill>
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

function stripDayPrefix(title: string) {
  return title.replace(/^Day \d+:\s*/i, "");
}
