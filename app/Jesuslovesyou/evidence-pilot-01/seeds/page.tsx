import Link from "next/link";
import type { Metadata } from "next";
import rawSeedCandidates from "@/lib/jesuslovesyou/evidence-seed-candidates.json";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  pilotSubsets,
} from "@/lib/jesuslovesyou/pilot-data";
import { hasEvidenceQuestionDetail } from "@/lib/jesuslovesyou/evidence-question-details";

type EvidenceSeedCandidate = {
  question_id: string;
  outline_code: string;
  source_outline_code: string;
  coverage_group: string;
  seed_bucket: string;
  correct_percent: string | null;
  key: string | null;
  has_finished_transform: boolean;
  review_status: string;
};

const seedCandidates = rawSeedCandidates as EvidenceSeedCandidate[];
const evidencePilot = pilotSubsets[0];

function label(value: string) {
  return value.replaceAll("_", " ");
}

function countBy(field: "coverage_group" | "seed_bucket") {
  const counts = new Map<string, number>();
  seedCandidates.forEach((candidate) => {
    counts.set(candidate[field], (counts.get(candidate[field]) ?? 0) + 1);
  });
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}

const transformedCount = seedCandidates.filter(
  (candidate) => candidate.has_finished_transform,
).length;
const recodeCount = seedCandidates.filter(
  (candidate) => candidate.seed_bucket === "recode_or_ambiguous",
).length;

export const metadata: Metadata = {
  title: "Evidence Seed Candidates - Jesuslovesyou BarMatrix",
  description:
    "The 50 candidate seed rows for Evidence-Pilot-01 under the Jesuslovesyou BarMatrix rebuild.",
  alternates: {
    canonical: "/Jesuslovesyou/evidence-pilot-01/seeds",
  },
};

export default function EvidenceSeedCandidatesPage() {
  const groupedCodes = evidencePilot.codes.map((code) => ({
    ...code,
    candidates: seedCandidates.filter(
      (candidate) => candidate.outline_code === code.code,
    ),
  }));

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">EVIDENCE-PILOT-01</span>
            <span className="stamp">{seedCandidates.length} SEED CANDIDATES</span>
            <span className="stamp">HUMAN REVIEW REQUIRED</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; GOLDEN SET CANDIDATE QUEUE
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            The Evidence pilot now has real candidate rows.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            These 50 rows come from the verified local inventory. They are ready
            for legal review, C3 tagging, answer-page generation, LeadMe cards,
            and Outline Atlas linking.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01`}
              className="btn btn-lg ghost"
            >
              Back to Evidence pilot <span className="arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Review Queue Counts</span>
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
              ["Total candidates", seedCandidates.length],
              ["With transformed CQ", transformedCount],
              ["Recode or ambiguous", recodeCount],
            ].map(([name, value]) => (
              <div key={name}>
                <p className="mono" style={{ margin: "0 0 8px", fontSize: 12 }}>
                  {name}
                </p>
                <p className="display" style={{ margin: 0, fontSize: 44 }}>
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
            <span className="label">&#x258C; Coverage + Buckets</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 24,
            }}
          >
            <article className="info-panel">
              <h2 className="serif" style={{ fontSize: 28, margin: "0 0 16px" }}>
                Coverage groups
              </h2>
              {countBy("coverage_group").map(([group, count]) => (
                <p
                  key={group}
                  style={{
                    borderTop: "1px solid var(--rule-soft)",
                    margin: 0,
                    paddingTop: 12,
                  }}
                >
                  <span className="mono" style={{ color: "var(--red)" }}>
                    {String(count).padStart(2, "0")}
                  </span>{" "}
                  {label(group)}
                </p>
              ))}
            </article>

            <article className="info-panel">
              <h2 className="serif" style={{ fontSize: 28, margin: "0 0 16px" }}>
                Seed buckets
              </h2>
              {countBy("seed_bucket").map(([bucket, count]) => (
                <p
                  key={bucket}
                  style={{
                    borderTop: "1px solid var(--rule-soft)",
                    margin: 0,
                    paddingTop: 12,
                  }}
                >
                  <span className="mono" style={{ color: "var(--red)" }}>
                    {String(count).padStart(2, "0")}
                  </span>{" "}
                  {label(bucket)}
                </p>
              ))}
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Five Candidates Per Code</span>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {groupedCodes.map((code) => (
              <article className="info-panel" key={code.code}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <p className="mono" style={{ margin: "0 0 8px", fontSize: 12 }}>
                      {code.code}
                    </p>
                    <h2 className="serif" style={{ fontSize: 28, margin: 0 }}>
                      {code.role}
                    </h2>
                  </div>
                  <Link
                    href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/${code.code}`}
                    className="btn ghost"
                  >
                    Open node <span className="arrow">-&gt;</span>
                  </Link>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                    gap: 12,
                  }}
                >
                  {code.candidates.map((candidate) => (
                    <div
                      key={`${candidate.outline_code}-${candidate.question_id}`}
                      style={{
                        borderTop: "1px solid var(--rule-soft)",
                        paddingTop: 12,
                      }}
                    >
                      <p className="mono" style={{ margin: "0 0 8px" }}>
                        Q{candidate.question_id} / key {candidate.key ?? "-"}
                      </p>
                      <p style={{ margin: "0 0 8px", lineHeight: 1.55 }}>
                        {label(candidate.seed_bucket)}
                      </p>
                      <p
                        style={{
                          color:
                            candidate.source_outline_code === candidate.outline_code
                              ? "var(--ink-soft)"
                              : "var(--red-deep)",
                          margin: 0,
                          lineHeight: 1.55,
                        }}
                      >
                        source {candidate.source_outline_code} / correct{" "}
                        {candidate.correct_percent || "n/a"}
                        {candidate.correct_percent ? "%" : ""}
                      </p>
                      {hasEvidenceQuestionDetail(candidate.question_id) ? (
                        <div style={{ marginTop: 12 }}>
                          <Link
                            href={`${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/seeds/${candidate.question_id}`}
                            className="btn ghost"
                          >
                            Open case study <span className="arrow">-&gt;</span>
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
