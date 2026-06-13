const PRESERVE_UPPERCASE = new Set([
  "C3",
  "JMOL",
  "LLC",
  "MBE",
  "UCC",
]);

const LOWERCASE_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "vs",
  "with",
]);

export function formatStudyLabel(
  value: string | null | undefined,
  fallback = "Pending",
): string {
  const cleaned = value?.trim();
  if (!cleaned) return fallback;
  if (/^[IVX]+(?:\.[A-Z0-9]+)+$/i.test(cleaned)) return cleaned.toUpperCase();

  return cleaned
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word, index) => formatWord(word, index))
    .join(" ");
}

export function formatTensionLabel(value: string | null | undefined): string {
  return formatStudyLabel(value, "Tension mapping pending");
}

export function formatQuestionPreview(
  questionStem: string | null | undefined,
  factPattern: string | null | undefined,
): string {
  const source =
    questionStem?.trim() ||
    factPattern?.trim() ||
    "Open practice to work the full question.";
  return source.length > 190 ? `${source.slice(0, 187)}...` : source;
}

function formatWord(word: string, index: number): string {
  const normalized = word.toUpperCase();
  if (PRESERVE_UPPERCASE.has(normalized)) return normalized;

  const lower = word.toLowerCase();
  if (index > 0 && LOWERCASE_WORDS.has(lower)) return lower;

  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
