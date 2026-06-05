import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import { initializePostHogClient } from "./lib/posthog-client";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  sendDefaultPii: false,
  // Trial: capture all browser traces to evaluate distributed tracing.
  // Dial down to ~0.1–0.2 after the trial to control cost.
  tracesSampleRate: 1.0,
  // Propagate trace headers to the API so frontend → backend requests
  // stitch into a single distributed trace.
  tracePropagationTargets: [
    "localhost",
    process.env.NEXT_PUBLIC_API_URL ?? "https://api.barmatrix.app",
  ],
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
