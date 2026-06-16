"use client";

// Redesign V2 preview — guided repair board for drills.
//
// A drill is treated as one weakness-anchored repair set. The page leads with
// today's assigned repair and the student's red-zone board, while the full bank
// stays secondary as an optional library.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  api,
  ApiClientError,
  type DrillCatalogResponse,
  type DrillStartRequest,
  type PrescribedDrillsResponse,
} from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { useDayPlan } from "@/lib/use-day-plan";
import { useRedZoneLibrary } from "@/lib/use-red-zones";
import {
  SUBJECT_QUICK_DRILLS,
  humanizeTag,
  proficiencyBand,
  proficiencyPct,
} from "@/lib/drills";
import {
  NamedConceptBanner,
  RedesignFooter,
  ScriptureBlock,
  SectionLabel,
} from "@/components/redesign/redesign-chrome";

interface RepairZone {
  dimension: string;
  tag: string;
  label: string;
  proficiencyScore: number;
  attempts: number;
  highConfidenceWrongs: number;
  questionCount: number;
  hasDrill: boolean;
  heat: number;
}

export default function DrillsPreviewPage() {
  const dayPlan = useDayPlan();
  const redZones = useRedZoneLibrary();
  const { isLoaded: authLoaded, isSignedIn, getToken } = useClerkAuth();
  const router = useRouter();

  const [catalog, setCatalog] = useState<DrillCatalogResponse | null>(null);
  const [prescribed, setPrescribed] = useState<PrescribedDrillsResponse | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .getDrillCatalog()
      .then((c) => active && setCatalog(c))
      .catch(() => active && setCatalog({ tensions: [], traps: [] }));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;
    let active = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token || !active) return;
        const next = await api.getPrescribedDrills(token);
        if (active) setPrescribed(next);
      } catch {
        if (active) setPrescribed({ suggested: [], in_progress: [] });
      }
    })();
    return () => {
      active = false;
    };
  }, [authLoaded, isSignedIn, getToken]);

  const plan = dayPlan.data?.plan ?? null;
  const zones = useMemo(
    () => (redZones.data ? collectRepairZones(redZones.data) : []),
    [redZones.data],
  );
  const activeZone = zones[0] ?? null;
  const queuedZones = zones.slice(1, 7);
  const activeSuggestion = prescribed?.suggested[0] ?? null;
  const inProgress = prescribed?.in_progress[0] ?? null;
  const currentStep = plan?.current_step ?? null;
  const conceptLabel =
    activeZone?.label ?? currentStep?.title ?? "One repair set at a time";

  const catalogCount =
    (catalog?.tensions.length ?? 0) +
    (catalog?.traps.length ?? 0) +
    SUBJECT_QUICK_DRILLS.length;

  const startDrill = useCallback(
    async (key: string, payload: DrillStartRequest) => {
      if (busy) return;
      setBusy(key);
      setStartError(null);
      try {
        const token = isSignedIn ? await getToken() : null;
        const res = await api.startDrill(payload, token);
        if (!res.drill_id) {
          setStartError("No active questions matched that repair set yet.");
          setBusy(null);
          return;
        }
        router.push(`/drills/${res.drill_id}`);
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 401) {
          setStartError("Sign in to start your assigned repair.");
        } else if (err instanceof ApiClientError && err.status === 403) {
          setStartError("Enrollment is required to start a saved repair set.");
        } else {
          setStartError("Could not start that repair set.");
        }
        setBusy(null);
      }
    },
    [busy, getToken, isSignedIn, router],
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      <TopBar />

      <header className="mt-12">
        <SectionLabel>Repair drills</SectionLabel>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-zinc-950">
          One repair set, one red zone, one honest verdict.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
          The drill is not a loose card from the bank. It is a focused set tied
          to the weakness your map says is costing points.
        </p>
        <NamedConceptBanner label={conceptLabel} />
      </header>

      {startError && (
        <p className="mt-8 border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          {startError}
        </p>
      )}

      <TodayRepairCard
        loading={dayPlan.loading || redZones.loading}
        signedIn={dayPlan.signedIn || redZones.signedIn}
        enrolled={redZones.data?.enrolled ?? dayPlan.data?.enrolled ?? false}
        currentStepTitle={currentStep?.title ?? null}
        currentStepHref={currentStep?.action.href ?? null}
        zone={activeZone}
        inProgressDrillId={inProgress?.drill_id ?? null}
        inProgressName={inProgress?.drill_name ?? null}
        activeSuggestion={activeSuggestion}
        busy={busy}
        onStart={startDrill}
      />

      <section className="mt-12">
        <SectionLabel>Red-Zone repair board</SectionLabel>
        {redZones.loading ? (
          <p className="mt-5 text-sm text-zinc-500">Loading your repair board...</p>
        ) : !redZones.signedIn ? (
          <AccessPanel
            title="Sign in to open the repair board."
            body="The board is built from your own diagnostic and drill history."
            href="/sign-in"
            label="Sign in"
          />
        ) : redZones.error ? (
          <AccessPanel
            title="Repair board unavailable."
            body={`Red-zone sync failed: ${redZones.error}`}
            href="/account"
            label="Account"
          />
        ) : !redZones.data?.enrolled ? (
          <AccessPanel
            title="Enrollment required."
            body="Saved red-zone repair opens with an active BarMatrix enrollment."
            href="/checkout"
            label="Enroll"
          />
        ) : zones.length === 0 ? (
          <AccessPanel
            title="No red zones mapped yet."
            body="Run the diagnostic first so the next drill has a real target."
            href="/diagnostic"
            label="Take diagnostic"
          />
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {activeZone && (
              <RepairZoneCard
                zone={activeZone}
                state="active"
                busy={busy}
                onStart={startDrill}
              />
            )}
            {queuedZones.map((zone) => (
              <RepairZoneCard
                key={`${zone.dimension}:${zone.tag}`}
                zone={zone}
                state="queued"
                busy={busy}
                onStart={startDrill}
              />
            ))}
          </div>
        )}
      </section>

      <LibraryPanel catalog={catalog} catalogCount={catalogCount} />

      <ScriptureBlock
        quote="The thoughts of the diligent tend only to plenteousness."
        reference="Proverbs 21:5 · KJV"
      />

      <RedesignFooter />
    </main>
  );
}

function TopBar() {
  return (
    <div className="flex items-center justify-between gap-4 border-b-2 border-zinc-900 pb-6">
      <p className="flex items-center gap-2 font-serif text-2xl font-semibold text-zinc-900">
        <span aria-hidden className="font-mono text-base text-zinc-400">
          B
        </span>
        BarMatrix
      </p>
      <Link
        href="/preview/today"
        className="border-2 border-red-700 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white"
      >
        Today&apos;s path
      </Link>
    </div>
  );
}

function TodayRepairCard({
  loading,
  signedIn,
  enrolled,
  currentStepTitle,
  currentStepHref,
  zone,
  inProgressDrillId,
  inProgressName,
  activeSuggestion,
  busy,
  onStart,
}: {
  loading: boolean;
  signedIn: boolean;
  enrolled: boolean;
  currentStepTitle: string | null;
  currentStepHref: string | null;
  zone: RepairZone | null;
  inProgressDrillId: string | null;
  inProgressName: string | null;
  activeSuggestion: PrescribedDrillsResponse["suggested"][number] | null;
  busy: string | null;
  onStart: (key: string, payload: DrillStartRequest) => void;
}) {
  const startPayload =
    activeSuggestion ??
    (zone
      ? {
          kind: "prescribed_red_zone" as const,
          red_zone_dimension: zone.dimension,
          red_zone_tag: zone.tag,
          suggested_size: Math.min(12, Math.max(6, zone.questionCount)),
        }
      : null);

  return (
    <section className="mt-10 border border-zinc-300 bg-white p-7 shadow-sm">
      <SectionLabel>Today&apos;s repair</SectionLabel>
      <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-zinc-950">
        {loading
          ? "Preparing the next repair."
          : inProgressName
            ? `Continue: ${inProgressName}`
            : currentStepTitle
              ? `Continue: ${currentStepTitle}`
              : zone
                ? `Open the ${zone.label} set`
                : "Build the first repair set"}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-800">
        {zone
          ? `${proficiencyPct(zone.proficiencyScore)}% proficiency, ${zone.questionCount} question${zone.questionCount === 1 ? "" : "s"} ready, ${zone.highConfidenceWrongs} high-confidence wrong${zone.highConfidenceWrongs === 1 ? "" : "s"} recorded.`
          : "The guided path opens from your diagnostic and saved red-zone history."}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {inProgressDrillId ? (
          <Link
            href={`/drills/${inProgressDrillId}`}
            className="border-2 border-red-700 px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white"
          >
            Resume repair set →
          </Link>
        ) : startPayload && signedIn && enrolled ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() =>
              onStart("today-repair", {
                kind: "prescribed_red_zone",
                red_zone_dimension: startPayload.red_zone_dimension,
                red_zone_tag: startPayload.red_zone_tag,
                size:
                  "suggested_size" in startPayload
                    ? startPayload.suggested_size
                    : Math.min(12, Math.max(6, zone?.questionCount ?? 6)),
              })
            }
            className="border-2 border-red-700 px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "today-repair" ? "Opening..." : "Open zone drill →"}
          </button>
        ) : currentStepHref ? (
          <Link
            href={currentStepHref}
            className="border-2 border-red-700 px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white"
          >
            Continue today →
          </Link>
        ) : (
          <Link
            href={signedIn ? "/diagnostic" : "/sign-in"}
            className="border-2 border-red-700 px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white"
          >
            {signedIn ? "Take diagnostic →" : "Sign in →"}
          </Link>
        )}
        <Link
          href="/red-zones"
          className="border border-zinc-900 px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
        >
          View map
        </Link>
      </div>
    </section>
  );
}

function RepairZoneCard({
  zone,
  state,
  busy,
  onStart,
}: {
  zone: RepairZone;
  state: "active" | "queued";
  busy: string | null;
  onStart: (key: string, payload: DrillStartRequest) => void;
}) {
  const band = proficiencyBand(zone.proficiencyScore);
  const pct = proficiencyPct(zone.proficiencyScore);
  const key = `zone:${zone.dimension}:${zone.tag}`;

  return (
    <article
      className={`flex flex-col border bg-white p-6 ${
        state === "active" ? "border-red-300" : "border-zinc-300"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            {state === "active" ? "Active repair" : "Queued repair"} ·{" "}
            {humanizeTag(zone.dimension)}
          </p>
          <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-zinc-950">
            {zone.label}
          </h3>
        </div>
        <p
          className={`shrink-0 font-mono text-xs uppercase tracking-[0.16em] ${
            band.tone === "critical"
              ? "text-red-700"
              : band.tone === "watch"
                ? "text-amber-700"
                : "text-emerald-700"
          }`}
        >
          {band.label}
        </p>
      </div>

      <div className="mt-5">
        <div className="h-2 bg-zinc-100" aria-hidden>
          <div className="h-2 bg-red-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
          {pct}% proficiency · mastery bar is 75%
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-px bg-zinc-200 text-center">
        <Metric value={zone.questionCount} label="Ready" />
        <Metric value={zone.attempts} label="Attempts" />
        <Metric value={zone.highConfidenceWrongs} label="HC wrongs" />
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy !== null || !zone.hasDrill}
          onClick={() =>
            onStart(key, {
              kind: "prescribed_red_zone",
              red_zone_dimension: zone.dimension,
              red_zone_tag: zone.tag,
              size: Math.min(12, Math.max(6, zone.questionCount || 6)),
            })
          }
          className="border-2 border-red-700 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === key ? "Opening..." : "Open set"}
        </button>
        <Link
          href={`/red-zones/${encodeURIComponent(zone.dimension)}/${encodeURIComponent(zone.tag)}`}
          className="border border-zinc-300 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-950"
        >
          Inspect zone
        </Link>
      </div>
    </article>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-zinc-50 p-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-2xl font-semibold text-zinc-950">{value}</dd>
    </div>
  );
}

function LibraryPanel({
  catalog,
  catalogCount,
}: {
  catalog: DrillCatalogResponse | null;
  catalogCount: number;
}) {
  const tensions = catalog?.tensions ?? [];
  const traps = catalog?.traps ?? [];
  const previewTensions = tensions.slice(0, 6);
  const previewTraps = traps.slice(0, 6);

  return (
    <section className="mt-12 border-t border-zinc-200 pt-8">
      <details className="group">
        <summary className="flex cursor-pointer items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-5">
          <span>
            <SectionLabel>Optional library</SectionLabel>
            <span className="mt-2 block font-serif text-2xl font-semibold text-zinc-950">
              Browse the full bank after the assigned repair.
            </span>
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
            {catalog ? `${catalogCount} sets` : "Loading"}
          </span>
        </summary>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <LibraryGroup
            title="Tension sets"
            items={previewTensions.map((item) => ({
              key: item.slug,
              label: item.label,
              meta: `${item.question_count} questions`,
              href: `/tensions/${item.slug}`,
            }))}
          />
          <LibraryGroup
            title="Trap sets"
            items={previewTraps.map((item) => ({
              key: item.slug,
              label: item.label,
              meta: `${item.question_count} questions`,
              href: `/traps/${item.slug}`,
            }))}
          />
          <LibraryGroup
            title="Subject quick sets"
            items={SUBJECT_QUICK_DRILLS.map((item) => ({
              key: item.slug,
              label: item.label,
              meta: "Subject quick-drill set",
              href: item.href,
            }))}
          />
        </div>
      </details>
    </section>
  );
}

function LibraryGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{ key: string; label: string; meta: string; href: string }>;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
        {title}
      </p>
      {items.length === 0 ? (
        <p className="mt-3 border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
          No sets are available here yet.
        </p>
      ) : (
        <div className="mt-3 divide-y divide-zinc-200 border border-zinc-200 bg-white">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="block p-4 transition hover:bg-zinc-50"
            >
              <p className="font-serif text-lg font-semibold text-zinc-950">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-zinc-600">{item.meta}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function AccessPanel({
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
    <div className="mt-5 border border-zinc-300 bg-white p-6">
      <h3 className="font-serif text-2xl font-semibold text-zinc-950">{title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">{body}</p>
      <Link href={href} className="btn btn-sm red mt-5">
        {label}
      </Link>
    </div>
  );
}

function collectRepairZones(
  data: ReturnType<typeof useRedZoneLibrary>["data"],
): RepairZone[] {
  if (!data) return [];
  return data.dimensions
    .flatMap((group) =>
      group.zones.map((zone) => {
        const pct = proficiencyPct(zone.proficiency_score);
        const heat = Math.max(0, 100 - pct) + zone.high_confidence_wrongs * 8;
        return {
          dimension: group.dimension,
          tag: zone.tag,
          label: humanizeTag(zone.tag),
          proficiencyScore: zone.proficiency_score,
          attempts: zone.attempts,
          highConfidenceWrongs: zone.high_confidence_wrongs,
          questionCount: zone.question_count,
          hasDrill: zone.has_drill,
          heat,
        };
      }),
    )
    .sort((a, b) => b.heat - a.heat);
}
