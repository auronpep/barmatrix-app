import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("C3 mastery coverage-pending copy", () => {
  it("does not send users with attempts but zero C3 tags back to The Method", () => {
    const page = readProjectFile("app/mastery/page.tsx");

    assert.match(page, /coveragePending/);
    assert.match(page, /data\.coverage\.total_attempts\s*>\s*0/);
    assert.match(page, /data\.coverage\.measured_attempts\s*===\s*0/);
    assert.match(page, /Tagged coverage pending/);
    assert.match(page, /C3-tagged question coverage/);
    assert.doesNotMatch(page, /Finish The Method, then work questions/);
  });
});
