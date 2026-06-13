// Pure presentational helpers for the Boot Camp surfaces (Web Component 05).
// No React, no fetch — kept separate so the routes stay declarative and these
// stay trivially correct.

import type {
  BootCampDayProgress,
  BootCampDayStatus,
} from "@/lib/api-client";

/** snake_case / kebab-case tag -> human label ("effect_on_listener" -> "Effect On Listener"). */
export function humanizeTag(tag: string): string {
  return tag
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Boot camp seed targets can be taxonomy IDs; render them as student-facing focus labels. */
export function formatBootCampTargetLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Boot camp focus";

  const fourthAmendment = trimmed.match(/^CRIM-4A-BOOT-(\d{1,3})$/);
  if (fourthAmendment) {
    return `Fourth Amendment Focus ${Number(fourthAmendment[1])}`;
  }

  const warrantException = trimmed.match(/^CRIM-WE-(\d{1,3})$/);
  if (warrantException) {
    return `Warrant Exception Focus ${Number(warrantException[1])}`;
  }

  return humanizeTag(trimmed);
}

export interface CampProgress {
  completed: number;
  total: number;
  pct: number;
}

/** Count of "complete" days over total, as a 0-100 percent (rounded). */
export function bootCampProgress(days: BootCampDayProgress[]): CampProgress {
  const total = days.length;
  const completed = days.filter((d) => d.status === "complete").length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, pct };
}

export const DAY_STATUS_LABEL: Record<BootCampDayStatus, string> = {
  complete: "Complete",
  current: "Available",
  locked: "Locked",
};

/** aria-label for a day progress chip, e.g. "Day 2: Available". */
export function dayChipLabel(day: BootCampDayProgress): string {
  return `Day ${day.day}: ${DAY_STATUS_LABEL[day.status]}`;
}

export interface MasteryBand {
  label: string;
  /** Tailwind text/bar tone, matching the dashboard mastery board bands. */
  tone: "critical" | "watch" | "stable";
}

/** Band a 0-1 mastery score for display (mirrors dashboard/mastery thresholds). */
export function masteryBand(score: number): MasteryBand {
  const safe = Number.isFinite(score) ? Math.max(0, Math.min(1, score)) : 0;
  if (safe < 0.4) return { label: "Critical", tone: "critical" };
  if (safe < 0.75) return { label: "Watch", tone: "watch" };
  return { label: "Mastered", tone: "stable" };
}

/** Whole-percent string for a 0-1 score. */
export function pct(score: number | null | undefined): number {
  if (typeof score !== "number" || !Number.isFinite(score)) return 0;
  return Math.round(Math.max(0, Math.min(1, score)) * 100);
}
