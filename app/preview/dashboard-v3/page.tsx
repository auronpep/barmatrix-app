"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCommandDeck } from "@/lib/use-command-deck";
import { DashboardShell } from "@/components/preview-dashboard/dashboard-shell";
import { DashboardV2Body } from "@/components/preview-dashboard/dashboard-v2-body";

// Derive the cohort exam date label from the server-sent countdown so it stays
// in sync with the single source of truth (no second hardcoded date).
function examDateLabel(daysToExam: number | null): string {
  if (daysToExam === null) return "";
  const d = new Date();
  d.setDate(d.getDate() + daysToExam);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initialsOf(firstName: string): string {
  const f = firstName.trim();
  return (f ? f.slice(0, 2) : "?").toUpperCase();
}

// Briefing v3 — a full copy of v2 (the complete command deck) presented inside a
// persistent left-sidebar app shell + topbar. Same live data source as v1/v2; v1
// and v2 are left fully intact. The body is the shared DashboardV2Body so the
// three versions never drift.
export default function PreviewDashboardV3Page() {
  const router = useRouter();
  const { loading, signedIn, data, error } = useCommandDeck();

  // Full shell only renders once we have the student's enrolled deck data.
  if (signedIn && data && data.enrolled) {
    return (
      <DashboardShell
        data={data}
        user={{
          name: data.student.first_name,
          initials: initialsOf(data.student.first_name),
          sublabel: `${data.student.streak_days}-day streak`,
        }}
      >
        {error ? (
          <p className="mb-6 border border-amber-300 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
            Live data sync degraded: {error}
          </p>
        ) : null}
        <DashboardV2Body
          data={data}
          examDateLabel={examDateLabel(data.student.days_to_exam)}
          onStartDrill={(slug) =>
            router.push(slug ? `/drills/${slug}` : "/drills")
          }
          onOpenRoute={(route) => router.push(route)}
        />
      </DashboardShell>
    );
  }

  // Signed-out / loading / not-enrolled / error — standalone (no shell yet).
  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="mb-8 border-b border-zinc-900 pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--red)]">
          Briefing v3 · Command Deck + Sidebar Nav · Preview
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Your repair briefing.
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          The full command deck inside a persistent left-hand navigation shell.
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
