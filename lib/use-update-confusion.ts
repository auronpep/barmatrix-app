"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";
import {
  api,
  type ConfusionCapturePayload,
  type ConfusionUpdateResponse,
} from "@/lib/api-client";

// Retrospective confusion edit (the answer-page button). Authed only — the API
// only lets a caller edit their OWN attempt, so anonymous callers get a no-op
// (their pre-submit capture still rode along on the original attempt). Mirrors
// the build-time CLERK_ENABLED hook-selection in lib/use-attempts.ts so the set
// of hooks never varies between renders (rules-of-hooks safe in keyless builds).
export type UpdateConfusion = (
  attemptId: string,
  payload: ConfusionCapturePayload,
) => Promise<ConfusionUpdateResponse | null>;

const CLERK_ENABLED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function useAuthedUpdateConfusion(): UpdateConfusion {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  return useCallback<UpdateConfusion>(
    async (attemptId, payload) => {
      if (!isLoaded || !isSignedIn) return null;
      const token = await getToken();
      if (!token) return null;
      return api.updateConfusion(attemptId, payload, token);
    },
    [isLoaded, isSignedIn, getToken],
  );
}

function useNoopUpdateConfusion(): UpdateConfusion {
  return useCallback<UpdateConfusion>(async () => null, []);
}

export const useUpdateConfusion: () => UpdateConfusion = CLERK_ENABLED
  ? useAuthedUpdateConfusion
  : useNoopUpdateConfusion;
