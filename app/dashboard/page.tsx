"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type CohortStatus } from "@/lib/api-client";

// Day 1 dashboard shell. After Clerk auth is wired this becomes the
// authenticated landing page; for now it doubles as a health-visible page
// showing the live API cohort status, so anyone (including the founder)
// can verify the full Vercel ↔ Cloud Run ↔ Cloud SQL stack at a glance.
export default function DashboardPage() {
  const [status, setStatus] = useState<CohortStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .cohortStatus()
      .then((result) => {
        if (!cancelled) setStatus(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Dashboard
      </h1>
      <p className="mt-4 text-zinc-600">
        After enrollment, this is where your Red-Zone Map, assigned drills, and Wrong Answer
        Forensics history will live. Authentication and the student data layer land in the
        next iteration.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Cohort status
          </p>
          {status && (
            <>
              <p className="mt-3 text-lg font-medium text-zinc-900">{status.public_copy}</p>
              <p className="mt-1 font-mono text-xs text-zinc-500">
                {status.cohort_code} · {status.public_status}
              </p>
            </>
          )}
          {!status && !error && <p className="mt-3 text-zinc-500">Loading…</p>}
          {error && (
            <p className="mt-3 font-mono text-xs text-red-700">{error}</p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Your study path
          </p>
          <ol className="mt-3 space-y-2 text-sm text-zinc-700">
            <li>1. Diagnostic → Red-Zone Map</li>
            <li>2. First assigned drill</li>
            <li>3. Wrong Answer Forensics review</li>
            <li>4. Timed mixed sets</li>
            <li>5. Final sprint path</li>
          </ol>
          <p className="mt-4 text-xs text-zinc-500">
            Activates after enrollment + login.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/diagnostic"
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Take the diagnostic
        </Link>
        <Link
          href="/pricing"
          className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:border-zinc-500"
        >
          See pricing
        </Link>
      </div>
    </section>
  );
}
