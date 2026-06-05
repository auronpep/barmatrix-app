import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  sendDefaultPii: false,
  // Trial: capture all traces to evaluate. Dial to ~0.1–0.2 post-trial.
  tracesSampleRate: 1.0,
});
