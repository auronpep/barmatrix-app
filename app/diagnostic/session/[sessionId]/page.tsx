"use client";

// C3 Placement Diagnostic — 18-question curated session.
//
// Route: /diagnostic/session/[sessionId]
//
// Flow per question:
//   loading → presenting → (select answer + confidence) → submitting
//   → result_overlay (show result + mechanism prompt) → next
//
// After all 18 questions: navigate to /diagnostic/session/[sessionId]/results

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  api,
  ApiClientError,
  type C3Mechanism,
  type Letter,
  type PlacementAttemptResponse,
  type PlacementQuestion,
} from "@/lib/api-client";

type Phase =
  | "loading"
  | "presenting"
  | "submitting"
  | "result_overlay"
  | "error";

const MECHANISM_OPTIONS: Array<{ value: C3Mechanism; label: string; description: string }> = [
  {
    value: "CUT_MISSTATE",
    label: "CUT — Other answers misstated the law",
    description: "Wrong choices stated an incorrect legal rule",
  },
  {
    value: "CUT_WRONG_Q",
    label: "CUT — Other answers answered the wrong question",
    description: "Wrong choices answered a different question than what was asked",
  },
  {
    value: "CLASH",
    label: "CLASH — Two answers fought on one key fact",
    description: "The decision turned on a contested fact or element",
  },
  {
    value: "CALL",
    label: "CALL — A gate, threshold, or layer controlled",
    description: "A procedural gate, threshold requirement, or legal layer resolved it",
  },
  {
    value: "ANCHOR",
    label: "ANCHOR — I needed a memorized bright-line rule",
    description: "A specific bright-line rule or established doctrine controlled",
  },
  {
    value: "FORK",
    label: "FORK — The answer depended on missing facts or a jurisdiction split",
    description: "Different facts or different jurisdictions would flip the answer",
  },
];

interface StoredSession {
  session_id: string;
  question_ids: string[];
  completed_count: number;
}

function cacheSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      `barmatrix.placement.${session.session_id}`,
      JSON.stringify(session),
    );
  } catch {
    // sessionStorage unavailable — state is held in component memory
  }
}

function readSessionCache(sessionId: string): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(`barmatrix.placement.${sessionId}`);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export default function PlacementSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();

  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [mechanism, setMechanism] = useState<C3Mechanism | null>(null);
  const [attemptResult, setAttemptResult] = useState<PlacementAttemptResponse | null>(null);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    let active = true;

    api
      .getPlacementQuestions()
      .then((resp) => {
        if (!active) return;
        const ids = resp.questions.map((q) => q.question_id);
        const cached = readSessionCache(sessionId);
        const resumeIndex = cached ? cached.completed_count : 0;

        // Store question list for resumption
        cacheSession({ session_id: sessionId, question_ids: ids, completed_count: resumeIndex });

        setQuestions(resp.questions);
        setCurrentIndex(resumeIndex);
        setPhase("presenting");
        startedAtRef.current = Date.now();
      })
      .catch((err: unknown) => {
        if (!active) return;
        setErrorMsg(humanError(err));
        setPhase("error");
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Reset input state when question changes
  useEffect(() => {
    setSelected(null);
    setConfidence(50);
    setMechanism(null);
    setAttemptResult(null);
    startedAtRef.current = Date.now();
  }, [currentIndex]);

  const question = questions[currentIndex] ?? null;
  const total = questions.length;
  const isLast = currentIndex >= total - 1;

  const submit = async () => {
    if (!question || !selected || !mechanism) return;
    setPhase("submitting");
    setErrorMsg(null);
    const timeSeconds = Math.max(
      0,
      Math.round((Date.now() - startedAtRef.current) / 1000),
    );
    try {
      const result = await api.submitPlacementAttempt(sessionId, {
        question_id: question.question_id,
        selected_letter: selected,
        confidence,
        time_seconds: timeSeconds,
        mechanism,
      });
      setAttemptResult(result);
      // Update completed count in cache
      cacheSession({
        session_id: sessionId,
        question_ids: questions.map((q) => q.question_id),
        completed_count: currentIndex + 1,
      });
      setPhase("result_overlay");
    } catch (err) {
      setErrorMsg(humanError(err));
      setPhase("error");
    }
  };

  const next = () => {
    if (isLast) {
      router.push(`/diagnostic/session/${sessionId}/results`);
    } else {
      setCurrentIndex((i) => i + 1);
      setPhase("presenting");
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      {total > 0 && (
        <ProgressIndicator current={currentIndex + 1} total={total} />
      )}

      {phase === "loading" && <Loading />}

      {phase === "error" && (
        <ErrorPanel
          message={errorMsg}
          onRetry={() => {
            window.location.reload();
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
          mechanism={mechanism}
          onMechanismChange={setMechanism}
          disabled={phase === "submitting"}
          onSubmit={submit}
        />
      )}

      {phase === "result_overlay" && question && attemptResult && (
        <ResultOverlay
          question={question}
          result={attemptResult}
          isLast={isLast}
          onNext={next}
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
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Question {current} of {total}
        </p>
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          {pct}%
        </p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full bg-red-700 transition-all duration-300"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="border border-zinc-900 bg-white p-8" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Loading placement assessment
      </p>
      <div className="mt-5 space-y-3">
        <SkeletonLine width="70%" />
        <SkeletonLine width="100%" />
        <SkeletonLine width="92%" />
        <SkeletonLine width="64%" />
      </div>
      <div className="mt-8 grid gap-3">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="border border-zinc-200 bg-zinc-50 p-4">
            <SkeletonLine width={`${72 + item * 5}%`} />
          </div>
        ))}
      </div>
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
    <div className="border border-red-300 bg-red-50 p-8" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Question unavailable
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-red-950">
        Something went wrong loading this question.
      </h2>
      <p className="mt-3 text-sm leading-6 text-red-900">
        Retry the question request. If the session cannot be recovered, restart
        from the placement entry page.
      </p>
      {message && (
        <p className="mt-3 font-mono text-xs text-red-800">{message}</p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onRetry} className="btn red">
          Retry
        </button>
        <Link href="/diagnostic/session" className="btn ghost">
          Restart placement
        </Link>
      </div>
    </div>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <div className="h-3 bg-zinc-200" style={{ width }} aria-hidden="true" />
  );
}

function QuestionCard({
  question,
  selected,
  onSelect,
  confidence,
  onConfidenceChange,
  mechanism,
  onMechanismChange,
  disabled,
  onSubmit,
}: {
  question: PlacementQuestion;
  selected: Letter | null;
  onSelect: (letter: Letter) => void;
  confidence: number;
  onConfidenceChange: (value: number) => void;
  mechanism: C3Mechanism | null;
  onMechanismChange: (value: C3Mechanism) => void;
  disabled: boolean;
  onSubmit: () => void;
}) {
  const canSubmit = selected !== null && mechanism !== null;

  return (
    <div className="space-y-6">
      {/* Question panel */}
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
                  <span className="font-mono font-semibold">
                    {choice.letter}.
                  </span>{" "}
                  <span>{choice.choice_text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Confidence slider */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-zinc-800">
            How confident are you?{" "}
            <span className="font-mono">{confidence}</span>
            <span className="text-zinc-500"> / 100</span>
          </label>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-zinc-400">
            0 = guessing · 100 = certain
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={confidence}
            disabled={disabled}
            onChange={(e) =>
              onConfidenceChange(Number.parseInt(e.target.value, 10))
            }
            className="mt-2 w-full"
            aria-label="Confidence level from 0 to 100"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-wide text-zinc-500">
            <span>0 · guessing</span>
            <span>50 · moderate</span>
            <span>100 · certain</span>
          </div>
        </div>
      </div>

      {/* C3 Mechanism prompt — appears once an answer is selected */}
      {selected !== null && (
        <div className="rounded-lg border border-zinc-300 bg-zinc-50 p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            C3 Mechanism
          </p>
          <p className="mt-2 text-base font-medium text-zinc-900">
            What was the main reason the right answer won?
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            Select the mechanism even if you got the answer wrong — identify
            what the question was testing.
          </p>
          <div className="mt-4 space-y-2">
            {MECHANISM_OPTIONS.map((opt) => {
              const isSelected = mechanism === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onMechanismChange(opt.value)}
                  className={`w-full rounded-md border px-4 py-3 text-left transition ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400"
                  }`}
                >
                  <span className="block text-sm font-medium">
                    {opt.label}
                  </span>
                  <span
                    className={`block text-xs mt-0.5 ${
                      isSelected ? "text-zinc-300" : "text-zinc-500"
                    }`}
                  >
                    {opt.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !canSubmit}
        className="btn red"
      >
        {disabled ? "Submitting..." : "Submit answer →"}
      </button>
    </div>
  );
}

function ResultOverlay({
  question,
  result,
  isLast,
  onNext,
}: {
  question: PlacementQuestion;
  result: PlacementAttemptResponse;
  isLast: boolean;
  onNext: () => void;
}) {
  return (
    <div
      className={`rounded-lg border p-8 shadow-sm ${
        result.is_correct
          ? "border-emerald-300 bg-emerald-50"
          : "border-zinc-300 bg-white"
      }`}
    >
      <p
        className={`font-mono text-xs uppercase tracking-wider ${
          result.is_correct ? "text-emerald-700" : "text-amber-700"
        }`}
      >
        {result.is_correct
          ? "Correct"
          : `Wrong · correct answer was ${result.correct_letter}`}
      </p>

      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-900">
        {result.correct_text}
      </h2>

      {result.why_wrong_or_correct && (
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-zinc-800">
          {result.why_wrong_or_correct}
        </p>
      )}

      {/* Per-question score summary */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <ScorePill label="Legal" value={result.legal_score} />
        <ScorePill label="Mechanism" value={result.mechanism_score} />
        <ScorePill label="Calibration" value={result.calibration_score} />
      </div>

      <div className="mt-4 rounded-md bg-zinc-100 px-4 py-3 font-mono text-xs text-zinc-600">
        Session score so far:{" "}
        <span className="font-semibold text-zinc-900">
          {result.session_score_so_far}
        </span>{" "}
        · {result.attempts_so_far} of{" "}
        {question.external_id?.startsWith("DIAG-") ? "18" : "18"} answered
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-8 rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900"
      >
        {isLast ? "See placement results →" : "Next question →"}
      </button>
    </div>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  const isGood = value > 0;
  return (
    <div
      className={`rounded-md border px-3 py-2 text-center ${
        isGood
          ? "border-emerald-200 bg-emerald-50"
          : "border-zinc-200 bg-zinc-50"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 font-serif text-xl font-semibold ${
          isGood ? "text-emerald-700" : "text-zinc-400"
        }`}
      >
        {value > 0 ? `+${value}` : value}
      </p>
    </div>
  );
}

function humanError(err: unknown): string {
  if (err instanceof ApiClientError) return `API ${err.status}: ${err.message}`;
  if (err instanceof Error) return err.message;
  return "Unknown error";
}
