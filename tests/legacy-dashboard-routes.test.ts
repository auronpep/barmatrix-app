import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("legacy paid dashboard routes", () => {
  it("restores old BMO navigation surfaces as real app routes", () => {
    const matrix = readProjectFile("app/matrix/page.tsx");
    const misconceptions = readProjectFile("app/misconceptions/page.tsx");
    const history = readProjectFile("app/question-history/page.tsx");
    const patternBoard = readProjectFile("app/pattern-board/page.tsx");
    const legacyHistory = readProjectFile("app/history/page.tsx");

    assert.match(matrix, /Tension Matrix/);
    assert.match(matrix, /useDashboard\(\)/);
    assert.match(misconceptions, /Misconception Profile/);
    assert.match(misconceptions, /by_dimension\.misconception/);
    assert.match(history, /Question History/);
    assert.match(history, /recent_attempts/);
    assert.match(patternBoard, /redirect\("\/dashboard\/mastery"\)/);
    assert.match(legacyHistory, /redirect\("\/question-history"\)/);
  });

  it("links the restored surfaces from dashboard navigation and command center", () => {
    const dashboardLayout = readProjectFile("app/dashboard/layout.tsx");
    const dashboardPage = readProjectFile("app/dashboard/page.tsx");

    for (const href of ["/matrix", "/misconceptions", "/question-history"]) {
      assert.match(dashboardLayout, new RegExp(`href: "${href}"`));
      assert.match(dashboardPage, new RegExp(`href: "${href}"`));
    }

    assert.match(dashboardLayout, /Tension Matrix/);
    assert.match(dashboardLayout, /Misconceptions/);
    assert.match(dashboardLayout, /Question History/);
  });
});
