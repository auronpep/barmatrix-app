import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("placement diagnostic app contract", () => {
  it("caches pinned placement question IDs before navigating into the session", () => {
    const source = readFileSync("app/diagnostic/session/placement-entry-client.tsx", "utf8");
    assert.match(source, /question_ids/);
    assert.match(source, /sessionStorage\.setItem/);
    assert.match(source, /`barmatrix\.placement\.\$\{result\.session_id\}`/);
  });

  it("loads cached placement question IDs through the existing question endpoint", () => {
    const source = readFileSync("app/diagnostic/session/[sessionId]/page.tsx", "utf8");
    assert.match(source, /cached\.question_ids/);
    assert.match(source, /api\.getQuestion/);
    assert.doesNotMatch(source, /api\.getPlacementQuestions\(\)/);
  });
});
