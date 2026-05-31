"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiClientError, type CertOutline } from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

export interface CertificationState {
  loading: boolean;
  signedIn: boolean;
  data: CertOutline | null;
  error: string | null;
  reload: () => void;
}

interface FetchResult {
  data: CertOutline | null;
  error: string | null;
}

function messageFor(err: unknown): string {
  if (err instanceof ApiClientError) return `API ${err.status}`;
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

// The signed-in student's certification outline (gate + per-competency status).
// The outline endpoint is Clerk-gated, so we only fetch once a session token is
// available. Mirrors lib/use-c3.ts (token-gated) + lib/use-foundations.ts
// (`reload()` nonce so the runner can refetch the scorecard after a submission).
// loading and signed-out are DERIVED in render; the effect only writes state.
export function useCertification(): CertificationState {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [result, setResult] = useState<FetchResult | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;

    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getCertification(token);
        if (!cancelled) setResult({ data, error: null });
      } catch (err) {
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
  if (!isSignedIn) {
    return { loading: false, signedIn: false, data: null, error: null, reload };
  }
  if (result === null) {
    return { loading: true, signedIn: true, data: null, error: null, reload };
  }
  return {
    loading: false,
    signedIn: true,
    data: result.data,
    error: result.error,
    reload,
  };
}
