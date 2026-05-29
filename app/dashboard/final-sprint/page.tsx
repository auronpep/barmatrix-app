"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDashboard } from "@/lib/use-dashboard";

type SprintDay = {
  day: number;
  queue: string;
  repair: string;
  gate: string;
  timedSets: number;
  redZones: string[];
  drillHref: string;
  drillLabel: string;
  bootCamp: string;
};

const SPRINT_DAYS: SprintDay[] = [
  {
    day: 1,
    queue: "High-confidence wrong queue",
    repair: "Assign the strongest overlapping subject repair and confidence autopsy.",
    gate: "Same-day mastery check, then schedule a next-day retest.",
    timedSets: 2,
    redZones: ["HCW-5", "Yield 5 module", "Confidence calibration"],
    drillHref: "/drills/evidence",
    drillLabel: "Evidence drill",
    bootCamp: "Lens card + contrast drill",
  },
  {
    day: 2,
    queue: "Repeated tension queue",
    repair: "Repair the top repeated tension before adding new transfer work.",
    gate: "Retest Day 1 repairs before the new mixed set.",
    timedSets: 2,
    redZones: ["Repeated T-*", "Same-rule miss", "Retest due"],
    drillHref: "/drills/contracts",
    drillLabel: "Contracts drill",
    bootCamp: "Wrong-answer autopsy",
  },
  {
    day: 3,
    queue: "Timing cluster",
    repair: "Separate slow-correct, fast-wrong, and slow-wrong patterns.",
    gate: "Accuracy must hold inside the target-time window.",
    timedSets: 2,
    redZones: ["Slow correct", "Fast wrong", "Target-time drift"],
    drillHref: "/drills/civil-procedure",
    drillLabel: "Civil Procedure drill",
    bootCamp: "Timed transfer set",
  },
  {
    day: 4,
    queue: "Posture and remedy cluster",
    repair: "Force the procedural posture or remedy before reading the answers.",
    gate: "Any posture miss gets a next-day retest.",
    timedSets: 2,
    redZones: ["Posture miss", "Remedy swap", "Who can sue"],
    drillHref: "/drills/civil-procedure",
    drillLabel: "Civil Procedure drill",
    bootCamp: "Posture boundary module",
  },
  {
    day: 5,
    queue: "Exception cluster",
    repair: "Write the exception boundary before choosing between near neighbors.",
    gate: "Reflection lock must name what triggers and blocks the exception.",
    timedSets: 2,
    redZones: ["Exception miss", "Exception overuse", "Scope boundary"],
    drillHref: "/drills/evidence",
    drillLabel: "Evidence drill",
    bootCamp: "Exception boundary module",
  },
  {
    day: 6,
    queue: "Element and fact cluster",
    repair: "Separate missing elements from invented or ignored facts.",
    gate: "Autopsy must identify the controlling missing or invented fact.",
    timedSets: 2,
    redZones: ["Element gap", "Fact omit", "Fact invent"],
    drillHref: "/drills/torts",
    drillLabel: "Torts drill",
    bootCamp: "Fact discipline module",
  },
  {
    day: 7,
    queue: "Mixed retest one",
    repair: "No low-yield new material; retest repaired IDs and run a hidden mixed set.",
    gate: "Reopen any repair that repeats the same wrong-answer pattern.",
    timedSets: 1,
    redZones: ["Retest due", "Mixed hidden", "Relapse scan"],
    drillHref: "/dashboard/mastery",
    drillLabel: "Mastery board",
    bootCamp: "Retest compression",
  },
  {
    day: 8,
    queue: "Timing, sequence, and priority",
    repair: "Draw the sequence before answering condition, priority, or timing traps.",
    gate: "Timeline must be present before the transfer set counts.",
    timedSets: 2,
    redZones: ["Timing gate", "Priority swap", "Condition order"],
    drillHref: "/drills/real-property",
    drillLabel: "Real Property drill",
    bootCamp: "Timeline module",
  },
  {
    day: 9,
    queue: "Burden and scrutiny",
    repair: "Name who loses on silence before applying the merits rule.",
    gate: "Pass requires a correct burden or scrutiny statement.",
    timedSets: 2,
    redZones: ["Burden shift", "Scrutiny level", "Standard of proof"],
    drillHref: "/drills/constitutional-law",
    drillLabel: "Constitutional Law drill",
    bootCamp: "Burden module",
  },
  {
    day: 10,
    queue: "Near-neighbor cluster",
    repair: "Contrast the tempting rule with the rule that actually controls.",
    gate: "Student writes a changed-fact version for each miss.",
    timedSets: 2,
    redZones: ["Rule swap", "Scope creep", "Near neighbor"],
    drillHref: "/drills/contracts",
    drillLabel: "Contracts drill",
    bootCamp: "Near-neighbor module",
  },
  {
    day: 11,
    queue: "Residual high-yield queue",
    repair: "Assign the highest remaining high-yield repair not yet stabilized.",
    gate: "Timed transfer must be mixed-hidden, not blocked by topic.",
    timedSets: 2,
    redZones: ["Residual yield", "Unstable repair", "Mixed transfer"],
    drillHref: "/drills/criminal-law",
    drillLabel: "Criminal Law drill",
    bootCamp: "Residual repair module",
  },
  {
    day: 12,
    queue: "Final reopen day",
    repair: "Reopen only failed retests, high-confidence recurrences, or same-tension relapse.",
    gate: "No new module unless the priority score is high enough to justify it.",
    timedSets: 1,
    redZones: ["Failed retest", "HCW recurrence", "Same tension relapse"],
    drillHref: "/red-zones",
    drillLabel: "Red-Zone Map",
    bootCamp: "Reopen-only review",
  },
  {
    day: 13,
    queue: "Mixed retest two",
    repair: "Run due retests and a mixed-hidden set using repaired tags.",
    gate: "Any confident wrong gets a mini-autopsy only.",
    timedSets: 1,
    redZones: ["Mixed retest", "Confidence error", "Exam-watchlist candidate"],
    drillHref: "/dashboard/mastery",
    drillLabel: "Mastery board",
    bootCamp: "Confidence calibration",
  },
  {
    day: 14,
    queue: "Lock day",
    repair: "Stop adding doctrine and lock the final trap map.",
    gate: "Only mastered, pending-retest, or exam-watchlist statuses remain.",
    timedSets: 0,
    redZones: ["Open watchlist", "Reflection lock", "Logistics checklist"],
    drillHref: "/dashboard",
    drillLabel: "Dashboard",
    bootCamp: "Final trap map",
  },
];

const EXAM_DATE_STORAGE_KEY = "barmatrix.final-sprint.exam-date";
const EXAM_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function FinalSprintPathPage() {
  // `today` is intentionally NOT computed during render: new Date() differs
  // between the server render and client hydration, producing a hydration
  // mismatch. Resolve it — and any saved exam date — once after mount, and
  // render a deterministic skeleton until then. `today === null` also serves
  // as the "mounted" signal that gates localStorage writes.
  const [today, setToday] = useState<Date | null>(null);
  const [examDateInput, setExamDateInput] = useState("");
  const dash = useDashboard();

  useEffect(() => {
    let cancelled = false;
    // Deferred into an async callback (the same shape use-dashboard.ts uses) so
    // the state updates aren't called synchronously in the effect body.
    void (async () => {
      let saved = "";
      try {
        const stored = window.localStorage.getItem(EXAM_DATE_STORAGE_KEY);
        if (stored && EXAM_DATE_PATTERN.test(stored)) saved = stored;
      } catch {
        // localStorage blocked (private mode, etc.) — proceed with no saved date.
      }
      if (cancelled) return;
      if (saved) setExamDateInput(saved);
      setToday(startOfDay(new Date()));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist the exam date per-device. Gated on `today` so the pre-mount render
  // never overwrites a saved value with the empty default.
  useEffect(() => {
    if (!today) return;
    try {
      if (examDateInput) {
        window.localStorage.setItem(EXAM_DATE_STORAGE_KEY, examDateInput);
      } else {
        window.localStorage.removeItem(EXAM_DATE_STORAGE_KEY);
      }
    } catch {
      // Best-effort persistence; ignore storage failures.
    }
  }, [examDateInput, today]);

  if (!today) {
    return <SprintSkeleton dash={dash} />;
  }

  const previewDate = addDays(today, 10);
  const selectedExamDate = examDateInput ? parseDateInput(examDateInput) : previewDate;
  const hasConfirmedDate = examDateInput.length > 0;
  const daysRemaining = differenceInCalendarDays(selectedExamDate, today);
  const status = getSprintStatus(daysRemaining, hasConfirmedDate);
  const activeIndex = getActiveDayIndex(daysRemaining);
  const activeDay = SPRINT_DAYS[activeIndex];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <section className="border-b border-zinc-900 pb-8">
        <p className="eyebrow-red">Final Sprint Path</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
              The last two weeks become a daily repair plan.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
              The sprint path turns red-zone history into a day-by-day sequence:
              timed mixed sets, boot-camp repairs, retests, and the final stop-studying
              recommendation before exam day.
            </p>
          </div>
          <ExamDatePanel
            value={examDateInput}
            onChange={setExamDateInput}
            previewDate={previewDate}
            status={status}
            daysRemaining={daysRemaining}
          />
        </div>
      </section>

      <LiveTargets dash={dash} />

      {status.kind === "missing-date" && (
        <section className="mt-8 border border-zinc-900 bg-white p-6">
          <p className="eyebrow-red">Exam date required</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Confirm your exam date to activate the sprint.
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-700">
            This preview uses a sample date inside the sprint window. Once a student has a
            saved exam date, the dashboard can highlight today&apos;s assignment and hold the
            plan steady for the day.
          </p>
        </section>
      )}

      {status.kind === "completed" ? (
        <CompletedState />
      ) : (
        <>
          <section
            className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]"
            aria-labelledby="today-plan"
          >
            <TodayPlanCard day={activeDay} status={status} examDate={selectedExamDate} />
            <RestRecommendation daysRemaining={daysRemaining} />
          </section>

          <section className="mt-10 block md:hidden" aria-labelledby="mobile-sprint">
            <div className="border border-zinc-900 bg-white p-5">
              <p className="eyebrow" id="mobile-sprint">
                Mobile Summary
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold">
                Today plus the next two days
              </h2>
              <div className="mt-5 space-y-4">
                {SPRINT_DAYS.slice(activeIndex, activeIndex + 3).map((day) => (
                  <CompactDay key={day.day} day={day} active={day.day === activeDay.day} />
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10 hidden md:block" aria-labelledby="full-sprint">
            <div className="flex items-end justify-between gap-6 border-b border-zinc-300 pb-4">
              <div>
                <p className="eyebrow" id="full-sprint">
                  Fourteen Day Path
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold">
                  Repair sequence, retests, and lock day
                </h2>
              </div>
              <Link href="/dashboard/mastery" className="btn ghost btn-sm">
                View mastery board
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {SPRINT_DAYS.map((day) => (
                <SprintDayCard
                  key={day.day}
                  day={day}
                  active={day.day === activeDay.day}
                  future={day.day > activeDay.day}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function SprintSkeleton({ dash }: { dash: ReturnType<typeof useDashboard> }) {
  // Deterministic, Date-free placeholder rendered on the server and the first
  // client render so the two match; the real plan replaces it after mount.
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <section className="border-b border-zinc-900 pb-8">
        <p className="eyebrow-red">Final Sprint Path</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
              The last two weeks become a daily repair plan.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
              The sprint path turns red-zone history into a day-by-day sequence:
              timed mixed sets, boot-camp repairs, retests, and the final stop-studying
              recommendation before exam day.
            </p>
          </div>
          <aside className="border border-zinc-900 bg-white p-5">
            <p className="eyebrow">Activation</p>
            <div className="mt-4 h-11 w-full bg-zinc-100" aria-hidden="true" />
            <div className="mt-4 grid grid-cols-3 gap-3" aria-hidden="true">
              <div className="h-16 border border-zinc-200 bg-zinc-50" />
              <div className="h-16 border border-zinc-200 bg-zinc-50" />
              <div className="h-16 border border-zinc-200 bg-zinc-50" />
            </div>
          </aside>
        </div>
      </section>

      <LiveTargets dash={dash} />

      <p
        className="mt-8 font-mono text-xs uppercase tracking-wider text-zinc-400"
        aria-live="polite"
      >
        Calibrating the sprint to today&apos;s date…
      </p>
    </main>
  );
}

function LiveTargets({ dash }: { dash: ReturnType<typeof useDashboard> }) {
  if (dash.loading) return null;

  if (!dash.signedIn) {
    return (
      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-5">
        <p className="text-sm leading-6 text-zinc-800">
          Sign in to personalize the sprint with your real red zones and assigned drills.
        </p>
        <Link href="/sign-in" className="btn btn-sm">
          Sign in
        </Link>
      </section>
    );
  }

  if (dash.data && !dash.data.enrolled) {
    return (
      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-5">
        <p className="text-sm leading-6 text-zinc-800">
          Enroll to unlock your personalized final-sprint targets.
        </p>
        <Link href="/checkout" className="btn btn-sm red">
          Enroll now
        </Link>
      </section>
    );
  }

  const zones = Object.entries(dash.data?.red_zones.by_dimension ?? {})
    .flatMap(([dimension, entries]) => entries.map((e) => ({ ...e, dimension })))
    .sort((a, b) => a.proficiency_score - b.proficiency_score)
    .slice(0, 4);
  const drills = dash.data?.assigned_drills.slice(0, 4) ?? [];

  if (zones.length === 0 && drills.length === 0) {
    return (
      <section className="mt-8 border border-zinc-300 bg-zinc-50 p-5">
        <p className="text-sm leading-6 text-zinc-800">
          No red-zone history yet — the plan below is the standard sprint.{" "}
          <Link href="/diagnostic" className="border-b border-zinc-400 text-zinc-950">
            Take the diagnostic
          </Link>{" "}
          to personalize it.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 grid gap-5 md:grid-cols-2" aria-label="Your live sprint targets">
      <div className="border border-zinc-900 bg-white p-5">
        <p className="eyebrow-red">Your weakest red zones</p>
        <ul className="mt-4 space-y-3">
          {zones.map((z) => (
            <li
              key={`${z.dimension}-${z.tag}`}
              className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0"
            >
              <span className="min-w-0 break-words text-sm font-medium text-zinc-900">
                {z.tag}
              </span>
              <span className="shrink-0 font-mono text-xs text-red-700">
                {Math.round(Math.max(0, Math.min(1, z.proficiency_score)) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-zinc-900 bg-white p-5">
        <p className="eyebrow-red">Assigned repair drills</p>
        {drills.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {drills.map((d) => (
              <li
                key={d.assignment_id}
                className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0"
              >
                <span className="min-w-0 break-words text-sm font-medium text-zinc-900">
                  {d.drill_name}
                </span>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  {d.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            No drills assigned yet. Work a drill or the diagnostic to generate repair assignments.
          </p>
        )}
        <Link href="/red-zones" className="btn btn-sm ghost mt-5">
          Open Red-Zone Map
        </Link>
      </div>
    </section>
  );
}

function ExamDatePanel({
  value,
  onChange,
  previewDate,
  status,
  daysRemaining,
}: {
  value: string;
  onChange: (value: string) => void;
  previewDate: Date;
  status: SprintStatus;
  daysRemaining: number;
}) {
  return (
    <aside className="border border-zinc-900 bg-white p-5">
      <p className="eyebrow">Activation</p>
      <label className="mt-4 block text-sm font-semibold text-zinc-900" htmlFor="exam-date">
        Exam date
      </label>
      <input
        id="exam-date"
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border border-zinc-300 bg-white px-3 py-3 font-mono text-sm text-zinc-900"
      />
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Metric label="Days left" value={String(Math.max(daysRemaining, 0))} />
        <Metric label="Timed sets" value="2/day" />
        <Metric label="Window" value="14d" />
      </div>
      <p className="mt-4 text-sm leading-6 text-zinc-600">
        {status.message} {value ? "" : `Preview date: ${formatDisplayDate(previewDate)}.`}
      </p>
      {!value && (
        <button
          type="button"
          className="btn red btn-sm mt-4"
          onClick={() => onChange(formatDateInput(previewDate))}
        >
          Use preview date
        </button>
      )}
    </aside>
  );
}

function TodayPlanCard({
  day,
  status,
  examDate,
}: {
  day: SprintDay;
  status: SprintStatus;
  examDate: Date;
}) {
  return (
    <article className="border border-zinc-900 bg-white p-6">
      <p className="eyebrow-red" id="today-plan">
        Today&apos;s Plan
      </p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-semibold">Day {day.day}</h2>
          <p className="mt-2 text-sm text-zinc-600">{status.message}</p>
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-zinc-500">
          {formatDisplayDate(examDate)}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <PlanLine label="Queue" value={day.queue} />
        <PlanLine label="Repair" value={day.repair} />
        <PlanLine label="Gate" value={day.gate} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={day.drillHref} className="btn red btn-sm">
          {day.drillLabel}
        </Link>
        <Link href="/red-zones" className="btn ghost btn-sm">
          Red-Zone Map
        </Link>
      </div>
    </article>
  );
}

function RestRecommendation({ daysRemaining }: { daysRemaining: number }) {
  const isRestWindow = daysRemaining <= 1;

  return (
    <article
      className={`border p-6 ${
        isRestWindow ? "border-red-700 bg-red-50" : "border-zinc-300 bg-white"
      }`}
    >
      <p className={isRestWindow ? "eyebrow-red" : "eyebrow"}>Final 24 Hours</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold">
        {isRestWindow ? "Stop adding doctrine." : "Rest day is built in."}
      </h2>
      <p className="mt-3 leading-7 text-zinc-700">
        The final day switches from new study to reflection locks, short retests, sleep,
        hydration, and exam logistics. Unresolved items move to the exam-watchlist instead
        of becoming a new doctrine assignment.
      </p>
      <ul className="mt-5 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
        <li>Sleep and logistics check</li>
        <li>Final trap map review</li>
        <li>Three-item watchlist retests</li>
        <li>No new doctrine module</li>
      </ul>
    </article>
  );
}

function SprintDayCard({
  day,
  active,
  future,
}: {
  day: SprintDay;
  active: boolean;
  future: boolean;
}) {
  return (
    <article
      className={`border bg-white p-5 ${
        active ? "border-red-700 shadow-[inset_4px_0_0_#c8102e]" : "border-zinc-300"
      } ${future ? "opacity-90" : ""}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-3">
        <div>
          <p className={active ? "eyebrow-red" : "eyebrow"}>{active ? "Today" : day.queue}</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold">Day {day.day}</h3>
        </div>
        <span className="font-mono text-xs text-zinc-500">{day.timedSets} timed sets</span>
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-700">{day.repair}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {day.redZones.map((zone) => (
          <span
            key={zone}
            className="border border-zinc-300 bg-zinc-50 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-700"
          >
            {zone}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <PlanLine label="Boot camp" value={day.bootCamp} compact />
        <PlanLine label="Gate" value={day.gate} compact />
      </div>
      <div className="mt-5">
        <Link href={day.drillHref} className="font-mono text-xs uppercase tracking-[0.12em] text-red-700">
          Open {day.drillLabel}
        </Link>
      </div>
    </article>
  );
}

function CompactDay({ day, active }: { day: SprintDay; active: boolean }) {
  return (
    <div className={`border p-4 ${active ? "border-red-700 bg-red-50" : "border-zinc-300"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={active ? "eyebrow-red" : "eyebrow"}>{active ? "Today" : "Upcoming"}</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold">Day {day.day}</h3>
        </div>
        <span className="font-mono text-xs text-zinc-500">{day.timedSets} sets</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-700">{day.queue}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{day.repair}</p>
    </div>
  );
}

function CompletedState() {
  return (
    <section className="mt-10 border border-zinc-900 bg-white p-8">
      <p className="eyebrow-red">Sprint completed</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold">
        The saved exam date is in the past.
      </h2>
      <p className="mt-3 max-w-2xl text-zinc-700">
        Keep the final trap map for review, then reset the exam date if the student is
        preparing for a retake or another administration.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/account" className="btn red">
          Update account
        </Link>
        <Link href="/dashboard/mastery" className="btn ghost">
          Review mastery board
        </Link>
      </div>
    </section>
  );
}

function PlanLine({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 text-zinc-800 ${compact ? "text-sm leading-6" : "leading-7"}`}>
        {value}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-300 bg-white px-3 py-4">
      <p className="font-serif text-2xl font-semibold leading-none">{value}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
    </div>
  );
}

type SprintStatus =
  | { kind: "missing-date"; message: string }
  | { kind: "early"; message: string }
  | { kind: "active"; message: string }
  | { kind: "rest"; message: string }
  | { kind: "completed"; message: string };

function getSprintStatus(daysRemaining: number, hasConfirmedDate: boolean): SprintStatus {
  if (!hasConfirmedDate) {
    return {
      kind: "missing-date",
      message: "Confirm an exam date before the sprint can activate.",
    };
  }
  if (daysRemaining < 0) {
    return {
      kind: "completed",
      message: "This exam date has already passed.",
    };
  }
  if (daysRemaining <= 1) {
    return {
      kind: "rest",
      message: "Final 24-hour mode is active.",
    };
  }
  if (daysRemaining <= 14) {
    return {
      kind: "active",
      message: `Sprint active with ${daysRemaining} days left.`,
    };
  }
  return {
    kind: "early",
    message: `Sprint activates when the exam is 14 days away; ${daysRemaining} days remain.`,
  };
}

function getActiveDayIndex(daysRemaining: number) {
  if (daysRemaining <= 1) return SPRINT_DAYS.length - 1;
  if (daysRemaining >= 14) return 0;
  return Math.max(0, Math.min(SPRINT_DAYS.length - 1, 14 - daysRemaining));
}

function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return startOfDay(new Date(year, month - 1, day));
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

function differenceInCalendarDays(later: Date, earlier: Date) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(later).getTime() - startOfDay(earlier).getTime()) / oneDay);
}
