"use client";

// Boot camp session hub — per-day progress chips, the current-day CTA, and the
// mastery CTA once every day is complete. This is the resume landing page: it
// re-reads server progress on every visit, so closing the tab and reopening the
// session URL lands you exactly where you left off.

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiClientError, type BootCampSession } from "@/lib/api-client";
import { bootCampProgress, dayChipLabel, pct } from "@/lib/boot-camps";
import { useClerkAuth } from "@/lib/use-clerk-auth";

type State =
  | { phase: "loading" }
  | { phase: "ready"; session: BootCampSession }
  | { phase: "error"; message: string };

export default function BootCampSessionPage({
  params,
}: {
  params: Promise<{ session_id: string }>;
}) {
  const { session_id: sessionId } = use(params);
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [state, setState] = useState<State>({ phase: "loading" });

  useEffect(() => {
    if (!isLoaded) return;
    let active = true;
    if (!isSignedIn) {
      queueMicrotask(() => {
        if (active) {
          setState({ phase: "error", message: "Sign in to resume this boot camp." });
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
          setState({ phase: "error", message: "Sign in to resume this boot camp." });
          return;
        }
        const session = await api.getBootCampSession(sessionId, token, { cache: "no-store" });
        if (active) setState({ phase: "ready", session });
      } catch (err: unknown) {
        if (active)
          setState({
            phase: "error",
            message:
              err instanceof ApiClientError && err.status === 401
                ? "Sign in to resume this boot camp."
                : err instanceof ApiClientError && err.status === 403
                  ? "Enrollment required to resume this boot camp."
                  : err instanceof ApiClientError
                    ? `API ${err.status}`
                    : "Session unavailable",
          });
      }
    })();
    return () => {
      active = false;
    };
  }, [getToken, isLoaded, isSignedIn, sessionId]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <Link
        href="/boot-camps"
        className="font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-800"
      >
        &larr; All boot camps
      </Link>

      {state.phase === "loading" && (
        <p className="mt-8 text-zinc-700" aria-live="polite">
          Loading your progress…
        </p>
      )}

      {state.phase === "error" && (
        <div className="mt-8 border border-amber-300 bg-amber-50 p-8" aria-live="polite">
          <p className="font-mono text-xs uppercase tracking-wider text-amber-700">
            Session unavailable
          </p>
          <p className="mt-3 font-mono text-xs text-amber-800">{state.message}</p>
          <Link href="/boot-camps" className="btn ghost mt-6">
            Back to catalog
          </Link>
        </div>
      )}

      {state.phase === "ready" && <SessionHub session={state.session} />}
    </main>
  );
}

function SessionHub({ session }: { session: BootCampSession }) {
  const progress = bootCampProgress(session.days);
  const masteryUnlocked = session.mastery.unlocked;
  const completed = session.status === "completed";
  const currentDay = session.days.find((d) => d.status === "current");

  return (
    <>
      <div className="mt-6 border-b border-zinc-200 pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          {session.subject} boot camp
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-zinc-950">
          {session.display_name}
        </h1>

        <div
          className="mt-6 h-2 w-full overflow-hidden bg-zinc-100"
          aria-label={`Camp progress ${progress.pct}%`}
        >
          <div className="h-full bg-emerald-700" style={{ width: `${progress.pct}%` }} />
        </div>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-zinc-500">
          {progress.completed} of {progress.total} days complete
          {completed ? " · camp complete" : ""}
        </p>
      </div>

      <section className="mt-8" aria-label="Day progress">
        <div className="grid gap-3 sm:grid-cols-2">
          {session.days.map((day) => {
            const reviewable = day.status === "complete" || day.status === "current";
            const inner = (
              <div
                className={`flex h-full items-start justify-between gap-3 border p-4 ${
                  day.status === "current"
                    ? "border-zinc-900 bg-white"
                    : day.status === "complete"
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Day {day.day}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    {day.status === "complete"
                      ? "Complete"
                      : day.status === "current"
                        ? "Available now"
                        : "Locked"}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-zinc-500">
                  {day.answered}/{day.total}
                </span>
              </div>
            );
            return reviewable ? (
              <Link
                key={day.day}
                href={`/boot-camps/sessions/${session.session_id}/days/${day.day}`}
                aria-label={dayChipLabel(day)}
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700"
              >
                {inner}
              </Link>
            ) : (
              <div key={day.day} aria-label={dayChipLabel(day)} aria-disabled="true">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">Next step</p>
        {completed ? (
          <CompletedPanel session={session} />
        ) : masteryUnlocked ? (
          <MasteryCallout session={session} />
        ) : currentDay ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-2xl font-semibold text-zinc-900">
              Continue Day {currentDay.day}
            </h2>
            <Link
              href={`/boot-camps/sessions/${session.session_id}/days/${currentDay.day}`}
              className="btn red"
            >
              {currentDay.answered > 0 ? "Resume day" : "Start day"}
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-zinc-700">All days complete — mastery check is unlocking.</p>
        )}
      </section>
    </>
  );
}

function MasteryCallout({ session }: { session: BootCampSession }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-zinc-900">Mastery check unlocked</h2>
        <p className="mt-1 text-sm text-zinc-700">
          {session.mastery.total} mixed questions · pass at{" "}
          {Math.round(session.mastery_threshold * 100)}%.
        </p>
      </div>
      <Link href={`/boot-camps/sessions/${session.session_id}/mastery`} className="btn red">
        {session.mastery.answered > 0 ? "Resume mastery check" : "Start mastery check"}
      </Link>
    </div>
  );
}

function CompletedPanel({ session }: { session: BootCampSession }) {
  return (
    <div className="mt-3" role="status">
      <h2 className="font-serif text-2xl font-semibold text-emerald-800">Camp complete</h2>
      <p className="mt-2 text-zinc-700">
        Mastery score {pct(session.mastery.score)}%. Your Red-Zone Map reflects this repair.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/red-zones" className="btn red">
          View Red-Zone Map
        </Link>
        <Link href="/boot-camps" className="btn ghost">
          Browse more camps
        </Link>
      </div>
    </div>
  );
}
