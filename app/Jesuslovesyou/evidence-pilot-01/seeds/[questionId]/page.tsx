import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  getEvidencePilotCode,
} from "@/lib/jesuslovesyou/pilot-data";
import {
  evidenceQuestionDetailParams,
  getEvidenceQuestionDetail,
} from "@/lib/jesuslovesyou/evidence-question-details";

interface EvidenceSeedQuestionPageProps {
  params: Promise<{
    questionId: string;
  }>;
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

export function generateStaticParams() {
  return evidenceQuestionDetailParams;
}

export async function generateMetadata({
  params,
}: EvidenceSeedQuestionPageProps): Promise<Metadata> {
  const { questionId } = await params;
  const detail = getEvidenceQuestionDetail(questionId);
  if (!detail) {
    return {};
  }

  return {
    title: `Q${detail.questionId} - ${detail.title}`,
    description: `${detail.title} answer-flow candidate for Evidence-Pilot-01.`,
    alternates: {
      canonical: `/Jesuslovesyou/evidence-pilot-01/seeds/${detail.questionId}`,
    },
  };
}

export default async function EvidenceSeedQuestionPage({
  params,
}: EvidenceSeedQuestionPageProps) {
  const { questionId } = await params;
  const detail = getEvidenceQuestionDetail(questionId);
  if (!detail) {
    notFound();
  }

  const pilotCode = getEvidencePilotCode(detail.outlineCode);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">EVIDENCE-PILOT-01</span>
            <span className="stamp">Q{detail.questionId}</span>
            <span className="stamp">{label(detail.seedBucket)}</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; {detail.transformId}
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            {detail.title}
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            {detail.distilledCoreQuestion}
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/seeds`}
              className="btn btn-lg ghost"
            >
              Back to seed candidates <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/${detail.outlineCode}`}
              className="btn btn-lg ghost"
            >
              Open outline node <span className="arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Recode Lock</span>
          </div>
          <div
            className="info-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            {[
              ["Recommended code", detail.outlineCode],
              ["Source code", detail.sourceOutlineCode],
              ["Official key", detail.key],
              ["Review status", label(detail.reviewStatus)],
            ].map(([name, value]) => (
              <div key={name}>
                <p className="mono" style={{ margin: "0 0 8px", fontSize: 12 }}>
                  {name}
                </p>
                <p className="serif" style={{ margin: 0, fontSize: 26 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          {pilotCode ? (
            <p style={{ marginTop: 16, color: "var(--ink-soft)", lineHeight: 1.6 }}>
              {pilotCode.node}
            </p>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Stem + Answer Flow</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: 24,
            }}
          >
            <article className="info-panel">
              <h2 className="serif" style={{ fontSize: 30, margin: "0 0 14px" }}>
                Revised stem
              </h2>
              <p style={{ margin: 0, lineHeight: 1.65 }}>{detail.stem}</p>
            </article>
            <article className="info-panel">
              <h2 className="serif" style={{ fontSize: 30, margin: "0 0 14px" }}>
                Answer flow
              </h2>
              {detail.answerFlow.map((step, index) => (
                <p
                  key={step}
                  style={{
                    borderTop: index === 0 ? 0 : "1px solid var(--rule-soft)",
                    margin: 0,
                    paddingTop: index === 0 ? 0 : 12,
                    lineHeight: 1.55,
                  }}
                >
                  <span className="mono" style={{ color: "var(--red)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>{" "}
                  {step}
                </p>
              ))}
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Choice Decode</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: 16,
            }}
          >
            {detail.choices.map((choice) => (
              <article className="info-panel" key={choice.letter}>
                <p className="mono" style={{ margin: "0 0 10px", fontSize: 12 }}>
                  {choice.letter} / {choice.verdict}
                </p>
                <h2 className="serif" style={{ fontSize: 24, margin: "0 0 10px" }}>
                  {choice.mold}
                </h2>
                <p style={{ margin: "0 0 12px", lineHeight: 1.55 }}>
                  {choice.text}
                </p>
                <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                  {choice.explanation}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Color Locks + Keys</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 24,
            }}
          >
            <article className="info-panel">
              <h2 className="serif" style={{ fontSize: 30, margin: "0 0 14px" }}>
                C3 locks
              </h2>
              {detail.locks.map((lock) => (
                <p
                  key={lock.label}
                  style={{
                    borderTop: "1px solid var(--rule-soft)",
                    margin: 0,
                    paddingTop: 12,
                    lineHeight: 1.55,
                  }}
                >
                  <strong>{lock.label}:</strong> {lock.body}
                </p>
              ))}
            </article>
            <article className="info-panel">
              <h2 className="serif" style={{ fontSize: 30, margin: "0 0 14px" }}>
                Reusable keys
              </h2>
              {detail.keys.map((keyItem) => (
                <p
                  key={keyItem.id}
                  style={{
                    borderTop: "1px solid var(--rule-soft)",
                    margin: 0,
                    paddingTop: 12,
                    lineHeight: 1.55,
                  }}
                >
                  <span className="mono" style={{ color: "var(--red)" }}>
                    {keyItem.kind} / {keyItem.id}
                  </span>
                  <br />
                  {keyItem.body}
                </p>
              ))}
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; LeadMe + Drills</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 24,
            }}
          >
            <article className="info-panel">
              <h2 className="serif" style={{ fontSize: 30, margin: "0 0 14px" }}>
                LeadMe steps
              </h2>
              {detail.leadMeSteps.map((step, index) => (
                <p
                  key={step}
                  style={{
                    borderTop: index === 0 ? 0 : "1px solid var(--rule-soft)",
                    margin: 0,
                    paddingTop: index === 0 ? 0 : 12,
                  }}
                >
                  <span className="mono" style={{ color: "var(--red)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>{" "}
                  {step}
                </p>
              ))}
            </article>
            <article className="info-panel">
              <h2 className="serif" style={{ fontSize: 30, margin: "0 0 14px" }}>
                Drill seeds
              </h2>
              {detail.drillSeeds.map((drill) => (
                <div
                  key={drill.title}
                  style={{
                    borderTop: "1px solid var(--rule-soft)",
                    paddingTop: 12,
                  }}
                >
                  <p className="mono" style={{ margin: "0 0 8px" }}>
                    {drill.title}
                  </p>
                  <p style={{ margin: "0 0 8px", lineHeight: 1.55 }}>
                    {drill.prompt}
                  </p>
                  <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                    {drill.answer}
                  </p>
                </div>
              ))}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
