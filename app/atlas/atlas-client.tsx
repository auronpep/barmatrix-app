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
  | { kind: "idle"; code: string | null }
  | { kind: "ready"; code: string; items: AtlasQuestionListItem[] }
  | { kind: "error"; code: string; message: string };

type SubjectStat = {
  subject: string;
  codeCount: number;
  questionCount: number;
};

const ALL_SUBJECTS = "All subjects";
const ALL_SUBTOPICS = "All subtopics";

const GATED_LANES = [
  "Traps",
  "Drills",
  "Flashcards",
  "Tensions",
  "Boot camps",
];

export function AtlasClient() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState(ALL_SUBJECTS);
  const [subtopicFilter, setSubtopicFilter] = useState(ALL_SUBTOPICS);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [questionState, setQuestionState] = useState<QuestionState>({
    kind: "idle",
    code: null,
  });

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
        setSelectedCode((current) =>
          current && data.nodes.some((node) => node.code === current)
            ? current
            : data.nodes[0]?.code ?? null,
        );
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 403) {
          setState({ kind: "locked" });
        } else if (err instanceof ApiClientError && err.status === 401) {
          setState({ kind: "loading" });
        } else {
          setState({ kind: "error", message: "Atlas is temporarily unavailable." });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn]);

  const allNodes = useMemo(() => (state.kind === "ready" ? state.nodes : []), [state]);
  const selected = selectedCode
    ? allNodes.find((node) => node.code === selectedCode) ?? null
    : null;

  useEffect(() => {
    if (state.kind !== "ready" || !selectedCode) return;
    const node = state.nodes.find((item) => item.code === selectedCode);
    if (!node) return;

    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getAtlasQuestions(token, selectedCode);
        if (!cancelled) {
          setQuestionState({ kind: "ready", code: selectedCode, items: data.items });
        }
      } catch {
        if (!cancelled) {
          setQuestionState({
            kind: "error",
            code: selectedCode,
            message: "Could not load questions for this outline code.",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, selectedCode, state]);

  const subjectStats = useMemo(() => {
    const map = new Map<string, SubjectStat>();
    for (const node of allNodes) {
      const stat =
        map.get(node.subject_display) ??
        { subject: node.subject_display, codeCount: 0, questionCount: 0 };
      stat.codeCount += 1;
      stat.questionCount += node.question_count;
      map.set(node.subject_display, stat);
    }
    return [...map.values()].sort((a, b) => a.subject.localeCompare(b.subject));
  }, [allNodes]);

  const subtopics = useMemo(() => {
    const source =
      subjectFilter === ALL_SUBJECTS
        ? allNodes
        : allNodes.filter((node) => node.subject_display === subjectFilter);
    return [ALL_SUBTOPICS, ...new Set(source.map((node) => node.subtopic))];
  }, [allNodes, subjectFilter]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allNodes.filter((node) => {
      if (subjectFilter !== ALL_SUBJECTS && node.subject_display !== subjectFilter) return false;
      if (subtopicFilter !== ALL_SUBTOPICS && node.subtopic !== subtopicFilter) return false;
      if (!needle) return true;
      return [node.code, node.subject_display, node.subtopic, node.outline_text].some((value) =>
        value.toLowerCase().includes(needle),
      );
    });
  }, [allNodes, query, subjectFilter, subtopicFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, AtlasCoverageNode[]>();
    for (const node of filtered) {
      map.set(node.subtopic, [...(map.get(node.subtopic) ?? []), node]);
    }
    return [...map.entries()];
  }, [filtered]);

  const selectedIndex = selectedCode
    ? allNodes.findIndex((node) => node.code === selectedCode)
    : -1;
  const previousCode = selectedIndex > 0 ? allNodes[selectedIndex - 1]?.code ?? null : null;
  const nextCode =
    selectedIndex >= 0 && selectedIndex < allNodes.length - 1
      ? allNodes[selectedIndex + 1]?.code ?? null
      : null;

  const selectedQuestions =
    questionState.kind === "ready" && questionState.code === selectedCode
      ? questionState.items
      : [];
  const questionLoading = Boolean(selectedCode && questionState.code !== selectedCode);
  const questionError =
    questionState.kind === "error" && questionState.code === selectedCode
      ? questionState.message
      : null;
  const loading = !isLoaded || (isSignedIn && state.kind === "loading");

  function chooseSubject(subject: string) {
    setSubjectFilter(subject);
    setSubtopicFilter(ALL_SUBTOPICS);
    const next =
      subject === ALL_SUBJECTS
        ? allNodes[0]
        : allNodes.find((node) => node.subject_display === subject);
    setSelectedCode(next?.code ?? null);
  }

  function chooseSubtopic(subtopic: string) {
    setSubtopicFilter(subtopic);
    const next = allNodes.find((node) => {
      const subjectOk =
        subjectFilter === ALL_SUBJECTS || node.subject_display === subjectFilter;
      const subtopicOk = subtopic === ALL_SUBTOPICS || node.subtopic === subtopic;
      return subjectOk && subtopicOk;
    });
    setSelectedCode(next?.code ?? null);
  }

  return (
    <section className="min-h-screen bg-[#f4f1ea] text-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex flex-col gap-5 border-b border-zinc-950/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-700">
              Outline Atlas
            </p>
            <h1 className="mt-2 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Walk the MBE outline by code.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
              Each outline code is a learning node: lesson, questions, traps, drills,
              flashcards, tensions, and boot-camps attach here as each lane is approved.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex w-fit items-center justify-center rounded-md border border-zinc-950/15 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-700 transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-zinc-950 hover:bg-zinc-50 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
          >
            Back to dashboard
          </Link>
        </div>

        {loading && <StateBox text="Loading the Atlas..." />}
        {isLoaded && !isSignedIn && (
          <StateBox text="Sign in to open the Outline Atlas." href="/sign-in" cta="Sign in" />
        )}
        {isSignedIn && state.kind === "locked" && (
          <StateBox
            text="The Outline Atlas is part of the paid repair program."
            href="/checkout"
            cta="Enroll"
          />
        )}
        {isSignedIn && state.kind === "error" && <StateBox text={state.message} />}
        {isSignedIn && state.kind === "ready" && state.nodes.length === 0 && (
          <StateBox text="No Atlas outline nodes are live yet." />
        )}

        {isSignedIn && state.kind === "ready" && state.nodes.length > 0 && (
          <>
            <div className="grid gap-3 py-5 sm:grid-cols-3">
              <Metric label="Outline codes" value={String(state.nodes.length)} />
              <Metric
                label="Codes with questions"
                value={String(state.nodes.filter((node) => node.question_count > 0).length)}
              />
              <Metric
                label="Approved questions"
                value={String(
                  state.nodes.reduce((sum, node) => sum + node.question_count, 0),
                )}
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_390px]">
              <aside className="min-w-0">
                <div className="rounded-lg border border-zinc-950/10 bg-white p-3 shadow-[0_18px_60px_rgba(24,24,27,0.08)]">
                  <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Subjects
                  </p>
                  <div className="grid gap-2">
                    <SubjectButton
                      active={subjectFilter === ALL_SUBJECTS}
                      label={ALL_SUBJECTS}
                      meta={`${state.nodes.length} codes`}
                      onClick={() => chooseSubject(ALL_SUBJECTS)}
                    />
                    {subjectStats.map((subject) => (
                      <SubjectButton
                        key={subject.subject}
                        active={subjectFilter === subject.subject}
                        label={subject.subject}
                        meta={`${subject.codeCount} codes / ${subject.questionCount} questions`}
                        onClick={() => chooseSubject(subject.subject)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-zinc-950/10 bg-white p-3">
                  <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Subtopics
                  </p>
                  <div className="grid max-h-[360px] gap-1 overflow-y-auto pr-1">
                    {subtopics.map((subtopic) => (
                      <button
                        key={subtopic}
                        type="button"
                        onClick={() => chooseSubtopic(subtopic)}
                        className={`rounded-md px-2 py-2 text-left text-sm leading-5 transition-colors ${
                          subtopicFilter === subtopic
                            ? "bg-zinc-950 text-white"
                            : "text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        {subtopic}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <main className="min-w-0">
                <div className="rounded-lg border border-zinc-950/10 bg-white p-3">
                  <label className="sr-only" htmlFor="atlas-search">
                    Search outline codes
                  </label>
                  <input
                    id="atlas-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search subject, subtopic, code, or rule..."
                    className="w-full rounded-md border border-zinc-950/15 bg-[#fbfaf6] px-4 py-3 text-sm outline-none transition-colors focus:border-red-700"
                  />
                </div>

                <div className="mt-4 grid gap-4">
                  {grouped.length === 0 ? (
                    <div className="rounded-lg border border-zinc-950/10 bg-white p-6 text-sm text-zinc-700">
                      No outline codes match this filter.
                    </div>
                  ) : (
                    grouped.map(([subtopic, nodes]) => (
                      <section
                        key={subtopic}
                        aria-labelledby={`subtopic-${slug(subtopic)}`}
                        className="rounded-lg border border-zinc-950/10 bg-white"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-950/10 px-4 py-3">
                          <h2
                            id={`subtopic-${slug(subtopic)}`}
                            className="font-serif text-lg font-semibold"
                          >
                            {subtopic}
                          </h2>
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                            {nodes.length} codes
                          </p>
                        </div>
                        <div className="divide-y divide-zinc-950/10">
                          {nodes.map((node) => (
                            <button
                              key={node.code}
                              type="button"
                              onClick={() => setSelectedCode(node.code)}
                              aria-current={node.code === selectedCode ? "true" : undefined}
                              className={`grid w-full gap-2 px-4 py-3 text-left transition-colors md:grid-cols-[94px_minmax(0,1fr)_92px] ${
                                node.code === selectedCode
                                  ? "bg-red-50"
                                  : "bg-white hover:bg-zinc-50"
                              }`}
                            >
                              <span className="font-mono text-xs font-semibold text-zinc-950">
                                {node.code}
                              </span>
                              <span className="min-w-0 text-sm leading-5 text-zinc-800">
                                {node.outline_text}
                              </span>
                              <span
                                className={`w-fit rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] md:justify-self-end ${
                                  node.question_count > 0
                                    ? "bg-emerald-50 text-emerald-800"
                                    : "bg-amber-50 text-amber-800"
                                }`}
                              >
                                {node.question_count > 0
                                  ? `${node.question_count} live`
                                  : "Needs item"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </section>
                    ))
                  )}
                </div>
              </main>

              <aside className="min-w-0">
                <div className="rounded-lg border border-zinc-950/10 bg-zinc-950 p-4 text-white shadow-[0_28px_90px_rgba(24,24,27,0.24)] lg:sticky lg:top-6">
                  {selected ? (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                            Selected code
                          </p>
                          <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight">
                            {selected.code}
                          </h2>
                        </div>
                        <span className="rounded-md bg-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-200">
                          {selected.question_count} questions
                        </span>
                      </div>

                      <p className="mt-3 text-lg leading-7 text-white">{selected.outline_text}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        {selected.subject_display} / {selected.subtopic}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <WalkButton
                          label="Previous"
                          disabled={!previousCode}
                          onClick={() => previousCode && setSelectedCode(previousCode)}
                        />
                        <WalkButton
                          label="Next"
                          disabled={!nextCode}
                          onClick={() => nextCode && setSelectedCode(nextCode)}
                        />
                      </div>

                      <section className="mt-5 rounded-lg bg-white p-4 text-zinc-950">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-700">
                          Lesson lane
                        </p>
                        <h3 className="mt-2 font-serif text-xl font-semibold">
                          {selected.outline_text}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-700">
                          Approved lesson content for this exact code is pending. The node
                          is live now so students can walk the outline and see which lanes
                          have approved work attached.
                        </p>
                      </section>

                      <section className="mt-4 rounded-lg bg-white p-4 text-zinc-950">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                          Components
                        </p>
                        <div className="mt-3 divide-y divide-zinc-950/10">
                          <LaneRow
                            label="Questions"
                            status={selected.question_count > 0 ? "Live" : "Missing"}
                            meta={`${selected.question_count} approved`}
                            active={selected.question_count > 0}
                          />
                          {GATED_LANES.map((lane) => (
                            <LaneRow
                              key={lane}
                              label={lane}
                              status="Approval gate"
                              meta="Not connected"
                              active={false}
                            />
                          ))}
                        </div>
                      </section>

                      <section className="mt-4 rounded-lg bg-white p-4 text-zinc-950">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                          Question bank
                        </p>
                        <div className="mt-3 grid gap-3">
                          {questionError ? (
                            <p className="rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                              {questionError}
                            </p>
                          ) : null}
                          {questionLoading ? (
                            <p className="text-sm leading-6 text-zinc-600">
                              Loading approved questions...
                            </p>
                          ) : null}
                          {!questionLoading &&
                          !questionError &&
                          selectedQuestions.length === 0 ? (
                            <p className="text-sm leading-6 text-zinc-600">
                              No approved questions are attached to this outline code yet.
                            </p>
                          ) : null}
                          {selectedQuestions.map((question) => (
                            <article
                              key={question.question_id}
                              className="border-l-2 border-red-700 pl-3"
                            >
                              <p className="font-mono text-[11px] font-semibold text-zinc-800">
                                {question.question_id}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-zinc-700">
                                {clip(question.stem)}
                              </p>
                              <Link
                                href={`/atlas/questions/${encodeURIComponent(
                                  question.question_id,
                                )}/answer`}
                                className="mt-2 inline-flex rounded-md border border-zinc-950/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                              >
                                Study answer
                              </Link>
                            </article>
                          ))}
                        </div>
                      </section>
                    </>
                  ) : (
                    <p className="text-sm leading-6 text-zinc-300">Choose an outline code.</p>
                  )}
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function SubjectButton({
  active,
  label,
  meta,
  onClick,
}: {
  active: boolean;
  label: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-3 text-left transition-colors ${
        active ? "bg-zinc-950 text-white" : "text-zinc-800 hover:bg-zinc-100"
      }`}
    >
      <span className="block text-sm font-semibold leading-5">{label}</span>
      <span
        className={`mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] ${
          active ? "text-zinc-300" : "text-zinc-500"
        }`}
      >
        {meta}
      </span>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-950/10 bg-white px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-serif text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function LaneRow({
  label,
  status,
  meta,
  active,
}: {
  label: string;
  status: string;
  meta: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-5 text-zinc-900">{label}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
          {meta}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
          active ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-500"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function WalkButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-md border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white transition-[transform,background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/35 hover:bg-white/10 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-35"
    >
      {label}
    </button>
  );
}

function StateBox({ text, href, cta }: { text: string; href?: string; cta?: string }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-950/10 bg-white p-6">
      <p className="text-sm leading-6 text-zinc-800">{text}</p>
      {href && cta ? (
        <Link
          href={href}
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

function clip(value: string, max = 150): string {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
