"use client";

// Mastery check — the end-of-camp mixed retest. Plays the pinned mastery set
// through the shared QuestionRunner, then submits for scoring and shows the
// mastery card (score, pass/fail, red-zone movement). Locked until every day
// is complete.

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  api,
  ApiClientError,
  type BootCampMasteryCompleteResponse,
} from "@/lib/api-client";
import QuestionRunner from "@/components/question-runner";
import { humanizeTag, masteryBand, pct } from "@/lib/boot-camps";
import { trackBootcampCompleted, trackBootcampXpEarned, trackBootcampBadgeUnlocked, trackBootcampStreakExtended } from "@/lib/analytics";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import Celebration from "@/components/gamification/celebration";
import { badgeMeta, formatXp } from "@/lib/gamification";
import { userFacingResourceError } from "@/lib/user-facing-errors";

interface MasteryData {
  slug: string;
  displayName: string;
  setId: string;
  questionIds: string[];
  answeredQuestionIds: string[];
  initialCorrect: number;
  threshold: number;
}

type State =
  | { phase: "loading" }
  | { phase: "running"; data: MasteryData }
  | { phase: "scored"; data: MasteryData; result: BootCampMasteryCompleteResponse }
  | { phase: "locked" }
  | { phase: "error"; message: string };

export default function BootCampMasteryPage({
  params,
}: {
  params: Promise<{ session_id: string }>;
}) {
  const { session_id: sessionId } = use(params);
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [state, setState] = useState<State>({ phase: "loading" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    let active = true;
    if (!isSignedIn) {
      queueMicrotask(() => {
        if (active) {
          setState({ phase: "error", message: "Sign in to resume this mastery check." });
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
          setState({ phase: "error", message: "Sign in to resume this mastery check." });
          return;
        }
        const [session, masteryStart] = await Promise.all([
          api.getBootCampSession(sessionId, token, { cache: "no-store" }),
          api.startBootCampMastery(sessionId, token),
        ]);
        if (!active) return;
        setState({
          phase: "running",
          data: {
            slug: session.slug,
            displayName: session.display_name,
            setId: masteryStart.set_id,
            questionIds: masteryStart.question_ids,
            answeredQuestionIds: masteryStart.answered_question_ids,
            initialCorrect: masteryStart.correct_count,
            threshold: session.mastery_threshold,
          },
        });
      } catch (err: unknown) {
        if (!active) return;
        if (err instanceof ApiClientError && err.status === 409) {
          setState({ phase: "locked" });
          return;
        }
        setState({
          phase: "error",
          message:
            err instanceof ApiClientError
              ? userFacingResourceError(err, {
                  signedOut: "Sign in to resume this mastery check.",
                  forbidden: "Enrollment required to resume this mastery check.",
                  notFound: "This mastery check could not be found.",
                  unavailable: "This mastery check is temporarily unavailable.",
                })
              : "Mastery unavailable",
        });
      }
    })();
    return () => {
      active = false;
    };
  }, [getToken, isLoaded, isSignedIn, sessionId]);

  const onComplete = async () => {
    if (state.phase !== "running" || submitting) return;
    const slug = state.data.slug;
    setSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        setSubmitting(false);
        setState({ phase: "error", message: "Sign in to score this mastery check." });
        return;
      }
      const result = await api.completeBootCampMastery(sessionId, token);
      trackBootcampCompleted({
        bootcampId: slug,
        completionStatus: "completed",
        masteryPassed: result.mastered,
        postScore: result.mastery_score,
      });
      const grant = result.gamification;
      if (grant) {
        if (grant.xp_earned > 0) {
          trackBootcampXpEarned({ bootcampId: slug, xp: grant.xp_earned, source: "boot_camp_mastery" });
        }
        for (const badgeSlug of grant.badges_unlocked) {
          trackBootcampBadgeUnlocked({ bootcampId: slug, badgeSlug });
        }
        trackBootcampStreakExtended({ bootcampId: slug, streak: grant.current_streak });
      }
      setState({ phase: "scored", data: state.data, result });
    } catch (err) {
      setState({
        phase: "error",
        message:
          err instanceof ApiClientError && err.status === 401
            ? "Sign in to score this mastery check."
            : err instanceof ApiClientError && err.status === 403
              ? "Enrollment required to score this mastery check."
              : "Could not score mastery. Try again from the session hub.",
      });
    }
  };

  const shouldRenderRunnerHeading =
    state.phase === "loading" ||
    (state.phase === "running" && state.data.questionIds.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/boot-camps/sessions/${sessionId}`}
        className="font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-800"
      >
        &larr; Session hub
      </Link>

      {shouldRenderRunnerHeading && (
        <h1 className="sr-only">Boot Camp Mastery Check</h1>
      )}

      <div className="mt-6">
        {state.phase === "loading" && (
          <p className="text-zinc-700" aria-live="polite">
            Loading the mastery check…
          </p>
        )}

        {state.phase === "locked" && (
          <div className="border border-amber-300 bg-amber-50 p-8" aria-live="polite">
            <h1 className="font-serif text-2xl font-semibold text-amber-950">
              Mastery check is locked
            </h1>
            <p className="mt-3 text-sm leading-6 text-amber-900">
              Finish every day&apos;s drill block first. The mastery check unlocks once all
              days are complete.
            </p>
            <Link href={`/boot-camps/sessions/${sessionId}`} className="btn ghost mt-5">
              Back to session
            </Link>
          </div>
        )}

        {state.phase === "error" && (
          <div className="border border-amber-300 bg-amber-50 p-8" aria-live="polite">
            <h1 className="font-serif text-2xl font-semibold text-amber-950">
              Mastery check unavailable
            </h1>
            <p className="mt-3 font-mono text-xs text-amber-800">{state.message}</p>
            <Link href={`/boot-camps/sessions/${sessionId}`} className="btn ghost mt-5">
              Back to session
            </Link>
          </div>
        )}

        {state.phase === "running" && state.data.questionIds.length === 0 && (
          <div className="border border-zinc-300 bg-white p-8">
            <h1 className="font-serif text-2xl font-semibold text-zinc-900">
              No mastery questions pinned yet
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              This camp&apos;s bank is still loading. Your day progress is saved.
            </p>
            <Link href={`/boot-camps/sessions/${sessionId}`} className="btn ghost mt-5">
              Back to session
            </Link>
          </div>
        )}

        {state.phase === "running" && state.data.questionIds.length > 0 && (
          <QuestionRunner
            questionIds={state.data.questionIds}
            setId={state.data.setId}
            answeredQuestionIds={state.data.answeredQuestionIds}
            initialCorrect={state.data.initialCorrect}
            title="Mastery check"
            completeLabel={submitting ? "Scoring…" : "Submit mastery check"}
            onComplete={onComplete}
          />
        )}

        {state.phase === "scored" && (
          <MasteryResult sessionId={sessionId} data={state.data} result={state.result} />
        )}
      </div>
    </div>
  );
}

function MasteryResult({
  sessionId,
  data,
  result,
}: {
  sessionId: string;
  data: MasteryData;
  result: BootCampMasteryCompleteResponse;
}) {
  const scorePct = pct(result.mastery_score);
  const band = masteryBand(result.mastery_score);
  const barClass =
    band.tone === "critical"
      ? "bg-red-700"
      : band.tone === "watch"
        ? "bg-orange-600"
        : "bg-emerald-700";

  return (
    <div
      className={`rounded-lg border p-8 shadow-sm ${
        result.mastered ? "border-emerald-300 bg-emerald-50" : "border-zinc-300 bg-white"
      }`}
      role="status"
    >
      <Celebration trigger={result.mastered} />
      <p
        className={`font-mono text-xs uppercase tracking-wider ${
          result.mastered ? "text-emerald-700" : "text-amber-700"
        }`}
      >
        {result.mastered ? "Camp complete" : "Mastery not yet reached"}
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-zinc-900">
        {data.displayName}
      </h1>

      <p className="mt-4 font-serif text-5xl font-semibold text-zinc-950">{scorePct}%</p>
      <div
        className="mt-3 h-2 w-full overflow-hidden bg-zinc-100"
        aria-label={`Mastery score ${scorePct}%`}
      >
        <div className={`h-full ${barClass}`} style={{ width: `${scorePct}%` }} />
      </div>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-zinc-500">
        {band.label} · pass at {Math.round(data.threshold * 100)}%
        {typeof result.correct === "number" && typeof result.total === "number"
          ? ` · ${result.correct}/${result.total} correct`
          : ""}
      </p>

      {result.gamification && (
        <div className="mt-5 border-t border-zinc-200 pt-5">
          {result.gamification.xp_earned > 0 && (
            <p className="text-lg font-semibold text-emerald-800">
              +{formatXp(result.gamification.xp_earned)} XP
            </p>
          )}
          {result.gamification.current_streak > 0 && (
            <p className="mt-1 font-mono text-xs uppercase tracking-wide text-zinc-600">
              🔥 {result.gamification.current_streak}-day streak
            </p>
          )}
          {result.gamification.badges_unlocked.length > 0 && (
            <ul className="mt-3 space-y-1">
              {result.gamification.badges_unlocked.map((slug) => {
                const meta = badgeMeta(slug);
                return (
                  <li key={slug} className="text-sm text-zinc-800">
                    {meta.emoji} Badge unlocked: <strong>{meta.label}</strong>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {result.red_zone_deltas.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Red-zone movement
          </p>
          <ul className="mt-2 space-y-2">
            {result.red_zone_deltas.map((delta) => (
              <li
                key={`${delta.dimension}:${delta.tag}`}
                className="flex items-center justify-between border border-zinc-200 bg-white px-3 py-2 text-sm"
              >
                <span className="text-zinc-800">{humanizeTag(delta.tag)}</span>
                <span className="font-mono text-xs text-zinc-600">
                  {pct(delta.proficiency_score)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-7 flex flex-wrap gap-3">
        {result.mastered ? (
          <>
            <Link href="/red-zones" className="btn red">
              View Red-Zone Map
            </Link>
            <Link href="/boot-camps" className="btn ghost">
              Browse more camps
            </Link>
          </>
        ) : (
          <>
            <button type="button" onClick={() => window.location.reload()} className="btn red">
              Retry mastery check
            </button>
            <Link href={`/boot-camps/sessions/${sessionId}`} className="btn ghost">
              Back to session
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
