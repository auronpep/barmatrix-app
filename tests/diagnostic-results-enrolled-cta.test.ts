import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("diagnostic results enrolled CTA", () => {
  it("renders one recommended next-step CTA instead of dashboard or pricing hubs", () => {
    const source = readProjectFile("app/diagnostic/[session]/results/page.tsx");

    assert.match(source, /import \{ useDashboard, type DashboardState \} from "@\/lib\/use-dashboard";/);
    assert.match(source, /const dash = useDashboard\(\);/);
    assert.match(source, /const accessState = resolveDiagnosticResultsAccess\(dash\);/);
    assert.match(source, /<RecommendationCta\s+methodSlug=\{methodSlug\}\s+results=\{results\}/);
    assert.match(source, /<ResultsDecisionPanel\s+diagnosticId=\{diagnosticId\}\s+results=\{results\}\s+accessState=\{accessState\}/);
    assert.match(source, /case "enrolled":/);
    assert.match(source, /href="\/dashboard\/path"/);
    assert.match(source, /Continue your repair path/);
    assert.match(source, /if \(dash\.error\) return "access_unavailable";/);
    assert.match(source, /case "access_unavailable":/);
    assert.match(source, /We could not confirm active access from this screen\./);
    assert.match(source, /href="\/account"/);
    assert.match(source, /buildDiagnosticRecommendation/);
    assert.match(source, /Your top leak is \{rec\.topLeak\} - start here\./);
    assert.match(source, /results\.recommendation\?\.next_step/);
    assert.match(source, /redZoneDetailHref\(results\) \?\? "\/red-zones"/);
    assert.doesNotMatch(source, /Open dashboard/);
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
