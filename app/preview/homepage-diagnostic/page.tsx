import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diagnostic Homepage Variant - BarMatrix Preview",
  description:
    "A preview homepage variant for BarMatrix diagnostic-first MBE repair.",
  robots: { index: false, follow: false },
};

const redZones = [
  {
    subject: "Evidence",
    trap: "Purpose-of-offer trap",
    priority: "Next repair",
  },
  {
    subject: "Civil Procedure",
    trap: "Procedural gate switch",
    priority: "High",
  },
  {
    subject: "Contracts",
    trap: "Rule direction break",
    priority: "Watch",
  },
  {
    subject: "Torts",
    trap: "Element mismatch",
    priority: "Later",
  },
] as const;

const forensicRows = [
  ["Selected answer", "Excluded as hearsay"],
  ["Why it pulled", "Out-of-court statement looked decisive"],
  ["Why it failed", "Statement was offered for notice, not truth"],
  ["Repair task", "Purpose-of-offer drill"],
];

const methodSteps = [
  {
    label: "Diagnose",
    title: "Start with the free diagnostic",
    body: "The first product moment is a focused MBE read, not a generic lead form or another resource shelf.",
  },
  {
    label: "Map",
    title: "Get the Red-Zone Map",
    body: "Misses are grouped by subject, subtopic, two-answer tension, and wrong-answer mechanic.",
  },
  {
    label: "Repair",
    title: "Follow one next task",
    body: "BarMatrix turns the highest-priority pattern into a guided repair path that stays narrow.",
  },
];

const proofPoints = [
  "Wrong-answer forensics before broad review",
  "Two-answer trap naming instead of vague confidence scores",
  "One guided repair task instead of menu browsing",
  "MBE precision without claiming to replace a full bar course",
];

function RedZoneMap() {
  return (
    <div className="border border-[var(--ink)] bg-[var(--paper)] shadow-[8px_8px_0_var(--ink)]">
      <div className="grid gap-3 border-b border-[var(--ink)] bg-[var(--ink)] p-5 text-[var(--bg)] sm:grid-cols-[1fr_auto]">
        <div>
          <p className="m-0 font-mono text-xs uppercase tracking-[0.14em] text-[#ffb4bf]">
            Red-Zone Map Preview
          </p>
          <h2 className="m-0 mt-2 font-serif text-3xl font-semibold leading-tight">
            Highest-yield leaks first
          </h2>
        </div>
        <div className="self-start border border-[#ffb4bf] px-3 py-1 font-mono text-xs text-[#ffb4bf]">
          4 active zones
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-3">
          {redZones.map(({ subject, trap, priority }) => (
            <div key={trap} className="border border-[var(--rule-soft)] p-4">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 font-mono text-xs text-[var(--muted)]">
                    {subject}
                  </p>
                  <p className="m-0 mt-1 font-serif text-xl font-semibold leading-tight">
                    {trap}
                  </p>
                </div>
                <strong className="font-mono text-sm text-[var(--red)]">
                  {priority}
                </strong>
              </div>
              <div className="h-1 border-t border-[var(--ink)]" />
            </div>
          ))}
        </div>

        <div className="mt-5 border border-[var(--red)] bg-[var(--highlighter-soft)] p-4">
          <p className="m-0 font-serif text-xl font-semibold leading-7">
            Next task: repair the purpose switch before doing another mixed set.
          </p>
        </div>
      </div>
    </div>
  );
}

function ForensicNote() {
  return (
    <div className="border border-[var(--ink)] bg-[var(--paper)]">
      <div className="border-b border-[var(--ink)] p-5">
        <p className="m-0 font-mono text-xs uppercase tracking-[0.14em] text-[var(--red)]">
          Wrong-answer forensic note
        </p>
        <h2 className="m-0 mt-3 max-w-[14ch] font-serif text-4xl font-semibold leading-none">
          Know why the trap worked.
        </h2>
      </div>
      <div className="grid md:grid-cols-[0.88fr_1.12fr]">
        <div className="border-b border-[var(--ink)] p-6 md:border-b-0 md:border-r">
          <p className="m-0 font-serif text-2xl italic leading-9">
            You were not just missing hearsay. You were missing the offered-purpose
            switch.
          </p>
        </div>
        <div>
          {forensicRows.map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 border-b border-[var(--rule-soft)] p-5 last:border-b-0 sm:grid-cols-[150px_1fr]"
            >
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                {label}
              </span>
              <strong className="text-sm font-semibold leading-6 text-[var(--ink)]">
                {value}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomepageDiagnosticPreview() {
  return (
    <div className="bg-[var(--bg)] text-[var(--ink)]">
      <section className="border-b border-[var(--ink)]">
        <div className="container grid gap-12 py-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:py-18">
          <div className="flex min-w-0 flex-col justify-center">
            <p className="mb-6 w-fit border border-[var(--rule)] px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--red)]">
              Diagnostic-first MBE repair
            </p>
            <h1 className="display text-[clamp(48px,7.8vw,108px)] leading-[0.9] tracking-[-0.04em]">
              Stop guessing why you miss MBE questions.
            </h1>
            <p className="mt-7 max-w-[48ch] font-serif text-[23px] italic leading-8 text-[var(--ink-soft)]">
              BarMatrix turns practice results into a Red-Zone Map, names the
              wrong-answer mechanics costing you points, and gives you one guided
              repair task at a time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/diagnostic" className="btn btn-lg red">
                Start free diagnostic <span className="arrow">-&gt;</span>
              </Link>
              <Link href="/how-it-works" className="btn btn-lg ghost">
                See how repair works
              </Link>
            </div>
            <div className="mt-9 grid max-w-xl grid-cols-3 border border-[var(--ink)] bg-[var(--paper)]">
              {[
                ["10 min", "diagnostic start"],
                ["1 map", "highest-risk zones"],
                ["1 task", "next repair move"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="border-r border-[var(--ink)] p-4 last:border-r-0"
                >
                  <p className="m-0 font-serif text-3xl font-semibold">
                    {value}
                  </p>
                  <p className="m-0 mt-1 text-xs leading-4 text-[var(--muted)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <RedZoneMap />
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="grid border border-[var(--ink)] bg-[var(--paper)] lg:grid-cols-3">
            {methodSteps.map((step, index) => (
              <article
                key={step.title}
                className="min-h-[230px] border-b border-[var(--ink)] p-7 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <p className="m-0 font-mono text-xs uppercase tracking-[0.14em] text-[var(--red)]">
                  0{index + 1} / {step.label}
                </p>
                <h2 className="m-0 mt-5 font-serif text-3xl font-semibold leading-tight">
                  {step.title}
                </h2>
                <p className="m-0 mt-4 text-sm leading-7 text-[var(--muted)]">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(360px,1.22fr)]">
          <div>
            <p className="mb-5 w-fit border border-[var(--rule)] px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--red)]">
              Two-answer traps
            </p>
            <h2 className="display display-lg m-0 max-w-[12ch]">
              The useful answer comes after the wrong one.
            </h2>
            <p className="body-lg mt-6">
              A normal explanation tells you the law. BarMatrix asks why the
              wrong answer looked lawful when you picked it, then turns that
              pattern into repair.
            </p>
          </div>

          <ForensicNote />
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border border-[var(--ink)] bg-[var(--ink)] p-8 text-[var(--bg)]">
            <p className="m-0 font-mono text-xs uppercase tracking-[0.14em] text-[#ffb4bf]">
              What this test page is trying
            </p>
            <h2 className="m-0 mt-5 font-serif text-5xl font-semibold leading-none">
              Make the diagnostic feel like the first useful product moment.
            </h2>
          </div>
          <div className="grid gap-0 border border-[var(--ink)] bg-[var(--paper)] sm:grid-cols-2">
            {proofPoints.map((point) => (
              <div
                key={point}
                className="min-h-[130px] border-b border-[var(--rule-soft)] p-6 even:bg-[var(--bg-alt)] sm:even:border-l sm:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <p className="m-0 text-base font-semibold leading-6">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-[var(--maxw)] border border-[var(--red)] bg-[var(--highlighter-soft)] p-8 text-center md:p-12">
          <p className="m-0 font-mono text-xs uppercase tracking-[0.14em] text-[var(--red)]">
            Proof before checkout
          </p>
          <h2 className="m-0 mx-auto mt-5 max-w-3xl font-serif text-5xl font-semibold leading-none">
            Find your next MBE point before your next study block.
          </h2>
          <p className="mx-auto mb-0 mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Take the free diagnostic, get your Red-Zone Map, and decide from a
            concrete repair target instead of a promise.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/diagnostic" className="btn btn-lg red">
              Get my Red-Zone Map <span className="arrow">-&gt;</span>
            </Link>
            <Link href="/pricing" className="btn btn-lg ghost">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
