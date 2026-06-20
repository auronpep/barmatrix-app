"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import QuestionRunner from "@/components/question-runner";

export default function AtlasQuestionPracticePage() {
  const params = useParams<{ id: string | string[] }>();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const questionId = id ?? "";
  const answerHref = `/atlas/questions/${encodeURIComponent(questionId)}/answer`;

  if (!questionId) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] px-4 py-8 text-zinc-950 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-lg border border-zinc-950/10 bg-white p-6">
          <p className="text-sm leading-6 text-zinc-700">Question unavailable.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-8 text-zinc-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/atlas"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-600 underline underline-offset-4 hover:text-zinc-950"
          >
            Outline Atlas
          </Link>
          <Link
            href={answerHref}
            className="rounded-md border border-zinc-950/15 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700 hover:border-zinc-950"
          >
            Answer debrief
          </Link>
        </div>
        <QuestionRunner
          questionIds={[questionId]}
          setId={`atlas:${questionId}`}
          title="Atlas question"
          completeLabel="Review answer debrief"
          onComplete={() => router.push(answerHref)}
        />
      </div>
    </main>
  );
}
