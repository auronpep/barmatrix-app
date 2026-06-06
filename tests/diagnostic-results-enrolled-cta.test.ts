import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("diagnostic results enrolled CTA", () => {
  it("renders one recommended next-step CTA instead of dashboard or pricing hubs", () => {
    const source = readProjectFile("app/diagnostic/[session]/results/page.tsx");

    assert.match(source, /<RecommendationCta\s+methodSlug=\{methodSlug\}\s+results=\{results\}/);
    assert.match(source, /buildDiagnosticRecommendation/);
    assert.match(source, /Your top leak is \{rec\.topLeak\} - start here\./);
    assert.match(source, /results\.recommendation\?\.next_step/);
    assert.match(source, /redZoneDetailHref\(results\) \?\? "\/red-zones"/);
    assert.doesNotMatch(source, /useDashboard\(\)/);
    assert.doesNotMatch(source, /Open dashboard/);
    assert.doesNotMatch(source, /Enroll for/);
    assert.doesNotMatch(source, /How it works/);
  });

  it("updates placement results to use the level and top remediation target as the CTA", () => {
    const source = readProjectFile("app/diagnostic/session/[sessionId]/results/page.tsx");

    assert.match(source, /<ProgramCta methodSlug=\{methodSlug\} results=\{results\} \/>/);
    assert.match(source, /Recommended next step - L\{results\.placement_level\}/);
    assert.match(source, /Your top leak is \{topLeak\} - start here\./);
    assert.match(source, /placementNextStep\(results\.placement_level, methodSlug\)/);
    assert.match(source, /results\.top_remediation_targets\[0\]/);
    assert.doesNotMatch(source, /Start your program at the right level/);
    assert.doesNotMatch(source, /href="\/dashboard"/);
  });
});
