import Link from "next/link";
import { Suspense } from "react";
import { DISCLAIMER } from "@/lib/copy";
import { PurchaseSuccessTracker } from "./purchase-success-tracker";

export const metadata = {
  title: "Checkout Complete - BarMatrix",
  description: "Your BarMatrix checkout is complete.",
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    checkout_session_id?: string;
    session_id?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const sp = await searchParams;
  const checkoutSessionId = sp.checkout_session_id ?? sp.session_id ?? null;
  const accountHref = buildAccountHref(checkoutSessionId);

  return (
    <>
      <Suspense fallback={null}>
        <PurchaseSuccessTracker />
      </Suspense>

      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">CHECKOUT COMPLETE</span>
            <span className="stamp">BARMATRIX FLAGSHIP</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ ENROLLMENT CONFIRMED
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "20ch" }}
          >
            Your Flagship access is being activated.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            Stripe has returned checkout completion to BarMatrix. Start with The
            Method — the 14-lesson core the whole platform runs on — then open
            your dashboard to begin the repair loop.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
            <Link href="/foundations" className="btn btn-lg red">
              Start with The Method <span className="arrow">→</span>
            </Link>
            <Link href="/dashboard" className="btn btn-lg red">
              Go to Dashboard <span className="arrow">→</span>
            </Link>
            <Link href={accountHref} className="btn btn-lg red">
              Open Account <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: "var(--muted)",
              margin: 0,
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

function buildAccountHref(checkoutSessionId: string | null): string {
  const params = new URLSearchParams({ welcome: "1" });
  if (checkoutSessionId) {
    params.set("checkout_session_id", checkoutSessionId);
  }
  return `/account?${params.toString()}`;
}
