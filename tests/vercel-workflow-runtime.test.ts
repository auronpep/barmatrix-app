import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("Vercel production workflow runtime", () => {
  it("opts GitHub JavaScript actions into the Node 24 runtime", () => {
    const workflow = readProjectFile(".github/workflows/deploy-vercel.yml");

    assert.match(workflow, /FORCE_JAVASCRIPT_ACTIONS_TO_NODE24:\s*true/);
  });
});
