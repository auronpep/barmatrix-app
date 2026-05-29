"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import {
  api,
  API_URL,
  ApiClientError,
  type AttemptResponse,
  type ForensicsResponse,
  type Letter,
  type QuestionPayload,
} from "@/lib/api-client";
import { useSubmitAttempt } from "@/lib/use-attempts";
import { BRAND } from "@/lib/copy";

const SUBJECT = "Criminal Law";
const SUBJECT_LABEL = "Criminal Law & Procedure";
const DRILL_LIMIT = 6;

const CRIMINAL_LAW_PREVIEW = {
  trap: "Search Warrant Exceptions - Vehicle Search",
  studentSelected: "Warrant required because police searched a closed container",
  focusGroupLine: "Focus-group comparison appears after submit",
  forensicTag: "Warrant-default overreach",
  whyLookedRight:
    "The warrant rule is the familiar baseline, so a search without a warrant can look automatically invalid.",
  whyFails:
    "Criminal procedure turns on exception triggers. Probable cause, mobility, consent, exigency, and search-incident limits can change the result.",
  nextDrill: "Search Warrant Exceptions Repair",
} as const;

type Phase =
  | "idle"
  | "loading-bank"
  | "loading-question"
  | "presenting"
  | "submitting"
  | "forensics"
  | "complete"
  | "error";

interface SubjectQuestionRef {
  question_id: string;
  external_id: string | null;
  topic: string | null;
  subtopic: string | null;
  tension_point: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function pickArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  for (const key of ["questions", "items", "results", "data"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (isRecord(value)) {
      const nested = pickArray(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function normalizeQuestionRef(value: unknown): SubjectQuestionRef | null {
  if (!isRecord(value)) return null;
  const questionId = asString(value.question_id) ?? asString(value.id);
  if (!questionId) return null;

  return {
    question_id: questionId,
    external_id: asString(value.external_id),
    topic: asString(value.topic),
    subtopic: asString(value.subtopic),
    tension_point:
      asString(value.tension_point) ??
      asString(value.tension) ??
      asString(value.tension_slug),
  };
}

function subjectEndpoint(): string {
  const params = new URLSearchParams({
    subject: SUBJECT,
    page: "1",
    limit: String(DRILL_LIMIT),
  });
  return `${API_URL}/api/questions/by-subject?${params.toString()}`;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

async function fetchCriminalLawQueue(): Promise<SubjectQuestionRef[]> {
  const response = await fetch(subjectEndpoint(), {
    headers: { accept: "application/json" },
  });
  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${JSON.stringify(payload)}`);
  }

  return pickArray(payload)
    .map(normalizeQuestionRef)
    .filter((question): question is SubjectQuestionRef => question !== null);
}

function humanError(error: unknown): string {
  if (error instanceof ApiClientError) return `API ${error.status}: ${error.message}`;
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function readableLabel(value: string | null): string {
  if (!value) return "Pending";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CriminalLawDrillPage() {
  const submitAttempt = useSubmitAttempt();
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<SubjectQuestionRef[]>([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState<QuestionPayload | null>(null);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
  const [forensics, setForensics] = useState<ForensicsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setIdRef = useRef<string | null>(null);
  const startedAtRef = useRef(0);

  const loadQuestion = async (
    nextIndex: number,
    nextQueue: SubjectQuestionRef[] = queue,
  ) => {
    const nextRef = nextQueue[nextIndex];
    if (!nextRef) {
      setPhase("complete");
      return;
    }

    setPhase("loading-question");
    setError(null);
    setSelected(null);
    setConfidence(3);
    setAttempt(null);
    setForensics(null);
    startedAtRef.current = Date.now();

    try {
      const nextQuestion = await api.getQuestion(nextRef.question_id);
      setQuestion(nextQuestion);
      setIndex(nextIndex);
      setPhase("presenting");
    } catch (nextError) {
      setError(humanError(nextError));
      setPhase("error");
    }
  };

  const loadQueue = async () => {
    setPhase("loading-bank");
    setError(null);

    try {
      const nextQueue = await fetchCriminalLawQueue();
      setQueue(nextQueue);

      if (nextQueue.length === 0) {
        setQuestion(null);
        setError("The Criminal Law drill queue is empty.");
        setPhase("error");
        return;
      }

      await loadQuestion(0, nextQueue);
    } catch (nextError) {
      setError(humanError(nextError));
      setPhase("error");
    }
  };

  const currentRef = queue[index] ?? null;
  const total = queue.length;
  const isLast = index >= total - 1;
  const canSubmit = phase === "presenting" && question !== null && selected !== null;

  const submit = async () => {
    if (!question || !selected) return;
    setPhase("submitting");
    setError(null);

    const timeSeconds = Math.max(
      0,
      Math.round((Date.now() - startedAtRef.current) / 1000),
    );

    try {
      if (setIdRef.current === null) {
        setIdRef.current = `criminal-law-inline-${Date.now()}`;
      }

      const nextAttempt = await submitAttempt({
        question_id: question.question_id,
        selected_letter: selected,
        confidence,
        time_seconds: timeSeconds,
        platform: "web",
        set_id: setIdRef.current,
      });
      const nextForensics = await api.getForensics(nextAttempt.attempt_id);
      setAttempt(nextAttempt);
      setForensics(nextForensics);
      setPhase("forensics");
    } catch (nextError) {
      setError(humanError(nextError));
      setPhase("error");
    }
  };

  const next = () => {
    void loadQuestion(index + 1);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="mb-8 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-700">
        <span className="rounded border border-zinc-200 px-2 py-1">
          Criminal Law drill
        </span>
        <span className="rounded border border-zinc-200 px-2 py-1">Inline forensics</span>
        <span className="rounded border border-zinc-200 px-2 py-1">SRC-0026</span>
      </div>

      <div className="mb-10 grid gap-6 border-b border-zinc-200 pb-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            {BRAND} repair loop
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Criminal Law & Procedure drills with wrong-answer forensics in the
            same workflow.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
            Work a Criminal Law queue, submit an answer, and review the trap and assigned repair drill without leaving the page.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadQueue()}
              disabled={phase === "loading-bank" || phase === "loading-question"}
              className="btn btn-lg"
            >
              Start Criminal Law drill
            </button>
            <Link
              href="/red-zones"
              className="btn btn-lg ghost"
            >
              View Red-Zone Map
            </Link>
          </div>
        </div>

        <div className="border border-zinc-200 bg-zinc-50 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Current queue
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {total > 0 ? `${index + 1} / ${total}` : "Ready"}
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            {currentRef
              ? `${currentRef.external_id ?? currentRef.question_id.slice(0, 8)} - ${readableLabel(currentRef.subtopic)}`
              : "Start the drill to sync the first Criminal Law queue."}
          </p>
        </div>
      </div>

      {phase === "complete" ? (
        <CompletionPanel total={total} onRestart={() => void loadQuestion(0)} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            {phase === "idle" && <StartPanel onStart={() => void loadQueue()} />}

            {(phase === "loading-bank" || phase === "loading-question") && (
              <StatusPanel title="Loading Criminal Law drill" />
            )}

            {phase === "error" && (
              <ErrorPanel
                message={error}
                onRetry={() => {
                  if (queue.length > 0) {
                    void loadQuestion(index);
                  } else {
                    void loadQueue();
                  }
                }}
              />
            )}

            {(phase === "presenting" || phase === "submitting" || phase === "forensics") &&
              question && (
                <QuestionCard
                  question={question}
                  selected={selected}
                  onSelect={setSelected}
                  confidence={confidence}
                  onConfidenceChange={setConfidence}
                  disabled={phase !== "presenting"}
                  canSubmit={canSubmit}
                  submitting={phase === "submitting"}
                  onSubmit={submit}
                />
              )}
          </div>

          <ForensicsPanel
            phase={phase}
            attempt={attempt}
            forensics={forensics}
            onNext={next}
            isLast={isLast}
          />
        </div>
      )}
    </section>
  );
}

function StartPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Ready to drill
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-950">
        Start with the Criminal Law queue.
      </h2>
      <p className="mt-3 max-w-2xl text-zinc-600">
        The first click syncs live Criminal Law questions. After each answer, the
        right rail changes from an exception-trigger preview into live wrong-answer
        forensics.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="btn btn-lg mt-6"
      >
        Start Criminal Law drill
      </button>
    </div>
  );
}

function StatusPanel({ title }: { title: string }) {
  return (
    <div className="border border-zinc-200 bg-zinc-50 p-8">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      <p className="mt-3 text-zinc-600">
        Syncing the Criminal Law queue and preparing the first drill question.
      </p>
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="border border-red-200 bg-red-50 p-8">
      <p className="font-medium text-red-900">Criminal Law drill unavailable.</p>
      {message && <p className="mt-2 font-mono text-xs text-red-800">{message}</p>}
      <button
        type="button"
        onClick={onRetry}
        className="btn btn-sm ghost mt-6"
      >
        Retry
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
  disabled,
  canSubmit,
  submitting,
  onSubmit,
}: {
  question: QuestionPayload;
  selected: Letter | null;
  onSelect: (letter: Letter) => void;
  confidence: number;
  onConfidenceChange: (value: number) => void;
  disabled: boolean;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <article className="border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        <span>{question.subject}</span>
        {question.topic && <span>/ {question.topic}</span>}
        {question.subtopic && <span>/ {question.subtopic}</span>}
      </div>

      <div className="mt-6 whitespace-pre-line text-base leading-8 text-zinc-800">
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
                disabled={disabled}
                onClick={() => onSelect(choice.letter)}
                className="w-full rounded-md px-4 py-3 text-left transition disabled:cursor-not-allowed"
                style={{
                  background: isSelected ? "var(--ink)" : "white",
                  border: `1px solid ${isSelected ? "var(--ink)" : "rgb(228 228 231)"}`,
                  color: isSelected ? "white" : "rgb(39 39 42)",
                }}
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
          disabled={disabled}
          onChange={(event) =>
            onConfidenceChange(Number.parseInt(event.target.value, 10))
          }
          className="mt-3 w-full"
          aria-label="Confidence level from 1 to 5"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-wide text-zinc-500">
          <span>Guessing</span>
          <span>Neutral</span>
          <span>Certain</span>
        </div>
      </div>

      <button
        type="button"
        disabled={!canSubmit || submitting}
        onClick={onSubmit}
        className="btn btn-lg mt-8"
      >
        {submitting ? "Submitting..." : "Submit answer"}
      </button>
    </article>
  );
}

function ForensicsPanel({
  phase,
  attempt,
  forensics,
  onNext,
  isLast,
}: {
  phase: Phase;
  attempt: AttemptResponse | null;
  forensics: ForensicsResponse | null;
  onNext: () => void;
  isLast: boolean;
}) {
  if (phase === "forensics" && attempt && forensics) {
    return (
      <aside className="border border-zinc-300 bg-white p-6 shadow-sm lg:sticky lg:top-6">
        <p
          className={`font-mono text-xs uppercase tracking-wider ${
            attempt.correct ? "text-emerald-700" : "text-amber-700"
          }`}
        >
          {attempt.correct ? "Correct" : "Wrong Answer Forensics"}
        </p>

        <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-950">
          {attempt.correct
            ? "Why that answer works"
            : forensics.trap_name ?? "Wrong-answer trap"}
        </h2>

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
            <ForensicsSection title="Cue for next time">
              {forensics.future_cue ?? "Future cue pending."}
            </ForensicsSection>
          </>
        )}

        {forensics.focus_group && (
          <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Focus-group signal
            </p>
            <p className="mt-2 text-sm text-zinc-700">
              {forensics.focus_group.selected_choice_pct}% of{" "}
              {forensics.focus_group.sample_size} test-takers selected the same
              answer.
            </p>
          </div>
        )}

        {!attempt.correct && forensics.assigned_drill && (
          <div className="mt-5 border border-red-200 bg-red-50 p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-red-800">
              Assigned repair drill
            </p>
            <p className="mt-2 font-medium text-red-950">
              {forensics.assigned_drill.name}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          className="btn btn-lg mt-6 w-full justify-center"
        >
          {isLast ? "Finish drill" : "Next Criminal Law question"}
        </button>
      </aside>
    );
  }

  return (
    <aside className="border border-zinc-200 bg-zinc-50 p-6 lg:sticky lg:top-6">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Inline forensics preview
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-950">
        {CRIMINAL_LAW_PREVIEW.trap}
      </h2>
      <dl className="mt-5 space-y-4">
        <PreviewRow
          label="Student selected"
          value={CRIMINAL_LAW_PREVIEW.studentSelected}
        />
        <PreviewRow label="Forensic tag" value={CRIMINAL_LAW_PREVIEW.forensicTag} />
        <PreviewRow label="Next drill" value={CRIMINAL_LAW_PREVIEW.nextDrill} />
      </dl>
      <ForensicsSection title="Why it looked right">
        {CRIMINAL_LAW_PREVIEW.whyLookedRight}
      </ForensicsSection>
      <ForensicsSection title="Why it fails">
        {CRIMINAL_LAW_PREVIEW.whyFails}
      </ForensicsSection>
      <p className="mt-5 text-sm leading-6 text-zinc-600">
        Submit an answer to replace this preview with the live attempt
        forensics, red-zone update, and repair drill assignment.
      </p>
    </aside>
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

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-800">{value}</dd>
    </div>
  );
}

function CompletionPanel({
  total,
  onRestart,
}: {
  total: number;
  onRestart: () => void;
}) {
  return (
    <div className="border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Drill complete
      </p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
        Criminal Law queue complete.
      </h2>
      <p className="mt-4 max-w-2xl text-zinc-600">
        You worked {total} {SUBJECT_LABEL} question{total === 1 ? "" : "s"}{" "}
        through the inline forensics surface. Continue to the Red-Zone Map or
        restart the queue for another pass.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="btn btn-lg"
        >
          Restart drill
        </button>
        <Link
          href="/red-zones"
          className="btn btn-lg ghost"
        >
          View Red-Zone Map
        </Link>
      </div>
    </div>
  );
}
