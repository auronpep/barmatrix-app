import { Suspense } from "react";
import { ReferralShareClient } from "./referral-share-client";

export const metadata = {
  title: "Referral Share Link - BarMatrix",
  description:
    "Create and verify a BarMatrix referral link with partner attribution.",
};

export default function ReferralSharePage() {
  return (
    <Suspense fallback={<ReferralShareFallback />}>
      <ReferralShareClient />
    </Suspense>
  );
}

function ReferralShareFallback() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Referral Share
      </p>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
        Build a tracked partner link.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-700">
        Loading the referral builder...
      </p>
    </section>
  );
}
