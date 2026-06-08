"use client";

import Link from "next/link";
import type { PathPublicStep } from "@/lib/api-client";

// The one prescribed task. No menu — a single action. Inline kinds (reads,
// reflections, celebrations) complete in place via onInlineComplete; external
// kinds navigate to their surface. For a foundations lesson the completion
// happens off-page, so we drop a one-shot claim marker that PathSurface uses to
// grant XP when the student returns.

const CLAIM_KEY = "bm_path_claim";

function setClaim(stepId: string): void {
  try {
    sessionStorage.setItem(CLAIM_KEY, stepId);
  } catch {
    /* sessionStorage unavailable — XP claim is best-effort */
  }
}

function actionLabel(step: PathPublicStep): string {
  switch (step.kind) {
    case "foundations_lesson":
      return "Start the lesson →";
    case "flashcard_deck":
      return "Open the cards →";
    case "doctrinal_lesson":
      return "Read it →";
    case "quiz_set":
      return "Start the set →";
    case "celebrate":
      return "Keep going →";
    default:
      return "Got it →";
  }
}

function hrefFor(step: PathPublicStep): string | null {
  switch (step.target.kind) {
    case "route":
      return step.target.href;
    case "flashcard":
      return `/flashcards/${encodeURIComponent(step.target.deck_id)}?step=${encodeURIComponent(step.id)}`;
    case "doctrinal":
      return `/study/doctrinal/${encodeURIComponent(step.target.slug)}?step=${encodeURIComponent(step.id)}`;
    case "quiz":
      // Curated quiz sets are founder-gated (empty until hand-picked IDs land), so
      // this never renders at launch. Placeholder until the path-quiz runner ships.
      return `/practice`;
    default:
      return null;
  }
}

export default function NextStepCard({
  step,
  busy,
  onInlineComplete,
}: {
  step: PathPublicStep;
  busy: boolean;
  onInlineComplete: (stepId: string) => void;
}) {
  const isInline = step.target.kind === "inline";
  const href = hrefFor(step);

  return (
    <section
      className="border-2 border-zinc-900 bg-zinc-950 p-6 text-white sm:p-8"
      aria-labelledby="next-task"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-red-300">
          {step.source === "backlog" ? "Catch-up" : "Your next task"}
        </p>
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
          +{step.xp} XP
        </span>
      </div>

      {step.is_fallback && (
        <p className="mt-3 inline-block border border-amber-400/40 bg-amber-400/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-200">
          Let&apos;s try a different one
        </p>
      )}

      <h2
        id="next-task"
        className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
      >
        {step.title}
      </h2>
      <p className="mt-4 text-base leading-7 text-zinc-200">{step.microcopy}</p>

      <div className="mt-6">
        {isInline ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onInlineComplete(step.id)}
            className="rounded-md bg-red-700 px-6 py-3 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {busy ? "Saving…" : actionLabel(step)}
          </button>
        ) : href ? (
          <Link
            href={href}
            onClick={() => {
              if (step.target.kind === "route") setClaim(step.id);
            }}
            className="inline-block rounded-md bg-red-700 px-6 py-3 text-sm font-medium text-white hover:bg-red-600"
          >
            {actionLabel(step)}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
