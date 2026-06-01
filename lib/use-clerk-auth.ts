"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// Build-time-safe Clerk auth accessor.
//
// <ClerkProvider> is only mounted when a publishable key exists (see
// app/layout.tsx). Calling useAuth() without that provider throws — which crashes
// static prerender / keyless preview builds. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is
// a build-time constant, so we pick the implementation ONCE at module load: the
// set of hooks called never varies between renders (rules-of-hooks safe), exactly
// like lib/use-attempts.ts.

export interface ClerkAuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  getToken: () => Promise<string | null>;
}

const CLERK_ENABLED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const AUTH_LOAD_TIMEOUT_MS = 3000;

function useRealClerkAuth(): ClerkAuthState {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [authLoadTimedOut, setAuthLoadTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded || authLoadTimedOut) return;
    const timeoutId = window.setTimeout(
      () => setAuthLoadTimedOut(true),
      AUTH_LOAD_TIMEOUT_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [authLoadTimedOut, isLoaded]);

  return {
    isLoaded: isLoaded || authLoadTimedOut,
    isSignedIn: Boolean(isLoaded && isSignedIn),
    getToken: isLoaded ? getToken : ANON_GET_TOKEN,
  };
}

const ANON_GET_TOKEN = async (): Promise<string | null> => null;

function useAnonClerkAuth(): ClerkAuthState {
  return { isLoaded: true, isSignedIn: false, getToken: ANON_GET_TOKEN };
}

export const useClerkAuth: () => ClerkAuthState = CLERK_ENABLED
  ? useRealClerkAuth
  : useAnonClerkAuth;
