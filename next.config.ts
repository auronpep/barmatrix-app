import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

function getOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function unique(values: Array<string | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

const IS_DEV = process.env.NODE_ENV === "development";
const ALLOW_LOCAL_CONNECT = !process.env.VERCEL;

const API_ORIGIN = getOrigin(process.env.NEXT_PUBLIC_API_URL) ?? "https://api.barmatrix.app";
const POSTHOG_ORIGIN =
  getOrigin(process.env.NEXT_PUBLIC_POSTHOG_HOST) ?? "https://us.i.posthog.com";
const POSTHOG_ASSET_ORIGIN = "https://us-assets.i.posthog.com";
const SENTRY_INGEST_ORIGIN =
  getOrigin(process.env.NEXT_PUBLIC_SENTRY_DSN) ??
  "https://o4511480415584256.ingest.us.sentry.io";
const CLERK_LIVE_ORIGIN = "https://clerk.barmatrix.app";
const CLERK_TEST_ORIGIN = "https://*.clerk.accounts.dev";
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const ALLOW_CLERK_TEST_ORIGIN =
  IS_DEV || CLERK_PUBLISHABLE_KEY.startsWith("pk_test_");
const CLERK_ORIGINS = unique([
  CLERK_LIVE_ORIGIN,
  ALLOW_CLERK_TEST_ORIGIN ? CLERK_TEST_ORIGIN : undefined,
]);

const SCRIPT_SOURCES = unique([
  "'self'",
  "'unsafe-inline'",
  IS_DEV ? "'unsafe-eval'" : undefined,
  ...CLERK_ORIGINS,
  POSTHOG_ASSET_ORIGIN,
]);

const CONNECT_SOURCES = unique([
  "'self'",
  "https://api.barmatrix.app",
  API_ORIGIN,
  ...CLERK_ORIGINS,
  POSTHOG_ORIGIN,
  POSTHOG_ASSET_ORIGIN,
  SENTRY_INGEST_ORIGIN,
  "https://*.ingest.us.sentry.io",
  "https://*.ingest.sentry.io",
  ...(ALLOW_LOCAL_CONNECT
    ? ["http://localhost:*", "http://127.0.0.1:*", "ws://localhost:*", "ws://127.0.0.1:*"]
    : []),
]);

const CSP_DIRECTIVES = [
  "default-src 'self'",
  `script-src ${SCRIPT_SOURCES.join(" ")}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src ${CONNECT_SOURCES.join(" ")}`,
  `frame-src 'self' ${CLERK_ORIGINS.join(" ")}`,
  `form-action 'self' ${CLERK_ORIGINS.join(" ")}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
];

const CONTENT_SECURITY_POLICY = CSP_DIRECTIVES.join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

// Vercel hosts both static and server-rendered pages — keep SSR available
// for future dynamic pages (cohort capacity, dashboard, drills, forensics).
// Image optimization is on by default on Vercel; no extra config needed.
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  // Canonical host: redirect www.barmatrix.app -> barmatrix.app (apex).
  async redirects() {
    return [
      {
        source: "/tiktok",
        destination: "/tiktok.html",
        permanent: true,
      },
      {
        source: "/lp-red-zone",
        destination: "/lp-red-zone.html",
        permanent: true,
      },
      {
        source: "/lp-red-zone-drills",
        destination: "/lp-red-zone-drills.html",
        permanent: true,
      },
      {
        source: "/lp-wrong-answer-forensics",
        destination: "/lp-wrong-answer-forensics.html",
        permanent: true,
      },
      {
        source: "/lp-crimpro-vehicle-search",
        destination: "/lp-crimpro-vehicle-search.html",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.barmatrix.app" }],
        destination: "https://barmatrix.app/:path*",
        permanent: true,
      },
      {
        source: "/webinar.html",
        destination: "/webinar",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT ?? "barmatrix-app",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
});
