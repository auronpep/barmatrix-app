"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiClientError, type PlacementSessionStartResponse } from "@/lib/api-client";

type Phase = "intro" | "starting" | "error";

function cachePlacementSession(result: PlacementSessionStartResponse): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      `barmatrix.placement.${result.session_id}`,
        JSON.stringify({
          session_id: result.session_id,
          question_ids: result.questions.map((question) => question.question_id),
          questions: result.questions,
          completed_count: 0,
        }),
    );
  } catch {
    // If sessionStorage is unavailable, the session page will show recovery UI.
  }
}

export function PlacementEntryClient() {
  const router = useRouter();
  const search = useSearchParams();
  const [phase, setPhase] = useState<Phase>("intro");
  const [error, setError] = useState<string | null>(null);
  const stepId = search.get("step");

  const start = async () => {
    setPhase("starting");
    setError(null);
    try {
      const result = await api.startPlacementSession();
      if (!Array.isArray(result.questions) || result.questions.length === 0) {
        setError("Placement content is unavailable while the learning bank is being rebuilt.");
        setPhase("error");
        return;
      }
      cachePlacementSession(result);
      router.push(
        `/diagnostic/session/${result.session_id}${
          stepId ? `?step=${encodeURIComponent(stepId)}` : ""
        }`,
      );
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
            <span className="stamp">C3 PLACEMENT · 18 QUESTIONS</span>
            <span className="stamp">~15–20 MINUTES</span>
            <span className="stamp">CALIBRATED START</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ C3 PLACEMENT ASSESSMENT
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "22ch" }}
          >
            Find your{" "}
            <span style={{ fontStyle: "italic" }}>starting level.</span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            18 curated questions that map your legal accuracy, C3 mechanism
            recognition, and confidence calibration — so you enter the program
            at exactly the right level.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <div className="section-rule">
                <span className="label">▌ What This Measures</span>
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
                  "Legal accuracy across MBE subjects",
                  "C3 mechanism recognition (CUT / CLASH / CALL / ANCHOR / FORK)",
                  "Confidence calibration (do you know what you know?)",
                  "Personalized entry route into the C3 program",
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
                    <span>~15–20 MIN</span>
                  </div>
                  <div className="forensics-body">
                    <div
                      className="eyebrow-strong"
                      style={{ marginBottom: 16 }}
                    >
                      ▸ C3 PLACEMENT · 18 QUESTIONS
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: 18,
                        lineHeight: 1.55,
                        color: "var(--ink-soft)",
                        margin: "0 0 12px",
                      }}
                    >
                      Each question asks you to select an answer and identify
                      the C3 mechanism that made the correct answer win. Try to
                      complete this in one sitting.
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                        margin: "0 0 24px",
                      }}
                    >
                      18 questions · Legal + Mechanism + Calibration scores
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
                      Start Assessment <span className="arrow">→</span>
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
                  <p
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 18,
                      color: "var(--ink-soft)",
                      margin: "0 0 18px",
                    }}
                  >
                    Opening your placement session...
                  </p>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[
                      "Loading curated question set",
                      "Initializing scoring model",
                      "Preparing C3 mechanism prompts",
                    ].map((row, index) => (
                      <div
                        key={row}
                        style={{
                          border: "1px solid var(--rule-soft)",
                          background:
                            index === 0
                              ? "var(--highlighter-soft)"
                              : "var(--bg)",
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
                        <span
                          className="mono"
                          style={{ color: "var(--red)", fontSize: 11 }}
                        >
                          {index === 0 ? "Active" : "Queued"}
                        </span>
                      </div>
                    ))}
                  </div>
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
                    The placement session failed to start.
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
                    <Link href="/diagnostic" className="btn ghost">
                      Free diagnostic instead
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <Link
              href="/diagnostic"
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
              Take the free MBE Trap Diagnostic instead →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
