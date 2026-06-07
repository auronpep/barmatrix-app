"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  api,
  ApiClientError,
  type FoundationsDrill,
  type FoundationsLessonResponse,
} from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { Markdown } from "@/lib/markdown";
import { userFacingResourceError } from "@/lib/user-facing-errors";
import { AnchorCard } from "@/components/anchor-card";
import {
  C3DrillRunner,
  C3ReviewSummary,
  type C3GradeLogEntry,
} from "./c3-drill-runner";

export default function FoundationsLessonPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();

  const [resp, setResp] = useState<FoundationsLessonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  // Bearer token for attributing interactive drill attempts (null = anonymous).
  const [token, setToken] = useState<string | null>(null);
  // Accumulated grade results across the lesson's interactive drills.
  const [gradeLog, setGradeLog] = useState<C3GradeLogEntry[]>([]);
  // One-at-a-time drill sequencing: index into lesson.drills for the
  // CURRENT drill the student should work. Advances only after completion.
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);

  // Load public lesson content for everyone.
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setResp(null);
      setError(null);
    });
    api.getFoundationsLesson(slug).then(
      (data) => {
        if (!cancelled) setResp(data);
      },
      (err) => {
        if (!cancelled) {
          setError(
            userFacingResourceError(err, {
              notFound: "This lesson could not be found.",
              unavailable: "This lesson is temporarily unavailable.",
            }),
          );
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Seed real progress for signed-in students from the authed outline.
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !slug) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        if (!cancelled) setToken(token);
        const outline = await api.getMyFoundations(token);
        const entry = outline.lessons.find((l) => l.slug === slug);
        if (!cancelled && entry) setCompleted(entry.status === "completed");
        // Per-drill self-checks are seeded from the lesson endpoint's progress when
        // present; the outline only carries the count, so we leave drill checkboxes
        // to this session unless the lesson endpoint returned them.
      } catch {
        // Non-fatal: progress display falls back to local session state.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, slug]);

  // Seed drill checks + completion from the lesson endpoint's own progress block.
  useEffect(() => {
    if (!resp) return;
    queueMicrotask(() => {
      setChecked(new Set(resp.progress.drills_completed));
      setCompleted(resp.progress.status === "completed");
    });
  }, [resp]);

  const persist = useCallback(
    async (drills: string[], markComplete: boolean) => {
      if (!isSignedIn) {
        setSaveNote("Sign in to save your progress.");
        return;
      }
      setSaving(true);
      setSaveNote(null);
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const result = await api.markFoundationsLesson(token, slug, {
          completed: markComplete,
          drills_completed: drills,
        });
        setSaveNote(
          result.persisted ? "Progress saved." : "Saved locally (sync pending).",
        );
        return result;
      } catch (err) {
        setSaveNote(
          err instanceof ApiClientError ? "Save failed. Try again." : "Save failed.",
        );
      } finally {
        setSaving(false);
      }
    },
    [getToken, isSignedIn, slug],
  );

  const toggleDrill = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const wasChecked = prev.has(id);
        const next = new Set(prev);
        if (wasChecked) next.delete(id);
        else next.add(id);
        if (isSignedIn) void persist([...next], completed);
        // When checking (not unchecking) a self-check drill, advance the sequencer.
        if (!wasChecked) {
          setCurrentDrillIndex((i) => i + 1);
        }
        return next;
      });
    },
    [persist, isSignedIn, completed],
  );

  // Interactive drill finished → mark it complete (add-only), persist, and
  // advance the one-at-a-time sequencer to the next drill.
  const markDrillComplete = useCallback(
    (id: string) => {
      setChecked((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        if (isSignedIn) void persist([...next], completed);
        return next;
      });
      // Advance sequencer so the next drill becomes visible.
      setCurrentDrillIndex((i) => i + 1);
    },
    [persist, isSignedIn, completed],
  );

  const onItemGraded = useCallback((entry: C3GradeLogEntry) => {
    setGradeLog((prev) => [...prev, entry]);
  }, []);

  const onComplete = useCallback(async () => {
    setCompleted(true);
    const result = await persist([...checked], true);
    if (result && resp?.next_slug) {
      router.push(`/foundations/${resp.next_slug}`);
    }
  }, [persist, checked, resp, router]);

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/foundations" className="font-mono text-xs text-zinc-500 hover:text-zinc-900">
          ← The Method
        </Link>
        <p className="mt-6 border border-amber-300 bg-amber-50 p-4 font-mono text-sm text-amber-900">
          Couldn&apos;t load this lesson: {error}
        </p>
      </section>
    );
  }

  if (!resp) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-sm text-zinc-500">Loading the lesson…</p>
      </section>
    );
  }

  const { lesson } = resp;
  const hasInteractiveDrills = lesson.drills.some((d) => d.graded_items?.length);

  // Gate the "Mark lesson complete" button: every interactive drill must be
  // finished before the student can mark the lesson done.
  const interactiveDrillIds = lesson.drills
    .filter((d) => d.graded_items?.length)
    .map((d) => d.id);
  const allDrillsDone =
    interactiveDrillIds.length === 0 ||
    interactiveDrillIds.every((id) => checked.has(id));

  return (
    <article className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <div className="flex min-h-[44px] flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-zinc-200 pb-4">
        <Link href="/foundations" className="font-mono text-xs text-zinc-500 hover:text-zinc-900">
          ← The Method
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Part {lesson.part} · Lesson {lesson.number} of 14 · ~{lesson.est_minutes} min
        </span>
      </div>

      <header className="mt-6">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          {lesson.part_title}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-4 border-l-2 border-red-700 bg-zinc-50 py-3 pl-4 text-base leading-7 text-zinc-800">
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Objective
          </span>
          <br />
          {lesson.objective}
        </p>
      </header>

      <div className="mt-8">
        <Markdown text={lesson.body_md} />
      </div>

      <section className="mt-12 border-t-2 border-zinc-900 pt-8">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-zinc-950">
          Drills
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {hasInteractiveDrills
            ? "Two filters. Three statuses. Name the break. Classify each item, then read why the filter broke — you can't pass by revealing a key."
            : "Work each drill cold, then reveal the key and say the missed filter aloud — the verbalization is the training. Check off each drill once you've self-marked it."}
        </p>

        {/* One-at-a-time sequencer with progression indicator */}
        {lesson.drills.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            <span>
              Drill {Math.min(currentDrillIndex + 1, lesson.drills.length)} of{" "}
              {lesson.drills.length}
            </span>
            <div className="flex gap-1.5" aria-hidden="true">
              {lesson.drills.map((d, i) => (
                <span
                  key={d.id}
                  className={`inline-block h-1.5 w-5 rounded-full ${
                    i < currentDrillIndex
                      ? "bg-emerald-600"
                      : i === currentDrillIndex
                        ? "bg-red-700"
                        : "bg-zinc-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {lesson.drills.map((drill, i) => {
            // Only show drills up to and including the current index.
            if (i > currentDrillIndex) return null;
            return drill.graded_items?.length ? (
              <C3DrillRunner
                key={drill.id}
                slug={slug}
                drill={drill}
                token={token}
                onItemGraded={onItemGraded}
                onDrillComplete={markDrillComplete}
              />
            ) : (
              <DrillCard
                key={drill.id}
                drill={drill}
                checked={checked.has(drill.id)}
                onToggle={() => toggleDrill(drill.id)}
              />
            );
          })}
        </div>
      </section>

      {gradeLog.length > 0 && <C3ReviewSummary log={gradeLog} />}

      {gradeLog.length > 0 && (
        <AnchorCard
          anchor={{
            id: `lesson-${lesson.number}`,
            title: `Lesson ${lesson.number} · ${lesson.title}`,
            rule: lesson.objective,
            prompt: null,
            source_tag: "foundations",
            subject: "The Method",
          }}
        />
      )}

      {lesson.how_to_use_md && (
        <section className="mt-10 border border-zinc-200 bg-zinc-50 p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            How to use this pack
          </p>
          <div className="mt-3">
            <Markdown text={lesson.how_to_use_md} />
          </div>
        </section>
      )}

      <section className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-300 pt-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onComplete}
            disabled={saving || (!completed && !allDrillsDone)}
            title={!completed && !allDrillsDone ? "Complete the drills first" : undefined}
            className={`rounded-md px-6 py-3 text-sm font-medium ${
              completed
                ? "border border-emerald-700 text-emerald-800"
                : "bg-red-700 text-white hover:bg-red-900"
            } disabled:opacity-50`}
          >
            {completed ? "Completed ✓ — review again" : "Mark lesson complete"}
            {resp.next_slug && !completed ? " & continue →" : ""}
          </button>
          {!completed && !allDrillsDone && (
            <span className="font-mono text-[11px] text-zinc-500">
              Complete the drills first
            </span>
          )}
          {saveNote && (
            <span className="font-mono text-[11px] text-zinc-500">{saveNote}</span>
          )}
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          {resp.prev_slug ? (
            <Link href={`/foundations/${resp.prev_slug}`} className="text-zinc-600 hover:text-zinc-900">
              ← Previous
            </Link>
          ) : (
            <span className="text-zinc-300">← Previous</span>
          )}
          {resp.next_slug ? (
            <Link href={`/foundations/${resp.next_slug}`} className="text-zinc-600 hover:text-zinc-900">
              Next →
            </Link>
          ) : (
            <span className="text-zinc-300">Next →</span>
          )}
        </div>
      </section>
    </article>
  );
}

function DrillCard({
  drill,
  checked,
  onToggle,
}: {
  drill: FoundationsDrill;
  checked: boolean;
  onToggle: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const title = useMemo(() => `Drill ${drill.id} — ${drill.title}`, [drill]);

  return (
    <div className="border border-zinc-300 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold text-zinc-950">{title}</h3>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            className="h-4 w-4 accent-red-700"
          />
          Self-checked
        </label>
      </div>

      {drill.instructions_md && (
        <div className="mt-2 text-sm italic text-zinc-600">
          <Markdown text={drill.instructions_md} className="space-y-2" />
        </div>
      )}

      <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm leading-6 text-zinc-800">
        {drill.items.map((item, i) => (
          <li key={i}>
            <Markdown text={stripLeadingNumber(item)} className="space-y-1" />
          </li>
        ))}
      </ol>

      <div className="mt-5 border-t border-zinc-200 pt-4">
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="rounded-md border border-zinc-900 px-4 py-2 font-mono text-xs uppercase tracking-wider text-zinc-900 hover:bg-zinc-950 hover:text-white"
        >
          {revealed ? "Hide key" : "Reveal key"}
        </button>
        {revealed && (
          <div className="mt-4 border-l-2 border-emerald-700 bg-emerald-50/40 py-3 pl-4">
            <Markdown text={drill.key_md} className="space-y-2 text-sm leading-6 text-zinc-800" />
          </div>
        )}
      </div>
    </div>
  );
}

// Drill items arrive as "1. <text>"; the <ol> supplies the number, so drop the
// leading "N." to avoid doubled numbering.
function stripLeadingNumber(item: string): string {
  return item.replace(/^\d+\.\s+/, "");
}
