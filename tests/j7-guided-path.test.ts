import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("J7 guided path dashboard", () => {
  it("renders the paid path from the API day plan, not a resource hub", () => {
    const source = readProjectFile("app/dashboard/path/page.tsx");
    const hook = readProjectFile("lib/use-day-plan.ts");
    const cards = readProjectFile("app/dashboard/day-cards.tsx");
    const apiClient = readProjectFile("lib/api-client.ts");

    assert.match(source, /useDayPlan/);
    assert.match(source, /CurrentTask/);
    assert.match(source, /currentStep/);
    assert.match(source, /day_summaries/);
    assert.match(source, /DayCards/);
    assert.match(source, /Current Task/);
    assert.match(source, /Mark Complete/);
    assert.match(hook, /api\.getMyDayPlan/);
    assert.match(hook, /api\.completeMyDayPlanStep/);
    assert.match(apiClient, /\/api\/me\/day-plan/);
    assert.match(
      apiClient,
      /\/api\/me\/day-plan\/steps\/\$\{encodeURIComponent\(stepId\)\}\/complete/,
    );
    assert.match(apiClient, /selectable: false/);
    assert.match(cards, /First 3 Days/);
    assert.match(cards, /Criminal Law and Procedure Questline/);
    assert.match(cards, /status/);
    assert.doesNotMatch(cards, /<Link/);
    assert.doesNotMatch(cards, /href=/);
    assert.doesNotMatch(source, /Recent Forensics/);
    assert.doesNotMatch(source, /NextDrillPanel/);
    assert.doesNotMatch(source, /Open Red-Zone Map/);
  });

  it("records flashcard task completion through the day-plan API", () => {
    const source = readProjectFile("app/flashcards/[deckId]/page.tsx");

    assert.match(source, /search\.get\("card"\)/);
    assert.match(source, /api\.completeMyDayPlanStep\(token, stepId\)/);
    assert.doesNotMatch(source, /api\.completePathStep\(token, stepId\)/);
    assert.match(source, /Finish card/);
  });

  it("renders V5 candidate cards inside the live Lead Me task surface", () => {
    const source = readProjectFile("app/dashboard/path/page.tsx");
    const cards = readProjectFile("app/dashboard/day-cards.tsx");
    const apiClient = readProjectFile("lib/api-client.ts");

    assert.match(apiClient, /LeadMeV5DayPlanItem/);
    assert.match(apiClient, /leadme_v5_item\?: LeadMeV5DayPlanItem/);
    assert.match(apiClient, /LeadMeV5CompletionResult/);
    assert.match(apiClient, /leadme_v5_result: LeadMeV5CompletionResult \| null/);
    assert.match(apiClient, /micro_task_kind: string \| null/);
    assert.match(apiClient, /coverage_role: string \| null/);
    assert.match(source, /step\.leadme_v5_item/);
    assert.match(source, /V5LeadMeCard/);
    assert.match(source, /item\.front_blocks\.map/);
    assert.match(source, /item\.options\.map/);
    assert.match(source, /onClick=\{\(\) => onSelect\(option\.id\)\}/);
    assert.match(source, /data-leadme-option-style=\{optionMode\}/);
    assert.match(source, /Teach First/);
    assert.match(source, /task_type === "acknowledge"/);
    assert.match(source, /micro_task_kind === "lead_me"/);
    assert.match(source, /Continue/);
    assert.match(source, /Rule Lock/);
    assert.match(source, /Gate \$\{index \+ 1\}/);
    assert.match(source, /Trap Hunt/);
    assert.match(source, /Signal \$\{index \+ 1\}/);
    assert.match(source, /This is not an MBE answer choice/);
    assert.match(source, /Next task/);
    assert.match(source, /v5Options\.length === 0/);
    assert.match(source, /selected_response: selectedResponse/);
    assert.match(source, /result\.leadme_v5_result/);
    assert.match(source, /V5ResultBanner/);
    assert.match(source, /Correct gate/);
    assert.match(source, /Trap signal/);
    assert.match(cards, /Live Lead Me Module/);
    assert.match(cards, /V5 Assault Test Path/);
  });

  it("preserves Lead Me step context through placement questions and Criminal Law drills", () => {
    const placementEntry = readProjectFile("app/diagnostic/session/placement-entry-client.tsx");
    const placementSession = readProjectFile("app/diagnostic/session/[sessionId]/page.tsx");
    const criminalDrill = readProjectFile("app/drills/criminal-law/page.tsx");

    assert.match(placementEntry, /search\.get\("step"\)/);
    assert.match(placementEntry, /\/diagnostic\/session\/\$\{result\.session_id\}/);
    assert.match(placementEntry, /step=\$\{encodeURIComponent\(stepId\)\}/);

    for (const source of [placementSession, criminalDrill]) {
      assert.match(source, /search\.get\("step"\)/);
      assert.match(source, /api\.completeMyDayPlanStep\(token, stepId\)/);
      assert.doesNotMatch(source, /api\.completePathStep\(token, stepId\)/);
      assert.match(source, /Finish Lead Me task/);
    }
  });
});
