"use client";

// Redesign V2 preview — the "Repair" verdict screen.
//
// PHASE 1 (presentation only): a static demo of RepairVerdictCard so the founder
// can see the "true and responsive vs. counterfeit" reskin without running a
// live question. The card itself takes the real ForensicsResponse shape, so the
// flip is: render it in components/question-runner.tsx instead of the current
// ForensicsCard. Sample copy below is illustrative, not from the bank.

import { useState } from "react";
import type { AttemptResponse, ForensicsResponse } from "@/lib/api-client";
import { RepairVerdictCard } from "@/components/redesign/repair-verdict-card";
import { SectionLabel } from "@/components/redesign/redesign-chrome";

const COUNTERFEIT_ATTEMPT: AttemptResponse = {
  attempt_id: "preview",
  correct: false,
  correct_answer: "B",
  forensics_url: "",
  red_zone_updates: [],
};

const COUNTERFEIT_FORENSICS: ForensicsResponse = {
  correct: false,
  trap_name: "Revocable is not revoked",
  why_attractive:
    "It states a true rule — an unpaid option leaves the offer revocable — and the rule is real, so it reads as the answer.",
  why_wrong:
    "“Could revoke” is not “did revoke.” The call asks which fact helps the offeree, and a revocable offer that was never actually revoked does not.",
  future_cue:
    "No paid option yet, so it could be revoked. But could revoke is not did revoke — pick the fact the call actually asks for.",
  assigned_drill: { name: "Option vs. offer status — 6 drills", slug: "preview" },
  why_correct: undefined,
  focus_group: { selected_choice_pct: 41, sample_size: 220 },
};

const TRUE_ATTEMPT: AttemptResponse = {
  attempt_id: "preview-2",
  correct: true,
  correct_answer: "B",
  forensics_url: "",
  red_zone_updates: [],
};

const TRUE_FORENSICS: ForensicsResponse = {
  correct: true,
  why_correct:
    "It answers the exact call: the missing notice fact is what makes the acceptance effective before any revocation reached the offeree. That is the fact the question asked for.",
  focus_group: null,
};

export default function RepairPreviewPage() {
  const [view, setView] = useState<"counterfeit" | "true">("counterfeit");

  return (
    <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <SectionLabel>Preview · the repair verdict</SectionLabel>
      <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-zinc-950">
        The Repair screen
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
        A styling preview of the reskinned verdict card. It consumes the real
        <code className="mx-1 bg-zinc-100 px-1">ForensicsResponse</code> shape;
        sample copy below is illustrative.
      </p>

      <div className="mt-6 flex gap-2">
        <Toggle active={view === "counterfeit"} onClick={() => setView("counterfeit")}>
          Counterfeit (miss)
        </Toggle>
        <Toggle active={view === "true"} onClick={() => setView("true")}>
          True &amp; responsive (correct)
        </Toggle>
      </div>

      <div className="mt-8">
        {view === "counterfeit" ? (
          <RepairVerdictCard
            attempt={COUNTERFEIT_ATTEMPT}
            forensics={COUNTERFEIT_FORENSICS}
            onNext={() => undefined}
            nextLabel="Next drill (4 of 6) →"
          />
        ) : (
          <RepairVerdictCard
            attempt={TRUE_ATTEMPT}
            forensics={TRUE_FORENSICS}
            onNext={() => undefined}
            nextLabel="Next drill (5 of 6) →"
          />
        )}
      </div>
    </section>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] transition ${
        active
          ? "!border-zinc-900 !bg-zinc-900 text-white"
          : "!border-zinc-300 !bg-white text-zinc-700 hover:!border-zinc-900"
      }`}
    >
      {children}
    </button>
  );
}
