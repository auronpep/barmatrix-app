"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  api,
  ApiClientError,
  type DoctrinalLessonResponse,
} from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { Markdown } from "@/lib/markdown";

// Doctrinal lesson reader (J7 item 4 — attorney-gated). Until DOCTRINAL_APPROVED
// is set on the API, the endpoint returns 503 and this shows an honest "coming
// soon" card. On completion we mark the path step done and return to the path.
export default function DoctrinalLessonPage() {
  const params = useParams<{ slug: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { getToken, isSignedIn } = useClerkAuth();

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? (params.slug[0] ?? "")
        : "";
  const stepId = search.get("step");

  const [lesson, setLesson] = useState<DoctrinalLessonResponse | null>(null);
  const [comingSoon, setComingSoon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    void (async () => {
      try {
        const l = await api.getDoctrinalLesson(slug);
        if (!cancelled) setLesson(l);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 503) {
          setComingSoon(true);
          return;
        }
        setError(
          err instanceof ApiClientError ? `API ${err.status}` : "Couldn't load this lesson.",
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function markComplete() {
    setSaving(true);
    try {
      if (isSignedIn && stepId) {
        const token = await getToken();
        if (token) await api.completePathStep(token, stepId).catch(() => undefined);
      }
      router.push("/dashboard/path");
    } finally {
      setSaving(false);
    }
  }

  if (comingSoon) {
    return (
      <Wrap>
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">Coming soon</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
          This lesson is in final review.
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-700">
          It&apos;ll unlock here shortly. Your path keeps moving in the meantime.
        </p>
        <button
          type="button"
          onClick={() => router.push("/dashboard/path")}
          className="mt-5 rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
        >
          Back to your path →
        </button>
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
      </div>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-3xl px-6 py-10 sm:py-14">{children}</section>;
}
