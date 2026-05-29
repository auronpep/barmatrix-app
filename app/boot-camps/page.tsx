import type { Metadata } from "next";
import Link from "next/link";
import BootCampCatalog from "./boot-camps-catalog";

export const metadata: Metadata = {
  title: "Boot Camps",
  description:
    "Multi-day MBE repair sequences: a diagnostic check-in, daily drill blocks, forensics review, and a mastery check.",
  alternates: {
    canonical: "/boot-camps",
  },
  openGraph: {
    title: "BarMatrix Boot Camps",
    description:
      "Multi-day MBE repair sequences targeting your highest-leverage tension points.",
    url: "/boot-camps",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BarMatrix Boot Camps",
    description:
      "Multi-day MBE repair sequences targeting your highest-leverage tension points.",
    images: ["/og-image.svg"],
  },
};

export default function BootCampsPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="grid gap-10 border-b border-zinc-200 pb-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <div className="mb-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              <span className="border border-zinc-200 px-2 py-1">Boot Camps</span>
              <span className="border border-zinc-200 px-2 py-1">Repair Sequences</span>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-red-700">
              BarMatrix repair modules
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
              Boot camps organize repeated misses into short repair sequences.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
              Each camp opens with a check-in, moves through focused daily drill
              blocks on a small set of tension points, reviews the forensics
              pattern, and closes with a mastery check that updates your
              Red-Zone Map.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn btn-lg ghost" href="/red-zones">
                View Red-Zone Map
              </Link>
            </div>
          </div>
          <aside className="border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              How a camp runs
            </p>
            <ol className="mt-4 space-y-2 text-sm leading-6 text-zinc-700">
              <li>1 · Start the camp — questions are pinned for every day.</li>
              <li>2 · Finish a daily block; progress is saved.</li>
              <li>3 · Return any time and resume where you left off.</li>
              <li>4 · Pass the mastery check to complete the camp.</li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <BootCampCatalog />
      </section>
    </main>
  );
}
