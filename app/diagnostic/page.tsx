"use client";

import Link from "next/link";
import { useState } from "react";
import { api, ApiClientError, type DiagnosticStartResponse } from "@/lib/api-client";

type Phase = "intro" | "starting" | "started" | "error";

export default function DiagnosticPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [session, setSession] = useState<DiagnosticStartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setPhase("starting");
    setError(null);
    try {
      const result = await api.startDiagnostic({});
      setSession(result);
      setPhase("started");
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
          <p className="text-sm font-medium text-zinc-700">12 questions · ~15 minutes</p>
          <p className="mt-2 text-zinc-600">
            At the end you&apos;ll see your Red-Zone Map: the top trap families your wrong
            answers landed in, ranked by frequency and focus-group attractiveness.
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

      {phase === "started" && session && (
        <div className="mt-12 rounded-lg border border-zinc-300 bg-white p-8 shadow-sm">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Session created
          </p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-zinc-500">Diagnostic ID</dt>
              <dd className="font-mono text-xs text-zinc-700">{session.diagnostic_id}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Questions queued</dt>
              <dd>
                {session.total_questions} / {session.expected_total}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-zinc-500">Question bank</dt>
              <dd>
                {session.bank_loaded ? (
                  <span className="text-emerald-700">Loaded</span>
                ) : (
                  <span className="text-amber-700">
                    Bank not yet loaded — diagnostic content arrives when the 2,400-question
                    bank ingestion completes.
                  </span>
                )}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-zinc-600">
            Question-flow UI lands in the next update. In the meantime, your session is
            recorded — when the question UI ships, it will pick up at index{" "}
            <code className="font-mono">{session.next_question_index}</code>.
          </p>
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
