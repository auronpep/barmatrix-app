import Link from "next/link";
import type { CommandDeckData } from "@/lib/api-client";
import { computeReadiness } from "@/lib/readiness";
import { pickDailyVerse, verseThemeForReadiness } from "@/lib/daily-verse";

// "Daily Bread" — the spiritual layer, integrated into the deck. A state-aware
// verse of the day (KJV) that meets the student where the readiness signal has
// them, plus an "offer it first" prayer prompt. Scripture is identity here, not
// decoration (founder hard rule: never soften the Christian theming).
export function DailyBread({ data }: { data: CommandDeckData }) {
  const r = computeReadiness(data);
  const theme = verseThemeForReadiness(r, data.student.days_to_exam);
  // Seed by the stable server-sent countdown so server + client agree (no
  // hydration mismatch) and the verse rotates day to day.
  const seed = data.student.days_to_exam ?? data.student.streak_days ?? 0;
  const verse = pickDailyVerse(theme, seed);

  return (
    <div className="mb-6 grid grid-cols-1 items-stretch bg-zinc-950 text-zinc-200 lg:grid-cols-[auto_1fr]">
      <div className="hidden items-center justify-center border-r border-white/10 px-7 lg:flex">
        <span className="font-serif text-5xl text-[var(--red)]">✝</span>
      </div>
      <div className="px-6 py-5 sm:px-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
            ▌ Daily Bread
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
            {theme}
          </span>
        </div>
        <blockquote className="max-w-[78ch] font-serif text-lg leading-snug text-white sm:text-xl">
          &ldquo;{verse.text}&rdquo;
        </blockquote>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <cite className="font-mono text-[11px] uppercase tracking-[0.12em] not-italic text-zinc-400">
            — {verse.ref} · KJV
          </cite>
          <Link
            href="/walk"
            prefetch={false}
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--red)] hover:underline"
          >
            Walk with it →
          </Link>
        </div>
        <p className="mt-3 border-t border-white/10 pt-3 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-zinc-500">
          Before the first question: offer the work. &ldquo;Commit thy works unto the
          LORD, and thy thoughts shall be established.&rdquo;
        </p>
      </div>
    </div>
  );
}
