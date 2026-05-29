"use client";

// Shared question runner — Web Component 05 (Boot Camp) and any future set-based
// surface. Ported from app/diagnostic/[session]/[index]/page.tsx, but runs an
// entire list of question_ids in place (load -> present -> submit -> forensics
// -> next) and fires onComplete with the run summary instead of navigating
// per-question. Resume-aware: questions already answered for this set_id are
// skipped so reopening a day lands on the first unanswered question.

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  api,
  ApiClientError,
  type AttemptResponse,
  type ForensicsResponse,
  type Letter,
  type QuestionPayload,
} from "@/lib/api-client";
import { trackForensicsViewed, trackQuestionAttempted } from "@/lib/analytics";
import { useSubmitAttempt } from "@/lib/use-attempts";

type Phase = "loading" | "presenting" | "submitting" | "forensics" | "error" | "done";

export interface RunnerSummary {
  answered: number;
  correct: number;
  total: number;
}

interface QuestionRunnerProps {
  questionIds: string[];
  /** set_id every attempt is tagged with (boot camp day = session_id; mastery = mastery_set_id). */
  setId: string;
  /** Questions already answered for this set_id (resume). */
  answeredQuestionIds?: string[];
  /** Correct answers already recorded for this set_id (resume). */
  initialCorrect?: number;
  /** Small eyebrow label, e.g. "Day 2" or "Mastery check". */
  title?: string;
  /** CTA label shown on the final question's forensics card. */
  completeLabel?: string;
  onComplete: (summary: RunnerSummary) => void;
}

export default function QuestionRunner({
  questionIds,
  setId,
  answeredQuestionIds = [],
  initialCorrect = 0,
  title,
  completeLabel = "Finish",
  onComplete,
}: QuestionRunnerProps) {
  const answeredSet = useMemo(
    () => new Set(answeredQuestionIds),
    [answeredQuestionIds],
  );
  // Only run the questions not already answered for this set.
  const pending = useMemo(
    () => questionIds.filter((id) => !answeredSet.has(id)),
    [questionIds, answeredSet],
  );

  const total = questionIds.length;
  const priorAnswered = Math.min(answeredSet.size, total);

  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState<QuestionPayload | null>(null);
  const [phase, setPhase] = useState<Phase>(pending.length === 0 ? "done" : "loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
  const [forensics, setForensics] = useState<ForensicsResponse | null>(null);
  const [correct, setCorrect] = useState(initialCorrect);
  const [answered, setAnswered] = useState(priorAnswered);
  const startedAtRef = useRef(0);
  const submitAttempt = useSubmitAttempt();

  const currentQid = pending[index];
  const isLast = index >= pending.length - 1;

  // Load the question for the current index.
  useEffect(() => {
    if (pending.length === 0 || !currentQid) return;
    let active = true;
    startedAtRef.current = Date.now();
    // Defer the reset out of the synchronous effect body to avoid cascading
    // renders (react-hooks/set-state-in-effect); the diagnostic flow does the same.
    queueMicrotask(() => {
      if (!active) return;
      setSelected(null);
      setConfidence(3);
      setAttempt(null);
      setForensics(null);
      setErrorMsg(null);
      setPhase("loading");
    });

    api
      .getQuestion(currentQid)
      .then((q) => {
        if (!active) return;
        setQuestion(q);
        setPhase("presenting");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setErrorMsg(humanError(err));
        setPhase("error");
      });

    return () => {
      active = false;
    };
  }, [currentQid, pending.length]);

  const submit = async () => {
    if (!question || !selected) return;
    setPhase("submitting");
    setErrorMsg(null);
    const timeSeconds = Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000));
    try {
      const resp = await submitAttempt({
        question_id: question.question_id,
        selected_letter: selected,
        confidence,
        time_seconds: timeSeconds,
        platform: "web",
        set_id: setId,
      });
      setAttempt(resp);
      setAnswered((n) => n + 1);
      if (resp.correct) setCorrect((n) => n + 1);
      trackQuestionAttempted({
        questionId: question.question_id,
        correct: resp.correct,
        confidence,
        sessionId: setId,
      });
      const f = await api.getForensics(resp.attempt_id);
      setForensics(f);
      trackForensicsViewed({
        attemptId: resp.attempt_id,
        forensicTags: collectForensicTags(resp, f),
        sessionId: setId,
      });
      setPhase("forensics");
    } catch (err) {
      setErrorMsg(humanError(err));
      setPhase("error");
    }
  };

  const next = () => {
    if (isLast) {
      setPhase("done");
      onComplete({ answered, correct, total });
      return;
    }
    setIndex((i) => i + 1);
  };

  if (phase === "done") {
    return (
      <div className="rounded-lg border border-zinc-300 bg-white p-8 shadow-sm" role="status">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-700">
          Block complete
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-900">
          You answered every question in this block.
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-700">
          {correct} of {total} correct so far.
        </p>
        <button type="button" onClick={() => onComplete({ answered, correct, total })} className="btn red mt-6">
          {completeLabel}
        </button>
      </div>
    );
  }

  const progressCurrent = Math.min(answered + 1, total);

  return (
    <section>
      {(title || total > 0) && (
        <p className="mb-6 font-mono text-xs uppercase tracking-wider text-zinc-500">
          {title ? `${title} · ` : ""}
          Question {progressCurrent} of {total}
        </p>
      )}

      {phase === "loading" && <Loading />}

      {phase === "error" && (
        <ErrorPanel message={errorMsg} onRetry={() => window.location.reload()} />
      )}

      {(phase === "presenting" || phase === "submitting") && question && (
        <QuestionCard
          question={question}
          selected={selected}
          onSelect={setSelected}
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
          nextLabel={isLast ? completeLabel : "Next question →"}
        />
      )}
    </section>
  );
}

// ----------------------------------------------------------------------------

function Loading() {
  return (
    <div className="border border-zinc-900 bg-white p-8" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">Loading question</p>
      <div className="mt-5 space-y-3">
        <SkeletonLine width="70%" />
        <SkeletonLine width="100%" />
        <SkeletonLine width="92%" />
        <SkeletonLine width="64%" />
      </div>
    </div>
  );
}

function ErrorPanel({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="border border-red-300 bg-red-50 p-8" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">Question unavailable</p>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-red-950">
        Something went wrong loading this question.
      </h2>
      {message && <p className="mt-3 font-mono text-xs text-red-800">{message}</p>}
      <button type="button" onClick={onRetry} className="btn red mt-6">
        Retry
      </button>
    </div>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return <div className="h-3 bg-zinc-200" style={{ width }} aria-hidden="true" />;
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
                aria-pressed={isSelected}
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
        className="btn red mt-8"
      >
        {disabled ? "Submitting answer..." : "Submit answer"}
      </button>
    </div>
  );
}

function ForensicsCard({
  attempt,
  forensics,
  onNext,
  nextLabel,
}: {
  attempt: AttemptResponse;
  forensics: ForensicsResponse;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div
      className={`rounded-lg border p-8 shadow-sm ${
        attempt.correct ? "border-emerald-300 bg-emerald-50" : "border-zinc-300 bg-white"
      }`}
      role="status"
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
            <Section title="Why this answer looked right">{forensics.why_attractive}</Section>
          )}
          {forensics.why_wrong && (
            <Section title="Why it is actually wrong">{forensics.why_wrong}</Section>
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

      <button
        type="button"
        onClick={onNext}
        className="mt-8 rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
      >
        {nextLabel}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{title}</p>
      <p className="mt-1 whitespace-pre-line text-base leading-relaxed text-zinc-800">{children}</p>
    </div>
  );
}

function humanError(err: unknown): string {
  if (err instanceof ApiClientError) return `API ${err.status}: ${err.message}`;
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

function collectForensicTags(attempt: AttemptResponse, forensics: ForensicsResponse): string[] {
  const tags = [
    ...attempt.red_zone_updates.map((u) => `${u.dimension}:${u.tag}`),
    forensics.trap_name,
    forensics.assigned_drill?.slug,
  ].filter((tag): tag is string => Boolean(tag));
  return tags.length > 0 ? tags : ["boot_camp_attempt"];
}
