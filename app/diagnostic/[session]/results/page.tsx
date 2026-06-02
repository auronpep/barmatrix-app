"use client";

// Results page after a diagnostic session completes.
//
// Renders a real, computed Red-Zone *preview* from the session's own attempts
// (GET /api/diagnostic/:id/results, keyed by set_id = diagnostic id). This works
// for anonymous pre-enrollment takers and is NOT persisted — saving the map and
// unlocking repair drills is what enrollment buys. The persistent user_red_zones
// surface stays gated; this is the lead-magnet preview the funnel promises.

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  api,
  type DiagnosticResultsResponse,
  type DiagnosticTrapPattern,
  type DiagnosticRedZoneEntry,
} from "@/lib/api-client";
import {
  trackDiagnosticCompletedOnce,
  trackRedZonePreviewViewedOnce,
} from "@/lib/analytics";
import { PRICING } from "@/lib/copy";
import { useDashboard, type DashboardState } from "@/lib/use-dashboard";
import { userFacingResourceError } from "@/lib/user-facing-errors";

const DIMENSION_LABELS: Record<string, string> = {
  subject: "By subject",
  subtopic: "By subtopic",
  tension_point: "By tension point",
  wrong_answer_architecture: "By wrong-answer architecture",
};

function scoreBandFromPct(pct: number): string {
  if (pct < 50) return "0_49";
  if (pct < 70) return "50_69";
  if (pct < 85) return "70_84";
  return "85_100";
}

function topTrapTags(results: DiagnosticResultsResponse): string[] {
  const tags = results.top_trap_patterns.map((p) => p.tag).slice(0, 5);
  return tags.length > 0 ? tags : ["none"];
}

function humanizeTag(tag: string): string {
  if (!tag.includes("_")) return tag;
  return tag
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function DiagnosticResultsPage({
  params,
}: {
  params: Promise<{ session: string }>;
}) {
  const { session: diagnosticId } = use(params);
  const completedEventRef = useRef<string | null>(null);
  const [results, setResults] = useState<DiagnosticResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dashboard = useDashboard();

  useEffect(() => {
    let active = true;

    const trackCompletion = (
      response: DiagnosticResultsResponse | null,
      includePreview = false,
    ) => {
      if (completedEventRef.current === diagnosticId) return;
      const tags = response ? topTrapTags(response) : ["none"];
      const scoreBand = response
        ? scoreBandFromPct(response.summary.score_pct)
        : "red_zone_unavailable";
      trackDiagnosticCompletedOnce({
        sessionId: diagnosticId,
        topTrapTags: tags,
        scoreBand,
      });
      if (includePreview) {
        trackRedZonePreviewViewedOnce({
          trapTags: tags,
          sessionId: diagnosticId,
          dedupeKey: `diagnostic-results:${diagnosticId}`,
        });
      }
      completedEventRef.current = diagnosticId;
    };

    api
      .getDiagnosticResults(diagnosticId)
      .then((response) => {
        if (!active) return;
        setResults(response);
        trackCompletion(response, response.answered > 0);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          userFacingResourceError(err, {
            notFound: "This diagnostic session could not be found.",
            unavailable: "Diagnostic results are temporarily unavailable.",
          }),
        );
        trackCompletion(null);
      });

    return () => {
      active = false;
    };
  }, [diagnosticId]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Diagnostic complete
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
        Your Red-Zone Map
      </h1>
      <p className="mt-4 text-lg text-zinc-600">
        {results && results.answered > 0
          ? `The trap patterns most likely costing you points, ranked from ${results.answered} diagnostic question${results.answered === 1 ? "" : "s"}.`
          : "The trap patterns most likely costing you points, ranked from your answers."}
      </p>

      {!results && !error && <ResultsLoading />}
      {error && <ResultsError message={error} />}

      {results && results.answered === 0 && !error && <NoSessionPanel />}

      {results && results.answered > 0 && (
        <>
          <SummaryCard results={results} />
          <TopTrapPatterns patterns={results.top_trap_patterns} />
          <DimensionBreakdown byDimension={results.red_zones.by_dimension} />
          <ResultsCta dashboard={dashboard} />
        </>
      )}

      {!error && (
        <div className="mt-10">
          <Link
            href="/diagnostic"
            className="text-sm text-zinc-600 underline hover:text-zinc-900"
          >
            Run the diagnostic again
          </Link>
        </div>
      )}
    </section>
  );
}

function SummaryCard({ results }: { results: DiagnosticResultsResponse }) {
  const s = results.summary;
  const stats: Array<{ label: string; value: string; alert?: boolean }> = [
    { label: "Score", value: `${s.correct}/${s.total} · ${s.score_pct}%` },
    { label: "Avg confidence", value: `${s.avg_confidence}/5` },
    { label: "Avg time", value: `${s.avg_time_seconds}s` },
    {
      label: "High-confidence misses",
      value: String(s.high_confidence_misses),
      alert: s.high_confidence_misses > 0,
    },
  ];
  return (
    <div className="mt-10 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Diagnostic summary
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">
              {stat.label}
            </dt>
            <dd
              className={`mt-1 font-serif text-2xl font-semibold ${
                stat.alert ? "text-red-700" : "text-zinc-900"
              }`}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SeverityChip({ severity }: { severity: "high" | "medium" }) {
  const high = severity === "high";
  return (
    <span
      className={`shrink-0 rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${
        high
          ? "border-red-700 bg-red-600 text-white"
          : "border-amber-300 bg-amber-100 text-amber-900"
      }`}
    >
      {high ? "High priority" : "Medium"}
    </span>
  );
}

function TopTrapPatterns({ patterns }: { patterns: DiagnosticTrapPattern[] }) {
  if (patterns.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-emerald-300 bg-emerald-50 p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-700">
          No red zones surfaced
        </p>
        <p className="mt-2 text-zinc-800">
          You did not fall into a repeated trap pattern on this set. Enroll to run
          the full forensic bank and keep your Red-Zone Map building as you drill.
        </p>
      </div>
    );
  }
  return (
    <div className="mt-8">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Top trap patterns
      </p>
      <ul className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        {patterns.map((p) => (
          <li key={`${p.dimension}:${p.tag}`} className="flex items-center gap-4 p-4">
            <span className="font-mono text-sm tabular-nums text-zinc-400">
              {String(p.rank).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg font-semibold text-zinc-900">
                {p.label}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                {p.subject ? `${p.subject} · ` : ""}
                {p.attempts} miss{p.attempts === 1 ? "" : "es"}
                {p.high_confidence_wrongs > 0
                  ? ` · ${p.high_confidence_wrongs} high-confidence`
                  : ""}
              </p>
            </div>
            <SeverityChip severity={p.severity} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DimensionBreakdown({
  byDimension,
}: {
  byDimension: Record<string, DiagnosticRedZoneEntry[]>;
}) {
  const dimensions = Object.entries(byDimension).filter(
    ([, zones]) => zones.length > 0,
  );
  if (dimensions.length === 0) return null;
  return (
    <div className="mt-8 space-y-4">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Full breakdown
      </p>
      {dimensions.map(([dimension, zones]) => (
        <div
          key={dimension}
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            {DIMENSION_LABELS[dimension] ?? humanizeTag(dimension)}
          </p>
          <ul className="mt-3 space-y-2">
            {zones.map((z) => (
              <li
                key={z.tag}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-zinc-800">{humanizeTag(z.tag)}</span>
                <span className="font-mono text-xs text-zinc-500">
                  {Math.round(z.proficiency_score * 100)}% · {z.attempts} attempt
                  {z.attempts === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ResultsCta({ dashboard }: { dashboard: DashboardState }) {
  if (dashboard.data?.enrolled === true) {
    return <EnrolledCta />;
  }

  if (dashboard.signedIn && dashboard.loading) {
    return (
      <div className="mt-10 rounded-lg border border-zinc-300 bg-white p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Next step · Account
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
          Checking your enrollment...
        </h2>
        <p className="mt-3 text-zinc-600">
          Once your account status loads, this screen will point you to the right
          repair path.
        </p>
      </div>
    );
  }

  if (dashboard.signedIn && dashboard.error) {
    return <AccountCta />;
  }

  return <EnrollCta />;
}

function EnrolledCta() {
  return (
    <div className="mt-10 rounded-lg border border-zinc-900 bg-zinc-900 p-8 text-white">
      <p className="font-mono text-xs uppercase tracking-wider text-red-400">
        Next step · Keep repairing
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
        Your diagnostic is ready. Keep working from your dashboard.
      </h2>
      <p className="mt-3 text-zinc-300">
        Use your active BarMatrix access to turn this preview into saved red-zone
        repair, assigned drills, and ongoing forensics.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard" className="btn red">
          Open dashboard
        </Link>
        <Link
          href="/red-zones"
          className="btn ghost border-zinc-600 text-white"
        >
          Review red zones
        </Link>
      </div>
    </div>
  );
}

function AccountCta() {
  return (
    <div className="mt-10 rounded-lg border border-zinc-900 bg-zinc-900 p-8 text-white">
      <p className="font-mono text-xs uppercase tracking-wider text-red-400">
        Next step · Account
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
        Open your dashboard to continue.
      </h2>
      <p className="mt-3 text-zinc-300">
        We could not confirm enrollment from this screen, but your signed-in
        dashboard can route you to the right next step.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard" className="btn red">
          Open dashboard
        </Link>
        <Link
          href="/pricing"
          className="btn ghost border-zinc-600 text-white"
        >
          View pricing
        </Link>
      </div>
    </div>
  );
}

function EnrollCta() {
  return (
    <div className="mt-10 rounded-lg border border-zinc-900 bg-zinc-900 p-8 text-white">
      <p className="font-mono text-xs uppercase tracking-wider text-red-400">
        Next step · Enroll
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
        Save your Red-Zone Map and start closing these traps.
      </h2>
      <p className="mt-3 text-zinc-300">
        Enrolling saves this map to your account and unlocks your repair drills,
        the full 2,400-question forensic bank, Wrong Answer Forensics on every
        miss, and full web access.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/pricing" className="btn red">
          Enroll for {PRICING.priceLabel}
        </Link>
        <Link
          href="/how-it-works"
          className="btn ghost border-zinc-600 text-white"
        >
          How it works
        </Link>
      </div>
    </div>
  );
}

function NoSessionPanel() {
  return (
    <div className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        No answers recorded
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-zinc-900">
        This diagnostic session has no recorded answers yet.
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">
        Start a fresh diagnostic to build your Red-Zone Map. If you just finished
        one, the session may not have been saved — run it again.
      </p>
      <div className="mt-6">
        <Link href="/diagnostic" className="btn red">
          Start the diagnostic
        </Link>
      </div>
    </div>
  );
}

function ResultsLoading() {
  return (
    <div className="mt-10 border border-zinc-900 bg-white p-8" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Building Red-Zone Map
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold">
        Reading diagnostic patterns...
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {["Subject clusters", "Trap families", "Confidence misses", "Score summary"].map(
          (label) => (
            <div key={label} className="border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                {label}
              </p>
              <div className="mt-3 h-2 w-full bg-zinc-200" aria-hidden="true" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function ResultsError({ message }: { message: string }) {
  return (
    <div className="mt-10 border border-red-300 bg-red-50 p-8" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Red-Zone Map unavailable
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-red-950">
        The diagnostic completed, but the map could not load.
      </h2>
      <p className="mt-3 text-sm leading-6 text-red-900">
        Retry the diagnostic, or come back once the API is reachable.
      </p>
      <p className="mt-3 font-mono text-xs text-red-800">{message}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/diagnostic" className="btn red">
          Run diagnostic again
        </Link>
        <Link href="/pricing" className="btn ghost">
          View pricing
        </Link>
      </div>
    </div>
  );
}
