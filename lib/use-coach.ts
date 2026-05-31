"use client";
import { useCallback, useState } from "react";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { api, ApiClientError, type CoachNext } from "@/lib/api-client";

export interface UseCoach {
  isLoaded: boolean;
  isSignedIn: boolean;
  current: CoachNext | null;
  loading: boolean;
  error: string | null;
  served: number;
  fetchNext: () => Promise<void>;
}

export function useCoach(): UseCoach {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [current, setCurrent] = useState<CoachNext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [served, setServed] = useState(0);

  const fetchNext = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) { setError("no session token"); return; }
      const next = await api.getCoachNext(token);
      setCurrent(next);
      if (next.available) setServed((n) => n + 1);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? `API ${err.status}`
        : err instanceof Error ? err.message : "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  return { isLoaded, isSignedIn, current, loading, error, served, fetchNext };
}
