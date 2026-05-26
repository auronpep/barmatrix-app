"use client";

// Results page after a diagnostic session completes — Handoff 10 Phase 2.
// Anonymous students will see the "enroll to save your Red-Zone Map" CTA
// because /api/red-zones returns an empty map without a student_id.

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  api,
  ApiClientError,
  type RedZonesResponse,
} from "@/lib/api-client";

interface SessionCache {
  diagnostic_id: string;
  question_ids: string[];
  total_questions: number;
  expected_total: number;
  bank_loaded: boolean;
}

function readSessionCache(diagnosticId: string): SessionCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(`barmatrix.diagnostic.${diagnosticId}`);
    if (!raw) return null;
    return JSON.parse(raw) as SessionCache;
  } catch {
    return null;
  }
}

export default function DiagnosticResultsPage({
  params,
}: {
  params: Promise<{ session: string }>;
}) {
  const { session: diagnosticId } = use(params);
  const [sessionCache, setSessionCache] = useState<SessionCache | null>(null);
  const [redZones, setRedZones] = useState<RedZonesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessionCache(readSessionCache(diagnosticId));
    api
      .getRedZones()
      .then(setRedZones)
      .catch((err: unknown) => {
        setError(
          err instanceof ApiClientError
            ? `API ${err.status}: ${err.message}`
            : err instanceof Error
              ? err.message
              : "Unknown error",
        );
      });
  }, [diagnosticId]);

  const totalQuestions = sessionCache?.total_questions ?? 0;

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Diagnostic complete
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
        Your Red-Zone Map
      </h1>
      <p className="mt-4 text-lg text-zinc-600">
        {totalQuestions > 0
          ? `You answered ${totalQuestions} question${totalQuestions === 1 ? "" : "s"} across the Hearsay seam.`
          : "Your session details aren&apos;t cached locally."}
      </p>

      {redZones && redZones.by_dimension && Object.keys(redZones.by_dimension).length === 0 && (
        <div className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-zinc-800">
            {redZones.message ??
              "Enroll to save your Red-Zone Map and continue with drills."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
            >
              Enroll for $999
            </Link>
            <Link
              href="/red-zones"
              className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100"
            >
              View Red-Zone Map
            </Link>
          </div>
        </div>
      )}

      {redZones && Object.keys(redZones.by_dimension ?? {}).length > 0 && (
        <div className="mt-10 space-y-6">
          {Object.entries(redZones.by_dimension).map(([dimension, zones]) => (
            <div
              key={dimension}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                {dimension}
              </p>
              <ul className="mt-3 space-y-2">
                {zones.map((z) => (
                  <li key={z.tag} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-800">{z.tag}</span>
                    <span className="font-mono text-xs text-zinc-500">
                      {Math.round(z.proficiency_score * 100)}% · {z.attempts} attempts
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-6 font-mono text-xs text-red-700">{error}</p>
      )}

      <div className="mt-10">
        <Link
          href="/diagnostic"
          className="text-sm text-zinc-600 underline hover:text-zinc-900"
        >
          Run the diagnostic again
        </Link>
      </div>
    </section>
  );
}
