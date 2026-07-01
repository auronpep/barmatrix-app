import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  evidencePilotCodeParams,
  getEvidencePilotCode,
} from "@/lib/jesuslovesyou/pilot-data";

interface EvidenceCodePageProps {
  params: Promise<{
    code: string;
  }>;
}

export function generateStaticParams() {
  return evidencePilotCodeParams;
}

export async function generateMetadata({
  params,
}: EvidenceCodePageProps): Promise<Metadata> {
  const { code } = await params;
  const pilotCode = getEvidencePilotCode(code);
  if (!pilotCode) {
    return {};
  }

  return {
    title: `${pilotCode.code} - Evidence Pilot Outline Node`,
    description: `${pilotCode.role} for Evidence-Pilot-01.`,
    alternates: {
      canonical: `/Jesuslovesyou/evidence-pilot-01/${pilotCode.code}`,
    },
  };
}

export default async function EvidenceCodePage({ params }: EvidenceCodePageProps) {
  const { code } = await params;
  const pilotCode = getEvidencePilotCode(code);
  if (!pilotCode) {
    notFound();
  }

  const pathParts = pilotCode.node.split(" > ");

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">EVIDENCE-PILOT-01</span>
            <span className="stamp">{pilotCode.code}</span>
            <span className="stamp">OUTLINE NODE</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            &#x258C; {pilotCode.role.toUpperCase()}
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            {pathParts.at(-1)}
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: "70ch" }}>
            {pilotCode.lesson}
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
            <span className="label">&#x258C; Atlas Node</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 24,
            }}
          >
            <article className="info-panel">
              <div className="eyebrow-strong" style={{ marginBottom: 14 }}>
                NODE PATH
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {pathParts.map((part, index) => (
                  <p
                    key={`${part}-${index}`}
                    style={{
                      borderTop: index === 0 ? 0 : "1px solid var(--rule-soft)",
                      margin: 0,
                      paddingTop: index === 0 ? 0 : 10,
                    }}
                  >
                    <span className="mono" style={{ color: "var(--red)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>{" "}
                    {part}
                  </p>
                ))}
              </div>
            </article>

            <article className="info-panel">
              <div className="eyebrow-strong" style={{ marginBottom: 14 }}>
                TRAP KEY SEED
              </div>
              <h2 className="serif" style={{ fontSize: 28, margin: "0 0 12px" }}>
                What this page must catch
              </h2>
              <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                {pilotCode.trap}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">&#x258C; Required Question Row Locks</span>
          </div>
          <div
            className="info-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              "source_outline_code",
              "recommended_outline_code",
              "recode_status",
              "recode_reason",
              "red_axis",
              "purple_array_profile",
              "blue_by_choice",
              "leadme_next_step",
            ].map((field) => (
              <p
                className="mono"
                key={field}
                style={{
                  borderLeft: "3px solid var(--red)",
                  margin: 0,
                  paddingLeft: 12,
                }}
              >
                {field}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
