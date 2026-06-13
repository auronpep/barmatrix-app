import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("paid program display labels", () => {
  it("formats raw drill names before rendering dashboard and drill runner headings", () => {
    const helpers = readProjectFile("lib/drills.ts");
    const dashboard = readProjectFile("app/dashboard/page.tsx");
    const drillRunner = readProjectFile("app/drills/[drill_id]/page.tsx");

    assert.match(helpers, /function formatDrillName/);
    assert.match(helpers, /review_drill/);
    assert.match(helpers, /Review Missed Questions/);

    assert.match(dashboard, /formatDrillName\(drill\.drill_name\)/);
    assert.match(dashboard, /formatDrillName\(drill\.reason\)/);
    assert.doesNotMatch(dashboard, /title:\s*drill\.drill_name/);
    assert.doesNotMatch(dashboard, /\$\{drill\.reason\}/);

    assert.match(
      drillRunner,
      /const drillDisplayName =[\s\S]*formatDrillName\(state\.detail\.drill_name\)/,
    );
    assert.match(drillRunner, /title=\{drillDisplayName\}/);
    assert.doesNotMatch(drillRunner, /title=\{state\.detail\.drill_name\}/);
  });

  it("formats assigned drill names and statuses on the final sprint path", () => {
    const finalSprint = readProjectFile("app/dashboard/final-sprint/page.tsx");

    assert.match(finalSprint, /import \{ formatDrillName \} from "@\/lib\/drills";/);
    assert.match(finalSprint, /formatDrillName\(d\.drill_name\)/);
    assert.match(finalSprint, /formatSprintDrillStatus\(d\.status\)/);
    assert.doesNotMatch(finalSprint, /\{d\.drill_name\}/);
    assert.doesNotMatch(finalSprint, /\{d\.status\}/);
  });

  it("does not expose external IDs or UUID fragments in the Contracts live queue label", () => {
    const contracts = readProjectFile("app/drills/contracts/page.tsx");

    assert.match(contracts, /function formatQueueQuestionLabel/);
    assert.match(contracts, /formatQueueQuestionLabel\(currentRef\)/);
    assert.doesNotMatch(
      contracts,
      /currentRef\.external_id\s*\?\?\s*currentRef\.question_id\.slice/,
    );
  });
});
