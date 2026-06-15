"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import GamificationSummary from "@/components/gamification/gamification-summary";
import type { DayPlanMainItem, DayPlanStep, MyDayPlan } from "@/lib/api-client";
import { useDayPlan } from "@/lib/use-day-plan";
import { DayCards } from "./day-cards";

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
  const steps = useMemo(() => plan?.steps ?? [], [plan]);
  const nextPreview = useMemo(() => nextDailyPreview(steps, currentStep), [steps, currentStep]);
  const daySummaries = data?.day_summaries ?? [];
  const currentMilestone = plan?.main_items.find((item) => item.status === "current") ?? null;
  const remainingSteps = useMemo(
    () => steps.filter((step) => !step.completed && step.step_id !== currentStep?.step_id).slice(0, 3),
    [steps, currentStep],
  );

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
    return <AccessState title="Sign in" body="Sign in to open today's BarMatrix path." href="/sign-in" label="Sign in" />;
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
      <RecapStrip
        completedCount={completedCount}
        totalCount={totalCount}
        currentStep={currentStep}
        currentMilestone={currentMilestone}
        nextPreview={nextPreview}
      />

      <BriefingHero
        title={plan?.title ?? "Today's BarMatrix path"}
        progressPct={progressPct}
        completedCount={completedCount}
        totalCount={totalCount}
        currentMilestone={currentMilestone}
        data={data}
      />

      <MoveBand
        step={currentStep}
        remainingSteps={remainingSteps}
        completing={completingStepId === currentStep?.step_id}
        completionError={completionError}
        onComplete={completeCurrentStep}
      />

      {data.gamification && (
        <section className="mt-6" aria-label="Gamification summary">
          <GamificationSummary data={data.gamification} />
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          <SessionPlan steps={steps} currentStep={currentStep} />
          <DayCards cards={daySummaries} />
          <DiagnosticRouter completedCount={completedCount} totalCount={totalCount} />
        </div>

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

function RecapStrip({
  completedCount,
  totalCount,
  currentStep,
  currentMilestone,
  nextPreview,
}: {
  completedCount: number;
  totalCount: number;
  currentStep: DayPlanStep | null;
  currentMilestone: DayPlanMainItem | null;
  nextPreview: DayPlanStep | null;
}) {
  const body = currentStep
    ? `${completedCount} of ${totalCount} daily tasks are clear. Keep the path tight with "${currentStep.title}".`
    : `All ${totalCount} daily tasks are clear. The next guided run unlocks when the daily path resets.`;

  return (
    <section className="grid gap-4 border border-zinc-900 border-l-4 border-l-red-700 bg-white p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
      <div className="grid h-10 w-10 place-items-center border border-zinc-200 font-mono text-lg text-red-700" aria-hidden>
        R
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
          Since your last checkpoint
        </p>
        <p className="mt-1 text-sm leading-6 text-zinc-800">{body}</p>
        {currentMilestone && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            Active milestone: {currentMilestone.title}
          </p>
        )}
      </div>
      {nextPreview?.action.href && (
        <Link href={nextPreview.action.href} className="btn btn-sm ghost justify-center">
          Preview next
        </Link>
      )}
    </section>
  );
}

function BriefingHero({
  title,
  progressPct,
  completedCount,
  totalCount,
  currentMilestone,
  data,
}: {
  title: string;
  progressPct: number;
  completedCount: number;
  totalCount: number;
  currentMilestone: DayPlanMainItem | null;
  data: MyDayPlan;
}) {
  const band = progressBand(progressPct);
  const catchup = data.plan?.catchup;
  return (
    <section className="mt-6 border border-zinc-900 bg-white shadow-[6px_6px_0_var(--ink)]">
      <div className="grid gap-7 border-b border-zinc-900 p-6 lg:grid-cols-[auto_1fr] lg:items-center">
        <DailySignalRing pct={progressPct} band={band} />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-700">
            Lead Me / daily briefing
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 sm:text-base">
            One prescribed path for today: finish the active task, clear the
            milestone, then move only to the next item the system opens.
          </p>
        </div>
      </div>

      <div className="grid divide-y divide-zinc-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        <DriverStat value={`${Math.round(progressPct)}%`} label="Daily path" detail={`${completedCount}/${totalCount} tasks`} />
        <DriverStat
          value={String(currentMilestone?.completed_steps ?? 0)}
          label="Milestone cleared"
          detail={currentMilestone ? `${currentMilestone.step_count} steps total` : "No active milestone"}
        />
        <DriverStat
          value={String(catchup?.pending_count ?? 0)}
          label="Catchup bank"
          detail={`${catchup?.injected_count ?? 0} active today`}
        />
        <DriverStat
          value={String(data.gamification?.current_streak ?? 0)}
          label="Day streak"
          detail={`${data.gamification?.total_xp ?? 0} total XP`}
        />
      </div>
    </section>
  );
}

function DailySignalRing({ pct, band }: { pct: number; band: string }) {
  const size = 148;
  const stroke = 9;
  const radius = (size - stroke - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, pct)) / 100);
  const center = size / 2;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(10,10,10,0.15)" strokeWidth={stroke} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#c8102e"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          strokeWidth={stroke}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-serif text-5xl font-semibold leading-none text-zinc-950">{Math.round(pct)}</p>
        <p className="mt-1 max-w-[88px] text-center font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">
          {band}
        </p>
      </div>
    </div>
  );
}

function DriverStat({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div className="p-5">
      <p className="font-serif text-4xl font-semibold leading-none text-zinc-950">{value}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-800">{label}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500">{detail}</p>
    </div>
  );
}

function MoveBand({
  step,
  remainingSteps,
  completing,
  completionError,
  onComplete,
}: {
  step: DayPlanStep | null;
  remainingSteps: DayPlanStep[];
  completing: boolean;
  completionError: string | null;
  onComplete: () => void;
}) {
  if (!step) {
    return (
      <section className="mt-6 border-2 border-emerald-700 bg-emerald-50 p-7" aria-labelledby="current-task">
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
    <section className="mt-6 grid bg-zinc-950 text-white lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.9fr)_auto]" aria-labelledby="current-task">
      <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-300">
          Your move now / {step.source === "catchup" ? "catchup challenge" : "active challenge"}
        </p>
        <h2 id="current-task" className="mt-3 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
          {step.title}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">{step.prompt}</p>
        <div className="mt-5 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400">
          <span>{contentRefLabel(step)}</span>
          <span>{formatSeconds(step.estimated_seconds)}</span>
          <span>+{step.xp} XP</span>
        </div>
        {completionError && (
          <p className="mt-4 border border-amber-300 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
            {completionError}
          </p>
        )}
      </div>

      <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">Then today</p>
        {remainingSteps.length > 0 ? (
          <ol className="mt-4 space-y-3">
            {remainingSteps.map((item) => (
              <li key={item.step_id} className="border-t border-white/10 pt-3">
                <p className="font-serif text-base font-semibold leading-snug text-zinc-100">{item.title}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                  {formatSeconds(item.estimated_seconds)} / +{item.xp} XP
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-sm leading-6 text-zinc-400">This is the final open task in today&apos;s path.</p>
        )}
      </div>

      <div className="flex flex-col justify-center gap-3 p-6">
        {step.action.href && (
          <Link href={step.action.href} className="btn btn-lg red justify-center whitespace-nowrap">
            {step.action.label}
          </Link>
        )}
        <button
          type="button"
          onClick={onComplete}
          disabled={completing}
          className="btn btn-lg ghost justify-center border-white/30 text-white hover:bg-white hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {completing ? "Saving..." : "Mark Complete"}
        </button>
      </div>
    </section>
  );
}

function SessionPlan({ steps, currentStep }: { steps: DayPlanStep[]; currentStep: DayPlanStep | null }) {
  if (steps.length === 0) return null;
  return (
    <section className="border border-zinc-900 bg-white" aria-labelledby="session-plan">
      <div className="border-b border-zinc-900 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">Today&apos;s session</p>
        <h2 id="session-plan" className="mt-2 font-serif text-2xl font-semibold text-zinc-950">
          Sequenced for you
        </h2>
      </div>
      <ol className="divide-y divide-zinc-200">
        {steps.map((item, index) => {
          const active = item.step_id === currentStep?.step_id;
          return (
            <li key={item.step_id} className={`grid gap-4 p-4 sm:grid-cols-[44px_1fr_auto] sm:items-center ${active ? "bg-red-50" : ""}`}>
              <div className={`grid h-9 w-9 place-items-center border font-mono text-sm font-semibold ${active ? "border-red-700 bg-red-700 text-white" : "border-zinc-300 text-zinc-600"}`}>
                {item.completed ? "OK" : index + 1}
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                  {item.source} / {contentRefLabel(item)}
                </p>
                <p className="mt-1 font-serif text-lg font-semibold leading-snug text-zinc-950">{item.title}</p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                {formatSeconds(item.estimated_seconds)}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function DiagnosticRouter({ completedCount, totalCount }: { completedCount: number; totalCount: number }) {
  const items = [
    {
      href: "/red-zones",
      label: "Red-Zone Map",
      stat: "Repair",
      body: "Open the recurring miss patterns behind the daily path.",
    },
    {
      href: "/mastery",
      label: "Mastery",
      stat: "C3",
      body: "Review the clean-cut and calibration signals after attempts post.",
    },
    {
      href: "/diagnostic",
      label: "Diagnostic",
      stat: "Map",
      body: "Rebuild the Red-Zone Map when the system needs fresh evidence.",
    },
    {
      href: "/drills",
      label: "Drills",
      stat: `${completedCount}/${totalCount}`,
      body: "Work only the practice that supports the current path.",
    },
  ];

  return (
    <section className="border border-zinc-900 bg-white" aria-labelledby="dig-next">
      <div className="border-b border-zinc-900 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">Where to dig next</p>
        <h2 id="dig-next" className="mt-2 font-serif text-2xl font-semibold text-zinc-950">
          Four lenses on the same misses
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="border-b border-zinc-200 p-5 transition hover:bg-zinc-50 sm:border-r xl:border-b-0">
            <div className="flex items-center justify-between gap-3">
              <span className="grid h-8 w-8 place-items-center border border-zinc-200 font-mono text-red-700" aria-hidden>
                |
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">{item.stat}</span>
            </div>
            <p className="mt-4 font-serif text-lg font-semibold text-zinc-950">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{item.body}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-red-700">Open</p>
          </Link>
        ))}
      </div>
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
              <StatusPill status={item.status} />
            </div>
            <div className="mt-3 h-2 overflow-hidden border border-zinc-200 bg-zinc-100">
              <div
                className="h-full bg-red-700"
                style={{ width: `${Math.round((item.completed_steps / item.step_count) * 100)}%` }}
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

function StatusPill({ status }: { status: DayPlanMainItem["status"] }) {
  const classes =
    status === "complete"
      ? "border-emerald-700 text-emerald-800"
      : status === "current"
        ? "border-red-700 text-red-800"
        : "border-zinc-300 text-zinc-600";
  return (
    <span className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${classes}`}>
      {status}
    </span>
  );
}

function progressBand(progressPct: number) {
  if (progressPct >= 100) return "Day clear";
  if (progressPct >= 70) return "Strong pace";
  if (progressPct >= 35) return "Building pace";
  return "First move";
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
