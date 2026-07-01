import Link from "next/link";
import type { Metadata } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  pilotSubsets,
} from "@/lib/jesuslovesyou/pilot-data";
import { conLawSeedCandidates } from "@/lib/jesuslovesyou/conlaw-seed-candidates";

const conLawPilot = pilotSubsets[1];

function label(value: string) {
  return value.replaceAll("_", " ");
}

function countBy(field: "coverage_group" | "seed_bucket" | "selector_match") {
  const counts = new Map<string, number>();
  conLawSeedCandidates.forEach((candidate) => {
    counts.set(candidate[field], (counts.get(candidate[field]) ?? 0) + 1);
  });
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}

const transformedCount = conLawSeedCandidates.filter(
  (candidate) => candidate.has_finished_transform,
).length;
const childCodeCount = conLawSeedCandidates.filter(
  (candidate) => candidate.selector_match === "child_code",
).length;

export const metadata: Metadata = {
  title: "Con Law Seed Candidates - Jesuslovesyou BarMatrix",
  description:
    "The 30 candidate seed rows for ConLaw-Pilot-01 under the Jesuslovesyou BarMatrix rebuild.",
  alternates: {
    canonical: "/Jesuslovesyou/conlaw-pilot-01/seeds",
  },
};

export default function ConLawSeedCandidatesPage() {
  const groupedCodes = conLawPilot.codes.map((code) => ({
    ...code,
    candidates: conLawSeedCandidates.filter(
      (candidate) => candidate.selector_code === code.code,
    ),
  }));

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">CONLAW-PILOT-01</span>
            <span className="stamp">{conLawSeedCandidates.length} SEED CANDIDATES</span>
            <span className="stamp">HUMAN REVIEW REQUIRED</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; GOLDEN SET CANDIDATE QUEUE
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            The Con Law pilot now has real candidate rows.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            These 30 rows come from the verified local inventory. They are ready
            for legal review, actor/source tagging, answer-flow generation,
            LeadMe cards, and Outline Atlas linking.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link
              href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01`}
              className="btn btn-lg ghost"
            >
              Back to Con Law pilot <span className="arrow">-&gt;</span>
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
              ["Total candidates", conLawSeedCandidates.length],
              ["With transformed CQ", transformedCount],
              ["Child-code rows", childCodeCount],
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
            {[
              ["Coverage groups", countBy("coverage_group")],
              ["Seed buckets", countBy("seed_bucket")],
              ["Selector match", countBy("selector_match")],
            ].map(([title, rows]) => (
              <article className="info-panel" key={title as string}>
                <h2 className="serif" style={{ fontSize: 28, margin: "0 0 16px" }}>
                  {title as string}
                </h2>
                {(rows as [string, number][]).map(([group, count]) => (
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
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Five Candidates Per Selector</span>
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
                    href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/${code.code}`}
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
                      key={`${candidate.selector_code}-${candidate.question_id}`}
                      style={{
                        borderTop: "1px solid var(--rule-soft)",
                        paddingTop: 12,
                      }}
                    >
                      <p className="mono" style={{ margin: "0 0 8px" }}>
                        Q{candidate.question_id} / key {candidate.key ?? "-"}
                      </p>
                      <p style={{ margin: "0 0 8px", lineHeight: 1.55 }}>
                        {label(candidate.coverage_group)}
                      </p>
                      <p
                        style={{
                          color:
                            candidate.selector_match === "exact"
                              ? "var(--ink-soft)"
                              : "var(--red-deep)",
                          margin: 0,
                          lineHeight: 1.55,
                        }}
                      >
                        selected {candidate.outline_code} / {label(candidate.selector_match)}
                      </p>
                      <div style={{ marginTop: 12 }}>
                        <Link
                          href={`${JESUSLOVESYOU_ROUTE_PREFIX}/conlaw-pilot-01/seeds/${candidate.question_id}`}
                          className="btn ghost"
                        >
                          Open review row <span className="arrow">-&gt;</span>
                        </Link>
                      </div>
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
