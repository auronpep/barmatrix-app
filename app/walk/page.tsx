import Link from "next/link";
import type { Metadata } from "next";
import { VERSE_BANK, type VerseTheme } from "@/lib/verse-bank";
import { PrayerJournal } from "@/components/walk/prayer-journal";

export const metadata: Metadata = {
  title: "The Walk · BarMatrix",
  description:
    "Scripture for the work — a daily word, the encouragement bank, and a private prayer journal. Study as worship.",
};

// Render per request so the daily verse rotates day to day.
export const dynamic = "force-dynamic";

const THEME_ORDER: { key: VerseTheme; label: string }[] = [
  { key: "courage", label: "Courage" },
  { key: "perseverance", label: "Perseverance" },
  { key: "diligence", label: "Diligence" },
  { key: "wisdom", label: "Wisdom" },
  { key: "rest", label: "Rest" },
  { key: "victory", label: "Victory" },
  { key: "fellowship", label: "Fellowship" },
  { key: "hope", label: "Hope" },
];

function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  return Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - start) / 86_400_000);
}

export default function WalkPage() {
  const daily = VERSE_BANK[dayOfYear(new Date()) % VERSE_BANK.length]!;

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="border-b border-zinc-900 pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--red)]">
          ✝ The Walk
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
          Study as worship.
        </h1>
        <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-zinc-600">
          The bar is the work; the LORD is the strength. Scripture isn&apos;t
          decoration here — it&apos;s the ground you stand on while you repair.
        </p>
      </div>

      {/* Daily bread */}
      <div id="daily-bread" className="mt-10 scroll-mt-20 bg-zinc-950 px-7 py-8 text-zinc-200 sm:px-10">
        <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
          ▌ Today&apos;s bread
        </p>
        <blockquote className="font-serif text-2xl leading-snug text-white sm:text-3xl">
          &ldquo;{daily.text}&rdquo;
        </blockquote>
        <cite className="mt-4 block font-mono text-xs uppercase tracking-[0.12em] not-italic text-zinc-400">
          — {daily.ref} · KJV
        </cite>
      </div>

      {/* Prayer journal */}
      <div id="prayer" className="mt-12 scroll-mt-20">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-950">
          Offer it first
        </h2>
        <div className="mt-4 border border-zinc-300 bg-zinc-50 p-5 sm:p-6">
          <PrayerJournal />
        </div>
      </div>

      {/* Scripture for the work */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-950">
          Scripture for the work
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          {VERSE_BANK.length} verses, KJV — drawn on through your study by what
          the day asks for.
        </p>
        <div className="mt-6 space-y-8">
          {THEME_ORDER.map(({ key, label }) => {
            const verses = VERSE_BANK.filter((v) => v.themes.includes(key));
            if (verses.length === 0) return null;
            return (
              <div key={key}>
                <h3 className="border-b border-zinc-200 pb-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--red)]">
                  ▌ {label}
                </h3>
                <ul className="mt-4 space-y-4">
                  {verses.map((v) => (
                    <li key={v.ref} className="border-l-2 border-zinc-200 pl-4">
                      <p className="font-serif text-lg leading-snug text-zinc-900">
                        &ldquo;{v.text}&rdquo;
                      </p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500">
                        {v.ref}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 border-t border-zinc-200 pt-6">
        <Link
          href="/dashboard"
          className="font-mono text-xs uppercase tracking-wider text-[var(--red)] hover:underline"
        >
          ← Back to your command deck
        </Link>
      </div>
    </section>
  );
}
