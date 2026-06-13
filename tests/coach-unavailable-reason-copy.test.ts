import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("coach unavailable copy", () => {
  it("uses API unavailable reasons instead of always telling completed users to finish The Method", () => {
    const source = readProjectFile("app/coach/coach-client.tsx");

    assert.match(source, /function getCoachUnavailableState/);
    assert.match(source, /current\.reason/);
    assert.match(source, /no_tagged_items/);
    assert.match(source, /c3_not_provisioned/);
    assert.match(source, /C3 Coach is waiting on tagged question coverage/);
  });

  it("labels starter-baseline coach questions honestly", () => {
    const source = readProjectFile("app/coach/coach-client.tsx");
    const apiTypes = readProjectFile("lib/api-client.ts");

    assert.match(source, /target_mold === "starter_baseline"/);
    assert.match(source, /Starting with a baseline question/);
    assert.match(apiTypes, /fork_practice:\s*boolean/);
  });
});
