"use client";

// Red Zone Library — the browsable, signed-in view of where a student's wrong
// answers cluster. Replaces the old anonymous, always-empty "Red-Zone Map":
// this page resolves the Clerk identity (via useRedZoneLibrary) and links each
// zone to its detail + repair drill.
//
// States: loading -> signed-out (public CTA) -> signed-in-not-enrolled (enroll)
// -> enrolled-empty (diagnostic) -> ready (heat + per-dimension zone lists).

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { type RedZoneLibrary, type RedZoneLibraryZone } from "@/lib/api-client";
import { useRedZoneLibrary } from "@/lib/use-red-zones";
import { trackRedZonePreviewViewedOnce } from "@/lib/analytics";

interface HeatZone {
  dimension: string;
  zone: RedZoneLibraryZone;
  proficiencyPct: number;
  heatPct: number;
}

export default function RedZonesPage() {
  const lib = useRedZoneLibrary();
  const data = lib.data;

  const heatZones = useMemo(() => (data ? collectHeatZones(data) : []), [data]);

  useEffect(() => {
    if (!data || heatZones.length === 0) return;
    trackRedZonePreviewViewedOnce({
      trapTags: heatZones.slice(0, 5).map((h) => h.zone.tag),
      dedupeKey: "red-zone-library",
    });
  }, [data, heatZones]);

  const banner = resolveBanner(lib);
  const ready = !!data && data.enrolled && (data.dimensions?.length ?? 0) > 0;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            Red Zone Library
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Every weak area, ready to repair
          </h1>
        </div>
        <Link href="/dashboard" className="btn btn-sm ghost">
          Back to dashboard
        </Link>
      </div>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        Your wrong answers grouped by subject, subtopic, and tension point. Open
        any zone to see the questions inside it, the traps that built it, and a
        targeted repair drill. The lower the proficiency, the more attention the
        zone needs.
      </p>

      {lib.loading && (
        <div className="mt-12 grid gap-3 sm:grid-cols-3" aria-label="Loading your Red Zone Library">
          {[0, 1, 2].map((item) => (
            <div key={item} className="border border-zinc-200 bg-zinc-50 p-4">
              <div className="h-3 w-24 bg-zinc-200" />
              <div className="mt-4 h-2 w-full bg-zinc-200" />
              <div className="mt-3 h-3 w-16 bg-zinc-200" />
            </div>
          ))}
        </div>
      )}

      {banner && <StateBanner banner={banner} />}

      {lib.error && (
        <p className="mt-6 border border-amber-300 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
          Live data sync unavailable: {lib.error}
        </p>
      )}

      {ready && data && (
        <>
          <MetricsRow metrics={data.metrics} />
          <WeakAreaHeatDisplay zones={heatZones} />
          <div className="mt-12 space-y-10">
            {data.dimensions.map((group) => (
              <DimensionSection
                key={group.dimension}
                dimension={group.dimension}
                zones={group.zones}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

type Banner =
  | { tone: "info"; text: string; ctas: Array<{ href: string; label: string; primary?: boolean }> }
  | null;

function resolveBanner(lib: ReturnType<typeof useRedZoneLibrary>): Banner {
  if (lib.loading) return null;
  if (!lib.signedIn) {
    return {
      tone: "info",
      text: "Sign in to open your Red Zone Library. New here? Take the free diagnostic to build it.",
      ctas: [
        { href: "/sign-in", label: "Sign in", primary: true },
        { href: "/diagnostic", label: "Take the diagnostic" },
      ],
    };
  }
  if (lib.data && !lib.data.enrolled) {
    return {
      tone: "info",
      text:
        lib.data.status === "suspended" || lib.data.refunded
          ? "Your access is paused. Update billing or contact support to restore your Red Zone Library."
          : "You're signed in but not enrolled yet. Enroll to unlock your full Red Zone Library and repair drills.",
      ctas:
        lib.data.status === "suspended"
          ? [{ href: "/account", label: "Manage billing", primary: true }]
          : [
              { href: "/checkout", label: "Enroll now", primary: true },
              { href: "/diagnostic", label: "Take the diagnostic" },
            ],
    };
  }
  if (lib.data?.enrolled && (lib.data.dimensions?.length ?? 0) === 0) {
    return {
      tone: "info",
      text: "You're enrolled. Take the diagnostic to build your Red Zone Library and unlock targeted drills.",
      ctas: [{ href: "/diagnostic", label: "Take the diagnostic", primary: true }],
    };
  }
  return null;
}

function StateBanner({ banner }: { banner: NonNullable<Banner> }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-6">
      <p className="max-w-2xl text-sm leading-6 text-zinc-800">{banner.text}</p>
      <div className="flex flex-wrap gap-3">
        {banner.ctas.map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            className={
              cta.primary
                ? "rounded-md bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
                : "rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
            }
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MetricsRow({ metrics }: { metrics: RedZoneLibrary["metrics"] }) {
  const cards = [
    { label: "Repair Progress", value: `${metrics.repair_progress_pct}%`, detail: "Average zone proficiency" },
    { label: "Active Red Zones", value: String(metrics.active_red_zones), detail: "Below stable range" },
    { label: "High-Confidence Wrongs", value: String(metrics.high_confidence_wrongs), detail: "Priority errors" },
    { label: "Total Zones", value: String(metrics.total_zones), detail: "Tracked weak areas" },
  ];
  return (
    <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Library metrics">
      {cards.map((card) => (
        <article key={card.label} className="border border-zinc-300 bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">{card.label}</p>
          <p className="mt-3 font-serif text-4xl font-semibold leading-none text-zinc-950">{card.value}</p>
          <p className="mt-3 text-sm leading-6 text-zinc-700">{card.detail}</p>
        </article>
      ))}
    </section>
  );
}

function WeakAreaHeatDisplay({ zones }: { zones: HeatZone[] }) {
  if (zones.length === 0) return null;
  return (
    <section
      className="mt-10 border border-zinc-200 bg-white p-6 shadow-sm"
      aria-labelledby="weak-area-heat-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            Weak-area heat display
          </p>
          <h2
            id="weak-area-heat-heading"
            className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-950"
          >
            Highest-attention zones first
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
          <span className="border border-zinc-200 px-2 py-1">Hot</span>
          <span className="border border-zinc-200 px-2 py-1">Warm</span>
          <span className="border border-zinc-200 px-2 py-1">Cooling</span>
        </div>
      </div>

      <ol className="mt-6 grid gap-4 md:grid-cols-2" aria-label="Weak areas by heat">
        {zones.slice(0, 8).map((item) => (
          <li key={`${item.dimension}:${item.zone.tag}`}>
            <Link
              href={zoneHref(item.dimension, item.zone.tag)}
              className="block border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-500 hover:bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    {titleize(item.dimension)}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-zinc-950">
                    {item.zone.tag}
                  </h3>
                </div>
                <span
                  className="font-mono text-xs font-semibold uppercase tracking-wider"
                  style={{ color: heatColor(item.heatPct) }}
                >
                  {heatLabel(item.heatPct)}
                </span>
              </div>
              <div className="mt-4 h-2 w-full bg-zinc-200" aria-label={`${item.heatPct}% heat`} role="img">
                <div className="h-2" style={{ width: `${item.heatPct}%`, backgroundColor: heatColor(item.heatPct) }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                <span>{item.proficiencyPct}% proficiency</span>
                <span>{item.zone.attempts} attempts</span>
                <span>{item.zone.question_count} questions</span>
                {item.zone.has_drill && <span className="text-red-700">Drill assigned</span>}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DimensionSection({
  dimension,
  zones,
}: {
  dimension: string;
  zones: RedZoneLibraryZone[];
}) {
  return (
    <section aria-labelledby={`dim-${dimension}`}>
      <h2
        id={`dim-${dimension}`}
        className="border-b border-zinc-300 pb-3 font-mono text-xs uppercase tracking-wider text-zinc-700"
      >
        {titleize(dimension)} · {zones.length} zone{zones.length === 1 ? "" : "s"}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {zones.map((zone) => {
          const pct = clampPct(Math.round(normalizeScore(zone.proficiency_score) * 100));
          return (
            <li key={zone.tag}>
              <Link
                href={zoneHref(dimension, zone.tag)}
                className="block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-base font-semibold text-zinc-900">{zone.tag}</span>
                  {zone.has_drill ? (
                    <span className="shrink-0 border border-red-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-red-800">
                      Drill ready
                    </span>
                  ) : pct < 70 ? (
                    <span className="shrink-0 border border-amber-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-800">
                      Needs repair
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-100">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  <span>{pct}% proficiency</span>
                  <span>{zone.attempts} attempts</span>
                  <span>{zone.high_confidence_wrongs} HC wrong</span>
                  <span>{zone.question_count} questions</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function collectHeatZones(data: RedZoneLibrary): HeatZone[] {
  return data.dimensions
    .flatMap((group) =>
      group.zones.map((zone) => {
        const proficiencyPct = clampPct(Math.round(normalizeScore(zone.proficiency_score) * 100));
        const heatPct = clampPct(
          Math.round((100 - proficiencyPct) * 0.8) +
            Math.min(zone.high_confidence_wrongs, 4) * 5,
        );
        return { dimension: group.dimension, zone, proficiencyPct, heatPct };
      }),
    )
    .sort((a, b) => {
      if (b.heatPct !== a.heatPct) return b.heatPct - a.heatPct;
      if (b.zone.high_confidence_wrongs !== a.zone.high_confidence_wrongs) {
        return b.zone.high_confidence_wrongs - a.zone.high_confidence_wrongs;
      }
      return a.proficiencyPct - b.proficiencyPct;
    });
}

function zoneHref(dimension: string, tag: string): string {
  return `/red-zones/${encodeURIComponent(dimension)}/${encodeURIComponent(tag)}`;
}

function normalizeScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(1, score));
}

function clampPct(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function heatColor(score: number): string {
  if (score >= 70) return "#dc2626";
  if (score >= 40) return "#b45309";
  return "#047857";
}

function heatLabel(score: number): string {
  if (score >= 70) return "Hot";
  if (score >= 40) return "Warm";
  return "Cooling";
}

function titleize(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
