"use client";

// Redesign V2 preview — the Answer Key debrief ("Combo B · Fork-First").
//
// PHASE 2 (presentation only): a static demo of AnswerKeyDebrief so the founder
// can review the full post-answer debrief layout before the C3 annotation ingest
// + the answer-key API endpoint land. The component takes the DebriefData shape
// the Phase-2 endpoint will produce; the fixture below is the Damascus Alley item
// (illustrative, not served from the live bank).
//
// The flip into production: render AnswerKeyDebrief in components/question-runner.tsx
// where ForensicsCard renders today, wiring yourPick/session/onContinue to the
// runner and onStartRepair/onOpenRedZoneMap to the live drill + red-zone routes.

import { useState } from "react";
import { AnswerKeyDebrief } from "@/components/redesign/answer-key-debrief";
import { SectionLabel } from "@/components/redesign/redesign-chrome";
import { DAMASCUS_ALLEY } from "./answer-key-fixture";

export default function AnswerKeyPreviewPage() {
  const [view, setView] = useState<"missed" | "correct">("missed");
  const yourPick = view === "missed" ? DAMASCUS_ALLEY.dominantTrap : DAMASCUS_ALLEY.correctLetter;

  return (
    <main className="py-10">
      <div className="mx-auto max-w-[1000px] px-6 sm:px-8">
        <SectionLabel>Preview · the answer key</SectionLabel>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-zinc-950">
          The Answer Key debrief
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
          A styling preview of the post-answer “Fork-First” debrief. It consumes the
          <code className="mx-1 bg-zinc-100 px-1">DebriefData</code> shape the Phase-2
          answer-key endpoint will produce; sample content is illustrative.
        </p>

        <div className="mt-6 flex gap-2">
          <Toggle active={view === "missed"} onClick={() => setView("missed")}>
            Missed (chose {DAMASCUS_ALLEY.dominantTrap})
          </Toggle>
          <Toggle active={view === "correct"} onClick={() => setView("correct")}>
            Correct (chose {DAMASCUS_ALLEY.correctLetter})
          </Toggle>
        </div>
      </div>

      <div className="mt-8">
        <AnswerKeyDebrief
          key={view}
          data={DAMASCUS_ALLEY}
          yourPick={yourPick}
          onContinue={() => undefined}
          onStartRepair={() => undefined}
          onOpenRedZoneMap={() => undefined}
        />
      </div>
    </main>
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
          ? "!border-zinc-900 !bg-zinc-900 !text-white"
          : "!border-zinc-300 !bg-white !text-zinc-700 hover:!border-zinc-900"
      }`}
    >
      {children}
    </button>
  );
}
