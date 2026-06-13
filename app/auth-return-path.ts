const AUTH_RETURN_PATHS: Record<string, string> = {
  account: "/account",
  dashboard: "/dashboard",
  "dashboard/path": "/dashboard/path",
  "dashboard/mastery": "/dashboard/mastery",
  "dashboard/final-sprint": "/dashboard/final-sprint",
  foundations: "/foundations",
};

export function resolveAuthReturnPath(after: string | null | undefined): string {
  const normalized = (after ?? "").trim().replace(/^\/+/, "").split(/[?#]/)[0];
  return AUTH_RETURN_PATHS[normalized] ?? "/dashboard";
}
