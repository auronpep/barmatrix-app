import Link from "next/link";
import type { ReactNode } from "react";
import type { CommandDeckData, CommandDeckStudent } from "@/lib/api-client";
import { DashboardMobileNav } from "@/components/preview-dashboard/dashboard-mobile-nav";

interface NavLink {
  href: string;
  icon: string;
  label: string;
  badge?: string | null;
  redBadge?: boolean;
  active?: boolean;
}

interface NavSection {
  section: string;
  links: NavLink[];
}

// The persistent app navigation for v3: a dark left sidebar (STUDY /
// DIAGNOSTICS / MORE) + a light topbar with the page title, streak, and exam
// countdown. Ported from the design prototype's shell.jsx. Nav links point at
// the real app routes. Badges are derived from live deck data where honest
// (active red zones, drills due); non-derivable design badges are omitted rather
// than faked.
export function DashboardShell({
  data,
  user,
  title = "Today's Command Deck",
  crumb = "DASHBOARD",
  children,
}: {
  data: CommandDeckData;
  user: { name: string; initials: string; sublabel: string };
  title?: string;
  crumb?: string;
  children: ReactNode;
}) {
  const s: CommandDeckStudent = data.student;
  const activeRz = data.red_zones.filter((r) => r.active).length;
  const due = data.queue?.length ?? (data.next_up ? 1 : 0);

  const nav: NavSection[] = [
    {
      section: "STUDY",
      links: [
        { href: "/dashboard", icon: "◧", label: "Dashboard", active: true },
        { href: "/foundations", icon: "≣", label: "The Method" },
        {
          href: "/drills",
          icon: "▶",
          label: "Drill Mode",
          badge: due > 0 ? `${due} DUE` : null,
          redBadge: true,
        },
        {
          href: "/red-zones",
          icon: "▌",
          label: "Red Zones",
          badge: activeRz > 0 ? String(activeRz) : null,
          redBadge: true,
        },
        { href: "/matrix", icon: "▦", label: "Tension Matrix" },
      ],
    },
    {
      section: "COMPONENTS",
      links: [
        { href: "/diagnostic", icon: "▥", label: "Diagnostic" },
        { href: "/practice", icon: "◇", label: "Practice" },
        { href: "/timed-sets", icon: "◷", label: "Timed Sets" },
        { href: "/boot-camps", icon: "▧", label: "Boot Camps" },
        { href: "/certification", icon: "✓", label: "Certification" },
      ],
    },
    {
      section: "DIAGNOSTICS",
      links: [
        { href: "/pattern-board", icon: "▤", label: "Pattern Board" },
        { href: "/misconceptions", icon: "✕", label: "Misconceptions" },
        { href: "/question-history", icon: "≡", label: "Question History" },
        { href: "/traps", icon: "×", label: "Trap Taxonomy" },
        { href: "/tensions", icon: "⌁", label: "Tension Map" },
      ],
    },
    {
      section: "VIEWS",
      links: [
        { href: "/dashboard/path", icon: "↳", label: "My Path" },
        { href: "/dashboard/mastery", icon: "◆", label: "Mastery Board" },
        { href: "/dashboard/final-sprint", icon: "⚑", label: "Final Sprint" },
      ],
    },
    {
      section: "THE WALK",
      links: [
        { href: "/walk", icon: "✝", label: "The Walk" },
        { href: "/walk#daily-bread", icon: "✦", label: "Daily Bread" },
        { href: "/walk#prayer", icon: "✎", label: "Prayer Journal" },
      ],
    },
    {
      section: "MORE",
      links: [
        { href: "/coach", icon: "◆", label: "Coach" },
        { href: "/mobile-apps", icon: "□", label: "Mobile Apps" },
        { href: "/support", icon: "?", label: "Support" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg,#f6f3ec)] lg:grid lg:grid-cols-[260px_1fr]">
      {/* ── Sidebar ───────────────────────────────── */}
      <aside className="hidden flex-col bg-zinc-950 text-zinc-300 lg:flex">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-6 py-5">
          <span className="grid h-8 w-8 place-items-center bg-[var(--red)] font-serif text-lg font-bold text-white">
            B
          </span>
          <span className="font-serif text-lg font-bold tracking-tight text-white">
            BarMatrix<span className="text-[var(--red)]">.</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {nav.map((sec) => (
            <div key={sec.section} className="mb-4">
              <div className="px-6 pb-1.5 pt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                ▌ {sec.section}
              </div>
              {sec.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  prefetch={false}
                  aria-current={l.active ? "page" : undefined}
                  className={`flex items-center gap-3 border-l-2 px-6 py-2.5 text-sm transition-colors ${
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
          className="flex items-center gap-3 border-t border-white/10 px-6 py-4 transition-colors hover:bg-white/[0.05]"
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
      </aside>

      {/* ── Main column ───────────────────────────── */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--rule)] bg-[var(--paper,#fffdf7)] px-6 py-4">
          <div className="flex items-center gap-3">
            <DashboardMobileNav nav={nav} user={user} />
            <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              BARMATRIX <span className="text-zinc-300">/</span> {crumb}
            </div>
            <div className="mt-0.5 font-serif text-2xl font-bold tracking-tight text-zinc-950">
              {title}
            </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1.5 border border-[var(--rule-soft)] px-3 py-1.5">
              <span className="font-serif text-lg font-bold leading-none tabular-nums text-[var(--red)]">
                {s.streak_days}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-500">
                Day Streak
              </span>
            </div>
            {s.days_to_exam !== null ? (
              <div className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-600 sm:block">
                <span className="font-serif text-base font-bold text-zinc-950">
                  {s.days_to_exam}D
                </span>{" "}
                to MBE
              </div>
            ) : null}
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
