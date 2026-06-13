"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  api,
  ApiClientError,
  type DoctrinalLessonResponse,
} from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { Markdown } from "@/lib/markdown";

// Doctrinal lesson reader (J7 item 4). If the dedicated endpoint is unavailable,
// route the learner to the live Method lesson for the same slug instead of
// dead-ending the paid path.
export default function DoctrinalLessonPage() {
  const params = useParams<{ slug: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useClerkAuth();

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? (params.slug[0] ?? "")
        : "";
  const stepId = search.get("step");

  const [lesson, setLesson] = useState<DoctrinalLessonResponse | null>(null);
  const [methodFallback, setMethodFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLesson(null);
      setMethodFallback(false);
      setError(null);
    });
    void (async () => {
      try {
        const l = await api.getDoctrinalLesson(slug);
        if (!cancelled) setLesson(l);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 503) {
          setMethodFallback(true);
          return;
        }
        setError(
          "Couldn't load this lesson. Return to your path and try the next task.",
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function markComplete() {
    setSaving(true);
    setFinishError(null);
    try {
      if (!isLoaded) {
        setFinishError("Checking sign-in. Try again in a moment.");
        return;
      }
      if (stepId && !isSignedIn) {
        setFinishError("Sign in again to save this step.");
        return;
      }
      if (isSignedIn && stepId) {
        const token = await getToken();
        if (!token) {
          setFinishError("Sign in again to save this step.");
          return;
        }
        await api.completeMyDayPlanStep(token, stepId);
      }
      router.push("/dashboard/path");
    } catch {
      setFinishError("We couldn't save that step. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (methodFallback) {
    return (
      <Wrap>
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Method lesson
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
          Use the live Method lesson.
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-700">
          This path step is routed to the matching Method module, so you can keep
          moving without waiting on a separate lesson endpoint.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/foundations/${slug}`}
            className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
          >
            Open Method lesson →
          </Link>
          <button
            type="button"
            onClick={markComplete}
            disabled={saving}
            className="rounded-md border border-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Mark complete and return"}
          </button>
          {finishError && (
            <p className="basis-full text-sm text-red-700" role="alert">
              {finishError}
            </p>
          )}
        </div>
      </Wrap>
    );
  }
  if (error) {
    return (
      <Wrap>
        <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">{error}</p>
      </Wrap>
    );
  }
  if (!lesson) {
    return (
      <Wrap>
        <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">Loading…</p>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <header className="border-b border-zinc-200 pb-5">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          {lesson.subject} · {lesson.estimated_minutes} min
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-zinc-950">
          {lesson.title}
        </h1>
      </header>

      <article className="mt-6">
        <Markdown text={lesson.body_md} />
      </article>

      <div className="mt-8 border-t border-zinc-200 pt-6">
        <button
          type="button"
          onClick={markComplete}
          disabled={saving}
          className="rounded-md bg-red-700 px-6 py-3 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Mark complete →"}
        </button>
        {finishError && (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {finishError}
          </p>
        )}
      </div>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-3xl px-6 py-10 sm:py-14">{children}</section>;
}
