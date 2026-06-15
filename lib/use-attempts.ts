"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";
import { api, type AttemptRequest, type AttemptResponse } from "@/lib/api-client";

export type SubmitAttempt = (payload: AttemptRequest) => Promise<AttemptResponse>;

// One place that decides how an attempt is submitted, so every drill / diagnostic
// / timed-set surface closes the study-program loop the same way:
//   - signed in  -> attach the Clerk session token; the API attributes the
//     attempt to the student's own record (red-zones + drills update).
//   - signed out -> submit anonymously (the diagnostic funnel still works).
//
// Clerk's <ClerkProvider> is only mounted when a publishable key exists, and
// calling useAuth() without that provider throws — which would crash public
// funnel pages in keyless preview builds. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is a
// build-time constant, so we pick the hook implementation ONCE at module load.
// useSubmitAttempt is therefore a single stable hook for the whole bundle (the
// set of hooks called never varies between renders — rules-of-hooks safe).
const CLERK_ENABLED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function useAuthedSubmit(): SubmitAttempt {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  return useCallback<SubmitAttempt>(
    async (payload) => {
      if (!isLoaded) {
        throw new Error("Checking sign-in. Try again in a moment.");
      }
      if (isSignedIn) {
        const token = await getToken();
        if (!token) {
          throw new Error("Sign in again to save this attempt.");
        }
        return api.submitAttempt(payload, token);
      }
      return api.submitAttempt(payload);
    },
    [isLoaded, isSignedIn, getToken],
  );
}

function useAnonSubmit(): SubmitAttempt {
  return useCallback<SubmitAttempt>((payload) => api.submitAttempt(payload), []);
}

export const useSubmitAttempt: () => SubmitAttempt = CLERK_ENABLED
  ? useAuthedSubmit
  : useAnonSubmit;
