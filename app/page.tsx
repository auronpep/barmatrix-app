import Link from "next/link";
import { HERO, PRICING, PROOF_CARD, FAQ } from "@/lib/copy";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          {HERO.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 sm:text-xl">
          {HERO.subhead}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href={HERO.primaryCta.href}
            className="rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
          >
            {HERO.primaryCta.label}
          </Link>
          <Link
            href={HERO.secondaryCta.href}
            className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:border-zinc-500"
          >
            {HERO.secondaryCta.label}
          </Link>
        </div>
        <p className="mt-8 font-mono text-sm tracking-wide text-zinc-500">
          {HERO.flagshipLine}
        </p>
      </section>

      {/* Above-fold proof card */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-lg border border-zinc-300 bg-white p-8 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Live wrong-answer forensics
            </p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">Trap</dt>
                <dd className="font-medium">{PROOF_CARD.trap}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Student selected</dt>
                <dd className="font-medium">{PROOF_CARD.studentSelected}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-500">{PROOF_CARD.focusGroupLine}</dt>
              </div>
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

      {/* Pricing block */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
          {PRICING.flagshipName} — {PRICING.priceLabel}
        </h2>
        <p className="mt-4 text-zinc-600">One July-cycle cohort. Full MBE trap-repair access.</p>
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {PRICING.includes.map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <span className="text-zinc-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-mono text-sm text-zinc-700">{PRICING.paymentPlanLabel}</p>
        <p className="mt-2 font-mono text-sm text-zinc-500">{PRICING.capacityLine}</p>
        <div className="mt-8">
          <Link
            href="/checkout"
            className="inline-block rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
          >
            Enroll in BarMatrix Flagship
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl font-semibold">Frequently asked</h2>
          <dl className="mt-8 space-y-6">
            {FAQ.map((item) => (
              <div key={item.q}>
                <dt className="font-medium">{item.q}</dt>
                <dd className="mt-1 text-zinc-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
