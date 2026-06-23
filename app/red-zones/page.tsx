import type { Metadata } from "next";
import Link from "next/link";

import { getC3RedZoneCatalog } from "@/lib/c3-taxonomy";

export const metadata: Metadata = {
  title: "Red Zone Library",
  description:
    "Browse the locked C3 Red-Zone V5 categories and the new packet-only axes behind BarMatrix guided repair.",
};

export default async function RedZonesPage() {
  const catalog = await getC3RedZoneCatalog();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Red Zone Library
        </p>
        <Link
          href="/app"
          className="rounded-md font-mono text-xs uppercase tracking-wider text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          Command center
        </Link>
      </div>

      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        The 10 locked C3 repair modes
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        These are not legal topics. They are the recurring cognitive failure modes
        behind wrong MBE choices, now wired to the new component packets by axis
        and choice pattern.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric label="Visible packets" value={catalog.totals.visible_packets} />
        <Metric label="Canonical axes" value={catalog.totals.visible_axes} />
        <Metric label="Choice patterns" value={catalog.totals.visible_choice_patterns} />
      </div>

      {catalog.categories.length === 0 ? (
        <p className="mt-10 border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          The C3 Red-Zone V5 catalog is not available from the API yet.
        </p>
      ) : (
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {catalog.categories.map((zone) => (
            <li key={zone.red_zone_id}>
              <Link
                href={`/tensions?red_zone_id=${encodeURIComponent(zone.red_zone_id)}`}
                className="block h-full rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-zinc-500 hover:bg-zinc-50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
                      {zone.red_zone_id} / {zone.grid_label}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl font-semibold text-zinc-950">
                      {zone.locked_title}
                    </h2>
                  </div>
                  <span className="rounded-full border border-zinc-300 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                    {zone.axis_count} axes
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-700">{zone.core_idea}</p>
                <p className="mt-4 font-mono text-xs uppercase tracking-wider text-zinc-500">
                  {zone.short_label}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-800">{zone.student_move}</p>
                <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  <span>{zone.packet_count} packets</span>
                  <span>{zone.choice_pattern_count} patterns</span>
                  <span>{zone.mantra}</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}
