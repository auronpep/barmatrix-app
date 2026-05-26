"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError, type DiagnosticStartResponse } from "@/lib/api-client";

type Phase = "intro" | "starting" | "empty_bank" | "error";

function cacheSession(session: DiagnosticStartResponse): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      `barmatrix.diagnostic.${session.diagnostic_id}`,
      JSON.stringify({
        diagnostic_id: session.diagnostic_id,
        question_ids: session.question_ids,
        total_questions: session.total_questions,
        expected_total: session.expected_total,
        bank_loaded: session.bank_loaded,
      }),
    );
  } catch {
    // sessionStorage unavailable — first question page will redirect home.
  }
}

export default function DiagnosticPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setPhase("starting");
    setError(null);
    try {
      const result = await api.startDiagnostic({});
      if (result.question_ids.length === 0) {
        setEmptyMessage(
          "Question bank isn&apos;t loaded yet — the diagnostic launches once content ingestion completes.",
        );
        setPhase("empty_bank");
        return;
      }
      cacheSession(result);
      router.push(`/diagnostic/${result.diagnostic_id}/0`);
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
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Free MBE Trap Diagnostic
      </h1>
      <p className="mt-6 text-lg text-zinc-600">
        Instead of reporting only a percentage, BarMatrix looks at the type of wrong answers
        you choose: legally true but irrelevant, wrong timing, exception omitted, wrong party,
        wrong standard, and other recurring MBE trap patterns.
      </p>

      {phase === "intro" && (
        <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-sm font-medium text-zinc-700">
            Hearsay seam · 6 questions · ~10 minutes
          </p>
          <p className="mt-2 text-zinc-600">
            At the end you&apos;ll see your Red-Zone Map: the top trap families your wrong
            answers landed in, with focus-group data showing how other test-takers chose.
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-6 rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
          >
            Start the diagnostic
          </button>
        </div>
      )}

      {phase === "starting" && (
        <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-zinc-600">Starting diagnostic session…</p>
        </div>
      )}

      {phase === "empty_bank" && (
        <div className="mt-12 rounded-lg border border-amber-200 bg-amber-50 p-8">
          <p className="font-medium text-amber-900">{emptyMessage}</p>
          <button
            type="button"
            onClick={start}
            className="mt-6 rounded-md border border-amber-300 px-5 py-2.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
          >
            Check again
          </button>
        </div>
      )}

      {phase === "error" && (
        <div className="mt-12 rounded-lg border border-red-200 bg-red-50 p-8">
          <p className="font-medium text-red-800">Couldn&apos;t start the diagnostic.</p>
          <p className="mt-2 font-mono text-xs text-red-700">{error}</p>
          <button
            type="button"
            onClick={start}
            className="mt-6 rounded-md border border-red-300 px-5 py-2.5 text-sm font-medium text-red-900 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mt-10">
        <Link href="/pricing" className="text-sm text-zinc-600 underline hover:text-zinc-900">
          Skip to pricing
        </Link>
      </div>
    </section>
  );
}
