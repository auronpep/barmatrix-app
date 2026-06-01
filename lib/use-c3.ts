"use client";

import { useEffect, useState } from "react";
import { api, ApiClientError, type C3Mastery } from "@/lib/api-client";
import { isAuthRejected } from "@/lib/auth-errors";
import { useClerkAuth } from "@/lib/use-clerk-auth";

export interface C3State {
  loading: boolean;
  signedIn: boolean;
  data: C3Mastery | null;
  error: string | null;
}

interface FetchResult {
  data: C3Mastery | null;
  error: string | null;
  signedOut?: boolean;
}

// Single source of the signed-in student's C3 mastery payload. Resolves the
// Clerk session token, calls GET /api/me/c3, and exposes loading/signed-in/
// error so callers render the right state without a CTA flash. Mirrors
// lib/use-red-zones.ts: loading and signed-out are DERIVED in render; the
// effect only writes state from its async callback.
export function useC3(): C3State {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [result, setResult] = useState<FetchResult | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;

    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getMyC3(token);
        if (!cancelled) setResult({ data, error: null });
      } catch (err) {
        if (cancelled) return;
        if (isAuthRejected(err)) {
          setResult({ data: null, error: null, signedOut: true });
          return;
        }
        const message =
          err instanceof ApiClientError
            ? "request failed"
            : err instanceof Error
              ? err.message
              : "Unknown error";
        setResult({ data: null, error: message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return { loading: true, signedIn: false, data: null, error: null };
  }
  if (!isSignedIn) {
    return { loading: false, signedIn: false, data: null, error: null };
  }
  if (result === null) {
    return { loading: true, signedIn: true, data: null, error: null };
  }
  if (result.signedOut === true) {
    return { loading: false, signedIn: false, data: null, error: null };
  }
  return {
    loading: false,
    signedIn: true,
    data: result.data,
    error: result.error,
  };
}
