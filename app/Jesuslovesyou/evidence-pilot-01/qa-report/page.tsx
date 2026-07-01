import Link from "next/link";
import type { Metadata } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  pilotSubsets,
} from "@/lib/jesuslovesyou/pilot-data";
import {
  evidenceQuestionDetails,
  evidenceSeedCandidates,
} from "@/lib/jesuslovesyou/evidence-question-details";
import { label, summarizeQa } from "@/lib/jesuslovesyou/qa-summary";

const evidencePilot = pilotSubsets[0];
const summary = summarizeQa(evidenceQuestionDetails);
const detailIds = new Set(
  evidenceQuestionDetails.map((detail) => detail.questionId),
);
const missingDetails = evidenceSeedCandidates.filter(
  (candidate) => !detailIds.has(candidate.question_id),
);
const codeRows = evidencePilot.codes.map((code) => {
  const linkedDetails = evidenceQuestionDetails.filter(
    (detail) =>
      detail.outlineCode === code.code || detail.sourceOutlineCode === code.code,
  );
  const keyCount = linkedDetails.reduce(
    (sum, detail) => sum + detail.keys.length,
    0,
  );

  return {
    code,
    caseStudies: linkedDetails.length,
    keyCount,
    recodeRows: linkedDetails.filter(
      (detail) => detail.outlineCode !== detail.sourceOutlineCode,
    ).length,
  };
});
const recodeExamples = evidenceQuestionDetails.filter(
  (detail) => detail.outlineCode !== detail.sourceOutlineCode,
);

export const metadata: Metadata = {
  title: "Evidence QA Report - Jesuslovesyou BarMatrix",
  description:
    "Evidence-Pilot-01 QA report for the Jesuslovesyou BarMatrix rebuild.",
  alternates: {
    canonical: "/Jesuslovesyou/evidence-pilot-01/qa-report",
  },
};

export default function EvidenceQaReportPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">EVIDENCE-PILOT-01</span>
            <span className="stamp">QA REPORT</span>
            <span className="stamp">{summary.caseStudies} CASE STUDIES</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; FIRST-GROUP VERIFICATION
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            Evidence pilot QA is now visible on the route.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            This report checks the implemented seed/detail surface, outline-node
            links, recode rows, reusable keys, LeadMe steps, and proof drills for
            the first Evidence pilot.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01`}
              className="btn btn-lg ghost"
            >
              Back to Evidence pilot <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/seeds`}
              className="btn btn-lg ghost"
            >
              Open seed candidates <span className="arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; QA Counts</span>
          </div>
          <div
            className="info-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 16,
            }}
          >
            {[
              ["Seed details", `${summary.caseStudies}/${evidenceSeedCandidates.length}`],
              ["Missing details", missingDetails.length],
              ["Reusable keys", summary.reusableKeys],
              ["Trap keys", summary.trapKeys],
              ["LeadMe steps", summary.leadMeSteps],
              ["Drill seeds", summary.drillSeeds],
              ["Answer-flow steps", summary.answerFlowSteps],
              ["Recode rows", summary.recodeRows],
            ].map(([name, value]) => (
              <div key={name}>
                <p className="mono" style={{ margin: "0 0 8px", fontSize: 12 }}>
                  {name}
                </p>
                <p className="display" style={{ margin: 0, fontSize: 40 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Outline Coverage</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: 16,
            }}
          >
            {codeRows.map((row) => (
              <article className="info-panel" key={row.code.code}>
                <p className="mono" style={{ margin: "0 0 10px", fontSize: 12 }}>
                  {row.code.code}
                </p>
                <h2 className="serif" style={{ fontSize: 24, margin: "0 0 10px" }}>
                  {row.code.role}
                </h2>
                <p style={{ margin: "0 0 14px", lineHeight: 1.55 }}>
                  {row.caseStudies} case studies / {row.keyCount} keys /{" "}
                  {row.recodeRows} recode rows
                </p>
                <Link
                  href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/${row.code.code}`}
                  className="btn ghost"
                >
                  Open node <span className="arrow">-&gt;</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; QA Buckets</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: 24,
            }}
          >
            {[
              ["Review status", summary.reviewStatusCounts],
              ["Coverage groups", summary.coverageCounts],
              ["Seed buckets", summary.seedBucketCounts],
              ["Key kinds", summary.keyKindCounts],
            ].map(([title, rows]) => (
              <article className="info-panel" key={title as string}>
                <h2 className="serif" style={{ fontSize: 26, margin: "0 0 14px" }}>
                  {title as string}
                </h2>
                {(rows as [string, number][]).map(([name, count]) => (
                  <p
                    key={name}
                    style={{
                      borderTop: "1px solid var(--rule-soft)",
                      margin: 0,
                      paddingTop: 12,
                    }}
                  >
                    <span className="mono" style={{ color: "var(--red)" }}>
                      {String(count).padStart(2, "0")}
                    </span>{" "}
                    {label(name)}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Recode Examples</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 16,
            }}
          >
            {recodeExamples.map((detail) => (
              <article className="info-panel" key={detail.questionId}>
                <p className="mono" style={{ margin: "0 0 10px", fontSize: 12 }}>
                  Q{detail.questionId} / key {detail.key}
                </p>
                <h2 className="serif" style={{ fontSize: 24, margin: "0 0 10px" }}>
                  {detail.title}
                </h2>
                <p style={{ margin: "0 0 14px", lineHeight: 1.55 }}>
                  selected {detail.outlineCode} / source {detail.sourceOutlineCode}
                </p>
                <Link
                  href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/seeds/${detail.questionId}`}
                  className="btn ghost"
                >
                  Open case study <span className="arrow">-&gt;</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
