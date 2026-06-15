"use client";

// Mobile navigation for the v3 DashboardShell. The desktop sidebar is
// `hidden lg:flex`, so below the lg breakpoint there was NO nav at all — phones
// could not reach any dashboard destination. This adds a hamburger button
// (shown only < lg) that opens a slide-in drawer rendering the SAME nav
// sections + user footer as the sidebar, so the single source of nav data
// (built in DashboardShell) drives both. Closes on link click, overlay click,
// or Escape.

import { useEffect, useState } from "react";
import Link from "next/link";

export interface MobileNavLink {
  href: string;
  icon: string;
  label: string;
  badge?: string | null;
  redBadge?: boolean;
  active?: boolean;
}

export interface MobileNavSection {
  section: string;
  links: MobileNavLink[];
}

export function DashboardMobileNav({
  nav,
  user,
}: {
  nav: MobileNavSection[];
  user: { name: string; initials: string; sublabel: string };
}) {
  const [open, setOpen] = useState(false);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Hamburger — only below lg (desktop has the persistent sidebar) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="dashboard-mobile-drawer"
        className="grid h-10 w-10 place-items-center border border-[var(--rule-soft)] text-zinc-700"
      >
        <span aria-hidden className="text-xl leading-none">
          ☰
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          {/* Drawer — same content as the desktop sidebar */}
          <div
            id="dashboard-mobile-drawer"
            className="absolute left-0 top-0 flex h-full w-[280px] max-w-[85vw] flex-col bg-zinc-950 text-zinc-300 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <span className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center bg-[var(--red)] font-serif text-lg font-bold text-white">
                  B
                </span>
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  BarMatrix<span className="text-[var(--red)]">.</span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="grid h-8 w-8 place-items-center text-zinc-400 hover:text-white"
              >
                <span aria-hidden className="text-lg leading-none">
                  ✕
                </span>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-3">
              {nav.map((sec) => (
                <div key={sec.section} className="mb-4">
                  <div className="px-5 pb-1.5 pt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                    ▌ {sec.section}
                  </div>
                  {sec.links.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      prefetch={false}
                      onClick={() => setOpen(false)}
                      aria-current={l.active ? "page" : undefined}
                      className={`flex items-center gap-3 border-l-2 px-5 py-3 text-sm transition-colors ${
                        l.active
                          ? "border-[var(--red)] bg-white/[0.06] font-medium text-white"
                          : "border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span className="w-4 text-center font-mono text-base text-zinc-500">
                        {l.icon}
                      </span>
                      <span className="flex-1">{l.label}</span>
                      {l.badge ? (
                        <span
                          className={`px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.1em] ${
                            l.redBadge
                              ? "bg-[var(--red)] text-white"
                              : "bg-white/10 text-zinc-400"
                          }`}
                        >
                          {l.badge}
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>

            <Link
              href="/account"
              aria-label="Account & billing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-t border-white/10 px-5 py-4 transition-colors hover:bg-white/[0.05]"
            >
              <span className="grid h-9 w-9 place-items-center bg-white/10 font-mono text-xs font-bold text-white">
                {user.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">
                  {user.name}
                </span>
                <span className="block truncate font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500">
                  {user.sublabel}
                </span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500">
                Account
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
