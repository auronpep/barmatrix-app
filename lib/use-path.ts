"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiClientError, type PathResponse } from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

export interface PathState {
  loading: boolean;
  signedIn: boolean;
  data: PathResponse | null;
  error: string | null;
  reload: () => void;
}

interface FetchResult {
  data: PathResponse | null;
  error: string | null;
}

// The signed-in student's guided "lead me" path: GET /api/me/path returns the one
// next task plus progress + gamification. Mirrors lib/use-dashboard.ts — loading
// and signed-out states are DERIVED in render; the effect only writes from its
// async callback. reload() re-fetches after a step completes (the path advances).
export function usePath(): PathState {
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
        const data = await api.getMyPath(token);
        if (!cancelled) setResult({ data, error: null });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiClientError
            ? `API ${err.status}`
            : err instanceof Error
              ? err.message
              : "Unknown error";
        setResult({ data: null, error: message });
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
