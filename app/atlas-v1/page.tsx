import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAtlasAdmin, requireAtlasAdmin } from "@/lib/atlas-admin";

export const metadata: Metadata = {
  title: "Atlas v1",
  description: "Internal Atlas_v1 outline-code coverage and question intake.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type CoverageState = "missing" | "in_review" | "covered";
type QuestionStatus = "review" | "included" | "rejected" | "retired";

interface AtlasNode {
  code: string;
  parent_code: string | null;
  subject: string;
  subject_display: string;
  subtopic: string;
  outline_text: string;
  display_label: string;
  level: number;
  leaf: boolean;
  included_count: number;
  review_count: number;
  coverage_state: CoverageState;
  last_included_at: string | null;
}

interface CoverageResponse {
  nodes: AtlasNode[];
  summary: Record<CoverageState, number> & { total: number };
}

interface QuestionListItem {
  question_id: string;
  outline_code: string;
  status: QuestionStatus;
  stem: string;
  call_text: string;
  correct_answer: string;
  source_label: string | null;
  source_ref: string | null;
  included_at: string | null;
  updated_at: string | null;
}

interface QuestionListResponse {
  items: QuestionListItem[];
}

type LoadResult<T> = { data: T; error: null } | { data: null; error: string };

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "https://api.barmatrix.app";
}

function adminSecret(): string | null {
  const secret = process.env.ADMIN_SECRET?.trim();
  return secret ? secret : null;
}

async function atlasFetch<T>(path: string, init: RequestInit = {}): Promise<LoadResult<T>> {
  const secret = adminSecret();
  if (!secret) return { data: null, error: "ADMIN_SECRET is not configured for Atlas_v1." };

  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "x-admin-secret": secret,
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) detail = body.error;
    } catch {
      // Keep the HTTP status detail.
    }
    return { data: null, error: detail };
  }

  return { data: (await response.json()) as T, error: null };
}

function cleanFormValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

async function submitAtlasQuestion(formData: FormData) {
  "use server";

  await requireAtlasAdmin();

  const outlineCode = cleanFormValue(formData.get("outline_code"));
  const status = cleanFormValue(formData.get("status")) || "review";
  const caseStudyJson = cleanFormValue(formData.get("case_study_json"));
  const payload = {
    question_id: cleanFormValue(formData.get("question_id")) || undefined,
    outline_code: outlineCode,
    status,
    stem: cleanFormValue(formData.get("stem")),
    call_text: cleanFormValue(formData.get("call_text")),
    answer_a: cleanFormValue(formData.get("answer_a")),
    answer_b: cleanFormValue(formData.get("answer_b")),
    answer_c: cleanFormValue(formData.get("answer_c")),
    answer_d: cleanFormValue(formData.get("answer_d")),
    correct_answer: cleanFormValue(formData.get("correct_answer")),
    minimum_explanation: cleanFormValue(formData.get("minimum_explanation")),
    source_label: cleanFormValue(formData.get("source_label")) || undefined,
    source_ref: cleanFormValue(formData.get("source_ref")) || undefined,
    case_study_json: caseStudyJson || undefined,
    included_by: cleanFormValue(formData.get("included_by")) || undefined,
  };

  const result = await atlasFetch<{ question_id: string }>("/api/admin/atlas-v1/questions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (result.error) throw new Error(result.error);

  redirect(`/atlas-v1?outline_code=${encodeURIComponent(outlineCode)}&question_status=${encodeURIComponent(status)}`);
}

async function updateAtlasQuestionStatus(formData: FormData) {
  "use server";

  await requireAtlasAdmin();

  const questionId = cleanFormValue(formData.get("question_id"));
  const outlineCode = cleanFormValue(formData.get("outline_code"));
  const status = cleanFormValue(formData.get("status"));
  const result = await atlasFetch(`/api/admin/atlas-v1/questions/${encodeURIComponent(questionId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      included_by: cleanFormValue(formData.get("included_by")) || undefined,
    }),
  });
  if (result.error) throw new Error(result.error);

  redirect(`/atlas-v1?outline_code=${encodeURIComponent(outlineCode)}&question_status=${encodeURIComponent(status)}`);
}

function stateLabel(state: CoverageState): string {
  if (state === "missing") return "Missing";
  if (state === "in_review") return "In review";
  return "Covered";
}

function stateClass(state: CoverageState): string {
  if (state === "covered") return "border-green-700 bg-green-50 text-green-800";
  if (state === "in_review") return "border-amber-700 bg-amber-50 text-amber-800";
  return "border-red-700 bg-red-50 text-red-800";
}

function formatDate(value: string | null): string {
  if (!value) return "None";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function clip(value: string, max = 130): string {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

function pathFor(params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) qs.set(key, value);
  }
  const query = qs.toString();
  return query ? `/atlas-v1?${query}` : "/atlas-v1";
}

export default async function AtlasV1Page({
  searchParams,
}: {
  searchParams: Promise<{
    coverage_state?: string;
    subject?: string;
    subtopic?: string;
    outline_code?: string;
    question_status?: string;
  }>;
}) {
  if (!(await isAtlasAdmin())) notFound();

  const params = await searchParams;
  const coverageState = ["missing", "in_review", "covered"].includes(params.coverage_state ?? "")
    ? (params.coverage_state as CoverageState)
    : undefined;
  const questionStatus = ["review", "included", "rejected", "retired"].includes(params.question_status ?? "")
    ? (params.question_status as QuestionStatus)
    : "review";

  const coveragePath = new URLSearchParams();
  coveragePath.set("limit", "1000");
  if (coverageState) coveragePath.set("coverage_state", coverageState);
  if (params.subject) coveragePath.set("subject", params.subject);
  if (params.subtopic) coveragePath.set("subtopic", params.subtopic);

  const coverage = await atlasFetch<CoverageResponse>(`/api/admin/atlas-v1/coverage?${coveragePath.toString()}`);
  const nodes = coverage.data?.nodes ?? [];
  const selectedCode = params.outline_code && nodes.some((node) => node.code === params.outline_code)
    ? params.outline_code
    : nodes[0]?.code;
  const selected = nodes.find((node) => node.code === selectedCode) ?? null;
  const questions = selectedCode
    ? await atlasFetch<QuestionListResponse>(
        `/api/admin/atlas-v1/questions?outline_code=${encodeURIComponent(selectedCode)}&status=${encodeURIComponent(questionStatus)}&limit=100`,
      )
    : { data: { items: [] }, error: null };

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-zinc-950">
      <section className="border-b border-zinc-300 bg-white px-5 py-5">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-red-700">
              Atlas_v1
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
              Outline Code Coverage
            </h1>
          </div>
          <Link
            href="/app"
            className="rounded-md border border-zinc-300 px-3 py-2 font-mono text-xs uppercase tracking-wide text-zinc-700 hover:bg-zinc-100"
          >
            Command center
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-5 px-5 py-5 xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <FilterLink active={!coverageState} href="/atlas-v1" label="All" />
            <FilterLink active={coverageState === "missing"} href="/atlas-v1?coverage_state=missing" label="Missing" />
            <FilterLink active={coverageState === "in_review"} href="/atlas-v1?coverage_state=in_review" label="In review" />
            <FilterLink active={coverageState === "covered"} href="/atlas-v1?coverage_state=covered" label="Covered" />
          </div>

          {coverage.error ? (
            <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">{coverage.error}</p>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-4">
                <Metric label="Total" value={String(coverage.data?.summary.total ?? 0)} />
                <Metric label="Missing" value={String(coverage.data?.summary.missing ?? 0)} />
                <Metric label="Review" value={String(coverage.data?.summary.in_review ?? 0)} />
                <Metric label="Covered" value={String(coverage.data?.summary.covered ?? 0)} />
              </div>

              <div className="mt-5 overflow-x-auto border border-zinc-300 bg-white">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-zinc-950 text-white">
                    <tr className="font-mono text-[11px] uppercase tracking-wide">
                      <th className="px-3 py-2">Code</th>
                      <th className="px-3 py-2">Outline text</th>
                      <th className="px-3 py-2">Subject</th>
                      <th className="px-3 py-2">Subtopic</th>
                      <th className="px-3 py-2 text-right">Included</th>
                      <th className="px-3 py-2 text-right">Review</th>
                      <th className="px-3 py-2">State</th>
                      <th className="px-3 py-2">Last included</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node) => (
                      <tr
                        key={node.code}
                        className={`border-b border-zinc-200 ${node.code === selectedCode ? "bg-amber-50" : "bg-white"}`}
                      >
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-xs font-semibold">
                          <Link
                            href={pathFor({
                              coverage_state: coverageState,
                              outline_code: node.code,
                              question_status: questionStatus,
                            })}
                            className="underline-offset-4 hover:underline"
                          >
                            {node.code}
                          </Link>
                        </td>
                        <td className="min-w-[240px] px-3 py-2 font-serif text-[15px]">{node.outline_text}</td>
                        <td className="whitespace-nowrap px-3 py-2">{node.subject_display}</td>
                        <td className="min-w-[220px] px-3 py-2 text-zinc-700">{node.subtopic}</td>
                        <td className="px-3 py-2 text-right font-mono">{node.included_count}</td>
                        <td className="px-3 py-2 text-right font-mono">{node.review_count}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex rounded-md border px-2 py-1 font-mono text-[10px] uppercase ${stateClass(node.coverage_state)}`}>
                            {stateLabel(node.coverage_state)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-zinc-600">{formatDate(node.last_included_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <aside className="min-w-0 space-y-5">
          {selected ? (
            <>
              <section className="rounded-md border border-zinc-300 bg-white p-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
                  Selected outline
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold">{selected.display_label}</h2>
                <p className="mt-2 text-sm text-zinc-600">{selected.subject_display} / {selected.subtopic}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SideLink
                    active={questionStatus === "review"}
                    href={pathFor({ coverage_state: coverageState, outline_code: selected.code, question_status: "review" })}
                    label="Review"
                  />
                  <SideLink
                    active={questionStatus === "included"}
                    href={pathFor({ coverage_state: coverageState, outline_code: selected.code, question_status: "included" })}
                    label="View included"
                  />
                  <SideLink
                    active={questionStatus === "rejected"}
                    href={pathFor({ coverage_state: coverageState, outline_code: selected.code, question_status: "rejected" })}
                    label="Rejected"
                  />
                  <SideLink
                    active={questionStatus === "retired"}
                    href={pathFor({ coverage_state: coverageState, outline_code: selected.code, question_status: "retired" })}
                    label="Retired"
                  />
                </div>
              </section>

              <QuestionList
                outlineCode={selected.code}
                status={questionStatus}
                questions={questions.data?.items ?? []}
                error={questions.error}
              />

              <IntakeForm node={selected} />
            </>
          ) : (
            <section className="rounded-md border border-zinc-300 bg-white p-4 text-sm text-zinc-600">
              No outline code is available from Atlas_v1.
            </section>
          )}
        </aside>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-300 bg-white p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1 font-serif text-3xl font-semibold">{value}</p>
    </div>
  );
}

function FilterLink({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-md border px-3 py-2 font-mono text-xs uppercase tracking-wide ${
        active ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {label}
    </Link>
  );
}

function SideLink({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-md border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
        active ? "border-red-700 bg-red-700 text-white" : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {label}
    </Link>
  );
}

function QuestionList({
  outlineCode,
  status,
  questions,
  error,
}: {
  outlineCode: string;
  status: QuestionStatus;
  questions: QuestionListItem[];
  error: string | null;
}) {
  return (
    <section className="rounded-md border border-zinc-300 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl font-semibold">{status[0].toUpperCase() + status.slice(1)} questions</h3>
        <span className="font-mono text-xs text-zinc-500">{questions.length}</span>
      </div>
      {error ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>
      ) : questions.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">No {status} questions for {outlineCode}.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {questions.map((question) => (
            <article key={question.question_id} className="rounded-md border border-zinc-200 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs font-semibold text-zinc-800">{question.question_id}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-700">{clip(question.stem)}</p>
                </div>
                <Link
                  href={`/atlas-v1/questions/${encodeURIComponent(question.question_id)}/answer`}
                  className="rounded-md border border-zinc-300 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-zinc-700 hover:bg-zinc-100"
                >
                  Answer
                </Link>
              </div>
              <p className="mt-2 border-l-2 border-red-700 pl-2 text-sm italic text-zinc-800">{clip(question.call_text, 90)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {status !== "included" && (
                  <StatusForm questionId={question.question_id} outlineCode={outlineCode} status="included" label="Include" />
                )}
                {status !== "rejected" && (
                  <StatusForm questionId={question.question_id} outlineCode={outlineCode} status="rejected" label="Reject" />
                )}
                {status !== "retired" && (
                  <StatusForm questionId={question.question_id} outlineCode={outlineCode} status="retired" label="Retire" />
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function StatusForm({
  questionId,
  outlineCode,
  status,
  label,
}: {
  questionId: string;
  outlineCode: string;
  status: QuestionStatus;
  label: string;
}) {
  return (
    <form action={updateAtlasQuestionStatus}>
      <input type="hidden" name="question_id" value={questionId} />
      <input type="hidden" name="outline_code" value={outlineCode} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="included_by" value="founder" />
      <button
        type="submit"
        className="rounded-md border border-zinc-300 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-zinc-700 hover:bg-zinc-100"
      >
        {label}
      </button>
    </form>
  );
}

function IntakeForm({ node }: { node: AtlasNode }) {
  return (
    <section className="rounded-md border border-zinc-300 bg-white p-4">
      <h3 className="font-serif text-xl font-semibold">Add question</h3>
      <form action={submitAtlasQuestion} className="mt-4 space-y-3">
        <input type="hidden" name="outline_code" value={node.code} />
        <TextInput name="question_id" label="Question ID" placeholder="CQ16034 or Atlas ID" />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">Status</span>
            <select name="status" defaultValue="review" className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm">
              <option value="review">Review</option>
              <option value="included">Included</option>
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">Correct</span>
            <select name="correct_answer" defaultValue="A" className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </label>
        </div>
        <TextArea name="stem" label="Stem" rows={4} />
        <TextArea name="call_text" label="Call" rows={2} />
        <TextArea name="answer_a" label="Answer A" rows={2} />
        <TextArea name="answer_b" label="Answer B" rows={2} />
        <TextArea name="answer_c" label="Answer C" rows={2} />
        <TextArea name="answer_d" label="Answer D" rows={2} />
        <TextArea name="minimum_explanation" label="Minimum explanation" rows={3} />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput name="source_label" label="Source label" placeholder="FOC Finished" />
          <TextInput name="source_ref" label="Source ref" placeholder="C:\\FOC\\Workspace\\Finished\\CQ16034.md" />
        </div>
        <TextArea name="case_study_json" label="Case-study JSON" rows={4} />
        <input type="hidden" name="included_by" value="founder" />
        <button type="submit" className="w-full rounded-md bg-red-700 px-4 py-3 font-mono text-xs uppercase tracking-wide text-white hover:bg-red-800">
          Submit question
        </button>
      </form>
    </section>
  );
}

function TextInput({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-700"
      />
    </label>
  );
}

function TextArea({ name, label, rows }: { name: string; label: string; rows: number }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{label}</span>
      <textarea
        name={name}
        rows={rows}
        className="mt-1 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-700"
      />
    </label>
  );
}
