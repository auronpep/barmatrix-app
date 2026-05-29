import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "The BarMatrix founder story: eleven years of bar tutoring condensed into an MBE trap diagnosis and repair system.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About BarMatrix",
    description:
      "Eleven years of bar tutoring condensed into an MBE trap diagnosis and repair system.",
    url: "/about",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About BarMatrix",
    description:
      "Eleven years of bar tutoring condensed into an MBE trap diagnosis and repair system.",
    images: ["/og-image.svg"],
  },
};

const STATS = [
  { value: "11", label: "years tutoring CA bar", accent: false },
  { value: "600+", label: "students through the method", accent: false },
  { value: "47", label: "trap shapes tagged in v1", accent: true },
  { value: "156", label: "tension points mapped", accent: false },
] as const;

const TIMELINE = [
  {
    marker: "2015",
    title: "First cohort, first pattern",
    body:
      "The first postmortems showed students missing by similar margins and choosing the same attractive wrong answers across recurring Criminal Procedure questions.",
  },
  {
    marker: "2018",
    title: "The spreadsheet",
    body:
      "Every miss was logged by subject, subtopic, rule, exception, trigger fact, attractive wrong answer, and why it pulled. The Tension Matrix started as that spreadsheet.",
  },
  {
    marker: "2021",
    title: "The 47 traps",
    body:
      "By the twelfth cycle, the wrong-answer architectures had stabilized into 47 recurring shapes across the seven MBE subjects.",
  },
  {
    marker: "2024",
    title: "The trap taxonomy",
    body:
      "The trap labels were refined and validated so the product could show not just what was wrong, but why the wrong answer was attractive.",
  },
  {
    marker: "2026",
    title: "BarMatrix v1",
    body:
      "The system now connects each miss to a trap shape and a repair drill built for that recurring pattern.",
  },
] as const;

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="border-b border-zinc-200 pb-10">
          <div className="mb-8 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            <span className="border border-zinc-200 px-2 py-1">About BarMatrix</span>
            <span className="border border-zinc-200 px-2 py-1">Founded 2026</span>
            <span className="border border-zinc-200 px-2 py-1">Vera Brooks</span>
            <span className="border border-zinc-200 px-2 py-1">SRC-0029</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            Founder and method
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
            Eleven years of bar tutoring, condensed into a system.
          </h1>
          <p className="mt-6 max-w-3xl font-serif text-2xl italic leading-9 text-zinc-700">
            BarMatrix was built from the patterns students kept falling into
            across cycles, subjects, and late-stage MBE repair work.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border border-zinc-950 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
            <div className="grid size-36 place-items-center bg-red-700 font-serif text-6xl font-semibold text-white">
              VB
            </div>
            <h2 className="mt-5 font-serif text-3xl font-semibold text-zinc-950">
              Vera Brooks
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-red-700">
              Founder - BarMatrix
            </p>
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              MBE Tension Matrix Method. Wrong-answer architecture. Diagnostic
              repair for repeatable trap patterns.
            </p>
          </aside>

          <div className="grid gap-10">
            <section className="border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                The story
              </p>
              <div className="mt-5 grid gap-5 text-base leading-7 text-zinc-700">
                <p>
                  The repeated finding was simple: students often did not fail
                  because they knew no rules. They failed because the same shapes
                  of wrong answers kept pulling them in.
                </p>
                <p>
                  A vehicle-search miss in Criminal Procedure, a UCC merchant
                  formation miss in Contracts, and a state-of-mind miss in
                  Evidence can look unrelated. Underneath, they can share the
                  same wrong-answer architecture.
                </p>
                <p>
                  BarMatrix names those shapes so students can stop treating each
                  miss as random and start repairing the trap pattern behind it.
                </p>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-4" aria-label="About stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="border border-zinc-200 bg-zinc-50 p-5">
                  <p
                    className={`font-serif text-4xl font-semibold tracking-tight ${
                      stat.accent ? "text-red-700" : "text-zinc-950"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </section>

            <section>
              <div className="mb-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-200" />
                <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                  Method timeline
                </h2>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>
              <div className="border-t-2 border-zinc-950">
                {TIMELINE.map((item) => (
                  <article
                    key={item.marker}
                    className="grid gap-3 border-b border-zinc-200 py-5 sm:grid-cols-[120px_minmax(0,1fr)]"
                  >
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-red-700">
                      {item.marker}
                    </p>
                    <div>
                      <h3 className="font-serif text-2xl font-semibold tracking-tight text-zinc-950">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-3xl leading-7 text-zinc-600">
                        {item.body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="border-l-4 border-red-700 bg-zinc-950 p-7 text-white">
              <p className="max-w-3xl font-serif text-2xl italic leading-9">
                &quot;Second time around, I did more questions. I missed the same
                traps. The third time, I diagnosed the traps first - and stopped
                the bleeding.&quot;
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                Composite of repeat-taker patterns BarMatrix is built for
              </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div className="border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-3xl font-semibold tracking-tight text-zinc-950">
                  Why now.
                </h2>
                <p className="mt-3 leading-7 text-zinc-600">
                  Students are doing more questions than ever. The missing
                  product layer is diagnosis: which trap shape pulled the student
                  in, how often it repeats, and what repair action follows.
                </p>
              </div>
              <div className="border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-3xl font-semibold tracking-tight text-zinc-950">
                  Why this scope.
                </h2>
                <p className="mt-3 leading-7 text-zinc-600">
                  BarMatrix is multiple-choice only by design. It complements a
                  full bar course by diagnosing the MBE traps students keep
                  repeating and assigning targeted repair drills.
                </p>
              </div>
            </section>

            <section className="border border-zinc-200 bg-zinc-50 p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-red-700">
                Start here
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
                Twelve questions. Your trap map.
              </h2>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="btn btn-lg red" href="/diagnostic">
                  Take the Free Diagnostic <span className="arrow">-&gt;</span>
                </Link>
                <Link className="btn btn-lg ghost" href="/how-it-works">
                  See the method
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
