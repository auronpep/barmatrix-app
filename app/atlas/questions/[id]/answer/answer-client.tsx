"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiClientError, type AtlasAnswer } from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

type State =
  | { kind: "loading" }
  | { kind: "locked" }
  | { kind: "error"; message: string }
  | { kind: "ready"; answer: AtlasAnswer };

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
    </Shell>
  );
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
