import type { NextConfig } from "next";

// Vercel hosts both static and server-rendered pages — keep SSR available
// for future dynamic pages (cohort capacity, dashboard, drills, forensics).
// Image optimization is on by default on Vercel; no extra config needed.
const nextConfig: NextConfig = {};

export default nextConfig;
