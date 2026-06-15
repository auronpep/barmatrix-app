"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCommandDeck } from "@/lib/use-command-deck";
import { DashboardV2Body } from "@/components/preview-dashboard/dashboard-v2-body";

// Derive the cohort exam date label from the server-sent countdown so it stays
// in sync with the single source of truth (no second hardcoded date).
function examDateLabel(daysToExam: number | null): string {
  if (daysToExam === null) return "";
  const d = new Date();
  d.setDate(d.getDate() + daysToExam);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Briefing v2 — the FULL command deck. Same live data source as
// /preview/dashboard (v1), but the complete superset: v1's Briefing top plus the
// repurposed analytics suite (sequenced queue, mastery trend, tension heatmap,
// activity feed). v1 is left untouched. Fully operational — no founder gate.
export default function PreviewDashboardV2Page() {
  const router = useRouter();
  const { loading, signedIn, data, error } = useCommandDeck();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="mb-8 border-b border-zinc-900 pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--red)]">
          Briefing v2 · Full Command Deck · Preview
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Your repair briefing.
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          The complete deck — readiness, your next move, every lens, and the full
          analytics suite, all on your live data.
        </p>
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
        <>
          {error ? (
            <p className="mb-6 border border-amber-300 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
              Live data sync degraded: {error}
            </p>
          ) : null}
          <DashboardV2Body
            data={data}
            examDateLabel={examDateLabel(data.student.days_to_exam)}
            onStartDrill={() => router.push("/drills")}
            onOpenRoute={(route) => router.push(route)}
          />
        </>
      ) : (
        <p className="border border-amber-300 bg-amber-50 p-6 font-mono text-xs text-amber-900">
          Your briefing is temporarily unavailable{error ? `: ${error}` : ""}.
        </p>
      )}
    </section>
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
