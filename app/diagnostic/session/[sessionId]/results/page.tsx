"use client";

// C3 Placement Results Page.
//
// Route: /diagnostic/session/[sessionId]/results
//
// Renders: placement badge (L0–L4), score breakdown, subject accuracy table,
// top remediation targets, entry route modules, and a CTA to start the program.

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  api,
  type PlacementResults,
  type PlacementSubjectAccuracy,
  type PlacementRemediationTarget,
} from "@/lib/api-client";
import { useFoundations } from "@/lib/use-foundations";
import { userFacingResourceError } from "@/lib/user-facing-errors";

const LEVEL_META: Record<
  number,
  { badge: string; color: string; bg: string; border: string }
> = {
  0: {
    badge: "L0",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  1: {
    badge: "L1",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  2: {
    badge: "L2",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  3: {
    badge: "L3",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  4: {
    badge: "L4",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

function getLevelMeta(level: number) {
  return LEVEL_META[level] ?? LEVEL_META[0];
}

function humanError(err: unknown): string {
  return userFacingResourceError(err, {
    notFound: "This placement session could not be found.",
    unavailable: "Placement results are temporarily unavailable.",
  });
}

export default function PlacementResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const [results, setResults] = useState<PlacementResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const foundations = useFoundations();
  const methodSlug =
    foundations.data?.progress.next_slug ??
    foundations.data?.lessons[0]?.slug ??
    "lesson-01";

  useEffect(() => {
    let active = true;
    api
      .getPlacementResults(sessionId)
      .then((resp) => {
        if (!active) return;
        setResults(resp);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(humanError(err));
      });
    return () => {
      active = false;
    };
  }, [sessionId]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Placement complete
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
        Your C3 Starting Level
      </h1>
      <p className="mt-4 text-lg text-zinc-600">
        Based on your legal accuracy, mechanism recognition, and confidence
        calibration across 18 curated questions.
      </p>

      {!results && !error && <ResultsLoading />}
      {error && <ResultsError message={error} sessionId={sessionId} />}

      {results && (
        <>
          <PlacementBadge results={results} />
          <ScoreBreakdown results={results} />
          <EntryRoute route={results.entry_route} />
          <SubjectBreakdown subjects={results.subject_accuracy} />
          {results.top_remediation_targets.length > 0 && (
            <RemediationTargets targets={results.top_remediation_targets} />
          )}
          <ProgramCta methodSlug={methodSlug} results={results} />
        </>
      )}

      {!error && (
        <div className="mt-10">
          <Link
            href="/diagnostic/session"
            className="text-sm text-zinc-600 underline hover:text-zinc-900"
          >
            Retake the placement assessment
          </Link>
        </div>
      )}
    </section>
  );
}

function PlacementBadge({ results }: { results: PlacementResults }) {
  const level = results.placement_level;
  const meta = getLevelMeta(level);
  return (
    <div
      className={`mt-10 rounded-lg border p-8 ${meta.bg} ${meta.border}`}
    >
      <div className="flex items-center gap-6">
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 ${meta.border} ${meta.bg}`}
        >
          <span className={`font-mono text-3xl font-bold ${meta.color}`}>
            {meta.badge}
          </span>
        </div>
        <div>
          <p className={`font-mono text-xs uppercase tracking-wider ${meta.color}`}>
            Placement level
          </p>
          <h2 className="mt-1 font-serif text-3xl font-semibold text-zinc-900">
            {results.placement_label}
          </h2>
        </div>
      </div>
      <p className="mt-5 text-base leading-relaxed text-zinc-700">
        {results.placement_description}
      </p>
    </div>
  );
}

function ScoreBreakdown({ results }: { results: PlacementResults }) {
  const stats = [
    {
      label: "Legal accuracy",
      value: `${results.legal_score} / 18`,
      sub: "legal questions correct",
    },
    {
      label: "Mechanism accuracy",
      value: `${results.mechanism_score} / 18`,
      sub: "mechanisms identified correctly",
    },
    {
      label: "Calibration",
      value: `${results.calibration_score} / 18`,
      sub: "confidence matched outcome",
    },
    {
      label: "Total score",
      value: `${results.total_score} / 54`,
      sub: "combined across all dimensions",
    },
  ];
  return (
    <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Score breakdown
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">
              {stat.label}
            </dt>
            <dd className="mt-1 font-serif text-2xl font-semibold text-zinc-900">
              {stat.value}
            </dd>
            <dd className="mt-0.5 text-xs text-zinc-500">{stat.sub}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function EntryRoute({ route }: { route: string[] }) {
  if (route.length === 0) return null;
  return (
    <div className="mt-8">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Your starting path
      </p>
      <ul className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        {route.map((module, index) => (
          <li
            key={module}
            className="flex items-center gap-4 px-5 py-4"
          >
            <span className="font-mono text-sm tabular-nums text-zinc-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-base text-zinc-900">{module}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubjectBreakdown({ subjects }: { subjects: PlacementSubjectAccuracy[] }) {
  if (subjects.length === 0) return null;
  return (
    <div className="mt-8">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Subject breakdown
      </p>
      <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50">
              <th className="px-5 py-3 text-left font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                Subject
              </th>
              <th className="px-5 py-3 text-right font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                Correct
              </th>
              <th className="px-5 py-3 text-right font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                Total
              </th>
              <th className="px-5 py-3 text-right font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {subjects.map((row) => {
              const pct =
                row.total > 0 ? Math.round((row.correct / row.total) * 100) : 0;
              const isStrong = pct >= 70;
              const isWeak = pct < 50;
              return (
                <tr key={row.subject}>
                  <td className="px-5 py-3 text-zinc-900">{row.subject}</td>
                  <td className="px-5 py-3 text-right font-mono text-zinc-900">
                    {row.correct}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-zinc-500">
                    {row.total}
                  </td>
                  <td
                    className={`px-5 py-3 text-right font-mono font-semibold ${
                      isStrong
                        ? "text-emerald-700"
                        : isWeak
                          ? "text-red-700"
                          : "text-zinc-900"
                    }`}
                  >
                    {pct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RemediationTargets({
  targets,
}: {
  targets: PlacementRemediationTarget[];
}) {
  const top3 = targets.slice(0, 3);
  return (
    <div className="mt-8">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Top areas to work on
      </p>
      <ul className="mt-3 space-y-2">
        {top3.map((target, index) => (
          <li
            key={`${target.subject}-${index}`}
            className="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <span className="font-mono text-sm tabular-nums text-red-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                {target.subject}
              </p>
              <p className="mt-0.5 text-base text-zinc-900">{target.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProgramCta({
  methodSlug,
  results,
}: {
  methodSlug: string;
  results: PlacementResults;
}) {
  const nextStep = placementNextStep(results.placement_level, methodSlug);
  const topLeak = placementTopLeak(results);
  return (
    <div className="mt-10 rounded-lg border border-zinc-900 bg-zinc-900 p-8 text-white">
      <p className="font-mono text-xs uppercase tracking-wider text-red-400">
        Recommended next step - L{results.placement_level}
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
        Your top leak is {topLeak} - start here.
      </h2>
      <p className="mt-3 text-zinc-300">
        {results.placement_label}. {results.placement_description}
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
        Route: {nextStep.focus}
      </p>
      <Link href={nextStep.href} className="btn red mt-6">
        {nextStep.label} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

function placementNextStep(level: number, methodSlug: string) {
  if (level >= 4) {
    return { href: "/timed-sets", label: "Start timed refinement", focus: "Timed refinement" };
  }
  if (level >= 3) {
    return { href: "/red-zones", label: "Start red-zone repair", focus: "Red-zone repair" };
  }
  return {
    href: `/foundations/${methodSlug}`,
    label: "Start The Method",
    focus: "The Method",
  };
}

function placementTopLeak(results: PlacementResults): string {
  const target = results.top_remediation_targets[0];
  if (target) return `${target.subject}: ${target.label}`;
  const weakestSubject = results.subject_accuracy
    .filter((subject) => subject.total > 0)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
  return weakestSubject ? weakestSubject.subject : "The Method";
}

function ResultsLoading() {
  return (
    <div
      className="mt-10 border border-zinc-900 bg-white p-8"
      aria-live="polite"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Computing placement
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold">
        Scoring your responses...
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          "Legal accuracy",
          "Mechanism recognition",
          "Calibration scoring",
          "Placement level",
        ].map((label) => (
          <div key={label} className="border border-zinc-200 bg-zinc-50 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              {label}
            </p>
            <div className="mt-3 h-2 w-full bg-zinc-200" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsError({
  message,
  sessionId,
}: {
  message: string;
  sessionId: string;
}) {
  return (
    <div
      className="mt-10 border border-red-300 bg-red-50 p-8"
      aria-live="polite"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Results unavailable
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-red-950">
        The placement completed, but results could not load.
      </h2>
      <p className="mt-3 text-sm leading-6 text-red-900">
        Your answers were recorded. Retry the results page — if the API is
        temporarily unavailable, your session{" "}
        <span className="font-mono text-xs">{sessionId.slice(0, 8)}…</span> will
        still be available.
      </p>
      <p className="mt-3 font-mono text-xs text-red-800">{message}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn red"
        >
          Retry
        </button>
        <Link href="/diagnostic/session" className="btn ghost">
          Retake placement
        </Link>
      </div>
    </div>
  );
}
