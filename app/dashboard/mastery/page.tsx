"use client";

import Link from "next/link";
import { useMemo } from "react";
import { type RedZoneEntry } from "@/lib/api-client";
import { useDashboard } from "@/lib/use-dashboard";

const DIMENSION_ORDER = [
  "subject",
  "subtopic",
  "tension_point",
  "wrong_answer_architecture",
  "misconception",
];

const DIMENSION_LABELS: Record<string, string> = {
  subject: "Subject",
  subtopic: "Subtopic",
  tension_point: "Tension Point",
  wrong_answer_architecture: "Wrong Answer Architecture",
  misconception: "Misconception",
};

type MasteryGroup = {
  dimension: string;
  label: string;
  zones: RedZoneEntry[];
};

export default function PatternMasteryBoardPage() {
  const dash = useDashboard();

  const groups = useMemo(
    () =>
      buildMasteryGroups(
        dash.data ? { by_dimension: dash.data.red_zones.by_dimension } : null,
      ),
    [dash.data],
  );
  const topZones = useMemo(() => collectTopZones(groups, 5), [groups]);
  const mobileZones = topZones.slice(0, 3);
  const hasData = groups.some((group) => group.zones.length > 0);
  const isEmpty = !dash.loading && !hasData && !dash.error;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="border-b border-zinc-900 pb-8">
        <p className="eyebrow-red">Pattern Mastery Board</p>
        <div className="mt-4 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
              Your weakest patterns, ranked by dimension.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
              BarMatrix turns wrong-answer history into a mastery board grouped by subject,
              subtopic, tension point, answer architecture, and misconception. The lowest
              proficiency rows are the next places to repair.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="Dimensions" value={String(groups.length || 5)} />
            <Metric label="Visible rows" value={String(topZones.length)} />
            <Metric
              label="HC wrong"
              value={String(sumHighConfidenceWrongs(topZones))}
            />
          </div>
        </div>
      </div>

      {dash.loading && <LoadingState />}

      {dash.error && <ErrorState message={dash.error} />}

      {isEmpty && <EmptyState />}

      {hasData && (
        <>
          <section className="mt-8 block md:hidden" aria-labelledby="mobile-summary">
            <div className="border border-zinc-900 bg-white p-5">
              <p className="eyebrow" id="mobile-summary">
                Mobile Summary
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold">
                Top repair zones
              </h2>
              <div className="mt-5 space-y-4">
                {mobileZones.map((zone) => (
                  <MasteryRow key={`${zone.dimension}-${zone.tag}`} zone={zone} compact />
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-zinc-600">
                Open this board on a wider screen for the full five-dimension view.
              </p>
            </div>
          </section>

          <section className="mt-10 hidden md:block" aria-labelledby="mastery-board">
            <div className="flex items-end justify-between gap-6 border-b border-zinc-300 pb-4">
              <div>
                <p className="eyebrow" id="mastery-board">
                  Full Board
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold">
                  Five worst red zones per dimension
                </h2>
              </div>
              <Link href="/diagnostic" className="btn ghost btn-sm">
                Refresh with diagnostic
              </Link>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {groups.map((group) => (
                <MasteryGroupCard key={group.dimension} group={group} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function buildMasteryGroups(
  data: { by_dimension: Record<string, RedZoneEntry[]> } | null,
): MasteryGroup[] {
  if (!data) {
    return DIMENSION_ORDER.map((dimension) => ({
      dimension,
      label: DIMENSION_LABELS[dimension] ?? titleize(dimension),
      zones: [],
    }));
  }

  const dimensions = new Set([
    ...DIMENSION_ORDER,
    ...Object.keys(data.by_dimension ?? {}),
  ]);

  return Array.from(dimensions)
    .sort((a, b) => dimensionRank(a) - dimensionRank(b) || a.localeCompare(b))
    .map((dimension) => ({
      dimension,
      label: DIMENSION_LABELS[dimension] ?? titleize(dimension),
      zones: [...(data.by_dimension?.[dimension] ?? [])]
        .sort(compareRedZones)
        .slice(0, 5),
    }));
}

function collectTopZones(groups: MasteryGroup[], limit: number): DisplayZone[] {
  return groups
    .flatMap((group) =>
      group.zones.map((zone) => ({
        ...zone,
        dimension: group.dimension,
        dimensionLabel: group.label,
      })),
    )
    .sort(compareRedZones)
    .slice(0, limit);
}

type DisplayZone = RedZoneEntry & {
  dimension: string;
  dimensionLabel: string;
};

function MasteryGroupCard({ group }: { group: MasteryGroup }) {
  return (
    <article className="border border-zinc-900 bg-white p-5">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-3">
        <div>
          <p className="eyebrow">{group.label}</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold">
            {group.zones.length > 0 ? "Repair queue" : "No pattern yet"}
          </h3>
        </div>
        <span className="font-mono text-xs text-zinc-500">
          {group.zones.length}/5 rows
        </span>
      </div>

      {group.zones.length > 0 ? (
        <div className="mt-5 space-y-4">
          {group.zones.map((zone) => (
            <MasteryRow
              key={`${group.dimension}-${zone.tag}`}
              zone={{
                ...zone,
                dimension: group.dimension,
                dimensionLabel: group.label,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-zinc-600">
          This dimension has no red-zone history yet. New diagnostic and drill attempts will
          populate it as the data layer records patterns.
        </p>
      )}
    </article>
  );
}

function MasteryRow({
  zone,
  compact = false,
}: {
  zone: DisplayZone;
  compact?: boolean;
}) {
  const score = normalizeScore(zone.proficiency_score);
  const pct = Math.round(score * 100);
  const band = score < 0.4 ? "Critical" : score < 0.7 ? "Watch" : "Stable";
  const barClass =
    score < 0.4
      ? "bg-red-700"
      : score < 0.7
        ? "bg-orange-600"
        : "bg-emerald-700";

  return (
    <div className="border-b border-zinc-100 pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {compact && (
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              {zone.dimensionLabel}
            </p>
          )}
          <p className="break-words text-sm font-semibold text-zinc-950">{zone.tag}</p>
        </div>
        <span className="shrink-0 font-mono text-xs text-zinc-600">{band}</span>
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden bg-zinc-100"
        aria-label={`${zone.tag} proficiency ${pct}%`}
      >
        <div className={`h-full ${barClass}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-600">
        <span>{pct}% score</span>
        <span>{zone.attempts} attempts</span>
        <span>{zone.high_confidence_wrongs} HC wrong</span>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <section className="mt-10 border border-zinc-300 bg-white p-6" aria-live="polite">
      <p className="eyebrow">Loading</p>
      <p className="mt-3 text-zinc-700">Building your Pattern Mastery Board...</p>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section className="mt-10 border border-red-300 bg-red-50 p-6" aria-live="polite">
      <p className="font-semibold text-red-900">Could not load Pattern Mastery Board.</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-red-900">
        Your mastery data is unavailable right now. You can still start or refresh the
        diagnostic while the board waits for live red-zone history.
      </p>
      <p className="mt-3 font-mono text-xs text-red-800">{message}</p>
      <div className="mt-5">
        <Link href="/diagnostic" className="btn red btn-sm">
          Start the diagnostic
        </Link>
      </div>
    </section>
  );
}

function EmptyState({ message }: { message?: string }) {
  return (
    <section className="mt-10 border border-zinc-900 bg-white p-8">
      <p className="eyebrow-red">No mastery history yet</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold">
        Take the diagnostic to start building your mastery board
      </h2>
      <p className="mt-3 max-w-2xl text-zinc-700">
        {message ??
          "Once your attempts are recorded, this board will rank your five weakest red zones in each mastery dimension."}
      </p>
      <div className="mt-6">
        <Link href="/diagnostic" className="btn red">
          Start the diagnostic
        </Link>
      </div>
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

function compareRedZones(a: RedZoneEntry, b: RedZoneEntry) {
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

function normalizeScore(score: number) {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(1, score));
}

function sumHighConfidenceWrongs(zones: RedZoneEntry[]) {
  return zones.reduce((sum, zone) => sum + zone.high_confidence_wrongs, 0);
}

function dimensionRank(dimension: string) {
  const index = DIMENSION_ORDER.indexOf(dimension);
  return index === -1 ? DIMENSION_ORDER.length : index;
}

function titleize(value: string) {
  return value
    .split(/[_-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
