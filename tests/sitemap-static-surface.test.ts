import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("sitemap static surface", () => {
  it("uses a stable lastmod value instead of regenerating current timestamps", () => {
    const sitemap = readProjectFile("app/sitemap.ts");

    assert.match(sitemap, /const LAST_MODIFIED = new Date\("/);
    assert.match(sitemap, /lastModified: LAST_MODIFIED/);
    assert.doesNotMatch(sitemap, /const now = new Date\(\)/);
  });

  it("includes public product and catalog surfaces", () => {
    const sitemap = readProjectFile("app/sitemap.ts");
    const expectedRoutes = [
      "/app",
      "/foundations",
      "/mastery",
      "/coach",
      "/certification",
      "/traps",
      "/tensions",
      "/waitlist",
      "/subjects/civil-procedure",
      "/subjects/constitutional-law",
      "/subjects/contracts",
      "/subjects/criminal-law",
      "/subjects/evidence",
      "/subjects/real-property",
      "/subjects/torts",
    ];

    for (const route of expectedRoutes) {
      assert.match(sitemap, new RegExp(`"${route}"`), `${route} should be in the sitemap`);
    }
  });

  it("does not list auth-gated app routes as public sitemap pages", () => {
    const sitemap = readProjectFile("app/sitemap.ts");

    assert.doesNotMatch(sitemap, /"\/boot-camps"/);
    assert.doesNotMatch(sitemap, /"\/timed-sets"/);
  });
});
