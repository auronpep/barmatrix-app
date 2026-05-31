"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, ApiClientError, type PaymentPlan } from "@/lib/api-client";
import {
  DEFAULT_LAUNCH_COHORT_ID,
  trackCheckoutStarted,
  type StoredAttribution,
} from "@/lib/analytics";
import { PRICING, DISCLAIMER, CAPACITY_COPY } from "@/lib/copy";

type Phase = "ready" | "redirecting" | "error" | "capacity";

export default function CheckoutPage() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("capacity") === "reached" || params.get("status") === "waitlist") {
      const timeout = window.setTimeout(() => setPhase("capacity"), 0);
      return () => window.clearTimeout(timeout);
    }
  }, []);

  const enroll = async (plan: PaymentPlan) => {
    setPhase("redirecting");
    setError(null);
    try {
      const cohort = await api.cohortStatus();
      if (cohort.public_status === "waitlist") {
        setPhase("capacity");
        return;
      }

      const checkoutSearchParams = getCurrentSearchParams();
      const attribution = trackCheckoutStarted({
        payment_plan: plan,
        searchParams: checkoutSearchParams,
        cohort_id: DEFAULT_LAUNCH_COHORT_ID,
      });
      const session = await api.createCheckoutSession({
        product_code: "barmatrix_flagship_999",
        payment_plan: plan,
        partner_id: attribution.partner_id === "none" ? null : attribution.partner_id,
        referral_click_id: getReferralClickId(checkoutSearchParams),
        ...buildCheckoutReturnUrls(plan, attribution),
      });
      window.location.assign(session.checkout_url);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? `API ${err.status}: ${err.message}`
          : err instanceof Error
            ? err.message
            : "Unknown error";
      setError(message);
      setPhase("error");
    }
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">ENROLLMENT · JULY 2026 COHORT</span>
            <span className="stamp">BARMATRIX FLAGSHIP</span>
            <span className="stamp">EDITION : LAUNCH</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ ENROLL IN {PRICING.flagshipName.toUpperCase()}
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "20ch" }}
          >
            One step from your{" "}
            <span style={{ fontStyle: "italic", color: "var(--red)" }}>
              Red-Zone Map.
            </span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            BarMatrix Flagship is a multiple-choice-only MBE repair system.
            Access includes the diagnostic, question-bank access, Wrong Answer
            Forensics, Red-Zone Map, assigned drills, boot camp modules, timed
            mixed sets, and full web dashboard access.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div className="section-rule">
              <span className="label">▌ Choose Your Plan</span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {phase === "capacity" ? (
                <CapacityReachedPanel />
              ) : (
                <>
                  {/* Pay in full */}
                  <div className="price-card flagship">
                    <span className="ribbon">RECOMMENDED</span>
                    <h2 className="name">Pay in full</h2>
                    <p className="summary">
                      One charge. Immediate access to the full Flagship cohort.
                    </p>
                    <div className="price">
                      <span className="num">{PRICING.priceLabel}</span>
                    </div>
                    <div className="plan">$999 USD · one-time</div>
                    <button
                      type="button"
                      onClick={() => enroll("pay_in_full")}
                      disabled={phase === "redirecting"}
                      className="btn btn-lg red"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        textAlign: "center",
                        whiteSpace: "normal",
                      }}
                    >
                      {phase === "redirecting"
                        ? "Redirecting to Stripe…"
                        : "Continue · Pay $999 →"}
                    </button>
                  </div>

                  {/* Payment plan */}
                  <div className="price-card">
                    <h2 className="name">Payment plan</h2>
                    <p className="summary">
                      Same total. Split across two charges.
                    </p>
                    <div className="price" style={{ flexWrap: "wrap", rowGap: 8 }}>
                      <span className="num">$500</span>
                      <span
                        className="mono"
                        style={{
                          fontSize: 14,
                          color: "var(--muted)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        + $499 in 30 days
                      </span>
                    </div>
                    <div className="plan">{PRICING.paymentPlanLabel}</div>
                    <button
                      type="button"
                      onClick={() => enroll("two_pay_500_499")}
                      disabled={phase === "redirecting"}
                      className="btn btn-lg red"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        textAlign: "center",
                        whiteSpace: "normal",
                      }}
                    >
                      {phase === "redirecting"
                        ? "Redirecting to Stripe…"
                        : "Continue · Payment plan →"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {phase === "error" && (
              <div
                className="info-panel error"
                style={{ marginTop: 32 }}
              >
                <div
                  className="eyebrow-strong"
                  style={{ marginBottom: 12, color: "var(--red)" }}
                >
                  ▌ COULDN&apos;T START CHECKOUT
                </div>
                <p
                  className="mono"
                  style={{
                    fontSize: 12,
                    color: "var(--red-deep)",
                    margin: "0 0 12px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {error}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-soft)",
                    margin: 0,
                  }}
                >
                  If this persists, email{" "}
                  <Link
                    href="mailto:support@barmatrix.app"
                    style={{
                      borderBottom: "1px solid var(--ink)",
                      paddingBottom: 1,
                    }}
                  >
                    support@barmatrix.app
                  </Link>{" "}
                  and we&apos;ll resolve it.
                </p>
              </div>
            )}

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
        </div>
      </section>
    </>
  );
}

function CapacityReachedPanel() {
  return (
    <div className="price-card flagship">
      <span className="ribbon">WAITLIST</span>
      <h2 className="name">Cohort capacity reached</h2>
      <p className="summary">
        {CAPACITY_COPY.waitlist} {PRICING.capacityLine}
      </p>
      <div
        className="scarcity-meter"
        style={{ margin: "24px 0", color: "var(--ink)" }}
      >
        <div className="meter-row">
          <span className="left">July-cycle cohort</span>
          <span className="right">Waitlist</span>
        </div>
        <div className="meter-bar">
          <div className="fill" style={{ width: "100%" }} />
        </div>
        <div className="meter-meta">Checkout pauses when capacity is reached.</div>
      </div>
      <Link
        href="/waitlist"
        className="btn btn-lg red"
        style={{
          width: "100%",
          justifyContent: "center",
          textAlign: "center",
          whiteSpace: "normal",
        }}
      >
        Join the waitlist <span className="arrow">→</span>
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
        You can still take the diagnostic while waiting for the next available seat.
      </p>
    </div>
  );
}

function getCurrentSearchParams(): URLSearchParams {
  return typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
}

function getReferralClickId(searchParams: URLSearchParams): string | null {
  return searchParams.get("referral_click_id") ?? searchParams.get("click_id");
}

function buildCheckoutReturnUrls(plan: PaymentPlan, attribution: StoredAttribution) {
  const origin = window.location.origin;
  const successUrl = new URL("/checkout/success", origin);
  successUrl.searchParams.set("payment_plan", plan);
  successUrl.searchParams.set("partner_id", attribution.partner_id);
  successUrl.searchParams.set("cohort_id", DEFAULT_LAUNCH_COHORT_ID);
  const successConnector = successUrl.toString().includes("?") ? "&" : "?";

  return {
    success_url: `${successUrl.toString()}${successConnector}checkout_session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
  };
}
