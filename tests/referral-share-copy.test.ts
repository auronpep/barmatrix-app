import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("referral share copy", () => {
  it("does not generate default demo attribution for copied referral links", () => {
    const source = readProjectFile("app/referral/referral-share-client.tsx");

    assert.doesNotMatch(source, /partner-demo/i);
    assert.doesNotMatch(source, /demo/i);
    assert.match(source, /approved-partner-id/);
    assert.match(source, /Add a real partner ID/);
  });
});
