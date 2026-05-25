import { PRICING, DISCLAIMER } from "@/lib/copy";

export const metadata = {
  title: "Enroll in BarMatrix Flagship — $999",
  description:
    "Enroll in BarMatrix Flagship for $999, or use the payment plan: $500 today and $499 in 30 days. One July-cycle cohort.",
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        Enroll in {PRICING.flagshipName}
      </h1>
      <p className="mt-4 text-zinc-600">
        You are enrolling in BarMatrix Flagship, a multiple-choice-only MBE repair system. Access includes the diagnostic, question-bank access, Wrong Answer Forensics, Red-Zone Map, assigned drills, boot camp modules, timed mixed sets, dashboard access, and web/iOS/Android app access.
      </p>

      <div className="mt-10 space-y-4">
        <div className="rounded-lg border border-zinc-300 bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl font-semibold">Pay in full</h2>
            <span className="font-mono text-lg">{PRICING.priceLabel}</span>
          </div>
          <p className="mt-2 text-sm text-zinc-600">One charge. Immediate access.</p>
          <button
            type="button"
            disabled
            className="mt-4 w-full rounded-md bg-zinc-900 px-5 py-3 text-base font-medium text-white opacity-60"
            aria-disabled="true"
          >
            Continue to checkout — wiring in progress
          </button>
        </div>

        <div className="rounded-lg border border-zinc-300 bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl font-semibold">Payment plan</h2>
            <span className="font-mono text-lg">$500 + $499</span>
          </div>
          <p className="mt-2 text-sm text-zinc-600">{PRICING.paymentPlanLabel}. Same total.</p>
          <button
            type="button"
            disabled
            className="mt-4 w-full rounded-md border border-zinc-900 px-5 py-3 text-base font-medium text-zinc-900 opacity-60"
            aria-disabled="true"
          >
            Continue with payment plan — wiring in progress
          </button>
        </div>
      </div>

      <p className="mt-10 text-xs leading-relaxed text-zinc-500">{DISCLAIMER}</p>
    </section>
  );
}
