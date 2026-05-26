"use client";

import { useState } from "react";
import { api, ApiClientError, type PaymentPlan } from "@/lib/api-client";
import { PRICING, DISCLAIMER } from "@/lib/copy";

type Phase = "ready" | "redirecting" | "error";

export default function CheckoutPage() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [error, setError] = useState<string | null>(null);

  const enroll = async (plan: PaymentPlan) => {
    setPhase("redirecting");
    setError(null);
    try {
      const session = await api.createCheckoutSession({ payment_plan: plan });
      // Hand off to Stripe-hosted checkout. window.location.assign keeps the
      // session bound to the same tab so the success redirect lands cleanly.
      window.location.assign(session.checkout_url);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? `API ${err.status}: ${err.message}`
          : err instanceof Error
            ? err.message
            : "Unknown error";
      setError(message);
      setPhase("error");
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        Enroll in {PRICING.flagshipName}
      </h1>
      <p className="mt-4 text-zinc-600">
        You are enrolling in BarMatrix Flagship, a multiple-choice-only MBE repair system.
        Access includes the diagnostic, question-bank access, Wrong Answer Forensics, Red-Zone
        Map, assigned drills, boot camp modules, timed mixed sets, dashboard access, and
        web/iOS/Android app access.
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
            onClick={() => enroll("pay_in_full")}
            disabled={phase === "redirecting"}
            className="mt-4 w-full rounded-md bg-zinc-900 px-5 py-3 text-base font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
          >
            {phase === "redirecting" ? "Redirecting to Stripe…" : "Continue · Pay $999"}
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
            onClick={() => enroll("two_pay_500_499")}
            disabled={phase === "redirecting"}
            className="mt-4 w-full rounded-md border border-zinc-900 px-5 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
          >
            {phase === "redirecting"
              ? "Redirecting to Stripe…"
              : "Continue · Payment plan"}
          </button>
        </div>
      </div>

      {phase === "error" && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-800">Couldn&apos;t start checkout.</p>
          <p className="mt-1 font-mono text-xs text-red-700">{error}</p>
          <p className="mt-2 text-xs text-red-700">
            If this persists, email support@barmatrix.app and we&apos;ll resolve it.
          </p>
        </div>
      )}

      <p className="mt-10 text-xs leading-relaxed text-zinc-500">{DISCLAIMER}</p>
    </section>
  );
}
