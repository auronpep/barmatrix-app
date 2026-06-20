"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiClientError, type AtlasAnswer, type AtlasAnswerDetour } from "@/lib/api-client";
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

const OUTLINE_CODE_RE = /^[0-9]{8}$/;

export function AtlasAnswerClient() {
  const params = useParams<{ id: string }>();
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
  const detours = state.answer.detours
    .map((detour) => ({ detour, href: detourHref(detour) }))
    .filter((item): item is { detour: AtlasAnswerDetour; href: string } => item.href !== null);
  const caseStudyEntries = Object.entries(state.answer.case_study_modules).filter(
    ([key, value]) =>
      // ponytail: raw detour specs render only through filtered answer.detours.
      key !== "detours" && isRenderableModule(value),
  );

  return (
    <Shell>
      <article className="border-b-4 border-zinc-950 bg-white p-6">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-red-700">
          {q.question_id}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
          {q.outline_code} - {q.outline_text}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{q.subject_display} / {q.subtopic}</p>
        <Link
          href={`/atlas?code=${encodeURIComponent(q.outline_code)}#atlas-code-lesson`}
          className="mt-5 inline-flex w-fit items-center justify-center rounded-md border border-zinc-950/15 bg-[#f7f5ef] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-700 transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-zinc-950 hover:bg-white active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
        >
          Study this outline code
        </Link>
      </article>

      <section className="border-x border-b border-zinc-300 bg-white p-6">
        <h2 className="font-serif text-2xl font-semibold">Question</h2>
        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">{q.stem}</p>
        <p className="mt-4 border-l-4 border-red-700 pl-4 font-serif text-lg italic">{q.call_text}</p>
        <div className="mt-6 grid gap-3">
          {(["A", "B", "C", "D"] as const).map((letter) => (
            <div key={letter} className={`rounded-md border p-3 ${letter === q.correct_answer ? "border-green-700 bg-green-50" : "border-zinc-200 bg-white"}`}>
              <span className="mr-2 font-mono text-xs font-semibold">{letter}</span>
              <span className="text-sm text-zinc-800">{q.choices[letter]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-md border border-zinc-300 bg-white p-6">
        <h2 className="font-serif text-2xl font-semibold">Answer</h2>
        <p className="mt-3 font-mono text-xs uppercase tracking-wide text-green-700">
          Correct answer: {q.correct_answer}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">
          {q.minimum_explanation}
        </p>
      </section>

      {caseStudyEntries.length > 0 ? (
        <section className="mt-5 rounded-md border border-zinc-300 bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-red-700">
            Case study path
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold">
            Approved answer modules
          </h2>
          <div className="mt-5 grid gap-4">
            {caseStudyEntries.map(([key, value]) => (
              <article key={key} className="rounded-md border border-zinc-200 bg-[#fbfaf6] p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  {caseStudyLabel(key)}
                </p>
                <div className="mt-3 text-sm leading-6 text-zinc-800">
                  <ModuleValue value={value} />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {detours.length > 0 ? (
        <section className="mt-5 rounded-md border border-zinc-300 bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-red-700">
            Related study detours
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold">
            Drill this weakness elsewhere
          </h2>
          <div className="mt-5 grid gap-3">
            {detours.map(({ detour, href }) => (
              <Link
                key={`${detour.type}:${detour.key}`}
                href={href}
                className="group rounded-md border border-zinc-200 bg-[#fbfaf6] p-4 transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-zinc-950 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  {caseStudyLabel(detour.type)}
                </p>
                <p className="mt-2 font-serif text-lg font-semibold text-zinc-950">
                  {detour.label}
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  {detour.target_count} approved {detour.target_count === 1 ? "item" : "items"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </Shell>
  );
}

function detourHref(detour: AtlasAnswerDetour): string | null {
  if (detour.type === "outline_code" && OUTLINE_CODE_RE.test(detour.key)) {
    return `/atlas?code=${encodeURIComponent(detour.key)}#atlas-code-lesson`;
  }
  if (detour.type === "trap") {
    return `/traps/${encodeURIComponent(detour.key)}`;
  }
  return null;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-zinc-950">
      <div className="mx-auto max-w-4xl">
        <Link href="/atlas" className="font-mono text-xs uppercase tracking-wide text-zinc-600 underline">
          Outline Atlas
        </Link>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function StateBox({ text, href, cta }: { text: string; href?: string; cta?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-white p-6">
      <p className="text-sm leading-6 text-zinc-800">{text}</p>
      {href && cta ? <Link href={href} className="btn red">{cta}</Link> : null}
    </div>
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
          <div key={index} className="rounded-md bg-white px-3 py-2">
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
