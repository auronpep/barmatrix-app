// Shared subject-enum humanization utility.
// Maps DB enum subject values (e.g. CIVIL_PROCEDURE) to display labels.
// Falls back to title-casing the underscore-separated token for any unknown value.

export const SUBJECT_DISPLAY: Record<string, string> = {
  CIVIL_PROCEDURE: "Civil Procedure",
  CONSTITUTIONAL_LAW: "Constitutional Law",
  CONTRACTS: "Contracts",
  CRIMINAL_LAW: "Criminal Law",
  CRIMINAL_PROCEDURE: "Criminal Procedure",
  EVIDENCE: "Evidence",
  REAL_PROPERTY: "Real Property",
  TORTS: "Torts",
};

function humanizeTag(tag: string): string {
  if (!tag.includes("_")) return tag;
  return tag
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function humanizeSubject(subject: string | null | undefined): string {
  if (!subject) return "";
  return SUBJECT_DISPLAY[subject] ?? humanizeTag(subject);
}
