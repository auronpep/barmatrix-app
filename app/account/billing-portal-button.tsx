"use client";

import { useState } from "react";
import { api, ApiClientError } from "@/lib/api-client";

type PortalPhase = "ready" | "redirecting" | "error";

interface BillingPortalButtonProps {
  checkoutSessionId?: string | null;
}

export function BillingPortalButton({
  checkoutSessionId,
}: BillingPortalButtonProps) {
  const [phase, setPhase] = useState<PortalPhase>("ready");
  const [error, setError] = useState<string | null>(null);

  const openPortal = async () => {
    setPhase("redirecting");
    setError(null);

    try {
      const session = await api.createCustomerPortalSession({
        checkout_session_id: checkoutSessionId ?? null,
        return_url: `${window.location.origin}/account`,
      });
      const portalUrl = session.portal_url ?? session.url;

      if (!portalUrl) {
        throw new Error("Billing portal URL missing from API response");
      }

      window.location.assign(portalUrl);
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
    <div className="mt-6">
      <button
        type="button"
        onClick={openPortal}
        disabled={phase === "redirecting"}
        className="rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {phase === "redirecting"
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
