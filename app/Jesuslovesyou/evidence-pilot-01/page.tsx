import Link from "next/link";
import type { Metadata } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  evidenceLeadMeRun,
  evidenceOutlineNode,
  evidencePilotPageModules,
  pilotSubsets,
} from "@/lib/jesuslovesyou/pilot-data";

const evidencePilot = pilotSubsets[0];

export const metadata: Metadata = {
  title: "Evidence-Pilot-01 - Jesuslovesyou BarMatrix",
  description:
    "Evidence-Pilot-01 implementation surface for the Jesuslovesyou BarMatrix V6 rebuild.",
  alternates: {
    canonical: "/Jesuslovesyou/evidence-pilot-01",
  },
};

export default function EvidencePilotPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">EVIDENCE-PILOT-01</span>
            <span className="stamp">{evidencePilot.seedCount} SEED QUESTIONS</span>
            <span className="stamp">V6 CONTENT SURFACE</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; USE / PURPOSE / WITNESS ATTACK / HEARSAY GATE
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            Evidence is the first full factory test.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            This page turns the first-group plan into the student-facing Evidence
            pilot surface: selected outline codes, answer-page modules, a LeadMe
            run, and an Outline Atlas node sample.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/seeds`}
              className="btn btn-lg red"
            >
              Open seed candidates <span className="arrow">-&gt;</span>
            </Link>
            <Link href={JESUSLOVESYOU_ROUTE_PREFIX} className="btn btn-lg ghost">
              Back to Jesuslovesyou <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/checkout?lp=Jesuslovesyou-evidence`}
              className="btn btn-lg ghost"
            >
              Open prefixed checkout <span className="arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Outline Codes</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {evidencePilot.codes.map((code) => (
              <article className="info-panel" key={code.code}>
                <p className="mono" style={{ margin: "0 0 10px", fontSize: 12 }}>
                  {code.code}
                </p>
                <h2 className="serif" style={{ fontSize: 24, margin: "0 0 10px" }}>
                  {code.role}
                </h2>
                <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                  {code.node}
                </p>
                <div style={{ marginTop: 18 }}>
                  <Link
                    href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/${code.code}`}
                    className="btn ghost"
                  >
                    Open node <span className="arrow">-&gt;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Answer Page v7</span>
          </div>
          <div className="info-panel" style={{ display: "grid", gap: 18 }}>
            {evidencePilotPageModules.map((module) => (
              <div
                key={module.label}
                style={{
                  borderTop: "1px solid var(--rule-soft)",
                  paddingTop: 16,
                }}
              >
                <h2 className="serif" style={{ fontSize: 26, margin: "0 0 8px" }}>
                  {module.label}
                </h2>
                <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  {module.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; LeadMe + Outline Atlas</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: 24,
            }}
          >
            <article className="info-panel">
              <div className="eyebrow-strong" style={{ marginBottom: 14 }}>
                {evidenceLeadMeRun.moduleId}
              </div>
              <h2 className="serif" style={{ fontSize: 28, margin: "0 0 12px" }}>
                {evidenceLeadMeRun.title}
              </h2>
              <p style={{ margin: "0 0 16px", lineHeight: 1.6 }}>
                {evidenceLeadMeRun.targetReason}
              </p>
              <div style={{ display: "grid", gap: 10 }}>
                {evidenceLeadMeRun.tasks.map((task, index) => (
                  <p
                    key={task}
                    style={{
                      borderTop: "1px solid var(--rule-soft)",
                      margin: 0,
                      paddingTop: 10,
                    }}
                  >
                    <span className="mono" style={{ color: "var(--red)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>{" "}
                    {task}
                  </p>
                ))}
              </div>
            </article>

            <article className="info-panel">
              <div className="eyebrow-strong" style={{ marginBottom: 14 }}>
                {evidenceOutlineNode.displayCode} / {evidenceOutlineNode.legacyOutlineCode}
              </div>
              <h2 className="serif" style={{ fontSize: 28, margin: "0 0 12px" }}>
                {evidenceOutlineNode.title}
              </h2>
              <p style={{ margin: "0 0 16px", lineHeight: 1.6 }}>
                {evidenceOutlineNode.path}
              </p>
              {evidenceOutlineNode.anchors.map((anchor) => (
                <p
                  key={anchor}
                  style={{
                    borderTop: "1px solid var(--rule-soft)",
                    margin: 0,
                    paddingTop: 12,
                    lineHeight: 1.55,
                  }}
                >
                  {anchor}
                </p>
              ))}
              <p
                style={{
                  borderTop: "1px solid var(--rule-soft)",
                  margin: "12px 0 0",
                  paddingTop: 12,
                  color: "var(--red-deep)",
                  lineHeight: 1.55,
                }}
              >
                {evidenceOutlineNode.trapSummary}
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
