"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_LAUNCH_COHORT_ID,
  trackPurchaseCompleted,
  type CheckoutPaymentPlan,
} from "@/lib/analytics";
import { rememberConfirmedCheckoutAccess } from "@/lib/checkout-access-state";

const CHECKOUT_PAYMENT_PLANS = new Set<CheckoutPaymentPlan>(["pay_in_full", "two_pay_500_499"]);

export function PurchaseSuccessTracker() {
  const searchParams = useSearchParams();
  const hasTracked = useRef(false);
  const paymentPlan = normalizePaymentPlan(searchParams.get("payment_plan"));
  const partnerId = searchParams.get("partner_id") ?? "none";
  const cohortId = searchParams.get("cohort_id") ?? DEFAULT_LAUNCH_COHORT_ID;
  const checkoutSessionId = searchParams.get("checkout_session_id") ?? searchParams.get("session_id");

  useEffect(() => {
    if (hasTracked.current) {
      return;
    }

    hasTracked.current = true;
    trackPurchaseCompleted({
      payment_plan: paymentPlan,
      partner_id: partnerId,
      checkout_session_id: checkoutSessionId,
      cohort_id: cohortId,
    });
    rememberConfirmedCheckoutAccess({ checkoutSessionId });
  }, [checkoutSessionId, cohortId, partnerId, paymentPlan]);

  return null;
}

function normalizePaymentPlan(value: string | null): CheckoutPaymentPlan {
  return value && CHECKOUT_PAYMENT_PLANS.has(value as CheckoutPaymentPlan)
    ? (value as CheckoutPaymentPlan)
    : "pay_in_full";
}
