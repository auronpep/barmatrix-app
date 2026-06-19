"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProgressRing from "@/components/gamification/progress-ring";
import GamificationSummary from "@/components/gamification/gamification-summary";
import type { DayPlanMainItem, DayPlanStep, MyDayPlan } from "@/lib/api-client";
import { useDayPlan } from "@/lib/use-day-plan";
import { InfoCell } from "@/components/dashboard/info-cell";
import { StatusPill } from "@/components/dashboard/status-pill";
import { DayCards } from "../day-cards";

export default function DashboardPage() {
  const dayPlan = useDayPlan();
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [completingStepId, setCompletingStepId] = useState<string | null>(null);

  const data = dayPlan.data;
  const plan = data?.plan ?? null;
  const currentStep = plan?.current_step ?? null;
  const completedCount = plan?.metrics.completed_daily_steps ?? 0;
  const totalCount = plan?.metrics.total_daily_steps ?? 50;
  const progressPct = plan?.metrics.progress_pct ?? 0;
  const nextPreview = useMemo(
    () => nextDailyPreview(plan?.steps ?? [], currentStep),
    [plan, currentStep],
  );
  const daySummaries = data?.day_summaries ?? [];

  async function completeCurrentStep() {
    if (!currentStep) return;
    setCompletingStepId(currentStep.step_id);
    setCompletionError(null);
    try {
      await dayPlan.completeStep(currentStep.step_id);
    } catch (err) {
      setCompletionError(err instanceof Error ? err.message : "Could not complete this task.");
    } finally {
      setCompletingStepId(null);
    }
  }

  if (dayPlan.loading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <h1 className="sr-only">Lead Me</h1>
        <div className="border border-zinc-300 bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            Loading
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Preparing today&apos;s path.
          </p>
        </div>
      </section>
    );
  }

  if (!dayPlan.signedIn) {
    return (
      <AccessState
        title="Sign in"
        body="Sign in to open today's BarMatrix path."
        href="/sign-in"
        label="Sign in"
      />
    );
  }

  if (dayPlan.error) {
    return (
      <AccessState
        title="Path unavailable"
        body={`Live path sync failed: ${dayPlan.error}`}
        href="/account"
        label="Account"
      />
    );
  }

  if (!data?.enrolled) {
    const paused = data?.refunded || data?.status === "suspended";
    return (
      <AccessState
        title={paused ? "Access paused" : "Enrollment required"}
        body={
          paused
            ? "Your paid access is paused. Update billing to restore the daily path."
            : "Enroll to unlock the guided daily path."
        }
        href={paused ? "/account" : "/checkout"}
        label={paused ? "Manage billing" : "Enroll now"}
      />
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
      <div className="grid gap-6 border-b border-zinc-900 pb-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            Lead Me
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            {plan?.title ?? "Today's BarMatrix path"}
          </h1>
        </div>
        <div className="flex items-center justify-between gap-5 border border-zinc-300 bg-white p-5">
          <ProgressRing pct={progressPct} size={84} stroke={9} label="Daily path progress" />
          <div className="text-right">
            <p className="font-serif text-3xl font-semibold leading-none text-zinc-950">
              {completedCount}/{totalCount}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
              daily tasks
            </p>
          </div>
        </div>
      </div>

      {data.gamification && (
        <section className="mt-6" aria-label="Gamification summary">
          <GamificationSummary data={data.gamification} />
        </section>
      )}

      <DayCards cards={daySummaries} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <CurrentTask
          step={currentStep}
          completing={completingStepId === currentStep?.step_id}
          completionError={completionError}
          onComplete={completeCurrentStep}
        />

        <aside className="space-y-6">
          <Roadmap items={plan?.main_items ?? []} />
          <CatchupStatus data={data} />
        </aside>
      </div>

      {nextPreview && (
        <section className="mt-6 border border-zinc-200 bg-zinc-50 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            Up Next
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            {nextPreview.title}
          </p>
        </section>
      )}
    </section>
  );
}

function CurrentTask({
  step,
  completing,
  completionError,
  onComplete,
}: {
  step: DayPlanStep | null;
  completing: boolean;
  completionError: string | null;
  onComplete: () => void;
}) {
  if (!step) {
    return (
      <section className="border-2 border-emerald-700 bg-emerald-50 p-7" aria-labelledby="current-task">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-800">
          Day Complete
        </p>
        <h2 id="current-task" className="mt-3 font-serif text-3xl font-semibold text-zinc-950">
          Today&apos;s path is clear.
        </h2>
        <p className="mt-4 text-sm leading-7 text-zinc-700">
          Next challenge unlocks when your daily run resets.
        </p>
      </section>
    );
  }

  return (
    <section className="border-2 border-zinc-900 bg-white p-7" aria-labelledby="current-task">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            Current Task / {step.source === "catchup" ? "Catchup Challenge" : "Active Challenge"}
          </p>
          <h2 id="current-task" className="mt-3 font-serif text-4xl font-semibold leading-tight text-zinc-950">
            {step.title}
          </h2>
        </div>
        <span className="border border-zinc-300 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-zinc-700">
          {formatSeconds(step.estimated_seconds)}
        </span>
      </div>

      <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-800">{step.prompt}</p>

      <div className="mt-5 grid gap-3 border-t border-zinc-200 pt-5 sm:grid-cols-2">
        <InfoCell label="Content" value={contentRefLabel(step)} />
        <InfoCell label="XP" value={`+${step.xp}`} />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {step.action.href && (
          <Link href={step.action.href} className="btn btn-lg red">
            {step.action.label}
          </Link>
        )}
        <button
          type="button"
          onClick={onComplete}
          disabled={completing}
          className="btn btn-lg ghost disabled:cursor-not-allowed disabled:opacity-60"
        >
          {completing ? "Saving..." : "Mark Complete"}
        </button>
      </div>

      {completionError && (
        <p className="mt-4 border border-amber-300 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
          {completionError}
        </p>
      )}
    </section>
  );
}

function Roadmap({ items }: { items: DayPlanMainItem[] }) {
  return (
    <section className="border border-zinc-300 bg-white p-5" aria-labelledby="roadmap">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
        Roadmap
      </p>
      <h2 id="roadmap" className="mt-2 font-serif text-2xl font-semibold text-zinc-950">
        Today&apos;s milestones
      </h2>
      <ol className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.main_item_id} className="border border-zinc-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold leading-6 text-zinc-950">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{item.description}</p>
              </div>
              <StatusPill
                tone={
                  item.status === "complete"
                    ? "positive"
                    : item.status === "current"
                      ? "active"
                      : "neutral"
                }
              >
                {item.status}
              </StatusPill>
            </div>
            <div className="mt-3 h-2 overflow-hidden border border-zinc-200 bg-zinc-100">
              <div
                className="h-full bg-red-700"
                style={{ width: `${milestoneProgressPct(item)}%` }}
                aria-hidden
              />
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
              {item.completed_steps}/{item.step_count}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function milestoneProgressPct(item: DayPlanMainItem): number {
  if (item.step_count <= 0) return 0;
  return Math.max(
    0,
    Math.min(100, Math.round((item.completed_steps / item.step_count) * 100)),
  );
}

function CatchupStatus({ data }: { data: MyDayPlan }) {
  const catchup = data.plan?.catchup;
  return (
    <section className="border border-zinc-300 bg-zinc-950 p-5 text-white" aria-labelledby="catchup">
      <p className="font-mono text-xs uppercase tracking-wider text-red-300">
        Catchup Bank
      </p>
      <h2 id="catchup" className="mt-2 font-serif text-2xl font-semibold">
        {catchup?.pending_count ?? 0} held task{(catchup?.pending_count ?? 0) === 1 ? "" : "s"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-300">
        {catchup && catchup.injected_count > 0
          ? `${catchup.injected_count} catchup task${catchup.injected_count === 1 ? "" : "s"} active after completed milestones.`
          : "Catchup appears after a milestone is complete."}
      </p>
    </section>
  );
}

function AccessState({
  title,
  body,
  href,
  label,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
}) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="border border-zinc-300 bg-white p-7">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Dashboard
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-zinc-950">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-700">{body}</p>
        <Link href={href} className="btn btn-lg red mt-6">
          {label}
        </Link>
      </div>
    </section>
  );
}

function nextDailyPreview(steps: DayPlanStep[], currentStep: DayPlanStep | null) {
  if (!currentStep) return null;
  const index = steps.findIndex((step) => step.step_id === currentStep.step_id);
  return steps.slice(index + 1).find((step) => !step.completed && step.source === "daily") ?? null;
}

function contentRefLabel(step: DayPlanStep) {
  return step.content_ref.label ?? `${step.content_ref.type}:${step.content_ref.id}`;
}

function formatSeconds(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "short";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} min`;
}
