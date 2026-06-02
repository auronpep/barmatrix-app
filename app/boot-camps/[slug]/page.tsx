"use client";

// Boot camp detail — overview, day plan, tension/trap targets, and the
// start/resume CTA. Starting (or resuming) routes into the session hub.

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiClientError, type BootCampDetail } from "@/lib/api-client";
import { humanizeTag } from "@/lib/boot-camps";
import { trackBootcampStarted } from "@/lib/analytics";
import { useClerkAuth } from "@/lib/use-clerk-auth";

type State =
  | { phase: "loading" }
  | { phase: "ready"; camp: BootCampDetail }
  | { phase: "error"; message: string };

export default function BootCampDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [state, setState] = useState<State>({ phase: "loading" });
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .getBootCamp(slug, { cache: "no-store" })
      .then((camp) => {
        if (active) setState({ phase: "ready", camp });
      })
      .catch((err: unknown) => {
        if (active)
          setState({
            phase: "error",
            message: err instanceof ApiClientError ? `API ${err.status}` : "Camp unavailable",
          });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const start = async () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setStartError("Sign in to start this boot camp.");
      return;
    }
    setStarting(true);
    setStartError(null);
    try {
      const token = await getToken();
      const res = await api.startBootCamp(slug, {}, token);
      trackBootcampStarted({ bootcampId: slug, source: "manual" });
      router.push(`/boot-camps/sessions/${res.session_id}`);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        setStartError("Sign in to start this boot camp.");
      } else if (err instanceof ApiClientError && err.status === 403) {
        setStartError("Enrollment required — enroll at barmatrix.app/checkout.");
      } else {
        setStartError(
          err instanceof ApiClientError ? `API ${err.status}` : "Could not start the camp",
        );
      }
      setStarting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <Link href="/boot-camps" className="font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-800">
        &larr; All boot camps
      </Link>

      {state.phase === "loading" && (
        <p className="mt-8 text-zinc-700" aria-live="polite">
          Loading camp…
        </p>
      )}

      {state.phase === "error" && (
        <div className="mt-8 border border-amber-300 bg-amber-50 p-8" aria-live="polite">
          <p className="font-mono text-xs uppercase tracking-wider text-amber-700">
            Camp unavailable
          </p>
          <h1 className="mt-3 font-serif text-2xl font-semibold text-amber-950">
            This boot camp could not be loaded.
          </h1>
          <p className="mt-3 font-mono text-xs text-amber-800">{state.message}</p>
          <Link href="/boot-camps" className="btn ghost mt-6">
            Back to catalog
          </Link>
        </div>
      )}

      {state.phase === "ready" && (
        <>
          <div className="mt-6 border-b border-zinc-200 pb-8">
            <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              <span className="border border-zinc-200 px-2 py-1">{state.camp.subject}</span>
              <span className="border border-zinc-200 px-2 py-1">{state.camp.day_count} days</span>
              <span className="border border-zinc-200 px-2 py-1">
                {state.camp.questions_per_day} questions/day
              </span>
              <span className="border border-zinc-200 px-2 py-1">
                Mastery {Math.round(state.camp.mastery_threshold * 100)}%
              </span>
            </div>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              {state.camp.display_name}
            </h1>
            {state.camp.description && (
              <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
                {state.camp.description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button type="button" onClick={start} disabled={starting} className="btn btn-lg red">
                {starting ? "Starting…" : "Start camp"}
              </button>
              {startError && (
                <span className="font-mono text-xs text-red-700" role="alert">
                  {startError}
                </span>
              )}
            </div>
          </div>

          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">Day plan</p>
              <ol className="mt-3 grid gap-3 sm:grid-cols-2">
                {state.camp.day_plan.map((d) => (
                  <li key={d.day} className="border border-zinc-200 bg-white p-4 shadow-sm">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
                      Day {d.day}
                    </p>
                    <p className="mt-2 text-sm font-medium text-zinc-900">
                      {d.questions_per_day}-question drill block
                    </p>
                  </li>
                ))}
                <li className="border border-zinc-900 bg-zinc-900 p-4 text-white shadow-sm">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                    Finish
                  </p>
                  <p className="mt-2 text-sm font-medium">Mastery check</p>
                </li>
              </ol>
            </div>

            <aside className="border border-zinc-200 bg-zinc-50 p-4">
              <TagGroup label="Tension points" values={state.camp.target_tensions} />
              <TagGroup label="Trap architectures" values={state.camp.target_traps} />
            </aside>
          </section>
        </>
      )}
    </div>
  );
}

function TagGroup({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div className="mt-2 first:mt-0">
      <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-zinc-500 first:mt-0">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
          >
            {humanizeTag(value)}
          </span>
        ))}
      </div>
    </div>
  );
}
