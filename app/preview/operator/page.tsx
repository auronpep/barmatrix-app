"use client";

// Redesign V2 preview — the Operator Console (founder launch-sprint command center).
//
// PHASE 2 (presentation only): a static demo of the operator console so the founder
// can review the full command center before it's wired to real data and gated.
// Demo data only — no auth. Commercial figures use the LOCKED model ($999 / $500+$499
// plan / limited-seats). FLIP to production: founder-gated route group
// app/(operator)/operator/ with a server-side Clerk allowlist, /operator added to
// robots disallow, and BM_OP_DATA replaced by GET /api/me/operator.

import { OperatorConsole } from "@/components/operator/operator-console";
import { SectionLabel } from "@/components/redesign/redesign-chrome";

export default function OperatorPreviewPage() {
  return (
    <main className="py-6">
      <div className="mx-auto mb-4 max-w-[1600px] px-5">
        <SectionLabel>Preview · founder console</SectionLabel>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-zinc-950">Operator Console</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
          The founder&apos;s launch-sprint command center — Mission Control, conversion funnel, refunds,
          referral console, and live ops. Demo data; founder-gated when it flips to production.
        </p>
      </div>
      <div className="mx-auto max-w-[1600px] px-5">
        <OperatorConsole />
      </div>
    </main>
  );
}
