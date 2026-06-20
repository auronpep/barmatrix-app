"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  api,
  ApiClientError,
  type AtlasComponentsResponse,
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

type ComponentsState =
  | { kind: "idle"; code: string | null }
  | { kind: "ready"; code: string; data: AtlasComponentsResponse }
  | { kind: "error"; code: string; message: string };

type LeadMeStartState =
  | { kind: "idle"; code: string | null }
  | { kind: "starting"; code: string }
  | { kind: "started"; code: string; message: string }
  | { kind: "missing"; code: string; message: string }
  | { kind: "error"; code: string; message: string };

type CodeDrillStartState =
  | { kind: "idle"; code: string | null }
  | { kind: "starting"; code: string }
  | { kind: "missing"; code: string; message: string }
  | { kind: "error"; code: string; message: string };

type SubjectStat = {
  subject: string;
  codeCount: number;
  questionCount: number;
};

const COMPONENT_FILTERS = [
  { key: "all", label: "All codes" },
  { key: "ready", label: "Has any lane" },
  { key: "questions", label: "Has questions" },
  { key: "lessons", label: "Has lesson" },
  { key: "needs", label: "Needs content" },
] as const;

type ComponentFilter = (typeof COMPONENT_FILTERS)[number]["key"];

const ALL_SUBJECTS = "All subjects";
const ALL_SUBTOPICS = "All subtopics";
const OUTLINE_CODE_RE = /^\d{8}$/;

function readRequestedCode() {
  if (typeof window === "undefined") return null;
  const code = new URLSearchParams(window.location.search).get("code");
  return code && OUTLINE_CODE_RE.test(code) ? code : null;
}

export function AtlasClient() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [requestedCode] = useState(readRequestedCode);
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState(ALL_SUBJECTS);
  const [subtopicFilter, setSubtopicFilter] = useState(ALL_SUBTOPICS);
  const [componentFilter, setComponentFilter] = useState<ComponentFilter>("all");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [questionState, setQuestionState] = useState<QuestionState>({
    kind: "idle",
    code: null,
  });
  const [componentsState, setComponentsState] = useState<ComponentsState>({
    kind: "idle",
    code: null,
  });
  const [leadMeStart, setLeadMeStart] = useState<LeadMeStartState>({
    kind: "idle",
    code: null,
  });
  const [codeDrillStart, setCodeDrillStart] = useState<CodeDrillStartState>({
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
        const requestedNode = requestedCode
          ? data.nodes.find((node) => node.code === requestedCode)
          : null;
        setSelectedCode((current) => {
          if (requestedNode) return requestedNode.code;
          return current && data.nodes.some((node) => node.code === current)
            ? current
            : data.nodes[0]?.code ?? null;
        });
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
  }, [getToken, isLoaded, isSignedIn, requestedCode]);

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

  useEffect(() => {
    if (state.kind !== "ready" || !selectedCode) return;
    const node = state.nodes.find((item) => item.code === selectedCode);
    if (!node) return;

    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getAtlasComponents(token, selectedCode);
        if (!cancelled) {
          setComponentsState({ kind: "ready", code: selectedCode, data });
        }
      } catch {
        if (!cancelled) {
          setComponentsState({
            kind: "error",
            code: selectedCode,
            message: "Could not load component lanes for this outline code.",
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
      if (componentFilter === "ready" && !hasAnyLane(node)) return false;
      if (componentFilter === "questions" && node.question_count === 0) return false;
      if (componentFilter === "lessons" && node.leadme_set_count + node.leadme_item_count === 0) {
        return false;
      }
      if (componentFilter === "needs" && hasAnyLane(node)) return false;
      if (!needle) return true;
      return [node.code, node.subject_display, node.subtopic, node.outline_text].some((value) =>
        value.toLowerCase().includes(needle),
      );
    });
  }, [allNodes, componentFilter, query, subjectFilter, subtopicFilter]);

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
  const componentData =
    componentsState.kind === "ready" && componentsState.code === selectedCode
      ? componentsState.data
      : null;
  const componentsLoading = Boolean(selectedCode && componentsState.code !== selectedCode);
  const componentsError =
    componentsState.kind === "error" && componentsState.code === selectedCode
      ? componentsState.message
      : null;
  const leadmeSet = componentData?.leadme_set ?? null;
  const leadmeItemTotal = totalCounts(componentData?.leadme_items ?? []);
  const debriefElementTotal = totalCounts(componentData?.debrief_elements ?? []);
  const lessonCount = countMatching(componentData?.leadme_items ?? [], [
    "lesson",
    "micro_read",
    "doctrinal",
  ]);
  const drillCount = countMatching(componentData?.leadme_items ?? [], ["drill", "quiz"]);
  const flashcardCount = countMatching(componentData?.leadme_items ?? [], ["flashcard"]);
  const trapCount =
    countMatching(componentData?.debrief_elements ?? [], ["trap"]) +
    countMatching(componentData?.leadme_items ?? [], ["trap"]);
  const tensionCount =
    countMatching(componentData?.debrief_elements ?? [], ["tension"]) +
    countMatching(componentData?.leadme_items ?? [], ["tension", "clash"]);
  const loading = !isLoaded || (isSignedIn && state.kind === "loading");

  function selectCode(code: string | null) {
    setSelectedCode(code);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (code) {
      url.searchParams.set("code", code);
    } else {
      url.searchParams.delete("code");
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function chooseSubject(subject: string) {
    setSubjectFilter(subject);
    setSubtopicFilter(ALL_SUBTOPICS);
    const next =
      subject === ALL_SUBJECTS
        ? allNodes[0]
        : allNodes.find((node) => node.subject_display === subject);
    selectCode(next?.code ?? null);
  }

  function chooseSubtopic(subtopic: string) {
    setSubtopicFilter(subtopic);
    const next = allNodes.find((node) => {
      const subjectOk =
        subjectFilter === ALL_SUBJECTS || node.subject_display === subjectFilter;
      const subtopicOk = subtopic === ALL_SUBTOPICS || node.subtopic === subtopic;
      return subjectOk && subtopicOk;
    });
    selectCode(next?.code ?? null);
  }

  async function startLeadMe() {
    if (!selected) return;
    setLeadMeStart({ kind: "starting", code: selected.code });
    try {
      const token = await getToken();
      if (!token) throw new Error("no session token");
      const result = await api.startAtlasLeadMe(token, selected.code);
      setLeadMeStart({
        kind: "started",
        code: selected.code,
        message: `Queued ${result.started.title}.`,
      });
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 404) {
        setLeadMeStart({
          kind: "missing",
          code: selected.code,
          message: "No approved LeadMe set is connected to this code yet.",
        });
      } else if (err instanceof ApiClientError && err.status === 403) {
        setLeadMeStart({
          kind: "error",
          code: selected.code,
          message: "This LeadMe set is only available inside the paid repair program.",
        });
      } else {
        setLeadMeStart({
          kind: "error",
          code: selected.code,
          message: "Could not start this LeadMe set.",
        });
      }
    }
  }

  async function startCodeDrill() {
    if (!selected) return;
    if (selected.question_count === 0) {
      setCodeDrillStart({
        kind: "missing",
        code: selected.code,
        message: "No approved questions are connected to this outline code yet.",
      });
      return;
    }
    setCodeDrillStart({ kind: "starting", code: selected.code });
    try {
      const token = await getToken();
      if (!token) throw new Error("no session token");
      const result = await api.startDrill(
        {
          kind: "outline_code",
          outline_code: selected.code,
          size: Math.min(selected.question_count, 12),
          exclude_mastered: true,
        },
        token,
      );
      if (!result.drill_id) {
        setCodeDrillStart({
          kind: "missing",
          code: selected.code,
          message: "No runnable questions matched this outline code yet.",
        });
        return;
      }
      router.push(`/drills/${result.drill_id}`);
    } catch (err) {
      setCodeDrillStart({
        kind: "error",
        code: selected.code,
        message:
          err instanceof ApiClientError && err.status === 403
            ? "Enrollment required to start this drill."
            : "Could not start this outline-code drill.",
      });
    }
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
            <div className="grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
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
              <Metric
                label="Codes with components"
                value={String(state.nodes.filter((node) => nodeComponentTotal(node) > 0).length)}
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
                  <div
                    className="mt-3 flex flex-wrap gap-2"
                    aria-label="Filter outline codes by available lanes"
                  >
                    {COMPONENT_FILTERS.map((filter) => (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => setComponentFilter(filter.key)}
                        className={`rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
                          componentFilter === filter.key
                            ? "bg-zinc-950 text-white"
                            : "bg-[#fbfaf6] text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
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
                              onClick={() => selectCode(node.code)}
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
                                <span className="block">{node.outline_text}</span>
                                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                  {nodeComponentTotal(node) > 0
                                    ? formatCount(nodeComponentTotal(node), "component")
                                    : "No components"}
                                </span>
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
                          onClick={() => previousCode && selectCode(previousCode)}
                        />
                        <WalkButton
                          label="Next"
                          disabled={!nextCode}
                          onClick={() => nextCode && selectCode(nextCode)}
                        />
                      </div>
                      <Link
                        href={`/atlas?code=${encodeURIComponent(selected.code)}`}
                        className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-white/15 bg-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-100 transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        Direct link
                      </Link>
                      <button
                        type="button"
                        onClick={startCodeDrill}
                        disabled={
                          selected.question_count === 0 ||
                          (codeDrillStart.kind === "starting" &&
                            codeDrillStart.code === selected.code)
                        }
                        className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-red-700 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-[transform,background-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                      >
                        {codeDrillStart.kind === "starting" &&
                        codeDrillStart.code === selected.code
                          ? "Starting drill..."
                          : "Drill this code"}
                      </button>
                      {codeDrillStart.code === selected.code &&
                      codeDrillStart.kind !== "idle" &&
                      codeDrillStart.kind !== "starting" ? (
                        <p className="mt-2 rounded-md bg-white/10 p-3 text-sm leading-6 text-zinc-200">
                          {codeDrillStart.message}
                        </p>
                      ) : null}

                      <section className="mt-5 rounded-lg bg-white p-4 text-zinc-950">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-700">
                          LeadMe lesson
                        </p>
                        <h3 className="mt-2 font-serif text-xl font-semibold">
                          {selected.outline_text}
                        </h3>
                        {componentsLoading ? (
                          <p className="mt-2 text-sm leading-6 text-zinc-700">
                            Checking approved lesson content for this code...
                          </p>
                        ) : leadmeSet ? (
                          <>
                            <p className="mt-2 text-sm leading-6 text-zinc-700">
                              {leadmeSet.title} is approved for this outline code.
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-emerald-50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-800">
                                {formatCount(leadmeSet.total_items, "item")}
                              </span>
                              <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                                {leadmeSet.set_type.replaceAll("_", " ")}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={startLeadMe}
                              disabled={
                                leadMeStart.kind === "starting" &&
                                leadMeStart.code === selected.code
                              }
                              className="mt-4 inline-flex rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-[transform,background-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                            >
                              {leadMeStart.kind === "starting" &&
                              leadMeStart.code === selected.code
                                ? "Starting..."
                                : "Start LeadMe"}
                            </button>
                          </>
                        ) : (
                          <p className="mt-2 text-sm leading-6 text-zinc-700">
                            No approved LeadMe set is connected to this outline code yet.
                          </p>
                        )}
                        {leadMeStart.code === selected.code &&
                        leadMeStart.kind !== "idle" &&
                        leadMeStart.kind !== "starting" ? (
                          <div
                            className={`mt-3 rounded-md p-3 text-sm leading-6 ${
                              leadMeStart.kind === "started"
                                ? "bg-emerald-50 text-emerald-900"
                                : "bg-amber-50 text-amber-900"
                            }`}
                          >
                            <p>{leadMeStart.message}</p>
                            {leadMeStart.kind === "started" ? (
                              <Link
                                href="/dashboard/path"
                                className="mt-2 inline-flex font-mono text-[10px] uppercase tracking-[0.12em] underline underline-offset-4"
                              >
                                Open My Path
                              </Link>
                            ) : null}
                          </div>
                        ) : null}
                      </section>

                      <section className="mt-4 rounded-lg bg-white p-4 text-zinc-950">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                          Components
                        </p>
                        <div className="mt-3 divide-y divide-zinc-950/10">
                          {componentsError ? (
                            <p className="py-2 text-sm leading-6 text-amber-800">
                              {componentsError}
                            </p>
                          ) : null}
                          <LaneRow
                            label="Questions"
                            status={selected.question_count > 0 ? "Live" : "Missing"}
                            meta={`${selected.question_count} approved`}
                            active={selected.question_count > 0}
                          />
                          <LaneRow
                            label="Guided items"
                            status={leadmeItemTotal > 0 ? "Live" : "Approval gate"}
                            meta={
                              leadmeItemTotal > 0
                                ? formatCount(leadmeItemTotal, "item")
                                : "Not connected"
                            }
                            active={leadmeItemTotal > 0}
                          />
                          <LaneRow
                            label="Lessons"
                            status={lessonCount > 0 ? "Live" : "Approval gate"}
                            meta={lessonCount > 0 ? formatCount(lessonCount, "lesson") : "Not connected"}
                            active={lessonCount > 0}
                          />
                          <LaneRow
                            label="Drills"
                            status={drillCount > 0 ? "Live" : "Approval gate"}
                            meta={drillCount > 0 ? formatCount(drillCount, "drill") : "Not connected"}
                            active={drillCount > 0}
                          />
                          <LaneRow
                            label="Traps"
                            status={trapCount > 0 ? "Live" : "Approval gate"}
                            meta={trapCount > 0 ? formatCount(trapCount, "trap") : "Not connected"}
                            active={trapCount > 0}
                          />
                          <LaneRow
                            label="Flashcards"
                            status={flashcardCount > 0 ? "Live" : "Approval gate"}
                            meta={
                              flashcardCount > 0
                                ? formatCount(flashcardCount, "flashcard")
                                : "Not connected"
                            }
                            active={flashcardCount > 0}
                          />
                          <LaneRow
                            label="Tensions"
                            status={tensionCount > 0 ? "Live" : "Approval gate"}
                            meta={tensionCount > 0 ? formatCount(tensionCount, "tension") : "Not connected"}
                            active={tensionCount > 0}
                          />
                          <LaneRow
                            label="Answer debriefs"
                            status={debriefElementTotal > 0 ? "Live" : "Approval gate"}
                            meta={
                              debriefElementTotal > 0
                                ? formatCount(debriefElementTotal, "element")
                                : "Not connected"
                            }
                            active={debriefElementTotal > 0}
                          />
                          <LaneRow
                            label="Boot camps"
                            status="Approval gate"
                            meta="Not connected"
                            active={false}
                          />
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

function nodeComponentTotal(node: AtlasCoverageNode): number {
  return node.leadme_item_count + node.debrief_element_count;
}

function hasAnyLane(node: AtlasCoverageNode): boolean {
  return node.question_count + nodeComponentTotal(node) > 0;
}

function totalCounts(counts: { count: number }[]): number {
  return counts.reduce((sum, item) => sum + item.count, 0);
}

function countMatching(
  counts: { component_type: string; count: number }[],
  needles: string[],
): number {
  const normalizedNeedles = needles.map((needle) => needle.toLowerCase());
  return counts.reduce((sum, item) => {
    const componentType = item.component_type.toLowerCase();
    const matched = normalizedNeedles.some((needle) => componentType.includes(needle));
    return matched ? sum + item.count : sum;
  }, 0);
}

function formatCount(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
