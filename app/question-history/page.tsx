"use client";

import Link from "next/link";
import { type DashboardRecentAttempt } from "@/lib/api-client";
import { formatStudyLabel } from "@/lib/study-labels";
import { useDashboard } from "@/lib/use-dashboard";

export default function QuestionHistoryPage() {
  const dash = useDashboard();
  const attempts = dash.data?.recent_attempts ?? [];
  const wrongCount = attempts.filter((attempt) => !attempt.correct).length;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="border-b border-zinc-900 pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Question History
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
              Recent attempts with the trap attached.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
              Each recorded attempt keeps the question, selected answer, result,
              subtopic, and wrong-answer trap together.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="Loaded" value={String(attempts.length)} />
            <Metric label="Missed" value={String(wrongCount)} />
            <Metric label="Correct" value={String(attempts.length - wrongCount)} />
          </div>
        </div>
      </div>

      {dash.loading && <StatePanel title="Loading history" body="Reading your latest attempts." />}
      {dash.error && (
        <StatePanel
          title="Question history unavailable"
          body="Your live attempt history could not load. You can still work a drill while history reconnects."
          error={dash.error}
          href="/drills"
          cta="Open Drills"
        />
      )}
      {!dash.loading && !dash.error && !dash.signedIn && (
        <StatePanel
          title="Sign in to see history"
          body="Question history is account-specific and appears after diagnostic or drill attempts."
          href="/sign-in?after=question-history"
          cta="Sign in"
        />
      )}
      {!dash.loading && !dash.error && dash.signedIn && attempts.length === 0 && (
        <StatePanel
          title="No question history yet"
          body="Work a drill or take the diagnostic to start recording attempts."
          href="/diagnostic"
          cta="Start diagnostic"
        />
      )}

      {attempts.length > 0 && (
        <section className="mt-8" aria-labelledby="history-list">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-300 pb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
                Attempt Log
              </p>
              <h2 id="history-list" className="mt-2 font-serif text-3xl font-semibold">
                Latest recorded questions
              </h2>
            </div>
            <Link href="/red-zones" className="btn ghost btn-sm">
              Open Red-Zone Map
            </Link>
          </div>

          <div className="mt-5 grid gap-4">
            {attempts.map((attempt) => (
              <AttemptCard key={attempt.attempt_id} attempt={attempt} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

function AttemptCard({ attempt }: { attempt: DashboardRecentAttempt }) {
  return (
    <article className="border border-zinc-300 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px_120px_180px] md:items-center">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
            {formatStudyLabel(attempt.subject)}
          </p>
          <h3 className="mt-2 break-words font-serif text-2xl font-semibold text-zinc-950">
            {attempt.trap_name
              ? formatStudyLabel(attempt.trap_name)
              : attempt.correct
                ? "Cleared"
                : "Wrong-answer trap"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            {attempt.subtopic ? formatStudyLabel(attempt.subtopic) : "General practice"}
          </p>
        </div>
        <HistoryStat label="Question" value={attempt.question_id.slice(0, 8)} />
        <HistoryStat label="Selected" value={attempt.selected_letter ?? "-"} />
        <div className="md:text-right">
          <span
            className={`inline-block border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${
              attempt.correct
                ? "border-emerald-700 text-emerald-800"
                : "border-red-700 text-red-800"
            }`}
          >
            {attempt.correct ? "Correct" : "Missed"}
          </span>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            {formatDate(attempt.attempted_at)}
          </p>
        </div>
      </div>
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

function HistoryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 break-words font-serif text-xl font-semibold text-zinc-950">
        {value}
      </p>
    </div>
  );
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recorded";
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
