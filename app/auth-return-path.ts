const AUTH_RETURN_PATHS: Record<string, string> = {
  account: "/account",
  dashboard: "/dashboard",
  "dashboard/path": "/dashboard/path",
  "dashboard/mastery": "/dashboard/mastery",
  "dashboard/final-sprint": "/dashboard/final-sprint",
  foundations: "/foundations",
};

const FALLBACK_RETURN_PATH = "/dashboard";

export function resolveAuthReturnPath(after: string | null | undefined): string {
  const raw = (after ?? "").trim();
  if (!raw) return FALLBACK_RETURN_PATH;

  // Back-compat: bare slugs like "dashboard/path" map through the table.
  const slug = raw.replace(/^\/+/, "").split(/[?#]/)[0];
  if (AUTH_RETURN_PATHS[slug]) return AUTH_RETURN_PATHS[slug]!;

  // The protected-route middleware (proxy.ts) preserves the destination as the
  // full original URL in `redirect_url`. Reduce it to a same-origin relative
  // path so deep links (/matrix, /question-history, /drills, ...) survive
  // sign-in instead of always landing on /dashboard.
  return toSafeInternalPath(raw) ?? FALLBACK_RETURN_PATH;
}

// Returns a root-relative same-origin path, or null if the value isn't a safe
// internal destination. Guards against open redirects (external origins,
// protocol-relative //host, backslash tricks) and auth-page bounce loops.
function toSafeInternalPath(value: string): string | null {
  // Strip an absolute http(s) origin if present (redirect_url is a full URL).
  const candidate = value.replace(/^https?:\/\/[^/]+/i, "");
  if (!candidate.startsWith("/")) return null;
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) return null;
  const pathOnly = candidate.split(/[?#]/)[0];
  if (pathOnly === "/sign-in" || pathOnly === "/sign-up") return null;
  return candidate;
}
