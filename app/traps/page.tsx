import type { Metadata } from "next";
import Link from "next/link";

import type { C3ChoicePattern } from "@/lib/api-client";
import { getC3ChoicePatterns, getC3RedZoneCatalog } from "@/lib/c3-taxonomy";
import { humanizeSubject } from "@/lib/format-subject";
import { TrapTaxonomyAnalytics } from "./trap-analytics";

export const metadata: Metadata = {
  title: "Trap Taxonomy",
  description:
    "Browse the new C3 choice-forensics patterns: filter broken, mold code, bait architecture, and repair signal.",
};

export default async function TrapsPage({
  searchParams,
}: {
  searchParams: Promise<{
    red_zone_id?: string;
    subject?: string;
    outline_code?: string;
    mold_code?: string;
    filter_broken?: string;
  }>;
}) {
  const params = await searchParams;
  const [catalog, patterns] = await Promise.all([
    getC3RedZoneCatalog(),
    getC3ChoicePatterns({
      red_zone_id: params.red_zone_id,
      subject: params.subject,
      outline_code: params.outline_code,
      mold_code: params.mold_code,
      filter_broken: params.filter_broken,
      limit: 300,
    }),
  ]);
  const zones = new Map(catalog.categories.map((zone) => [zone.red_zone_id, zone.grid_label]));
  const byMold = groupByMold(patterns.choice_patterns);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <TrapTaxonomyAnalytics
        trapCount={patterns.total}
        officialCount={patterns.total}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
          C3 Trap Taxonomy
        </p>
        <Link
          href="/tensions"
          className="rounded-md font-mono text-xs uppercase tracking-wider text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          Tension Map
        </Link>
      </div>

      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        The mechanics behind wrong choices
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-zinc-600">
        These rows come from the new component packets, not the old bank-derived
        trap tags. Each pattern names the broken filter, mold code, attraction,
        visible signal, and repair.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterLink href="/traps" active={!params.filter_broken && !params.red_zone_id} label="All patterns" />
        <FilterLink
          href="/traps?filter_broken=NOT_TRUE"
          active={params.filter_broken === "NOT_TRUE"}
          label="Not true"
        />
        <FilterLink
          href="/traps?filter_broken=NOT_RESPONSIVE"
          active={params.filter_broken === "NOT_RESPONSIVE"}
          label="Not responsive"
        />
        {catalog.categories.slice(0, 9).map((zone) => (
          <FilterLink
            key={zone.red_zone_id}
            href={`/traps?red_zone_id=${encodeURIComponent(zone.red_zone_id)}`}
            active={params.red_zone_id === zone.red_zone_id}
            label={`${zone.red_zone_id} ${zone.grid_label}`}
          />
        ))}
      </div>

      {patterns.total > patterns.returned && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Showing {patterns.returned} of {patterns.total} matching choice patterns.
          Use a red-zone, mold, subject, or outline-code filter to narrow the set.
        </p>
      )}

      {patterns.choice_patterns.length === 0 ? (
        <div className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-zinc-800">
            No C3 choice patterns matched this filter.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {[...byMold.entries()].map(([mold, rows]) => (
            <section key={mold}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-2">
                <h2 className="font-serif text-2xl font-semibold text-zinc-950">
                  {humanizeToken(mold)}
                </h2>
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                  {rows.length} patterns
                </span>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {rows.map((pattern) => (
                  <PatternCard
                    key={pattern.choice_pattern_id}
                    pattern={pattern}
                    zoneLabel={zones.get(pattern.red_zone_id) ?? pattern.red_zone_id}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

function FilterLink({
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
      className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
        active
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-300 text-zinc-600 hover:border-zinc-600 hover:text-zinc-950"
      }`}
    >
      {label}
    </Link>
  );
}

function PatternCard({
  pattern,
  zoneLabel,
}: {
  pattern: C3ChoicePattern;
  zoneLabel: string;
}) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
            {pattern.red_zone_id} / {zoneLabel}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-950">
            {pattern.wrong_answer_form ?? humanizeToken(pattern.mold_code)}
          </h3>
        </div>
        <Link
          href={`/tensions?outline_code=${encodeURIComponent(pattern.outline_code)}`}
          className="rounded-md border border-zinc-300 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 hover:bg-zinc-50"
        >
          Axis
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider">
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">{pattern.filter_broken}</span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">{pattern.mold_code}</span>
        {pattern.bait_architecture_code && (
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">
            {pattern.bait_architecture_code}
          </span>
        )}
      </div>
      {pattern.why_it_attracts_students && (
        <CopyBlock label="Why it attracts" text={pattern.why_it_attracts_students} />
      )}
      {pattern.student_visible_signal && (
        <CopyBlock label="Visible signal" text={pattern.student_visible_signal} />
      )}
      {pattern.true_responsive_repair && (
        <CopyBlock label="Repair" text={pattern.true_responsive_repair} />
      )}
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        <span>{humanizeSubject(pattern.subject)}</span>
        <span>{pattern.outline_code}</span>
        {pattern.method_class && <span>{pattern.method_class}</span>}
      </div>
    </article>
  );
}

function CopyBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-4 rounded-md bg-zinc-50 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-800">{text}</p>
    </div>
  );
}

function groupByMold(patterns: C3ChoicePattern[]): Map<string, C3ChoicePattern[]> {
  const groups = new Map<string, C3ChoicePattern[]>();
  for (const pattern of patterns) {
    const group = groups.get(pattern.mold_code) ?? [];
    group.push(pattern);
    groups.set(pattern.mold_code, group);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function humanizeToken(value: string): string {
  const text = value.replace(/[_-]+/g, " ").trim();
  return text ? text.replace(/\b\w/g, (ch) => ch.toUpperCase()) : value;
}
