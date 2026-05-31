"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError, type DiagnosticStartResponse } from "@/lib/api-client";
import { getAttributionProperties, trackDiagnosticStarted } from "@/lib/analytics";

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

export function DiagnosticPageClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setPhase("starting");
    setError(null);
    try {
      const searchParams = readCurrentSearchParams();
      const attribution = getAttributionProperties(searchParams);
      const result = await api.startDiagnostic({
        partner_id: attribution.partner_id === "none" ? undefined : attribution.partner_id,
      });
      trackDiagnosticStarted({
        searchParams,
        sessionId: result.diagnostic_id,
      });
      if (result.question_ids.length === 0) {
        setEmptyMessage(
          "Question bank isn't loaded yet — the diagnostic launches once content ingestion completes.",
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
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">FREE · ~10 MINUTES</span>
            <span className="stamp">MBE TRAP DIAGNOSTIC</span>
            <span className="stamp">EDITION : LAUNCH</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ FREE MBE TRAP DIAGNOSTIC
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "22ch" }}
          >
            Don&apos;t guess.{" "}
            <span style={{ fontStyle: "italic" }}>Diagnose.</span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            Instead of reporting only a percentage, BarMatrix looks at the type
            of wrong answers you choose: legally true but irrelevant, wrong
            timing, exception omitted, wrong party, wrong standard, and other
            recurring MBE trap patterns.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <div className="section-rule">
                <span className="label">▌ What You Get</span>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  borderTop: "2px solid var(--ink)",
                }}
              >
                {[
                  "Personal Red-Zone Map of your top trap families",
                  "Forensic tags on each of your specific misses",
                  "Sample assigned drills so you can see Flagship feedback",
                  "Companion path with your existing bar course",
                ].map((t) => (
                  <li
                    key={t}
                    style={{
                      padding: "16px 0",
                      borderBottom: "1px solid var(--rule-soft)",
                      fontSize: 16,
                      display: "grid",
                      gridTemplateColumns: "24px 1fr",
                      gap: 12,
                    }}
                  >
                    <span className="mono" style={{ color: "var(--red)" }}>
                      →
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {phase === "intro" && (
                <div className="forensics-card">
                  <div className="forensics-header">
                    <span>
                      <span className="live-dot" />
                      Ready to Start
                    </span>
                    <span>~10 MIN</span>
                  </div>
                  <div className="forensics-body">
                    <div
                      className="eyebrow-strong"
                      style={{ marginBottom: 16 }}
                    >
                      ▸ TRAP-WEIGHTED · 12 QUESTIONS
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: 18,
                        lineHeight: 1.55,
                        color: "var(--ink-soft)",
                        margin: "0 0 24px",
                      }}
                    >
                      At the end you&apos;ll see your Red-Zone Map: the top
                      trap families your wrong answers landed in, with the
                      forensic tag and repair drill for each.
                    </p>
                    <button
                      type="button"
                      onClick={start}
                      className="btn btn-lg red"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        textAlign: "center",
                        whiteSpace: "normal",
                      }}
                    >
                      Start the Diagnostic <span className="arrow">→</span>
                    </button>
                    <p
                      className="mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                        textAlign: "center",
                        marginTop: 14,
                      }}
                    >
                      No card · No commitment
                    </p>
                  </div>
                </div>
              )}

              {phase === "starting" && (
                <div className="info-panel">
                  <div
                    className="eyebrow-strong"
                    style={{ marginBottom: 12 }}
                  >
                    ▸ STARTING SESSION
                  </div>
                  <DiagnosticSkeleton />
                </div>
              )}

              {phase === "empty_bank" && (
                <div className="info-panel alert">
                  <div
                    className="eyebrow-strong"
                    style={{ marginBottom: 12, color: "var(--amber)" }}
                  >
                    ▸ BANK NOT LOADED YET
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 17,
                      color: "var(--ink)",
                      margin: "0 0 20px",
                      lineHeight: 1.5,
                    }}
                  >
                    {emptyMessage}
                  </p>
                  <button type="button" onClick={start} className="btn red">
                    Check again <span className="arrow">→</span>
                  </button>
                </div>
              )}

              {phase === "error" && (
                <div className="info-panel error">
                  <div
                    className="eyebrow-strong"
                    style={{ marginBottom: 12, color: "var(--red)" }}
                  >
                    ▌ COULDN&apos;T START
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 17,
                      color: "var(--ink)",
                      margin: "0 0 8px",
                    }}
                  >
                    The diagnostic failed to start.
                  </p>
                  <p
                    style={{
                      color: "var(--ink-soft)",
                      fontSize: 14,
                      lineHeight: 1.55,
                      margin: "0 0 12px",
                    }}
                  >
                    Retry the start request. If the API is temporarily unavailable, the
                    diagnostic can be restarted from this page without losing checkout or
                    pricing context.
                  </p>
                  <p
                    className="mono"
                    style={{
                      fontSize: 12,
                      color: "var(--red-deep)",
                      margin: "0 0 20px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {error}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <button type="button" onClick={start} className="btn red">
                      Try again <span className="arrow">→</span>
                    </button>
                    <Link href="/pricing" className="btn ghost">
                      View pricing
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <Link
              href="/pricing"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--muted)",
                borderBottom: "1px solid var(--rule-soft)",
                paddingBottom: 2,
              }}
            >
              Skip to pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function DiagnosticSkeleton() {
  const rows = ["Selecting trap-weighted questions", "Opening answer tracker", "Preparing Red-Zone scoring"];

  return (
    <div aria-live="polite">
      <p
        style={{
          fontFamily: "var(--serif)",
          fontSize: 18,
          color: "var(--ink-soft)",
          margin: "0 0 18px",
        }}
      >
        Loading your diagnostic question bank...
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((row, index) => (
          <div
            key={row}
            style={{
              border: "1px solid var(--rule-soft)",
              background: index === 0 ? "var(--highlighter-soft)" : "var(--bg)",
              padding: "12px 14px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
              }}
            >
              {row}
            </span>
            <span className="mono" style={{ color: "var(--red)", fontSize: 11 }}>
              {index === 0 ? "Active" : "Queued"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function readCurrentSearchParams(): URLSearchParams {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.search);
}
