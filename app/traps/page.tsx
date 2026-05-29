import type { Metadata } from "next";
import Link from "next/link";
import { getTrapCatalog } from "@/lib/traps";
import type { TrapEntry } from "@/lib/api-client";
import { TrapTaxonomyAnalytics } from "./trap-analytics";

export const metadata: Metadata = {
  title: "Trap Taxonomy",
  description:
    "Browse the attractive wrong-answer architectures the MBE reuses. Each trap shows how the distractor is built and which questions deploy it.",
};

export default async function TrapsPage({
  searchParams,
}: {
  searchParams: Promise<{ official?: string }>;
}) {
  const [{ official }, catalog] = await Promise.all([
    searchParams,
    getTrapCatalog(),
  ]);
  const officialOnly = official === "1" || official === "true";

  const architecture = officialOnly
    ? catalog.architecture.filter((trap) => trap.official)
    : catalog.architecture;
  const misconception = officialOnly
    ? catalog.misconception.filter((trap) => trap.official)
    : catalog.misconception;

  const totalTraps =
    catalog.totals.architecture_count + catalog.totals.misconception_count;
  const isEmpty = totalTraps === 0;
  const filteredEmpty =
    !isEmpty && architecture.length === 0 && misconception.length === 0;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <TrapTaxonomyAnalytics
        trapCount={totalTraps}
        officialCount={catalog.totals.official_count}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
          Trap Taxonomy
        </p>
        <Link
          href="/app"
          className="rounded-md font-mono text-xs uppercase tracking-wider text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Command center
        </Link>
      </div>

      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        The finite universe of MBE traps
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        Every wrong answer the MBE writes is built on purpose. Browse the
        wrong-answer architectures the test reuses and the misconceptions they prey
        on, then open one to see the questions that deploy it as a distractor.
      </p>

      <div
        className="mt-8 inline-flex rounded-md border border-zinc-300 p-1"
        role="group"
        aria-label="Filter traps"
      >
        <ToggleLink href="/traps" active={!officialOnly} label="All traps" />
        <ToggleLink
          href="/traps?official=1"
          active={officialOnly}
          label="Official only"
        />
      </div>

      {isEmpty && (
        <div className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-zinc-800">
            The trap catalog populates from the active question bank. Once questions
            are live, every wrong-answer architecture they use shows up here with
            example distractors.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/diagnostic"
              className="rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              Start the diagnostic
            </Link>
            <Link
              href="/red-zones"
              className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              View Red-Zone Map
            </Link>
          </div>
        </div>
      )}

      {filteredEmpty && (
        <p className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700">
          No official-taxonomy traps are in the bank yet. Switch to{" "}
          <Link
            href="/traps"
            className="underline underline-offset-4 hover:text-zinc-900"
          >
            all traps
          </Link>{" "}
          to see everything observed in the bank.
        </p>
      )}

      {!isEmpty && !filteredEmpty && (
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <TrapColumn
            title="Wrong-answer architecture"
            caption="How the distractor is built (forensic_tags)"
            traps={architecture}
          />
          <TrapColumn
            title="Misconception"
            caption="The student error it preys on (misconception_tags)"
            traps={misconception}
          />
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
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {label}
    </Link>
  );
}

function TrapColumn({
  title,
  caption,
  traps,
}: {
  title: string;
  caption: string;
  traps: TrapEntry[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-zinc-200 pb-2">
        <h2 className="font-serif text-xl font-semibold text-zinc-950">{title}</h2>
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          {traps.length} {traps.length === 1 ? "trap" : "traps"}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-500">{caption}</p>
      {traps.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">
          No traps in this column for the current filter.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {traps.map((trap) => (
            <li key={trap.slug}>
              <TrapRow trap={trap} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TrapRow({ trap }: { trap: TrapEntry }) {
  return (
    <Link
      href={`/traps/${encodeURIComponent(trap.slug)}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
    >
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate font-medium text-zinc-900">{trap.name}</span>
          {trap.official && (
            <span className="shrink-0 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-700">
              Official
            </span>
          )}
        </span>
        <span className="mt-0.5 block font-mono text-[11px] text-zinc-400">
          {trap.slug}
        </span>
      </span>
      <span className="shrink-0 text-right font-mono text-xs text-zinc-500">
        {trap.question_count} q · {trap.choice_count}{" "}
        {trap.choice_count === 1 ? "choice" : "choices"}
      </span>
    </Link>
  );
}
