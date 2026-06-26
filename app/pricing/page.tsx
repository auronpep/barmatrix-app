import Link from "next/link";
import { DISCLAIMER, FAQ, PRICING } from "@/lib/copy";
import { PricingAnalytics } from "./pricing-analytics";

const included = [
  "Free MBE Trap Diagnostic",
  "Red-Zone Map",
  "Wrong Answer Forensics",
  "Guided repair question work",
  "Targeted Red-Zone Drills",
  "Boot camps",
  "Timed mixed sets",
  "Pattern Mastery Board",
] as const;

const methodRows = [
  {
    title: "Diagnose first",
    body: "Take the free diagnostic before buying. The result is a Red-Zone Map built from your own misses.",
  },
  {
    title: "Repair the pattern",
    body: "Flagship turns the highest-priority miss pattern into guided repair work, drills, and focused review.",
  },
  {
    title: "Keep one next task visible",
    body: "The product stays narrow: one repair priority, one assigned task, and fewer resource-browsing decisions.",
  },
] as const;

const fitRows = [
  "You are using a full course and need MBE repair alongside it.",
  "You keep narrowing to two answers and choosing the attractive trap.",
  "You want the diagnostic to prove the method before checkout.",
] as const;

const notRows = [
  "Not a full bar review course",
  "Not essay or performance-test prep",
  "Not official bar material",
  "Not a score or outcome guarantee",
] as const;

export const metadata = {
  title: "Pricing - BarMatrix Flagship $999",
  description:
    "BarMatrix Flagship is $999 with a payment plan of $500 today and $499 in 30 days. Start with the free diagnostic before checkout.",
};

export default function PricingPage() {
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
          <div
            className="two-col"
            style={{ alignItems: "center", gap: 48 }}
          >
            <div>
              <h1
                className="display display-lg"
                style={{ margin: "0 0 24px", maxWidth: "14ch" }}
              >
                Choose the repair path after the diagnostic proves the gap.
              </h1>
              <p className="body-lg" style={{ marginBottom: 0 }}>
                Flagship is {PRICING.priceLabel}, or $500 today + $499 in 30
                days. Start with the free diagnostic, then enroll when the
                Red-Zone Map makes the repair path clear.
              </p>
              <div className="hero-actions" style={{ marginTop: 32 }}>
                <Link href="/diagnostic" className="btn btn-lg red">
                  Start free diagnostic <span className="arrow">-&gt;</span>
                </Link>
                <Link href="/checkout" className="btn btn-lg ghost">
                  Enroll in Flagship
                </Link>
              </div>
            </div>

            <aside className="price-card flagship" aria-label="Pricing summary">
              <span className="ribbon">JULY 2026 COHORT</span>
              <h2 className="name">{PRICING.flagshipName}</h2>
              <p className="summary">
                One cohort. Multiple-choice-only MBE repair. Web access live
                now.
              </p>
              <div className="price">
                <span className="num">{PRICING.priceLabel}</span>
              </div>
              <div className="plan">or $500 today + $499 in 30 days</div>
              <Link
                href="/checkout"
                className="btn btn-lg red"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Open checkout <span className="arrow">-&gt;</span>
              </Link>
              <p
                style={{
                  color: "var(--muted-light)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: "18px 0 0",
                  textAlign: "center",
                }}
              >
                Checkout verifies enrollment status before payment.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pricing-proof-grid">
            <div>
              <h2
                className="display display-md"
                style={{ margin: "0 0 18px", maxWidth: "13ch" }}
              >
                Price comes after the Red-Zone Map.
              </h2>
              <p className="body-lg" style={{ margin: 0 }}>
                The diagnostic should tell you something real before the
                purchase decision. It names the red zones, the wrong-answer
                pull, and the first repair priority.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              {methodRows.map((row) => (
                <article
                  key={row.title}
                  className="info-panel"
                  style={{ background: "var(--paper)" }}
                >
                  <h3
                    className="serif"
                    style={{
                      fontSize: 26,
                      lineHeight: 1.05,
                      margin: "0 0 8px",
                    }}
                  >
                    {row.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--ink-soft)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {row.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <div className="price-card">
              <h2 className="name">Included in Flagship</h2>
              <p className="summary">
                The repair layer that sits beside your full bar course.
              </p>
              <ul>
                {included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/diagnostic" className="btn red">
                Start free diagnostic <span className="arrow">-&gt;</span>
              </Link>
            </div>

            <div className="pricing-fit-grid">
              <div className="info-panel">
                <h2
                  className="serif"
                  style={{ fontSize: 28, margin: "0 0 14px" }}
                >
                  Built for
                </h2>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gap: 14,
                    color: "var(--ink-soft)",
                    lineHeight: 1.5,
                  }}
                >
                  {fitRows.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="info-panel">
                <h2
                  className="serif"
                  style={{ fontSize: 28, margin: "0 0 14px" }}
                >
                  Not built as
                </h2>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gap: 14,
                    color: "var(--ink-soft)",
                    lineHeight: 1.5,
                  }}
                >
                  {notRows.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div
                className="info-panel"
                style={{
                  gridColumn: "1 / -1",
                  background: "var(--ink)",
                  color: "var(--bg)",
                }}
              >
                <h2
                  className="serif"
                  style={{ fontSize: 32, lineHeight: 1, margin: "0 0 12px" }}
                >
                  Try the diagnostic first.
                </h2>
                <p
                  style={{
                    color: "var(--muted-light)",
                    lineHeight: 1.55,
                    margin: "0 0 20px",
                  }}
                >
                  Take the diagnostic, read the Red-Zone Map, then decide
                  whether the full guided repair path is worth buying. No card. No commitment.
                </p>
                <Link href="/diagnostic" className="btn red">
                  Get my Red-Zone Map <span className="arrow">-&gt;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              className="display display-md center"
              style={{ margin: "0 0 28px" }}
            >
              Pricing questions
            </h2>
            {FAQ.map((item) => (
              <details key={item.q} className="faq-item">
                <summary className="q">
                  <h3>{item.q}</h3>
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
