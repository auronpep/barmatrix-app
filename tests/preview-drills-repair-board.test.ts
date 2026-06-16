import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("preview drills repair board", () => {
  it("keeps the preview anchored to red-zone repair sets instead of fake question-card mastery", () => {
    const source = readProjectFile("app/preview/drills/page.tsx");

    assert.match(source, /useDayPlan/);
    assert.match(source, /useRedZoneLibrary/);
    assert.match(source, /Red-Zone repair board/);
    assert.match(source, /Today(?:'|&apos;)s repair/);
    assert.match(source, /kind:\s*"prescribed_red_zone"/);
    assert.match(source, /Browse the full bank after the assigned repair/);
    assert.doesNotMatch(source, /MasteryDots/);
    assert.doesNotMatch(source, /Five-dot mastery/);
  });
});
