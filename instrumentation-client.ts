import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import { initializePostHogClient } from "./lib/posthog-client";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: 0,
});

try {
  initializePostHogClient(posthog, {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN:
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
} catch {
  // Analytics must never block hydration.
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
