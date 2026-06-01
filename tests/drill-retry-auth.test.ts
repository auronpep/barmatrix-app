import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("drill retry auth", () => {
  it("retries missed questions with the active Clerk token and visible failure text", () => {
    const source = readProjectFile("app/drills/[drill_id]/page.tsx");

    assert.match(source, /const\s+\[retryError,\s*setRetryError\]\s*=\s*useState/);
    assert.match(source, /const\s+token\s*=\s*await\s+getToken\(\)/);
    assert.match(
      source,
      /api\.startDrill\(\s*\{\s*kind:\s*"retry",\s*source_drill_id:\s*drillId\s*\},\s*token\s*\)/,
    );
    assert.match(source, /setRetryError\("Sign in to retry missed questions\."\)/);
    assert.match(source, /\{retryError\s*&&/);
  });
});
