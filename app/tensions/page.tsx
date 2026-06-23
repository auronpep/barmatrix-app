import type { Metadata } from "next";
import Link from "next/link";

import type { C3TaxonomyAxis } from "@/lib/api-client";
import { getC3Axes, getC3RedZoneCatalog } from "@/lib/c3-taxonomy";
import { humanizeSubject } from "@/lib/format-subject";
import { TensionMapAnalytics } from "./tension-analytics";

export const metadata: Metadata = {
  title: "Tension Map",
  description:
    "Browse the new C3 axis map: each tension is an A-vs-B fight routed through a locked Red-Zone V5 repair mode.",
};

export default async function TensionsPage({
  searchParams,
}: {
  searchParams: Promise<{ red_zone_id?: string; subject?: string; outline_code?: string }>;
}) {
  const params = await searchParams;
  const [catalog, axisList] = await Promise.all([
    getC3RedZoneCatalog(),
    getC3Axes({
      red_zone_id: params.red_zone_id,
      subject: params.subject,
      outline_code: params.outline_code,
      limit: 300,
    }),
  ]);
  const zoneById = new Map(catalog.categories.map((zone) => [zone.red_zone_id, zone]));
  const bySubject = groupBySubject(axisList.axes);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <TensionMapAnalytics
        tensionCount={axisList.total}
        officialCount={axisList.total}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
          C3 Tension Map
        </p>
        <Link
          href="/red-zones"
          className="rounded-md font-mono text-xs uppercase tracking-wider text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          Red Zone Library
        </Link>
      </div>

      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Axis fights, not legacy topic tags
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-zinc-600">
        Each card is a reusable A-vs-B decision axis from the new component packets.
        Filter by locked red zone, subject, or outline code without pulling in the
        old user red-zone content.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterLink href="/tensions" active={!params.red_zone_id} label="All red zones" />
        {catalog.categories.map((zone) => (
          <FilterLink
            key={zone.red_zone_id}
            href={`/tensions?red_zone_id=${encodeURIComponent(zone.red_zone_id)}`}
            active={params.red_zone_id === zone.red_zone_id}
            label={`${zone.red_zone_id} ${zone.grid_label}`}
          />
        ))}
      </div>

      {axisList.total > axisList.returned && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Showing {axisList.returned} of {axisList.total} matching axes. Narrow by
          red zone, subject, or outline code for the full slice.
        </p>
      )}

      {axisList.axes.length === 0 ? (
        <div className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-zinc-800">
            No C3 axes matched this filter. The new taxonomy API is available, but
            this slice has no student-visible packet rows.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {[...bySubject.entries()].map(([subject, axes]) => (
            <section key={subject}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-2">
                <h2 className="font-serif text-2xl font-semibold text-zinc-950">
                  {humanizeSubject(subject)}
                </h2>
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                  {axes.length} axes
                </span>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {axes.map((axis) => (
                  <AxisCard
                    key={axis.axis_id}
                    axis={axis}
                    zoneLabel={zoneById.get(axis.red_zone_id)?.grid_label ?? axis.red_zone_id}
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

function AxisCard({ axis, zoneLabel }: { axis: C3TaxonomyAxis; zoneLabel: string }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
            {axis.red_zone_id} / {zoneLabel}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-950">{axis.axis_name}</h3>
        </div>
        <Link
          href={`/traps?outline_code=${encodeURIComponent(axis.outline_code)}`}
          className="rounded-md border border-zinc-300 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 hover:bg-zinc-50"
        >
          Traps
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <AxisSide label="Side A" text={axis.side_a} />
        <AxisSide label="Side B" text={axis.side_b} />
      </div>
      {axis.resolver && (
        <p className="mt-4 rounded-md bg-zinc-50 p-3 text-sm leading-6 text-zinc-700">
          {axis.resolver}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        <span>{axis.outline_code}</span>
        {axis.resolver_type && <span>{axis.resolver_type}</span>}
        {axis.method_class && <span>{axis.method_class}</span>}
      </div>
    </article>
  );
}

function AxisSide({ label, text }: { label: string; text: string | null }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-800">{text ?? "Packet axis side not specified."}</p>
    </div>
  );
}

function groupBySubject(axes: C3TaxonomyAxis[]): Map<string, C3TaxonomyAxis[]> {
  const groups = new Map<string, C3TaxonomyAxis[]>();
  for (const axis of axes) {
    const group = groups.get(axis.subject) ?? [];
    group.push(axis);
    groups.set(axis.subject, group);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)));
}
