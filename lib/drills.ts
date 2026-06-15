// Pure presentational helpers for the Drill Library surfaces (Web Component 04).
// No React, no fetch — the client pages call the typed api-client directly and
// keep these trivially correct (mirrors lib/boot-camps.ts).

/** snake_case / kebab-case tag -> human label ("effect_on_listener" -> "Effect On Listener"). */
export function humanizeTag(tag: string | null | undefined): string {
  if (!tag) return "";
  return tag
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const DRILL_NAME_OVERRIDES: Record<string, string> = {
  review_drill: "Review Missed Questions",
};

const SUBJECT_CODE_LABELS: Record<string, string> = {
  CIV: "Civil Procedure",
  CIVPRO: "Civil Procedure",
  CP: "Civil Procedure",
  CON: "Constitutional Law",
  CONT: "Contracts",
  K: "Contracts",
  CONST: "Constitutional Law",
  CRIM: "Criminal Law",
  EVID: "Evidence",
  EVD: "Evidence",
  PROP: "Real Property",
  RP: "Real Property",
  TORT: "Torts",
};

/** API drill names can be storage keys; render a customer-facing label. */
export function formatDrillName(name: string | null | undefined): string {
  if (!name) return "Targeted Drill";
  const normalized = name
    .replace(/^\d{4,}[_-]+/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return "Targeted Drill";

  const key = normalized.toLowerCase().replace(/\s+/g, "_");
  if (DRILL_NAME_OVERRIDES[key]) return DRILL_NAME_OVERRIDES[key];

  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

/** API catalog labels can be taxonomy IDs; render them as product labels. */
export function formatCatalogDrillLabel(
  label: string | null | undefined,
  slug?: string | null,
): string {
  const source = label?.trim() || slug?.trim();
  if (!source) return "Targeted Drill";

  const normalized = source.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  const codeMatch = normalized.match(/^([A-Z]{2,7})\s+[A-Z0-9]{1,8}\s+(\d{1,4})$/);
  if (codeMatch) {
    const subject = SUBJECT_CODE_LABELS[codeMatch[1]] ?? "MBE";
    const number = String(Number(codeMatch[2]));
    return `${subject} Targeted Drill ${number}`;
  }

  return formatDrillName(source);
}

/** A 0-1 proficiency score as a whole percent (clamped). */
export function proficiencyPct(score: number | null | undefined): number {
  if (typeof score !== "number" || !Number.isFinite(score)) return 0;
  return Math.round(Math.max(0, Math.min(1, score)) * 100);
}

export interface ProficiencyBand {
  label: string;
  /** Tailwind tone, matching the dashboard/boot-camp bands. */
  tone: "critical" | "watch" | "stable";
}

/** Band a 0-1 proficiency score for display (lower = redder = more urgent). */
export function proficiencyBand(score: number | null | undefined): ProficiencyBand {
  const safe =
    typeof score === "number" && Number.isFinite(score)
      ? Math.max(0, Math.min(1, score))
      : 0;
  if (safe < 0.4) return { label: "Critical", tone: "critical" };
  if (safe < 0.7) return { label: "Watch", tone: "watch" };
  return { label: "Stable", tone: "stable" };
}

export interface SubjectQuickDrill {
  slug: string;
  label: string;
  href: string;
}

// The seven subject quick-drill pages that already exist under app/drills/<subject>.
// Surfaced in the catalog so the index links the whole drill surface together.
export const SUBJECT_QUICK_DRILLS: readonly SubjectQuickDrill[] = [
  { slug: "civil-procedure", label: "Civil Procedure", href: "/drills/civil-procedure" },
  { slug: "constitutional-law", label: "Constitutional Law", href: "/drills/constitutional-law" },
  { slug: "contracts", label: "Contracts", href: "/drills/contracts" },
  { slug: "criminal-law", label: "Criminal Law", href: "/drills/criminal-law" },
  { slug: "evidence", label: "Evidence", href: "/drills/evidence" },
  { slug: "real-property", label: "Real Property", href: "/drills/real-property" },
  { slug: "torts", label: "Torts", href: "/drills/torts" },
] as const;

/** Route to a started drill's runner. */
export function drillRunHref(drillId: string): string {
  return `/drills/${drillId}`;
}
