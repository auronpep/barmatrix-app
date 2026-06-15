"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  type DashboardRecentAttempt,
  type DashboardRedZoneEntry,
} from "@/lib/api-client";
import { formatStudyLabel } from "@/lib/study-labels";
import { useDashboard } from "@/lib/use-dashboard";

export default function MisconceptionsPage() {
  const dash = useDashboard();
  const misconceptions = dash.data?.red_zones.by_dimension.misconception ?? [];
  const missedAttempts = useMemo(
    () => (dash.data?.recent_attempts ?? []).filter((attempt) => !attempt.correct),
    [dash.data],
  );
  const totalFalls = misconceptions.reduce((sum, item) => sum + item.attempts, 0);
  const highConfidenceWrongs = misconceptions.reduce(
    (sum, item) => sum + item.high_confidence_wrongs,
    0,
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="border-b border-zinc-900 pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Misconception Profile
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
              The wrong beliefs BarMatrix has caught more than once.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
              Your red-zone misconception dimension and recent misses show what
              keeps pulling you into wrong answers.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="Active" value={String(misconceptions.length)} />
            <Metric label="Falls" value={String(totalFalls)} />
            <Metric label="HC wrong" value={String(highConfidenceWrongs)} />
          </div>
        </div>
      </div>

      {dash.loading && <StatePanel title="Loading misconceptions" body="Reading your latest red-zone profile." />}
      {dash.error && (
        <StatePanel
          title="Misconception profile unavailable"
          body="Your live misconception profile could not load. You can still browse the trap taxonomy while account history reconnects."
          error={dash.error}
          href="/traps"
          cta="Open Trap Taxonomy"
        />
      )}
      {!dash.loading && !dash.error && !dash.signedIn && (
        <StatePanel
          title="Sign in to see misconceptions"
          body="Your misconception profile is built from your diagnostic and drill misses."
          href="/sign-in?after=misconceptions"
          cta="Sign in"
        />
      )}
      {!dash.loading && !dash.error && dash.signedIn && misconceptions.length === 0 && (
        <StatePanel
          title="No repeated misconceptions yet"
          body="Take the diagnostic or work a drill. Repeated misconception patterns will appear here after they are recorded."
          href="/diagnostic"
          cta="Start diagnostic"
        />
      )}

      {misconceptions.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-labelledby="misconception-list">
            <div className="border-b border-zinc-300 pb-4">
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
                Active Misconceptions
              </p>
              <h2 id="misconception-list" className="mt-2 font-serif text-3xl font-semibold">
                Repair these beliefs first
              </h2>
            </div>
            <div className="mt-5 grid gap-4">
              {misconceptions
                .slice()
                .sort(compareMisconceptions)
                .map((item, index) => (
                  <MisconceptionCard
                    key={item.tag}
                    item={item}
                    rank={index + 1}
                  />
                ))}
            </div>
          </section>

          <aside className="border border-zinc-300 bg-zinc-50 p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
              Recent misses
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">
              Where the belief showed up
            </h2>
            <div className="mt-5 grid gap-3">
              {missedAttempts.length > 0 ? (
                missedAttempts.slice(0, 5).map((attempt) => (
                  <RecentMiss key={attempt.attempt_id} attempt={attempt} />
                ))
              ) : (
                <p className="text-sm leading-6 text-zinc-700">
                  No recent missed attempts are available in the dashboard payload yet.
                </p>
              )}
            </div>
            <Link href="/question-history" className="btn ghost btn-sm mt-6">
              Open Question History
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

function MisconceptionCard({
  item,
  rank,
}: {
  item: DashboardRedZoneEntry;
  rank: number;
}) {
  const score = normalizeScore(item.proficiency_score);
  const pct = Math.round(score * 100);

  return (
    <article className="border border-zinc-300 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-[54px_minmax(0,1fr)_150px] md:items-start">
        <div className="font-serif text-4xl font-semibold leading-none text-red-700">
          {String(rank).padStart(2, "0")}
        </div>
        <div className="min-w-0">
          <h3 className="break-words font-serif text-2xl font-semibold text-zinc-950">
            {formatStudyLabel(item.tag)}
          </h3>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            This belief has enough signal to stay on the repair board. Rework it
            before adding more mixed practice.
          </p>
          <div className="mt-4 h-2 overflow-hidden border border-zinc-900 bg-zinc-100">
            <div
              className={score < 0.4 ? "h-full bg-red-700" : score < 0.7 ? "h-full bg-orange-600" : "h-full bg-emerald-700"}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="grid gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 md:text-right">
          <span>{item.attempts} falls</span>
          <span>{item.high_confidence_wrongs} HC wrong</span>
          <span>{pct}% score</span>
        </div>
      </div>
    </article>
  );
}

function RecentMiss({ attempt }: { attempt: DashboardRecentAttempt }) {
  return (
    <article className="border border-zinc-200 bg-white p-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
        {formatStudyLabel(attempt.subject)}
      </p>
      <h3 className="mt-2 font-serif text-xl font-semibold">
        {attempt.trap_name ? formatStudyLabel(attempt.trap_name) : "Wrong-answer trap"}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-700">
        Selected {attempt.selected_letter ?? "-"} on{" "}
        {attempt.subtopic ? formatStudyLabel(attempt.subtopic) : "general practice"}.
      </p>
    </article>
  );
}

function StatePanel({
  title,
  body,
  error,
  href,
  cta,
}: {
  title: string;
  body: string;
  error?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section className="mt-8 border border-zinc-300 bg-zinc-50 p-6">
      <h2 className="font-serif text-2xl font-semibold text-zinc-950">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">{body}</p>
      {error && <p className="mt-3 font-mono text-xs text-zinc-600">{error}</p>}
      {href && cta && (
        <Link href={href} className="btn red btn-sm mt-5">
          {cta}
        </Link>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-300 bg-white px-3 py-4">
      <p className="font-serif text-3xl font-semibold leading-none">{value}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
    </div>
  );
}

function compareMisconceptions(
  a: DashboardRedZoneEntry,
  b: DashboardRedZoneEntry,
) {
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
