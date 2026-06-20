"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { api, ApiClientError, type AtlasAnswer, type AtlasQuestionListItem, type Letter } from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

const LETTERS: Letter[] = ["A", "B", "C", "D"];

type State =
  | { kind: "loading" }
  | { kind: "locked" }
  | { kind: "error"; message: string }
  | { kind: "ready"; answer: AtlasAnswer };

export default function AtlasQuestionPracticePage() {
  const params = useParams<{ id: string | string[] }>();
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const questionId = id ?? "";
  const answerHref = `/atlas/questions/${encodeURIComponent(questionId)}/answer`;
  const [state, setState] = useState<State>({ kind: "loading" });
  const [selection, setSelection] = useState<{ questionId: string; selected: Letter | null; submitted: boolean }>({
    questionId: "",
    selected: null,
    submitted: false,
  });
  const [codeQuestions, setCodeQuestions] = useState<{ outlineCode: string; items: AtlasQuestionListItem[] } | null>(
    null,
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (!questionId) return;

    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const answer = await api.getAtlasAnswer(token, questionId);
        const questions = await api.getAtlasQuestions(token, answer.question.outline_code).catch(() => ({ items: [] }));
        if (!cancelled) {
          setCodeQuestions({ outlineCode: answer.question.outline_code, items: questions.items });
          setState({ kind: "ready", answer });
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 403) setState({ kind: "locked" });
        else if (err instanceof ApiClientError && err.status === 401) setState({ kind: "loading" });
        else setState({ kind: "error", message: "This Atlas question is unavailable." });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn, questionId]);

  if (!questionId) {
    return <Shell><StateBox text="Question unavailable." /></Shell>;
  }
  if (!isLoaded || (isSignedIn && state.kind === "loading")) {
    return <Shell><StateBox text="Loading Atlas question..." /></Shell>;
  }
  if (isLoaded && !isSignedIn) {
    return <Shell><StateBox text="Sign in to practice this Atlas question." href="/sign-in" cta="Sign in" /></Shell>;
  }
  if (state.kind === "locked") {
    return <Shell><StateBox text="Atlas question practice is part of the paid repair program." href="/checkout" cta="Enroll" /></Shell>;
  }
  if (state.kind === "error") {
    return <Shell><StateBox text={state.message} /></Shell>;
  }
  if (state.kind !== "ready" || state.answer.question.question_id !== questionId) {
    return <Shell><StateBox text="Loading Atlas question..." /></Shell>;
  }

  const q = state.answer.question;
  const siblingQuestions = codeQuestions?.outlineCode === q.outline_code ? codeQuestions.items : [];
  const questionIndex = siblingQuestions.findIndex((question) => question.question_id === questionId);
  const previousQuestion = questionIndex > 0 ? siblingQuestions[questionIndex - 1] : null;
  const nextQuestion =
    questionIndex >= 0 && questionIndex < siblingQuestions.length - 1 ? siblingQuestions[questionIndex + 1] : null;
  const selected = selection.questionId === questionId ? selection.selected : null;
  const submitted = selection.questionId === questionId ? selection.submitted : false;
  const isCorrect = submitted && selected === q.correct_answer;
  const codeHref = `/atlas?code=${encodeURIComponent(q.outline_code)}#atlas-code-questions`;
  const lessonHref = `/atlas?code=${encodeURIComponent(q.outline_code)}#atlas-code-lesson`;

  return (
    <Shell atlasHref={codeHref}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={codeHref}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-600 underline underline-offset-4 hover:text-zinc-950"
        >
          Back to code questions
        </Link>
        <Link
          href={answerHref}
          className="rounded-md border border-zinc-950/15 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700 hover:border-zinc-950"
        >
          Answer debrief
        </Link>
      </div>

      <article className="border-b-4 border-zinc-950 bg-white p-6">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-red-700">
          Atlas question
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
          {q.outline_code} - {q.outline_text}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{q.subject_display} / {q.subtopic}</p>
        {questionIndex >= 0 ? (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            Question {questionIndex + 1} / {siblingQuestions.length}
          </p>
        ) : null}
        <p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">{q.stem}</p>
        <p className="mt-5 border-l-4 border-red-700 pl-4 font-serif text-lg italic">
          {q.call_text}
        </p>
      </article>

      <section className="border-x border-b border-zinc-300 bg-white p-6">
        <div className="grid gap-3">
          {LETTERS.map((letter) => {
            const isSelected = selected === letter;
            const isCorrectChoice = submitted && q.correct_answer === letter;
            const isMissedChoice = submitted && isSelected && q.correct_answer !== letter;
            return (
              <button
                key={letter}
                type="button"
                aria-pressed={isSelected}
                disabled={submitted}
                onClick={() => setSelection({ questionId, selected: letter, submitted: false })}
                className={[
                  "w-full rounded-md border p-4 text-left transition-[background-color,border-color,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
                  submitted ? "cursor-default" : "hover:-translate-y-0.5",
                  isCorrectChoice
                    ? "border-green-700 bg-green-50"
                    : isMissedChoice
                      ? "border-red-700 bg-red-50"
                      : isSelected
                        ? "border-zinc-950 bg-[#f7f5ef]"
                        : "border-zinc-200 bg-white hover:border-zinc-500",
                ].join(" ")}
              >
                <span className="mr-3 font-mono text-xs font-semibold">{letter}</span>
                <span className="text-sm leading-6 text-zinc-800">{q.choices[letter]}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!selected || submitted}
            onClick={() => setSelection({ questionId, selected, submitted: true })}
            className="rounded-md border border-red-700 bg-red-700 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition-[transform,background-color,border-color] duration-200 hover:border-red-800 hover:bg-red-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-500"
          >
            Submit answer
          </button>
          {submitted ? (
            <Link
              href={answerHref}
              className="rounded-md border border-zinc-950 bg-zinc-950 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition-[transform,background-color,border-color] duration-200 hover:border-zinc-800 hover:bg-zinc-800 active:scale-[0.98]"
            >
              Study answer debrief
            </Link>
          ) : null}
        </div>
      </section>

      {submitted ? (
        <section className="mt-5 rounded-md border border-zinc-300 bg-white p-6">
          <p className={`font-mono text-xs uppercase tracking-[0.16em] ${isCorrect ? "text-green-700" : "text-red-700"}`}>
            {isCorrect ? "Correct" : "Not quite"}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold">
            Correct answer: {q.correct_answer}
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">
            {q.minimum_explanation}
          </p>
          {(previousQuestion || nextQuestion) ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {previousQuestion ? (
                <QuestionNavLink
                  question={previousQuestion}
                  label="Previous question"
                  position={questionIndex}
                  total={siblingQuestions.length}
                />
              ) : null}
              {nextQuestion ? (
                <QuestionNavLink
                  question={nextQuestion}
                  label="Next question"
                  position={questionIndex + 2}
                  total={siblingQuestions.length}
                />
              ) : null}
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={lessonHref}
              className="inline-flex rounded-md border border-zinc-950/15 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-700 transition-[transform,border-color,background-color] duration-200 hover:border-zinc-950 hover:bg-zinc-50 active:scale-[0.98]"
            >
              Study outline lesson
            </Link>
            <Link
              href={codeHref}
              className="inline-flex rounded-md border border-zinc-950/15 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-700 transition-[transform,border-color,background-color] duration-200 hover:border-zinc-950 hover:bg-zinc-50 active:scale-[0.98]"
            >
              Review code question list
            </Link>
          </div>
        </section>
      ) : null}
    </Shell>
  );
}

function QuestionNavLink({
  question,
  label,
  position,
  total,
}: {
  question: AtlasQuestionListItem;
  label: string;
  position: number;
  total: number;
}) {
  return (
    <Link
      href={`/atlas/questions/${encodeURIComponent(question.question_id)}/practice`}
      className="rounded-md border border-zinc-950/15 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-700 transition-[transform,border-color,background-color] duration-200 hover:border-zinc-950 hover:bg-zinc-50 active:scale-[0.98]"
    >
      <span className="block">{label}</span>
      <span className="mt-1 block text-[10px] text-zinc-500">
        Question {position} / {total}
      </span>
    </Link>
  );
}

function Shell({
  children,
  atlasHref = "/atlas",
}: {
  children: ReactNode;
  atlasHref?: string;
}) {
  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-8 text-zinc-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href={atlasHref}
          className="font-mono text-xs uppercase tracking-wide text-zinc-600 underline underline-offset-4 hover:text-zinc-950"
        >
          Outline Atlas
        </Link>
        <div className="mt-4">{children}</div>
      </div>
    </main>
  );
}

function StateBox({ text, href, cta }: { text: string; href?: string; cta?: string }) {
  return (
    <div className="rounded-lg border border-zinc-950/10 bg-white p-6">
      <p className="text-sm leading-6 text-zinc-700">{text}</p>
      {href && cta ? (
        <Link
          href={href}
          className="mt-4 inline-flex rounded-md border border-zinc-950 bg-zinc-950 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
