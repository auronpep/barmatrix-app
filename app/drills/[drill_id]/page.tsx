"use client";

// Drill runner — plays a started drill's pinned question set through the shared
// QuestionRunner, then completes it and shows the mastery card (correct/total,
// mastery, and the current red-zone standing). The dynamic [drill_id] segment
// coexists with the static /drills/<subject> quick-drill pages (Next.js routes
// static segments first), so a drill_id is always a UUID.

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  api,
  ApiClientError,
  type DrillCompleteResponse,
  type DrillDetail,
} from "@/lib/api-client";
import QuestionRunner, { type RunnerSummary } from "@/components/question-runner";
import { trackDrillCompleted, trackDrillStarted } from "@/lib/analytics";
import { formatDrillName, humanizeTag, proficiencyPct } from "@/lib/drills";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { userFacingResourceError } from "@/lib/user-facing-errors";

type State =
  | { phase: "loading" }
  | { phase: "ready"; detail: DrillDetail }
  | { phase: "done"; detail: DrillDetail; result: DrillCompleteResponse }
  | { phase: "error"; message: string };

export default function DrillRunnerPage({
  params,
}: {
  params: Promise<{ drill_id: string }>;
}) {
  const { drill_id: drillId } = use(params);
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [state, setState] = useState<State>({ phase: "loading" });
  const [finishing, setFinishing] = useState(false);
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const drillDisplayName =
    state.phase === "ready" ? formatDrillName(state.detail.drill_name) : "";

  const onRetryMissed = async () => {
    if (retrying) return;
    setRetrying(true);
    setRetryError(null);
    try {
      const token = await getToken();
      if (!token) {
        setRetryError("Sign in to retry missed questions.");
        setRetrying(false);
        return;
      }
      const res = await api.startDrill({ kind: "retry", source_drill_id: drillId }, token);
      if (res.drill_id) {
        router.push(`/drills/${res.drill_id}`);
        return;
      }
      setRetryError("No missed questions were available to retry.");
      setRetrying(false);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        setRetryError("Sign in to retry missed questions.");
      } else if (err instanceof ApiClientError && err.status === 403) {
        setRetryError("Enrollment required to retry missed questions.");
      } else {
        setRetryError("Could not build a retry drill.");
      }
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    let active = true;
    if (!isSignedIn) {
      queueMicrotask(() => {
        if (active) {
          setState({ phase: "error", message: "Sign in to resume this drill." });
        }
      });
      return () => {
        active = false;
      };
    }
    void (async () => {
      try {
        const token = await getToken();
        if (!active) return;
        if (!token) {
          setState({ phase: "error", message: "Sign in to resume this drill." });
          return;
        }
        const detail = await api.getDrill(drillId, token, { cache: "no-store" });
        if (!active) return;
        trackDrillStarted({ drillId, source: "manual" });
        setState({ phase: "ready", detail });
      } catch (err: unknown) {
        if (!active) return;
        setState({
          phase: "error",
          message:
            err instanceof ApiClientError ? drillLoadErrorMessage(err) : "Drill unavailable",
        });
      }
    })();
    return () => {
      active = false;
    };
  }, [drillId, getToken, isLoaded, isSignedIn]);

  const onComplete = async (summary: RunnerSummary) => {
    if (state.phase !== "ready" || finishing) return;
    setFinishing(true);
    const detail = state.detail;
    try {
      const token = await getToken();
      if (!token) {
        setFinishing(false);
        setState({ phase: "error", message: "Sign in to save this drill." });
        return;
      }
      const result = await api.completeDrill(drillId, token);
      trackDrillCompleted({
        drillId,
        completionStatus: "completed",
        questionCount: result.total,
        correctCount: result.correct,
        masteryPassed: result.mastered,
      });
      setState({ phase: "done", detail, result });
    } catch (err) {
      if (err instanceof ApiClientError && (err.status === 401 || err.status === 403)) {
        setFinishing(false);
        setState({
          phase: "error",
          message:
            err.status === 401
              ? "Sign in to save this drill."
              : "Enrollment required to save this drill.",
        });
        return;
      }
      // Complete call failed: derive a best-effort result from the run summary
      // so the student still sees their score (the server stays authoritative).
      const mastered = summary.total > 0 && summary.correct / summary.total >= 0.75;
      trackDrillCompleted({
        drillId,
        completionStatus: "completed",
        questionCount: summary.total,
        correctCount: summary.correct,
        masteryPassed: mastered,
      });
      setState({
        phase: "done",
        detail,
        result: {
          drill_id: drillId,
          correct: summary.correct,
          total: summary.total,
          answered: summary.answered,
          mastered,
          status: mastered ? "completed" : "in_progress",
          red_zone: null,
        },
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/drills"
        className="font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-800"
      >
        &larr; Drill library
      </Link>

      <div className="mt-6">
        {state.phase === "loading" && (
          <p className="text-zinc-700" aria-live="polite">
            Loading drill…
          </p>
        )}

        {state.phase === "error" && (
          <Panel tone="amber" title="Drill unavailable">
            <span className="font-mono text-xs">{state.message}</span>
            <div className="mt-5">
              <Link href="/drills" className="btn ghost">
                Back to drills
              </Link>
            </div>
          </Panel>
        )}

        {state.phase === "ready" && state.detail.question_ids.length === 0 && (
          <Panel tone="zinc" title="No questions matched this drill yet">
            The active content set doesn&apos;t have questions for this target yet.
            Try another drill — your progress is saved.
            <div className="mt-5">
              <Link href="/drills" className="btn ghost">
                Back to drills
              </Link>
            </div>
          </Panel>
        )}

        {state.phase === "ready" && state.detail.question_ids.length > 0 && (
          <>
            <header className="mb-8 border-b border-zinc-200 pb-6">
              <p className="font-mono text-xs uppercase tracking-wider text-red-700">
                {state.detail.red_zone_dimension
                  ? humanizeTag(state.detail.red_zone_dimension)
                  : "Targeted drill"}
              </p>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
                {drillDisplayName}
              </h1>
              {state.detail.red_zone_tag && (
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Repairing{" "}
                  <span className="font-medium text-zinc-800">
                    {humanizeTag(state.detail.red_zone_tag)}
                  </span>{" "}
                  · {state.detail.question_ids.length} questions
                </p>
              )}
            </header>

            <QuestionRunner
              questionIds={state.detail.question_ids}
              setId={drillId}
              title={drillDisplayName}
              completeLabel={finishing ? "Saving…" : "Finish drill"}
              onComplete={onComplete}
            />
          </>
        )}

        {state.phase === "done" && (
          <MasteryCard
            detail={state.detail}
            result={state.result}
            onRetryMissed={onRetryMissed}
            retrying={retrying}
            retryError={retryError}
          />
        )}
      </div>
    </div>
  );
}

function drillLoadErrorMessage(err: ApiClientError): string {
  return userFacingResourceError(err, {
    signedOut: "Sign in to resume this drill.",
    forbidden: "Enrollment required to resume this drill.",
    notFound: "This drill no longer exists.",
    unavailable: "This drill is temporarily unavailable.",
  });
}

function MasteryCard({
  detail,
  result,
  onRetryMissed,
  retrying,
  retryError,
}: {
  detail: DrillDetail;
  result: DrillCompleteResponse;
  onRetryMissed: () => void;
  retrying: boolean;
  retryError: string | null;
}) {
  const drillDisplayName = formatDrillName(detail.drill_name);
  const pct =
    result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
  return (
    <div
      className={`rounded-lg border p-8 shadow-sm ${
        result.mastered ? "border-emerald-300 bg-emerald-50" : "border-zinc-300 bg-white"
      }`}
      role="status"
    >
      <p
        className={`font-mono text-xs uppercase tracking-wider ${
          result.mastered ? "text-emerald-700" : "text-amber-700"
        }`}
      >
        {result.mastered ? "Drill mastered" : "Drill complete"}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-zinc-950">
        {result.correct} / {result.total} correct
      </h1>
      <p className="mt-3 text-sm leading-7 text-zinc-700">
        {result.mastered
          ? `You cleared the ${pct}% mastery bar on ${drillDisplayName}.`
          : `You scored ${pct}%. Re-run this drill or pick another red zone to keep repairing.`}
      </p>

      {result.red_zone && (
        <div className="mt-6 border-t border-zinc-200 pt-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            {humanizeTag(result.red_zone.dimension)} ·{" "}
            {humanizeTag(result.red_zone.tag)}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            Current proficiency:{" "}
            <span className="font-semibold text-zinc-950">
              {proficiencyPct(result.red_zone.proficiency_score)}%
            </span>{" "}
            across {result.red_zone.attempts} attempts.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {result.correct < result.total && (
          <button
            type="button"
            onClick={onRetryMissed}
            disabled={retrying}
            className="btn red"
          >
            {retrying ? "Building…" : "Retry missed questions"}
          </button>
        )}
        <Link href="/drills" className="btn red">
          Start another drill
        </Link>
        <Link href="/red-zones" className="btn ghost">
          Open Red-Zone Map
        </Link>
      </div>
      {retryError && (
        <p className="mt-4 font-mono text-xs leading-6 text-red-700">
          {retryError}
        </p>
      )}
    </div>
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
