"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  api,
  ApiClientError,
  type AtlasCoverageNode,
  type AtlasQuestionListItem,
} from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

type LoadState =
  | { kind: "loading" }
  | { kind: "locked" }
  | { kind: "error"; message: string }
  | { kind: "ready"; nodes: AtlasCoverageNode[] };

type QuestionState =
  | { code: string; items: AtlasQuestionListItem[]; error: null }
  | { code: string; items: []; error: string };

export function AtlasClient() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [query, setQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [questionState, setQuestionState] = useState<QuestionState | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getAtlasCoverage(token);
        if (cancelled) return;
        setState({ kind: "ready", nodes: data.nodes });
        setSelectedCode((current) => current ?? data.nodes[0]?.code ?? null);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 403) setState({ kind: "locked" });
        else if (err instanceof ApiClientError && err.status === 401) setState({ kind: "loading" });
        else setState({ kind: "error", message: "Atlas is temporarily unavailable." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    if (state.kind !== "ready" || !selectedCode) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getAtlasQuestions(token, selectedCode);
        if (!cancelled) setQuestionState({ code: selectedCode, items: data.items, error: null });
      } catch {
        if (!cancelled) {
          setQuestionState({
            code: selectedCode,
            items: [],
            error: "Could not load questions for this outline code.",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, selectedCode, state.kind]);

  const filtered = useMemo(() => {
    if (state.kind !== "ready") return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return state.nodes;
    return state.nodes.filter((node) =>
      [node.code, node.subject_display, node.subtopic, node.outline_text].some((value) =>
        value.toLowerCase().includes(needle),
      ),
    );
  }, [query, state]);

  const selected =
    state.kind === "ready" && selectedCode
      ? state.nodes.find((node) => node.code === selectedCode) ?? null
      : null;
  const selectedQuestions = questionState?.code === selectedCode ? questionState.items : [];
  const questionError = questionState?.code === selectedCode ? questionState.error : null;
  const loading = !isLoaded || (isSignedIn && state.kind === "loading");

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            Outline Atlas
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Drill by outline code.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
            Choose the subject, subtopic, or exact MBE outline code you know is weak, then work approved BarMatrix questions for that section.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-sm ghost">
          Back to dashboard
        </Link>
      </div>

      {loading && <StateBox text="Loading the Atlas..." />}
      {isLoaded && !isSignedIn && <StateBox text="Sign in to open the Outline Atlas." href="/sign-in" cta="Sign in" />}
      {isSignedIn && state.kind === "locked" && <StateBox text="The Outline Atlas is part of the paid repair program." href="/checkout" cta="Enroll" />}
      {isSignedIn && state.kind === "error" && <StateBox text={state.message} />}
      {isSignedIn && state.kind === "ready" && state.nodes.length === 0 && <StateBox text="No approved Atlas questions are live yet." />}

      {isSignedIn && state.kind === "ready" && state.nodes.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subject, subtopic, code, or rule..."
              className="w-full rounded-md border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-red-700"
            />

            <div className="mt-4 overflow-x-auto border border-zinc-300 bg-white">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-zinc-950 text-white">
                  <tr className="font-mono text-[11px] uppercase tracking-wide">
                    <th className="px-3 py-2">Code</th>
                    <th className="px-3 py-2">Outline text</th>
                    <th className="px-3 py-2">Subject</th>
                    <th className="px-3 py-2">Subtopic</th>
                    <th className="px-3 py-2 text-right">Questions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((node) => (
                    <tr
                      key={node.code}
                      className={`border-b border-zinc-200 ${node.code === selectedCode ? "bg-amber-50" : "bg-white"}`}
                    >
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setSelectedCode(node.code)}
                          className="underline-offset-4 hover:underline"
                        >
                          {node.code}
                        </button>
                      </td>
                      <td className="min-w-[240px] px-3 py-2 font-serif text-[15px]">{node.outline_text}</td>
                      <td className="whitespace-nowrap px-3 py-2">{node.subject_display}</td>
                      <td className="min-w-[220px] px-3 py-2 text-zinc-700">{node.subtopic}</td>
                      <td className="px-3 py-2 text-right font-mono">{node.question_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="min-w-0 rounded-md border border-zinc-300 bg-white p-5">
            {selected ? (
              <>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
                  Selected code
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold">{selected.display_label}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {selected.subject_display} / {selected.subtopic}
                </p>
                <div className="mt-5 space-y-3">
                  {questionError && (
                    <p className="border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                      {questionError}
                    </p>
                  )}
                  {!questionError && selectedQuestions.length === 0 && (
                    <p className="text-sm text-zinc-600">Loading questions...</p>
                  )}
                  {selectedQuestions.map((question) => (
                    <article key={question.question_id} className="rounded-md border border-zinc-200 p-3">
                      <p className="font-mono text-xs font-semibold text-zinc-800">{question.question_id}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{clip(question.stem)}</p>
                      <p className="mt-2 border-l-2 border-red-700 pl-2 text-sm italic text-zinc-800">
                        {clip(question.call_text, 90)}
                      </p>
                      <Link
                        href={`/atlas/questions/${encodeURIComponent(question.question_id)}/answer`}
                        className="mt-3 inline-flex rounded-md border border-zinc-300 px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-zinc-700 hover:bg-zinc-100"
                      >
                        Study answer
                      </Link>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-zinc-600">Choose an outline code.</p>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}

function clip(value: string, max = 160): string {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

function StateBox({ text, href, cta }: { text: string; href?: string; cta?: string }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-6">
      <p className="text-sm leading-6 text-zinc-800">{text}</p>
      {href && cta ? <Link href={href} className="btn red">{cta}</Link> : null}
    </div>
  );
}
