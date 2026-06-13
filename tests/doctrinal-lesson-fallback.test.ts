import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("doctrinal lesson fallback", () => {
  it("does not dead-end paid path learners on coming-soon copy", () => {
    const page = readProjectFile("app/study/doctrinal/[slug]/page.tsx");

    assert.doesNotMatch(page, /Coming soon/);
    assert.doesNotMatch(page, /final review/);
    assert.doesNotMatch(page, /unlock here shortly/);
    assert.match(page, /setMethodFallback\(true\)/);
    assert.match(page, /href=\{`\/foundations\/\$\{slug\}`\}/);
    assert.match(page, /Mark complete and return/);
  });
});
