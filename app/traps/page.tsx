import type { Metadata } from "next";
import Link from "next/link";
import { getTrapCatalog } from "@/lib/traps";
import type { TrapEntry } from "@/lib/api-client";
import { TrapTaxonomyAnalytics } from "./trap-analytics";
import { TrapProfileProvider, PersonalTrapBadge } from "./your-trap-profile";

export const metadata: Metadata = {
  title: "Trap Taxonomy",
  description:
    "Browse the attractive wrong-answer architectures the MBE reuses. Each trap shows how the distractor is built and which questions deploy it.",
};

// The catalog can hold 1,000+ observed slugs. Rendering them all inline shipped a
// 5 MB page; paginate so each request stays small. The list is ordered by
// question_count desc, so page 1 surfaces the most-deployed architectures first.
const TRAPS_PER_PAGE = 60;

export default async function TrapsPage({
  searchParams,
}: {
  searchParams: Promise<{ official?: string; page?: string }>;
}) {
  const [{ official, page }, catalog] = await Promise.all([
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
  const hasMisconceptionDimension =
    catalog.totals.misconception_count > 0;
  const visibleMisconception = hasMisconceptionDimension ? misconception : [];

  const totalTraps =
    catalog.totals.architecture_count +
    (hasMisconceptionDimension ? catalog.totals.misconception_count : 0);
  const isEmpty = totalTraps === 0;
  const filteredEmpty =
    !isEmpty && architecture.length === 0 && visibleMisconception.length === 0;
  const catalogDescription = hasMisconceptionDimension
    ? "Every wrong answer the MBE writes is built on purpose. Browse the wrong-answer architectures the test reuses and the misconceptions they prey on, then open one to see the questions that deploy it as a distractor."
    : "Every wrong answer the MBE writes is built on purpose. Browse the wrong-answer architectures the test reuses, then open one to see the questions that deploy it as a distractor.";

  // Paginate visible columns with one shared page, driven by the longer column.
  const pageCount = Math.max(
    1,
    Math.ceil(
      Math.max(architecture.length, visibleMisconception.length) /
        TRAPS_PER_PAGE,
    ),
  );
  const requestedPage = Number.parseInt(page ?? "1", 10);
  const currentPage = Math.min(
    pageCount,
    Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1),
  );
  const sliceStart = (currentPage - 1) * TRAPS_PER_PAGE;
  const architecturePage = architecture.slice(sliceStart, sliceStart + TRAPS_PER_PAGE);
  const misconceptionPage = visibleMisconception.slice(
    sliceStart,
    sliceStart + TRAPS_PER_PAGE,
  );
  const columnsClassName = hasMisconceptionDimension
    ? "mt-10 grid min-w-0 gap-8 lg:grid-cols-2"
    : "mt-10 grid min-w-0 gap-8";

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
        The recurring patterns behind MBE traps
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        {catalogDescription}
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
              className="rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
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
        <TrapProfileProvider>
          <div className={columnsClassName}>
            <TrapColumn
              title="Wrong-answer architecture"
              caption="How the distractor is built"
              traps={architecturePage}
              total={architecture.length}
            />
            {hasMisconceptionDimension && (
              <TrapColumn
                title="Misconception"
                caption="The student error it preys on"
                traps={misconceptionPage}
                total={visibleMisconception.length}
              />
            )}
          </div>
          {pageCount > 1 && (
            <TrapPagination
              currentPage={currentPage}
              pageCount={pageCount}
              officialOnly={officialOnly}
            />
          )}
        </TrapProfileProvider>
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
  total,
}: {
  title: string;
  caption: string;
  // `traps` is the current page slice; `total` is the full column count.
  traps: TrapEntry[];
  total: number;
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-2">
        <h2 className="min-w-0 font-serif text-xl font-semibold text-zinc-950">{title}</h2>
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          {total} {total === 1 ? "trap" : "traps"}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-500">{caption}</p>
      {total === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">
          No traps in this column for the current filter.
        </p>
      ) : (
        <ul className="mt-4 min-w-0 space-y-2">
          {traps.map((trap) => (
            <li key={trap.slug} className="min-w-0">
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
      className="flex min-w-0 w-full flex-col items-start gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <span className="min-w-0">
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="min-w-0 break-words font-medium text-zinc-900">
            {trap.name}
          </span>
          {trap.official && (
            <span className="shrink-0 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-700">
              Official
            </span>
          )}
          <PersonalTrapBadge slug={trap.slug} />
        </span>
      </span>
      <span className="shrink-0 self-end text-right font-mono text-xs text-zinc-500 sm:self-auto">
        {trap.question_count} q · {trap.choice_count}{" "}
        {trap.choice_count === 1 ? "choice" : "choices"}
      </span>
    </Link>
  );
}

function trapsHref(page: number, officialOnly: boolean): string {
  const params = new URLSearchParams();
  if (officialOnly) params.set("official", "1");
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/traps?${qs}` : "/traps";
}

function TrapPagination({
  currentPage,
  pageCount,
  officialOnly,
}: {
  currentPage: number;
  pageCount: number;
  officialOnly: boolean;
}) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < pageCount;
  const linkClass =
    "rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";
  const disabledClass =
    "rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-300";

  return (
    <nav
      className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6"
      aria-label="Trap catalog pagination"
    >
      {hasPrev ? (
        <Link href={trapsHref(currentPage - 1, officialOnly)} rel="prev" className={linkClass}>
          ← Previous
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          ← Previous
        </span>
      )}
      <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Page {currentPage} of {pageCount}
      </span>
      {hasNext ? (
        <Link href={trapsHref(currentPage + 1, officialOnly)} rel="next" className={linkClass}>
          Next →
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Next →
        </span>
      )}
    </nav>
  );
}
