"use client";

// Day runner — plays one day's pinned drill block through the shared
// QuestionRunner. Resume-aware: already-answered questions for this day are
// skipped. On finish it marks the day complete (advancing current_day when the
// block is passed) and returns to the session hub.

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api-client";
import QuestionRunner, { type RunnerSummary } from "@/components/question-runner";
import { trackDrillCompleted, trackDrillStarted } from "@/lib/analytics";

interface DayData {
  slug: string;
  setId: string;
  questionIds: string[];
  answeredQuestionIds: string[];
  initialCorrect: number;
  dayCount: number;
}

type State =
  | { phase: "loading" }
  | { phase: "ready"; data: DayData }
  | { phase: "locked" }
  | { phase: "error"; message: string };

export default function BootCampDayPage({
  params,
}: {
  params: Promise<{ session_id: string; day: string }>;
}) {
  const { session_id: sessionId, day: dayStr } = use(params);
  const day = Number.parseInt(dayStr, 10);
  const router = useRouter();
  const [state, setState] = useState<State>({ phase: "loading" });
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    let active = true;
    if (!Number.isInteger(day) || day < 1) {
      queueMicrotask(() => {
        if (active) setState({ phase: "error", message: "Invalid day" });
      });
      return () => {
        active = false;
      };
    }
    Promise.all([
      api.getBootCampSession(sessionId, { cache: "no-store" }),
      api.startBootCampDay(sessionId, day),
    ])
      .then(([session, dayStart]) => {
        if (!active) return;
        trackDrillStarted({ drillId: `${session.slug}-day-${day}`, source: "manual" });
        setState({
          phase: "ready",
          data: {
            slug: session.slug,
            setId: dayStart.set_id,
            questionIds: dayStart.question_ids,
            answeredQuestionIds: dayStart.answered_question_ids,
            initialCorrect: dayStart.correct_count,
            dayCount: session.day_count,
          },
        });
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof ApiClientError && err.status === 409) {
          setState({ phase: "locked" });
          return;
        }
        setState({
          phase: "error",
          message: err instanceof ApiClientError ? `API ${err.status}` : "Day unavailable",
        });
      });
    return () => {
      active = false;
    };
  }, [sessionId, day]);

  const onComplete = async (summary: RunnerSummary) => {
    if (state.phase !== "ready" || finishing) return;
    setFinishing(true);
    try {
      const result = await api.completeBootCampDay(sessionId, day);
      trackDrillCompleted({
        drillId: `${state.data.slug}-day-${day}`,
        completionStatus: "completed",
        questionCount: summary.total,
        correctCount: summary.correct,
        masteryPassed: result.passed,
      });
      router.push(`/boot-camps/sessions/${sessionId}`);
    } catch {
      // Even if the complete call fails, send the student back to the hub,
      // which re-reads authoritative progress from the server.
      router.push(`/boot-camps/sessions/${sessionId}`);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/boot-camps/sessions/${sessionId}`}
        className="font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-800"
      >
        &larr; Session hub
      </Link>

      <div className="mt-6">
        {state.phase === "loading" && (
          <p className="text-zinc-700" aria-live="polite">
            Loading Day {day}…
          </p>
        )}

        {state.phase === "locked" && (
          <Panel tone="amber" title="This day is locked">
            Finish the earlier days first. Head back to the session hub to continue where
            you left off.
            <div className="mt-5">
              <Link href={`/boot-camps/sessions/${sessionId}`} className="btn ghost">
                Back to session
              </Link>
            </div>
          </Panel>
        )}

        {state.phase === "error" && (
          <Panel tone="amber" title="Day unavailable">
            <span className="font-mono text-xs">{state.message}</span>
            <div className="mt-5">
              <Link href={`/boot-camps/sessions/${sessionId}`} className="btn ghost">
                Back to session
              </Link>
            </div>
          </Panel>
        )}

        {state.phase === "ready" && state.data.questionIds.length === 0 && (
          <Panel tone="zinc" title="No questions pinned for this day yet">
            This camp&apos;s question bank is still loading. Check back once the bank is
            applied — your progress is saved.
            <div className="mt-5">
              <Link href={`/boot-camps/sessions/${sessionId}`} className="btn ghost">
                Back to session
              </Link>
            </div>
          </Panel>
        )}

        {state.phase === "ready" && state.data.questionIds.length > 0 && (
          <QuestionRunner
            questionIds={state.data.questionIds}
            setId={state.data.setId}
            answeredQuestionIds={state.data.answeredQuestionIds}
            initialCorrect={state.data.initialCorrect}
            title={`Day ${day}`}
            completeLabel={finishing ? "Saving…" : "Finish day"}
            onComplete={onComplete}
          />
        )}
      </div>
    </main>
  );
}

function Panel({
  tone,
  title,
  children,
}: {
  tone: "amber" | "zinc";
  title: string;
  children: React.ReactNode;
}) {
  const cls =
    tone === "amber"
      ? "border-amber-300 bg-amber-50 text-amber-900"
      : "border-zinc-300 bg-white text-zinc-700";
  return (
    <div className={`border p-8 ${cls}`} aria-live="polite">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-3 text-sm leading-6">{children}</div>
    </div>
  );
}
