import Link from "next/link";
import { PROOF_CARD } from "@/lib/copy";

export const metadata = {
  title: "How BarMatrix works — Wrong Answer Forensics",
  description:
    "Diagnostic first. Wrong Answer Forensics. Focus-group comparison. Assigned repair. The four-step BarMatrix method for MBE repair.",
};

const sections = [
  {
    n: "1",
    title: "Diagnostic first",
    body: "Start with a short MBE Trap Diagnostic. Instead of reporting only a percentage, BarMatrix looks at the type of wrong answers you choose: legally true but irrelevant, wrong timing, exception omitted, wrong party, wrong standard, and other recurring MBE trap patterns.",
  },
  {
    n: "2",
    title: "Wrong Answer Forensics",
    body: "When you miss a question, BarMatrix explains why your selected answer was attractive before explaining why it was wrong. A miss becomes a diagnosis: the rule boundary, trigger fact, timing issue, or misconception that needs repair.",
  },
  {
    n: "3",
    title: "Focus-group comparison",
    body: "Where focus-group data is available, BarMatrix shows how often prior respondents selected the same answer. If a wrong answer pulled in a meaningful share of the group, the product treats it as a high-value trap worth drilling.",
  },
  {
    n: "4",
    title: "Assigned repair",
    body: "Each miss is connected to a repair action: a Red-Zone Drill, boot camp, timed set, or spaced review assignment. The goal is not to do more questions randomly. The goal is to stop repeating the same trap.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          How BarMatrix works
        </h1>
        <p className="mt-6 text-lg text-zinc-600">
          The MBE is not an infinite universe. It is a bounded set of recurring legal tension points and answer-choice traps. BarMatrix maps the traps, diagnoses why attractive wrong answers pull you in, and assigns the drill that fixes the underlying misconception.
        </p>

        <ol className="mt-12 space-y-10">
          {sections.map((s) => (
            <li key={s.n} className="grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-6">
              <div className="font-serif text-5xl text-zinc-300">{s.n}</div>
              <div>
                <h2 className="font-serif text-2xl font-semibold">{s.title}</h2>
                <p className="mt-2 text-zinc-600">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Worked example — same proof card from the homepage so the
          method has visible artifact, not just prose. */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Worked example
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold">
            One miss → one diagnosis → one drill
          </h2>
          <div className="mt-6 rounded-lg border border-zinc-300 bg-white p-8 shadow-sm">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">Trap</dt>
                <dd className="font-medium">{PROOF_CARD.trap}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Student selected</dt>
                <dd className="font-medium">{PROOF_CARD.studentSelected}</dd>
              </div>
              <div className="sm:col-span-2 text-zinc-500">{PROOF_CARD.focusGroupLine}</div>
              <div>
                <dt className="text-zinc-500">Forensic tag</dt>
                <dd className="font-medium">{PROOF_CARD.forensicTag}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Next drill</dt>
                <dd className="font-medium">{PROOF_CARD.nextDrill}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-500">Why it looked right</dt>
                <dd>{PROOF_CARD.whyLookedRight}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-500">Why it fails</dt>
                <dd>{PROOF_CARD.whyFails}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl font-semibold">Ready to find your traps?</h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/diagnostic"
            className="rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
          >
            Take the Free MBE Trap Diagnostic
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:border-zinc-500"
          >
            See pricing
          </Link>
        </div>
      </section>
    </>
  );
}
