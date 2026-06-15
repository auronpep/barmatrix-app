"use client";

// Redesign V2 preview — the "Today." dashboard.
//
// PHASE 1 (presentation only): re-presents the LIVE data (useDayPlan +
// useRedZoneLibrary) in the redesign's "judge the answer" IA — one assigned
// action ("Continue the repair"), a Red-Zone Map ordered ACTIVE → QUEUED, and a
// "Progress Mirrors" stat row. The live /dashboard is untouched; this route is
// unlinked and exists for founder review before any flip.

import Link from "next/link";
import { useMemo } from "react";
import { useDayPlan } from "@/lib/use-day-plan";
import { useRedZoneLibrary } from "@/lib/use-red-zones";
import type { DayPlanStep } from "@/lib/api-client";
import {
  NamedConceptBanner,
  RedesignFooter,
  ScriptureBlock,
  SectionLabel,
} from "@/components/redesign/redesign-chrome";

export default function TodayPreviewPage() {
  const dayPlan = useDayPlan();
  const redZones = useRedZoneLibrary();

  const plan = dayPlan.data?.plan ?? null;
  const currentStep = plan?.current_step ?? null;
  const remaining = plan
    ? Math.max(0, plan.metrics.total_daily_steps - plan.metrics.completed_daily_steps)
    : 0;

  const zones = useMemo(
    () => (redZones.data ? collectZones(redZones.data) : []),
    [redZones.data],
  );
  const activeZone = zones[0] ?? null;
  const queuedZones = zones.slice(1);

  const conceptLabel =
    activeZone?.label ?? plan?.title ?? "The answer to a different question";

  const ledgerCount = useMemo(
    () => zones.reduce((sum, z) => sum + z.attempts, 0),
    [zones],
  );

  if (dayPlan.loading) {
    return <Shell><LoadingCard /></Shell>;
  }
  if (!dayPlan.signedIn) {
    return (
      <Shell>
        <AccessCard
          title="Sign in"
          body="Sign in to open today's repair path."
          href="/sign-in"
          label="Sign in"
        />
      </Shell>
    );
  }
  if (dayPlan.error) {
    return (
      <Shell>
        <AccessCard
          title="Path unavailable"
          body={`Live path sync failed: ${dayPlan.error}`}
          href="/account"
          label="Account"
        />
      </Shell>
    );
  }
  if (!dayPlan.data?.enrolled) {
    const paused = dayPlan.data?.refunded || dayPlan.data?.status === "suspended";
    return (
      <Shell>
        <AccessCard
          title={paused ? "Access paused" : "Enrollment required"}
          body={
            paused
              ? "Your paid access is paused. Update billing to restore the daily path."
              : "Enroll to unlock the guided daily repair path."
          }
          href={paused ? "/account" : "/checkout"}
          label={paused ? "Manage billing" : "Enroll now"}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <header>
        <p className="flex items-center gap-2 font-serif text-2xl font-semibold text-zinc-900">
          <span aria-hidden className="font-mono text-base text-zinc-400">B</span>
          BarMatrix
        </p>
        <h1 className="mt-8 font-serif text-6xl font-semibold leading-none text-zinc-950">
          Today.
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          {planCohortLabel(dayPlan.data?.day_key)}
        </p>
        <NamedConceptBanner label={conceptLabel} />
      </header>

      {/* Today's assigned work */}
      <section className="mt-10 border border-zinc-300 bg-white p-7 shadow-sm">
        {currentStep ? (
          <AssignedWork step={currentStep} remaining={remaining} />
        ) : (
          <div>
            <SectionLabel>Today&apos;s assigned work</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-zinc-950">
              Today&apos;s repair is clear.
            </h2>
            <p className="mt-3 text-zinc-700">
              The next assignment opens when your daily run resets.
            </p>
          </div>
        )}
      </section>

      {/* Red-Zone Map */}
      <section className="mt-12">
        <SectionLabel>Your Red-Zone Map</SectionLabel>
        {redZones.loading ? (
          <p className="mt-4 text-sm text-zinc-500">Loading your map…</p>
        ) : zones.length === 0 ? (
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
            No zones mapped yet. Run the diagnostic and your wrong answers begin
            building the map.{" "}
            <Link href="/diagnostic" className="text-red-700 underline">
              Take the diagnostic →
            </Link>
          </p>
        ) : (
          <div className="mt-5 divide-y divide-zinc-200 border-t border-zinc-900">
            {activeZone && <ZoneRow zone={activeZone} state="active" />}
            {queuedZones.map((z) => (
              <ZoneRow key={`${z.dimension}:${z.tag}`} zone={z} state="queued" />
            ))}
          </div>
        )}
      </section>

      {/* Progress Mirrors */}
      <section className="mt-12">
        <SectionLabel>Progress Mirrors</SectionLabel>
        <dl className="mt-5 grid grid-cols-2 gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-4">
          <Mirror value={redZones.data?.metrics.total_zones ?? zones.length} label="Mapped zones" />
          <Mirror value={plan?.catchup.pending_count ?? 0} label="Holding" />
          <Mirror value={0} label="Retests ready" hint="Phase 3" />
          <Mirror value={ledgerCount} label="Questions in ledger" />
        </dl>
      </section>

      {/* Quiet insights */}
      <section className="mt-12">
        <SectionLabel>Quiet insights</SectionLabel>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
          {zones.length > 0
            ? `${zones.length} recovery move${zones.length === 1 ? "" : "s"} ${zones.length === 1 ? "is" : "are"} already tied to your map. Earned truths and keys stay read-only here; they never become another picker.`
            : "Your insights appear here as your map builds. Earned truths and keys stay read-only; they never become another picker."}
        </p>
      </section>

      <ScriptureBlock
        quote="When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee."
        reference="Isaiah 43:2 · KJV"
      />

      <section className="mt-12 border-t border-zinc-200 pt-6">
        <SectionLabel>Account continuity</SectionLabel>
        <p className="mt-3 text-sm text-zinc-600">
          Progress follows your account.{" "}
          <Link href="/account" className="text-zinc-900 underline">
            Manage account
          </Link>
        </p>
      </section>

      <RedesignFooter />
    </Shell>
  );
}

interface MapZone {
  dimension: string;
  tag: string;
  label: string;
  attempts: number;
  heatPct: number;
  hasDrill: boolean;
}

function AssignedWork({ step, remaining }: { step: DayPlanStep; remaining: number }) {
  return (
    <>
      <SectionLabel>Today&apos;s assigned work</SectionLabel>
      <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-zinc-950">
        Continue: {step.title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-800">
        {step.prompt ||
          "A repair loop is already open. Finishing it is more valuable than starting a new slice."}
      </p>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
        {remaining} drill{remaining === 1 ? "" : "s"} left
      </p>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
        Completion schedules the hold check and updates the map.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {step.action.href && (
          <Link
            href={step.action.href}
            className="border-2 border-red-700 px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white"
          >
            Continue the repair →
          </Link>
        )}
        <Link
          href="/drills"
          className="border border-zinc-900 px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
        >
          Explore full bank
        </Link>
      </div>
      <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-700">
        Optional library work stays secondary. Today&apos;s assignment remains the
        spine.
      </p>
    </>
  );
}

function ZoneRow({ zone, state }: { zone: MapZone; state: "active" | "queued" }) {
  return (
    <Link
      href={`/red-zones/${encodeURIComponent(zone.dimension)}/${encodeURIComponent(zone.tag)}`}
      className="flex items-center justify-between gap-4 py-4 transition hover:bg-zinc-50"
    >
      <div>
        {state === "active" && (
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            Active · the zone currently being worked
          </p>
        )}
        <p className="font-serif text-lg font-semibold text-zinc-950">{zone.label}</p>
      </div>
      <span
        className={`shrink-0 font-mono text-xs uppercase tracking-[0.16em] ${
          state === "active" ? "text-red-700" : "text-zinc-400"
        }`}
      >
        {state === "active" ? "In repair" : "Queued"}
      </span>
    </Link>
  );
}

function Mirror({
  value,
  label,
  hint,
}: {
  value: number;
  label: string;
  hint?: string;
}) {
  return (
    <div className="bg-white p-5">
      <p className="font-serif text-5xl font-semibold leading-none text-zinc-950">
        {value}
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600">
        {label}
      </p>
      {hint && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
          {hint}
        </p>
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">{children}</main>
  );
}

function LoadingCard() {
  return (
    <div className="border border-zinc-300 bg-white p-7">
      <SectionLabel>Loading</SectionLabel>
      <p className="mt-3 text-sm text-zinc-700">Preparing today&apos;s repair.</p>
    </div>
  );
}

function AccessCard({
  title,
  body,
  href,
  label,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
}) {
  return (
    <div className="border border-zinc-300 bg-white p-7">
      <SectionLabel>Today</SectionLabel>
      <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-zinc-950">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-700">{body}</p>
      <Link href={href} className="btn btn-lg red mt-6">
        {label}
      </Link>
    </div>
  );
}

// --- helpers ---------------------------------------------------------------

// Order zones by "heat" (low proficiency + high-confidence wrongs) so the
// hottest becomes ACTIVE / in-repair and the rest are QUEUED — the same heat
// logic the live /red-zones library uses.
function collectZones(
  data: ReturnType<typeof useRedZoneLibrary>["data"],
): MapZone[] {
  if (!data) return [];
  return data.dimensions
    .flatMap((group) =>
      group.zones.map((zone) => {
        const proficiencyPct = clampPct(
          Math.round(normalize(zone.proficiency_score) * 100),
        );
        const heatPct = clampPct(
          Math.round((100 - proficiencyPct) * 0.8) +
            Math.min(zone.high_confidence_wrongs, 4) * 5,
        );
        return {
          dimension: group.dimension,
          tag: zone.tag,
          label: titleize(zone.tag),
          attempts: zone.attempts,
          heatPct,
          hasDrill: zone.has_drill,
        };
      }),
    )
    .sort((a, b) => b.heatPct - a.heatPct);
}

function normalize(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(1, score));
}

function clampPct(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function titleize(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function planCohortLabel(dayKey: string | null | undefined): string {
  if (!dayKey) return "Your cohort";
  const date = new Date(`${dayKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Your cohort";
  return `${date.toLocaleString("en-US", { month: "long", year: "numeric" })} cohort`;
}
