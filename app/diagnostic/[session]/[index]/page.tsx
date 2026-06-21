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
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  api,
  ApiClientError,
  type AttemptResponse,
  type ForensicsResponse,
  type Letter,
  type QuestionPayload,
} from "@/lib/api-client";
import { useSubmitAttempt } from "@/lib/use-attempts";
import {
  trackForensicsViewed,
  trackQuestionAttempted,
} from "@/lib/analytics";
import { humanizeSubject } from "@/lib/format-subject";

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

function firstMissCaseStudyKey(diagnosticId: string): string {
  return `barmatrix.diagnostic.${diagnosticId}.firstMissCaseStudySeen`;
}

function shouldShowFirstMissCaseStudy(diagnosticId: string, correct: boolean): boolean {
  if (correct || typeof window === "undefined") return false;
  try {
    const key = firstMissCaseStudyKey(diagnosticId);
    if (window.sessionStorage.getItem(key) === "1") return false;
    window.sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
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
  const submitAttempt = useSubmitAttempt();

  const [sessionCache, setSessionCache] = useState<SessionCache | null>(null);
  const [question, setQuestion] = useState<QuestionPayload | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [confidence, setConfidence] = useState<number>(3);
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
  const [forensics, setForensics] = useState<ForensicsResponse | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  const startedAtRef = useRef<number>(0);

  // Load the session cache + the question for this index on mount.
  useEffect(() => {
    let active = true;

    if (Number.isNaN(index) || index < 0) {
      router.replace("/diagnostic");
      return;
    }
    const cache = readSessionCache(diagnosticId);
    if (!cache) {
      router.replace("/diagnostic");
      return;
    }
    queueMicrotask(() => {
      if (active) {
        setSessionCache(cache);
      }
    });

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
    queueMicrotask(() => {
      if (!active) return;
      setSelected(null);
      setConfidence(3);
      setAttempt(null);
      setForensics(null);
      setShowCaseStudy(false);
      setPhase("loading");
    });

    api
      .getQuestion(qid)
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

    // --- attempt submission (hard failure: show error panel) ---
    let resp: AttemptResponse;
    try {
      resp = await submitAttempt({
        question_id: question.question_id,
        selected_letter: selected,
        confidence,
        time_seconds: timeSeconds,
        platform: "web",
        set_id: diagnosticId,
      });
    } catch (err) {
      setErrorMsg(humanError(err));
      setPhase("error");
      return;
    }

    // Attempt succeeded. Record it and fire analytics — neither can block progression.
    setAttempt(resp);
    try {
      trackQuestionAttempted({
        questionId: question.question_id,
        correct: resp.correct,
        confidence,
        sessionId: diagnosticId,
      });
    } catch {
      // analytics failure must never trap the user
    }

    // --- forensics fetch (soft failure: show verdict + next without forensics) ---
    // A 10-second timeout ensures the user is never left on "Submitting answer..."
    // even if the forensics endpoint hangs. The attempt is already recorded; the
    // verdict (correct/wrong + correct_answer) is available from `resp` alone.
    let f: ForensicsResponse | null = null;
    try {
      const forensicsPromise = resp.attempt_id
        ? api.getForensics(resp.attempt_id)
        : Promise.reject(new Error("missing attempt_id"));

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("forensics_timeout")), 10_000),
      );

      f = await Promise.race([forensicsPromise, timeoutPromise]);
    } catch {
      // Forensics unavailable — still advance so the user sees the verdict and
      // "Next question" button. f stays null; ForensicsCard renders gracefully.
    }

    setForensics(f);
    setShowCaseStudy(shouldShowFirstMissCaseStudy(diagnosticId, resp.correct));

    try {
      if (f) {
        trackForensicsViewed({
          attemptId: resp.attempt_id,
          forensicTags: collectForensicTags(resp, f),
          sessionId: diagnosticId,
        });
      }
    } catch {
      // analytics failure must never trap the user
    }

    setPhase("forensics");
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
    <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-12">
      <ProgressIndicator current={index + 1} total={total} />

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
          disabled={phase === "submitting"}
          onSubmit={submit}
        />
      )}

      {phase === "forensics" && attempt && (
        showCaseStudy ? (
          <DiagnosticMissCaseStudy
            attempt={attempt}
            forensics={forensics}
            onNext={next}
            isLast={isLast}
          />
        ) : (
          <ForensicsCard
            attempt={attempt}
            forensics={forensics}
            onNext={next}
            isLast={isLast}
          />
        )
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
    <p className="mb-4 font-mono text-xs uppercase tracking-wider text-zinc-500 sm:mb-8">
      Question {current} of {total}
    </p>
  );
}

function Loading() {
  return (
    <div className="border border-zinc-900 bg-white p-8" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        Loading question
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
        Retry the question request. If the session cache is stale, restart the diagnostic
        and BarMatrix will open a fresh question sequence.
      </p>
      {message && <p className="mt-3 font-mono text-xs text-red-800">{message}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onRetry} className="btn red">
          Retry question
        </button>
        <Link href="/diagnostic" className="btn ghost">
          Restart diagnostic
        </Link>
      </div>
    </div>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <div
      className="h-3 bg-zinc-200"
      style={{ width }}
      aria-hidden="true"
    />
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
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-8">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        {humanizeSubject(question.subject)}
        {question.subtopic ? ` · ${question.subtopic}` : ""}
      </p>

      <div className="mt-3 whitespace-pre-line text-base leading-relaxed text-zinc-800 sm:mt-4">
        {question.fact_pattern}
      </div>

      {question.call_of_question &&
        !question.fact_pattern.includes(question.call_of_question.trim()) && (
          <p className="mt-4 text-base font-medium text-zinc-900 sm:mt-6">
            {question.call_of_question}
          </p>
        )}

      <ul className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
        {question.choices.map((choice) => {
          const isSelected = selected === choice.letter;
          return (
            <li key={choice.choice_id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(choice.letter)}
                aria-pressed={isSelected}
                className={`min-h-[44px] w-full rounded-md !border-2 !border-solid px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                  isSelected
                    ? "!border-zinc-900 !bg-zinc-900 !text-white"
                    : "!border-zinc-200 !bg-white !text-zinc-800 hover:!border-zinc-500 hover:!bg-zinc-50"
                } disabled:cursor-not-allowed`}
              >
                <span className="font-mono font-semibold">{choice.letter}.</span>{" "}
                <span>{choice.choice_text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 sm:mt-8">
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
        className="btn red mt-5 sm:mt-8"
      >
        {disabled ? "Submitting answer..." : "Submit answer"}
      </button>
    </div>
  );
}

function DiagnosticMissCaseStudy({
  attempt,
  forensics,
  onNext,
  isLast,
}: {
  attempt: AttemptResponse;
  forensics: ForensicsResponse | null;
  onNext: () => void;
  isLast: boolean;
}) {
  const trapName = forensics?.trap_name ?? "Wrong-answer trap";
  const continueLabel = isLast ? "Continue to results" : "Continue diagnostic";
  return (
    <div className="rounded-lg border border-zinc-900 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            First miss case study
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-950">
            This is how a miss becomes a Red-Zone Map.
          </h2>
        </div>
        <button type="button" onClick={onNext} className="btn red shrink-0">
          {continueLabel} <span aria-hidden>→</span>
        </button>
      </div>

      <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-zinc-200 p-5 sm:p-6 md:border-b-0 md:border-r">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Trap exposed
          </p>
          <h3 className="mt-2 font-serif text-2xl font-semibold text-zinc-950">
            {trapName}
          </h3>
          <p className="mt-4 text-base leading-7 text-zinc-700">
            Your answer was not treated as a random miss. BarMatrix records the
            answer you chose, the confidence level, the correct answer, and the
            wrong-answer architecture behind the choice. That is the start of
            the red zone.
          </p>
          {forensics?.focus_group && (
            <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              {forensics.focus_group.selected_choice_pct}% of{" "}
              {forensics.focus_group.sample_size} test-takers picked this same
              answer. That makes it a diagnostic signal, not just a bad moment.
            </p>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Repair move
          </p>
          <div className="mt-4 space-y-5">
            <CaseStudyStep
              label="What pulled you"
              body={
                forensics?.why_attractive ??
                "The choice likely sounded familiar enough to survive the first cut."
              }
            />
            <CaseStudyStep
              label="What broke"
              body={
                forensics?.why_wrong ??
                `The credited answer was ${attempt.correct_answer ?? "the controlling answer"}.`
              }
            />
            <CaseStudyStep
              label="Next cue"
              body={
                forensics?.future_cue ??
                "Slow down at the controlling distinction before the answer choices start sounding familiar."
              }
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-zinc-50 p-5 sm:p-6">
        <p className="max-w-2xl text-sm leading-6 text-zinc-700">
          Flagship uses this same structure after the diagnostic: name the trap,
          isolate the missed distinction, assign the repair, then give one next
          task instead of another mixed pile.
        </p>
        <button type="button" onClick={onNext} className="btn red mt-5">
          {continueLabel} <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function CaseStudyStep({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-800">
        {body}
      </p>
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
  forensics: ForensicsResponse | null;
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

      {forensics ? (
        <>
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

          {!attempt.correct && forensics.assigned_drill && (
            <p className="mt-4 text-sm text-zinc-700">
              <span className="font-medium">Assigned drill:</span>{" "}
              {forensics.assigned_drill.name}
            </p>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm text-zinc-600">
          {attempt.correct
            ? "Your answer was correct."
            : `The correct answer was ${attempt.correct_answer ?? "—"}.`}
        </p>
      )}

      <button
        type="button"
        onClick={onNext}
        className="mt-8 rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900"
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

function collectForensicTags(
  attempt: AttemptResponse,
  forensics: ForensicsResponse | null,
): string[] {
  const redZoneUpdates = Array.isArray(attempt.red_zone_updates)
    ? attempt.red_zone_updates
    : [];
  const tags = [
    ...redZoneUpdates.map((update) => `${update.dimension}:${update.tag}`),
    forensics?.trap_name,
    forensics?.assigned_drill?.slug,
  ].filter((tag): tag is string => Boolean(tag));

  return tags.length > 0 ? tags : ["diagnostic_attempt"];
}
