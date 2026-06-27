import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("paid repair loop labels", () => {
  it("points drill completion to the exact red-zone detail route", () => {
    const source = readProjectFile("app/drills/[drill_id]/page.tsx");

    assert.match(source, /Repair this red zone next/);
    assert.match(source, /redZoneDetailHref\(result\.red_zone\)/);
    assert.match(source, /encodeURIComponent\(redZone\.dimension\)/);
    assert.match(source, /encodeURIComponent\(redZone\.tag\)/);
  });

  it("wires answer-key forensics into a prescribed red-zone repair drill", () => {
    const runner = readProjectFile("components/question-runner.tsx");
    const debrief = readProjectFile("components/redesign/answer-key-debrief.tsx");

    assert.match(runner, /onStartRepair=\{startRepair\}/);
    assert.match(runner, /onOpenRedZoneMap=\{openRedZoneMap\}/);
    assert.match(runner, /kind:\s*"prescribed_red_zone"/);
    assert.match(runner, /Repair this red zone next/);
    assert.match(debrief, /Repair this red zone next/);
  });
});

describe("support self-check", () => {
  it("shows the same support self-check on support and account surfaces", () => {
    const support = readProjectFile("app/support/page.tsx");
    const account = readProjectFile("app/account/page.tsx");
    const panel = readProjectFile("components/support-self-check.tsx");

    assert.match(support, /<SupportSelfCheck \/>/);
    assert.match(account, /<SupportSelfCheck \/>/);
    assert.match(panel, /same checkout email/);
    assert.match(panel, /receipt email/);
    assert.match(panel, /dashboard route/);
    assert.match(panel, /href="\/account"/);
    assert.match(panel, /href="\/dashboard"/);
    assert.match(panel, /support@barmatrix\.app/);
  });
});
