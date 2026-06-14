import { VERSE_BANK, type BankVerse, type VerseTheme } from "@/lib/verse-bank";
import type { Readiness } from "@/lib/readiness";

const FINAL_SPRINT_DAYS = 14;

// Meet the student where the readiness signal has them — echoes ABM's
// verseThemeForState. Pure + deterministic.
export function verseThemeForReadiness(
  r: Readiness,
  daysToExam: number | null,
): VerseTheme {
  if (daysToExam !== null && daysToExam >= 0 && daysToExam <= FINAL_SPRINT_DAYS) {
    return "courage";
  }
  if (!r.hasSignal) return "wisdom"; // hasn't started — "start here"
  switch (r.band) {
    case "Building":
      return "perseverance";
    case "On Track":
      return "diligence";
    case "Strong":
    case "Exam-Ready":
      return "victory";
    default:
      return "hope";
  }
}

// Deterministic "verse of the day" for a theme. Seeded by a stable integer
// (the server-sent exam countdown) so the server render and client hydration
// agree — and it naturally rotates day to day. Falls back to the whole bank if
// the theme has no verses.
export function pickDailyVerse(theme: VerseTheme, seed: number): BankVerse {
  const pool = VERSE_BANK.filter((v) => v.themes.includes(theme));
  const list = pool.length > 0 ? pool : VERSE_BANK;
  const idx = ((Math.abs(Math.trunc(seed)) % list.length) + list.length) % list.length;
  return list[idx]!;
}
