"use client";

import Link from "next/link";
import { useState } from "react";
import { api, ApiClientError, type PaymentPlan } from "@/lib/api-client";
import { PRICING, DISCLAIMER } from "@/lib/copy";

type Phase = "ready" | "redirecting" | "error";

export default function CheckoutPage() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [error, setError] = useState<string | null>(null);

  const enroll = async (plan: PaymentPlan) => {
    setPhase("redirecting");
    setError(null);
    try {
      const session = await api.createCheckoutSession({ payment_plan: plan });
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
            mixed sets, dashboard access, and web/iOS/Android app access.
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
                  style={{ width: "100%", justifyContent: "center" }}
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
                <div className="price">
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
                  className="btn btn-lg"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {phase === "redirecting"
                    ? "Redirecting to Stripe…"
                    : "Continue · Payment plan →"}
                </button>
              </div>
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
