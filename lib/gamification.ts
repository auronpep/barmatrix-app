// Frontend mirror of the gamification badge catalog + display formatters.
// Kept in sync with api-repo/src/lib/gamification.ts BADGE_CATALOG (same slugs).

export type BadgeSlug =
  | "first-day"
  | "halfway"
  | "perfect-day"
  | "camp-complete"
  | "mastery-ace"
  | "streak-3"
  | "streak-7"
  | "guided-day"
  | "catchup-clear";

export interface BadgeMeta {
  label: string;
  description: string;
  emoji: string;
}

export const BADGE_CATALOG: Record<BadgeSlug, BadgeMeta> = {
  "first-day": { label: "First Day Down", description: "Completed your first boot-camp day.", emoji: "🌱" },
  halfway: { label: "Halfway There", description: "Reached the midpoint of a boot camp.", emoji: "⛰️" },
  "perfect-day": { label: "Perfect Day", description: "Answered every question in a day correctly.", emoji: "💯" },
  "camp-complete": { label: "Camp Cleared", description: "Passed a boot camp's mastery check.", emoji: "🏁" },
  "mastery-ace": { label: "Mastery Ace", description: "Scored 90% or higher on a mastery check.", emoji: "🎯" },
  "streak-3": { label: "On a Roll", description: "Practiced three days in a row.", emoji: "🔥" },
  "streak-7": { label: "Unstoppable", description: "Practiced seven days in a row.", emoji: "⚡" },
  "guided-day": { label: "Guided Day Complete", description: "Completed a full Lead Me day.", emoji: "🧭" },
  "catchup-clear": { label: "Catchup Cleared", description: "Completed a missed micro-task from the catchup bank.", emoji: "✅" },
};

export const BADGE_ORDER: BadgeSlug[] = [
  "first-day",
  "halfway",
  "perfect-day",
  "camp-complete",
  "mastery-ace",
  "streak-3",
  "streak-7",
  "guided-day",
  "catchup-clear",
];

/** Thousands-separated XP, e.g. 1340 -> "1,340". */
export function formatXp(value: number): string {
  return (Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0).toLocaleString("en-US");
}

/** Short streak label, e.g. 4 -> "4-day streak"; 0 -> "No streak yet". */
export function streakLabel(count: number): string {
  if (!Number.isFinite(count) || count <= 0) return "No streak yet";
  return `${count}-day streak`;
}

export function badgeMeta(slug: string): BadgeMeta {
  return BADGE_CATALOG[slug as BadgeSlug] ?? { label: slug, description: "", emoji: "🏅" };
}
