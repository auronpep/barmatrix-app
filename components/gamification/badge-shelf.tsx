// Shows every catalog badge; earned ones in color, unearned greyed/locked.

import { BADGE_ORDER, BADGE_CATALOG } from "@/lib/gamification";

export default function BadgeShelf({ earnedSlugs }: { earnedSlugs: string[] }) {
  const earned = new Set(earnedSlugs);
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Badges">
      {BADGE_ORDER.map((slug) => {
        const meta = BADGE_CATALOG[slug];
        const has = earned.has(slug);
        return (
          <li
            key={slug}
            title={`${meta.label} — ${meta.description}`}
            aria-label={`${meta.label}: ${has ? "earned" : "locked"}`}
            className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 transition-colors ${
              has
                ? "border-amber-300 bg-amber-50 hover:border-amber-400 hover:bg-amber-100 cursor-default"
                : "border-zinc-200 bg-zinc-50 opacity-50 grayscale"
            }`}
          >
            <span className="text-base" aria-hidden="true">
              {meta.emoji}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-700">
              {meta.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
