"use client";

import { useEffect, useState } from "react";

const CONFIRMED_CHECKOUT_ACCESS_KEY = "barmatrix.checkout.confirmed_access";
export const RECENT_CHECKOUT_ACCESS_TTL_MS = 1000 * 60 * 60 * 24 * 30;

interface ConfirmedCheckoutAccess {
  checkoutSessionId: string | null;
  confirmedAt: number;
}

export interface RecentConfirmedCheckoutAccessState {
  checking: boolean;
  active: boolean;
}

export function rememberConfirmedCheckoutAccess({
  checkoutSessionId,
}: {
  checkoutSessionId: string | null;
}): void {
  if (typeof window === "undefined") return;
  try {
    const value: ConfirmedCheckoutAccess = {
      checkoutSessionId,
      confirmedAt: Date.now(),
    };
    window.localStorage.setItem(
      CONFIRMED_CHECKOUT_ACCESS_KEY,
      JSON.stringify(value),
    );
  } catch {
    // Storage failures should not block checkout success rendering.
  }
}

export function hasRecentConfirmedCheckoutAccess(now = Date.now()): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(CONFIRMED_CHECKOUT_ACCESS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<ConfirmedCheckoutAccess>;
    if (typeof parsed.confirmedAt !== "number") return false;
    return now - parsed.confirmedAt <= RECENT_CHECKOUT_ACCESS_TTL_MS;
  } catch {
    return false;
  }
}

export function useRecentConfirmedCheckoutAccess(): RecentConfirmedCheckoutAccessState {
  const [state, setState] = useState<RecentConfirmedCheckoutAccessState>({
    checking: true,
    active: false,
  });

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState({
        checking: false,
        active: hasRecentConfirmedCheckoutAccess(),
      });
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return state;
}
