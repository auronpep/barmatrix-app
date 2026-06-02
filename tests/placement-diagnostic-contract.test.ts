import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("placement diagnostic app contract", () => {
  it("caches pinned placement questions before navigating into the session", () => {
    const source = readFileSync("app/diagnostic/session/placement-entry-client.tsx", "utf8");
    assert.match(source, /question_ids/);
    assert.match(source, /questions:\s*result\.questions/);
    assert.match(source, /sessionStorage\.setItem/);
    assert.match(source, /`barmatrix\.placement\.\$\{result\.session_id\}`/);
  });

  it("loads cached placement questions without a client-side question fan-out", () => {
    const source = readFileSync("app/diagnostic/session/[sessionId]/page.tsx", "utf8");
    assert.match(source, /cached\.questions/);
    assert.doesNotMatch(source, /api\.getQuestion/);
    assert.doesNotMatch(source, /api\.getPlacementQuestions\(\)/);
  });
});
