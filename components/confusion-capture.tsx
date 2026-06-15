"use client";

// Confusion-Capture — the per-choice "knew it was wrong / was deciding between"
// tagger. Pure + controlled: it owns no fetching and no attempt state, so it
// renders identically in the pre-submit step (before grading) and the
// retrospective answer-page edit. Emits STABLE choice_ids (each QuestionChoice
// already carries choice_id), never letters, because answer order can be
// shuffled per session. See lib/confusion (api) for the server side.

import type { Letter, QuestionChoice } from "@/lib/api-client";

export type ConfusionBucket = "eliminated" | "deciding_between";

export interface ConfusionValue {
  eliminated: string[]; // choice_ids
  decidingBetween: string[]; // choice_ids
}

export const EMPTY_CONFUSION: ConfusionValue = {
  eliminated: [],
  decidingBetween: [],
};

// ---- pure helpers (exported for unit tests) ----

/** Which bucket a choice is in, or null. */
export function bucketOf(
  value: ConfusionValue,
  choiceId: string,
): ConfusionBucket | null {
  if (value.eliminated.includes(choiceId)) return "eliminated";
  if (value.decidingBetween.includes(choiceId)) return "deciding_between";
  return null;
}

/** Set or clear a choice's bucket, enforcing disjointness (a choice is only ever
 *  in one bucket). Returns a NEW value (immutable). */
export function setChoiceBucket(
  value: ConfusionValue,
  choiceId: string,
  bucket: ConfusionBucket | null,
): ConfusionValue {
  const eliminated = value.eliminated.filter((id) => id !== choiceId);
  const decidingBetween = value.decidingBetween.filter((id) => id !== choiceId);
  if (bucket === "eliminated") eliminated.push(choiceId);
  else if (bucket === "deciding_between") decidingBetween.push(choiceId);
  return { eliminated, decidingBetween };
}

/** Toggle: clicking the active bucket clears it; otherwise switches to it. */
export function toggleChoiceBucket(
  value: ConfusionValue,
  choiceId: string,
  bucket: ConfusionBucket,
): ConfusionValue {
  const current = bucketOf(value, choiceId);
  return setChoiceBucket(value, choiceId, current === bucket ? null : bucket);
}

export function hasAnyConfusion(value: ConfusionValue): boolean {
  return value.eliminated.length > 0 || value.decidingBetween.length > 0;
}

// ---- component ----

interface ConfusionCaptureProps {
  choices: QuestionChoice[];
  value: ConfusionValue;
  onChange: (next: ConfusionValue) => void;
  mode: "pre_submit" | "retrospective";
  selectedLetter?: Letter | null;
  correctLetter?: Letter | null;
  disabled?: boolean;
}

export default function ConfusionCapture({
  choices,
  value,
  onChange,
  mode,
  selectedLetter = null,
  correctLetter = null,
  disabled = false,
}: ConfusionCaptureProps) {
  const heading =
    mode === "pre_submit"
      ? "Before you submit — mark the others (optional)"
      : "Which others did you rule out, and which were you torn between?";

  return (
    <div className="mt-6 rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {heading}
      </p>
      <ul className="mt-3 space-y-2">
        {choices.map((choice) => {
          const current = bucketOf(value, choice.choice_id);
          const isSelected = selectedLetter === choice.letter;
          const isCorrect = correctLetter === choice.letter;
          return (
            <li
              key={choice.choice_id}
              className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="min-w-0 text-sm text-zinc-800">
                <span className="font-mono font-semibold">{choice.letter}.</span>{" "}
                <span className="line-clamp-2">{choice.choice_text}</span>
                {mode === "retrospective" && isCorrect && (
                  <span className="ml-2 font-mono text-[10px] uppercase text-emerald-700">
                    key
                  </span>
                )}
                {isSelected && (
                  <span className="ml-2 font-mono text-[10px] uppercase text-zinc-500">
                    your pick
                  </span>
                )}
              </span>
              <span className="flex shrink-0 gap-2">
                <BucketToggle
                  label="Knew it was wrong"
                  active={current === "eliminated"}
                  activeClass="border-zinc-900 bg-zinc-900 text-white"
                  disabled={disabled}
                  onClick={() =>
                    onChange(
                      toggleChoiceBucket(value, choice.choice_id, "eliminated"),
                    )
                  }
                />
                <BucketToggle
                  label="Was torn"
                  active={current === "deciding_between"}
                  activeClass="border-amber-600 bg-amber-500 text-white"
                  disabled={disabled}
                  onClick={() =>
                    onChange(
                      toggleChoiceBucket(
                        value,
                        choice.choice_id,
                        "deciding_between",
                      ),
                    )
                  }
                />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BucketToggle({
  label,
  active,
  activeClass,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wide transition disabled:opacity-50 ${
        active
          ? activeClass
          : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500"
      }`}
    >
      {label}
    </button>
  );
}
