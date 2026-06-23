import Link from "next/link";
import type { CommandDeckData } from "@/lib/api-client";

interface Lens {
  href: string;
  icon: string;
  name: string;
  desc: string;
  stat: string | null;
}

// Four lenses on the same misses. Stats are derived only where the deck data
// supports them honestly; a lens with no derivable stat shows none (never a
// fabricated number).
function lenses(d: CommandDeckData): Lens[] {
  const activeRz = d.red_zones.filter((r) => r.active).length;
  const recentMisses = d.recent_attempts.filter((attempt) => !attempt.correct).length;

  return [
    {
      href: "/red-zones",
      icon: "▌",
      name: "Red-Zone V5",
      desc: "The locked repair categories that organize the new packet corpus.",
      stat: activeRz > 0 ? `${activeRz} live signals` : null,
    },
    {
      href: "/tensions",
      icon: "▦",
      name: "C3 Axis Map",
      desc: "The legal fights by outline code: side A, side B, resolver, method.",
      stat: null,
    },
    {
      href: "/traps",
      icon: "▤",
      name: "Choice Patterns",
      desc: "Wrong-answer molds, broken filters, attractions, signals, and repairs.",
      stat: recentMisses > 0 ? `${recentMisses} recent misses` : null,
    },
    {
      href: "/atlas",
      icon: "□",
      name: "Outline Packets",
      desc: "The component payloads attached to outline codes.",
      stat: null,
    },
  ];
}

export function DiagRouter({ data }: { data: CommandDeckData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {lenses(data).map((l) => (
        <Link
          key={l.href}
          href={l.href}
          prefetch={false}
          className="border-b border-r border-[var(--rule-soft)] px-5 py-[18px] transition-colors last:border-r-0 hover:bg-black/[0.025] sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="grid h-[30px] w-[30px] place-items-center border border-[var(--rule-soft)] font-mono text-[15px] text-[var(--red)]">
              {l.icon}
            </span>
            {l.stat ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500">
                {l.stat}
              </span>
            ) : null}
          </div>
          <div className="mb-1.5 font-serif text-[17px] font-bold tracking-tight text-zinc-950">
            {l.name}
          </div>
          <div className="text-[12.5px] leading-snug text-zinc-700">
            {l.desc}
          </div>
          <div className="mt-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--red)]">
            Open →
          </div>
        </Link>
      ))}
    </div>
  );
}
