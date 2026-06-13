import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("final sprint dashboard copy polish", () => {
  it("does not describe the default exam date as sample or preview content", () => {
    const page = readProjectFile("app/dashboard/final-sprint/page.tsx");

    assert.doesNotMatch(page, /sample date/i);
    assert.doesNotMatch(page, /Preview date:/);
    assert.doesNotMatch(page, /Use preview date/);
    assert.match(page, /default date inside the sprint\s+window/);
    assert.match(page, /Planning date:/);
    assert.match(page, /Use planning date/);
  });
});
