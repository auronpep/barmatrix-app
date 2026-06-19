"use client";

import { useCallback, useEffect, useState } from "react";
import {
  api,
  ApiClientError,
  type MyDayPlan,
  type MyDayPlanCompleteResponse,
} from "@/lib/api-client";
import { isAuthRejected } from "@/lib/auth-errors";
import { useClerkAuth } from "@/lib/use-clerk-auth";

export interface DayPlanState {
  loading: boolean;
  signedIn: boolean;
  data: MyDayPlan | null;
  error: string | null;
  completeStep: (stepId: string) => Promise<MyDayPlanCompleteResponse>;
  refresh: () => Promise<void>;
}

interface FetchResult {
  data: MyDayPlan | null;
  error: string | null;
  authKey: string | null;
  signedOut?: boolean;
}

export function useDayPlan(): DayPlanState {
  const { isLoaded, isSignedIn, authKey, getToken } = useClerkAuth();
  const [result, setResult] = useState<FetchResult | null>(null);

  const fetchPlan = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    try {
      const token = await getToken();
      if (!token) throw new Error("no session token");
      const data = await api.getMyDayPlan(token);
      setResult({ data, error: null, authKey });
    } catch (err) {
      if (isAuthRejected(err)) {
        setResult({ data: null, error: null, authKey, signedOut: true });
        return;
      }
      setResult({ data: null, error: formatDayPlanError(err), authKey });
    }
  }, [authKey, getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;

    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getMyDayPlan(token);
        if (!cancelled) setResult({ data, error: null, authKey });
      } catch (err) {
        if (cancelled) return;
        if (isAuthRejected(err)) {
          setResult({ data: null, error: null, authKey, signedOut: true });
          return;
        }
        setResult({ data: null, error: formatDayPlanError(err), authKey });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authKey, getToken, isLoaded, isSignedIn]);

  const completeStep = useCallback(
    async (stepId: string) => {
      const token = await getToken();
      if (!token) throw new Error("no session token");
      const data = await api.completeMyDayPlanStep(token, stepId);
      setResult({ data, error: null, authKey });
      return data;
    },
    [authKey, getToken],
  );

  if (!isLoaded) {
    return {
      loading: true,
      signedIn: false,
      data: null,
      error: null,
      completeStep,
      refresh: fetchPlan,
    };
  }
  if (!isSignedIn) {
    return {
      loading: false,
      signedIn: false,
      data: null,
      error: null,
      completeStep,
      refresh: fetchPlan,
    };
  }
  if (result === null || result.authKey !== authKey) {
    return {
      loading: true,
      signedIn: true,
      data: null,
      error: null,
      completeStep,
      refresh: fetchPlan,
    };
  }
  if (result.signedOut === true) {
    return {
      loading: false,
      signedIn: false,
      data: null,
      error: null,
      completeStep,
      refresh: fetchPlan,
    };
  }
  return {
    loading: false,
    signedIn: true,
    data: result.data,
    error: result.error,
    completeStep,
    refresh: fetchPlan,
  };
}

function formatDayPlanError(error: unknown) {
  if (error instanceof ApiClientError) return "request failed";
  if (error instanceof Error) return error.message;
  return "Unknown error";
}
