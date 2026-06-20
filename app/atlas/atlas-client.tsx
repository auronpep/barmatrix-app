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

type SubtopicStat = {
  name: string;
  codeCount: number;
  readyCodeCount: number;
  questionCount: number;
};

const COMPONENT_FILTERS = [
  { key: "all", label: "All codes" },
  { key: "ready", label: "Has any lane" },
  { key: "questions", label: "Practice ready" },
  { key: "lessons", label: "Has lesson" },
  { key: "needs", label: "Needs content" },
] as const;

type ComponentFilter = (typeof COMPONENT_FILTERS)[number]["key"];

const ALL_SUBJECTS = "All subjects";
const ALL_SUBTOPICS = "All subtopics";
const OUTLINE_CODE_RE = /^\d{8}$/;
const LAST_ATLAS_CODE_KEY = "barmatrix:last-atlas-code";
const STUDIED_ATLAS_CODES_KEY = "barmatrix:studied-atlas-codes";

function matchesComponentFilter(node: AtlasCoverageNode, filter: ComponentFilter) {
  if (filter === "ready") return hasAnyLane(node);
  if (filter === "questions") return node.question_count > 0;
  if (filter === "lessons") return node.leadme_set_count + node.leadme_item_count > 0;
  if (filter === "needs") return !hasAnyLane(node);
  return true;
}

function readRequestedCode() {
  if (typeof window === "undefined") return null;
  const code = new URLSearchParams(window.location.search).get("code");
  return code && OUTLINE_CODE_RE.test(code) ? code : null;
}

function readStoredCode() {
  if (typeof window === "undefined") return null;
  try {
    const code = window.localStorage.getItem(LAST_ATLAS_CODE_KEY);
    return code && OUTLINE_CODE_RE.test(code) ? code : null;
  } catch {
    return null;
  }
}

function readStoredStudiedCodes() {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.localStorage.getItem(STUDIED_ATLAS_CODES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const codes = Array.isArray(parsed)
      ? parsed.filter(
          (code): code is string => typeof code === "string" && OUTLINE_CODE_RE.test(code),
        )
      : [];
    return new Set(codes);
  } catch {
    return new Set<string>();
  }
}

function writeStoredStudiedCodes(codes: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STUDIED_ATLAS_CODES_KEY, JSON.stringify([...codes].sort()));
  } catch {
    // ponytail: device-local studied progress is optional; private-mode storage can fail.
  }
}

export function AtlasClient() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState(ALL_SUBJECTS);
  const [subtopicFilter, setSubtopicFilter] = useState(ALL_SUBTOPICS);
  const [componentFilter, setComponentFilter] = useState<ComponentFilter>("all");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [resumedCode, setResumedCode] = useState<string | null>(null);
  const [studiedCodes, setStudiedCodes] = useState<Set<string>>(() => new Set());
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
        const requestedCode = readRequestedCode();
        const storedCode = requestedCode ? null : readStoredCode();
        const requestedNode = requestedCode
          ? data.nodes.find((node) => node.code === requestedCode)
          : null;
        const storedNode = storedCode ? data.nodes.find((node) => node.code === storedCode) : null;
        setResumedCode(!requestedNode && storedNode ? storedNode.code : null);
        setSelectedCode((current) => {
          if (requestedNode) return requestedNode.code;
          if (storedNode) return storedNode.code;
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
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const handle = window.setTimeout(() => {
      setStudiedCodes(readStoredStudiedCodes());
    }, 0);
    return () => window.clearTimeout(handle);
  }, [isLoaded, isSignedIn]);

  const allNodes = useMemo(() => (state.kind === "ready" ? state.nodes : []), [state]);
  const selected = selectedCode
    ? allNodes.find((node) => node.code === selectedCode) ?? null
    : null;

  useEffect(() => {
    if (!selectedCode || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LAST_ATLAS_CODE_KEY, selectedCode);
    } catch {
      // ponytail: device-local resume is optional; private-mode storage can fail.
    }
  }, [selectedCode]);

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
  const practiceNodes = useMemo(
    () => allNodes.filter((node) => node.question_count > 0),
    [allNodes],
  );

  const subtopics = useMemo<SubtopicStat[]>(() => {
    const source =
      subjectFilter === ALL_SUBJECTS
        ? allNodes
        : allNodes.filter((node) => node.subject_display === subjectFilter);
    const stats = new Map<string, SubtopicStat>();
    for (const node of source) {
      const stat =
        stats.get(node.subtopic) ??
        { name: node.subtopic, codeCount: 0, readyCodeCount: 0, questionCount: 0 };
      stat.codeCount += 1;
      stat.questionCount += node.question_count;
      if (node.question_count > 0) stat.readyCodeCount += 1;
      stats.set(node.subtopic, stat);
    }
    return [
      {
        name: ALL_SUBTOPICS,
        codeCount: source.length,
        readyCodeCount: source.filter((node) => node.question_count > 0).length,
        questionCount: source.reduce((sum, node) => sum + node.question_count, 0),
      },
      ...stats.values(),
    ];
  }, [allNodes, subjectFilter]);
  const scopedNodes = useMemo(
    () =>
      allNodes.filter((node) => {
        if (subjectFilter !== ALL_SUBJECTS && node.subject_display !== subjectFilter) return false;
        if (subtopicFilter !== ALL_SUBTOPICS && node.subtopic !== subtopicFilter) return false;
        return true;
      }),
    [allNodes, subjectFilter, subtopicFilter],
  );
  const scopedPracticeNodes = useMemo(
    () => scopedNodes.filter((node) => node.question_count > 0),
    [scopedNodes],
  );
  const scopedQuestionCount = scopedPracticeNodes.reduce(
    (sum, node) => sum + node.question_count,
    0,
  );
  const scopedComponentCodeCount = scopedNodes.filter((node) => nodeComponentTotal(node) > 0)
    .length;
  const scopedLaneReadyCount = scopedNodes.filter(hasAnyLane).length;
  const scopedNoLaneCount = scopedNodes.length - scopedLaneReadyCount;
  const scopeLabel =
    subtopicFilter !== ALL_SUBTOPICS
      ? subtopicFilter
      : subjectFilter !== ALL_SUBJECTS
        ? subjectFilter
        : "Full Atlas";

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allNodes.filter((node) => {
      if (subjectFilter !== ALL_SUBJECTS && node.subject_display !== subjectFilter) return false;
      if (subtopicFilter !== ALL_SUBTOPICS && node.subtopic !== subtopicFilter) return false;
      if (!matchesComponentFilter(node, componentFilter)) return false;
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
  const selectedPracticeIndex = selectedCode
    ? practiceNodes.findIndex((node) => node.code === selectedCode)
    : -1;
  const selectedPracticePosition =
    selectedPracticeIndex >= 0 ? selectedPracticeIndex + 1 : null;
  const previousPracticeCode =
    selectedIndex > 0
      ? allNodes
          .slice(0, selectedIndex)
          .reverse()
          .find((node) => node.question_count > 0)?.code ?? null
      : null;
  const nextPracticeCode =
    selectedIndex >= 0
      ? allNodes.slice(selectedIndex + 1).find((node) => node.question_count > 0)?.code ?? null
      : null;
  const selectedPosition = selectedIndex >= 0 ? selectedIndex + 1 : null;
  const selectedProgress =
    selectedPosition && allNodes.length > 0
      ? Math.round((selectedPosition / allNodes.length) * 100)
      : 0;
  const scopedStudiedCount = useMemo(
    () =>
      scopedNodes.reduce(
        (count, node) => count + (studiedCodes.has(node.code) ? 1 : 0),
        0,
      ),
    [scopedNodes, studiedCodes],
  );
  const scopedStudiedProgress =
    scopedNodes.length > 0 ? Math.round((scopedStudiedCount / scopedNodes.length) * 100) : 0;
  const selectedStudied = selected ? studiedCodes.has(selected.code) : false;
  const nextUnstudiedCode = useMemo(() => {
    const walkNodes = scopedNodes.length > 0 ? scopedNodes : allNodes;
    if (walkNodes.length === 0) return null;
    const scopedIndex = selectedCode
      ? walkNodes.findIndex((node) => node.code === selectedCode)
      : -1;
    const afterSelected = scopedIndex >= 0 ? walkNodes.slice(scopedIndex + 1) : walkNodes;
    return (
      afterSelected.find((node) => !studiedCodes.has(node.code))?.code ??
      walkNodes.find((node) => !studiedCodes.has(node.code))?.code ??
      null
    );
  }, [allNodes, scopedNodes, selectedCode, studiedCodes]);
  const scopedWalkCode = nextUnstudiedCode ?? scopedNodes[0]?.code ?? null;
  const scopedWalkActionLabel =
    scopedStudiedCount === 0
      ? "Start walk"
      : scopedStudiedCount >= scopedNodes.length
        ? "Restart walk"
        : "Continue walk";

  const selectedQuestions =
    questionState.kind === "ready" && questionState.code === selectedCode
      ? questionState.items
      : [];
  const firstSelectedQuestion = selectedQuestions[0] ?? null;
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
  const leadmeItemPreviews = componentData?.leadme_item_previews ?? [];
  const debriefElementPreviews = componentData?.debrief_element_previews ?? [];
  const previewCount = leadmeItemPreviews.length + debriefElementPreviews.length;
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

  function toggleStudiedCode() {
    if (!selected) return;
    setStudiedCodes((current) => {
      const next = new Set(current);
      if (next.has(selected.code)) {
        next.delete(selected.code);
      } else {
        next.add(selected.code);
      }
      writeStoredStudiedCodes(next);
      return next;
    });
  }

  function focusSelectedSubtopic() {
    if (!selected) return;
    setSubjectFilter(selected.subject_display);
    setSubtopicFilter(selected.subtopic);
    selectCode(selected.code);
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

  function chooseComponentFilter(filter: ComponentFilter) {
    setComponentFilter(filter);
    const next = allNodes.find((node) => {
      const subjectOk =
        subjectFilter === ALL_SUBJECTS || node.subject_display === subjectFilter;
      const subtopicOk = subtopicFilter === ALL_SUBTOPICS || node.subtopic === subtopicFilter;
      return subjectOk && subtopicOk && matchesComponentFilter(node, filter);
    });
    selectCode(next?.code ?? null);
  }

  function showScopedPractice() {
    setComponentFilter("questions");
    selectCode(scopedPracticeNodes[0]?.code ?? null);
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
                label="Practice-ready codes"
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
                        key={subtopic.name}
                        type="button"
                        onClick={() => chooseSubtopic(subtopic.name)}
                        className={`rounded-md px-2 py-2 text-left transition-colors ${
                          subtopicFilter === subtopic.name
                            ? "bg-zinc-950 text-white"
                            : "text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        <span className="block text-sm font-medium leading-5">
                          {subtopic.name}
                        </span>
                        <span
                          className={`mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] ${
                            subtopicFilter === subtopic.name ? "text-zinc-300" : "text-zinc-500"
                          }`}
                        >
                          {subtopic.readyCodeCount} ready / {subtopic.questionCount} questions
                        </span>
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
                    aria-label="Filter outline codes by practice and available lanes"
                  >
                    {COMPONENT_FILTERS.map((filter) => (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => chooseComponentFilter(filter.key)}
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
                  <div className="mt-3 grid gap-3 rounded-md bg-[#f4f1ea] p-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-700">
                        Weak-section drilldown
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-zinc-900">
                        {scopeLabel}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                        {scopedPracticeNodes.length} ready codes / {scopedQuestionCount} questions
                      </p>
                      <div
                        className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
                        aria-label={`Scope readiness for ${scopeLabel}`}
                      >
                        {[
                          { label: "Studied", value: `${scopedStudiedCount}/${scopedNodes.length}` },
                          { label: "Practice", value: String(scopedPracticeNodes.length) },
                          { label: "Components", value: String(scopedComponentCodeCount) },
                          { label: "No lane", value: String(scopedNoLaneCount) },
                        ].map((item) => (
                          <div key={item.label} className="rounded-md bg-white px-2 py-2">
                            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-500">
                              {item.label}
                            </p>
                            <p className="mt-1 font-serif text-xl font-semibold tabular-nums text-zinc-950">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => scopedWalkCode && selectCode(scopedWalkCode)}
                        disabled={!scopedWalkCode}
                        className="rounded-md bg-red-700 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-[transform,background-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45"
                      >
                        {scopedWalkActionLabel}
                      </button>
                      <button
                        type="button"
                        onClick={showScopedPractice}
                        disabled={scopedPracticeNodes.length === 0}
                        className="rounded-md bg-zinc-950 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-[transform,background-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45"
                      >
                        Show ready codes
                      </button>
                      <button
                        type="button"
                        onClick={() => selectCode(scopedPracticeNodes[0]?.code ?? null)}
                        disabled={scopedPracticeNodes.length === 0}
                        className="rounded-md border border-zinc-950/15 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700 transition-[transform,background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-zinc-950 hover:bg-zinc-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45"
                      >
                        Jump to first ready
                      </button>
                      <button
                        type="button"
                        onClick={() => resumedCode && selectCode(resumedCode)}
                        disabled={!resumedCode || resumedCode === selectedCode}
                        className="rounded-md border border-zinc-950/15 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700 transition-[transform,background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-zinc-950 hover:bg-zinc-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45"
                      >
                        Saved code
                      </button>
                    </div>
                    {resumedCode ? (
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                        Saved code on this device: {resumedCode}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  {grouped.length === 0 ? (
                    <div className="rounded-lg border border-zinc-950/10 bg-white p-6 text-sm text-zinc-700">
                      No outline codes match this filter.
                    </div>
                  ) : (
                    grouped.map(([subtopic, nodes]) => {
                      const readyCodeCount = nodes.filter((node) => node.question_count > 0).length;
                      const questionCount = nodes.reduce(
                        (sum, node) => sum + node.question_count,
                        0,
                      );
                      return (
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
                              {nodes.length} codes / {readyCodeCount} ready / {questionCount} questions
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
                                      {laneFootprint(node)}
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
                                    ? `${node.question_count} ready`
                                    : "Needs item"}
                                </span>
                              </button>
                            ))}
                          </div>
                        </section>
                      );
                    })
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
                      <button
                        type="button"
                        onClick={focusSelectedSubtopic}
                        className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-white/15 bg-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-100 transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/35 hover:bg-white/15 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        Focus this subtopic
                      </button>
                      <p className="mt-3 rounded-md bg-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-300">
                        Saved on this device for next time
                      </p>

                      <div className="mt-3 rounded-md bg-white/10 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                            Studied on this device
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-200">
                            {scopedStudiedCount} / {scopedNodes.length}
                          </p>
                        </div>
                        <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400">
                          Scope: {scopeLabel}
                        </p>
                        <div
                          className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
                          aria-label={`Studied outline progress ${scopedStudiedProgress}% for ${scopeLabel}`}
                        >
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{ width: `${scopedStudiedProgress}%` }}
                          />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            aria-pressed={selectedStudied}
                            onClick={toggleStudiedCode}
                            className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-[transform,background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                              selectedStudied
                                ? "border-emerald-300/70 bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
                                : "border-white/15 bg-white/10 text-white hover:border-white/35 hover:bg-white/15"
                            }`}
                          >
                            {selectedStudied ? "Marked studied" : "Mark studied"}
                          </button>
                          <WalkButton
                            label="Next unstudied"
                            disabled={!nextUnstudiedCode}
                            onClick={() => nextUnstudiedCode && selectCode(nextUnstudiedCode)}
                          />
                        </div>
                      </div>

                      <div className="mt-5 rounded-md bg-white/10 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                            Atlas walk
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-200">
                            {selectedPosition} / {allNodes.length}
                          </p>
                        </div>
                        <div
                          className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
                          aria-label={`Atlas walk progress ${selectedProgress}%`}
                        >
                          <div
                            className="h-full rounded-full bg-red-600"
                            style={{ width: `${selectedProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 rounded-md bg-white/10 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                            Practice walk
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-200">
                            {selectedPracticePosition
                              ? `${selectedPracticePosition} / ${practiceNodes.length}`
                              : `${practiceNodes.length} ready codes`}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                          {selected.question_count > 0
                            ? `${formatCount(selected.question_count, "approved question")} here.`
                            : "No approved practice here yet. Jump to a ready code."}
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <WalkButton
                            label="Prev ready"
                            disabled={!previousPracticeCode}
                            onClick={() =>
                              previousPracticeCode && selectCode(previousPracticeCode)
                            }
                          />
                          <WalkButton
                            label="Next ready"
                            disabled={!nextPracticeCode}
                            onClick={() => nextPracticeCode && selectCode(nextPracticeCode)}
                          />
                        </div>
                      </div>

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
                      <Link
                        href={`/atlas?code=${encodeURIComponent(selected.code)}#atlas-code-lesson`}
                        className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-white/15 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-950 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-100 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        Study this code
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

                      <section
                        id="atlas-code-lesson"
                        className="mt-5 scroll-mt-6 rounded-lg bg-white p-4 text-zinc-950"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-700">
                          Outline lesson
                        </p>
                        <h3 className="mt-2 font-serif text-xl font-semibold">
                          {selected.outline_text}
                        </h3>
                        <div className="mt-3 grid gap-2">
                          <div className="rounded-md bg-zinc-50 px-3 py-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                              Code
                            </p>
                            <p className="mt-1 text-sm font-semibold leading-5">
                              {selected.code} / {selected.subtopic}
                            </p>
                          </div>
                          <div className="rounded-md bg-zinc-50 px-3 py-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                              Practice
                            </p>
                            <p className="mt-1 text-sm font-semibold leading-5">
                              {selected.question_count > 0
                                ? formatCount(selected.question_count, "approved question")
                                : "Approval gate"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 rounded-md border border-zinc-950/10 bg-zinc-50 p-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Outline position
                              </p>
                              <p className="mt-1 text-sm leading-6 text-zinc-700">
                                {selected.subject_display} / {selected.subtopic} /{" "}
                                {selectedPosition ?? "-"} of {allNodes.length}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-wrap gap-2">
                              <LessonJump code={previousCode} label="Prior lesson" />
                              <LessonJump code={nextCode} label="Next lesson" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 rounded-md border border-zinc-950/10 bg-zinc-50 p-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            Component index
                          </p>
                          <div className="mt-3 grid gap-2 sm:grid-cols-3">
                            <ComponentIndexLink
                              href="#atlas-code-questions"
                              label="Question bank"
                              meta={
                                selected.question_count > 0
                                  ? formatCount(selected.question_count, "approved question")
                                  : "Approval gate"
                              }
                              active={selected.question_count > 0}
                            />
                            <ComponentIndexLink
                              href="#atlas-code-components"
                              label="Component lanes"
                              meta={
                                previewCount + leadmeItemTotal + debriefElementTotal > 0
                                  ? `${formatCount(previewCount, "preview")} / ${formatCount(
                                      leadmeItemTotal + debriefElementTotal,
                                      "component",
                                    )}`
                                  : "Approval gate"
                              }
                              active={previewCount + leadmeItemTotal + debriefElementTotal > 0}
                            />
                            <ComponentIndexLink
                              href="#atlas-code-leadme"
                              label="LeadMe lesson"
                              meta={
                                leadmeSet
                                  ? formatCount(leadmeSet.total_items, "item")
                                  : "Approval gate"
                              }
                              active={Boolean(leadmeSet)}
                            />
                          </div>
                        </div>
                        <div className="mt-4 border-t border-zinc-950/10 pt-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            Study sequence
                          </p>
                          <ol className="mt-3 grid gap-3 text-sm leading-6 text-zinc-700">
                            <li className="border-l-2 border-red-700 pl-3">
                              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                1 / Anchor this code
                              </p>
                              <p className="mt-1">
                                Treat {selected.code} as the target label for {selected.subtopic}:{" "}
                                {selected.outline_text}.
                              </p>
                            </li>
                            <li className="border-l-2 border-zinc-300 pl-3">
                              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                2 / Work approved questions
                              </p>
                              <p className="mt-1">
                                {selected.question_count > 0
                                  ? `Start with ${formatCount(
                                      selected.question_count,
                                      "approved question",
                                    )}, then open the answer debrief.`
                                  : "Approval gate: no approved questions are attached to this code yet."}
                              </p>
                              {firstSelectedQuestion ? (
                                <Link
                                  href={`/atlas/questions/${encodeURIComponent(
                                    firstSelectedQuestion.question_id,
                                  )}/answer`}
                                  className="mt-2 inline-flex rounded-md border border-zinc-950/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                                >
                                  Open first answer
                                </Link>
                              ) : selected.question_count > 0 ? (
                                <a
                                  href="#atlas-code-questions"
                                  className="mt-2 inline-flex font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-600 underline underline-offset-4 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                                >
                                  View question bank
                                </a>
                              ) : null}
                            </li>
                            <li className="border-l-2 border-zinc-300 pl-3">
                              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                3 / Open approved support
                              </p>
                              <p className="mt-1">
                                {componentsLoading
                                  ? "Checking approved component connections..."
                                  : previewCount > 0
                                    ? `${formatCount(
                                        previewCount,
                                        "approved preview",
                                      )} connected below for this code.`
                                    : leadmeSet
                                      ? `${leadmeSet.title} is ready for this code.`
                                      : "Approval gate: lessons, drills, flashcards, and debrief components stay hidden until approved."}
                              </p>
                            </li>
                            <li className="border-l-2 border-zinc-300 pl-3">
                              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                4 / Follow approved detours
                              </p>
                              <p className="mt-1">
                                {trapCount + tensionCount + debriefElementTotal > 0
                                  ? "Use the live trap, tension, and debrief lanes to drill the same failure pattern."
                                  : "Trap, tension, and red-zone detours remain gated until they are approved for students."}
                              </p>
                            </li>
                          </ol>
                        </div>
                        <div
                          id="atlas-code-leadme"
                          className="mt-4 scroll-mt-6 border-t border-zinc-950/10 pt-4"
                        >
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            LeadMe lesson
                          </p>
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
                        </div>
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

                      <section
                        id="atlas-code-components"
                        className="mt-4 scroll-mt-6 rounded-lg bg-white p-4 text-zinc-950"
                      >
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
                        <div className="mt-4 border-t border-zinc-950/10 pt-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                              Connected previews
                            </p>
                            <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                              {formatCount(previewCount, "item")}
                            </span>
                          </div>
                          {componentsLoading ? (
                            <p className="mt-3 text-sm leading-6 text-zinc-600">
                              Loading approved component previews...
                            </p>
                          ) : previewCount === 0 ? (
                            <p className="mt-3 text-sm leading-6 text-zinc-600">
                              No approved component previews are connected yet.
                            </p>
                          ) : (
                            <div className="mt-3 grid gap-2">
                              {leadmeItemPreviews.map((item) => (
                                <ComponentPreviewRow
                                  key={item.item_id}
                                  label="LeadMe"
                                  title={friendlyComponentLabel(item.external_id)}
                                  type={item.component_type}
                                  meta={
                                    item.estimated_seconds
                                      ? `${formatSeconds(item.estimated_seconds)} estimate`
                                      : "Approved item"
                                  }
                                />
                              ))}
                              {debriefElementPreviews.map((item) => (
                                <ComponentPreviewRow
                                  key={item.element_id}
                                  label="Answer debrief"
                                  title={item.title}
                                  type={item.component_type}
                                  meta={formatCount(item.source_count, "source")}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </section>

                      <section
                        id="atlas-code-questions"
                        className="mt-4 scroll-mt-6 rounded-lg bg-white p-4 text-zinc-950"
                      >
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

function ComponentPreviewRow({
  label,
  title,
  type,
  meta,
}: {
  label: string;
  title: string;
  type: string;
  meta: string;
}) {
  return (
    <article className="rounded-md bg-zinc-50 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-sm bg-zinc-950 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
          {formatComponentType(type)}
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold leading-5 text-zinc-900">{title}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
        {meta}
      </p>
    </article>
  );
}

function ComponentIndexLink({
  href,
  label,
  meta,
  active,
}: {
  href: string;
  label: string;
  meta: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`rounded-md border px-3 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
        active
          ? "border-zinc-950/20 bg-white text-zinc-950 hover:border-zinc-950"
          : "border-zinc-950/10 bg-white/70 text-zinc-500 hover:border-zinc-950/25"
      }`}
    >
      <span className="block font-mono text-[10px] uppercase tracking-[0.12em]">
        {label}
      </span>
      <span className="mt-1 block text-xs leading-5">{meta}</span>
    </a>
  );
}

function LessonJump({ code, label }: { code: string | null; label: string }) {
  if (!code) {
    return (
      <span className="rounded-md border border-zinc-950/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400">
        {label}
      </span>
    );
  }

  return (
    <a
      href={`/atlas?code=${encodeURIComponent(code)}#atlas-code-lesson`}
      className="rounded-md border border-zinc-950/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
    >
      {label}
    </a>
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

function laneFootprint(node: AtlasCoverageNode): string {
  const parts = [
    node.question_count > 0 ? formatCount(node.question_count, "question") : null,
    node.leadme_set_count > 0 ? formatCount(node.leadme_set_count, "LeadMe set") : null,
    node.leadme_item_count > 0 ? formatCount(node.leadme_item_count, "guided item") : null,
    node.debrief_element_count > 0 ? formatCount(node.debrief_element_count, "debrief") : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "No approved lanes yet";
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

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

function formatComponentType(value: string): string {
  return value.replaceAll("_", " ");
}

function friendlyComponentLabel(value: string): string {
  const cleaned = value.replace(/^[a-z]+_/i, "").replaceAll("_", " ").replaceAll("-", " ");
  return cleaned || value;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
