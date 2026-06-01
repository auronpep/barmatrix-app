"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiClientError, type FoundationsOutline } from "@/lib/api-client";
import { isAuthRejected } from "@/lib/auth-errors";
import { useClerkAuth } from "@/lib/use-clerk-auth";

export interface FoundationsState {
  loading: boolean;
  signedIn: boolean;
  data: FoundationsOutline | null;
  error: string | null;
  reload: () => void;
}

interface FetchResult {
  data: FoundationsOutline | null;
  error: string | null;
  signedOut?: boolean;
}

function messageFor(err: unknown): string {
  if (err instanceof ApiClientError) return `API ${err.status}`;
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

// The Foundations course outline. Public content always loads; when the visitor
// is signed in we load the authed variant so per-lesson status + course progress
// come through. Mirrors lib/use-dashboard.ts: loading/signed-out are derived in
// render, the effect only writes from its async callback. `reload()` lets the
// hub refetch after a lesson is completed.
export function useFoundations(): FoundationsState {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [result, setResult] = useState<FetchResult | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;

    void (async () => {
      try {
        let data: FoundationsOutline;
        if (isSignedIn) {
          const token = await getToken();
          data = token ? await api.getMyFoundations(token) : await api.listFoundations();
        } else {
          data = await api.listFoundations();
        }
        if (!cancelled) setResult({ data, error: null });
      } catch (err) {
        if (isAuthRejected(err)) {
          try {
            const data = await api.listFoundations();
            if (!cancelled) setResult({ data, error: null, signedOut: true });
          } catch (fallbackErr) {
            if (!cancelled) {
              setResult({
                data: null,
                error: messageFor(fallbackErr),
                signedOut: true,
              });
            }
          }
          return;
        }
        if (!cancelled) setResult({ data: null, error: messageFor(err) });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, nonce]);

  if (!isLoaded) {
    return { loading: true, signedIn: false, data: null, error: null, reload };
  }
  if (result === null) {
    return { loading: true, signedIn: !!isSignedIn, data: null, error: null, reload };
  }
  return {
    loading: false,
    signedIn: !!isSignedIn && result.signedOut !== true,
    data: result.data,
    error: result.error,
    reload,
  };
}
