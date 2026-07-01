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
import { conLawQuestionDetails } from "@/lib/jesuslovesyou/conlaw-question-details";
import { conLawSeedCandidates } from "@/lib/jesuslovesyou/conlaw-seed-candidates";
import { summarizeQa } from "@/lib/jesuslovesyou/qa-summary";

const evidencePilot = pilotSubsets[0];
const conLawPilot = pilotSubsets[1];

const pilots = [
  {
    pilot: evidencePilot,
    basePath: `${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01`,
    seedCount: evidenceSeedCandidates.length,
    detailCount: evidenceQuestionDetails.length,
    summary: summarizeQa(evidenceQuestionDetails),
  },
  {
    pilot: conLawPilot,
    basePath: `${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01`,
    seedCount: conLawSeedCandidates.length,
    detailCount: conLawQuestionDetails.length,
    summary: summarizeQa(conLawQuestionDetails),
  },
];

const totals = pilots.reduce(
  (sum, item) => ({
    seeds: sum.seeds + item.seedCount,
    details: sum.details + item.detailCount,
    outlineNodes: sum.outlineNodes + item.pilot.codes.length,
    reusableKeys: sum.reusableKeys + item.summary.reusableKeys,
    leadMeSteps: sum.leadMeSteps + item.summary.leadMeSteps,
    drillSeeds: sum.drillSeeds + item.summary.drillSeeds,
    answerFlowSteps: sum.answerFlowSteps + item.summary.answerFlowSteps,
  }),
  {
    seeds: 0,
    details: 0,
    outlineNodes: 0,
    reusableKeys: 0,
    leadMeSteps: 0,
    drillSeeds: 0,
    answerFlowSteps: 0,
  },
);

const deliverables = [
  ["Question inventory", "Seed list plus outline-node coverage"],
  ["Golden seed set", "All selected seed routes are addressable"],
  ["Keys", "Gold, Silver, and Trap Key inventory"],
  ["Outline nodes", "Atlas pages with linked questions and proof drills"],
  ["LeadMe cards", "Micro-step inventory derived from case studies"],
  ["Answer-flow examples", "Rendered detail pages for every seed"],
  ["QA report", "Coverage, recode, review, and bucket counts"],
] as const;

export const metadata: Metadata = {
  title: "First-Group Artifacts - Jesuslovesyou BarMatrix",
  description:
    "First-group BarMatrix rebuild artifact hub for Evidence-Pilot-01 and ConLaw-Pilot-01.",
  alternates: {
    canonical: "/Jesuslovesyou/artifacts",
  },
};

export default function JesuslovesyouArtifactsPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">JESUSLOVESYOU ARTIFACTS</span>
            <span className="stamp">{totals.details}/{totals.seeds} DETAILS</span>
            <span className="stamp">{totals.outlineNodes} OUTLINE NODES</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; FIRST-GROUP DELIVERABLE HUB
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            One place to inspect the completed pilot package.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            Evidence-Pilot-01 and ConLaw-Pilot-01 now expose the seed set,
            answer-flow pages, Outline Atlas nodes, Keys, LeadMe steps, drill
            seeds, and QA reports under the capitalized route prefix.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link href={JESUSLOVESYOU_ROUTE_PREFIX} className="btn btn-lg ghost">
              Back to front door <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/seeds`}
              className="btn btn-lg red"
            >
              Evidence seed set <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/seeds`}
              className="btn btn-lg ghost"
            >
              Con Law seed set <span className="arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Aggregate Package</span>
          </div>
          <div
            className="info-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16,
            }}
          >
            {[
              ["Case studies", totals.details],
              ["Outline nodes", totals.outlineNodes],
              ["Reusable keys", totals.reusableKeys],
              ["LeadMe steps", totals.leadMeSteps],
              ["Drill seeds", totals.drillSeeds],
              ["Answer-flow steps", totals.answerFlowSteps],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="mono" style={{ margin: "0 0 8px", fontSize: 12 }}>
                  {label}
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
            <span className="label">&#x258C; Deliverable Matrix</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: 24,
            }}
          >
            {pilots.map((item) => (
              <article className="info-panel" key={item.pilot.id}>
                <div className="eyebrow-strong" style={{ marginBottom: 14 }}>
                  {item.pilot.subject}
                </div>
                <h2 className="serif" style={{ fontSize: 30, margin: "0 0 12px" }}>
                  {item.pilot.id}
                </h2>
                <p style={{ margin: "0 0 18px", lineHeight: 1.6 }}>
                  {item.detailCount} case studies, {item.pilot.codes.length}{" "}
                  outline nodes, {item.summary.reusableKeys} reusable keys,{" "}
                  {item.summary.leadMeSteps} LeadMe steps.
                </p>
                <div style={{ display: "grid", gap: 12 }}>
                  {deliverables.map(([name, status]) => (
                    <div
                      key={name}
                      style={{
                        borderTop: "1px solid var(--rule-soft)",
                        paddingTop: 12,
                      }}
                    >
                      <p className="mono" style={{ margin: "0 0 6px", fontSize: 12 }}>
                        {name}
                      </p>
                      <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                        {status}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="hero-actions" style={{ marginTop: 24 }}>
                  <Link href={item.basePath} className="btn ghost">
                    Open pilot <span className="arrow">-&gt;</span>
                  </Link>
                  <Link href={`${item.basePath}/qa-report`} className="btn ghost">
                    Open QA report <span className="arrow">-&gt;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
