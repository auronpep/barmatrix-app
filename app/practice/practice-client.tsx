"use client";

// Practice surface — Web Component 03 (HANDOFFS/WEB/15 §Question Bank).
//
// Filter by subject / tension / trap, start a set, answer each question, and get
// full Wrong Answer Forensics on submit. The set is assembled from the existing
// read endpoints (/api/tensions/:slug/questions, /api/traps/:slug/questions,
// /api/questions/by-subject) and every answer goes through the same attempt +
// forensics loop as the diagnostic / drills / timed sets (useSubmitAttempt closes
// the Clerk-attributed-or-anonymous decision in one place).

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  api,
  API_URL,
  ApiClientError,
  type AttemptResponse,
  type ForensicsResponse,
  type Letter,
  type QuestionPayload,
} from "@/lib/api-client";
import { AnswerKeyDebrief } from "@/components/redesign/answer-key-debrief";
import type { DebriefData } from "@/components/redesign/answer-key-types";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { useSubmitAttempt } from "@/lib/use-attempts";
import {
  trackPracticeSetCompletedOnce,
  trackPracticeSetStarted,
} from "@/lib/analytics";

// Fetch up to 200 questions and shuffle to pick a fresh random subset each session.
const FETCH_LIMIT = 200;
// Show 20 questions per practice set (configurable for future A/B testing).
const SET_LIMIT = 20;
const INCLUDE_HIDDEN = process.env.NODE_ENV !== "production";
const ANSWER_KEY_TIMEOUT_MS = 10000;

// Fisher-Yates shuffle: mutates array in-place, returns it for chaining.
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const SUBJECTS = [
  "Civil Procedure",
  "Constitutional Law",
  "Contracts",
  "Criminal Law",
  "Criminal Procedure",
  "Evidence",
  "Real Property",
  "Torts",
] as const;

type FilterType = "subject" | "tension" | "trap";

interface ActiveFilter {
  type: FilterType;
  value: string;
}

type Phase =
  | "idle"
  | "building"
  | "loading-question"
  | "presenting"
  | "submitting"
  | "forensics"
  | "complete"
  | "error";

function humanError(error: unknown): string {
  if (error instanceof ApiClientError) return `API ${error.status}: ${error.message}`;
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function withSoftTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      window.setTimeout(() => reject(new Error(message)), ANSWER_KEY_TIMEOUT_MS),
    ),
  ]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function pickQuestionArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  for (const key of ["questions", "items", "results", "data"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (isRecord(value)) {
      const nested = pickQuestionArray(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function normalizeQuestionId(value: unknown): string | null {
  if (!isRecord(value)) return null;
  return asString(value.question_id) ?? asString(value.id);
}

function humanizeValue(value: string): string {
  const cleaned = value.replace(/[_-]+/g, " ").trim();
  if (!cleaned) return value;
  return cleaned.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function filterLabel(filter: ActiveFilter): string {
  if (filter.type === "subject") return filter.value;
  return humanizeValue(filter.value);
}

async function fetchSubjectIds(subject: string): Promise<string[]> {
  const params = new URLSearchParams({
    subject,
    page: "1",
    limit: String(FETCH_LIMIT),
  });
  const res = await fetch(`${API_URL}/api/questions/by-subject?${params}`, {
    headers: { accept: "application/json" },
  });
  const text = await res.text();
  const payload = text ? (JSON.parse(text) as unknown) : {};
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${JSON.stringify(payload)}`);
  }
  const ids = pickQuestionArray(payload)
    .map(normalizeQuestionId)
    .filter((id): id is string => id !== null);
  // Shuffle and take the first SET_LIMIT to vary content across sessions.
  return shuffle([...ids]).slice(0, SET_LIMIT);
}

async function fetchFilterIds(filter: ActiveFilter): Promise<string[]> {
  if (filter.type === "tension") {
    const res = await api.getTensionQuestions(filter.value, {
      include_hidden: INCLUDE_HIDDEN,
      limit: FETCH_LIMIT,
    });
    const ids = res.questions.map((q) => q.question_id);
    // Shuffle and take the first SET_LIMIT to vary content across sessions.
    return shuffle([...ids]).slice(0, SET_LIMIT);
  }
  if (filter.type === "trap") {
    const res = await api.getTrapQuestions(filter.value, {
      include_hidden: INCLUDE_HIDDEN,
      limit: FETCH_LIMIT,
    });
    const ids = res.questions.map((q) => q.question_id);
    // Shuffle and take the first SET_LIMIT to vary content across sessions.
    return shuffle([...ids]).slice(0, SET_LIMIT);
  }
  return fetchSubjectIds(filter.value);
}

export function PracticeClient({
  initialSubject,
  initialTension,
  initialTrap,
}: {
  initialSubject?: string;
  initialTension?: string;
  initialTrap?: string;
}) {
  const submitAttempt = useSubmitAttempt();
  const { isSignedIn, getToken } = useClerkAuth();

  // A deep-link filter (?tension / ?trap / ?subject) auto-starts a set. Derive it
  // synchronously so the initial render is already in "building" — that keeps the
  // mount effect free of synchronous setState (react-hooks/set-state-in-effect).
  const initialFilter: ActiveFilter | null = initialTension
    ? { type: "tension", value: initialTension }
    : initialTrap
      ? { type: "trap", value: initialTrap }
      : initialSubject
        ? { type: "subject", value: initialSubject }
        : null;

  const [phase, setPhase] = useState<Phase>(initialFilter ? "building" : "idle");
  const [filter, setFilter] = useState<ActiveFilter | null>(initialFilter);
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState<QuestionPayload | null>(null);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
  const [forensics, setForensics] = useState<ForensicsResponse | null>(null);
  const [answerKey, setAnswerKey] = useState<DebriefData | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const setIdRef = useRef<string | null>(null);
  const questionStartedAtRef = useRef(0);

  const total = queue.length;
  const isLast = index >= total - 1;
  const canSubmit = phase === "presenting" && question !== null && selected !== null;

  const loadQuestion = useCallback(
    async (nextIndex: number, nextQueue: string[]) => {
      const nextId = nextQueue[nextIndex];
      if (!nextId) {
        setPhase("complete");
        return;
      }
      setPhase("loading-question");
      setError(null);
      setSelected(null);
      setConfidence(3);
      setAttempt(null);
      setForensics(null);
      setAnswerKey(null);
      questionStartedAtRef.current = Date.now();
      try {
        const nextQuestion = await api.getQuestion(nextId);
        setQuestion(nextQuestion);
        setIndex(nextIndex);
        setPhase("presenting");
      } catch (err) {
        setError(humanError(err));
        setPhase("error");
      }
    },
    [],
  );

  // The fetch half. Every setState here runs AFTER an await, so it never fires
  // synchronously inside an effect body (which the lint rule forbids).
  const runFetch = useCallback(
    async (nextFilter: ActiveFilter) => {
      try {
        const ids = await fetchFilterIds(nextFilter);
        setQueue(ids);
        if (ids.length === 0) {
          setError("No active questions match this filter yet.");
          setPhase("error");
          return;
        }
        trackPracticeSetStarted({
          count: ids.length,
          filterSubject: nextFilter.type === "subject" ? nextFilter.value : null,
          filterTension: nextFilter.type === "tension" ? nextFilter.value : null,
          filterTrap: nextFilter.type === "trap" ? nextFilter.value : null,
        });
        await loadQuestion(0, ids);
      } catch (err) {
        setError(humanError(err));
        setPhase("error");
      }
    },
    [loadQuestion],
  );

  // Event-driven start (FilterPicker). Synchronous setState in an event handler is
  // fine — only effects are restricted. Resets state, then kicks the async fetch.
  const startSet = useCallback(
    (nextFilter: ActiveFilter) => {
      setIdRef.current = `practice-${nextFilter.type}-${Date.now()}`;
      setPhase("building");
      setFilter(nextFilter);
      setError(null);
      setQuestion(null);
      setAttempt(null);
      setForensics(null);
      setAnswerKey(null);
      setSelected(null);
      setConfidence(3);
      setIndex(0);
      setCorrectCount(0);
      void runFetch(nextFilter);
    },
    [runFetch],
  );

  // Auto-start when arriving with a deep-link filter. State is already initialized
  // to "building" via useState, so this effect only assigns a ref and runs the
  // async fetch — no synchronous setState in the effect body.
  useEffect(() => {
    if (!initialFilter) return;
    setIdRef.current = `practice-${initialFilter.type}-${Date.now()}`;
    // runFetch only mutates state AFTER an await (async continuation), so it can't
    // cause the cascading synchronous renders this rule guards against; auto-starting
    // a deep-linked set is the canonical "sync with an external system on mount" effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void runFetch(initialFilter);
    // Run once on mount with the server-provided filter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!question || !selected) return;
    setPhase("submitting");
    setError(null);
    const timeSeconds = Math.max(
      0,
      Math.round((Date.now() - questionStartedAtRef.current) / 1000),
    );
    try {
      const nextAttempt = await submitAttempt({
        question_id: question.question_id,
        selected_letter: selected,
        confidence,
        time_seconds: timeSeconds,
        platform: "web",
        set_id: setIdRef.current ?? `practice-${Date.now()}`,
      });
      const answerKeyRequest = async (): Promise<DebriefData | null> => {
        if (!isSignedIn) return null;
        const token = await getToken();
        if (!token) return null;
        return withSoftTimeout(
          api.getAnswerKey(question.question_id, token),
          "answer key timed out",
        ).catch(() => null);
      };
      const [nextForensics, nextAnswerKey] = await Promise.all([
        api.getForensics(nextAttempt.attempt_id),
        answerKeyRequest().catch(() => null),
      ]);
      if (nextAttempt.correct) setCorrectCount((c) => c + 1);
      setAttempt(nextAttempt);
      setForensics(nextForensics);
      setAnswerKey(nextAnswerKey);
      setPhase("forensics");
    } catch (err) {
      setError(humanError(err));
      setPhase("error");
    }
  };

  const next = () => {
    if (isLast) {
      if (setIdRef.current) {
        trackPracticeSetCompletedOnce({
          setId: setIdRef.current,
          correctCount,
          totalCount: total,
        });
      }
      setPhase("complete");
      return;
    }
    void loadQuestion(index + 1, queue);
  };

  const reset = () => {
    setPhase("idle");
    setFilter(null);
    setQueue([]);
    setQuestion(null);
    setAttempt(null);
    setForensics(null);
    setAnswerKey(null);
    setError(null);
  };

  const nextLabel = isLast ? "Finish set" : "Next question";

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
          Practice
        </p>
        <Link
          href="/app"
          className="rounded-md font-mono text-xs uppercase tracking-wider text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Command center
        </Link>
      </div>

      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Practice the bank
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-600">
        Filter by subject, tension point, or trap, then work the set. Every miss
        opens full Wrong Answer Forensics — why the wrong answer looked right, then
        why it fails.
      </p>

      {filter && phase !== "idle" && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-zinc-300 bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
            {filter.type}: {filterLabel(filter)}
          </span>
          {total > 0 && phase !== "building" && (
            <span className="font-mono text-xs text-zinc-500">
              {Math.min(index + 1, total)}/{total}
            </span>
          )}
          <button
            type="button"
            onClick={reset}
            className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline"
          >
            Change filter
          </button>
        </div>
      )}

      <div className="mt-8">
        {phase === "idle" && <FilterPicker onPick={startSet} />}

        {phase === "building" && <StatusPanel title="Building practice set" />}
        {phase === "loading-question" && (
          <StatusPanel title="Loading next question" />
        )}

        {phase === "error" && (
          <ErrorPanel message={error} onReset={reset} />
        )}

        {(phase === "presenting" || phase === "submitting") && question && (
          <QuestionCard
            question={question}
            selected={selected}
            onSelect={setSelected}
            confidence={confidence}
            onConfidenceChange={setConfidence}
            canSubmit={canSubmit}
            submitting={phase === "submitting"}
            onSubmit={submit}
          />
        )}

        {phase === "forensics" && attempt && answerKey && (
          <AnswerKeyDebrief
            data={answerKey}
            yourPick={selected ?? answerKey.correctLetter}
            session={{
              index: Math.min(index + 1, total),
              total,
              percent: total > 0 ? Math.round(((index + 1) / total) * 100) : 0,
              minutesLeft: Math.max(0, (total - index - 1) * 2),
            }}
            onContinue={next}
            continueLabel={nextLabel}
          />
        )}

        {phase === "forensics" && attempt && !answerKey && forensics && (
          <ForensicsCard
            attempt={attempt}
            forensics={forensics}
            isLast={isLast}
            onNext={next}
          />
        )}

        {phase === "complete" && (
          <CompletionPanel
            correct={correctCount}
            total={total}
            filterLabel={filter ? filterLabel(filter) : null}
            onReset={reset}
          />
        )}
      </div>
    </section>
  );
}

function FilterPicker({ onPick }: { onPick: (filter: ActiveFilter) => void }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Start a set by subject
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {SUBJECTS.map((subject) => (
          <button
            key={subject}
            type="button"
            onClick={() => onPick({ type: "subject", value: subject })}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:border-zinc-500 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            {subject}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-zinc-600">
        Or target a specific pattern from the{" "}
        <Link
          href="/tensions"
          className="underline underline-offset-4 hover:text-zinc-900"
        >
          Tension Map
        </Link>{" "}
        or{" "}
        <Link
          href="/traps"
          className="underline underline-offset-4 hover:text-zinc-900"
        >
          Trap Taxonomy
        </Link>
        .
      </p>
    </div>
  );
}

function StatusPanel({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      <p className="mt-2 text-zinc-600">Pulling questions from the live bank…</p>
    </div>
  );
}

function ErrorPanel({
  message,
  onReset,
}: {
  message: string | null;
  onReset: () => void;
}) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-8">
      <p className="font-medium text-amber-900">This set isn&apos;t available.</p>
      {message && (
        <p className="mt-2 font-mono text-xs text-amber-800">{message}</p>
      )}
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Pick another filter
      </button>
    </div>
  );
}

function QuestionCard({
  question,
  selected,
  onSelect,
  confidence,
  onConfidenceChange,
  canSubmit,
  submitting,
  onSubmit,
}: {
  question: QuestionPayload;
  selected: Letter | null;
  onSelect: (letter: Letter) => void;
  confidence: number;
  onConfidenceChange: (value: number) => void;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {question.external_id ?? question.question_id.slice(0, 8)}
      </p>
      <div className="mt-4 whitespace-pre-line text-base leading-8 text-zinc-800">
        {question.fact_pattern}
      </div>
      <p className="mt-6 text-lg font-semibold leading-7 text-zinc-950">
        {question.call_of_question ?? question.question_stem}
      </p>
      <ul className="mt-6 space-y-3">
        {question.choices.map((choice) => {
          const isSelected = selected === choice.letter;
          return (
            <li key={choice.choice_id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(choice.letter)}
                className={`w-full rounded-md border px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50"
                }`}
              >
                <span className="font-mono font-semibold">{choice.letter}.</span>{" "}
                <span>{choice.choice_text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-8">
        <label className="block text-sm font-medium text-zinc-800">
          Confidence: <span className="font-mono">{confidence}</span> / 5
        </label>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={confidence}
          onChange={(event) =>
            onConfidenceChange(Number.parseInt(event.target.value, 10))
          }
          className="mt-3 w-full"
          aria-label="Confidence level from 1 to 5"
        />
      </div>
      <button
        type="button"
        disabled={!canSubmit || submitting}
        onClick={onSubmit}
        className="mt-8 rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        {submitting ? "Submitting…" : "Submit answer"}
      </button>
    </article>
  );
}

function ForensicsCard({
  attempt,
  forensics,
  isLast,
  onNext,
}: {
  attempt: AttemptResponse;
  forensics: ForensicsResponse;
  isLast: boolean;
  onNext: () => void;
}) {
  return (
    <article className="rounded-lg border border-zinc-300 bg-white p-6 shadow-sm sm:p-8">
      <p
        className={`font-mono text-xs uppercase tracking-wider ${
          attempt.correct ? "text-emerald-700" : "text-amber-700"
        }`}
      >
        {attempt.correct ? "Correct" : "Wrong Answer Forensics"}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-950">
        {attempt.correct
          ? "Rule held"
          : (forensics.trap_name ?? "Wrong-answer trap")}
      </h2>
      {!attempt.correct && (
        <p className="mt-1 font-mono text-xs text-zinc-500">
          Correct answer: {attempt.correct_answer ?? "—"}
        </p>
      )}

      {attempt.correct ? (
        <ForensicsSection title="Rule fit">
          {forensics.why_correct ?? "Correct-answer explanation pending."}
        </ForensicsSection>
      ) : (
        <>
          <ForensicsSection title="Why it looked right">
            {forensics.why_attractive ?? "Attraction pattern pending."}
          </ForensicsSection>
          <ForensicsSection title="Why it fails">
            {forensics.why_wrong ?? "Wrong-answer explanation pending."}
          </ForensicsSection>
          <ForensicsSection title="Spot it next time">
            {forensics.future_cue ?? "Future cue pending."}
          </ForensicsSection>
        </>
      )}

      {forensics.focus_group && (
        <div className="mt-5 rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Focus-group signal
          </p>
          <p className="mt-2 text-sm text-zinc-700">
            {forensics.focus_group.selected_choice_pct}% of{" "}
            {forensics.focus_group.sample_size} test-takers picked the same answer.
          </p>
        </div>
      )}

      {!attempt.correct && forensics.assigned_drill && (
        <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-red-800">
            Assigned repair drill
          </p>
          <p className="mt-1 font-medium text-red-950">
            {forensics.assigned_drill.name}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="mt-6 rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        {isLast ? "Finish set" : "Next question"}
      </button>
    </article>
  );
}

function ForensicsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-700">
        {children}
      </p>
    </section>
  );
}

function CompletionPanel({
  correct,
  total,
  filterLabel: label,
  onReset,
}: {
  correct: number;
  total: number;
  filterLabel: string | null;
  onReset: () => void;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Set complete
      </p>
      <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
        {correct}/{total} correct{label ? ` · ${label}` : ""}
      </h2>
      <p className="mt-3 text-zinc-600">
        {pct}% on this set. Misses fed your Red-Zone Map and queued repair drills.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Practice another set
        </button>
        <Link
          href="/red-zones"
          className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          View Red-Zone Map
        </Link>
      </div>
    </div>
  );
}
