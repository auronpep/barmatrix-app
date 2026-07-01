import Link from "next/link";
import type { Metadata } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  firstDeliverables,
  lockedSemantics,
  pilotSubsets,
  pipelineSteps,
} from "@/lib/jesuslovesyou/pilot-data";
import {
  evidenceQuestionDetails,
  evidenceSeedCandidates,
} from "@/lib/jesuslovesyou/evidence-question-details";
import {
  conLawQuestionDetails,
} from "@/lib/jesuslovesyou/conlaw-question-details";
import {
  conLawSeedCandidates,
} from "@/lib/jesuslovesyou/conlaw-seed-candidates";

export const metadata: Metadata = {
  title: "Jesuslovesyou Pilot - BarMatrix V6 Rebuild",
  description:
    "The side-by-side BarMatrix V6 rebuild route for the Evidence and Constitutional Law pilot groups.",
  alternates: {
    canonical: "/Jesuslovesyou",
  },
};

export default function JesuslovesyouPilotPage() {
  const evidence = pilotSubsets[0];
  const conLaw = pilotSubsets[1];
  const totalDetails =
    evidenceQuestionDetails.length + conLawQuestionDetails.length;
  const totalSeeds = evidenceSeedCandidates.length + conLawSeedCandidates.length;

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">JESUSLOVESYOU ROUTE</span>
            <span className="stamp">V6 PILOT</span>
            <span className="stamp">{totalDetails} DETAIL PAGES</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; BARMATRIX CONTENT REBUILD
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "20ch" }}
          >
            Build the new BarMatrix factory beside the live site.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "68ch" }}>
            This route is the side-by-side implementation path for the new
            BarMatrix content system. The first group now has {totalDetails} of{" "}
            {totalSeeds} seed detail pages implemented locally across{" "}
            {evidence.id} and {conLaw.id}.
          </p>
          <div
            className="info-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 28,
              maxWidth: 760,
            }}
          >
            <div>
              <p className="mono" style={{ fontSize: 12, margin: "0 0 6px" }}>
                EVIDENCE
              </p>
              <h2 className="serif" style={{ fontSize: 30, margin: 0 }}>
                {evidenceQuestionDetails.length}/{evidenceSeedCandidates.length}
              </h2>
            </div>
            <div>
              <p className="mono" style={{ fontSize: 12, margin: "0 0 6px" }}>
                CON LAW
              </p>
              <h2 className="serif" style={{ fontSize: 30, margin: 0 }}>
                {conLawQuestionDetails.length}/{conLawSeedCandidates.length}
              </h2>
            </div>
            <div>
              <p className="mono" style={{ fontSize: 12, margin: "0 0 6px" }}>
                NEXT GATE
              </p>
              <h2 className="serif" style={{ fontSize: 30, margin: 0 }}>
                Keys + LeadMe
              </h2>
            </div>
          </div>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01`}
              className="btn btn-lg red"
            >
              Open Evidence pilot <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01`}
              className="btn btn-lg ghost"
            >
              Open Con Law pilot <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/checkout?lp=Jesuslovesyou&source=Jesuslovesyou`}
              className="btn btn-lg ghost"
            >
              Open prefixed checkout <span className="arrow">-&gt;</span>
            </Link>
            <Link href="#pilot-plan" className="btn btn-lg ghost">
              Review pilot plan <span className="arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="pilot-plan">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; First Test Case Group</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {pilotSubsets.map((pilot) => (
              <article className="info-panel" key={pilot.id}>
                <div className="eyebrow-strong" style={{ marginBottom: 12 }}>
                  {pilot.subject}
                </div>
                <h2
                  className="serif"
                  style={{
                    fontSize: 28,
                    lineHeight: 1.1,
                    margin: "0 0 12px",
                  }}
                >
                  {pilot.id}
                </h2>
                <p style={{ margin: "0 0 14px", color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  {pilot.name}
                </p>
                <p className="mono" style={{ fontSize: 12, margin: "0 0 18px" }}>
                  {pilot.status} / {pilot.seedCount} seed questions
                </p>
                <p style={{ margin: "0 0 18px", lineHeight: 1.6 }}>
                  {pilot.thesis}
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  {pilot.codes.map((code) => (
                    <div
                      key={code.code}
                      style={{
                        borderTop: "1px solid var(--rule-soft)",
                        paddingTop: 10,
                      }}
                    >
                      <strong className="mono" style={{ fontSize: 12 }}>
                        {code.code}
                      </strong>
                      <p style={{ margin: "4px 0 0", lineHeight: 1.45 }}>
                        {code.node}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "var(--muted)",
                          fontSize: 13,
                          lineHeight: 1.45,
                        }}
                      >
                        {code.role}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Pipeline Lock</span>
          </div>
          <div
            className="info-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {pipelineSteps.map((step, index) => (
              <div
                key={step}
                style={{
                  borderLeft: "3px solid var(--red)",
                  paddingLeft: 14,
                  minHeight: 74,
                }}
              >
                <p className="mono" style={{ fontSize: 12, margin: "0 0 6px" }}>
                  STEP {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>
                  {step}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Student-Facing Locks</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: 24,
            }}
          >
            <div className="info-panel">
              <div className="eyebrow-strong" style={{ marginBottom: 14 }}>
                EVIDENCE FIRST DELIVERABLES
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {firstDeliverables.map((deliverable) => (
                  <div
                    key={deliverable}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "baseline",
                      borderTop: "1px solid var(--rule-soft)",
                      paddingTop: 12,
                    }}
                  >
                    <span className="mono" style={{ color: "var(--red)" }}>
                      LOCK
                    </span>
                    <p style={{ margin: 0, lineHeight: 1.5 }}>{deliverable}</p>
                  </div>
                ))}
              </div>
            </div>
            <aside className="info-panel" aria-label="Color semantics">
              <div className="eyebrow-strong" style={{ marginBottom: 14 }}>
                COLOR SEMANTICS
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                {lockedSemantics.map((item) => (
                  <div key={item.label}>
                    <h2
                      className="serif"
                      style={{ fontSize: 24, margin: "0 0 6px" }}
                    >
                      {item.label}
                    </h2>
                    <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
