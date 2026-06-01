"use client";

import { useEffect, useState } from "react";
import { api, ApiClientError, type RedZoneLibrary } from "@/lib/api-client";
import { isAuthRejected } from "@/lib/auth-errors";
import { useClerkAuth } from "@/lib/use-clerk-auth";

export interface RedZoneLibraryState {
  loading: boolean;
  signedIn: boolean;
  data: RedZoneLibrary | null;
  error: string | null;
}

interface FetchResult {
  data: RedZoneLibrary | null;
  error: string | null;
  signedOut?: boolean;
}

// Single source of the signed-in student's Red Zone Library index. Resolves the
// Clerk session token, calls GET /api/me/red-zones, and exposes loading/
// signed-in/error so the page renders the right state without a CTA flash.
// Mirrors lib/use-dashboard.ts: loading and signed-out are DERIVED in render;
// the effect only writes state from its async callback.
export function useRedZoneLibrary(): RedZoneLibraryState {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [result, setResult] = useState<FetchResult | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;

    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getMyRedZones(token);
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
