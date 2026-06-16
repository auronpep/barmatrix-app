import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("dashboard student-facing copy", () => {
  it("keeps timing mechanics and internal sequencing off the guided dashboard", () => {
    const page = readProjectFile("app/dashboard/page.tsx");
    const cards = readProjectFile("app/dashboard/day-cards.tsx");

    assert.match(cards, /First 3 Days/);
    assert.match(cards, /Criminal Law and Procedure Questline/);
    assert.match(page, /Active Challenge/);
    assert.doesNotMatch(cards, /Criminal Law and Procedure path/);
    assert.doesNotMatch(page, /Current day:/);
    assert.doesNotMatch(page, /rollover/);
    assert.doesNotMatch(page, /Step \${step\.order}/);
    assert.doesNotMatch(page, /Diagnostic A question/);
    assert.doesNotMatch(page, /Diagnostic A external question/);
  });
});
