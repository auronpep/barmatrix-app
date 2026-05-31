"use client";

import Link from "next/link";
import type {
  FoundationsLessonOutline,
  FoundationsLessonStatus,
  FoundationsOutline,
} from "@/lib/api-client";
import { useFoundations } from "@/lib/use-foundations";

const STATUS_LABEL: Record<FoundationsLessonStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

const STATUS_CLASS: Record<FoundationsLessonStatus, string> = {
  not_started: "border-zinc-300 text-zinc-600",
  in_progress: "border-amber-700 text-amber-800",
  completed: "border-emerald-700 text-emerald-800",
};

export default function FoundationsPage() {
  const { loading, signedIn, data, error } = useFoundations();

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-mono text-sm text-zinc-500">Loading the course…</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-serif text-3xl font-semibold text-zinc-950">The Method</h1>
        <p className="mt-4 border border-amber-300 bg-amber-50 p-4 font-mono text-sm text-amber-900">
          Couldn&apos;t load the course{error ? `: ${error}` : ""}. Refresh to try again.
        </p>
      </section>
    );
  }

  const progress = data.progress;
  const resumeSlug = progress.next_slug ?? data.lessons[0]?.slug ?? "lesson-01";
  const resumeLabel = progress.complete
    ? "Review the course"
    : progress.lessons_completed > 0
      ? "Resume the course"
      : "Start Lesson 1";

  return (
    <section className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      <div className="border-b border-zinc-900 pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Start Here — The Method
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
          {data.title}: {data.subtitle}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
          {data.tagline}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href={`/foundations/${resumeSlug}`}
            className="rounded-md bg-zinc-950 px-6 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            {resumeLabel} <span aria-hidden>→</span>
          </Link>
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-600">
            {data.lesson_count} lessons · {data.drill_item_count} drills · ~
            {Math.round(data.est_total_minutes / 60)} hrs
          </span>
        </div>
      </div>

      <ProgressBar data={data} />

      {!signedIn && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-5">
          <p className="text-sm leading-6 text-zinc-800">
            Sign in to save your progress and unlock your Red-Zone Map as you go.
          </p>
          <Link
            href="/sign-in"
            className="rounded-md bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Sign in
          </Link>
        </div>
      )}

      <div className="mt-10 space-y-10">
        {data.parts.map((part) => {
          const lessons = data.lessons.filter((l) => part.lesson_numbers.includes(l.number));
          return (
            <div key={part.roman}>
              <h2 className="border-b border-zinc-300 pb-3 font-mono text-xs uppercase tracking-wider text-zinc-700">
                Part {part.roman} — {part.title}
              </h2>
              <div className="mt-5 grid gap-4">
                {lessons.map((lesson) => (
                  <LessonRow key={lesson.slug} lesson={lesson} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProgressBar({ data }: { data: FoundationsOutline }) {
  const p = data.progress;
  return (
    <section className="mt-8 border border-zinc-300 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
          Course progress
        </p>
        <span className="font-mono text-sm font-semibold text-red-700">
          {p.lessons_completed}/{p.lesson_count} lessons · {p.percent}%
        </span>
      </div>
      <div className="mt-4 h-3 w-full overflow-hidden border border-zinc-900 bg-zinc-100">
        <div
          className="h-full bg-red-700"
          style={{ width: `${p.percent}%` }}
          aria-hidden
        />
      </div>
      {p.complete && (
        <p className="mt-4 border border-emerald-300 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
          You&apos;ve completed The Method. The whole platform — drills, red zones,
          boot camps — now runs on the frame you just learned.
        </p>
      )}
    </section>
  );
}

function LessonRow({ lesson }: { lesson: FoundationsLessonOutline }) {
  return (
    <Link
      href={`/foundations/${lesson.slug}`}
      className="group flex flex-wrap items-start justify-between gap-4 border border-zinc-300 bg-white p-5 hover:border-zinc-900"
    >
      <div className="flex items-start gap-4">
        <span className="mt-0.5 font-serif text-3xl font-semibold leading-none text-zinc-300 group-hover:text-red-700">
          {String(lesson.number).padStart(2, "0")}
        </span>
        <div>
          <h3 className="font-serif text-xl font-semibold leading-tight text-zinc-950">
            {lesson.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-700">
            {lesson.objective}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            ~{lesson.est_minutes} min · {lesson.drill_count} drills
            {lesson.drills_completed > 0
              ? ` · ${lesson.drills_completed} self-checked`
              : ""}
          </p>
        </div>
      </div>
      <span
        className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_CLASS[lesson.status]}`}
      >
        {STATUS_LABEL[lesson.status]}
      </span>
    </Link>
  );
}
