"use client";

import Link from "next/link";
import { useDashboard } from "@/lib/use-dashboard";

type ActivationKind = "confirmed" | "pending" | "missing";

interface CheckoutSuccessHeroProps {
  activationKind: ActivationKind;
  accountHref: string;
}

export function CheckoutSuccessHero({
  activationKind,
  accountHref,
}: CheckoutSuccessHeroProps) {
  const dash = useDashboard();
  const signedInAccessActive = dash.data?.enrolled === true;
  const copy = signedInAccessActive
    ? {
        stamp: "ACCOUNT ACTIVE",
        eyebrow: "Signed-in access confirmed",
        headline: "Your Flagship access is active.",
        body:
          "This browser is signed in to an enrolled BarMatrix account. Start with Lead Me; The Method and account tools stay available after the first task.",
      }
    : getActivationCopy(activationKind);

  return (
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

        {dash.loading && activationKind !== "confirmed" && (
          <p
            className="mono"
            style={{
              color: "var(--muted)",
              fontSize: 12,
              letterSpacing: "0.12em",
              marginTop: 18,
              textTransform: "uppercase",
            }}
          >
            Checking signed-in account...
          </p>
        )}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
          {signedInAccessActive && (
            <>
              <Link href="/dashboard/path" className="btn btn-lg red">
                Open Lead Me <span className="arrow">→</span>
              </Link>
              <Link href="/foundations" className="btn btn-lg ghost">
                Open The Method <span className="arrow">→</span>
              </Link>
            </>
          )}
          <Link
            href={accountHref}
            className={signedInAccessActive ? "btn btn-lg ghost" : "btn btn-lg red"}
          >
            Open Account <span className="arrow">→</span>
          </Link>
          {activationKind !== "confirmed" && !signedInAccessActive && (
            <Link href="/checkout" className="btn btn-lg ghost">
              Back to Checkout <span className="arrow">→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function getActivationCopy(kind: ActivationKind) {
  if (kind === "confirmed") {
    return {
      stamp: "CHECKOUT COMPLETE",
      eyebrow: "ENROLLMENT CONFIRMED",
      headline: "Your Flagship access is being activated.",
      body:
        "Stripe has returned checkout completion to BarMatrix. Open your account to confirm active access, then continue into the guided repair path.",
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
      "This return URL is missing a Stripe checkout session ID, so BarMatrix cannot treat it as a completed purchase until the signed-in account or Stripe receipt is verified.",
  };
}
