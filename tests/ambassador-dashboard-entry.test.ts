import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("dashboard guided-path entry", () => {
  it("uses the BMO/J7 day-plan path as the paid-user entry point", () => {
    const source = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(source, /useDayPlan/);
    assert.match(source, /DayCards/);
    assert.match(source, /Current Task/);
    assert.match(source, /Mark Complete/);
    assert.doesNotMatch(source, /useFoundations\(/);
    assert.doesNotMatch(source, /useC3\(/);
  });

  it("does not show a competing empty-dashboard diagnostic CTA while Lead Me owns Day 1", () => {
    const source = readProjectFile("app/dashboard/path/page.tsx");

    assert.doesNotMatch(source, /methodEntryPending/);
    assert.doesNotMatch(source, /Take the diagnostic to build your Red-Zone Map/);
  });

  it("restores the old paid dashboard navigation while keeping My Path first", () => {
    const source = readProjectFile("app/dashboard/layout.tsx");

    assert.match(source, /VIEW_TABS/);
    assert.match(source, /href: "\/dashboard\/path", label: "My Path"/);
    assert.match(source, /href: "\/dashboard", label: "Full Dashboard"/);
    assert.match(source, /PROGRAM_LINKS/);
    assert.match(source, /href: "\/practice"/);
    assert.match(source, />\s*Program\s*</);
  });

  it("keeps command-deck dashboard live while preserving old dashboard subviews", () => {
    const dashboard = readProjectFile("app/dashboard/page.tsx");
    const mastery = readProjectFile("app/dashboard/mastery/page.tsx");
    const finalSprint = readProjectFile("app/dashboard/final-sprint/page.tsx");
    const path = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(dashboard, /useCommandDeck\(/);
    assert.match(dashboard, /DashboardShell/);
    assert.match(dashboard, /DashboardV2Body/);
    assert.match(mastery, /PatternMasteryBoardPage/);
    assert.match(mastery, /useDashboard\(/);
    assert.match(finalSprint, /FinalSprintPathPage/);
    assert.match(finalSprint, /SPRINT_DAYS/);
    assert.match(path, /useDayPlan/);
    assert.doesNotMatch(mastery, /redirect\("\/dashboard"\)/);
    assert.doesNotMatch(finalSprint, /redirect\("\/dashboard"\)/);
    assert.doesNotMatch(path, /redirect\("\/dashboard"\)/);
  });

  it("keeps Lead Me isolated to /dashboard/path so /dashboard stays the full dashboard", () => {
    const dashboard = readProjectFile("app/dashboard/page.tsx");
    const path = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(path, /useDayPlan\(/);
    assert.doesNotMatch(dashboard, /usePath\(/);
    assert.doesNotMatch(dashboard, /PathSurface/);
    assert.doesNotMatch(dashboard, /next_step != null/);
  });

  it("surfaces the restored paid-program tools inside the full dashboard", () => {
    const shell = readProjectFile("components/preview-dashboard/dashboard-shell.tsx");
    const body = readProjectFile("components/preview-dashboard/dashboard-v2-body.tsx");

    assert.match(shell, /section: "VIEWS"/);
    assert.match(shell, /label: "My Path"/);
    for (const href of [
      "/dashboard/path",
      "/atlas",
      "/red-zones",
      "/drills",
      "/dashboard/mastery",
      "/dashboard/final-sprint",
    ]) {
      assert.match(shell, new RegExp(`href: "${href.replaceAll("/", "\\/")}"`));
    }
    assert.match(body, /Outline Atlas/);
    assert.match(body, /Sequenced repair queue/);
    assert.match(body, /Active Red Zones/);
    assert.match(body, /Mastery trend/);
    assert.match(body, /Recent activity/);
  });

  it("keeps the customer Atlas as a learning map with gated component lanes", () => {
    const atlas = readProjectFile("app/atlas/atlas-client.tsx");
    const client = readProjectFile("lib/api-client.ts");
    const body = readProjectFile("components/preview-dashboard/dashboard-v2-body.tsx");

    assert.match(atlas, /Walk the MBE outline by code/);
    assert.match(atlas, /Has any lane/);
    assert.match(atlas, /Needs content/);
    assert.match(atlas, /Codes with components/);
    assert.match(atlas, /Study this code/);
    assert.match(atlas, /atlas-code-lesson/);
    assert.match(atlas, /Outline lesson/);
    assert.match(atlas, /LeadMe lesson/);
    assert.match(atlas, /Question bank/);
    assert.match(atlas, /Start LeadMe/);
    assert.match(atlas, /Drill this code/);
    assert.match(atlas, /Connected previews/);
    assert.match(atlas, /Atlas walk/);
    assert.match(atlas, /selectedProgress/);
    assert.match(atlas, /ComponentPreviewRow/);
    assert.match(atlas, /leadme_item_previews/);
    assert.match(atlas, /debrief_element_previews/);
    assert.match(atlas, /kind: "outline_code"/);
    assert.match(atlas, /outline_code: selected\.code/);
    assert.match(atlas, /Approval gate/);
    assert.match(atlas, /readRequestedCode/);
    assert.match(atlas, /window\.history\.replaceState/);
    assert.match(atlas, /Direct link/);
    assert.match(client, /getAtlasComponents/);
    assert.match(client, /AtlasLeadMeItemPreview/);
    assert.match(client, /AtlasDebriefElementPreview/);
    assert.match(client, /startAtlasLeadMe/);
    assert.match(body, /open approved questions, lessons, and component lanes/);
    assert.doesNotMatch(atlas, /review_count|source_ref|source_label|included_by/);
  });

  it("does not expose raw command-deck fetch failures in the dashboard card", () => {
    const dashboard = readProjectFile("app/dashboard/page.tsx");

    assert.match(dashboard, /Live data sync degraded\. Some panels may be temporarily stale\./);
    assert.match(dashboard, /Your briefing is temporarily unavailable\./);
    assert.doesNotMatch(dashboard, /<p[^>]*>\{error\}<\/p>/);
    assert.doesNotMatch(dashboard, /Live data sync degraded: \{error\}/);
    assert.doesNotMatch(dashboard, /temporarily unavailable\{error/);
  });
});
