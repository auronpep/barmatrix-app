"use client";

// Question-flow page — Handoff 10 Phase 2.
//
// Route: /diagnostic/[session]/[index]
//   session = diagnostic_id (also used as set_id on the attempt)
//   index   = 0-based question index into the session's question_ids list
//
// State machine: loading → presenting → submitting → forensics → next.
// Session data (question_ids list) is read from sessionStorage; if missing we
// route the user back to /diagnostic to restart so we never render bogus UUIDs.

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  api,
  ApiClientError,
  type AttemptResponse,
  type ForensicsResponse,
  type Letter,
  type QuestionPayload,
} from "@/lib/api-client";

type Phase = "loading" | "presenting" | "submitting" | "forensics" | "error";

interface SessionCache {
  diagnostic_id: string;
  question_ids: string[];
  total_questions: number;
  expected_total: number;
  bank_loaded: boolean;
}

function readSessionCache(diagnosticId: string): SessionCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(`barmatrix.diagnostic.${diagnosticId}`);
    if (!raw) return null;
    return JSON.parse(raw) as SessionCache;
  } catch {
    return null;
  }
}

export default function DiagnosticQuestionPage({
  params,
}: {
  params: Promise<{ session: string; index: string }>;
}) {
  const { session: diagnosticId, index: indexStr } = use(params);
  const index = Number.parseInt(indexStr, 10);
  const router = useRouter();

  const [sessionCache, setSessionCache] = useState<SessionCache | null>(null);
  const [question, setQuestion] = useState<QuestionPayload | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [confidence, setConfidence] = useState<number>(3);
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
  const [forensics, setForensics] = useState<ForensicsResponse | null>(null);
  const startedAtRef = useRef<number>(Date.now());

  // Load the session cache + the question for this index on mount.
  useEffect(() => {
    if (Number.isNaN(index) || index < 0) {
      router.replace("/diagnostic");
      return;
    }
    const cache = readSessionCache(diagnosticId);
    if (!cache) {
      router.replace("/diagnostic");
      return;
    }
    setSessionCache(cache);

    if (index >= cache.question_ids.length) {
      router.replace(`/diagnostic/${diagnosticId}/results`);
      return;
    }

    const qid = cache.question_ids[index];
    if (!qid) {
      router.replace(`/diagnostic/${diagnosticId}/results`);
      return;
    }

    startedAtRef.current = Date.now();
    setSelected(null);
    setConfidence(3);
    setAttempt(null);
    setForensics(null);
    setPhase("loading");

    api
      .getQuestion(qid)
      .then((q) => {
        setQuestion(q);
        setPhase("presenting");
      })
      .catch((err: unknown) => {
        setErrorMsg(humanError(err));
        setPhase("error");
      });
  }, [diagnosticId, index, router]);

  const total = sessionCache?.total_questions ?? 0;
  const isLast = sessionCache !== null && index >= sessionCache.question_ids.length - 1;

  const submit = async () => {
    if (!question || !selected) return;
    setPhase("submitting");
    setErrorMsg(null);
    const timeSeconds = Math.max(
      0,
      Math.round((Date.now() - startedAtRef.current) / 1000),
    );
    try {
      const resp = await api.submitAttempt({
        question_id: question.question_id,
        selected_letter: selected,
        confidence,
        time_seconds: timeSeconds,
        platform: "web",
        set_id: diagnosticId,
      });
      setAttempt(resp);
      const f = await api.getForensics(resp.attempt_id);
      setForensics(f);
      setPhase("forensics");
    } catch (err) {
      setErrorMsg(humanError(err));
      setPhase("error");
    }
  };

  const next = () => {
    if (!sessionCache) return;
    if (isLast) {
      router.push(`/diagnostic/${diagnosticId}/results`);
    } else {
      router.push(`/diagnostic/${diagnosticId}/${index + 1}`);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <ProgressIndicator current={index + 1} total={total} />

      {phase === "loading" && <Loading />}

      {phase === "error" && (
        <ErrorPanel
          message={errorMsg}
          onRetry={() => {
            router.refresh();
          }}
        />
      )}

      {(phase === "presenting" || phase === "submitting") && question && (
        <QuestionCard
          question={question}
          selected={selected}
          onSelect={(letter) => setSelected(letter)}
          confidence={confidence}
          onConfidenceChange={setConfidence}
          disabled={phase === "submitting"}
          onSubmit={submit}
        />
      )}

      {phase === "forensics" && attempt && forensics && (
        <ForensicsCard
          attempt={attempt}
          forensics={forensics}
          onNext={next}
          isLast={isLast}
        />
      )}
    </section>
  );
}

// ----------------------------------------------------------------------------

function ProgressIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  if (total <= 0) return null;
  return (
    <p className="mb-8 font-mono text-xs uppercase tracking-wider text-zinc-500">
      Question {current} of {total}
    </p>
  );
}

function Loading() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8">
      <p className="text-zinc-600">Loading question…</p>
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
    <div className="rounded-lg border border-red-200 bg-red-50 p-8">
      <p className="font-medium text-red-800">Something went wrong.</p>
      {message && <p className="mt-2 font-mono text-xs text-red-700">{message}</p>}
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-md border border-red-300 px-5 py-2.5 text-sm font-medium text-red-900 hover:bg-red-100"
      >
        Try again
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
  onSubmit,
}: {
  question: QuestionPayload;
  selected: Letter | null;
  onSelect: (letter: Letter) => void;
  confidence: number;
  onConfidenceChange: (value: number) => void;
  disabled: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        {question.subject}
        {question.subtopic ? ` · ${question.subtopic}` : ""}
      </p>

      <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-zinc-800">
        {question.fact_pattern}
      </div>

      <p className="mt-6 text-base font-medium text-zinc-900">
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
                className={`w-full rounded-md border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400"
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
          disabled={disabled}
          onChange={(e) => onConfidenceChange(Number.parseInt(e.target.value, 10))}
          className="mt-2 w-full"
          aria-label="Confidence level from 1 to 5"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-wide text-zinc-500">
          <span>1 · guessing</span>
          <span>3 · neutral</span>
          <span>5 · certain</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || selected === null}
        className="mt-8 rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {disabled ? "Submitting…" : "Submit answer"}
      </button>
    </div>
  );
}

function ForensicsCard({
  attempt,
  forensics,
  onNext,
  isLast,
}: {
  attempt: AttemptResponse;
  forensics: ForensicsResponse;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-8 shadow-sm ${
        attempt.correct
          ? "border-emerald-300 bg-emerald-50"
          : "border-zinc-300 bg-white"
      }`}
    >
      <p
        className={`font-mono text-xs uppercase tracking-wider ${
          attempt.correct ? "text-emerald-700" : "text-amber-700"
        }`}
      >
        {attempt.correct
          ? "Correct"
          : `Wrong Answer Forensics · correct answer was ${attempt.correct_answer ?? "—"}`}
      </p>

      {attempt.correct ? (
        <>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-900">
            Why that answer was right
          </h2>
          {forensics.why_correct && (
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-zinc-800">
              {forensics.why_correct}
            </p>
          )}
        </>
      ) : (
        <>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-900">
            {forensics.trap_name ?? "Wrong-answer trap"}
          </h2>

          {forensics.why_attractive && (
            <Section title="Why this answer looked right">
              {forensics.why_attractive}
            </Section>
          )}
          {forensics.why_wrong && (
            <Section title="Why it&apos;s actually wrong">{forensics.why_wrong}</Section>
          )}
          {forensics.future_cue && (
            <Section title="Cue for next time">{forensics.future_cue}</Section>
          )}
        </>
      )}

      {forensics.focus_group && (
        <p className="mt-6 rounded-md bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
          <span className="font-medium">Focus-group data:</span>{" "}
          {forensics.focus_group.selected_choice_pct}% of {forensics.focus_group.sample_size}{" "}
          test-takers picked the same answer.
        </p>
      )}

      {!attempt.correct && forensics.assigned_drill && (
        <p className="mt-4 text-sm text-zinc-700">
          <span className="font-medium">Assigned drill:</span>{" "}
          {forensics.assigned_drill.name}
        </p>
      )}

      <button
        type="button"
        onClick={onNext}
        className="mt-8 rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
      >
        {isLast ? "See results" : "Next question →"}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{title}</p>
      <p className="mt-1 whitespace-pre-line text-base leading-relaxed text-zinc-800">
        {children}
      </p>
    </div>
  );
}

function humanError(err: unknown): string {
  if (err instanceof ApiClientError) return `API ${err.status}: ${err.message}`;
  if (err instanceof Error) return err.message;
  return "Unknown error";
}
