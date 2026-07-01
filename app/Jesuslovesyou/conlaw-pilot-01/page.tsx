import Link from "next/link";
import type { Metadata } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  pilotSubsets,
} from "@/lib/jesuslovesyou/pilot-data";
import { conLawQuestionDetails } from "@/lib/jesuslovesyou/conlaw-question-details";

const conLawPilot = pilotSubsets[1];
const conLawKeys = conLawQuestionDetails.flatMap((detail) =>
  detail.keys.map((keyItem) => ({
    ...keyItem,
    questionId: detail.questionId,
  })),
);
const conLawLeadMeStepCount = conLawQuestionDetails.reduce(
  (sum, detail) => sum + detail.leadMeSteps.length,
  0,
);
const conLawDrillSeedCount = conLawQuestionDetails.reduce(
  (sum, detail) => sum + detail.drillSeeds.length,
  0,
);
const conLawAnswerFlowStepCount = conLawQuestionDetails.reduce(
  (sum, detail) => sum + detail.answerFlow.length,
  0,
);

export const metadata: Metadata = {
  title: "ConLaw-Pilot-01 - Jesuslovesyou BarMatrix",
  description:
    "ConLaw-Pilot-01 seed surface for the Jesuslovesyou BarMatrix V6 rebuild.",
  alternates: {
    canonical: "/Jesuslovesyou/conlaw-pilot-01",
  },
};

export default function ConLawPilotPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">CONLAW-PILOT-01</span>
            <span className="stamp">{conLawPilot.seedCount} SEED QUESTIONS</span>
            <span className="stamp">IMPLEMENTED SEED ROUTES</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; ACTOR / SOURCE / RIGHTS GATE
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            Con Law is the second factory test.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            This pilot tests actor, source, posture, forum, and tier gates using
            the same route and seed-detail workflow proven by the Evidence
            pilot.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/seeds`}
              className="btn btn-lg red"
            >
              Open seed candidates <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/qa-report`}
              className="btn btn-lg ghost"
            >
              Open QA report <span className="arrow">-&gt;</span>
            </Link>
            <Link href={JESUSLOVESYOU_ROUTE_PREFIX} className="btn btn-lg ghost">
              Back to Jesuslovesyou <span className="arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Keys + LeadMe Inventory</span>
          </div>
          <div
            className="info-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {[
              ["Case studies", conLawQuestionDetails.length],
              ["Reusable keys", conLawKeys.length],
              ["LeadMe steps", conLawLeadMeStepCount],
              ["Drill seeds", conLawDrillSeedCount],
              ["Answer-flow steps", conLawAnswerFlowStepCount],
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 16,
            }}
          >
            {conLawKeys.slice(0, 6).map((keyItem) => (
              <article
                className="info-panel"
                key={`${keyItem.questionId}-${keyItem.id}`}
              >
                <p className="mono" style={{ margin: "0 0 10px", fontSize: 12 }}>
                  {keyItem.kind} / Q{keyItem.questionId}
                </p>
                <h2 className="serif" style={{ fontSize: 24, margin: "0 0 10px" }}>
                  {keyItem.id}
                </h2>
                <p style={{ margin: "0 0 14px", lineHeight: 1.55 }}>
                  {keyItem.body}
                </p>
                <Link
                  href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/seeds/${keyItem.questionId}`}
                  className="btn ghost"
                >
                  Open case study <span className="arrow">-&gt;</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Gate Sequence</span>
          </div>
          <div
            className="info-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {conLawPilot.gates.map((gate, index) => (
              <div
                key={gate}
                style={{
                  borderLeft: "3px solid var(--red)",
                  paddingLeft: 14,
                }}
              >
                <p className="mono" style={{ fontSize: 12, margin: "0 0 6px" }}>
                  GATE {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>
                  {gate}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Outline Selectors</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {conLawPilot.codes.map((code) => (
              <article className="info-panel" key={code.code}>
                <p className="mono" style={{ margin: "0 0 10px", fontSize: 12 }}>
                  {code.code}
                </p>
                <h2 className="serif" style={{ fontSize: 24, margin: "0 0 10px" }}>
                  {code.role}
                </h2>
                <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                  {code.lesson}
                </p>
                <div style={{ marginTop: 18 }}>
                  <Link
                    href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/${code.code}`}
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
    </>
  );
}
