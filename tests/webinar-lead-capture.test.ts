import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("webinar lead capture surface", () => {
  it("publishes honest unscheduled-webinar copy", () => {
    const page = readProjectFile("app/webinar/page.tsx");

    assert.match(page, /The next webinar is not scheduled yet/);
    assert.match(page, /will not send an\s+automated confirmation/);
    assert.match(page, /No date, time, or seat limit is being claimed/);
  });

  it("uses real API capture instead of a mailto draft", () => {
    const form = readProjectFile("app/webinar/webinar-lead-form.tsx");
    const apiClient = readProjectFile("lib/api-client.ts");

    assert.match(form, /api\.createWebinarLead/);
    assert.doesNotMatch(form, /mailto:/);
    assert.match(form, /No automated email was sent/);
    assert.match(apiClient, /\/api\/webinar\/leads/);
  });

  it("makes the route discoverable and redirects legacy webinar.html traffic", () => {
    const sitemap = readProjectFile("app/sitemap.ts");
    const config = readProjectFile("next.config.ts");
    const legacyLanding = readProjectFile("public/lp-red-zone.html");

    assert.match(sitemap, /"\/webinar"/);
    assert.match(config, /source: "\/webinar\.html"/);
    assert.match(config, /destination: "\/webinar"/);
    assert.match(legacyLanding, /href="\/webinar">Next Webinar/);
  });
});
