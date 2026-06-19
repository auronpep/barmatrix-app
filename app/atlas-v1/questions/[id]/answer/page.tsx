import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Atlas v1 Answer",
};

export const dynamic = "force-dynamic";

interface AtlasAnswer {
  question: {
    question_id: string;
    outline_code: string;
    outline_text: string;
    subject_display: string;
    subtopic: string;
    stem: string;
    call_text: string;
    choices: Record<"A" | "B" | "C" | "D", string>;
    correct_answer: string;
    minimum_explanation: string;
  };
  case_study_modules: Record<string, unknown>;
}

type LoadResult<T> = { data: T; error: null } | { data: null; error: string };

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "https://api.barmatrix.app";
}

async function loadAnswer(id: string): Promise<LoadResult<AtlasAnswer>> {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return { data: null, error: "ADMIN_SECRET is not configured for Atlas_v1." };

  const response = await fetch(`${apiBase()}/api/admin/atlas-v1/questions/${encodeURIComponent(id)}/answer`, {
    cache: "no-store",
    headers: { "x-admin-secret": secret },
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
  return { data: (await response.json()) as AtlasAnswer, error: null };
}

function titleForModule(key: string): string {
  return key
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function AtlasV1AnswerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const answer = await loadAnswer(id);

  if (answer.error) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-zinc-950">
        <div className="mx-auto max-w-4xl">
          <Link href="/atlas-v1" className="font-mono text-xs uppercase tracking-wide text-zinc-600 underline">
            Atlas_v1
          </Link>
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">{answer.error}</p>
        </div>
      </div>
    );
  }

  const data = answer.data;
  if (!data) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-zinc-950">
        <div className="mx-auto max-w-4xl">
          <Link href="/atlas-v1" className="font-mono text-xs uppercase tracking-wide text-zinc-600 underline">
            Atlas_v1
          </Link>
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">Atlas_v1 answer was not returned.</p>
        </div>
      </div>
    );
  }
  const modules = Object.entries(data.case_study_modules);

  return (
    <div className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-zinc-950">
      <article className="mx-auto max-w-4xl">
        <Link href={`/atlas-v1?outline_code=${encodeURIComponent(data.question.outline_code)}`} className="font-mono text-xs uppercase tracking-wide text-zinc-600 underline">
          Atlas_v1
        </Link>
        <header className="mt-4 border-b-4 border-zinc-950 bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-red-700">{data.question.question_id}</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">{data.question.outline_code} - {data.question.outline_text}</h1>
          <p className="mt-2 text-sm text-zinc-600">{data.question.subject_display} / {data.question.subtopic}</p>
        </header>

        <section className="border-x border-b border-zinc-300 bg-white p-6">
          <h2 className="font-serif text-2xl font-semibold">Question</h2>
          <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">{data.question.stem}</p>
          <p className="mt-4 border-l-4 border-red-700 pl-4 font-serif text-lg italic">{data.question.call_text}</p>
          <div className="mt-6 grid gap-3">
            {(["A", "B", "C", "D"] as const).map((letter) => (
              <div key={letter} className={`rounded-md border p-3 ${letter === data.question.correct_answer ? "border-green-700 bg-green-50" : "border-zinc-200 bg-white"}`}>
                <span className="mr-2 font-mono text-xs font-semibold">{letter}</span>
                <span className="text-sm text-zinc-800">{data.question.choices[letter]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-md border border-zinc-300 bg-white p-6">
          <h2 className="font-serif text-2xl font-semibold">Answer</h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-wide text-green-700">Correct answer: {data.question.correct_answer}</p>
          <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">{data.question.minimum_explanation}</p>
        </section>

        {modules.map(([key, value]) => (
          <section key={key} className="mt-5 rounded-md border border-zinc-300 bg-white p-6">
            <h2 className="font-serif text-2xl font-semibold">{titleForModule(key)}</h2>
            <pre className="mt-4 max-h-[480px] overflow-auto rounded-md bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
              {JSON.stringify(value, null, 2)}
            </pre>
          </section>
        ))}
      </article>
    </div>
  );
}
