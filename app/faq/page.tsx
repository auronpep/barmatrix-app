import Link from "next/link";
import { FAQ, DISCLAIMER } from "@/lib/copy";

export const metadata = {
  title: "FAQ — BarMatrix",
  description:
    "Frequently asked questions about BarMatrix Flagship: pricing, cohort access, iOS/Android availability, course companion use, and refund terms.",
};

// FAQ items that go beyond the homepage block — pulled from SRC-0029 + SRC-0007.
const EXTENDED_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Does BarMatrix include essays or performance tests?",
    a: "No. BarMatrix focuses on MBE multiple choice. You remain responsible for essay and performance-test preparation.",
  },
  {
    q: "Are these official NCBE questions?",
    a: "No. BarMatrix uses original MBE-style questions unless a question is expressly identified as licensed material. The product is not affiliated with or endorsed by NCBE or any bar authority.",
  },
  {
    q: "Can I use BarMatrix with BARBRI, Themis, Kaplan, UWorld, AdaptiBar, or Quimbee?",
    a: "Yes. BarMatrix is designed as a companion MBE repair system. Keep using your main course for the full bar exam, including essays and performance tests.",
  },
  {
    q: "Does BarMatrix guarantee that I will pass?",
    a: "No. No score, pass result, or exam outcome is guaranteed. BarMatrix provides structured MBE practice, diagnosis, and repair.",
  },
  {
    q: "What happens after I buy?",
    a: "You create or access your account, complete the diagnostic if you have not already done so, review your Red-Zone Map, and begin assigned repair drills. Your dashboard tracks accuracy, confidence, wrong-answer traps, and red-zone assignments.",
  },
];

// Combine the homepage-tier FAQ (from lib/copy.ts) with the extended set.
const ALL = [...FAQ, ...EXTENDED_FAQ];

export default function FaqPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-6 text-zinc-600">
          Quick answers about pricing, scope, platforms, and what comes after you enroll. Don&apos;t see your question?{" "}
          <Link href="mailto:support@barmatrix.app" className="underline">
            Email support
          </Link>
          .
        </p>

        <dl className="mt-12 space-y-8">
          {ALL.map((item) => (
            <div key={item.q} className="border-b border-zinc-200 pb-6 last:border-b-0">
              <dt className="font-serif text-xl font-semibold">{item.q}</dt>
              <dd className="mt-2 text-zinc-700">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Important
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-600">{DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}
