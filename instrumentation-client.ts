import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import { initializePostHogClient } from "./lib/posthog-client";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: 0,
});

try {
  initializePostHogClient(posthog);
} catch {
  // Analytics must never block hydration.
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
