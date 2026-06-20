import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Red-Zone Lab - BarMatrix Landing Page Test",
  description:
    "A preview landing page concept for BarMatrix diagnostic-first MBE repair.",
  robots: { index: false, follow: false },
};

const labSteps = [
  {
    title: "Take the diagnostic",
    body: "Answer a focused MBE set before checkout so the first claim is tested against your own choices.",
  },
  {
    title: "Name the red zone",
    body: "The map ranks the subject, trap family, and reasoning break that is costing the most attention.",
  },
  {
    title: "Read the forensic note",
    body: "BarMatrix explains why the tempting option pulled you and where the answer fell apart.",
  },
  {
    title: "Repair one pattern",
    body: "Flagship turns the highest-priority miss into one guided task instead of another menu of resources.",
  },
];

const evidenceRows = [
  ["Student selected", "Exclude as hearsay"],
  ["Why it pulled", "Out-of-court statement"],
  ["Why it failed", "Offered for notice, not truth"],
  ["Repair task", "Purpose-of-offer drill"],
];

const proofQuestions = [
  "What kind of wrong answer keeps attracting me?",
  "Which facts am I skimming past when the call changes?",
  "What should I repair next if I only have one block today?",
  "Is BarMatrix useful before I pay for Flagship?",
];

export default function RedZoneLabPage() {
  return (
    <div className="bg-[var(--bg)] text-[var(--ink)]">
      <section className="border-b border-[var(--rule)]">
        <div className="container grid gap-12 py-12 md:grid-cols-[minmax(0,0.92fr)_minmax(320px,1.08fr)] md:py-16">
          <div className="flex min-w-0 flex-col justify-center">
            <p className="mb-5 max-w-fit border border-[var(--rule)] px-3 py-1 font-mono text-xs text-[var(--red)]">
              Diagnostic-first MBE repair
            </p>
            <h1 className="display text-[clamp(46px,7vw,104px)] leading-[0.92] tracking-[-0.045em]">
              Red-Zone Lab
            </h1>
            <p className="mt-6 max-w-[46ch] font-serif text-[22px] italic leading-8 text-[var(--ink-soft)]">
              See the trap pattern before you decide whether the full repair
              path belongs in your bar plan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/diagnostic" className="btn btn-lg red">
                Start free diagnostic <span className="arrow">-&gt;</span>
              </Link>
              <Link href="/how-it-works" className="btn btn-lg ghost">
                See repair loop
              </Link>
            </div>
          </div>

          <figure className="relative min-h-[420px] overflow-hidden border border-[var(--ink)] bg-[var(--paper)] shadow-[8px_8px_0_var(--ink)]">
            <Image
              src="/red-zone-lab-answer-sheet.jpg"
              alt="Multiple-choice answer sheet with red scoring grid."
              fill
              priority
              sizes="(min-width: 768px) 54vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-[rgba(10,10,10,0.88)] p-5 text-[var(--bg)]">
              <p className="font-mono text-xs text-[#ffb4bf]">
                The page pitch: proof before price
              </p>
              <p className="mt-2 max-w-[38ch] text-sm leading-6 text-[#f6f3ec]">
                Make the diagnostic feel like the first useful product moment,
                not a lead form.
              </p>
            </div>
          </figure>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="grid border border-[var(--ink)] bg-[var(--paper)] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-[var(--ink)] p-8 lg:border-b-0 lg:border-r">
              <h2 className="display display-md m-0 max-w-[11ch]">
                Not another bank. A miss lab.
              </h2>
            </div>
            <div className="grid gap-0 sm:grid-cols-2">
              {labSteps.map((step, index) => (
                <article
                  key={step.title}
                  className={`min-h-[210px] border-b border-[var(--rule-soft)] p-7 even:bg-[var(--bg-alt)] ${
                    index > 1 ? "sm:border-b-0" : ""
                  }`}
                >
                  <h3 className="font-serif text-2xl font-semibold leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(320px,1.2fr)]">
          <div>
            <h2 className="display display-lg m-0 max-w-[12ch]">
              The useful answer is the one after the wrong one.
            </h2>
            <p className="body-lg mt-6">
              A normal explanation tells you the law. The lab asks why the
              wrong answer looked lawful in the moment you picked it.
            </p>
          </div>

          <div className="border border-[var(--ink)] bg-[var(--paper)]">
            <div className="grid border-b border-[var(--ink)] bg-[var(--ink)] p-4 text-[var(--bg)] sm:grid-cols-[1fr_auto]">
              <p className="m-0 font-mono text-xs text-[#ffb4bf]">
                Sample forensic note
              </p>
              <p className="m-0 font-mono text-xs text-[#c8c4ba]">
                Evidence: hearsay purpose
              </p>
            </div>
            <div className="grid gap-0 md:grid-cols-[1fr_1.05fr]">
              <div className="border-b border-[var(--ink)] p-7 md:border-b-0 md:border-r">
                <p className="m-0 font-serif text-2xl leading-9">
                  You knew the hearsay rule, but the answer choice treated
                  every out-of-court statement as if purpose never mattered.
                </p>
              </div>
              <div className="grid gap-0">
                {evidenceRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-1 gap-4 border-b border-[var(--rule-soft)] p-5 last:border-b-0 sm:grid-cols-[140px_1fr]"
                  >
                    <span className="font-mono text-xs text-[var(--muted)]">
                      {label}
                    </span>
                    <strong className="text-sm font-semibold text-[var(--ink)]">
                      {value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="self-start border-t-4 border-[var(--ink)] pt-6">
              <h2 className="display display-md m-0">
                The landing page test.
              </h2>
              <p className="mt-4 max-w-[50ch] text-base leading-7 text-[var(--ink-soft)]">
                This concept makes one bet: prospects should feel the diagnostic
                value before seeing plan details.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {proofQuestions.map((question) => (
                <article
                  key={question}
                  className="min-h-[150px] border border-[var(--rule)] bg-[var(--paper)] p-6"
                >
                  <p className="m-0 font-serif text-xl leading-7">
                    {question}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--ink)] bg-[var(--ink)] py-12 text-[var(--bg)]">
        <div className="container grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2
              className="display display-md m-0"
              style={{ color: "var(--bg)" }}
            >
              Start with the miss pattern.
            </h2>
            <p className="mt-4 max-w-[54ch] text-base leading-7 text-[#c8c4ba]">
              The best test for this design is simple: does the diagnostic feel
              valuable before the checkout page appears?
            </p>
          </div>
          <Link href="/diagnostic" className="btn btn-lg red">
            Start free diagnostic <span className="arrow">-&gt;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
