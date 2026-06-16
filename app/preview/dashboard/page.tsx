"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCommandDeck } from "@/lib/use-command-deck";
import { computeReadiness } from "@/lib/readiness";
import { Panel } from "@/components/preview-dashboard/panel";
import { MasteryList } from "@/components/preview-dashboard/mastery-list";
import { RedZoneList } from "@/components/preview-dashboard/red-zone-list";
import { RecapStrip } from "@/components/preview-dashboard/recap-strip";
import { BriefingHero } from "@/components/preview-dashboard/briefing-hero";
import { MoveBand } from "@/components/preview-dashboard/move-band";
import { DiagRouter } from "@/components/preview-dashboard/diag-router";

// Derive the cohort exam date label from the server-sent countdown so it stays
// in sync with the single source of truth (no second hardcoded date).
function examDateLabel(daysToExam: number | null): string {
  if (daysToExam === null) return "";
  const d = new Date();
  d.setDate(d.getDate() + daysToExam);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PreviewDashboardPage() {
  const router = useRouter();
  const { loading, signedIn, data, error } = useCommandDeck();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="mb-8 border-b border-zinc-900 pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--red)]">
          Briefing · Preview
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Your repair briefing.
        </h1>
      </div>

      {!signedIn && !loading ? (
        <GatePanel
          text="Sign in to load your briefing — live readiness, your next move, and where to dig next."
          href="/sign-in"
          cta="Sign in"
        />
      ) : loading ? (
        <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
          Loading your briefing…
        </p>
      ) : data && !data.enrolled ? (
        <GatePanel
          text="You're signed in but not enrolled yet. Enroll to unlock the full repair program."
          href="/checkout"
          cta="Enroll now"
        />
      ) : data ? (
        <Deck data={data} router={router} error={error} />
      ) : (
        <p className="border border-amber-300 bg-amber-50 p-6 font-mono text-xs text-amber-900">
          Your briefing is temporarily unavailable{error ? `: ${error}` : ""}.
        </p>
      )}
    </section>
  );
}

function Deck({
  data,
  router,
  error,
}: {
  data: NonNullable<ReturnType<typeof useCommandDeck>["data"]>;
  router: ReturnType<typeof useRouter>;
  error: string | null;
}) {
  // Preview route keeps simple /drills routing (the live /dashboard owns the
  // one-click red-zone start flow).
  const startDrill = () => {
    router.push("/drills");
  };
  const r = computeReadiness(data);
  const queue = data.queue?.length
    ? data.queue
    : data.next_up
      ? [data.next_up]
      : [];

  return (
    <div>
      {error ? (
        <p className="mb-6 border border-amber-300 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
          Live data sync degraded: {error}
        </p>
      ) : null}

      {/* loop-closer */}
      <RecapStrip
        items={data.recent_attempts}
        onResume={() => startDrill()}
        canResume={Boolean(data.next_up)}
      />

      {/* ORIENT — readiness briefing hero */}
      {r.hasSignal ? (
        <BriefingHero
          student={data.student}
          r={r}
          examDateLabel={examDateLabel(data.student.days_to_exam)}
        />
      ) : (
        <div className="mb-6 border border-zinc-300 bg-zinc-50 p-6 text-sm leading-6 text-zinc-600">
          Your readiness signal builds after your first attempts. Work the move
          below and your briefing fills in.
        </div>
      )}

      {/* ACT — the move band */}
      {queue.length > 0 ? (
        <MoveBand queue={queue} onStart={startDrill} />
      ) : (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-zinc-950 px-6 py-5 text-zinc-300">
          <span className="text-sm">
            No drill queued yet — take the diagnostic to build your repair
            queue.
          </span>
          <Link
            href="/diagnostic"
            className="bg-[var(--red)] px-5 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-wide text-white hover:bg-[var(--red-deep)]"
          >
            Start diagnostic →
          </Link>
        </div>
      )}

      {/* DIAGNOSE — router across the four lenses */}
      <div className="mb-6">
        <Panel title="▌ Where to dig next" meta="Four lenses on the same misses" flush>
          <DiagRouter data={data} />
        </Panel>
      </div>

      {/* REVIEW — full red zones + subject mastery */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="▌ Active Red Zones · Top 5"
          meta="Ranked by miss-rate"
          flush
        >
          <RedZoneList
            items={data.red_zones}
            onOpen={() => router.push("/red-zones")}
          />
        </Panel>
        <Panel title="▌ Subject Mastery" meta="Last 14 days" flush>
          <MasteryList
            items={data.subject_mastery}
            onSubject={() => router.push("/red-zones")}
          />
        </Panel>
      </div>
    </div>
  );
}

function GatePanel({
  text,
  href,
  cta,
}: {
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-6">
      <p className="text-sm leading-6 text-zinc-800">{text}</p>
      <Link
        href={href}
        className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
      >
        {cta}
      </Link>
    </div>
  );
}
