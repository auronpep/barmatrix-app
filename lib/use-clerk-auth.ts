"use client";

import { useAuth } from "@clerk/nextjs";

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

function useRealClerkAuth(): ClerkAuthState {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  return { isLoaded, isSignedIn: Boolean(isSignedIn), getToken };
}

const ANON_GET_TOKEN = async (): Promise<string | null> => null;

function useAnonClerkAuth(): ClerkAuthState {
  return { isLoaded: true, isSignedIn: false, getToken: ANON_GET_TOKEN };
}

export const useClerkAuth: () => ClerkAuthState = CLERK_ENABLED
  ? useRealClerkAuth
  : useAnonClerkAuth;
