import { Suspense } from "react";
import { DISCLAIMER } from "@/lib/copy";
import { api, type CheckoutStatusResponse } from "@/lib/api-client";
import { CheckoutSuccessHero } from "./checkout-success-hero";
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

      <CheckoutSuccessHero
        activationKind={activationState.kind}
        accountHref={accountHref}
      />

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
