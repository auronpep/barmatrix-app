import Link from "next/link";
import { Suspense } from "react";
import { DISCLAIMER } from "@/lib/copy";
import { api, type CheckoutStatusResponse } from "@/lib/api-client";
import { PurchaseSuccessTracker } from "./purchase-success-tracker";

export const metadata = {
  title: "Checkout Complete - BarMatrix",
  description: "Your BarMatrix checkout is complete.",
  robots: { index: false, follow: false },
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    checkout_session_id?: string;
    session_id?: string;
  }>;
}

type CheckoutActivationState =
  | {
      kind: "confirmed";
      checkoutSessionId: string;
      status: CheckoutStatusResponse;
    }
  | {
      kind: "pending";
      checkoutSessionId: string;
      status: CheckoutStatusResponse | null;
    }
  | { kind: "missing"; checkoutSessionId: null };

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const sp = await searchParams;
  const checkoutSessionId = sp.checkout_session_id ?? sp.session_id ?? null;
  const activationState = await getCheckoutActivationState(checkoutSessionId);
  const copy = getActivationCopy(activationState.kind);
  const accountHref = buildAccountHref(
    checkoutSessionId,
    activationState.kind === "confirmed",
  );

  return (
    <>
      {activationState.kind === "confirmed" && (
        <Suspense fallback={null}>
          <PurchaseSuccessTracker />
        </Suspense>
      )}

      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">{copy.stamp}</span>
            <span className="stamp">BARMATRIX FLAGSHIP</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ {copy.eyebrow}
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "20ch" }}
          >
            {copy.headline}
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            {copy.body}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
            {activationState.kind === "confirmed" && (
              <>
                <Link href="/foundations" className="btn btn-lg red">
                  Start with The Method <span className="arrow">→</span>
                </Link>
                <Link href="/dashboard" className="btn btn-lg red">
                  Go to Dashboard <span className="arrow">→</span>
                </Link>
              </>
            )}
            <Link href={accountHref} className="btn btn-lg red">
              Open Account <span className="arrow">→</span>
            </Link>
            {activationState.kind !== "confirmed" && (
              <Link href="/checkout" className="btn btn-lg ghost">
                Back to Checkout <span className="arrow">→</span>
              </Link>
            )}
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

async function getCheckoutActivationState(
  checkoutSessionId: string | null,
): Promise<CheckoutActivationState> {
  if (!checkoutSessionId) {
    return { kind: "missing", checkoutSessionId: null };
  }

  try {
    const status = await api.getCheckoutStatus(checkoutSessionId);
    return status.fulfilled
      ? { kind: "confirmed", checkoutSessionId, status }
      : { kind: "pending", checkoutSessionId, status };
  } catch {
    return { kind: "pending", checkoutSessionId, status: null };
  }
}

function getActivationCopy(kind: CheckoutActivationState["kind"]) {
  if (kind === "confirmed") {
    return {
      stamp: "CHECKOUT COMPLETE",
      eyebrow: "ENROLLMENT CONFIRMED",
      headline: "Your Flagship access is being activated.",
      body:
        "Stripe has returned checkout completion to BarMatrix. Start with The Method - the 14-lesson core the whole platform runs on - then open your dashboard to begin the repair loop.",
    };
  }

  if (kind === "pending") {
    return {
      stamp: "CHECKOUT RETURN",
      eyebrow: "Activation check pending",
      headline: "We are checking your Flagship activation.",
      body:
        "Stripe returned a checkout session, but BarMatrix has not confirmed local access for that session yet. Open your account to check or recover activation.",
    };
  }

  return {
    stamp: "CHECKOUT RETURN",
    eyebrow: "Checkout verification needed",
    headline: "Open your account to confirm access.",
    body:
      "This return URL is missing a Stripe checkout session ID, so BarMatrix cannot treat it as a completed purchase. If you just enrolled, open your account or contact support with your Stripe receipt.",
  };
}

function buildAccountHref(
  checkoutSessionId: string | null,
  confirmed: boolean,
): string {
  const params = new URLSearchParams();
  if (confirmed) {
    params.set("welcome", "1");
  }
  if (checkoutSessionId) {
    params.set("checkout_session_id", checkoutSessionId);
  }
  const query = params.toString();
  return query ? `/account?${query}` : "/account";
}
