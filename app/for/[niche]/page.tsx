import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HERO, PRICING } from "@/lib/copy";
import { NICHE_PAGES, getNichePage, type HeadlineSegment } from "@/lib/niche-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return NICHE_PAGES.map((p) => ({ niche: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string }>;
}): Promise<Metadata> {
  const { niche } = await params;
  const page = getNichePage(niche);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/for/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/for/${page.slug}`,
    },
  };
}

function Headline({ segments }: { segments: HeadlineSegment[] }) {
  return (
    <>
      {segments.map((s, i) => {
        if (s.style === "italic")
          return (
            <span key={i} style={{ fontStyle: "italic" }}>
              {s.text}
            </span>
          );
        if (s.style === "red")
          return (
            <span key={i} style={{ color: "var(--red)" }}>
              {s.text}
            </span>
          );
        return <span key={i}>{s.text}</span>;
      })}
    </>
  );
}

export default async function NicheLandingPage({
  params,
}: {
  params: Promise<{ niche: string }>;
}) {
  const { niche } = await params;
  const page = getNichePage(niche);
  if (!page) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            {page.stamps.map((s) => (
              <span className="stamp" key={s}>
                {s}
              </span>
            ))}
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            {page.eyebrow}
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "24ch" }}
          >
            <Headline segments={page.headline} />
          </h1>
          <p className="body-lg" style={{ marginBottom: 32 }}>
            {page.subhead}
          </p>
          <div className="hero-actions">
            <Link href="/diagnostic" className="btn btn-lg red">
              {HERO.primaryCta.label} <span className="arrow">→</span>
            </Link>
            <Link href="/how-it-works" className="btn btn-lg ghost">
              {HERO.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PAIN POINTS ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">{page.painLabel}</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <h2 className="display display-lg" style={{ margin: "0 0 24px" }}>
                <Headline segments={page.painHeadline} />
              </h2>
              <p className="body-lg">{page.painBody}</p>
            </div>
            <div style={{ borderLeft: "1px solid var(--rule)", paddingLeft: 48 }}>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                {page.painPoints.map(([a, b], i) => (
                  <li
                    key={a}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr 1fr",
                      gap: 16,
                      borderTop: "1px solid var(--rule-soft)",
                      paddingTop: 14,
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--red)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span className="serif" style={{ fontSize: 17, fontWeight: 500 }}>
                      You {a}
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        color: "var(--muted)",
                        fontStyle: "italic",
                      }}
                    >
                      {b}.
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT FITS ============ */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">{page.fitLabel}</span>
          </div>
          <h2
            className="display display-lg"
            style={{ margin: "0 0 56px", maxWidth: "22ch" }}
          >
            <Headline segments={page.fitHeadline} />
          </h2>
          <div className="four-col">
            {page.fitSteps.map((s) => (
              <div className="method-step" key={s.title}>
                <div className="num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DIAGNOSTIC CTA ============ */}
      <section
        className="section"
        style={{ background: "var(--ink)", color: "var(--bg)" }}
      >
        <div className="container">
          <div className="two-col" style={{ alignItems: "center" }}>
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 24 }}>
                ▌ START HERE
              </div>
              <h2
                className="display display-lg"
                style={{ color: "white", margin: "0 0 24px" }}
              >
                <Headline segments={page.diagnosticHeadline} />
              </h2>
              <p
                style={{
                  fontSize: 19,
                  color: "#c8c4ba",
                  lineHeight: 1.5,
                  marginBottom: 32,
                  maxWidth: "40ch",
                }}
              >
                {page.diagnosticBody}
              </p>
              <Link href="/diagnostic" className="btn btn-lg red">
                Start the Diagnostic <span className="arrow">→</span>
              </Link>
              <p
                className="mono"
                style={{
                  marginTop: 24,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "var(--muted-light)",
                  textTransform: "uppercase",
                }}
              >
                {HERO.flagshipLine}
              </p>
            </div>
            <div>
              <div style={{ border: "1px solid #c8c4ba", padding: 32 }}>
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "var(--red)",
                    marginBottom: 24,
                  }}
                >
                  ▌ WHAT YOU GET — FREE
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {page.diagnosticBullets.map((t, i, arr) => (
                    <li
                      key={t}
                      style={{
                        padding: "14px 0",
                        borderBottom:
                          i < arr.length - 1
                            ? "1px solid rgba(255,255,255,0.15)"
                            : "none",
                        fontSize: 15,
                        display: "grid",
                        gridTemplateColumns: "24px 1fr",
                        gap: 12,
                        color: "white",
                      }}
                    >
                      <span className="mono" style={{ color: "var(--red)" }}>
                        →
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NICHE FAQ ============ */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Common Questions · 03</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <h2 className="display display-md" style={{ margin: 0 }}>
              Asked by examinees{" "}
              <span style={{ fontStyle: "italic" }}>like you.</span>
            </h2>
            <div>
              {page.faq.map((f) => (
                <div
                  key={f.q}
                  style={{
                    borderTop: "1px solid var(--rule)",
                    padding: "20px 0",
                  }}
                >
                  <h3
                    className="serif"
                    style={{ fontSize: 19, fontWeight: 600, margin: "0 0 10px" }}
                  >
                    {f.q}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--muted)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {f.a}
                  </p>
                </div>
              ))}
              <div style={{ marginTop: 24 }}>
                <Link href="/faq" className="btn ghost">
                  Full FAQ <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FLAGSHIP TEASE ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ The Flagship · 04</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 16 }}>
                ONE COHORT · JULY 2026
              </div>
              <h2 className="display display-md" style={{ margin: "0 0 24px" }}>
                {PRICING.flagshipName} —{" "}
                <span style={{ color: "var(--red)" }}>{PRICING.priceLabel}</span>
              </h2>
              <p className="body-lg">
                Full MBE trap-repair access for the July-cycle cohort.
                Multiple-choice only — designed to sit alongside your full bar
                course, not replace it.
              </p>
              <p
                className="mono"
                style={{
                  marginTop: 16,
                  fontSize: 13,
                  letterSpacing: "0.05em",
                  color: "var(--muted)",
                }}
              >
                {PRICING.paymentPlanLabel}.
              </p>
              <p
                className="mono"
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  letterSpacing: "0.05em",
                  color: "var(--muted)",
                }}
              >
                {PRICING.capacityLine}
              </p>
              <div
                style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <Link href="/pricing" className="btn red">
                  See the full flagship <span className="arrow">→</span>
                </Link>
                <Link href="/diagnostic" className="btn ghost">
                  Start free instead
                </Link>
              </div>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                borderTop: "2px solid var(--ink)",
              }}
            >
              {PRICING.includes.slice(0, 8).map((item) => (
                <li
                  key={item}
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid var(--rule-soft)",
                    fontSize: 15,
                    display: "grid",
                    gridTemplateColumns: "24px 1fr",
                    gap: 12,
                  }}
                >
                  <span className="mono" style={{ color: "var(--red)" }}>
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
