import type { Metadata } from "next";
import Link from "next/link";
import { getTensionCatalog } from "@/lib/tensions";
import type { TensionEntry } from "@/lib/api-client";
import { TensionMapAnalytics } from "./tension-analytics";

export const metadata: Metadata = {
  title: "Tension Map",
  description:
    "Browse the recurring legal tension points the MBE tests. Each tension is a doctrinal collision; open one to see the questions targeted to it.",
};

export default async function TensionsPage({
  searchParams,
}: {
  searchParams: Promise<{ curated?: string; subject?: string }>;
}) {
  const [{ curated, subject }, catalog] = await Promise.all([
    searchParams,
    getTensionCatalog(),
  ]);
  const curatedOnly = curated === "1" || curated === "true";

  let visible = curatedOnly
    ? catalog.tensions.filter((t) => t.official)
    : catalog.tensions;

  if (subject) {
    visible = visible.filter(
      (t) => t.subject.toLowerCase() === subject.toLowerCase()
    );
  }

  const isEmpty = catalog.tensions.length === 0;
  const filteredEmpty = !isEmpty && visible.length === 0;

  // Group visible tensions by subject, preserving the API's sort within a subject.
  const bySubject = new Map<string, TensionEntry[]>();
  for (const tension of visible) {
    const list = bySubject.get(tension.subject) ?? [];
    list.push(tension);
    bySubject.set(tension.subject, list);
  }
  const subjects = [...bySubject.keys()].sort((a, b) => a.localeCompare(b));

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <TensionMapAnalytics
        tensionCount={catalog.totals.tension_count}
        officialCount={catalog.totals.official_count}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
          Tension Map
        </p>
        <Link
          href="/app"
          className="rounded-md font-mono text-xs uppercase tracking-wider text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Command center
        </Link>
      </div>

      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        The recurring legal tension points
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        The MBE tests a finite set of doctrinal collisions — two rules that pull a
        fact pattern in opposite directions. Browse the tension points, then open
        one to see the questions built to exploit it.
      </p>

      <div
        className="mt-8 inline-flex rounded-md border border-zinc-300 p-1"
        role="group"
        aria-label="Filter tensions"
      >
        <ToggleLink href="/tensions" active={!curatedOnly} label="All tensions" />
        <ToggleLink
          href="/tensions?curated=1"
          active={curatedOnly}
          label="Curated only"
        />
      </div>

      {!catalog.catalog_ready && !isEmpty && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          The curated tension catalog isn&apos;t provisioned in this environment
          yet, so these tensions are derived from the live question bank. Curated
          copy (the doctrinal collision and decision axis) appears once the catalog
          migration is applied.
        </p>
      )}

      {isEmpty && (
        <div className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-zinc-800">
            The Tension Map populates from the active question bank and the curated
            tension catalog. Once questions are live, every tension point they
            target shows up here with its question count.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/diagnostic"
              className="rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              Start the diagnostic
            </Link>
            <Link
              href="/traps"
              className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              Browse the Trap Taxonomy
            </Link>
          </div>
        </div>
      )}

      {filteredEmpty && (
        <p className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700">
          No curated tension points are loaded yet. Switch to{" "}
          <Link
            href="/tensions"
            className="underline underline-offset-4 hover:text-zinc-900"
          >
            all tensions
          </Link>{" "}
          to see everything observed in the bank.
        </p>
      )}

      {!isEmpty && !filteredEmpty && (
        <div className="mt-10 space-y-10">
          {subjects.map((subject) => (
            <TensionSubjectGroup
              key={subject}
              subject={subject}
              tensions={bySubject.get(subject) ?? []}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ToggleLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`rounded px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${
        active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {label}
    </Link>
  );
}

function TensionSubjectGroup({
  subject,
  tensions,
}: {
  subject: string;
  tensions: TensionEntry[];
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-2">
        <h2 className="min-w-0 font-serif text-xl font-semibold text-zinc-950">
          {subject}
        </h2>
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          {tensions.length} {tensions.length === 1 ? "tension" : "tensions"}
        </span>
      </div>
      <ul className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">
        {tensions.map((tension) => (
          <li key={`${tension.slug}-${tension.tension_point_id ?? "obs"}`} className="min-w-0">
            <TensionRow tension={tension} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TensionRow({ tension }: { tension: TensionEntry }) {
  return (
    <Link
      href={`/tensions/${encodeURIComponent(tension.slug)}`}
      className="flex min-w-0 w-full flex-col items-start gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:h-full sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <span className="min-w-0">
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="min-w-0 break-words font-medium text-zinc-900">
            {tension.name}
          </span>
          {tension.official && (
            <span className="shrink-0 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-700">
              Curated
            </span>
          )}
        </span>
        {tension.domain && (
          <span className="mt-0.5 block truncate text-xs text-zinc-500">
            {tension.domain}
          </span>
        )}
      </span>
      <span className="shrink-0 self-end text-right font-mono text-xs text-zinc-500 sm:self-auto">
        {tension.question_count} q
      </span>
    </Link>
  );
}
