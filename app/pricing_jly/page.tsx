import Link from "next/link";
import { DIAGNOSTIC_FIRST, PRICING, FAQ, DISCLAIMER } from "@/lib/copy";
import { PricingAnalytics } from "../pricing/pricing-analytics";

export const metadata = {
  title: "Pricing Archive - BarMatrix Flagship $999",
  description:
    "Archived BarMatrix Flagship pricing page kept available by direct link.",
  robots: { index: false, follow: false },
};

export default function PricingJlyPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <PricingAnalytics />
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">PRICING · ONE COHORT</span>
            <span className="stamp">CALIFORNIA · JULY 2026 CYCLE</span>
            <span className="stamp">EDITION : LAUNCH</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ BARMATRIX FLAGSHIP
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "20ch" }}
          >
            One price. <span style={{ fontStyle: "italic" }}>One cohort.</span>{" "}
            <span style={{ color: "var(--red)" }}>Full repair access.</span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            BarMatrix Flagship is a multiple-choice-only MBE repair system.
            Diagnostic, Red-Zone Map, guided repair question work, assigned
            drills, boot camps, timed sets, guided path, and full web access -
            all included.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <div className="price-card flagship">
              <span className="ribbon">JULY 2026 COHORT</span>
              <h2 className="name">{PRICING.flagshipName}</h2>
              <p className="summary">
                One cohort. Full MBE trap-repair access. Web access live now.
              </p>
              <div className="price">
                <span className="num">{PRICING.priceLabel}</span>
              </div>
              <div className="plan">{PRICING.paymentPlanLabel}</div>
              <ul>
                {PRICING.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                href="/checkout"
                className="btn btn-lg red"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Enroll in Flagship <span className="arrow">-&gt;</span>
              </Link>
              <p
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--muted-light)",
                  marginTop: 18,
                  textAlign: "center",
                }}
              >
                {PRICING.capacityLine}
              </p>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: 32 }}
            >
              <div className="info-panel">
                <div
                  className="eyebrow"
                  style={{ marginBottom: 12, color: "var(--ink)" }}
                >
                  ▸ ENROLLMENT POLICY
                </div>
                <h3
                  className="serif"
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    margin: "0 0 12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Checkout verifies availability before payment.
                </h3>
                <p
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: 15,
                    margin: 0,
                    lineHeight: 1.55,
                  }}
                >
                  Checkout verifies live enrollment status before payment. If
                  enrollment is ever paused, the checkout page will say so
                  before Stripe opens.
                </p>
              </div>

              <div
                className="info-panel"
                style={{ background: "var(--paper)" }}
              >
                <div
                  className="eyebrow-strong"
                  style={{ marginBottom: 12 }}
                >
                  ▸ START FREE
                </div>
                <h3
                  className="serif"
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    margin: "0 0 12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Try the diagnostic first.
                </h3>
                <p
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: 15,
                    margin: "0 0 20px",
                    lineHeight: 1.55,
                  }}
                >
                  Price comes after the Red-Zone Map.{" "}
                  The Free MBE Trap Diagnostic builds your Red-Zone Map,
                  names the trap pattern from your own answers, and shows the
                  same diagnostic-to-repair loop Flagship uses after
                  enrollment. No card. No commitment.
                </p>
                <Link href={DIAGNOSTIC_FIRST.cta.href} className="btn red">
                  {DIAGNOSTIC_FIRST.cta.label}{" "}
                  <span className="arrow">-&gt;</span>
                </Link>
              </div>

              <div className="info-panel">
                <div
                  className="eyebrow"
                  style={{ marginBottom: 12, color: "var(--ink)" }}
                >
                  ▸ WHAT FLAGSHIP IS NOT
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    fontSize: 14,
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
                        padding: "8px 0",
                        borderBottom: "1px solid var(--rule-soft)",
                      }}
                    >
                      <span
                        className="mono"
                        style={{
                          color: "var(--muted-light)",
                          marginRight: 12,
                        }}
                      >
                        x
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Frequently Asked</span>
          </div>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            {FAQ.map((item) => (
              <details key={item.q} className="faq-item">
                <summary className="q">
                  <h4>{item.q}</h4>
                  <span className="toggle">+</span>
                </summary>
                <div className="a">{item.a}</div>
              </details>
            ))}
            <p
              style={{
                marginTop: 32,
                fontSize: 12,
                lineHeight: 1.6,
                color: "var(--muted)",
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
