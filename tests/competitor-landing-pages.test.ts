import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

const routes = [
  "/alternatives/adaptibar",
  "/alternatives/uworld-mbe-qbank",
  "/alternatives/mbe-question-bank",
  "/barbri-mbe-companion",
  "/themis-uworld-mbe-companion",
];

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function routeFile(route: string): string {
  return `app${route}/page.tsx`;
}

describe("competitor landing pages", () => {
  it("creates all requested routes and sitemap entries", () => {
    const sitemap = readProjectFile("app/sitemap.ts");

    for (const route of routes) {
      assert.ok(existsSync(new URL(`../${routeFile(route)}`, import.meta.url)), route);
      assert.match(sitemap, new RegExp(`"${route}"`), `${route} should be in sitemap`);
    }
  });

  it("keeps comparison pages diagnostic-first and claim-safe", () => {
    const source = readProjectFile("app/alternatives/competitor-pages.tsx");

    assert.match(source, /Start the free diagnostic/);
    assert.match(source, /Red-Zone Map before purchase/);
    assert.match(source, /not a full bar course/i);
    assert.match(source, /does not cover essays or performance tests/i);
    assert.doesNotMatch(source, /pass rate|score increase|guarantee|official affiliation|better than/i);
    assert.doesNotMatch(source, /replaces BARBRI|replace Themis|replace UWorld/i);
  });
});
