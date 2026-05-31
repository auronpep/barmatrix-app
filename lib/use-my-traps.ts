"use client";

import { useEffect, useState } from "react";
import {
  api,
  ApiClientError,
  type MyTrapHistory,
  type MyTrapProfile,
} from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

export interface MyTrapProfileState {
  loading: boolean;
  signedIn: boolean;
  data: MyTrapProfile | null;
  error: string | null;
}

export interface MyTrapHistoryState {
  loading: boolean;
  signedIn: boolean;
  data: MyTrapHistory | null;
  error: string | null;
}

function errorMessage(err: unknown): string {
  if (err instanceof ApiClientError) return `API ${err.status}`;
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

// Signed-in student's full trap profile (catalog panel + inline badges).
export function useMyTrapProfile(): MyTrapProfileState {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [result, setResult] = useState<{ data: MyTrapProfile | null; error: string | null } | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getMyTraps(token);
        if (!cancelled) setResult({ data, error: null });
      } catch (err) {
        if (!cancelled) setResult({ data: null, error: errorMessage(err) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) return { loading: true, signedIn: false, data: null, error: null };
  if (!isSignedIn) return { loading: false, signedIn: false, data: null, error: null };
  if (result === null) return { loading: true, signedIn: true, data: null, error: null };
  return { loading: false, signedIn: true, data: result.data, error: result.error };
}

// Signed-in student's history with one trap (detail page).
export function useMyTrapHistory(slug: string): MyTrapHistoryState {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [result, setResult] = useState<{ data: MyTrapHistory | null; error: string | null } | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !slug) return;
    let cancelled = false;
    void (async () => {
      setResult(null);
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getMyTrap(token, slug);
        if (!cancelled) setResult({ data, error: null });
      } catch (err) {
        if (!cancelled) setResult({ data: null, error: errorMessage(err) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, slug]);

  if (!isLoaded) return { loading: true, signedIn: false, data: null, error: null };
  if (!isSignedIn) return { loading: false, signedIn: false, data: null, error: null };
  if (result === null) return { loading: true, signedIn: true, data: null, error: null };
  return { loading: false, signedIn: true, data: result.data, error: result.error };
}
