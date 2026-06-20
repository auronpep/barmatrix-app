import Link from "next/link";
import { notFound } from "next/navigation";
import { DISCLAIMER, PRICING } from "@/lib/copy";
import {
  SALE_OFFERS,
  buildSaleOfferFromQuery,
  checkoutHrefForSaleOffer,
  formatPrice,
  type SalePageQueryInput,
} from "@/lib/sale-offers";

type SalePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SalePageQueryInput>;
};

const OFFER_FEATURES = [
  {
    title: "Red-Zone Map first",
    body: "Start from the diagnostic pattern instead of guessing which subject deserves your next hour.",
  },
  {
    title: "One repair task at a time",
    body: "Flagship keeps the next step visible so your study block does not turn into resource browsing.",
  },
  {
    title: "Wrong-answer forensics",
    body: "Work the trap that pulled you, then train the call, clash, and rule discipline behind it.",
  },
] as const;

const OFFER_FAQ = [
  {
    q: "Can I use this code on the payment plan?",
    a: "No. Promotion codes are reserved for the one-payment checkout.",
  },
  {
    q: "Should I take the diagnostic first?",
    a: "Yes, if you have not taken it yet. The diagnostic gives you the Red-Zone Map that makes the guided repair path more specific.",
  },
  {
    q: "Is BarMatrix a full bar course?",
    a: "No. BarMatrix is MBE-focused guided repair. It does not replace essay preparation, performance-test preparation, or your broader bar plan.",
  },
] as const;

export function generateStaticParams() {
  return SALE_OFFERS.map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({ params, searchParams }: SalePageProps) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const offer = buildSaleOfferFromQuery(slug, sp);
  if (!offer) return {};

  return {
    title: `${formatPrice(offer.salePriceCents)} BarMatrix Campaign Offer`,
    description: `Use code ${offer.couponCode} for ${formatPrice(
      offer.salePriceCents,
    )} pay-in-full BarMatrix Flagship checkout.`,
  };
}

export default async function SalePage({ params, searchParams }: SalePageProps) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const offer = buildSaleOfferFromQuery(slug, sp);
  if (!offer) notFound();

  const checkoutHref = checkoutHrefForSaleOffer(offer);
  const price = formatPrice(offer.salePriceCents);
  const savings = formatPrice(offer.savingsCents);
  const basePrice = formatPrice(offer.basePriceCents);

  return (
    <>
      <section
        className="hero sale-hero"
        style={{
          paddingBottom: 72,
          background:
            "linear-gradient(135deg, var(--bg) 0%, var(--paper) 48%, var(--bg-alt) 100%)",
        }}
      >
        <div className="container">
          <div className="sale-hero-grid">
            <div>
              <div className="hero-meta">
                <span className="stamp">PAY IN FULL ONLY</span>
                <span className="stamp">GUIDED MBE REPAIR</span>
                <span className="stamp">RED-ZONE READY</span>
              </div>
              <h1
                className="display display-lg"
                style={{ margin: "0 0 24px", maxWidth: "16ch" }}
              >
                BarMatrix Flagship for{" "}
                <span style={{ color: "var(--red)", fontStyle: "italic" }}>
                  {price}.
                </span>
              </h1>
              <p className="body-lg" style={{ marginBottom: 0, maxWidth: 760 }}>
                Your link opens the Flagship pay-in-full checkout with code{" "}
                <strong>{offer.couponCode}</strong>. Save {savings} from the
                standard {basePrice} price and start from a guided MBE repair
                path built around red zones, wrong-answer traps, and one next
                task.
              </p>
              <div className="hero-actions" style={{ marginTop: 32 }}>
                <Link href={checkoutHref} className="btn btn-lg red">
                  Open {price} checkout <span className="arrow">-&gt;</span>
                </Link>
                <Link href="/diagnostic" className="btn btn-lg ghost">
                  Start free diagnostic first
                </Link>
              </div>
            </div>

            <aside className="sale-ticket" aria-label="Sale offer summary">
              <div className="ticket-rule">BAR MATRIX · OFFER LINK</div>
              <div className="ticket-price">{price}</div>
              <div className="ticket-subline">Pay-in-full Flagship checkout</div>
              <div className="ticket-code">
                <span>Code</span>
                <strong>{offer.couponCode}</strong>
              </div>
              <div className="ticket-savings">
                <span>Standard</span>
                <strong>{basePrice}</strong>
                <span>Savings</span>
                <strong>{savings}</strong>
              </div>
              <Link href={checkoutHref} className="btn red">
                Open checkout <span className="arrow">-&gt;</span>
              </Link>
              <p>
                This offer link attaches the campaign code before one-payment
                checkout. Payment plans are not eligible for promotion codes.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ What This Unlocks</span>
          </div>
          <div className="sale-feature-grid">
            {OFFER_FEATURES.map((feature) => (
              <article key={feature.title} className="sale-feature">
                <h2>{feature.title}</h2>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="sale-proof-band">
            <div>
              <h2 className="serif">Make the next question count.</h2>
              <p>
                BarMatrix is for the student who has already done plenty of
                questions and wants the miss pattern explained, named, and
                repaired. The goal is not more noise. It is one cleaner next
                move.
              </p>
            </div>
            <div className="sale-proof-steps">
              <span>Diagnostic</span>
              <span>Red zone</span>
              <span>Trap repair</span>
              <span>Next task</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <div className="section-rule">
                <span className="label">▌ Offer Rules</span>
              </div>
              <h2
                className="serif"
                style={{ fontSize: 40, lineHeight: 1.05, margin: "0 0 18px" }}
              >
                Clean price. Clean path. No payment-plan coupon workaround.
              </h2>
              <p className="body-lg" style={{ margin: 0 }}>
                This page is built for campaign links. The price shown here is
                matched to the promo code, the checkout keeps the code attached,
                and the one-payment rule stays visible before the visitor
                reaches Stripe.
              </p>
            </div>
            <div className="sale-faq">
              {OFFER_FAQ.map((item) => (
                <div key={item.q} className="sale-faq-row">
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="sale-final">
            <h2 className="display" style={{ color: "var(--paper)" }}>
              {price} gets you the guided repair path.
            </h2>
            <p>
              Standard Flagship price is {PRICING.priceLabel}. Use{" "}
              <strong>{offer.couponCode}</strong> on pay-in-full checkout for
              this campaign price.
            </p>
            <Link href={checkoutHref} className="btn btn-lg red">
              Open {price} checkout <span className="arrow">-&gt;</span>
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
