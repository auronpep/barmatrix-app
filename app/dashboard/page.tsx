"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  api,
  ApiClientError,
  type CohortStatus,
  type DashboardData,
  type DashboardRecentAttempt,
  type DashboardAssignedDrill,
} from "@/lib/api-client";
import { useDashboard } from "@/lib/use-dashboard";
import { useFoundations } from "@/lib/use-foundations";
import { useC3 } from "@/lib/use-c3";
import { formatDrillName } from "@/lib/drills";
import type { FoundationsOutline } from "@/lib/api-client";

// Static path guide — the repair loop shape, shown regardless of data state.
const PROGRESS_GUIDE = [
  { label: "Diagnostic", detail: "Initial trap map captured" },
  { label: "Red-Zone Review", detail: "Weakest dimensions ranked" },
  { label: "Assigned Drill", detail: "Next repair set ready" },
  { label: "Mixed Set", detail: "Unlocks after repair pass" },
] as const;

const FALLBACK_NEXT_DRILL = {
  title: "Evidence: Hearsay Trap Repair",
  subtitle: "Proof seam",
  href: "/drills/evidence",
  body: "Work the Evidence drill to repair purpose-of-statement mistakes, then return to mixed practice.",
};

const COHORT_STATUS_LABEL: Record<CohortStatus["public_status"], string> = {
  open: "Open",
  limited: "Open",
  almost_full: "Open",
  last_seats: "Open",
  waitlist: "Waitlist",
};

const PROGRAM_COMMAND_CENTER = [
  {
    label: "Lead Me",
    status: "Primary",
    href: "/dashboard/path",
    body: "The guided daily path with one active task, streak progress, and the First 3 Days sequence.",
    cta: "Open My Path",
  },
  {
    label: "Red-Zone Map",
    status: "Forensics",
    href: "/red-zones",
    body: "Review the weak dimensions and tags built from diagnostic and drill attempts.",
    cta: "Open Map",
  },
  {
    label: "Tension Matrix",
    status: "Live Data",
    href: "/matrix",
    body: "Group live account history into repair-priority cells across red-zone dimensions.",
    cta: "Open Matrix",
  },
  {
    label: "Misconceptions",
    status: "Forensics",
    href: "/misconceptions",
    body: "Review the wrong beliefs that are repeating across your misses and assigned repairs.",
    cta: "Open Profile",
  },
  {
    label: "Question History",
    status: "Attempt Log",
    href: "/question-history",
    body: "See recent attempts with selected answer, result, subtopic, and trap attached.",
    cta: "Open History",
  },
  {
    label: "Practice",
    status: "Active Work",
    href: "/practice",
    body: "Run focused question sets that feed attempts back into the repair engine.",
    cta: "Start Practice",
  },
  {
    label: "Drill Library",
    status: "Subject Repair",
    href: "/drills",
    body: "Launch subject drills and retry missed questions with signed-in progress.",
    cta: "Open Drills",
  },
  {
    label: "Boot Camps",
    status: "Multi-day",
    href: "/boot-camps",
    body: "Use structured subject repair sequences with daily sets and mastery checks.",
    cta: "View Camps",
  },
  {
    label: "Timed Sets",
    status: "Pressure",
    href: "/timed-sets",
    body: "Practice under time pressure, then review the traps that surfaced.",
    cta: "Run Timed Set",
  },
  {
    label: "Mastery Board",
    status: "Pattern Rank",
    href: "/dashboard/mastery",
    body: "See the weakest patterns ranked by dimension and decide what to repair next.",
    cta: "Open Board",
  },
  {
    label: "C3 Coach",
    status: "Adaptive",
    href: "/coach",
    body: "Get the next C3 skill break when the mastery engine has enough signal.",
    cta: "Open Coach",
  },
  {
    label: "Certification",
    status: "Readiness",
    href: "/certification",
    body: "Check locked and unlocked competencies after the Method and assigned work.",
    cta: "View Certification",
  },
] as const;

type DisplayZone = {
  dimension: string;
  tag: string;
  proficiency_score: number;
  attempts: number;
  high_confidence_wrongs: number;
};

export default function DashboardPage() {
  const dash = useDashboard();
  const foundations = useFoundations();
  const c3 = useC3();
  const [status, setStatus] = useState<CohortStatus | null>(null);
  const [cohortError, setCohortError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.cohortStatus().then(
      (value) => {
        if (!cancelled) setStatus(value);
      },
      (err) => {
        if (!cancelled) setCohortError(formatError(err));
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const data = dash.data;
  const zones = useMemo(() => collectZones(data), [data]);
  const weakestZone = zones[0] ?? null;
  const metrics = data?.metrics ?? {
    repair_progress_pct: 0,
    active_red_zones: 0,
    high_confidence_wrongs: 0,
  };
  const nextDrill = buildNextDrill(data?.assigned_drills?.[0] ?? null, weakestZone);
  const recent = data?.recent_attempts ?? [];
  const hasData = zones.length > 0 || recent.length > 0;
  const methodEntryPending =
    foundations.loading ||
    (foundations.data != null && !foundations.data.progress.complete);

  const banner = resolveBanner(dash, hasData, methodEntryPending);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="border-b border-zinc-900 pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Student Dashboard
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
              Progress, next drill, and recent wrong-answer forensics.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
              Decide what to repair next, check whether your red-zone load is
              shrinking, and revisit the traps that pulled recent wrong answers.
            </p>
          </div>
          <CohortCard status={status} error={cohortError} />
        </div>
      </div>

      {foundations.data &&
        !foundations.data.progress.complete && (
          <MethodGate data={foundations.data} />
        )}

      {c3.signedIn && c3.data && (
        <C3HeroCard data={c3.data} />
      )}

      {banner && <StateBanner banner={banner} />}

      <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Dashboard metrics">
        <MetricCard
          label="Repair Progress"
          value={`${metrics.repair_progress_pct}%`}
          detail="Average red-zone proficiency"
        />
        <MetricCard
          label="Active Red Zones"
          value={String(metrics.active_red_zones)}
          detail="Dimensions below stable range"
        />
        <MetricCard
          label="High-Confidence Wrongs"
          value={String(metrics.high_confidence_wrongs)}
          detail="Priority errors to review"
        />
      </section>

      <ProgramCommandCenter />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <ProgressPanel progress={metrics.repair_progress_pct} syncError={dash.error} />
        <NextDrillPanel drill={nextDrill} />
      </div>

      <section className="mt-8" aria-labelledby="recent-forensics">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-300 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
              Recent Forensics
            </p>
            <h2
              id="recent-forensics"
              className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950"
            >
              Traps to reread before the next set
            </h2>
          </div>
          <Link href="/red-zones" className="btn btn-sm ghost">
            Open Red-Zone Map
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {recent.slice(0, 6).map((item) => (
              <ForensicsCard key={item.attempt_id} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-5 border border-zinc-200 bg-zinc-50 p-5 text-sm leading-6 text-zinc-600">
            No attempts yet. Work a drill or the diagnostic and your wrong-answer
            forensics will appear here.
          </p>
        )}
      </section>
    </section>
  );
}

function ProgramCommandCenter() {
  return (
    <section className="mt-8" aria-labelledby="program-command-center">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-300 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            Paid Program Command Center
          </p>
          <h2
            id="program-command-center"
            className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950"
          >
            Your repair tools are live from here.
          </h2>
        </div>
        <Link href="/dashboard/path" className="btn btn-sm red">
          Continue Lead Me
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PROGRAM_COMMAND_CENTER.map((item) => (
          <article key={item.href} className="flex min-h-52 flex-col border border-zinc-300 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-2xl font-semibold leading-tight text-zinc-950">
                {item.label}
              </h3>
              <span className="shrink-0 border border-zinc-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                {item.status}
              </span>
            </div>
            <p className="mt-4 flex-1 text-sm leading-6 text-zinc-700">
              {item.body}
            </p>
            <Link href={item.href} className="mt-5 font-mono text-xs uppercase tracking-wider text-red-700 hover:text-red-900">
              {item.cta} <span aria-hidden>→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

type Banner =
  | { tone: "info"; text: string; cta?: { href: string; label: string } }
  | null;

function resolveBanner(
  dash: ReturnType<typeof useDashboard>,
  hasData: boolean,
  methodEntryPending: boolean,
): Banner {
  if (dash.loading) return null;
  if (!dash.signedIn) {
    return {
      tone: "info",
      text: "Sign in to see your real progress, red zones, and assigned drills.",
      cta: { href: "/sign-in", label: "Sign in" },
    };
  }
  if (dash.data && !dash.data.enrolled) {
    return {
      tone: "info",
      text:
        dash.data.refunded || dash.data.status === "suspended"
          ? "Your access is paused. Update billing or contact support to restore it."
          : "You're signed in but not enrolled yet. Enroll to unlock the full repair program.",
      cta: dash.data.status === "suspended"
        ? { href: "/account", label: "Manage billing" }
        : { href: "/checkout", label: "Enroll now" },
    };
  }
  if (dash.data?.enrolled && !hasData && !methodEntryPending) {
    return {
      tone: "info",
      text: "You're enrolled. Take the diagnostic to build your Red-Zone Map and unlock targeted drills.",
      cta: { href: "/diagnostic", label: "Take the diagnostic" },
    };
  }
  return null;
}

// The core-starter gate: surfaced first, and only until the student finishes the
// 14-lesson method course. The whole repair loop is built on this frame, so new
// students are routed here before going deep on drills and the diagnostic.
function MethodGate({ data }: { data: FoundationsOutline }) {
  const p = data.progress;
  const started = p.lessons_completed > 0;
  const resumeSlug = p.next_slug ?? data.lessons[0]?.slug ?? "lesson-01";
  const methodHref = `/foundations/${resumeSlug}`;
  return (
    <section className="mt-6 border-2 border-zinc-900 bg-zinc-950 p-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-red-300">
            Dashboard entry - The Method
          </p>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            {started
              ? "Resume The Method before you go deep on drills."
              : "Start The Method with Lesson 1."}
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-200">
            {data.tagline}
          </p>
          <div className="mt-4 h-2 w-full max-w-md overflow-hidden border border-white/30 bg-white/10">
            <div className="h-full bg-red-600" style={{ width: `${p.percent}%` }} aria-hidden />
          </div>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-300">
            {p.lessons_completed}/{p.lesson_count} lessons · {p.percent}%
          </p>
        </div>
        <Link
          href={methodHref}
          className="btn btn-lg red bg-red-700 text-white hover:bg-red-600"
        >
          {started ? "Resume The Method" : "Start The Method"} <span aria-hidden>→</span>
        </Link>
      </div>
      <Link
        href="/foundations"
        className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider text-zinc-400 hover:text-white"
      >
        View all 14 lessons
      </Link>
    </section>
  );
}

function C3HeroCard({ data }: { data: import("@/lib/api-client").C3Mastery }) {
  const measured = data.readiness.score !== null;
  return (
    <section className="mt-6 border-2 border-zinc-900 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">C3 Mastery — your flagship metric</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
            {measured ? `Readiness ${data.readiness.score}` : "Not yet measured"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            {measured
              ? `Clean-cut ${data.tracks.clean_cut_hit_rate == null ? "—" : Math.round(data.tracks.clean_cut_hit_rate * 100) + "%"} · calibration ${data.tracks.calibration.direction}. Everything below is a facet of this.`
              : `Work the bank or the diagnostic — mastery lights up after ${data.readiness.mold_floor} exposures per skill.`}
          </p>
        </div>
        <Link href="/mastery" className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900">Open Mastery →</Link>
      </div>
    </section>
  );
}

function StateBanner({ banner }: { banner: NonNullable<Banner> }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-5">
      <p className="text-sm leading-6 text-zinc-800">{banner.text}</p>
      {banner.cta && (
        <Link
          href={banner.cta.href}
          className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
        >
          {banner.cta.label}
        </Link>
      )}
    </div>
  );
}

function CohortCard({
  status,
  error,
}: {
  status: CohortStatus | null;
  error: string | null;
}) {
  return (
    <aside className="border border-zinc-300 bg-white p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
        Cohort Status
      </p>
      {status && (
        <>
          <p className="mt-3 text-lg font-semibold leading-7 text-zinc-950">
            {status.public_copy}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-wider text-zinc-700">
            {formatCohortCode(status.cohort_code)} /{" "}
            {formatCohortPublicStatus(status.public_status)}
          </p>
        </>
      )}
      {!status && !error && (
        <p className="mt-3 text-sm text-zinc-700">Loading cohort status...</p>
      )}
      {error && (
        <p className="mt-3 text-sm leading-6 text-zinc-700">
          Cohort status is temporarily unavailable. Your dashboard still works,
          and access will refresh when live status reconnects.
        </p>
      )}
    </aside>
  );
}

function formatCohortCode(code: string): string {
  return code
    .split(/[_-]+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "mbe") return "MBE";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function formatCohortPublicStatus(status: CohortStatus["public_status"]): string {
  return COHORT_STATUS_LABEL[status] ?? formatCohortCode(status);
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="border border-zinc-300 bg-white p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
        {label}
      </p>
      <p className="mt-3 font-serif text-4xl font-semibold leading-none text-zinc-950">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-zinc-700">{detail}</p>
    </article>
  );
}

function ProgressPanel({
  progress,
  syncError,
}: {
  progress: number;
  syncError: string | null;
}) {
  return (
    <section className="border border-zinc-300 bg-white p-6" aria-labelledby="repair-progress">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            Repair Progress
          </p>
          <h2
            id="repair-progress"
            className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950"
          >
            Today&apos;s path
          </h2>
        </div>
        <span className="font-mono text-sm font-semibold text-red-700">
          {progress}% repaired
        </span>
      </div>

      <div className="mt-5 h-3 w-full overflow-hidden border border-zinc-900 bg-zinc-100">
        <div
          className="h-full bg-red-700"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {PROGRESS_GUIDE.map((step) => (
          <li key={step.label} className="border border-zinc-200 p-4">
            <p className="font-semibold text-zinc-950">{step.label}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{step.detail}</p>
          </li>
        ))}
      </ol>

      {syncError && (
        <p className="mt-5 border border-amber-300 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
          Live data sync unavailable: {syncError}
        </p>
      )}
    </section>
  );
}

function NextDrillPanel({ drill }: { drill: typeof FALLBACK_NEXT_DRILL }) {
  return (
    <section className="border border-zinc-900 bg-zinc-950 p-6 text-white" aria-labelledby="next-drill">
      <p className="font-mono text-xs uppercase tracking-wider text-red-300">
        Next Drill
      </p>
      <h2 id="next-drill" className="mt-3 font-serif text-3xl font-semibold tracking-tight">
        {drill.title}
      </h2>
      <p className="mt-3 font-mono text-xs uppercase tracking-wider text-zinc-300">
        {drill.subtitle}
      </p>
      <p className="mt-5 text-sm leading-7 text-zinc-200">{drill.body}</p>
      <Link href={drill.href} className="btn btn-lg red mt-6 bg-red-700 text-white hover:bg-red-900">
        Start Next Drill
      </Link>
    </section>
  );
}

function ForensicsCard({ item }: { item: DashboardRecentAttempt }) {
  return (
    <article className="border border-zinc-300 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          {item.subject}
        </p>
        <span
          className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
            item.correct
              ? "border-emerald-700 text-emerald-800"
              : "border-amber-700 text-amber-800"
          }`}
        >
          {item.correct ? "Correct" : "Missed"}
        </span>
      </div>
      <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-zinc-950">
        {item.correct ? "Cleared" : (item.trap_name ?? "Wrong-answer trap")}
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-200 pt-4 text-sm">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-700">
            Selected
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold leading-none text-zinc-950">
            {item.selected_letter ?? "-"}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-700">
            Topic
          </p>
          <p className="mt-1 text-sm text-zinc-800">
            {item.subtopic ?? "General"}
          </p>
        </div>
      </div>
    </article>
  );
}

function collectZones(data: DashboardData | null): DisplayZone[] {
  if (!data?.red_zones?.by_dimension) return [];
  return Object.entries(data.red_zones.by_dimension)
    .flatMap(([dimension, entries]) =>
      entries.map((entry) => ({ ...entry, dimension })),
    )
    .sort(compareZones);
}

function buildNextDrill(
  drill: DashboardAssignedDrill | null,
  zone: DisplayZone | null,
): typeof FALLBACK_NEXT_DRILL {
  if (drill) {
    return {
      title: formatDrillName(drill.drill_name),
      subtitle: titleize(drill.red_zone_dimension ?? "Assigned repair"),
      href: "/red-zones",
      body:
        drill.red_zone_tag != null
          ? `Assigned to repair ${titleize(drill.red_zone_tag)}. Open the Red-Zone Map to start it.`
          : `${formatDrillName(drill.reason)} is ready. Open the Red-Zone Map to start it.`,
    };
  }
  if (zone) {
    return {
      title: `Repair ${titleize(zone.tag)}`,
      subtitle: titleize(zone.dimension),
      href: "/red-zones",
      body: `Your lowest-proficiency pattern at ${Math.round(
        normalizeScore(zone.proficiency_score) * 100,
      )}%. Review it on the Red-Zone Map before the next assigned drill.`,
    };
  }
  return FALLBACK_NEXT_DRILL;
}

function compareZones(a: DisplayZone, b: DisplayZone) {
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

function titleize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatError(error: unknown) {
  if (error instanceof ApiClientError) return `API ${error.status}: ${error.message}`;
  if (error instanceof Error) return error.message;
  return "Unknown error";
}
