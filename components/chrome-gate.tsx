"use client";

import { usePathname } from "next/navigation";

// Hides the marketing site chrome (top nav + footer) on the immersive app-shell
// routes — the v3 command-deck dashboard provides its own persistent
// sidebar+topbar navigation, so the marketing nav (Pricing / Sign in / Free
// Diagnostic / FAQ …) and the marketing footer are redundant noise inside the
// paid app. Everywhere else renders the chrome unchanged.
//
// Scope is intentionally tight: only the command-deck shell surfaces. Other
// study pages keep the marketing chrome until they get their own shell.
function isAppShellRoute(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/preview/dashboard-");
}

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  if (isAppShellRoute(pathname)) return null;
  return <>{children}</>;
}
