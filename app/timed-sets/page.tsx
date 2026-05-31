"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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

const SET_SIZE = 17;
const PER_SUBJECT_LIMIT = 3;
const TARGET_SECONDS = 30 * 60;

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

const ENGINE_PREVIEW = {
  heading: "Mixed trap transfer",
  focus: "Subject and trap family stay hidden until after you answer.",
  timing: "30-minute clock",
  forensic: "Misses unlock Wrong Answer Forensics and Red-Zone updates.",
  mastery: "Pattern Mastery Board reweights after the set.",
} as const;

type Phase =
  | "idle"
  | "building"
  | "loading-question"
  | "presenting"
  | "submitting"
  | "forensics"
  | "complete"
  | "error";

interface QueueQuestionRef {
  question_id: string;
  external_id: string | null;
  subject: string | null;
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

function normalizeQuestionRef(
  value: unknown,
  fallbackSubject: string,
): QueueQuestionRef | null {
  if (!isRecord(value)) return null;
  const questionId = asString(value.question_id) ?? asString(value.id);
  if (!questionId) return null;

  return {
    question_id: questionId,
    external_id: asString(value.external_id),
    subject: asString(value.subject) ?? fallbackSubject,
    topic: asString(value.topic),
    subtopic: asString(value.subtopic),
    tension_point:
      asString(value.tension_point) ??
      asString(value.tension) ??
      asString(value.tension_slug),
  };
}

function subjectEndpoint(subject: string): string {
  const params = new URLSearchParams({
    subject,
    page: "1",
    limit: String(PER_SUBJECT_LIMIT),
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

async function fetchSubjectQueue(subject: string): Promise<QueueQuestionRef[]> {
  const response = await fetch(subjectEndpoint(subject), {
    headers: { accept: "application/json" },
  });
  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(`${subject}: API ${response.status}: ${JSON.stringify(payload)}`);
  }

  return pickArray(payload)
    .map((item) => normalizeQuestionRef(item, subject))
    .filter((question): question is QueueQuestionRef => question !== null);
}

function interleaveQueues(groups: QueueQuestionRef[][]): QueueQuestionRef[] {
  const queue: QueueQuestionRef[] = [];
  let round = 0;
  while (queue.length < SET_SIZE) {
    let addedThisRound = false;
    for (const group of groups) {
      const next = group[round];
      if (next) {
        queue.push(next);
        addedThisRound = true;
        if (queue.length === SET_SIZE) return queue;
      }
    }
    if (!addedThisRound) break;
    round += 1;
  }
  return queue;
}

function humanError(error: unknown): string {
  if (error instanceof ApiClientError) return `API ${error.status}: ${error.message}`;
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function setProgress(index: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((index / total) * 100);
}

export default function TimedSetsPage() {
  const submitAttempt = useSubmitAttempt();
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<QueueQuestionRef[]>([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState<QuestionPayload | null>(null);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
  const [forensics, setForensics] = useState<ForensicsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(TARGET_SECONDS);
  const setIdRef = useRef<string | null>(null);
  const setStartedAtRef = useRef(0);
  const questionStartedAtRef = useRef(0);

  useEffect(() => {
    if (!["presenting", "submitting", "forensics"].includes(phase)) return;

    const tick = window.setInterval(() => {
      if (setStartedAtRef.current === 0) return;
      const elapsed = Math.floor((Date.now() - setStartedAtRef.current) / 1000);
      setSecondsRemaining(Math.max(0, TARGET_SECONDS - elapsed));
    }, 1000);

    return () => window.clearInterval(tick);
  }, [phase]);

  const subjectsInSet = useMemo(() => {
    return [...new Set(queue.map((item) => item.subject ?? "Unknown"))];
  }, [queue]);

  const currentRef = queue[index] ?? null;
  const total = queue.length;
  const isLast = index >= total - 1;
  const canSubmit = phase === "presenting" && question !== null && selected !== null;
  const progress = setProgress(index, Math.max(total, SET_SIZE));

  const loadQuestion = async (
    nextIndex: number,
    nextQueue: QueueQuestionRef[] = queue,
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
    questionStartedAtRef.current = Date.now();

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

  const buildSet = async () => {
    setPhase("building");
    setError(null);
    setWarnings([]);
    setQuestion(null);
    setAttempt(null);
    setForensics(null);
    setSelected(null);
    setConfidence(3);
    setIndex(0);
    setSecondsRemaining(TARGET_SECONDS);
    setIdRef.current = `timed-mixed-${Date.now()}`;
    setStartedAtRef.current = Date.now();

    const results = await Promise.allSettled(
      SUBJECTS.map((subject) => fetchSubjectQueue(subject)),
    );
    const successfulGroups: QueueQuestionRef[][] = [];
    const nextWarnings: string[] = [];

    results.forEach((result, subjectIndex) => {
      const subject = SUBJECTS[subjectIndex];
      if (result.status === "rejected") {
        nextWarnings.push(humanError(result.reason));
        return;
      }
      if (result.value.length === 0) {
        nextWarnings.push(`${subject}: no questions returned`);
        return;
      }
      successfulGroups.push(result.value);
    });

    const nextQueue = interleaveQueues(successfulGroups);
    setWarnings(nextWarnings);
    setQueue(nextQueue);

    if (nextQueue.length === 0) {
      setError("No runnable mixed-set questions returned from the subject bank.");
      setPhase("error");
      return;
    }

    if (nextQueue.length < SET_SIZE) {
      setWarnings((items) => [
        ...items,
        `Only ${nextQueue.length} questions returned for this timed set.`,
      ]);
    }

    await loadQuestion(0, nextQueue);
  };

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
        set_id: setIdRef.current ?? `timed-mixed-${Date.now()}`,
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

  const restart = () => {
    void buildSet();
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="mb-8 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        <span className="rounded border border-zinc-200 px-2 py-1">Timed Set Engine</span>
        <span className="rounded border border-zinc-200 px-2 py-1">17-question mixed set</span>
        <span className="rounded border border-zinc-200 px-2 py-1">SRC-0026</span>
      </div>

      <div className="mb-10 grid gap-6 border-b border-zinc-200 pb-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            {BRAND} timed transfer
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Run a timed mixed set, then review the traps that surfaced under pressure.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
            The engine builds a 17-question timed mixed set from the live MBE bank,
            keeps subject context hidden while you answer, and opens Wrong Answer
            Forensics after each submit.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void buildSet()}
              disabled={phase === "building" || phase === "loading-question"}
              className="btn btn-lg red"
            >
              Start timed mixed set
            </button>
            <Link href="/dashboard" className="btn btn-lg ghost">
              Back to dashboard
            </Link>
          </div>
        </div>

        <SetClock
          secondsRemaining={secondsRemaining}
          index={index}
          total={total}
          progress={progress}
        />
      </div>

      {phase === "complete" ? (
        <CompletionPanel
          total={total}
          subjectsInSet={subjectsInSet}
          onRestart={restart}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            {phase === "idle" && <StartPanel onStart={() => void buildSet()} />}

            {phase === "building" && <StatusPanel title="Building timed mixed set" />}
            {phase === "loading-question" && <StatusPanel title="Loading next question" />}

            {phase === "error" && (
              <ErrorPanel
                message={error}
                warnings={warnings}
                onRetry={() => {
                  if (queue.length > 0) {
                    void loadQuestion(index);
                  } else {
                    void buildSet();
                  }
                }}
              />
            )}

            {(phase === "presenting" || phase === "submitting" || phase === "forensics") &&
              question && (
                <QuestionCard
                  question={question}
                  refLabel={currentRef}
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

          <EnginePanel
            phase={phase}
            attempt={attempt}
            forensics={forensics}
            warnings={warnings}
            onNext={next}
            isLast={isLast}
            subjectsInSet={subjectsInSet}
          />
        </div>
      )}
    </section>
  );
}

function SetClock({
  secondsRemaining,
  index,
  total,
  progress,
}: {
  secondsRemaining: number;
  index: number;
  total: number;
  progress: number;
}) {
  return (
    <div className="border border-zinc-200 bg-zinc-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Set clock
          </p>
          <p className="mt-2 font-mono text-4xl font-semibold tracking-tight text-zinc-950">
            {formatClock(secondsRemaining)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Question
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold text-zinc-950">
            {total > 0 ? `${index + 1}/${total}` : `0/${SET_SIZE}`}
          </p>
        </div>
      </div>
      <div className="mt-5 h-2 bg-white">
        <div
          className="h-2 bg-zinc-950 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-zinc-600">
        Target pace is a 30-minute block. Forensics opens after each answer so
        the same set can train speed and transfer.
      </p>
    </div>
  );
}

function StartPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Ready for timed transfer
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-950">
        Start a 17-question mixed block.
      </h2>
      <p className="mt-3 max-w-2xl text-zinc-600">
        BarMatrix will pull across available MBE subjects, keep the topic mix
        hidden while you answer, and send each attempt into the same forensic
        review loop used by single-subject drills.
      </p>
      <button type="button" onClick={onStart} className="btn btn-lg red mt-6">
        Start timed mixed set
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
        Syncing the subject queues and preparing the next timed-set question.
      </p>
    </div>
  );
}

function ErrorPanel({
  message,
  warnings,
  onRetry,
}: {
  message: string | null;
  warnings: string[];
  onRetry: () => void;
}) {
  return (
    <div className="border border-red-200 bg-red-50 p-8">
      <p className="font-medium text-red-900">Timed set unavailable.</p>
      {message && <p className="mt-2 font-mono text-xs text-red-800">{message}</p>}
      {warnings.length > 0 && (
        <ul className="mt-4 space-y-2 text-xs text-red-800">
          {warnings.slice(0, 4).map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
      <button type="button" onClick={onRetry} className="btn btn-sm ghost mt-6">
        Retry
      </button>
    </div>
  );
}

function QuestionCard({
  question,
  refLabel,
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
  refLabel: QueueQuestionRef | null;
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
        <span>Mixed set</span>
        <span>{refLabel?.external_id ?? question.external_id ?? question.question_id.slice(0, 8)}</span>
        <span>Subject hidden until submit</span>
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
        className="btn btn-lg red mt-8"
      >
        {submitting ? "Submitting..." : "Submit answer"}
      </button>
    </article>
  );
}

function EnginePanel({
  phase,
  attempt,
  forensics,
  warnings,
  onNext,
  isLast,
  subjectsInSet,
}: {
  phase: Phase;
  attempt: AttemptResponse | null;
  forensics: ForensicsResponse | null;
  warnings: string[];
  onNext: () => void;
  isLast: boolean;
  subjectsInSet: string[];
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
            ? "Transfer held under time"
            : forensics.trap_name ?? "Timed-set trap"}
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
          className="btn btn-lg red mt-6 w-full justify-center"
        >
          {isLast ? "Finish timed set" : "Next timed question"}
        </button>
      </aside>
    );
  }

  return (
    <aside className="border border-zinc-200 bg-zinc-50 p-6 lg:sticky lg:top-6">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Timed set engine preview
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-950">
        {ENGINE_PREVIEW.heading}
      </h2>
      <dl className="mt-5 space-y-4">
        <PreviewRow label="Mode" value={ENGINE_PREVIEW.focus} />
        <PreviewRow label="Clock" value={ENGINE_PREVIEW.timing} />
        <PreviewRow label="Forensics" value={ENGINE_PREVIEW.forensic} />
        <PreviewRow label="After set" value={ENGINE_PREVIEW.mastery} />
      </dl>
      {subjectsInSet.length > 0 && (
        <div className="mt-5 border border-zinc-200 bg-white p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Subjects synced
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            {subjectsInSet.join(", ")}
          </p>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="mt-5 border border-amber-200 bg-amber-50 p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-amber-800">
            Queue notes
          </p>
          <ul className="mt-2 space-y-1 text-xs text-amber-900">
            {warnings.slice(0, 3).map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-5 text-sm leading-6 text-zinc-600">
        Submit an answer to open the live forensic card, red-zone update, and
        repair assignment for this timed set attempt.
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
  subjectsInSet,
  onRestart,
}: {
  total: number;
  subjectsInSet: string[];
  onRestart: () => void;
}) {
  return (
    <div className="border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Timed set complete
      </p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
        Mixed block complete.
      </h2>
      <p className="mt-4 max-w-2xl text-zinc-600">
        You worked {total} timed question{total === 1 ? "" : "s"} across{" "}
        {subjectsInSet.length || "available"} subject
        {subjectsInSet.length === 1 ? "" : "s"}. Review your Red-Zone Map or
        start another mixed block when you are ready.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onRestart} className="btn btn-lg red">
          Start another timed set
        </button>
        <Link href="/red-zones" className="btn btn-lg ghost">
          View Red-Zone Map
        </Link>
      </div>
    </div>
  );
}
