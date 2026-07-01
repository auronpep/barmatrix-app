import Link from "next/link";
import type { Metadata } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  pilotSubsets,
} from "@/lib/jesuslovesyou/pilot-data";
import { conLawQuestionDetails } from "@/lib/jesuslovesyou/conlaw-question-details";
import { conLawSeedCandidates } from "@/lib/jesuslovesyou/conlaw-seed-candidates";
import { countRows, label, summarizeQa } from "@/lib/jesuslovesyou/qa-summary";

const conLawPilot = pilotSubsets[1];
const summary = summarizeQa(conLawQuestionDetails);
const detailIds = new Set(conLawQuestionDetails.map((detail) => detail.questionId));
const missingDetails = conLawSeedCandidates.filter(
  (candidate) => !detailIds.has(candidate.question_id),
);
const codeRows = conLawPilot.codes.map((code) => {
  const linkedDetails = conLawQuestionDetails.filter(
    (detail) => detail.selectorCode === code.code,
  );
  const keyCount = linkedDetails.reduce(
    (sum, detail) => sum + detail.keys.length,
    0,
  );

  return {
    code,
    caseStudies: linkedDetails.length,
    keyCount,
    childRows: linkedDetails.filter(
      (detail) => detail.selectorMatch === "child_code",
    ).length,
  };
});
const selectorMatchCounts = countRows(
  conLawQuestionDetails.map((detail) => detail.selectorMatch),
);
const childCodeExamples = conLawQuestionDetails.filter(
  (detail) => detail.selectorMatch === "child_code",
);

export const metadata: Metadata = {
  title: "Con Law QA Report - Jesuslovesyou BarMatrix",
  description:
    "ConLaw-Pilot-01 QA report for the Jesuslovesyou BarMatrix rebuild.",
  alternates: {
    canonical: "/Jesuslovesyou/conlaw-pilot-01/qa-report",
  },
};

export default function ConLawQaReportPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">CONLAW-PILOT-01</span>
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
            Con Law pilot QA is now visible on the route.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            This report checks the implemented seed/detail surface, selector
            coverage, child-code rows, reusable keys, LeadMe steps, and proof
            drills for the first Constitutional Law pilot.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01`}
              className="btn btn-lg ghost"
            >
              Back to Con Law pilot <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/seeds`}
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
              ["Seed details", `${summary.caseStudies}/${conLawSeedCandidates.length}`],
              ["Missing details", missingDetails.length],
              ["Reusable keys", summary.reusableKeys],
              ["Trap keys", summary.trapKeys],
              ["LeadMe steps", summary.leadMeSteps],
              ["Drill seeds", summary.drillSeeds],
              ["Answer-flow steps", summary.answerFlowSteps],
              ["Source-code rows", summary.recodeRows],
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
            <span className="label">&#x258C; Selector Coverage</span>
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
                  {row.childRows} child-code rows
                </p>
                <Link
                  href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/${row.code.code}`}
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
              ["Selector match", selectorMatchCounts],
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
            <span className="label">&#x258C; Child-Code Examples</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 16,
            }}
          >
            {childCodeExamples.slice(0, 6).map((detail) => (
              <article className="info-panel" key={detail.questionId}>
                <p className="mono" style={{ margin: "0 0 10px", fontSize: 12 }}>
                  Q{detail.questionId} / key {detail.key}
                </p>
                <h2 className="serif" style={{ fontSize: 24, margin: "0 0 10px" }}>
                  {detail.title}
                </h2>
                <p style={{ margin: "0 0 14px", lineHeight: 1.55 }}>
                  selector {detail.selectorCode} / selected {detail.outlineCode}
                </p>
                <Link
                  href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/seeds/${detail.questionId}`}
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
