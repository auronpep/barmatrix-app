import Link from "next/link";
import type {
  CommandDeckData,
  CommandDeckQueueItem,
} from "@/lib/api-client";
import { computeReadiness } from "@/lib/readiness";
import { Panel } from "@/components/preview-dashboard/panel";
import { BriefingHero } from "@/components/preview-dashboard/briefing-hero";
import { MoveBand } from "@/components/preview-dashboard/move-band";
import { DiagRouter } from "@/components/preview-dashboard/diag-router";
import { RecapStrip } from "@/components/preview-dashboard/recap-strip";
import { RedZoneList } from "@/components/preview-dashboard/red-zone-list";
import { MasteryList } from "@/components/preview-dashboard/mastery-list";
import { TrendSpark } from "@/components/preview-dashboard/trend-spark";
import { TensionMatrix } from "@/components/preview-dashboard/tension-matrix";
import { RecentFeed } from "@/components/preview-dashboard/recent-feed";
import { TodayQueue } from "@/components/preview-dashboard/today-queue";
import { TrapsToReread } from "@/components/preview-dashboard/traps-to-reread";
import { DailyBread } from "@/components/preview-dashboard/daily-bread";

// Small mono "Open full →" link used in panel action slots.
function PanelLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--red)] hover:underline"
    >
      {label} →
    </Link>
  );
}

const componentLinks = [
  {
    href: "/atlas",
    name: "Outline Atlas",
    desc: "Walk the outline by code and open packet axes, choice patterns, and component payloads.",
  },
  {
    href: "/red-zones",
    name: "Red-Zone V5",
    desc: "Review the 10 locked C3 repair modes before drilling the packet map.",
  },
  {
    href: "/tensions",
    name: "C3 Axis Map",
    desc: "Open the legal fights by outline code: side A, side B, resolver, method class.",
  },
  {
    href: "/traps",
    name: "Choice Patterns",
    desc: "Review the mold, broken filter, attraction, signal, and responsive repair.",
  },
  {
    href: "/drills",
    name: "Packet Drills",
    desc: "Choose drills from packet axes and choice-pattern mechanics.",
  },
  {
    href: "/coach",
    name: "C3 Coach",
    desc: "Use the Coach shell after validated choice diagnostics attach attempt signal.",
  },
  {
    href: "/diagnostic",
    name: "Diagnostic",
    desc: "Create attempt signal without changing the gated C3 mastery bridge.",
  },
  {
    href: "/foundations",
    name: "The Method",
    desc: "Review the core method beside the packet taxonomy.",
  },
  {
    href: "/practice",
    name: "Practice",
    desc: "Work live bank questions while the C3 attempt bridge remains gated.",
  },
  {
    href: "/timed-sets",
    name: "Timed Sets",
    desc: "Pressure-test repaired patterns under exam pacing.",
  },
] as const;

// Briefing v2 — the FULL command deck. Direction B's Briefing top (readiness +
// move band + lens router) PLUS the complete analytics suite that v1 demoted:
// sequenced queue, mastery trend sparkline, personal tension-matrix heatmap, and
// the live activity feed. Every component is wired to the same live deck data and
// degrades honestly on low-data students. Presentational only — both the live
// route and the demo route feed it data + handlers.
export function DashboardV2Body({
  data,
  examDateLabel,
  onStartDrill,
  onOpenRoute,
}: {
  data: CommandDeckData;
  examDateLabel: string;
  onStartDrill: (item: CommandDeckQueueItem) => void;
  onOpenRoute: (route: string) => void;
}) {
  const r = computeReadiness(data);
  const queue = data.queue?.length
    ? data.queue
    : data.next_up
      ? [data.next_up]
      : [];

  return (
    <div>
      {/* loop-closer */}
      <RecapStrip
        items={data.recent_attempts}
        onResume={() => {
          if (data.next_up) onStartDrill(data.next_up);
        }}
        canResume={Boolean(data.next_up)}
      />

      {/* ORIENT — readiness briefing hero */}
      {r.hasSignal ? (
        <BriefingHero
          student={data.student}
          r={r}
          examDateLabel={examDateLabel}
        />
      ) : (
        <div className="mb-6 border border-zinc-300 bg-zinc-50 p-6 text-sm leading-6 text-zinc-600">
          Your readiness signal builds after your first attempts. Work the move
          below and your briefing fills in.
        </div>
      )}

      {/* SPIRIT — daily bread (state-aware scripture, integrated) */}
      <DailyBread data={data} />

      {/* ACT — the move band */}
      {queue.length > 0 ? (
        <MoveBand queue={queue} onStart={onStartDrill} />
      ) : (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-zinc-950 px-6 py-5 text-zinc-300">
          <span className="text-sm">
            No drill queued yet — take the diagnostic to build your repair queue.
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
        <Panel
          title="▌ Where to dig next"
          meta="Red-Zone V5 packet lenses"
          flush
        >
          <DiagRouter data={data} />
        </Panel>
      </div>

      <div className="mb-6">
        <Panel
          title="▌ Repair components"
          meta="Packet-first routes behind today's move"
          flush
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {componentLinks.map((component) => (
              <Link
                key={component.href}
                href={component.href}
                prefetch={false}
                className="border-b border-r border-[var(--rule-soft)] px-5 py-4 transition-colors last:border-r-0 hover:bg-black/[0.025] sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
              >
                <div className="mb-1.5 font-serif text-[17px] font-bold tracking-tight text-zinc-950">
                  {component.name}
                </div>
                <div className="text-[12.5px] leading-snug text-zinc-700">
                  {component.desc}
                </div>
                <div className="mt-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--red)]">
                  Open →
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      {/* PLAN — full sequenced repair queue (repurposed from the old deck) */}
      <div className="mb-6">
        <Panel
          title="▌ Sequenced repair queue"
          actions={<PanelLink href="/drills" label="All drills" />}
          flush
        >
          <TodayQueue items={queue} onStart={onStartDrill} />
        </Panel>
      </div>

      {/* REVIEW — red zones + mastery trend */}
      <div className="mb-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="▌ Active Red Zones"
          actions={<PanelLink href="/red-zones" label="Open V5 catalog" />}
          flush
        >
          <RedZoneList
            items={data.red_zones}
            onOpen={() => onOpenRoute("/red-zones")}
          />
        </Panel>
        <Panel
          title="▌ Mastery trend"
          actions={<PanelLink href="/pattern-board" label="Pattern board" />}
          flush
        >
          <TrendSpark points={data.mastery_trend} />
        </Panel>
      </div>

      {/* RE-READ — recent wrong-answer traps (from the original dashboard) */}
      <div className="mb-6">
        <Panel
          title="▌ Choice patterns to reread before the next set"
          actions={<PanelLink href="/traps" label="Open patterns" />}
          flush
        >
          <TrapsToReread items={data.recent_attempts} />
        </Panel>
      </div>

      {/* MAP — personal tension heatmap + subject mastery */}
      <div className="mb-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="▌ Your axis signal"
          actions={<PanelLink href="/tensions" label="Axis map" />}
          flush
        >
          <TensionMatrix matrix={data.tension_matrix} />
        </Panel>
        <Panel
          title="▌ Subject Mastery"
          meta="Last 14 days"
          flush
        >
          <MasteryList
            items={data.subject_mastery}
            onSubject={() => onOpenRoute("/red-zones")}
          />
        </Panel>
      </div>

      {/* LOG — live activity feed */}
      <div className="mb-2">
        <Panel title="▌ Recent activity" meta="Your latest attempts" flush>
          <RecentFeed items={data.recent_attempts} />
        </Panel>
      </div>
    </div>
  );
}
