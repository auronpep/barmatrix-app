"use client";

import { useEffect, useState } from "react";

import { api, type CheckoutStatusResponse } from "@/lib/api-client";

export function EnrollmentRecoveryPanel({
  checkoutSessionId,
}: {
  checkoutSessionId: string | null;
}) {
  const [status, setStatus] = useState<CheckoutStatusResponse | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the checkout session has been fulfilled
  useEffect(() => {
    if (!checkoutSessionId) return;

    const checkStatus = async () => {
      try {
        const data = await api.getCheckoutStatus(checkoutSessionId);
        setStatus(data);
      } catch (err) {
        console.error("[enrollment recovery] check failed:", err);
      }
    };

    checkStatus();
    // Poll every 5 seconds for the first 30 seconds, then every 30 seconds
    const interval = setInterval(checkStatus, 5000);
    const longInterval = setTimeout(
      () => {
        clearInterval(interval);
        setInterval(checkStatus, 30000);
      },
      30000,
    );

    return () => {
      clearInterval(interval);
      clearTimeout(longInterval);
    };
  }, [checkoutSessionId]);

  const handleRecovery = async () => {
    if (!checkoutSessionId) return;

    setRecovering(true);
    setError(null);

    try {
      const data = await api.recoverCheckoutEnrollment(checkoutSessionId);

      // Recovery successful - refresh status
      setStatus({ fulfilled: true, purchaseId: data.purchaseId });
      setRecovering(false);

      // Reload page to update dashboard
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Recovery failed");
      setRecovering(false);
    }
  };

  // Only show if we have a checkout session and it hasn't been fulfilled after some time
  if (!checkoutSessionId || !status || status.fulfilled) {
    return null;
  }

  return (
    <div className="mt-6 rounded-lg border-2 border-amber-200 bg-amber-50 p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-wider text-amber-700">
        Checkout recovery
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-amber-900">
        Activation check available
      </h2>
      <p className="mt-3 text-zinc-700">
        We could not find a completed local activation for this checkout
        session yet. If this is the Stripe session from your recent purchase,
        click &quot;Recover enrollment&quot; to complete setup.
      </p>

      {error && (
        <p className="mt-3 font-mono text-sm text-red-700">Error: {error}</p>
      )}

      <button
        onClick={handleRecovery}
        disabled={recovering}
        className="mt-6 inline-block rounded-md bg-amber-700 px-6 py-3 text-base font-medium text-white hover:bg-amber-800 disabled:opacity-50"
      >
        {recovering ? "Recovering..." : "Recover enrollment"}
      </button>

      <p className="mt-4 text-sm text-zinc-600">
        If recovery doesn&apos;t work,{" "}
        <a
          href="mailto:support@barmatrix.app"
          className="border-b border-zinc-400 text-zinc-900 hover:text-zinc-700"
        >
          contact support
        </a>{" "}
        with your checkout session ID.
      </p>
    </div>
  );
}
