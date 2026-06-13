import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("dashboard guided-path entry", () => {
  it("uses the BMO/J7 day-plan path as the paid-user entry point", () => {
    const source = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(source, /useDayPlan/);
    assert.match(source, /DayCards/);
    assert.match(source, /Current Task/);
    assert.match(source, /Mark Complete/);
    assert.doesNotMatch(source, /useFoundations\(/);
    assert.doesNotMatch(source, /useC3\(/);
  });

  it("does not show a competing empty-dashboard diagnostic CTA while Lead Me owns Day 1", () => {
    const source = readProjectFile("app/dashboard/path/page.tsx");

    assert.doesNotMatch(source, /methodEntryPending/);
    assert.doesNotMatch(source, /Take the diagnostic to build your Red-Zone Map/);
  });

  it("restores the old paid dashboard navigation while keeping My Path first", () => {
    const source = readProjectFile("app/dashboard/layout.tsx");

    assert.match(source, /VIEW_TABS/);
    assert.match(source, /href: "\/dashboard\/path", label: "My Path"/);
    assert.match(source, /href: "\/dashboard", label: "Full Dashboard"/);
    assert.match(source, /PROGRAM_LINKS/);
    assert.match(source, /href: "\/practice"/);
    assert.match(source, />\s*Program\s*</);
  });

  it("restores old dashboard subviews instead of redirecting them away", () => {
    const dashboard = readProjectFile("app/dashboard/page.tsx");
    const mastery = readProjectFile("app/dashboard/mastery/page.tsx");
    const finalSprint = readProjectFile("app/dashboard/final-sprint/page.tsx");
    const path = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(dashboard, /useDashboard\(/);
    assert.match(dashboard, /useFoundations\(/);
    assert.match(dashboard, /useC3\(/);
    assert.match(mastery, /PatternMasteryBoardPage/);
    assert.match(mastery, /useDashboard\(/);
    assert.match(finalSprint, /FinalSprintPathPage/);
    assert.match(finalSprint, /SPRINT_DAYS/);
    assert.match(path, /useDayPlan/);
    assert.doesNotMatch(mastery, /redirect\("\/dashboard"\)/);
    assert.doesNotMatch(finalSprint, /redirect\("\/dashboard"\)/);
    assert.doesNotMatch(path, /redirect\("\/dashboard"\)/);
  });
});
