"use client";

// /walk — Daily spiritual companion for bar exam candidates.
// Covers June 15 – July 29, 2026 (California bar exam).
// Sections are hash-addressable: #daily-bread, #prayer, #armor, #enemy-lie, #communion

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  WALK_DATA,
  getEntryForDate,
  getAdjacentDates,
  EXAM_DATE,
  type WalkEntry,
} from "@/lib/walk-data";

export default function WalkPage() {
  const [activeDate, setActiveDate] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    // Use today if it's in the walk window; otherwise fall back to the last available day
    const inRange = WALK_DATA.some((e) => e.date === dateStr);
    setActiveDate(inRange ? dateStr : WALK_DATA[WALK_DATA.length - 1].date);
  }, []);

  if (!activeDate) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-20">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-400">
            Loading today&apos;s walk…
          </p>
        </div>
      </Shell>
    );
  }

  const entry = getEntryForDate(activeDate);
  if (!entry) {
    return (
      <Shell>
        <div className="py-20 text-center">
          <p className="font-serif text-2xl text-zinc-500">
            No entry for this date.
          </p>
          <button
            onClick={() => setActiveDate(WALK_DATA[0].date)}
            className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-red-700 underline"
          >
            Return to Day 1
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <WalkHeader entry={entry} activeDate={activeDate} />

      <div className="mt-12 space-y-1">
        <NavAnchor id="daily-bread" label="Daily Bread" />
        <NavAnchor id="prayer" label="Prayer" />
        <NavAnchor id="armor" label="Today's Armor" />
        <NavAnchor id="enemy-lie" label="Enemy's Lie / God's Truth" />
        <NavAnchor id="communion" label="Communion Practice" />
      </div>

      <hr className="my-10 border-zinc-200" />

      <DailyBreadSection entry={entry} />
      <PrayerSection entry={entry} />
      <ArmorSection entry={entry} />
      <EnemyLieSection entry={entry} />
      <CommunionSection entry={entry} />

      <DayNav activeDate={activeDate} onDateChange={setActiveDate} />
      <CalendarStrip activeDate={activeDate} onDateChange={setActiveDate} />
      <WalkFooter />
    </Shell>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────

function WalkHeader({
  entry,
  activeDate,
}: {
  entry: WalkEntry;
  activeDate: string;
}) {
  const daysUntilExam = daysUntil(EXAM_DATE, activeDate);
  const formattedDate = formatDate(entry.date);

  return (
    <header>
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-zinc-400">
        <span aria-hidden className="inline-block h-3.5 w-[3px] bg-red-700" />
        Walk in the Spirit · Bar Exam 2026
      </p>

      <h1 className="mt-6 font-serif text-5xl font-semibold leading-none text-zinc-950 sm:text-6xl">
        {entry.label ? (
          <span>
            <span className="block font-mono text-sm uppercase tracking-[0.22em] text-red-700">
              {entry.label}
            </span>
            <span className="mt-2 block">Day {entry.day}.</span>
          </span>
        ) : (
          <>Day {entry.day}.</>
        )}
      </h1>

      <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
        {formattedDate}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <div className="border-2 border-red-700 px-6 py-3 text-center">
          <p className="font-serif text-4xl font-semibold leading-none text-red-700">
            {daysUntilExam}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {daysUntilExam === 1 ? "day" : "days"} to exam
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
            California Bar · July 28–29
          </p>
          <p className="mt-1 max-w-[28ch] text-sm leading-6 text-zinc-600">
            Walk in the Spirit, and ye shall not fulfil the lust of the flesh.
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
            Galatians 5:16 · KJV
          </p>
        </div>
      </div>
    </header>
  );
}

// ── Section anchors ────────────────────────────────────────────────────────

function NavAnchor({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-900"
    >
      <span aria-hidden className="inline-block h-px w-4 bg-zinc-300" />
      {label}
    </a>
  );
}

// ── Daily Bread ────────────────────────────────────────────────────────────

function DailyBreadSection({ entry }: { entry: WalkEntry }) {
  return (
    <section id="daily-bread" className="scroll-mt-20">
      <SectionLabel>Daily Bread</SectionLabel>
      <figure className="mt-6 border-l-4 border-red-700 pl-6">
        <blockquote className="font-serif text-xl italic leading-relaxed text-zinc-800 sm:text-2xl">
          &ldquo;{entry.dailyBread.scripture}&rdquo;
        </blockquote>
        <figcaption className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-red-700">
          {entry.dailyBread.reference} · KJV
        </figcaption>
      </figure>
      <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-700">
        {entry.dailyBread.reflection}
      </p>
      <SectionDivider />
    </section>
  );
}

// ── Prayer ─────────────────────────────────────────────────────────────────

function PrayerSection({ entry }: { entry: WalkEntry }) {
  return (
    <section id="prayer" className="scroll-mt-20">
      <SectionLabel>Today&apos;s Prayer</SectionLabel>
      <p className="mt-6 max-w-2xl text-base italic leading-9 text-zinc-700">
        {entry.prayer}
      </p>
      <SectionDivider />
    </section>
  );
}

// ── Armor Word ─────────────────────────────────────────────────────────────

function ArmorSection({ entry }: { entry: WalkEntry }) {
  return (
    <section id="armor" className="scroll-mt-20">
      <SectionLabel>Today&apos;s Armor · Ephesians 6</SectionLabel>
      <div className="mt-6 border border-zinc-200 bg-zinc-50 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-red-700">
          {entry.armorWord.piece}
        </p>
        <p className="mt-3 font-serif text-base italic leading-7 text-zinc-700">
          &ldquo;{entry.armorWord.verse}&rdquo;
        </p>
        <p className="mt-4 text-sm leading-7 text-zinc-700">
          <span className="font-semibold text-zinc-900">For today: </span>
          {entry.armorWord.application}
        </p>
      </div>
      <SectionDivider />
    </section>
  );
}

// ── Enemy's Lie / God's Truth ──────────────────────────────────────────────

function EnemyLieSection({ entry }: { entry: WalkEntry }) {
  return (
    <section id="enemy-lie" className="scroll-mt-20">
      <SectionLabel>Enemy&apos;s Lie · God&apos;s Truth</SectionLabel>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border border-zinc-200 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            The lie
          </p>
          <p className="mt-3 font-serif text-base italic leading-7 text-zinc-500">
            &ldquo;{entry.enemyLie.lie}&rdquo;
          </p>
        </div>
        <div className="border-2 border-red-700 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-700">
            God&apos;s truth
          </p>
          <p className="mt-3 font-serif text-base italic leading-7 text-zinc-800">
            &ldquo;{entry.enemyLie.truth}&rdquo;
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-red-700">
            {entry.enemyLie.reference} · KJV
          </p>
        </div>
      </div>
      <SectionDivider />
    </section>
  );
}

// ── Communion Practice ─────────────────────────────────────────────────────

function CommunionSection({ entry }: { entry: WalkEntry }) {
  return (
    <section id="communion" className="scroll-mt-20">
      <SectionLabel>Communion Practice · 60 Seconds</SectionLabel>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
        Take 60 seconds. Speak these three lines aloud or silently before you
        open your study materials.
      </p>
      <div className="mt-6 space-y-4">
        <CommunionLine
          prefix="I am thankful for"
          value={entry.communion.gratitude}
          color="text-zinc-700"
        />
        <CommunionLine
          prefix="I release"
          value={entry.communion.release}
          color="text-zinc-500"
        />
        <CommunionLine
          prefix="I ask for"
          value={entry.communion.ask}
          color="text-red-700"
        />
      </div>
      <SectionDivider />
    </section>
  );
}

function CommunionLine({
  prefix,
  value,
  color,
}: {
  prefix: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span
        className={`mt-0.5 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] ${color} w-24`}
      >
        {prefix}
      </span>
      <p className={`font-serif text-base leading-6 ${color}`}>{value}</p>
    </div>
  );
}

// ── Day Navigation ─────────────────────────────────────────────────────────

function DayNav({
  activeDate,
  onDateChange,
}: {
  activeDate: string;
  onDateChange: (d: string) => void;
}) {
  const { prev, next } = getAdjacentDates(activeDate);
  const prevEntry = prev ? getEntryForDate(prev) : null;
  const nextEntry = next ? getEntryForDate(next) : null;

  return (
    <nav
      aria-label="Day navigation"
      className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6"
    >
      {prevEntry ? (
        <button
          onClick={() => {
            onDateChange(prevEntry.date);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-900"
        >
          ← Day {prevEntry.day}
        </button>
      ) : (
        <span />
      )}
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-300">
        {formatDate(activeDate)}
      </span>
      {nextEntry ? (
        <button
          onClick={() => {
            onDateChange(nextEntry.date);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-900"
        >
          Day {nextEntry.day} →
        </button>
      ) : (
        <span />
      )}
    </nav>
  );
}

// ── Calendar Strip ─────────────────────────────────────────────────────────

function CalendarStrip({
  activeDate,
  onDateChange,
}: {
  activeDate: string;
  onDateChange: (d: string) => void;
}) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="mt-12">
      <SectionLabel>Full Calendar · June 15 – July 29</SectionLabel>
      <div className="mt-4 grid grid-cols-7 gap-1 sm:grid-cols-9 lg:grid-cols-[15]">
        {WALK_DATA.map((entry) => {
          const isActive = entry.date === activeDate;
          const isToday = entry.date === todayStr;
          const isPast = entry.date < todayStr;
          const isExam = entry.label?.includes("EXAM");

          return (
            <button
              key={entry.date}
              onClick={() => {
                onDateChange(entry.date);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title={`Day ${entry.day} · ${formatDate(entry.date)}${entry.label ? ` · ${entry.label}` : ""}`}
              className={`relative flex flex-col items-center justify-center py-2 font-mono text-[10px] transition
                ${isActive ? "bg-red-700 text-white" : ""}
                ${!isActive && isToday ? "border-2 border-red-700 text-red-700" : ""}
                ${!isActive && !isToday && isExam ? "border border-red-700 text-red-700" : ""}
                ${!isActive && !isToday && !isExam && isPast ? "bg-zinc-100 text-zinc-400" : ""}
                ${!isActive && !isToday && !isExam && !isPast ? "bg-white text-zinc-600 hover:bg-zinc-50" : ""}
                border border-zinc-200
              `}
            >
              <span>{entry.day}</span>
              {isToday && !isActive && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-red-700" />
              )}
              {isExam && (
                <span className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-red-700" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 bg-red-700" /> Active day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 border-2 border-red-700" /> Today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 bg-zinc-100 border border-zinc-200" /> Past
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden>●</span> Exam day
        </span>
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────

function WalkFooter() {
  return (
    <footer className="mt-20 border-t-4 border-red-700 pt-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-400">
            Be Strong Fellowship
          </p>
          <p className="mt-2 max-w-[40ch] text-sm leading-6 text-zinc-600">
            Courage for the exam. Wisdom for the work. Christ above both.
          </p>
        </div>
        <nav className="space-y-2 text-sm text-zinc-600">
          <Link href="/dashboard" className="block hover:text-zinc-900">
            Dashboard
          </Link>
          <Link href="/diagnostic" className="block hover:text-zinc-900">
            Diagnostic
          </Link>
          <Link href="/drills" className="block hover:text-zinc-900">
            Repair Drills
          </Link>
          <Link href="/coach" className="block hover:text-zinc-900">
            Coach
          </Link>
        </nav>
      </div>
      <figure className="my-10 border-l-4 border-red-700 pl-5">
        <blockquote className="font-serif text-lg italic leading-relaxed text-zinc-500">
          &ldquo;Have not I commanded thee? Be strong and of a good courage; be
          not afraid, neither be thou dismayed: for the LORD thy God is with
          thee whithersoever thou goest.&rdquo;
        </blockquote>
        <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-red-700">
          Joshua 1:9 · KJV
        </figcaption>
      </figure>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
        Joshua 1:9
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-5 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
        <span>© BarMatrix · barmatrix.app</span>
        <span>Walk in the Spirit.</span>
      </div>
    </footer>
  );
}

// ── Shared primitives ──────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-700">
      <span aria-hidden className="inline-block h-3.5 w-[3px] bg-red-700" />
      {children}
    </p>
  );
}

function SectionDivider() {
  return <hr className="my-10 border-zinc-100" />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">{children}</div>
  );
}

// ── Utility functions ──────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function daysUntil(targetDate: string, fromDate: string): number {
  const [ty, tm, td] = targetDate.split("-").map(Number);
  const [fy, fm, fd] = fromDate.split("-").map(Number);
  const target = new Date(ty, tm - 1, td);
  const from = new Date(fy, fm - 1, fd);
  const diff = Math.ceil((target.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}
