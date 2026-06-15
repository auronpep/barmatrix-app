"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, type CommandDeckQueueItem } from "@/lib/api-client";
import { useCommandDeck } from "@/lib/use-command-deck";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { DashboardShell } from "@/components/preview-dashboard/dashboard-shell";
import { DashboardV2Body } from "@/components/preview-dashboard/dashboard-v2-body";

// The paid /dashboard — migrated to the Briefing v3 command deck (the full v2
// deck inside a persistent left-sidebar app shell). Same live data source as
// the /preview/dashboard-v* surfaces (GET /api/me/command-deck via
// useCommandDeck). The dashboard route group's layout suppresses its own tab
// chrome on this exact path (the v3 shell owns navigation); the nested
// /dashboard/mastery|final-sprint|path views keep the legacy tab chrome.

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

export default function DashboardPage() {
  const router = useRouter();
  const { getToken } = useClerkAuth();
  const { loading, signedIn, data, error } = useCommandDeck();

  // One-click start: launch the queued red-zone drill via the real
  // POST /api/drills/start flow, then route to the runner. Always degrades to
  // the /drills "Prescribed" tab (the working two-click path) if the item isn't
  // red-zone-typed, the token is missing, or the start call fails — so the
  // primary CTA can never dead-end.
  const startDrill = async (item: CommandDeckQueueItem) => {
    if (!item?.red_zone_dimension || !item?.red_zone_tag) {
      router.push("/drills");
      return;
    }
    try {
      const token = await getToken();
      const res = await api.startDrill(
        {
          kind: "prescribed_red_zone",
          red_zone_dimension: item.red_zone_dimension,
          red_zone_tag: item.red_zone_tag,
        },
        token,
      );
      router.push(res?.drill_id ? `/drills/${res.drill_id}` : "/drills");
    } catch {
      router.push("/drills");
    }
  };

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
          onStartDrill={startDrill}
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
          Command Deck
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
