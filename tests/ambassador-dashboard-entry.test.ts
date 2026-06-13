import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("dashboard guided-path entry", () => {
  it("uses the BMO/J7 day-plan dashboard as the paid-user entry point", () => {
    const source = readProjectFile("app/dashboard/page.tsx");

    assert.match(source, /useDayPlan/);
    assert.match(source, /DayCards/);
    assert.match(source, /Current Task/);
    assert.match(source, /Mark Complete/);
    assert.doesNotMatch(source, /useFoundations\(/);
    assert.doesNotMatch(source, /useC3\(/);
  });

  it("does not show a competing empty-dashboard diagnostic CTA while Lead Me owns Day 1", () => {
    const source = readProjectFile("app/dashboard/page.tsx");

    assert.doesNotMatch(source, /methodEntryPending/);
    assert.doesNotMatch(source, /Take the diagnostic to build your Red-Zone Map/);
  });

  it("removes the dashboard program-resource navigation strip", () => {
    const source = readProjectFile("app/dashboard/layout.tsx");

    assert.match(source, /Today&apos;s Guided Path/);
    assert.doesNotMatch(source, /PROGRAM_LINKS/);
    assert.doesNotMatch(source, /href: "\/practice"/);
    assert.doesNotMatch(source, />Program</);
  });

  it("gates old dashboard subviews back to the guided dashboard", () => {
    const mastery = readProjectFile("app/dashboard/mastery/page.tsx");
    const finalSprint = readProjectFile("app/dashboard/final-sprint/page.tsx");
    const path = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(mastery, /redirect\("\/dashboard"\)/);
    assert.match(finalSprint, /redirect\("\/dashboard"\)/);
    assert.match(path, /redirect\("\/dashboard"\)/);
  });
});
