"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  type DashboardData,
  type DashboardRedZoneEntry,
} from "@/lib/api-client";
import { formatStudyLabel } from "@/lib/study-labels";
import { useDashboard } from "@/lib/use-dashboard";

type MatrixRow = {
  dimension: string;
  label: string;
  zones: DashboardRedZoneEntry[];
  topZone: DashboardRedZoneEntry | null;
  attempts: number;
  highConfidenceWrongs: number;
  averageScore: number | null;
};

const DIMENSION_ORDER = [
  "subject",
  "subtopic",
  "tension_point",
  "wrong_answer_architecture",
  "misconception",
] as const;

export default function TensionMatrixPage() {
  const dash = useDashboard();
  const rows = useMemo(() => buildRows(dash.data), [dash.data]);
  const activeRows = rows.filter((row) => row.zones.length > 0);
  const hasData = activeRows.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="border-b border-zinc-900 pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Tension Matrix
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
              Your live repair matrix, grouped by the patterns the test keeps reusing.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
              Each row is a red-zone dimension, and the hot cells are the
              patterns with the lowest proficiency or highest confidence misses.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="Dimensions" value={String(rows.length)} />
            <Metric label="Active cells" value={String(sumZones(rows))} />
            <Metric label="HC wrong" value={String(sumHighConfidence(rows))} />
          </div>
        </div>
      </div>

      {dash.loading && <StatePanel title="Loading matrix" body="Reading your latest red-zone history." />}
      {dash.error && (
        <StatePanel
          title="Matrix unavailable"
          body="Your live matrix could not load. You can still open the public tension catalog while account history reconnects."
          error={dash.error}
          href="/tensions"
          cta="Open Tension Map"
        />
      )}
      {!dash.loading && !dash.error && !dash.signedIn && (
        <StatePanel
          title="Sign in to see your matrix"
          body="The matrix is built from your diagnostic and drill attempts."
          href="/sign-in?after=matrix"
          cta="Sign in"
        />
      )}
      {!dash.loading && !dash.error && dash.signedIn && !hasData && (
        <StatePanel
          title="No matrix history yet"
          body="Take the diagnostic or work a drill to start filling the matrix."
          href="/diagnostic"
          cta="Start diagnostic"
        />
      )}

      {hasData && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section aria-labelledby="matrix-grid">
            <div className="border-b border-zinc-300 pb-4">
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
                Live Heat Cells
              </p>
              <h2 id="matrix-grid" className="mt-2 font-serif text-3xl font-semibold">
                Dimensions by repair priority
              </h2>
            </div>
            <div className="mt-5 grid gap-4">
              {rows.map((row) => (
                <MatrixRowCard key={row.dimension} row={row} />
              ))}
            </div>
          </section>

          <aside className="border border-zinc-900 bg-zinc-950 p-6 text-white">
            <p className="font-mono text-xs uppercase tracking-wider text-red-300">
              Next repair
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">
              {activeRows[0]?.topZone
                ? formatStudyLabel(activeRows[0].topZone.tag)
                : "Build your first hot cell"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-200">
              Open the full mastery board when you want the five weakest zones in
              every dimension, or run the next diagnostic to refresh this matrix.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard/mastery" className="btn red">
                Open Mastery Board
              </Link>
              <Link href="/diagnostic" className="btn ghost bg-white text-zinc-950 hover:bg-zinc-100">
                Refresh with diagnostic
              </Link>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function MatrixRowCard({ row }: { row: MatrixRow }) {
  const top = row.topZone;
  const score = row.averageScore == null ? 0 : normalizeScore(row.averageScore);
  const pct = Math.round(score * 100);

  return (
    <article className="border border-zinc-300 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)_160px] md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            {row.zones.length} cells
          </p>
          <h3 className="mt-2 font-serif text-2xl font-semibold text-zinc-950">
            {row.label}
          </h3>
        </div>
        <div>
          <div className="h-3 overflow-hidden border border-zinc-900 bg-zinc-100">
            <div
              className={score < 0.4 ? "h-full bg-red-700" : score < 0.7 ? "h-full bg-orange-600" : "h-full bg-emerald-700"}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-zinc-700">
            {top
              ? `Top cell: ${formatStudyLabel(top.tag)}`
              : "No recorded red-zone cells in this dimension yet."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right font-mono text-[11px] uppercase tracking-wider text-zinc-600">
          <span>{row.attempts} attempts</span>
          <span>{row.highConfidenceWrongs} HC wrong</span>
          <span className="col-span-2 text-zinc-950">{pct}% avg score</span>
        </div>
      </div>
    </article>
  );
}

function buildRows(data: DashboardData | null): MatrixRow[] {
  const byDimension = data?.red_zones?.by_dimension ?? {};
  const dimensions = new Set([...DIMENSION_ORDER, ...Object.keys(byDimension)]);

  return Array.from(dimensions)
    .sort((a, b) => dimensionRank(a) - dimensionRank(b) || a.localeCompare(b))
    .map((dimension) => {
      const zones = [...(byDimension[dimension] ?? [])].sort(compareZones);
      const attempts = zones.reduce((sum, zone) => sum + zone.attempts, 0);
      const highConfidenceWrongs = zones.reduce(
        (sum, zone) => sum + zone.high_confidence_wrongs,
        0,
      );
      const averageScore =
        zones.length === 0
          ? null
          : zones.reduce((sum, zone) => sum + normalizeScore(zone.proficiency_score), 0) /
            zones.length;

      return {
        dimension,
        label: formatStudyLabel(dimension),
        zones,
        topZone: zones[0] ?? null,
        attempts,
        highConfidenceWrongs,
        averageScore,
      };
    });
}

function StatePanel({
  title,
  body,
  error,
  href,
  cta,
}: {
  title: string;
  body: string;
  error?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section className="mt-8 border border-zinc-300 bg-zinc-50 p-6">
      <h2 className="font-serif text-2xl font-semibold text-zinc-950">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">{body}</p>
      {error && <p className="mt-3 font-mono text-xs text-zinc-600">{error}</p>}
      {href && cta && (
        <Link href={href} className="btn red btn-sm mt-5">
          {cta}
        </Link>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-300 bg-white px-3 py-4">
      <p className="font-serif text-3xl font-semibold leading-none">{value}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
    </div>
  );
}

function compareZones(a: DashboardRedZoneEntry, b: DashboardRedZoneEntry) {
  if (a.proficiency_score !== b.proficiency_score) {
    return a.proficiency_score - b.proficiency_score;
  }
  if (b.high_confidence_wrongs !== a.high_confidence_wrongs) {
    return b.high_confidence_wrongs - a.high_confidence_wrongs;
  }
  if (b.attempts !== a.attempts) {
    return b.attempts - a.attempts;
  }
  return a.tag.localeCompare(b.tag);
}

function dimensionRank(dimension: string) {
  const index = DIMENSION_ORDER.indexOf(dimension as (typeof DIMENSION_ORDER)[number]);
  return index === -1 ? DIMENSION_ORDER.length : index;
}

function normalizeScore(score: number) {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(1, score));
}

function sumZones(rows: MatrixRow[]) {
  return rows.reduce((sum, row) => sum + row.zones.length, 0);
}

function sumHighConfidence(rows: MatrixRow[]) {
  return rows.reduce((sum, row) => sum + row.highConfidenceWrongs, 0);
}
