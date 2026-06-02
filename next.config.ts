import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const SECURITY_HEADERS = [
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
        source: "/:path*",
        has: [{ type: "host", value: "www.barmatrix.app" }],
        destination: "https://barmatrix.app/:path*",
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
