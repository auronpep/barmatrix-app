"use client";

// Per-student history block for /traps/[slug]. Signed-in: totals + the most
// recent times this trap caught the student. Anonymous: a slim sign-in prompt.
// Fails soft — any error renders nothing (the public detail page is unaffected).

import { useEffect } from "react";
import Link from "next/link";
import { useMyTrapHistory } from "@/lib/use-my-traps";
import { trackTrapHistoryViewedOnce } from "@/lib/analytics";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function YourTrapHistory({ slug }: { slug: string }) {
  const state = useMyTrapHistory(slug);
  const data = state.data;

  useEffect(() => {
    if (!data) return;
    trackTrapHistoryViewedOnce({ slug, fellCount: data.fell_count });
  }, [data, slug]);

  if (!state.signedIn) {
    if (state.loading) return null;
    return (
      <div className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-5">
        <p className="text-sm text-zinc-600">
          <Link href="/sign-in" className="font-medium underline underline-offset-4 hover:text-zinc-900">
            Sign in
          </Link>{" "}
          to see your history with this trap — how many times it has caught you and where.
        </p>
      </div>
    );
  }

  if (state.loading || state.error || !data) return null;

  if (data.fell_count === 0) {
    return (
      <div className="mt-10 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-700">Your history</p>
        <p className="mt-2 text-sm text-zinc-700">
          This trap hasn&apos;t caught you yet. Keep it that way — study the examples below so
          you can spot it on sight.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-lg border border-zinc-300 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">Your history</p>
        <span className="font-mono text-xs text-zinc-500">
          fell {data.fell_count}×
          {data.confident_fell_count > 0 && (
            <span className="ml-2 text-red-700">{data.confident_fell_count} confident</span>
          )}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        The most recent questions where this architecture caught you. Re-read each
        &ldquo;why it&apos;s attractive&rdquo; before the &ldquo;why it&apos;s wrong.&rdquo;
      </p>
      <ul className="mt-4 space-y-3">
        {data.recent.map((occ) => (
          <li key={occ.attempt_id} className="rounded-lg border border-zinc-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                {occ.external_id ?? "—"} · {occ.subject} · Chose {occ.selected_letter}
                {occ.confidence !== null && <> · confidence {occ.confidence}/5</>}
              </span>
              <span className="font-mono text-[11px] text-zinc-400">{formatDate(occ.attempted_at)}</span>
            </div>
            {occ.why_wrong && (
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                <span className="font-medium text-red-700">Why it was wrong: </span>
                {occ.why_wrong}
              </p>
            )}
            {occ.future_cue && (
              <p className="mt-1 text-sm leading-6 text-zinc-700">
                <span className="font-medium text-emerald-700">Spot it next time: </span>
                {occ.future_cue}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
