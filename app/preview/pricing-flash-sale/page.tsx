import Link from "next/link";
import { DISCLAIMER, PRICING } from "@/lib/copy";

const saleIncludes = [
  "Red-Zone Map from the free diagnostic",
  "Wrong Answer Forensics",
  "Guided repair question work",
  "Targeted Red-Zone Drills",
  "Boot camps and timed mixed sets",
  "Pattern Mastery Board",
] as const;

const terms = [
  {
    label: "Standard price",
    value: PRICING.priceLabel,
  },
  {
    label: "Flash-sale price",
    value: "$499",
  },
  {
    label: "Payment plan",
    value: "$500 today + $499 in 30 days",
  },
] as const;

export const metadata = {
  title: "Flash Sale Pricing Preview - BarMatrix",
  description:
    "Flash-sale pricing variant for BarMatrix Flagship at $499 pay-in-full checkout.",
  robots: { index: false, follow: false },
};

export default function PricingFlashSalePage() {
  return (
    <>
      <section
        className="hero sale-hero"
        style={{
          paddingBottom: 72,
          background:
            "linear-gradient(135deg, var(--bg) 0%, var(--paper) 52%, var(--bg-alt) 100%)",
        }}
      >
        <div className="container">
          <div className="sale-hero-grid">
            <div>
              <h1
                className="display display-lg"
                style={{ margin: "0 0 24px", maxWidth: "13ch" }}
              >
                50% off Flagship repair access.
              </h1>
              <p className="body-lg" style={{ marginBottom: 0, maxWidth: 740 }}>
                Get the full guided MBE repair path for $499 pay in full. Start
                with the free diagnostic if you want the Red-Zone Map first.
              </p>
              <div className="hero-actions" style={{ marginTop: 32 }}>
                <Link
                  href="/checkout?coupon=HALFOFF499"
                  className="btn btn-lg red"
                >
                  Open $499 checkout <span className="arrow">-&gt;</span>
                </Link>
                <Link href="/diagnostic" className="btn btn-lg ghost">
                  Start free diagnostic first
                </Link>
              </div>
            </div>

            <aside className="sale-ticket" aria-label="Flash sale offer">
              <div className="ticket-rule">BAR MATRIX OFFER</div>
              <div className="ticket-price">$499</div>
              <div className="ticket-subline">50% off pay-in-full Flagship</div>
              <div className="ticket-code">
                <span>Code</span>
                <strong>HALFOFF499</strong>
              </div>
              <div className="ticket-savings">
                <span>Standard</span>
                <strong>{PRICING.priceLabel}</strong>
                <span>Sale</span>
                <strong>$499</strong>
              </div>
              <Link
                href="/checkout?coupon=HALFOFF499"
                className="btn red"
              >
                Open checkout <span className="arrow">-&gt;</span>
              </Link>
              <p>
                Pay-in-full checkout is wired through the existing campaign
                coupon. The payment plan stays on standard pricing.
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
                style={{ margin: "0 0 18px", maxWidth: "12ch" }}
              >
                Same repair system. Shorter buying window.
              </h2>
              <p className="body-lg" style={{ margin: 0 }}>
                This variant is built for a direct campaign push. It keeps the
                offer clear, keeps the diagnostic visible, and avoids changing
                the standard pricing route.
              </p>
            </div>
            <div className="pricing-terms-grid" aria-label="Offer terms">
              {terms.map((term) => (
                <span key={term.label}>
                  {term.label}
                  <br />
                  {term.value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <div className="price-card flagship">
              <span className="ribbon">FLASH SALE</span>
              <h2 className="name">Flagship for $499</h2>
              <p className="summary">
                Full guided repair access for one July-cycle cohort.
              </p>
              <div className="price">
                <span className="num">$499</span>
                <span className="strike">{PRICING.priceLabel}</span>
              </div>
              <div className="plan">Pay in full with code HALFOFF499</div>
              <ul>
                {saleIncludes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                href="/checkout?coupon=HALFOFF499"
                className="btn btn-lg red"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Open $499 checkout <span className="arrow">-&gt;</span>
              </Link>
            </div>

            <div className="price-card">
              <h2 className="name">Need to split payments?</h2>
              <p className="summary">
                Use the standard payment plan. Promotion codes are reserved for
                the one-payment sale checkout.
              </p>
              <div className="price" style={{ flexWrap: "wrap", rowGap: 8 }}>
                <span className="num">$500</span>
                <span
                  className="mono"
                  style={{
                    fontSize: 14,
                    color: "var(--muted)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  + $499 in 30 days
                </span>
              </div>
              <div className="plan">{PRICING.paymentPlanLabel}</div>
              <div
                className="info-panel"
                style={{ padding: 18, marginBottom: 22 }}
              >
                <p
                  style={{
                    color: "var(--ink-soft)",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  Choose the payment plan on the regular checkout page. It is
                  not part of this 50% off campaign.
                </p>
              </div>
              <Link href="/checkout" className="btn ghost">
                Open standard checkout
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sale-final">
            <h2 className="display" style={{ color: "var(--paper)" }}>
              Flash-sale path: diagnostic first, repair next.
            </h2>
            <p>
              Take the diagnostic before buying, or open the $499 checkout with
              the campaign code attached.
            </p>
            <Link
              href="/checkout?coupon=HALFOFF499"
              className="btn btn-lg red"
            >
              Open checkout <span className="arrow">-&gt;</span>
            </Link>
          </div>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: "var(--muted)",
              margin: "40px 0 0",
              maxWidth: "80ch",
            }}
          >
            {DISCLAIMER}
          </p>
        </div>
      </section>
    </>
  );
}
