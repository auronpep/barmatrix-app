import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { createRouteMatcher } = require("@clerk/nextjs/server");

const appRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const proxySource = fs.readFileSync(path.join(appRoot, "proxy.ts"), "utf8");
const signInSource = fs.readFileSync(
  path.join(appRoot, "app", "sign-in", "[[...sign-in]]", "page.tsx"),
  "utf8",
);
const signUpSource = fs.readFileSync(
  path.join(appRoot, "app", "sign-up", "[[...sign-up]]", "page.tsx"),
  "utf8",
);

const routeBlock = proxySource.match(
  /createRouteMatcher\(\[\s*([\s\S]*?)\s*\]\)/,
);

assert(routeBlock, "proxy.ts must define protected routes with createRouteMatcher");

const protectedRoutes = Array.from(
  routeBlock[1].matchAll(/"([^"]+)"/g),
  (match) => match[1],
);

const requiredRoutes = [
  "/account(.*)",
  "/dashboard(.*)",
  "/drills(.*)",
  "/forensics(.*)",
  "/questions(.*)",
];

assert.deepEqual(
  protectedRoutes,
  requiredRoutes,
  "protected route list drifted from the launch app auth contract",
);

const isProtectedRoute = createRouteMatcher(protectedRoutes);

const req = (pathname) => ({ nextUrl: { pathname } });
const protectedExamples = [
  "/account",
  "/dashboard",
  "/dashboard/summary",
  "/drills/assigned",
  "/forensics/attempt-123",
  "/questions/next",
];
const publicExamples = [
  "/",
  "/app",
  "/checkout",
  "/diagnostic",
  "/diagnostic/session-1/results",
  "/pricing",
  "/red-zones",
];

for (const pathname of protectedExamples) {
  assert.equal(
    isProtectedRoute(req(pathname)),
    true,
    `${pathname} should require Clerk auth`,
  );
}

for (const pathname of publicExamples) {
  assert.equal(
    isProtectedRoute(req(pathname)),
    false,
    `${pathname} should stay public`,
  );
}

assert.match(
  proxySource,
  /NextResponse\.redirect\(signInUrl\)/,
  "proxy.ts must redirect signed-out protected-route traffic to /sign-in",
);

for (const [route, source] of [
  ["/sign-in", signInSource],
  ["/sign-up", signUpSource],
]) {
  assert.match(
    source,
    /NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/,
    `${route} must guard Clerk UI when Clerk is not configured`,
  );
  assert.match(
    source,
    /AuthUnavailable/,
    `${route} must render a no-Clerk fallback instead of a framework error`,
  );
}

console.log("auth proxy route check passed");
