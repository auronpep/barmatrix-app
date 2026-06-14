"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCommandDeck } from "@/lib/use-command-deck";
import { Panel } from "@/components/preview-dashboard/panel";
import { TodayTile } from "@/components/preview-dashboard/today-tile";
import { MasteryList } from "@/components/preview-dashboard/mastery-list";
import { RedZoneList } from "@/components/preview-dashboard/red-zone-list";
import { TrendSpark } from "@/components/preview-dashboard/trend-spark";
import { RecentFeed } from "@/components/preview-dashboard/recent-feed";
import { TodayQueue } from "@/components/preview-dashboard/today-queue";
import { TensionMatrix } from "@/components/preview-dashboard/tension-matrix";

export default function PreviewDashboardPage() {
  const router = useRouter();
  const { loading, signedIn, data, error } = useCommandDeck();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="mb-8 border-b border-zinc-900 pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--red)]">
          Command Deck · Preview
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Your repair command deck.
        </h1>
      </div>

      {!signedIn && !loading ? (
        <GatePanel
          text="Sign in to load your command deck — live mastery, red zones, and today's queue."
          href="/sign-in"
          cta="Sign in"
        />
      ) : loading ? (
        <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
          Loading your command deck…
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
          Your command deck is temporarily unavailable{error ? `: ${error}` : ""}.
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
  const startDrill = (slug: string) => {
    router.push(slug ? `/drills/${slug}` : "/drills");
  };
  const queue = data.next_up ? [data.next_up] : [];

  return (
    <div className="space-y-6">
      {error ? (
        <p className="border border-amber-300 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
          Live data sync degraded: {error}
        </p>
      ) : null}

      {/* Row 1: Today + Subject Mastery */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <TodayTile
          student={data.student}
          nextUp={data.next_up}
          onStart={() => startDrill(data.next_up?.drill_slug ?? "")}
        />
        <Panel title="▌ Subject Mastery" meta="Last 14 days" flush>
          <MasteryList
            items={data.subject_mastery}
            onSubject={() => router.push("/red-zones")}
          />
        </Panel>
      </div>

      {/* Row 2: Red Zones + (Trend over Recent) */}
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
        <div className="flex flex-col gap-6">
          <Panel title="▌ Mastery Trend · 14d" meta="Rolling % correct" flush>
            <TrendSpark points={data.mastery_trend} />
          </Panel>
          <Panel title="▌ Recent Attempts" meta="Live" flush>
            <RecentFeed items={data.recent_attempts.slice(0, 5)} />
          </Panel>
        </div>
      </div>

      {/* Row 3: Today's Queue */}
      <Panel title="▌ Today's Queue" meta="Sequenced · weakest tags first" flush>
        <TodayQueue items={queue} onStart={startDrill} />
      </Panel>

      {/* Row 4: Personal Tension Matrix */}
      <Panel
        title="▌ Personal Tension Matrix · Hot Cells"
        actions={
          <Link
            href="/matrix"
            className="font-mono text-[11px] uppercase tracking-wider text-[var(--red)] hover:text-[var(--red-deep)]"
          >
            Open Full Matrix →
          </Link>
        }
      >
        <TensionMatrix matrix={data.tension_matrix} />
      </Panel>
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
