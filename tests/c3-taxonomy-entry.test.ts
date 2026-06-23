import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("C3 Red-Zone V5 entry surfaces", () => {
  it("uses the new packet-only taxonomy helpers on the main entry pages", () => {
    const redZones = source("app/red-zones/page.tsx");
    const tensions = source("app/tensions/page.tsx");
    const traps = source("app/traps/page.tsx");
    const drills = source("app/drills/page.tsx");

    assert.match(redZones, /getC3RedZoneCatalog/);
    assert.match(tensions, /getC3Axes/);
    assert.match(traps, /getC3ChoicePatterns/);
    assert.match(drills, /getC3RedZoneCatalog/);
    assert.match(drills, /getC3Axes/);
    assert.match(drills, /getC3ChoicePatterns/);
    assert.doesNotMatch(redZones, /useRedZoneLibrary/);
    assert.doesNotMatch(tensions, /getTensionCatalog/);
    assert.doesNotMatch(traps, /getTrapCatalog/);
    assert.doesNotMatch(drills, /getDrillCatalog/);
    assert.doesNotMatch(drills, /SUBJECT_QUICK_DRILLS/);
  });

  it("points coach and dashboard entry navigation at the Red-Zone V5 route set", () => {
    const coachPage = source("app/coach/page.tsx");
    const coachClient = source("app/coach/coach-client.tsx");
    const dashboardLayout = source("app/dashboard/layout.tsx");
    const dashboardBody = source("components/preview-dashboard/dashboard-v2-body.tsx");
    const dashboardRouter = source("components/preview-dashboard/diag-router.tsx");

    assert.match(coachPage, /Red-Zone V5 model/);
    assert.match(coachClient, /validated choice diagnostics/);
    assert.match(dashboardLayout, /Red-Zone V5/);
    assert.match(dashboardLayout, /C3 Axis Map/);
    assert.match(dashboardLayout, /Choice Patterns/);
    assert.match(dashboardBody, /Packet Drills/);
    assert.match(dashboardRouter, /C3 Axis Map/);
    assert.match(dashboardRouter, /Choice Patterns/);
    assert.doesNotMatch(dashboardLayout, /Tension Matrix/);
    assert.doesNotMatch(dashboardRouter, /Pattern Board/);
  });

  it("keeps legacy detail routes available for direct Atlas detour URLs", () => {
    const tensionDetail = source("app/tensions/[slug]/page.tsx");
    const trapDetail = source("app/traps/[slug]/page.tsx");

    assert.match(tensionDetail, /getTensionDetail/);
    assert.match(trapDetail, /getTrapDetail/);
    assert.match(tensionDetail, /Back to Atlas code/);
    assert.match(trapDetail, /Back to Atlas code/);
  });
});
