import Link from "next/link";
import { PRICING, FAQ } from "@/lib/copy";

export const metadata = {
  title: "Pricing — BarMatrix Flagship $999",
  description:
    "BarMatrix Flagship is $999 with a payment plan of $500 today and $499 in 30 days. One July-cycle cohort. Limited seats available.",
};

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          {PRICING.flagshipName} — {PRICING.priceLabel}
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          One July-cycle cohort. Full MBE trap-repair access.
        </p>
        <ul className="mt-10 grid gap-2 sm:grid-cols-2">
          {PRICING.includes.map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <span className="text-zinc-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-6">
          <p className="font-mono text-sm text-zinc-700">{PRICING.paymentPlanLabel}</p>
          <p className="mt-2 font-mono text-sm text-zinc-500">{PRICING.capacityLine}</p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/checkout"
            className="rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
          >
            Enroll in BarMatrix Flagship
          </Link>
          <Link
            href="/diagnostic"
            className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:border-zinc-500"
          >
            Take the Free Diagnostic first
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl font-semibold">FAQ</h2>
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
