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
import { trackDrillCompleted, trackDrillStarted, trackBootcampXpEarned, trackBootcampBadgeUnlocked, trackBootcampStreakExtended } from "@/lib/analytics";
import Celebration from "@/components/gamification/celebration";
import { badgeMeta, formatXp } from "@/lib/gamification";
import type { BootCampGamificationGrant } from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

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
  | { phase: "error"; message: string }
  | { phase: "celebrating"; grant: BootCampGamificationGrant };

export default function BootCampDayPage({
  params,
}: {
  params: Promise<{ session_id: string; day: string }>;
}) {
  const { session_id: sessionId, day: dayStr } = use(params);
  const day = Number.parseInt(dayStr, 10);
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [state, setState] = useState<State>({ phase: "loading" });
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    let active = true;
    if (!isSignedIn) {
      queueMicrotask(() => {
        if (active) {
          setState({ phase: "error", message: "Sign in to resume this boot camp day." });
        }
      });
      return () => {
        active = false;
      };
    }
    if (!Number.isInteger(day) || day < 1) {
      queueMicrotask(() => {
        if (active) setState({ phase: "error", message: "Invalid day" });
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
          setState({ phase: "error", message: "Sign in to resume this boot camp day." });
          return;
        }
        const [session, dayStart] = await Promise.all([
          api.getBootCampSession(sessionId, token, { cache: "no-store" }),
          api.startBootCampDay(sessionId, day, token),
        ]);
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
      } catch (err: unknown) {
        if (!active) return;
        if (err instanceof ApiClientError && err.status === 409) {
          setState({ phase: "locked" });
          return;
        }
        setState({
          phase: "error",
          message:
            err instanceof ApiClientError && err.status === 401
              ? "Sign in to resume this boot camp day."
              : err instanceof ApiClientError && err.status === 403
                ? "Enrollment required to resume this boot camp day."
                : err instanceof ApiClientError
                  ? `API ${err.status}`
                  : "Day unavailable",
        });
      }
    })();
    return () => {
      active = false;
    };
  }, [day, getToken, isLoaded, isSignedIn, sessionId]);

  const onComplete = async (summary: RunnerSummary) => {
    if (state.phase !== "ready" || finishing) return;
    setFinishing(true);
    try {
      const token = await getToken();
      if (!token) {
        setFinishing(false);
        setState({ phase: "error", message: "Sign in to save this boot camp day." });
        return;
      }
      const slug = state.data.slug;
      const result = await api.completeBootCampDay(sessionId, day, token);
      trackDrillCompleted({
        drillId: `${slug}-day-${day}`,
        completionStatus: "completed",
        questionCount: summary.total,
        correctCount: summary.correct,
        masteryPassed: result.passed,
      });
      const grant = result.gamification;
      if (grant && (grant.xp_earned > 0 || grant.badges_unlocked.length > 0)) {
        if (grant.xp_earned > 0) {
          trackBootcampXpEarned({ bootcampId: slug, xp: grant.xp_earned, source: "boot_camp_day" });
        }
        for (const badgeSlug of grant.badges_unlocked) {
          trackBootcampBadgeUnlocked({ bootcampId: slug, badgeSlug });
        }
        trackBootcampStreakExtended({ bootcampId: slug, streak: grant.current_streak });
        setState({ phase: "celebrating", grant });
        setFinishing(false);
        return;
      }
      router.push(`/boot-camps/sessions/${sessionId}`);
    } catch (err) {
      if (err instanceof ApiClientError && (err.status === 401 || err.status === 403)) {
        setFinishing(false);
        setState({
          phase: "error",
          message:
            err.status === 401
              ? "Sign in to save this boot camp day."
              : "Enrollment required to save this boot camp day.",
        });
        return;
      }
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

        {state.phase === "celebrating" && (
          <div className="border border-emerald-300 bg-emerald-50 p-8" role="status">
            <Celebration trigger />
            <h1 className="font-serif text-2xl font-semibold text-emerald-900">Day complete!</h1>
            {state.grant.xp_earned > 0 && (
              <p className="mt-3 text-lg text-emerald-800">+{formatXp(state.grant.xp_earned)} XP</p>
            )}
            {state.grant.current_streak > 0 && (
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-emerald-700">
                🔥 {state.grant.current_streak}-day streak
              </p>
            )}
            {state.grant.badges_unlocked.length > 0 && (
              <ul className="mt-4 space-y-1">
                {state.grant.badges_unlocked.map((badgeSlug) => {
                  const meta = badgeMeta(badgeSlug);
                  return (
                    <li key={badgeSlug} className="text-sm text-emerald-900">
                      {meta.emoji} Badge unlocked: <strong>{meta.label}</strong>
                    </li>
                  );
                })}
              </ul>
            )}
            <button
              type="button"
              onClick={() => router.push(`/boot-camps/sessions/${sessionId}`)}
              className="btn red mt-6"
            >
              Back to session
            </button>
          </div>
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
