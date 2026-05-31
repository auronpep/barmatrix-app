import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Vercel hosts both static and server-rendered pages — keep SSR available
// for future dynamic pages (cohort capacity, dashboard, drills, forensics).
// Image optimization is on by default on Vercel; no extra config needed.
const nextConfig: NextConfig = {
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
