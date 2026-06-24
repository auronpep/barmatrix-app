"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProgressRing from "@/components/gamification/progress-ring";
import GamificationSummary from "@/components/gamification/gamification-summary";
import type {
  DayPlanMainItem,
  DayPlanStep,
  LeadMeV5CompletionResult,
  MyDayPlan,
} from "@/lib/api-client";
import { useDayPlan } from "@/lib/use-day-plan";
import { InfoCell } from "@/components/dashboard/info-cell";
import { StatusPill } from "@/components/dashboard/status-pill";
import { DayCards } from "../day-cards";

export default function DashboardPage() {
  const dayPlan = useDayPlan();
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [completingStepId, setCompletingStepId] = useState<string | null>(null);
  const [lastV5Result, setLastV5Result] = useState<LeadMeV5CompletionResult | null>(null);
  const [submittedV5Step, setSubmittedV5Step] = useState<DayPlanStep | null>(null);

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

  async function completeCurrentStep(selectedResponse?: string) {
    if (!currentStep) return;
    const submittedStep = currentStep;
    setCompletingStepId(currentStep.step_id);
    setCompletionError(null);
    try {
      const result = await dayPlan.completeStep(
        currentStep.step_id,
        selectedResponse ? { selected_response: selectedResponse } : {},
      );
      const v5Result = result.leadme_v5_result;
      setLastV5Result(v5Result?.correct ? null : v5Result);
      setSubmittedV5Step(v5Result && !v5Result.correct ? submittedStep : null);
    } catch (err) {
      setCompletionError(err instanceof Error ? err.message : "Could not complete this task.");
    } finally {
      setCompletingStepId(null);
    }
  }

  function continueAfterV5Result() {
    setLastV5Result(null);
    setSubmittedV5Step(null);
    window.requestAnimationFrame(() => {
      document
        .querySelector("[data-leadme-current-task]")
        ?.scrollIntoView({ block: "start", behavior: "auto" });
    });
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
          step={submittedV5Step ?? currentStep}
          lastV5Result={lastV5Result}
          completing={completingStepId === (submittedV5Step ?? currentStep)?.step_id}
          completionError={completionError}
          reviewingResult={Boolean(lastV5Result && submittedV5Step)}
          onComplete={completeCurrentStep}
          onContinueResult={continueAfterV5Result}
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
  lastV5Result,
  completing,
  completionError,
  reviewingResult,
  onComplete,
  onContinueResult,
}: {
  step: DayPlanStep | null;
  lastV5Result: LeadMeV5CompletionResult | null;
  completing: boolean;
  completionError: string | null;
  reviewingResult: boolean;
  onComplete: (selectedResponse?: string) => void;
  onContinueResult: () => void;
}) {
  if (!step) {
    return (
      <section
        className="scroll-mt-28 border-2 border-emerald-700 bg-emerald-50 p-7"
        aria-labelledby="current-task"
        data-leadme-current-task
      >
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

  const v5Options = step.leadme_v5_item?.options ?? [];
  const noOptionActionLabel = v5NoOptionActionLabel(step);
  const noOptionActionTone = noOptionActionLabel === "Continue" ? "red" : "ghost";

  return (
    <section
      className="scroll-mt-28 border-2 border-zinc-900 bg-white p-7"
      aria-labelledby="current-task"
      data-leadme-current-task
    >
      {lastV5Result ? <V5ResultBanner result={lastV5Result} /> : null}

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

      {step.leadme_v5_item ? (
        <V5LeadMeCard
          item={step.leadme_v5_item}
          completing={completing || reviewingResult}
          onSelect={(response) => onComplete(response)}
        />
      ) : null}

      <div className="mt-5 grid gap-3 border-t border-zinc-200 pt-5 sm:grid-cols-2">
        <InfoCell label="Content" value={contentRefLabel(step)} />
        <InfoCell label="XP" value={`+${step.xp}`} />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {reviewingResult ? (
          <button type="button" onClick={onContinueResult} className="btn btn-lg red">
            Next task
          </button>
        ) : null}
        {!reviewingResult && step.action.href && (
          <Link href={step.action.href} className="btn btn-lg red">
            {step.action.label}
          </Link>
        )}
        {!reviewingResult && v5Options.length === 0 ? (
          <button
            type="button"
            onClick={() => onComplete()}
            disabled={completing}
            className={`btn btn-lg ${noOptionActionTone} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {completing ? "Saving..." : noOptionActionLabel}
          </button>
        ) : null}
      </div>

      {completionError && (
        <p className="mt-4 border border-amber-300 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
          {completionError}
        </p>
      )}
    </section>
  );
}

function V5LeadMeCard({
  item,
  completing,
  onSelect,
}: {
  item: NonNullable<DayPlanStep["leadme_v5_item"]>;
  completing: boolean;
  onSelect: (selectedResponse: string) => void;
}) {
  const optionMode = v5OptionMode(item);
  const mode = v5ModeCopy(optionMode);

  return (
    <div className="mt-6 border border-zinc-300 bg-zinc-50">
      <div className="border-b border-zinc-300 bg-white px-5 py-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
          {mode.label}
        </p>
        <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-zinc-950">
          {item.title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          {mode.instruction}
        </p>
      </div>

      <div className="space-y-4 p-5">
        {item.front_blocks.map((block, index) => (
          <V5LeadMeBlock block={block} key={`${block.type}-${index}`} />
        ))}

        {item.options.length > 0 ? (
          <ol className={`grid gap-3 ${optionMode === "answer" ? "sm:grid-cols-2" : ""}`}>
            {item.options.map((option, index) => (
              <li
                key={option.id}
                className={v5OptionShellClass(optionMode)}
              >
                <button
                  type="button"
                  onClick={() => onSelect(option.id)}
                  disabled={completing}
                  data-leadme-option-style={optionMode}
                  className={v5OptionButtonClass(optionMode)}
                  aria-label={`${mode.actionLabel} ${optionLabel(optionMode, option, index)}: ${option.label}`}
                >
                  <span className={v5OptionBadgeClass(optionMode)}>
                    {optionLabel(optionMode, option, index)}
                  </span>
                  <span>{option.label}</span>
                </button>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}

function V5ResultBanner({ result }: { result: LeadMeV5CompletionResult }) {
  const resultLabel = v5ResultAnswerLabel(result);
  return (
    <div
      className={`mb-6 border p-4 ${
        result.correct
          ? "border-emerald-700 bg-emerald-50 text-emerald-950"
          : "border-amber-600 bg-amber-50 text-amber-950"
      }`}
    >
      <p className="font-mono text-[11px] uppercase tracking-wider">
        {result.correct ? "Correct" : "Not yet"}
      </p>
      <p className="mt-2 text-sm leading-6">
        You chose {result.selected_response}: {result.selected_label}
        {!result.correct && result.correct_responses.length > 0
          ? `. ${resultLabel}: ${result.correct_responses
              .map((answer) => `${answer.id}: ${answer.label}`)
              .join(", ")}.`
          : "."}
      </p>
      {result.feedback_blocks.map((block, index) => (
        <p
          className="mt-2 text-sm leading-6"
          key={`${block.type}-${index}`}
        >
          {block.markdown ?? block.caption ?? block.alt_text}
        </p>
      ))}
    </div>
  );
}

type V5OptionMode = "teach" | "answer" | "gate" | "signal" | "filter" | "repair";

function v5OptionMode(item: NonNullable<DayPlanStep["leadme_v5_item"]>): V5OptionMode {
  if (item.task_type === "acknowledge" || item.micro_task_kind === "lead_me" || (item.item_type === "instruction" && item.options.length === 0)) {
    return "teach";
  }
  if (item.item_type === "micro_task" || item.coverage_role === "rule_anchor" || item.micro_task_kind === "gate_check" || item.micro_task_kind === "rule_gate") {
    return "gate";
  }
  if (item.item_type === "signal_drill" || item.coverage_role === "trap_spotter" || item.micro_task_kind === "wrong_answer_cut") {
    return "signal";
  }
  if (item.item_type === "filter_drill" || item.task_type === "choose_filter" || item.micro_task_kind === "true_responsive_filter") {
    return "filter";
  }
  if (item.item_type === "repair_drill" || item.task_type === "rewrite_repair" || item.micro_task_kind === "repair_rewrite") {
    return "repair";
  }
  return "answer";
}

function v5ModeCopy(mode: V5OptionMode) {
  switch (mode) {
    case "teach":
      return {
        label: "Teach First",
        instruction: "Read this first. The next cards check whether you picked it up.",
        actionLabel: "Continue",
      };
    case "gate":
      return {
        label: "Rule Lock",
        instruction: "Choose the legal gate. This is not an MBE answer choice.",
        actionLabel: "Choose gate",
      };
    case "signal":
      return {
        label: "Trap Hunt",
        instruction: "Tap the broken signal. This is not an MBE answer choice.",
        actionLabel: "Choose signal",
      };
    case "filter":
      return {
        label: "Filter Cut",
        instruction: "Choose which C3 filter the trap breaks.",
        actionLabel: "Choose filter",
      };
    case "repair":
      return {
        label: "Repair Move",
        instruction: "Choose the fixed answer path.",
        actionLabel: "Choose repair",
      };
    default:
      return {
        label: "Answer Check",
        instruction: "Choose the true and responsive answer.",
        actionLabel: "Choose",
      };
  }
}

function optionLabel(mode: V5OptionMode, option: { id: string }, index: number) {
  if (mode === "teach") return "Read";
  if (mode === "answer") return option.id;
  if (mode === "gate") return `Gate ${index + 1}`;
  if (mode === "signal") return `Signal ${index + 1}`;
  if (mode === "filter") return `Filter ${index + 1}`;
  return `Repair ${index + 1}`;
}

function v5OptionShellClass(mode: V5OptionMode) {
  if (mode === "teach") return "border border-zinc-200 bg-white";
  if (mode === "answer") return "border border-zinc-200 bg-white";
  if (mode === "gate") return "border border-cyan-200 bg-cyan-50";
  if (mode === "signal") return "border border-red-200 bg-red-50";
  if (mode === "filter") return "border border-zinc-300 bg-white";
  return "border border-emerald-200 bg-emerald-50";
}

function v5OptionButtonClass(mode: V5OptionMode) {
  const base = "flex h-full w-full gap-3 p-3 text-left text-sm leading-6 focus-visible:outline focus-visible:outline-2 disabled:cursor-wait disabled:opacity-60";
  if (mode === "teach") return `${base} text-zinc-800 hover:bg-zinc-100 focus-visible:outline-zinc-900`;
  if (mode === "gate") return `${base} text-cyan-950 hover:bg-cyan-100 focus-visible:outline-cyan-800`;
  if (mode === "signal") return `${base} text-red-950 hover:bg-red-100 focus-visible:outline-red-700`;
  if (mode === "filter") return `${base} text-zinc-900 hover:bg-zinc-100 focus-visible:outline-zinc-900`;
  if (mode === "repair") return `${base} text-emerald-950 hover:bg-emerald-100 focus-visible:outline-emerald-800`;
  return `${base} text-zinc-800 hover:bg-red-50 focus-visible:outline-red-700`;
}

function v5OptionBadgeClass(mode: V5OptionMode) {
  const base = "flex min-h-7 shrink-0 items-center justify-center border px-2 font-mono text-[11px] font-semibold uppercase tracking-wider";
  if (mode === "teach") return `${base} border-zinc-300 bg-white text-zinc-700`;
  if (mode === "gate") return `${base} border-cyan-300 bg-white text-cyan-800`;
  if (mode === "signal") return `${base} border-red-300 bg-white text-red-800`;
  if (mode === "filter") return `${base} border-zinc-400 bg-zinc-50 text-zinc-800`;
  if (mode === "repair") return `${base} border-emerald-300 bg-white text-emerald-800`;
  return "flex size-7 shrink-0 items-center justify-center border border-zinc-300 font-mono text-xs font-semibold text-zinc-700";
}

function v5ResultAnswerLabel(result: LeadMeV5CompletionResult) {
  if (result.item_type === "micro_task" || result.micro_task_kind === "gate_check" || result.micro_task_kind === "rule_gate") return "Correct gate";
  if (result.item_type === "signal_drill" || result.micro_task_kind === "wrong_answer_cut") return "Trap signal";
  if (result.item_type === "filter_drill" || result.micro_task_kind === "true_responsive_filter") return "Correct filter";
  if (result.item_type === "repair_drill" || result.micro_task_kind === "repair_rewrite") return "Correct repair";
  return "Correct answer";
}

function v5NoOptionActionLabel(step: DayPlanStep) {
  const item = step.leadme_v5_item;
  if (item && v5OptionMode(item) === "teach") return "Continue";
  return "Mark Complete";
}

function V5LeadMeBlock({
  block,
}: {
  block: NonNullable<DayPlanStep["leadme_v5_item"]>["front_blocks"][number];
}) {
  const body = block.markdown ?? block.caption ?? block.alt_text ?? "";
  if (!body.trim()) return null;

  return (
    <div className="border border-zinc-200 bg-white p-4">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {block.type.replaceAll("_", " ")}
      </p>
      <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-800">
        {body}
      </p>
    </div>
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
