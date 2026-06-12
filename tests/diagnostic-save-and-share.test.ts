import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("diagnostic results save-map capture", () => {
  it("captures the email through the real lead API with the diagnostic id", () => {
    const form = readProjectFile("components/save-map-form.tsx");

    assert.match(form, /api\.createWebinarLead/);
    assert.match(form, /diagnostic_id=\$\{diagnosticId\}/);
    assert.match(form, /source_page: "\/diagnostic\/results"/);
    assert.doesNotMatch(form, /mailto:/);
  });

  it("keeps the copy honest: free, no automated email, recovery-only use", () => {
    const form = readProjectFile("components/save-map-form.tsx");

    assert.match(form, /no automated email is sent/);
    assert.match(form, /free,\s*\n?\s*no card/);
    assert.match(form, /Used only to recover this map\. No list, no spam\./);
  });

  it("includes the spam honeypot field like the webinar form", () => {
    const form = readProjectFile("components/save-map-form.tsx");

    assert.match(form, /name="website"/);
    assert.match(form, /tabIndex=\{-1\}/);
  });

  it("is rendered on the diagnostic results page", () => {
    const page = readProjectFile("app/diagnostic/[session]/results/page.tsx");

    assert.match(page, /<SaveMapForm/);
    assert.match(page, /<ShareMap/);
  });
});

describe("diagnostic results share card", () => {
  it("shares trap names with severity squares but never the raw score", () => {
    const share = readProjectFile("components/share-map.tsx");

    assert.match(share, /🟥/);
    assert.match(share, /🟧/);
    assert.match(share, /These traps caught me:/);
    assert.doesNotMatch(share, /score_pct/);
    assert.doesNotMatch(share, /\$\{[^}]*correct[^}]*\}/);
  });

  it("links back to the diagnostic with share attribution", () => {
    const share = readProjectFile("components/share-map.tsx");

    assert.match(
      share,
      /barmatrix\.app\/diagnostic\?utm_source=share&utm_campaign=red_zone_map/,
    );
  });

  it("uses the native share sheet with a clipboard fallback", () => {
    const share = readProjectFile("components/share-map.tsx");

    assert.match(share, /navigator\.share/);
    assert.match(share, /navigator\.clipboard\.writeText/);
  });
});

describe("save/share analytics events", () => {
  it("registers both events in the analytics catalog", () => {
    const analytics = readProjectFile("lib/analytics.ts");

    assert.match(analytics, /red_zone_map_save_requested: \{/);
    assert.match(analytics, /red_zone_map_shared: \{/);
    assert.match(analytics, /export function trackMapSaveRequested/);
    assert.match(analytics, /export function trackMapShared/);
  });
});
