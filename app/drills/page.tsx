import Link from "next/link";
import type { C3ChoicePattern, C3TaxonomyAxis } from "@/lib/api-client";
import { getC3Axes, getC3ChoicePatterns, getC3RedZoneCatalog } from "@/lib/c3-taxonomy";
import { humanizeSubject } from "@/lib/format-subject";

export const metadata = {
  title: "C3 Drill Library - BarMatrix",
  description:
    "Packet-derived C3 repair drills organized by locked red zone, axis, and choice pattern.",
  alternates: { canonical: "/drills" },
};

export default async function DrillsPage() {
  const [catalog, axes, patterns] = await Promise.all([
    getC3RedZoneCatalog(),
    getC3Axes({ limit: 9 }),
    getC3ChoicePatterns({ limit: 9 }),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="border-b border-zinc-900 pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Drill Library
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          Packet-based repair drills, organized by C3 axis and choice pattern.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
          Use the locked Red-Zone V5 model to choose the axis fight, then open
          the choice-pattern mechanics attached to the same outline code.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {catalog.categories.map((category) => (
          <Link
            key={category.red_zone_id}
            href={`/tensions?red_zone_id=${encodeURIComponent(category.red_zone_id)}`}
            className="min-w-0 border border-zinc-300 bg-white p-4 transition hover:border-zinc-900"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
              {category.red_zone_id}
            </p>
            <h2 className="mt-2 font-serif text-lg font-semibold leading-tight text-zinc-950">
              {category.locked_title}
            </h2>
            <p className="mt-2 text-xs leading-5 text-zinc-600">
              {category.core_idea}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <AxisDrillGroup axes={axes.axes} total={axes.total} />
        <ChoicePatternDrillGroup patterns={patterns.choice_patterns} total={patterns.total} />
      </div>
    </section>
  );
}

function AxisDrillGroup({ axes, total }: { axes: C3TaxonomyAxis[]; total: number }) {
  return (
    <section aria-labelledby="axis-drills">
      <div className="flex items-end justify-between gap-4 border-b border-zinc-900 pb-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            Axis drills
          </p>
          <h2 id="axis-drills" className="mt-1 font-serif text-2xl font-semibold text-zinc-950">
            Work the legal fight
          </h2>
        </div>
        <Link href="/tensions" className="font-mono text-[11px] uppercase tracking-wider text-red-700">
          All axes ({total}) -&gt;
        </Link>
      </div>

      {axes.length === 0 ? (
        <p className="mt-4 border border-zinc-200 bg-zinc-50 p-5 text-sm leading-6 text-zinc-600">
          C3 axis packets are not available from the API yet.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {axes.map((axis) => (
            <article key={axis.axis_id} className="min-w-0 border border-zinc-300 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
                    {axis.red_zone_id} / {axis.outline_code}
                  </p>
                  <h3 className="mt-2 break-words font-serif text-xl font-semibold leading-tight text-zinc-950">
                    {axis.axis_name}
                  </h3>
                </div>
                <span className="shrink-0 border border-zinc-300 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                  {humanizeSubject(axis.subject)}
                </span>
              </div>
              <div className="mt-4 grid gap-3 border-t border-zinc-200 pt-4 sm:grid-cols-2">
                <AxisSide label="Side A" value={axis.side_a} />
                <AxisSide label="Side B" value={axis.side_b} />
              </div>
              {axis.resolver ? (
                <p className="mt-3 text-sm leading-6 text-zinc-700">{axis.resolver}</p>
              ) : null}
              <Link
                href={`/tensions?outline_code=${encodeURIComponent(axis.outline_code)}`}
                className="mt-4 inline-block rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-900"
              >
                Open axis packet
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function AxisSide({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="min-w-0 bg-zinc-50 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 break-words text-sm leading-6 text-zinc-800">{value ?? "Packet detail pending"}</p>
    </div>
  );
}

function ChoicePatternDrillGroup({
  patterns,
  total,
}: {
  patterns: C3ChoicePattern[];
  total: number;
}) {
  return (
    <section aria-labelledby="choice-pattern-drills">
      <div className="flex items-end justify-between gap-4 border-b border-zinc-900 pb-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            Choice-pattern drills
          </p>
          <h2 id="choice-pattern-drills" className="mt-1 font-serif text-2xl font-semibold text-zinc-950">
            Work the wrong-answer mechanic
          </h2>
        </div>
        <Link href="/traps" className="font-mono text-[11px] uppercase tracking-wider text-red-700">
          All patterns ({total}) -&gt;
        </Link>
      </div>

      {patterns.length === 0 ? (
        <p className="mt-4 border border-zinc-200 bg-zinc-50 p-5 text-sm leading-6 text-zinc-600">
          C3 choice-pattern packets are not available from the API yet.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {patterns.map((pattern) => (
            <article key={pattern.choice_pattern_id} className="min-w-0 border border-zinc-300 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
                    {pattern.red_zone_id} / {pattern.outline_code}
                  </p>
                  <h3 className="mt-2 break-words font-serif text-xl font-semibold leading-tight text-zinc-950">
                    {formatPatternName(pattern)}
                  </h3>
                </div>
                <span className="shrink-0 border border-zinc-300 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                  {pattern.filter_broken}
                </span>
              </div>
              {pattern.why_it_attracts_students ? (
                <p className="mt-4 text-sm leading-6 text-zinc-700">
                  {pattern.why_it_attracts_students}
                </p>
              ) : null}
              {pattern.true_responsive_repair ? (
                <p className="mt-3 border-l-2 border-red-700 pl-3 text-sm leading-6 text-zinc-800">
                  {pattern.true_responsive_repair}
                </p>
              ) : null}
              <Link
                href={`/traps?mold_code=${encodeURIComponent(pattern.mold_code)}`}
                className="mt-4 inline-block rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-900"
              >
                Open pattern packet
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatPatternName(pattern: C3ChoicePattern): string {
  if (pattern.wrong_answer_form) return pattern.wrong_answer_form;
  return pattern.mold_code.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
