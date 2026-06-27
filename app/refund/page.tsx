import Link from "next/link";

export const metadata = {
  title: "Refund Policy - BarMatrix",
  description: "Refund and billing policy for BarMatrix Flagship enrollment.",
};

export default function RefundPolicyPage() {
  return (
    <section className="section alt">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            className="eyebrow-red"
            style={{ marginBottom: 18, justifyContent: "center" }}
          >
            ▌ LEGAL
          </div>
          <h1
            className="display display-xl"
            style={{ margin: "0 auto 16px", maxWidth: "22ch" }}
          >
            Refund Policy
          </h1>
          <p className="body-lg" style={{ margin: "0 auto", maxWidth: "54ch" }}>
            The refund and billing policy for BarMatrix Flagship purchases.
          </p>
        </div>

        <article style={{ maxWidth: 780, margin: "0 auto" }}>
          <p className="stamp" style={{ display: "inline-block", marginBottom: 24 }}>
            Effective June 11, 2026
          </p>

          <div className="price-card flagship" style={{ marginBottom: 32 }}>
            <h2 className="price" style={{ marginBottom: 8 }}>
              3-day window.
            </h2>
            <p className="summary" style={{ marginBottom: 0 }}>
              No questions asked within 3 calendar days from purchase. Email
              support@barmatrix.app or reply to your receipt to request.
            </p>
          </div>

          <PolicySection title="The 3-Day Window">
            <p>
              You have 3 calendar days from the date and time of purchase to
              request a full refund, no questions asked.
            </p>
            <p>
              To request a refund within the window, reply to your receipt email
              or email{" "}
              <a href="mailto:support@barmatrix.app">support@barmatrix.app</a>{" "}
              with your order details.
            </p>
            <p>
              Refunds return to the original payment method through Stripe.
              Processing time is typically 5-10 business days depending on your
              bank or card issuer.
            </p>
          </PolicySection>

          <PolicySection title="After the 3-Day Window">
            <p>
              After the 3-day window closes, refund requests are reviewed
              case-by-case. We do not guarantee refunds outside the window, but
              we will respond to every request sent to support@barmatrix.app.
            </p>
          </PolicySection>

          <PolicySection title="The 2-Pay Plan">
            <p>
              BarMatrix Flagship is available as pay in full or as a 2-pay plan:
              $500 at purchase and $499 approximately 30 days later.
            </p>
            <p>
              If you purchased on the 2-pay plan and request a refund within the
              3-day window, the refund covers the amount actually charged up to
              that point, and the unpaid installment is cancelled.
            </p>
          </PolicySection>

          <PolicySection title="Switching Payment Plans">
            <p>
              Within the first 3 days, you may request to switch between the
              pay-in-full option and the 2-pay plan. Email
              support@barmatrix.app and we will handle the billing adjustment.
            </p>
          </PolicySection>

          <PolicySection title="Disputes and Support">
            <p>
              If something looks wrong on your receipt or access does not appear
              after checkout, contact us before opening a payment dispute so we
              can resolve account access or billing records quickly.
            </p>
            <p>
              Billing and refund requests:{" "}
              <a href="mailto:support@barmatrix.app">support@barmatrix.app</a>.
              General support:{" "}
              <a href="mailto:support@barmatrix.app">support@barmatrix.app</a>.
            </p>
          </PolicySection>

          <div
            style={{
              borderTop: "2px solid var(--ink)",
              marginTop: 48,
              paddingTop: 24,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link href="/terms" className="btn ghost">
              Terms
            </Link>
            <Link href="/privacy" className="btn ghost">
              Privacy
            </Link>
            <Link href="/checkout" className="btn red">
              Return to checkout
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        borderTop: "1px solid var(--rule)",
        paddingTop: 32,
        marginTop: 32,
      }}
    >
      <h2 className="serif" style={{ fontSize: 28, margin: "0 0 12px" }}>
        {title}
      </h2>
      <div style={{ display: "grid", gap: 14, color: "var(--ink-soft)" }}>
        {children}
      </div>
    </section>
  );
}
