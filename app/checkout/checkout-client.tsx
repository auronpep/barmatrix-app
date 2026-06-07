"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, ApiClientError, type PaymentPlan } from "@/lib/api-client";
import {
  DEFAULT_LAUNCH_COHORT_ID,
  trackCheckoutStarted,
  type StoredAttribution,
} from "@/lib/analytics";
import { getRememberedDiagnosticId } from "@/lib/diagnostic-session";
import { PRICING, DISCLAIMER, CAPACITY_COPY } from "@/lib/copy";

type Phase = "ready" | "redirecting" | "error" | "capacity";
type AttributionState = {
  lp: string;
  source: string;
  campaign: string;
  partner: string;
  referral: string;
};

export default function CheckoutClient() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [error, setError] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<AttributionState>({
    lp: "direct",
    source: "none",
    campaign: "none",
    partner: "none",
    referral: "none",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lp = params.get("lp") ?? "direct";
    const timeouts: number[] = [];
    timeouts.push(
      window.setTimeout(
        () =>
          setAttribution({
            lp,
            source: params.get("utm_source") ?? "none",
            campaign:
              params.get("utm_campaign") ??
              params.get("campaign_id") ??
              params.get("campaign") ??
              (lp !== "direct" ? `lp_${lp}` : "none"),
            partner: params.get("partner_id") ?? "none",
            referral:
              params.get("referral_click_id") ?? params.get("click_id") ?? "none",
          }),
        0,
      ),
    );
    if (params.get("capacity") === "reached" || params.get("status") === "waitlist") {
      timeouts.push(window.setTimeout(() => setPhase("capacity"), 0));
    }
    return () => timeouts.forEach((timeout) => window.clearTimeout(timeout));
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
        diagnostic_id: getDiagnosticId(checkoutSearchParams),
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
          <div
            className="hero-actions"
            style={{ marginTop: 32 }}
          >
            <Link href="/diagnostic" className="btn btn-lg ghost">
              Run free diagnostic first
            </Link>
            <Link href="/account" className="btn btn-lg ghost">
              Already enrolled? Open account
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div className="section-rule">
              <span className="label">▌ Choose Your Plan</span>
            </div>
            <CheckoutContextPanel attribution={attribution} />

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
                        : "Enroll in BarMatrix Flagship - $999 →"}
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
                        : "Enroll with payment plan - $500 today →"}
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
                  and we&apos;ll resolve it. You are not enrolled or charged by
                  BarMatrix unless Stripe shows a completed checkout and returns
                  you to the success page.
                </p>
              </div>
            )}

            <CheckoutFaqPanel />

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

function CheckoutContextPanel({
  attribution,
}: {
  attribution: AttributionState;
}) {
  return (
    <div
      className="info-panel"
      style={{ marginBottom: 24, background: "var(--paper)" }}
    >
      <div className="eyebrow-strong" style={{ marginBottom: 14 }}>
        ▌ BEFORE YOU ENROLL
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        <div>
          <h2
            className="serif"
            style={{
              fontSize: 24,
              lineHeight: 1.15,
              margin: "0 0 10px",
            }}
          >
            What BarMatrix is
          </h2>
          <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.55 }}>
            A web-live MBE multiple-choice diagnostic and repair layer. Use it
            alongside BARBRI, Themis, UWorld, AdaptiBar, Kaplan, or a tutor.
          </p>
        </div>
        <div>
          <h2
            className="serif"
            style={{
              fontSize: 24,
              lineHeight: 1.15,
              margin: "0 0 10px",
            }}
          >
            What BarMatrix is not
          </h2>
          <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.55 }}>
            Not a full bar course, essay or performance-test prep, official bar
            material, legal advice, or any guarantee of a score or result.
          </p>
        </div>
      </div>
      {process.env.NODE_ENV === "development" && (
        <div
          className="mono"
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px solid var(--rule-soft)",
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          <span>lp: {attribution.lp}</span>
          <span>source: {attribution.source}</span>
          <span>campaign: {attribution.campaign}</span>
          <span>partner: {attribution.partner}</span>
          <span>referral: {attribution.referral}</span>
        </div>
      )}
    </div>
  );
}

function CheckoutFaqPanel() {
  const rows = [
    {
      q: "Price",
      a: "BarMatrix Flagship is $999. The payment plan is $500 today and $499 in 30 days.",
    },
    {
      q: "Refund window",
      a: "You may request a full refund within 3 days of enrollment if the Terms refund limits have not been exceeded.",
    },
    {
      q: "Course companion",
      a: "BarMatrix is designed to sit beside your full course. Keep using your essay, performance-test, lecture, and outline plan.",
    },
    {
      q: "Checkout recovery",
      a: "If Stripe completes but access does not appear, open Account from the same email or contact support with your Stripe receipt.",
    },
  ];

  return (
    <div className="info-panel" style={{ marginTop: 32 }}>
      <div className="eyebrow-strong" style={{ marginBottom: 14 }}>
        ▌ CHECKOUT FAQ
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {rows.map((row) => (
          <div
            key={row.q}
            style={{
              borderTop: "1px solid var(--rule-soft)",
              paddingTop: 14,
            }}
          >
            <h2
              className="serif"
              style={{
                fontSize: 22,
                lineHeight: 1.15,
                margin: "0 0 6px",
              }}
            >
              {row.q}
            </h2>
            <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.55 }}>
              {row.a}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/terms" className="btn ghost">
          Terms
        </Link>
        <Link href="/account" className="btn ghost">
          Checkout recovery
        </Link>
      </div>
    </div>
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

const DIAGNOSTIC_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Prefer the id passed on the URL from the results page; fall back to the one
// remembered in localStorage when the diagnostic was taken. Validate the shape
// so a junk value never reaches the API (server also re-validates).
function getDiagnosticId(searchParams: URLSearchParams): string | null {
  const fromUrl = searchParams.get("diagnostic_id");
  const candidate = fromUrl ?? getRememberedDiagnosticId();
  return candidate && DIAGNOSTIC_ID_RE.test(candidate) ? candidate : null;
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
