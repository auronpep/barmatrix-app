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
import { useFoundations } from "@/lib/use-foundations";
import { userFacingResourceError } from "@/lib/user-facing-errors";
import { rememberDiagnosticId } from "@/lib/diagnostic-session";
import { AnchorStack } from "@/components/anchor-card";
import { humanizeSubject } from "@/lib/format-subject";

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

type RecommendedStep = {
  href: string;
  label: string;
  focus: string;
};

type BuiltRecommendation = {
  href: string;
  ctaLabel: string;
  levelBadge: string;
  levelLabel: string;
  levelDescription: string;
  topLeak: string;
  focus: string;
};

const LEVEL_FALLBACKS: Record<
  number,
  { label: string; description: string; focus: string; ctaLabel: string }
> = {
  0: {
    label: "L0 - Start from first principles",
    description: "Begin with the foundations so the later repair work has a stable base.",
    focus: "The Method",
    ctaLabel: "Start The Method",
  },
  1: {
    label: "L1 - Method foundations",
    description: "Start with the core C3 workflow before pushing timed mixed practice.",
    focus: "The Method",
    ctaLabel: "Start The Method",
  },
  2: {
    label: "L2 - Build the method",
    description: "You have traction, but the diagnostic shows recurring misses to repair.",
    focus: "The Method",
    ctaLabel: "Start The Method",
  },
  3: {
    label: "L3 - Targeted repair",
    description: "Your best return is targeted work on the trap this diagnostic surfaced.",
    focus: "Red-zone repair",
    ctaLabel: "Start red-zone repair",
  },
  4: {
    label: "L4 - Exam-ready refinement",
    description: "Move into timed refinement while keeping this top leak on the board.",
    focus: "Timed refinement",
    ctaLabel: "Start timed refinement",
  },
};

export default function DiagnosticResultsPage({
  params,
}: {
  params: Promise<{ session: string }>;
}) {
  const { session: diagnosticId } = use(params);
  const completedEventRef = useRef<string | null>(null);
  const [results, setResults] = useState<DiagnosticResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const foundations = useFoundations();
  const methodSlug =
    foundations.data?.progress.next_slug ??
    foundations.data?.lessons[0]?.slug ??
    "lesson-01";

  useEffect(() => {
    let active = true;

    // Remember this diagnostic so checkout can carry it (via localStorage) and
    // fulfillment can claim the anonymous Red-Zone Map onto the new account.
    rememberDiagnosticId(diagnosticId);

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
          <RecommendationCta
            methodSlug={methodSlug}
            results={results}
          />
          <EnrollCta />
          <AnchorStack anchors={results.anchors} />
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
    { label: "Avg time / question", value: `${s.avg_time_seconds}s` },
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
                {p.subject ? `${humanizeSubject(p.subject)} · ` : ""}
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

// R3-01: Enrollment CTA — bridges the emotional peak (Red-Zone Map visible) to purchase.
// Mirrors /pricing enroll button destination (/checkout) and button style.
function EnrollCta() {
  return (
    <div className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Ready to repair your red zones?
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-900">
        Your Red-Zone Map is built. Enroll to repair it.
      </h2>
      <p className="mt-3 text-zinc-700">
        BarMatrix Flagship gives you the full forensic bank, targeted repair
        drills, boot camps, and a persistent Red-Zone Map that updates as you
        drill — so you stop practicing randomly and start fixing the patterns
        that cost you points.
      </p>
      <p className="mt-2 font-mono text-sm font-semibold text-zinc-900">
        $999 — July-cycle cohort. Limited seats.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link href="/checkout" className="btn red">
          Enroll in Flagship <span aria-hidden>→</span>
        </Link>
        <Link
          href="/pricing"
          className="text-sm text-zinc-600 underline hover:text-zinc-900"
        >
          See full program details
        </Link>
      </div>
    </div>
  );
}

function RecommendationCta({
  methodSlug,
  results,
}: {
  methodSlug: string;
  results: DiagnosticResultsResponse;
}) {
  return <RecommendationCard rec={buildDiagnosticRecommendation(results, methodSlug)} />;
}

function RecommendationCard({ rec }: { rec: BuiltRecommendation }) {
  return (
    <div className="mt-10 rounded-lg border border-zinc-900 bg-zinc-900 p-8 text-white">
      <p className="font-mono text-xs uppercase tracking-wider text-red-400">
        Recommended next step - {rec.levelBadge}
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
        Your top leak is {rec.topLeak} - start here.
      </h2>
      <p className="mt-3 text-zinc-300">
        {rec.levelLabel}. {rec.levelDescription}
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
        Route: {rec.focus}
      </p>
      <Link href={rec.href} className="btn red mt-6">
        {rec.ctaLabel} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

function buildDiagnosticRecommendation(
  results: DiagnosticResultsResponse,
  methodSlug: string,
): BuiltRecommendation {
  const level = resolveRecommendationLevel(results);
  const fallback = LEVEL_FALLBACKS[level] ?? LEVEL_FALLBACKS[0];
  const explicitStep = resolveExplicitStep(results, methodSlug);
  const step = explicitStep ?? recommendedStepForLevel(level, methodSlug, results);
  const apiRecommendation = results.recommendation;
  return {
    href: step.href,
    ctaLabel: step.label,
    levelBadge: `L${level}`,
    levelLabel:
      apiRecommendation?.label ??
      apiRecommendation?.level_label ??
      apiRecommendation?.placement_label ??
      results.placement_label ??
      fallback.label,
    levelDescription:
      apiRecommendation?.description ??
      apiRecommendation?.level_description ??
      apiRecommendation?.placement_description ??
      results.placement_description ??
      fallback.description,
    topLeak: resolveTopLeak(results),
    focus: step.focus,
  };
}

function resolveRecommendationLevel(results: DiagnosticResultsResponse): number {
  const fromApi = normalizeLevel(
    results.recommendation?.level ??
      results.recommendation?.placement_level ??
      results.level ??
      results.placement_level,
  );
  if (fromApi != null) return fromApi;
  const pct = results.summary.score_pct;
  if (pct >= 85) return 4;
  if (pct >= 68) return 3;
  if (pct >= 50) return 2;
  if (pct >= 30) return 1;
  return 0;
}

function normalizeLevel(value: number | string | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(4, Math.trunc(value)));
  }
  if (typeof value !== "string") return null;
  const match = value.match(/[0-4]/);
  return match ? Number(match[0]) : null;
}

function resolveExplicitStep(
  results: DiagnosticResultsResponse,
  methodSlug: string,
): RecommendedStep | null {
  const nextStep = results.recommendation?.next_step;
  if (!nextStep) return null;
  const href = normalizeInternalHref(nextStep.href) ?? slugToMethodHref(nextStep.slug);
  if (!href) return null;
  return {
    href,
    label: nextStep.label ?? "Start here",
    focus: routeFocusFromHref(href, methodSlug),
  };
}

function recommendedStepForLevel(
  level: number,
  methodSlug: string,
  results: DiagnosticResultsResponse,
): RecommendedStep {
  if (level >= 4) {
    return { href: "/timed-sets", label: "Start timed refinement", focus: "Timed refinement" };
  }
  if (level >= 3) {
    return {
      href: redZoneDetailHref(results) ?? "/red-zones",
      label: "Start red-zone repair",
      focus: "Red-zone repair",
    };
  }
  return {
    href: `/foundations/${methodSlug}`,
    label: "Start The Method",
    focus: "The Method",
  };
}

function normalizeInternalHref(href: string | undefined): string | null {
  if (!href || !href.startsWith("/")) return null;
  if (href.startsWith("//")) return null;
  return href;
}

function slugToMethodHref(slug: string | undefined): string | null {
  if (!slug) return null;
  return `/foundations/${encodeURIComponent(slug)}`;
}

function routeFocusFromHref(href: string, methodSlug: string): string {
  if (href === `/foundations/${methodSlug}` || href.startsWith("/foundations")) {
    return "The Method";
  }
  if (href.startsWith("/red-zones")) return "Red-zone repair";
  if (href.startsWith("/timed-sets")) return "Timed refinement";
  return "Recommended path";
}

function resolveTopLeak(results: DiagnosticResultsResponse): string {
  const topPattern = results.top_trap_patterns[0];
  if (topPattern) return topPattern.label || humanizeTag(topPattern.tag);
  const fallbackZone = firstRedZone(results);
  if (fallbackZone) return humanizeTag(fallbackZone.tag);
  return results.summary.correct === results.summary.total
    ? "timed refinement"
    : "The Method";
}

function firstRedZone(results: DiagnosticResultsResponse): DiagnosticRedZoneEntry | null {
  for (const zones of Object.values(results.red_zones.by_dimension)) {
    const first = zones[0];
    if (first) return first;
  }
  return null;
}

function redZoneDetailHref(results: DiagnosticResultsResponse): string | null {
  const pattern = results.top_trap_patterns[0];
  if (!pattern) return null;
  return `/red-zones/${encodeURIComponent(pattern.dimension)}/${encodeURIComponent(pattern.tag)}`;
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
