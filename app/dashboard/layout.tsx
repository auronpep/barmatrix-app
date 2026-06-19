"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Dashboard hub navigation.
//
// Wraps the three signed-in dashboard views and turns the dashboard into the
// navigable "command center" the paid program is meant to be. Pure navigation
// chrome: each child page still owns its own data (via useDashboard) and its
// own <main>/<section> root, so this layout adds no <main> of its own (the
// root layout already provides one).
//
//   Primary row  — the dashboard views: Overview / Mastery / Final Sprint.
//   Program row  — launcher to the study-program surfaces that actually exist.

type NavItem = { href: string; label: string };

// The dashboard views, switched via the primary tabs. "My Path" (the J7 guided
// "lead me" surface) leads; "Full Dashboard" is the metric wall for power users
// and students who have finished the path.
const VIEW_TABS: readonly NavItem[] = [
  { href: "/dashboard/path", label: "My Path" },
  { href: "/dashboard", label: "Full Dashboard" },
  { href: "/dashboard/mastery", label: "Mastery Board" },
  { href: "/dashboard/final-sprint", label: "Final Sprint" },
];

// Study-program surfaces reachable from any dashboard view. The five program
// components lead (Tension Map, Trap Taxonomy, Practice, Drills, Boot Camps),
// then the supporting surfaces. These navigate out of the /dashboard subtree,
// so they carry no active state. Every href is a real route with a page.tsx
// (no /subjects — it has only per-subject sub-pages, no index, so it 404s).
const PROGRAM_LINKS: readonly NavItem[] = [
  { href: "/foundations", label: "The Method" },
  { href: "/matrix", label: "Tension Matrix" },
  { href: "/tensions", label: "Tension Map" },
  { href: "/misconceptions", label: "Misconceptions" },
  { href: "/question-history", label: "Question History" },
  { href: "/traps", label: "Trap Taxonomy" },
  { href: "/practice", label: "Practice" },
  { href: "/drills", label: "Drills" },
  { href: "/boot-camps", label: "Boot Camps" },
  { href: "/red-zones", label: "Red-Zone Map" },
  { href: "/timed-sets", label: "Timed Sets" },
  { href: "/mobile-apps", label: "Mobile Access" },
  { href: "/support", label: "Support" },
  { href: "/diagnostic", label: "Diagnostic" },
];

// Overview matches only the exact path so it isn't also "active" on the nested
// /dashboard/* views; the others match their own subtree.
function isViewActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  // On the exact /dashboard path the v3 command-deck shell provides its own
  // sidebar+topbar navigation, so suppress the legacy tab chrome there. Nested
  // views (/dashboard/mastery|final-sprint|path) keep the tab chrome.
  const showLegacyChrome = pathname !== "/dashboard";

  return (
    <div>
      {showLegacyChrome ? (
      <nav aria-label="Dashboard" className="border-b border-zinc-900 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-1 overflow-x-auto">
            {VIEW_TABS.map((tab) => {
              const active = isViewActive(pathname, tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 border-b-2 px-4 py-4 font-mono text-xs uppercase tracking-wider transition-colors ${
                    active
                      ? "border-red-700 text-zinc-950"
                      : "border-transparent text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-6 py-2">
            <span className="shrink-0 pr-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              Program
            </span>
            {PROGRAM_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 border border-zinc-300 bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 transition-colors hover:border-zinc-900 hover:text-zinc-950"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      ) : null}

      {children}
    </div>
  );
}
