// Redesign V2 — the "Repair" verdict screen.
//
// PHASE 1 (presentation only): a drop-in restyle of the live ForensicsCard
// (components/question-runner.tsx). Same props, same data source
// (ForensicsResponse from GET /api/forensics/:attemptId) — it only re-presents
// the fields we ALREADY have in the redesign's "true and responsive vs.
// counterfeit" verdict language.
//
// Deliberately NOT faked in Phase 1: the per-distractor Elimination grid,
// Counterpoint-one-by-one, and Gold/Silver Key cards. Those are sourced from
// c3_annotations (per-distractor filter_broken / mold / explanation, gold_keys,
// silver_keys) and are surfaced in Phase 2 once the API exposes them. A muted
// footnote marks where they will mount, so this preview is honest about scope.

import type { AttemptResponse, ForensicsResponse } from "@/lib/api-client";
import { SectionLabel } from "@/components/redesign/redesign-chrome";

export interface RepairVerdictCardProps {
  attempt: AttemptResponse;
  forensics: ForensicsResponse;
  onNext: () => void;
  nextLabel: string;
}

export function RepairVerdictCard({
  attempt,
  forensics,
  onNext,
  nextLabel,
}: RepairVerdictCardProps) {
  const correct = attempt.correct;

  return (
    <article className="border-2 border-zinc-900 bg-white">
      {/* Verdict header */}
      <header className="border-b border-zinc-200 px-7 py-6">
        <SectionLabel>The Verdict</SectionLabel>
        {correct ? (
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-zinc-950">
            True and responsive. You kept the point.
          </h2>
        ) : (
          <>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-zinc-950">
              Counterfeit. It answered a different question.
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-red-700">
              Correct answer was {attempt.correct_answer ?? "—"}
              {forensics.trap_name ? ` · ${forensics.trap_name}` : ""}
            </p>
          </>
        )}
      </header>

      <div className="space-y-7 px-7 py-7">
        {correct ? (
          forensics.why_correct && (
            <VerdictSection title="Why it holds">
              {forensics.why_correct}
            </VerdictSection>
          )
        ) : (
          <>
            {forensics.why_attractive && (
              <VerdictSection title="Why it almost worked">
                {forensics.why_attractive}
              </VerdictSection>
            )}
            {forensics.why_wrong && (
              <VerdictSection title="Why it is counterfeit">
                {forensics.why_wrong}
              </VerdictSection>
            )}

            {/* Repair card — built from the fields we have today. */}
            {(forensics.trap_name || forensics.future_cue) && (
              <div className="border border-zinc-900">
                <p className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-zinc-700">
                  Repair Card{forensics.trap_name ? ` · ${forensics.trap_name}` : ""}
                </p>
                <dl className="divide-y divide-zinc-200">
                  {forensics.trap_name && (
                    <RepairRow label="The Trap" value={forensics.trap_name} />
                  )}
                  {forensics.future_cue && (
                    <RepairRow label="The Move" value={forensics.future_cue} />
                  )}
                </dl>
              </div>
            )}

            {forensics.future_cue && (
              <div>
                <SectionLabel>Say it like this on exam day</SectionLabel>
                <p className="mt-3 border-l-2 border-zinc-900 pl-4 font-serif text-lg italic leading-relaxed text-zinc-800">
                  {forensics.future_cue}
                </p>
              </div>
            )}
          </>
        )}

        {forensics.focus_group && (
          <p className="bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
            <span className="font-medium">Focus-group data:</span>{" "}
            {forensics.focus_group.selected_choice_pct}% of{" "}
            {forensics.focus_group.sample_size} test-takers picked the same
            answer.
          </p>
        )}

        {!correct && forensics.assigned_drill && (
          <p className="text-sm text-zinc-700">
            <span className="font-medium">Assigned drill:</span>{" "}
            {forensics.assigned_drill.name}
          </p>
        )}

        {/* Honest Phase-2 marker: structure that populates from C3 annotations. */}
        <p className="border-t border-dashed border-zinc-300 pt-5 font-mono text-[11px] leading-5 text-zinc-400">
          Phase 2 · The full Elimination grid (cut / clash / call per distractor),
          counterpoints one-by-one, and Gold / Silver Keys mount here once C3
          annotations are surfaced through the API.
        </p>

        <button type="button" onClick={onNext} className="btn red btn-lg">
          {nextLabel}
        </button>
      </div>
    </article>
  );
}

function VerdictSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-zinc-800">
        {children}
      </p>
    </div>
  );
}

function RepairRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 px-5 py-3">
      <dt className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-zinc-900">{value}</dd>
    </div>
  );
}
