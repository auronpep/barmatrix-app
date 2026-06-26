import Link from "next/link";
import { notFound } from "next/navigation";
import { DISCLAIMER, PRICING } from "@/lib/copy";
import {
  buildSaleOfferFromQuery,
  checkoutHrefForSaleOffer,
  formatPrice,
  saleStaticParams,
  splitSaleVariantSlug,
  type SaleOffer,
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

const REDESIGN_STEPS = [
  "Free diagnostic",
  "Red-Zone Map",
  "Wrong-answer forensics",
  "One next repair task",
] as const;

const FLASH_INCLUDES = [
  "Red-Zone Map from the free diagnostic",
  "Wrong Answer Forensics",
  "Guided repair question work",
  "Targeted Red-Zone Drills",
  "Boot camps and timed mixed sets",
  "Pattern Mastery Board",
] as const;

export function generateStaticParams() {
  return saleStaticParams();
}

export async function generateMetadata({ params, searchParams }: SalePageProps) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const { baseSlug, variant } = splitSaleVariantSlug(slug);
  const offer = buildSaleOfferFromQuery(baseSlug, sp);
  if (!offer) return {};

  const price = formatPrice(offer.salePriceCents);

  if (variant === "legacy") {
    return {
      title: `${price} BarMatrix Campaign Offer Archive`,
      description: `Archived BarMatrix campaign offer page for code ${offer.couponCode}.`,
      robots: { index: false, follow: false },
    };
  }

  if (variant === "flash") {
    return {
      title: "50% Off BarMatrix Flagship Flash Sale",
      description:
        "Flash-sale variant for BarMatrix Flagship at $499 pay-in-full checkout.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${price} BarMatrix Campaign Offer`,
    description: `Use code ${offer.couponCode} for ${price} pay-in-full BarMatrix Flagship checkout.`,
    robots: { index: false, follow: false },
  };
}

export default async function SalePage({ params, searchParams }: SalePageProps) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const { baseSlug, variant } = splitSaleVariantSlug(slug);
  const offer = buildSaleOfferFromQuery(baseSlug, sp);
  if (!offer) notFound();

  if (variant === "legacy") return <LegacySalePage offer={offer} />;
  if (variant === "flash") return <FlashSalePage offer={offer} />;
  return <RedesignedSalePage offer={offer} />;
}

function RedesignedSalePage({ offer }: { offer: SaleOffer }) {
  const checkoutHref = checkoutHrefForSaleOffer(offer);
  const price = formatPrice(offer.salePriceCents);
  const savings = formatPrice(offer.savingsCents);
  const basePrice = formatPrice(offer.basePriceCents);

  return (
    <>
      <section className="sale-redesign-hero">
        <div className="container">
          <div className="sale-redesign-grid">
            <div>
              <p className="sale-kicker">Campaign offer: {offer.couponCode}</p>
              <h1 className="display display-lg">
                50% off BarMatrix Flagship.
              </h1>
              <p className="body-lg">
                This link opens the {price} pay-in-full checkout with the
                campaign code attached. Start with the free diagnostic if you
                want the Red-Zone Map first, or use the campaign checkout when
                you already know you want the guided MBE repair path.
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

            <aside className="red-zone-ledger" aria-label="Campaign offer">
              <div className="ledger-line">
                <span>Standard Flagship</span>
                <strong>{basePrice}</strong>
              </div>
              <div className="ledger-price">{price}</div>
              <div className="ledger-line">
                <span>Campaign savings</span>
                <strong>{savings}</strong>
              </div>
              <div className="ledger-code">
                <span>Code attached before checkout</span>
                <strong>{offer.couponCode}</strong>
              </div>
              <p>
                The 50% off sale applies to pay-in-full checkout. Payment
                plans use the standard checkout unless a separate sale plan is
                approved.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section sale-proof-section">
        <div className="container">
          <div className="sale-step-rail" aria-label="Diagnostic to repair path">
            {REDESIGN_STEPS.map((step, index) => (
              <span key={step}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                {step}
              </span>
            ))}
          </div>
          <div className="sale-proof-copy">
            <h2 className="display display-md">
              The offer is simple. The reason to buy should be specific.
            </h2>
            <p>
              BarMatrix is built for students who have already done questions
              and need the miss pattern named, explained, and repaired. The free
              diagnostic shows the map. Flagship turns the highest-priority red
              zone into the next guided task.
            </p>
          </div>
        </div>
      </section>

      <SaleRules offer={offer} checkoutHref={checkoutHref} />
    </>
  );
}

function FlashSalePage({ offer }: { offer: SaleOffer }) {
  const checkoutHref = checkoutHrefForSaleOffer(offer);

  return (
    <>
      <section className="flash-sale-hero">
        <div className="container">
          <div className="flash-sale-grid">
            <div>
              <p className="sale-kicker">Flash sale offer</p>
              <h1 className="display display-lg">
                50% off BarMatrix Flagship.
              </h1>
              <p className="body-lg">
                Full guided MBE repair access for $499 with the campaign code
                attached before pay-in-full checkout.
              </p>
              <div className="hero-actions" style={{ marginTop: 32 }}>
                <Link href={checkoutHref} className="btn btn-lg red">
                  Open $499 checkout <span className="arrow">-&gt;</span>
                </Link>
                <Link href="/diagnostic" className="btn btn-lg ghost">
                  Start diagnostic first
                </Link>
              </div>
            </div>

            <aside className="flash-ledger" aria-label="Flash sale terms">
              <div className="flash-price">$499</div>
              <div className="flash-line">
                <span>Standard</span>
                <strong>{PRICING.priceLabel}</strong>
              </div>
              <div className="flash-line">
                <span>Pay in full</span>
                <strong>{offer.couponCode}</strong>
              </div>
              <p>
                The 50% off sale applies to pay-in-full checkout. The payment
                plan stays on standard pricing.
              </p>
            </aside>
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
              <div className="plan">Pay in full with code {offer.couponCode}</div>
              <ul>
                {FLASH_INCLUDES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                href={checkoutHref}
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
                <span className="mono">+ $499 in 30 days</span>
              </div>
              <div className="plan">{PRICING.paymentPlanLabel}</div>
              <div className="info-panel" style={{ padding: 18, marginBottom: 22 }}>
                <p style={{ color: "var(--ink-soft)", lineHeight: 1.55, margin: 0 }}>
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

      <SaleRules offer={offer} checkoutHref={checkoutHref} />
    </>
  );
}

function LegacySalePage({ offer }: { offer: SaleOffer }) {
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
              <div className="ticket-rule">BAR MATRIX - OFFER LINK</div>
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
            <span className="label">What This Unlocks</span>
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

      <SaleRules offer={offer} checkoutHref={checkoutHref} />
    </>
  );
}

function SaleRules({
  offer,
  checkoutHref,
}: {
  offer: SaleOffer;
  checkoutHref: string;
}) {
  const price = formatPrice(offer.salePriceCents);

  return (
    <>
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <div className="section-rule">
                <span className="label">Offer Rules</span>
              </div>
              <h2 className="serif sale-rules-heading">
                Clean price. Clean path. No payment-plan workaround.
              </h2>
              <p className="body-lg" style={{ margin: 0 }}>
                This page is built for campaign links. The price shown here is
                matched to the campaign code, checkout keeps the code attached,
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
          <p className="sale-disclaimer">{DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}
