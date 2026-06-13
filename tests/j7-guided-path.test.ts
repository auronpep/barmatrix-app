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
});
