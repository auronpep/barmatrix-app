"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiClientError, type AtlasAnswer, type AtlasAnswerDetour, type Letter } from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

type State =
  | { kind: "loading" }
  | { kind: "locked" }
  | { kind: "error"; message: string }
  | { kind: "ready"; answer: AtlasAnswer };

const CASE_STUDY_LABELS: Record<string, string> = {
  hero_verdict: "Verdict",
  question_card: "Question card",
  fork: "Fork",
  solve: "Solve",
  facts: "Facts",
  traps_wrong_answer_log: "Wrong-answer traps",
  bank_it: "Bank it",
  repair: "Repair",
};

const LETTERS: Letter[] = ["A", "B", "C", "D"];
const OUTLINE_CODE_RE = /^[0-9]{8}$/;

export function AtlasAnswerClient() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const answer = await api.getAtlasAnswer(token, params.id);
        if (!cancelled) setState({ kind: "ready", answer });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 403) setState({ kind: "locked" });
        else if (err instanceof ApiClientError && err.status === 401) setState({ kind: "loading" });
        else setState({ kind: "error", message: "This Atlas answer is unavailable." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn, params.id]);

  if (!isLoaded || (isSignedIn && state.kind === "loading")) return <Shell><StateBox text="Loading answer..." /></Shell>;
  if (isLoaded && !isSignedIn) return <Shell><StateBox text="Sign in to view this Atlas answer." href="/sign-in" cta="Sign in" /></Shell>;
  if (state.kind === "locked") return <Shell><StateBox text="Atlas answers are part of the paid repair program." href="/checkout" cta="Enroll" /></Shell>;
  if (state.kind === "error") return <Shell><StateBox text={state.message} /></Shell>;
  if (state.kind !== "ready") return <Shell><StateBox text="Loading answer..." /></Shell>;

  const q = state.answer.question;
  const practiceHref = `/atlas/questions/${encodeURIComponent(q.question_id)}/practice`;
  const codeQuestionsHref = `/atlas?code=${encodeURIComponent(q.outline_code)}#atlas-code-questions`;
  const selected = parseLetter(searchParams.get("pick"));
  const isCorrectPick = selected ? selected === q.correct_answer : null;
  const detours = state.answer.detours
    .map((detour) => ({ detour, href: detourHref(detour, q.outline_code) }))
    .filter((item): item is { detour: AtlasAnswerDetour; href: string } => item.href !== null);
  const caseStudyEntries = Object.entries(state.answer.case_study_modules).filter(
    ([key, value]) =>
      // ponytail: raw detour specs render only through filtered answer.detours.
      key !== "detours" && isRenderableModule(value),
  );
  const handoffModules = caseStudyEntries.filter(([key]) => !["hero_verdict", "question_card", "fork", "solve"].includes(key));
  const answerModules = handoffModules.length > 0 ? handoffModules : caseStudyEntries;

  return (
    <Shell atlasHref={codeQuestionsHref}>
      <article className="mx-auto max-w-[1000px] px-5 pb-28 sm:px-8">
        <section className="grid gap-6 border-b-[3px] border-zinc-950 py-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700">
              Decision-first answer key / {q.question_id}
            </p>
            <h1 className="mt-3 max-w-2xl text-balance font-serif text-4xl font-extrabold leading-[1.02] tracking-tight text-zinc-950 sm:text-5xl">
              Two questions hide in one call. Only one is <span className="italic text-red-700">asked.</span>
            </h1>
            <p className="mt-4 max-w-3xl font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-500">
              {q.subject_display} / {q.subtopic} / {q.outline_code} / {q.outline_text}
            </p>
          </div>
          <div
            className={[
              "w-fit border-2 px-6 py-4 text-center font-mono uppercase tracking-[0.12em]",
              isCorrectPick === false
                ? "border-red-700 text-red-700"
                : isCorrectPick === true
                  ? "border-green-800 text-green-800"
                  : "border-zinc-950 text-zinc-950",
            ].join(" ")}
          >
            <span className="block font-serif text-2xl font-bold leading-none tracking-normal">
              {isCorrectPick === false ? "Missed" : isCorrectPick === true ? "Correct" : "Key locked"}
            </span>
            <small className="mt-2 block text-[9px] text-zinc-500">
              {selected ? `You chose ${selected} / key ${q.correct_answer}` : `Correct answer / ${q.correct_answer}`}
            </small>
          </div>
        </section>

        <QuestionCard answer={state.answer} selected={selected} />

        <Band num="01" title="The fork" meta="open each node for the evidence">
          <ForkBoard answer={state.answer} selected={selected} />
        </Band>

        <Band num="02" title="Work the solve" meta="lock the call / apply the key">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <EvidenceBox label="The call fixes the job" title={q.call_text}>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-zinc-700">
                Do not answer the most vivid fact first. Answer the call of the question first, then test which choice is legally responsive.
              </p>
            </EvidenceBox>
            <EvidenceBox label="Bank this answer" title={`Correct answer: ${q.correct_answer}`}>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">
                {q.minimum_explanation}
              </p>
            </EvidenceBox>
          </div>
        </Band>

        {answerModules.length > 0 ? (
          <>
            <p className="sr-only">Case study path</p>
            {answerModules.map(([key, value], index) => (
              <Band
                key={key}
                num={String(index + 3).padStart(2, "0")}
                title={moduleBandTitle(key, index)}
                meta={moduleBandMeta(key)}
              >
                <ModulePanel label={caseStudyLabel(key)} value={value} open={index === 0} />
              </Band>
            ))}
          </>
        ) : null}

        {detours.length > 0 ? (
          <Band num={String(answerModules.length + 3).padStart(2, "0")} title="Related study detours" meta="repair this pattern">
            <div id="atlas-answer-detours">
              <a href="#atlas-answer-detours" className="sr-only">Review related detours</a>
              <p className="sr-only">Review related detours</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {detours.map(({ detour, href }) => (
                  <Link
                    key={`${detour.type}:${detour.key}`}
                    href={href}
                    className="group border border-zinc-300 bg-[#fbfaf6] p-4 transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-zinc-950 hover:bg-white hover:shadow-[4px_4px_0_#0a0a0a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-red-700">
                      {caseStudyLabel(detour.type)}
                    </p>
                    <p className="mt-2 font-serif text-xl font-semibold leading-tight text-zinc-950">
                      {detour.label}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                      {detour.target_count} approved {detour.target_count === 1 ? "item" : "items"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </Band>
        ) : null}
      </article>

      <div className="sticky bottom-0 z-40 border-t-[3px] border-red-700 bg-zinc-950 text-white shadow-[0_-10px_28px_rgba(0,0,0,0.2)]">
        <div className="mx-auto grid max-w-[1000px] gap-3 px-5 py-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:px-8">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
              Atlas answer key / {q.outline_code}
            </p>
            <p className="mt-1 truncate font-serif text-base font-semibold text-white">
              {q.outline_text}
            </p>
          </div>
          <Link
            href={`/atlas?code=${encodeURIComponent(q.outline_code)}#atlas-code-lesson`}
            className="inline-flex justify-center border border-white/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-200 transition-[background-color,border-color,transform] hover:border-white hover:bg-white/10 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Study this outline code
          </Link>
          <Link
            href={codeQuestionsHref}
            className="inline-flex justify-center border border-white/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-200 transition-[background-color,border-color,transform] hover:border-white hover:bg-white/10 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Review code questions
          </Link>
          <Link
            href={practiceHref}
            className="inline-flex justify-center border border-red-700 bg-red-700 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-[background-color,border-color,transform] hover:border-red-800 hover:bg-red-800 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Practice this question
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function QuestionCard({ answer, selected }: { answer: AtlasAnswer; selected: Letter | null }) {
  const q = answer.question;
  return (
    <section className="mt-7 border border-zinc-950 bg-[#f4f1ea] p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-red-700">
          The question as asked
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500">
          {q.question_id} / {q.subject_display}
        </p>
      </div>
      <p className="mt-5 whitespace-pre-wrap font-serif text-[17px] leading-8 text-zinc-900">
        {q.stem}
      </p>
      <p className="mt-5 border-l-[3px] border-red-700 pl-4 font-serif text-lg font-semibold italic leading-7 text-zinc-950">
        {q.call_text}
      </p>
      <div className="mt-6 grid gap-2">
        {LETTERS.map((letter) => {
          const isCorrect = letter === q.correct_answer;
          const isSelected = selected === letter;
          return (
            <div
              key={letter}
              className={[
                "grid grid-cols-[2rem_1fr_auto] items-center gap-3 border p-3",
                isCorrect
                  ? "border-green-800 bg-green-50"
                  : isSelected
                    ? "border-red-700 bg-red-50"
                    : "border-zinc-300 bg-[#fbfaf6]",
              ].join(" ")}
            >
              <span
                className={[
                  "grid size-8 place-items-center border font-mono text-xs font-bold",
                  isCorrect
                    ? "border-green-800 bg-green-800 text-white"
                    : isSelected
                      ? "border-red-700 bg-red-700 text-white"
                      : "border-zinc-400 text-zinc-600",
                ].join(" ")}
              >
                {letter}
              </span>
              <span className="font-serif text-[15px] leading-6 text-zinc-900">{q.choices[letter]}</span>
              <span className="hidden whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-500 sm:block">
                {isCorrect ? "credited" : isSelected ? "your pick" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ForkBoard({ answer, selected }: { answer: AtlasAnswer; selected: Letter | null }) {
  const q = answer.question;
  const wrongLetters = LETTERS.filter((letter) => letter !== q.correct_answer);

  return (
    <div>
      <div className="mb-5 text-center">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-red-700">
          The call asks one thing
        </p>
        <p className="mx-auto mt-2 max-w-[60ch] font-serif text-xl italic leading-8 text-zinc-950">
          {q.call_text}
        </p>
      </div>
      <div className="grid border border-zinc-950 lg:grid-cols-2">
        <div className="border-b border-zinc-950 bg-red-950/[0.03] p-5 lg:border-b-0 lg:border-r">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-red-700">
            Branch 1 / tempting alternatives
          </p>
          <h3 className="mt-2 font-serif text-xl font-bold text-zinc-950">
            Does a fact pull you away from the call?
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.04em] text-zinc-500">
            Test each wrong branch against the exact remedy or result requested.
          </p>
          <div className="mt-5 grid gap-3">
            {wrongLetters.map((letter) => (
              <details
                key={letter}
                className={[
                  "group border bg-[#fbfaf6] transition-[border-color,box-shadow] open:shadow-[4px_4px_0_#0a0a0a]",
                  selected === letter ? "border-red-700" : "border-zinc-300 open:border-zinc-950",
                ].join(" ")}
              >
                <summary className="grid cursor-pointer grid-cols-[2rem_1fr_auto] items-center gap-3 px-3 py-3 marker:content-none">
                  <span
                    className={[
                      "grid size-8 place-items-center border font-mono text-xs font-bold",
                      selected === letter ? "border-red-700 bg-red-700 text-white" : "border-red-700 text-red-700",
                    ].join(" ")}
                  >
                    {letter}
                  </span>
                  <span className="font-serif text-[15px] leading-6 text-zinc-900">
                    {q.choices[letter]}
                  </span>
                  <span className="font-mono text-xs text-zinc-500 transition-transform group-open:rotate-90">
                    +
                  </span>
                </summary>
                <div className="border-t border-zinc-200 px-3 pb-3 pt-3">
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-red-700">
                    Evidence check
                  </p>
                  <p className="mt-2 text-[13px] leading-6 text-zinc-700">
                    This is not the credited branch. Use it as a diagnostic: identify what it proves, then ask whether it actually answers the call.
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="bg-green-950/[0.04] p-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-green-800">
            Branch 2 / responsive answer
          </p>
          <h3 className="mt-2 font-serif text-xl font-bold text-zinc-950">
            The answer that resolves the asked question
          </h3>
          <div className="mt-5 border border-green-800 bg-[#fbfaf6]">
            <div className="grid grid-cols-[2.5rem_1fr] gap-4 p-4">
              <span className="grid size-10 place-items-center bg-green-800 font-mono text-sm font-bold text-white">
                {q.correct_answer}
              </span>
              <div>
                <p className="font-serif text-lg font-semibold leading-7 text-zinc-950">
                  {q.choices[q.correct_answer]}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-[14px] leading-7 text-zinc-700">
                  {q.minimum_explanation}
                </p>
              </div>
            </div>
            <div className="bg-zinc-950 p-4 text-center text-white">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-red-500">
                Fork resolved
              </p>
              <p className="mt-2 font-serif text-base leading-7">
                If a choice does not answer the call, it can be tempting and still lose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Band({ num, title, meta, children }: { num: string; title: string; meta: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-zinc-300 py-9">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="font-serif text-base font-bold text-red-700">{num}</span>
        <h2 className="whitespace-nowrap font-serif text-2xl font-bold tracking-tight text-zinc-950">{title}</h2>
        <span className="h-px flex-1 bg-zinc-300" />
        <span className="hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500 sm:inline">
          {meta}
        </span>
      </div>
      {children}
    </section>
  );
}

function EvidenceBox({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-zinc-950 bg-[#fbfaf6] p-5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-red-700">
        {label}
      </p>
      <h3 className="mt-2 font-serif text-xl font-bold leading-7 text-zinc-950">{title}</h3>
      {children}
    </div>
  );
}

function ModulePanel({ label, value, open }: { label: string; value: unknown; open: boolean }) {
  return (
    <details
      className="group border border-zinc-300 bg-[#fbfaf6] transition-[border-color,box-shadow] open:border-zinc-950 open:shadow-[4px_4px_0_#0a0a0a]"
      open={open}
    >
      <summary className="grid cursor-pointer grid-cols-[2rem_1fr_auto] items-center gap-3 px-4 py-3 marker:content-none">
        <span className="grid size-8 place-items-center border border-red-700 font-mono text-xs font-bold text-red-700">
          +
        </span>
        <span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            {label}
          </span>
          <span className="mt-1 block font-serif text-lg font-semibold text-zinc-950">
            Approved answer module
          </span>
        </span>
        <span className="font-mono text-xs text-zinc-500 transition-transform group-open:rotate-90">
          +
        </span>
      </summary>
      <div className="border-t border-zinc-200 px-4 py-4 text-sm leading-6 text-zinc-800">
        <ModuleValue value={value} />
      </div>
    </details>
  );
}

function detourHref(detour: AtlasAnswerDetour, outlineCode: string): string | null {
  if (detour.type === "outline_code" && OUTLINE_CODE_RE.test(detour.key)) {
    return `/atlas?code=${encodeURIComponent(detour.key)}#atlas-code-lesson`;
  }
  const atlasCode = `?atlasCode=${encodeURIComponent(outlineCode)}`;
  if (detour.type === "trap") {
    return `/traps/${encodeURIComponent(detour.key)}${atlasCode}`;
  }
  if (detour.type === "tension") {
    return `/tensions/${encodeURIComponent(detour.key)}${atlasCode}`;
  }
  return null;
}

function Shell({
  children,
  atlasHref = "/atlas",
}: {
  children: React.ReactNode;
  atlasHref?: string;
}) {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-zinc-950">
      <header className="sticky top-0 z-50 border-b-4 border-red-700 bg-zinc-950 text-[#f4f1ea]">
        <div className="mx-auto grid min-h-14 max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:grid-cols-[1fr_auto_1fr] sm:px-5">
          <Link href="/atlas" className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
            <b className="font-serif text-base font-extrabold normal-case tracking-normal text-white">BARMATRIX</b>
            <span className="size-1.5 bg-red-700" />
            <span className="hidden truncate sm:inline">Answer key / Mixed combos</span>
          </Link>
          <div className="hidden border border-white/20 sm:flex">
            <span className="border-r border-white/10 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
              Combo A
            </span>
            <span className="bg-red-700 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white">
              Combo B / Fork-first
            </span>
          </div>
          <div className="justify-self-end">
            <Link
              href={atlasHref}
              className="border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-300 transition-[border-color,color] hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Atlas
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

function StateBox({ text, href, cta }: { text: string; href?: string; cta?: string }) {
  return (
    <main className="mx-auto max-w-[1000px] px-5 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border border-zinc-950 bg-[#fbfaf6] p-6">
        <p className="text-sm leading-6 text-zinc-800">{text}</p>
        {href && cta ? <Link href={href} className="btn red">{cta}</Link> : null}
      </div>
    </main>
  );
}

function ModuleValue({ value }: { value: unknown }) {
  if (!isRenderableModule(value)) return null;

  if (typeof value === "string" || typeof value === "number") {
    return <p className="whitespace-pre-wrap">{String(value)}</p>;
  }

  if (typeof value === "boolean") {
    return <p>{value ? "Yes" : "No"}</p>;
  }

  if (Array.isArray(value)) {
    return (
      <div className="grid gap-2">
        {value.filter(isRenderableModule).map((item, index) => (
          <div key={index} className="border border-zinc-200 bg-white px-3 py-2">
            <ModuleValue value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (isRecord(value)) {
    const entries = Object.entries(value).filter(([, child]) => isRenderableModule(child));
    return (
      <div className="grid gap-3">
        {entries.map(([key, child]) => (
          <div key={key}>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              {caseStudyLabel(key)}
            </p>
            <div className="mt-1">
              <ModuleValue value={child} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function parseLetter(value: string | null): Letter | null {
  const normalized = value?.toUpperCase();
  return normalized === "A" || normalized === "B" || normalized === "C" || normalized === "D" ? normalized : null;
}

function isRenderableModule(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some(isRenderableModule);
  if (isRecord(value)) return Object.values(value).some(isRenderableModule);
  return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function caseStudyLabel(key: string): string {
  return (
    CASE_STUDY_LABELS[key] ??
    key
      .replace(/[_-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function moduleBandTitle(key: string, index: number): string {
  if (key === "facts") return "Facts in the stem";
  if (key === "traps_wrong_answer_log") return "How the traps are built";
  if (key === "bank_it") return "Bank it";
  if (key === "repair") return "Repair this pattern";
  return index === 0 ? "Case study path" : caseStudyLabel(key);
}

function moduleBandMeta(key: string): string {
  if (key === "facts") return "each fact / how you use it";
  if (key === "traps_wrong_answer_log") return "trap taxonomy / full log";
  if (key === "bank_it") return "one line to remember";
  if (key === "repair") return "red-zone map / repair drill";
  return "approved answer module";
}
