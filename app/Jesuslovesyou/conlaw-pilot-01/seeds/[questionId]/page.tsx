import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  getConLawPilotCode,
} from "@/lib/jesuslovesyou/pilot-data";
import {
  conLawSeedQuestionParams,
  getConLawSeedCandidate,
} from "@/lib/jesuslovesyou/conlaw-seed-candidates";

interface ConLawSeedQuestionPageProps {
  params: Promise<{
    questionId: string;
  }>;
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

export function generateStaticParams() {
  return conLawSeedQuestionParams;
}

export async function generateMetadata({
  params,
}: ConLawSeedQuestionPageProps): Promise<Metadata> {
  const { questionId } = await params;
  const seedCandidate = getConLawSeedCandidate(questionId);
  if (!seedCandidate) {
    return {};
  }

  return {
    title: `Q${seedCandidate.question_id} - Con Law Seed Review Row`,
    description: `ConLaw-Pilot-01 seed review row for Q${seedCandidate.question_id}.`,
    alternates: {
      canonical: `/Jesuslovesyou/conlaw-pilot-01/seeds/${seedCandidate.question_id}`,
    },
  };
}

export default async function ConLawSeedQuestionPage({
  params,
}: ConLawSeedQuestionPageProps) {
  const { questionId } = await params;
  const seedCandidate = getConLawSeedCandidate(questionId);
  if (!seedCandidate) {
    notFound();
  }

  const pilotCode = getConLawPilotCode(seedCandidate.selector_code);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">CONLAW-PILOT-01</span>
            <span className="stamp">Q{seedCandidate.question_id}</span>
            <span className="stamp">{label(seedCandidate.coverage_group)}</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; SEED REVIEW ROW
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            This Con Law candidate is queued for full case-study authoring.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            The row is addressable now so legal review, actor/source tagging,
            answer-flow authoring, LeadMe, and Outline Atlas linking can attach
            to a stable route.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/seeds`}
              className="btn btn-lg ghost"
            >
              Back to seed candidates <span className="arrow">-&gt;</span>
            </Link>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/${seedCandidate.selector_code}`}
              className="btn btn-lg ghost"
            >
              Open selector node <span className="arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Candidate Lock</span>
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
              ["Selector code", seedCandidate.selector_code],
              ["Selected code", seedCandidate.outline_code],
              ["Source code", seedCandidate.source_outline_code],
              ["Official key", seedCandidate.key ?? "-"],
              ["Selector match", label(seedCandidate.selector_match)],
              ["Review status", label(seedCandidate.review_status)],
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
            <span className="label">&#x258C; Next Authoring Locks</span>
          </div>
          <div
            className="info-panel"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: 16,
            }}
          >
            {[
              "verify source and transform",
              "lock actor/source posture",
              "lock clause or justiciability route",
              "write choice forensics",
              "author answer flow",
              "add LeadMe step",
            ].map((lock) => (
              <p
                className="mono"
                key={lock}
                style={{
                  borderLeft: "3px solid var(--red)",
                  margin: 0,
                  paddingLeft: 12,
                }}
              >
                {lock}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
