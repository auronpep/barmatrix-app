"use client";

// C3 reflex trainer — the interactive drill runner that replaces the reveal-key
// self-check for Lesson 1. The student must classify each item (name the break);
// the server grades; feedback explains the filter break. No answer key is shown
// before a submission. Misses are reported up for the lesson-level review.

import { useCallback, useMemo, useRef, useState } from "react";
import {
  api,
  ApiClientError,
  type C3DrillItemPublic,
  type C3GradeResult,
  type C3MissedFilter,
  type C3Skill,
  type C3Status,
  type C3TaskType,
  type FoundationsAttemptRequest,
  type FoundationsDrill,
} from "@/lib/api-client";
import { Markdown } from "@/lib/markdown";

export interface C3GradeLogEntry {
  drill_id: string;
  item_id: string;
  task_type: C3TaskType;
  attempt_number: number;
  correct: boolean;
  missed_filter: C3MissedFilter | null;
  missed_skill: C3Skill | null;
}

interface C3DrillRunnerProps {
  slug: string;
  drill: FoundationsDrill;
  token: string | null;
  onItemGraded: (entry: C3GradeLogEntry) => void;
  onDrillComplete: (drillId: string) => void;
}

// Which status buttons a task type offers. Pick tasks use the choice set instead.
const STATUS_OPTIONS: Partial<Record<C3TaskType, { value: C3Status; label: string }[]>> = {
  TRUTH_CHECK: [
    { value: "TRUE", label: "True" },
    { value: "NOT_TRUE", label: "False" },
  ],
  FILTER_BREAK: [
    { value: "NOT_TRUE", label: "Not true" },
    { value: "TRUE_BUT_NOT_RESPONSIVE", label: "True, wrong question" },
  ],
  MIXED_CLASSIFICATION: [
    { value: "NOT_TRUE", label: "Not true" },
    { value: "TRUE_BUT_NOT_RESPONSIVE", label: "True, wrong question" },
    { value: "SURVIVES", label: "Survives" },
  ],
};

export function C3DrillRunner({
  slug,
  drill,
  token,
  onItemGraded,
  onDrillComplete,
}: C3DrillRunnerProps) {
  const items = drill.graded_items ?? [];
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  // Per-item first-attempt correctness, for the mastery marker.
  const [firstTry, setFirstTry] = useState<Record<string, boolean>>({});

  const advance = useCallback(() => {
    setIdx((i) => {
      const next = i + 1;
      if (next >= items.length) {
        setDone(true);
        onDrillComplete(drill.id);
        return i;
      }
      return next;
    });
  }, [items.length, drill.id, onDrillComplete]);

  const recordFirstTry = useCallback((itemId: string, correct: boolean) => {
    setFirstTry((prev) => (itemId in prev ? prev : { ...prev, [itemId]: correct }));
  }, []);

  const current = items[idx];

  if (items.length === 0) return null;

  return (
    <div className="border border-zinc-300 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-lg font-semibold text-zinc-950">
          Drill {drill.id} — {drill.title}
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          {done ? "Complete" : `Item ${idx + 1} / ${items.length}`}
        </span>
      </div>

      {drill.instructions_md && !done && (
        <div className="mt-2 text-sm italic text-zinc-600">
          <Markdown text={drill.instructions_md} className="space-y-2" />
        </div>
      )}

      <div className="mt-4">
        {done ? (
          <DrillSummary items={items} firstTry={firstTry} />
        ) : (
          <C3Item
            key={current.id}
            slug={slug}
            drillId={drill.id}
            item={current}
            token={token}
            isLast={idx === items.length - 1}
            onGraded={(entry) => {
              recordFirstTry(entry.item_id, entry.attempt_number === 1 && entry.correct);
              onItemGraded(entry);
            }}
            onNext={advance}
          />
        )}
      </div>
    </div>
  );
}

// ── one item ──────────────────────────────────────────────────────────────────

type ItemUiState = "unattempted" | "submitted_correct" | "submitted_wrong";

interface C3ItemProps {
  slug: string;
  drillId: string;
  item: C3DrillItemPublic;
  token: string | null;
  isLast: boolean;
  onGraded: (entry: C3GradeLogEntry) => void;
  onNext: () => void;
}

function C3Item({ slug, drillId, item, token, isLast, onGraded, onNext }: C3ItemProps) {
  const [uiState, setUiState] = useState<ItemUiState>("unattempted");
  const [status, setStatus] = useState<C3Status | null>(null);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [grade, setGrade] = useState<C3GradeResult | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number>(Date.now());

  // Choice-button tasks: the student picks one of item.choices[]; grading is on
  // selected_choice_id. LABEL_SELECT (pick a fixed label, e.g. Ear/Issue-Sense) is
  // one of these — its items carry choices[] and grade on correct_choice_id, so it
  // MUST render here, not via STATUS_OPTIONS. Omitting it left 7 live drills with no
  // answer controls (unanswerable). CHOICE_CLASSIFICATION is a multi-select and is
  // deliberately NOT here — it needs its own UI (no content uses it yet).
  const usesChoices =
    item.task_type === "TRUE_VS_TRUE" ||
    item.task_type === "SURVIVOR_PICK" ||
    item.task_type === "CALL_CHECK" ||
    item.task_type === "LABEL_SELECT";
  const statusOptions = STATUS_OPTIONS[item.task_type] ?? [];

  const canSubmit = usesChoices ? choiceId !== null : status !== null;

  const submit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    const payload: FoundationsAttemptRequest = {
      drill_id: drillId,
      item_id: item.id,
      attempt_number: attemptNumber,
      time_ms: Math.max(0, Date.now() - startedAt.current),
      ...(usesChoices ? { selected_choice_id: choiceId! } : { selected_status: status! }),
      ...(attemptNumber >= 2 && reflection.trim()
        ? { reflection_text: reflection.trim() }
        : {}),
    };
    try {
      const res = await api.gradeFoundationsAttempt(slug, payload, token ?? undefined);
      setGrade(res.graded);
      setUiState(res.graded.correct ? "submitted_correct" : "submitted_wrong");
      onGraded({
        drill_id: drillId,
        item_id: item.id,
        task_type: item.task_type,
        attempt_number: attemptNumber,
        correct: res.graded.correct,
        missed_filter: res.graded.missed_filter,
        missed_skill: res.graded.missed_skill,
      });
    } catch (err) {
      setError(
        err instanceof ApiClientError ? `Couldn't grade (API ${err.status}).` : "Couldn't grade.",
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    canSubmit, submitting, drillId, item.id, item.task_type, attemptNumber,
    usesChoices, choiceId, status, reflection, slug, token, onGraded,
  ]);

  const retry = useCallback(() => {
    setUiState("unattempted");
    setGrade(null);
    setStatus(null);
    setChoiceId(null);
    setAttemptNumber((n) => n + 1);
    startedAt.current = Date.now();
  }, []);

  const graded = uiState !== "unattempted";

  return (
    <div>
      {item.stem && (
        <p className="rounded-sm border-l-2 border-zinc-400 bg-zinc-50 py-2 pl-3 text-sm leading-6 text-zinc-700">
          <Markdown text={item.stem} />
        </p>
      )}

      <p className="mt-3 font-medium leading-6 text-zinc-900">
        <Markdown text={item.prompt} />
      </p>

      {item.choice_text && (
        <blockquote className="mt-3 border-l-2 border-zinc-900 bg-zinc-50 py-2 pl-3 text-sm leading-6 text-zinc-800">
          <Markdown text={item.choice_text} />
        </blockquote>
      )}

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-2">
        {usesChoices
          ? (item.choices ?? []).map((c) => (
              <ChoiceButton
                key={c.id}
                selected={choiceId === c.id}
                disabled={graded}
                correct={graded ? grade?.correct_choice_id === c.id : null}
                onClick={() => setChoiceId(c.id)}
              >
                <span className="font-mono font-semibold">{c.id}.</span> {c.text}
              </ChoiceButton>
            ))
          : statusOptions.map((opt) => (
              <StatusButton
                key={opt.value}
                selected={status === opt.value}
                disabled={graded}
                correct={graded ? grade?.correct_status === opt.value : null}
                onClick={() => setStatus(opt.value)}
              >
                {opt.label}
              </StatusButton>
            ))}
      </div>

      {error && (
        <p className="mt-3 font-mono text-xs text-amber-700" role="alert">
          {error}
        </p>
      )}

      {/* Submit / feedback */}
      {!graded ? (
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || submitting}
          className="mt-4 rounded-md bg-red-700 px-5 py-2 text-sm font-medium text-white hover:bg-red-900 disabled:opacity-40"
        >
          {submitting ? "Grading…" : "Submit"}
        </button>
      ) : (
        grade && (
          <>
            <ExplanationPanel grade={grade} />
            {uiState === "submitted_wrong" && attemptNumber >= 2 && (
              <div className="mt-4">
                <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
                  Say the break in your own words
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                  placeholder="False because… / True, but it answers…"
                />
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {uiState === "submitted_wrong" && (
                <button
                  type="button"
                  onClick={retry}
                  className="rounded-md border border-zinc-900 px-4 py-2 font-mono text-xs uppercase tracking-wider text-zinc-900 hover:bg-zinc-950 hover:text-white"
                >
                  Try again
                </button>
              )}
              <button
                type="button"
                onClick={onNext}
                className="rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                {isLast ? "Finish drill →" : "Next item →"}
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}

// ── presentational bits ─────────────────────────────────────────────────────

function ChoiceButton({
  children,
  selected,
  disabled,
  correct,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  correct: boolean | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`w-full rounded-md border px-3 py-2 text-left text-sm leading-6 transition ${markClasses(
        selected,
        correct,
      )}`}
    >
      {markGlyph(selected, correct)}
      {children}
    </button>
  );
}

function StatusButton({
  children,
  selected,
  disabled,
  correct,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  correct: boolean | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`rounded-md border px-4 py-2 text-sm font-medium transition ${markClasses(
        selected,
        correct,
      )}`}
    >
      {markGlyph(selected, correct)}
      {children}
    </button>
  );
}

// Correctness is conveyed by glyph + text, not color alone (a11y).
function markGlyph(selected: boolean, correct: boolean | null): React.ReactNode {
  if (correct === true) return <span className="mr-1 font-bold">✓ </span>;
  if (correct === false && selected) return <span className="mr-1 font-bold">✗ </span>;
  return null;
}

function markClasses(selected: boolean, correct: boolean | null): string {
  if (correct === true) return "border-emerald-700 bg-emerald-50 text-emerald-900";
  if (correct === false && selected) return "border-red-700 bg-red-50 text-red-900";
  if (selected) return "border-zinc-900 bg-zinc-900 text-white";
  return "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500 disabled:opacity-60";
}

function ExplanationPanel({ grade }: { grade: C3GradeResult }) {
  const { explanation, correct } = grade;
  return (
    <div
      role="status"
      className={`mt-4 border-l-2 py-3 pl-4 ${
        correct ? "border-emerald-700 bg-emerald-50/40" : "border-red-700 bg-red-50/40"
      }`}
    >
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
        {correct ? "Correct" : "Not quite"} · Verdict
      </p>
      <p className="mt-1 font-semibold text-zinc-950">{explanation.verdict}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-800">
        <span className="font-medium">Why: </span>
        <Markdown text={explanation.why} />
      </p>
      {explanation.trap && (
        <p className="mt-2 text-sm leading-6 text-zinc-800">
          <span className="font-medium">Trap: </span>
          <Markdown text={explanation.trap} />
        </p>
      )}
      <p className="mt-2 text-sm leading-6 text-zinc-900">
        <span className="font-medium">Say the break: </span>
        {explanation.say_the_break}
      </p>
    </div>
  );
}

// ── lesson-level review summary ─────────────────────────────────────────────

const MISSED_FILTER_GROUPS: Record<
  C3MissedFilter,
  { label: string; message: string }
> = {
  NOT_TRUE: {
    label: "Ear gap",
    message: "You missed false law or overclaims. Review pure-law classification (Drill 1.1).",
  },
  NOT_RESPONSIVE: {
    label: "Issue-Sense gap",
    message:
      "You picked true law aimed at the wrong question. Review the call-check and true-vs-true items (Drills 1.2 / 1.4).",
  },
  SURVIVES: {
    label: "Residual gap",
    message: "You didn't identify the answer that survived both filters.",
  },
};

export function C3ReviewSummary({ log }: { log: C3GradeLogEntry[] }) {
  const stats = useMemo(() => {
    const firstByItem = new Map<string, C3GradeLogEntry>();
    let retries = 0;
    for (const e of log) {
      if (e.attempt_number === 1) firstByItem.set(e.item_id, e);
      else retries += 1;
    }
    const firsts = [...firstByItem.values()];
    const firstCorrect = firsts.filter((e) => e.correct).length;
    const misses: Record<C3MissedFilter, number> = {
      NOT_TRUE: 0,
      NOT_RESPONSIVE: 0,
      SURVIVES: 0,
    };
    for (const e of firsts) {
      if (!e.correct && e.missed_filter) misses[e.missed_filter] += 1;
    }
    return {
      attempted: firsts.length,
      firstCorrect,
      pct: firsts.length ? Math.round((firstCorrect / firsts.length) * 100) : 0,
      retries,
      misses,
    };
  }, [log]);

  if (stats.attempted === 0) return null;
  const groups = (Object.keys(MISSED_FILTER_GROUPS) as C3MissedFilter[]).filter(
    (k) => stats.misses[k] > 0,
  );

  return (
    <section className="mt-10 border-t-2 border-zinc-900 pt-8">
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-zinc-950">
        Your missed filter breaks
      </h2>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Items attempted" value={String(stats.attempted)} />
        <Stat label="First-try correct" value={`${stats.pct}%`} />
        <Stat label="Retries" value={String(stats.retries)} />
      </div>

      {groups.length === 0 ? (
        <p className="mt-5 border-l-2 border-emerald-700 bg-emerald-50/40 py-3 pl-4 text-sm text-zinc-800">
          No first-attempt misses. The filters are becoming automatic — you&apos;re
          ready for Lesson 2.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {groups.map((k) => (
            <div key={k} className="border border-zinc-300 bg-white p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
                {MISSED_FILTER_GROUPS[k].label} · {stats.misses[k]}{" "}
                {stats.misses[k] === 1 ? "miss" : "misses"}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-800">
                {MISSED_FILTER_GROUPS[k].message}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-200 bg-zinc-50 p-3 text-center">
      <p className="font-serif text-2xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
    </div>
  );
}

function DrillSummary({
  items,
  firstTry,
}: {
  items: C3DrillItemPublic[];
  firstTry: Record<string, boolean>;
}) {
  const attempted = Object.keys(firstTry).length;
  const firstCorrect = Object.values(firstTry).filter(Boolean).length;
  const pct = attempted > 0 ? Math.round((firstCorrect / attempted) * 100) : 0;
  return (
    <div className="border-l-2 border-emerald-700 bg-emerald-50/40 py-3 pl-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
        Drill complete
      </p>
      <p className="mt-1 text-sm text-zinc-800">
        First-attempt accuracy:{" "}
        <span className="font-semibold text-zinc-950">
          {firstCorrect}/{attempted} ({pct}%)
        </span>{" "}
        across {items.length} items.
      </p>
    </div>
  );
}
