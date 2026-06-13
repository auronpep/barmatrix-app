"use client";

import Link from "next/link";
import { useState } from "react";
import { api, ApiClientError } from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { useDashboard } from "@/lib/use-dashboard";

type PortalPhase = "ready" | "redirecting" | "error";

interface BillingPortalButtonProps {
  checkoutSessionId?: string | null;
}

export function BillingPortalButton({
  checkoutSessionId,
}: BillingPortalButtonProps) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const dash = useDashboard();
  const [phase, setPhase] = useState<PortalPhase>("ready");
  const [error, setError] = useState<string | null>(null);
  const billingPortal = dash.data?.billing_portal;
  const needsDashboardBillingCheck =
    isLoaded && isSignedIn && dash.loading;
  const canAttemptStripeCustomerRecovery =
    dash.data?.enrolled === true &&
    billingPortal?.unavailable_reason === "stripe_customer_missing";
  const portalKnownUnavailable =
    isLoaded &&
    isSignedIn &&
    billingPortal?.portal_available === false &&
    !canAttemptStripeCustomerRecovery;

  const openPortal = async () => {
    if (!isLoaded || phase === "redirecting") return;

    if (!isSignedIn) {
      setError("Sign in with the account used at checkout to manage billing.");
      setPhase("error");
      return;
    }

    setPhase("redirecting");
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Sign in with the account used at checkout to manage billing.");
      }

      const session = await api.createCustomerPortalSession({
        checkout_session_id: checkoutSessionId ?? null,
        return_url: `${window.location.origin}/account`,
      }, token);
      const portalUrl = session.portal_url ?? session.url;

      if (!portalUrl) {
        throw new Error("Billing portal URL missing from API response");
      }

      window.location.assign(portalUrl);
    } catch (err) {
      setError(portalErrorMessage(err, checkoutSessionId));
      setPhase("error");
    }
  };

  if (isLoaded && !isSignedIn) {
    return (
      <div className="mt-6">
        <Link
          href="/sign-in"
          className="inline-flex rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900"
        >
          Sign in to manage billing
        </Link>
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Use the same account tied to the checkout purchase before opening the
          billing portal.
        </p>
      </div>
    );
  }

  if (needsDashboardBillingCheck) {
    return (
      <div className="mt-6">
        <button
          type="button"
          disabled
          className="rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white opacity-60"
        >
          Checking billing...
        </button>
      </div>
    );
  }

  if (portalKnownUnavailable) {
    return (
      <div className="mt-6">
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          <span className="font-semibold">No Stripe billing portal.</span>{" "}
          {billingPortal?.unavailable_reason === "not_enrolled"
            ? "This signed-in account does not have an active BarMatrix enrollment available for Stripe billing management."
            : "This account has active access, but no Stripe billing portal is available for this enrollment. If your access was granted manually or you expected an active payment plan, contact support."}
        </p>
        <Link
          href="mailto:support@barmatrix.app"
          className="mt-4 inline-flex rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:border-zinc-500"
        >
          Contact support
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={openPortal}
        disabled={!isLoaded || phase === "redirecting"}
        className="rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {!isLoaded
          ? "Checking sign-in..."
          : phase === "redirecting"
            ? "Opening Stripe..."
            : "Update Payment Method"}
      </button>

      {phase === "error" && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

function portalErrorMessage(
  err: unknown,
  checkoutSessionId?: string | null,
): string {
  if (err instanceof ApiClientError) {
    if (err.status === 401) {
      return "Sign in with the account used at checkout to manage billing.";
    }
    if (err.status === 403) {
      return "This signed-in account does not own the local purchase for that billing portal.";
    }
    if (err.status === 404) {
      if (checkoutSessionId) {
        return "That checkout session is not connected to a Stripe billing portal for this account.";
      }
      return "This account has active access, but no Stripe billing portal is available for this enrollment. If your access was granted manually or you expected an active payment plan, contact support.";
    }
    return `Billing portal unavailable (API ${err.status}).`;
  }

  return err instanceof Error ? err.message : "Billing portal unavailable.";
}
