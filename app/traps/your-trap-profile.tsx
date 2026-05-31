"use client";

// Client personalization layer for the public /traps catalog. Fetches the
// signed-in student's trap profile ONCE (useMyTrapProfile) and exposes it via
// context so (a) the ranked <YourTrapProfile> panel and (b) each row's
// <PersonalTrapBadge> render without N fetches. Anonymous users see nothing
// extra; the server-rendered catalog is untouched.

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { useMyTrapProfile, type MyTrapProfileState } from "@/lib/use-my-traps";
import type { MyTrapEntry } from "@/lib/api-client";
import { trackTrapProfileViewedOnce } from "@/lib/analytics";

interface ProfileContextValue {
  signedIn: boolean;
  loading: boolean;
  bySlug: Map<string, MyTrapEntry>;
}

const ProfileContext = createContext<ProfileContextValue>({
  signedIn: false,
  loading: false,
  bySlug: new Map(),
});

const TOP_N = 5;

export function TrapProfileProvider({ children }: { children: ReactNode }) {
  const state = useMyTrapProfile();
  const bySlug = useMemo(() => {
    const map = new Map<string, MyTrapEntry>();
    for (const t of state.data?.traps ?? []) map.set(t.slug, t);
    return map;
  }, [state.data]);

  return (
    <ProfileContext.Provider value={{ signedIn: state.signedIn, loading: state.loading, bySlug }}>
      <YourTrapProfile state={state} />
      {children}
    </ProfileContext.Provider>
  );
}

function YourTrapProfile({ state }: { state: MyTrapProfileState }) {
  const data = state.data;
  const top = useMemo(() => (data?.traps ?? []).slice(0, TOP_N), [data]);

  useEffect(() => {
    if (!data || data.traps.length === 0) return;
    trackTrapProfileViewedOnce({
      distinctTraps: data.metrics.distinct_traps,
      totalFalls: data.metrics.total_falls,
    });
  }, [data]);

  // Anonymous or still resolving Clerk: render nothing (no CTA flash).
  if (!state.signedIn) return null;
  if (state.loading || !data) return null;
  if (data.traps.length === 0) {
    return (
      <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">Your trap profile</p>
        <p className="mt-2 text-sm text-zinc-600">
          No traps caught you yet. As you practice, the wrong-answer architectures you
          fall for most will rank here.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 rounded-lg border border-zinc-300 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">Your trap profile</p>
        <span className="font-mono text-xs text-zinc-500">
          {data.metrics.total_falls} {data.metrics.total_falls === 1 ? "fall" : "falls"} ·{" "}
          {data.metrics.distinct_traps} {data.metrics.distinct_traps === 1 ? "trap" : "traps"} ·{" "}
          {data.metrics.total_confident_falls} confident
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-600">The wrong-answer architectures that catch you most. Open one to study the repair.</p>
      <ol className="mt-4 space-y-2">
        {top.map((trap, i) => (
          <li key={trap.slug}>
            <Link
              href={`/traps/${encodeURIComponent(trap.slug)}`}
              className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 px-4 py-2.5 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="font-mono text-xs text-zinc-400">{i + 1}</span>
                <span className="truncate font-medium text-zinc-900">{trap.name}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-zinc-600">
                {trap.fell_count}×
                {trap.confident_fell_count > 0 && (
                  <span className="ml-2 text-red-700">{trap.confident_fell_count} confident</span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PersonalTrapBadge({ slug }: { slug: string }) {
  const { signedIn, bySlug } = useContext(ProfileContext);
  if (!signedIn) return null;
  const entry = bySlug.get(slug);
  if (!entry || entry.fell_count === 0) return null;
  const label = `you fell for this ${entry.fell_count} times${
    entry.confident_fell_count > 0 ? `, ${entry.confident_fell_count} with high confidence` : ""
  }`;
  return (
    <span
      aria-label={label}
      className="shrink-0 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-700"
    >
      you: {entry.fell_count}×
      {entry.confident_fell_count > 0 && <> · {entry.confident_fell_count} conf</>}
    </span>
  );
}
