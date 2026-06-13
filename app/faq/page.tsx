import Link from "next/link";
import { FAQ, DISCLAIMER, PRICING } from "@/lib/copy";

export const metadata = {
  title: "FAQ — BarMatrix",
  description:
    "Frequently asked questions about BarMatrix Flagship: pricing, cohort access, course companion use, and what the multiple-choice-only MBE repair system covers.",
  alternates: { canonical: "/faq" },
};

// Quick-answer cards surfaced above the full list. These restate the locked FAQ
// answers (source of truth: lib/copy.ts / SRC-0029) — no new claims introduced.
const QUICK_ANSWERS = [
  {
    k: "Price",
    label: "What does it cost?",
    value: PRICING.priceLabel,
    detail: PRICING.paymentPlanLabel,
  },
  {
    k: "Scope",
    label: "Is this a full bar course?",
    value: "MCQ-only",
    detail: "Built to complement a full bar course, not replace it.",
  },
  {
    k: "Access",
    label: "How does enrollment work?",
    value: "One cohort",
    detail: "Enrollment is open for the July-cycle guided repair program.",
  },
] as const;

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">FAQ · LOCKED COPY</span>
            <span className="stamp">{FAQ.length} ANSWERS</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ FREQUENTLY ASKED
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "20ch" }}
          >
            The short answers,{" "}
            <span style={{ fontStyle: "italic" }}>plainly stated.</span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            What BarMatrix is, what it costs, and what it does not try to be.
            Don&apos;t see your question?{" "}
            <Link
              href="mailto:support@barmatrix.app"
              style={{ borderBottom: "1px solid var(--ink)", paddingBottom: 1 }}
            >
              Email support
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Quick-answer strip */}
      <section className="section-tight">
        <div className="container">
          <div className="three-col">
            {QUICK_ANSWERS.map((item) => (
              <div className="info-panel" key={item.k}>
                <div className="eyebrow-red" style={{ marginBottom: 10 }}>
                  ▸ {item.k}
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--muted)",
                    marginBottom: 8,
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    margin: "0 0 10px",
                  }}
                >
                  {item.value}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "var(--ink-soft)",
                    margin: 0,
                  }}
                >
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full FAQ list */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Every Question</span>
          </div>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            {FAQ.map((item) => (
              <details key={item.q} className="faq-item">
                <summary className="q">
                  <h2>{item.q}</h2>
                  <span className="toggle">+</span>
                </summary>
                <div className="a">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* What it is / is not — clarity pair */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Scope, In One Glance</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div className="info-panel">
              <div className="eyebrow-strong" style={{ marginBottom: 16 }}>
                ▸ WHAT BARMATRIX IS
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: 15,
                  color: "var(--ink-soft)",
                  lineHeight: 1.55,
                }}
              >
                {[
                  "A diagnostic, multiple-choice MBE repair system",
                  "Wrong Answer Forensics on every miss",
                  "A Red-Zone Map of where your points leak",
                  "Targeted drills assigned to the trap you keep hitting",
                ].map((t) => (
                  <li
                    key={t}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid var(--rule-soft)",
                      display: "flex",
                      gap: 12,
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      className="mono"
                      style={{ color: "var(--red)", fontWeight: 600 }}
                    >
                      →
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="info-panel">
              <div
                className="eyebrow"
                style={{ marginBottom: 16, color: "var(--ink)" }}
              >
                ▸ WHAT IT IS NOT
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: 15,
                  color: "var(--ink-soft)",
                  lineHeight: 1.55,
                }}
              >
                {[
                  "A full bar review course",
                  "Essay or performance-test prep",
                  "Official NCBE material",
                  "A guarantee of any exam outcome",
                ].map((t) => (
                  <li
                    key={t}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid var(--rule-soft)",
                      display: "flex",
                      gap: 12,
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      className="mono"
                      style={{ color: "var(--muted-light)" }}
                    >
                      ×
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Still have questions — CTA band */}
      <section
        className="section"
        style={{ background: "var(--ink)", color: "var(--bg)" }}
      >
        <div className="container center">
          <div
            className="eyebrow-red"
            style={{ marginBottom: 24, justifyContent: "center" }}
          >
            ▌ STILL DECIDING?
          </div>
          <h2
            className="display display-md"
            style={{ color: "white", margin: "0 auto 20px", maxWidth: "22ch" }}
          >
            See the method on your own misses first.
          </h2>
          <p
            className="body-lg"
            style={{
              color: "var(--muted-light)",
              margin: "0 auto 32px",
              maxWidth: "52ch",
            }}
          >
            The Free MBE Trap Diagnostic builds your Red-Zone Map and shows you
            exactly the kind of feedback Flagship gives on every question. No
            card, no commitment.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/diagnostic" className="btn btn-lg red">
              Take the Free Diagnostic <span className="arrow">→</span>
            </Link>
            <Link
              href="/how-it-works"
              className="btn btn-lg ghost"
              style={{ color: "white", borderColor: "white" }}
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section alt">
        <div className="container">
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div className="eyebrow-strong" style={{ marginBottom: 16 }}>
              ▌ IMPORTANT
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--ink-soft)",
                margin: 0,
                maxWidth: "80ch",
              }}
            >
              {DISCLAIMER}
            </p>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
