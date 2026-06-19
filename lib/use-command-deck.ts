"use client";

import { useEffect, useState } from "react";
import { api, ApiClientError, type CommandDeckData } from "@/lib/api-client";
import { isAuthRejected } from "@/lib/auth-errors";
import { useClerkAuth } from "@/lib/use-clerk-auth";

export interface CommandDeckState {
  loading: boolean;
  signedIn: boolean;
  data: CommandDeckData | null;
  error: string | null;
}

interface FetchResult {
  data: CommandDeckData | null;
  error: string | null;
  authKey: string | null;
  signedOut?: boolean;
}

// Single source of the signed-in student's command-deck data. Resolves the
// Clerk session token, calls GET /api/me/command-deck, and exposes
// loading/signed-in/error so the preview page can render the right state
// without a CTA flash. Mirrors lib/use-dashboard.ts: loading and signed-out
// states are DERIVED during render (no setState in the effect body).
export function useCommandDeck(): CommandDeckState {
  const { isLoaded, isSignedIn, authKey, getToken } = useClerkAuth();
  const [result, setResult] = useState<FetchResult | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;

    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getMyCommandDeck(token);
        if (!cancelled) setResult({ data, error: null, authKey });
      } catch (err) {
        if (cancelled) return;
        if (isAuthRejected(err)) {
          setResult({ data: null, error: null, authKey, signedOut: true });
          return;
        }
        const message =
          err instanceof ApiClientError
            ? "request failed"
            : err instanceof Error
              ? err.message
              : "Unknown error";
        setResult({ data: null, error: message, authKey });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, authKey, getToken]);

  if (!isLoaded) {
    return { loading: true, signedIn: false, data: null, error: null };
  }
  if (!isSignedIn) {
    return { loading: false, signedIn: false, data: null, error: null };
  }
  if (result === null || result.authKey !== authKey) {
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
