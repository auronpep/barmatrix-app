"use client";

import { useState } from "react";
import { api, type TensionQuestionSummary } from "@/lib/api-client";

interface TensionQuestionsClientProps {
  slug: string;
  initialCount: number;
  totalCount: number;
  initialPage: number;
  pageSize: number;
}

export function TensionQuestionsClient({
  slug,
  initialCount,
  totalCount,
  initialPage,
  pageSize,
}: TensionQuestionsClientProps) {
  const [questions, setQuestions] = useState<TensionQuestionSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage + 1);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const result = await api.getTensionQuestions(slug, {
        page: currentPage,
        limit: pageSize,
      });
      setQuestions((prev) => [...prev, ...result.questions]);
      setCurrentPage(result.page + 1);
    } catch (err) {
      console.error("Failed to load more questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (initialCount >= totalCount) {
    return null;
  }

  const displayedTotal = initialCount + questions.length;
  const hasMore = displayedTotal < totalCount;

  return (
    <div className="mt-6">
      {questions.length > 0 && (
        <ul className="space-y-3">
          {questions.map((question) => (
            <li key={question.question_id}>
              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  {question.external_id ?? "—"} · {question.subject}
                  {question.subtopic ? ` · ${question.subtopic}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="mt-6 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          {isLoading ? "Loading..." : `Load more (${displayedTotal}/${totalCount})`}
        </button>
      )}
    </div>
  );
}
