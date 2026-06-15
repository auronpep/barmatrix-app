import type { CertCapture } from "@/lib/api-client";

const CAPTURE_LABELS: Record<CertCapture, string> = {
  single: "Answer classification",
  rule_distractor: "Rule and distractor split",
  axis_survivor: "Decision axis and survivor",
  band: "Confidence calibration",
  integration: "Full C3 integration",
};

const OPTION_LABELS: Record<string, string> = {
  HIGH: "High confidence",
  MED: "Medium confidence",
  COIN: "Coin flip",
  CUT: "Cut",
  CLASH: "Clash",
  CALL: "Call",
  "NOT-TRUE": "Not true",
  "NOT-RESPONSIVE": "Not responsive",
};

export function formatCertificationCode(value: string): string {
  const trimmed = value.trim();
  const methodMatch = /^M(\d+)$/i.exec(trimmed);
  if (methodMatch) return `Mastery Check ${methodMatch[1]}`;
  const itemMatch = /^M(\d+)-(\d+)$/i.exec(trimmed);
  if (itemMatch) return `Check ${itemMatch[1]}, Item ${itemMatch[2]}`;
  return titleize(trimmed);
}

export function formatCertificationCapture(capture: CertCapture): string {
  return CAPTURE_LABELS[capture] ?? titleize(capture);
}

export function formatCertificationOption(value: string | null | undefined): string {
  if (!value) return "Not answered";
  const trimmed = value.trim();
  return OPTION_LABELS[trimmed] ?? titleize(trimmed);
}

export function formatCertificationCondition(value: string): string {
  return titleize(value);
}

export function formatCertificationLesson(value: string): string {
  return titleize(value.replace(/^lesson[-_]?/i, "Lesson "));
}

function titleize(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bC3\b/i, "C3")
    .replace(/\bJmol\b/g, "JMOL");
}
