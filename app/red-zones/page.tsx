"use client";

// Red-Zone Map dashboard — Handoff 10 Phase 3.
//
// Without Clerk wired we can't read an authenticated student_id. The page
// renders the empty-state CTA pointing back to the diagnostic; once auth
// arrives the page will accept the student_id from session context and
// surface the populated map.

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiClientError, type RedZonesResponse } from "@/lib/api-client";

export default function RedZonesPage() {
  const [data, setData] = useState<RedZonesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getRedZones()
      .then(setData)
      .catch((err: unknown) => {
        setError(
          err instanceof ApiClientError
            ? `API ${err.status}: ${err.message}`
            : err instanceof Error
              ? err.message
              : "Unknown error",
        );
      });
  }, []);

  const dims = data ? Object.entries(data.by_dimension ?? {}) : [];
  const isEmpty = data !== null && dims.length === 0;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Red-Zone Map
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Where your wrong answers cluster
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        BarMatrix groups your wrong answers by subject, subtopic, tension point, and trap
        architecture. The lower the proficiency score, the more attention that zone needs.
      </p>

      {!data && !error && (
        <p className="mt-12 text-zinc-600">Loading your Red-Zone Map…</p>
      )}

      {error && (
        <div className="mt-12 rounded-lg border border-red-200 bg-red-50 p-8">
          <p className="font-medium text-red-800">Couldn&apos;t load Red-Zone Map.</p>
          <p className="mt-2 font-mono text-xs text-red-700">{error}</p>
        </div>
      )}

      {isEmpty && (
        <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-zinc-800">
            {data?.message ?? "Take the diagnostic to build your Red-Zone Map."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/diagnostic"
              className="rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
            >
              Start the diagnostic
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100"
            >
              Enroll for $999
            </Link>
          </div>
        </div>
      )}

      {dims.length > 0 && (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {dims.map(([dimension, zones]) => (
            <div
              key={dimension}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                {dimension}
              </p>
              <ul className="mt-4 space-y-3">
                {zones.map((z) => {
                  const pct = Math.max(0, Math.min(100, Math.round(z.proficiency_score * 100)));
                  return (
                    <li key={z.tag}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-800">{z.tag}</span>
                        <span className="font-mono text-xs text-zinc-500">
                          {pct}% · {z.attempts} attempts · {z.high_confidence_wrongs} HC wrong
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-100">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
