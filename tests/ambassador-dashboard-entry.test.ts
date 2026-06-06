import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("ambassador dashboard Method entry", () => {
  it("uses the foundations next_slug as the Overview primary action", () => {
    const source = readProjectFile("app/dashboard/page.tsx");

    assert.match(source, /const resumeSlug = p\.next_slug \?\? data\.lessons\[0\]\?\.slug \?\? "lesson-01"/);
    assert.match(source, /const methodHref = `\/foundations\/\$\{resumeSlug\}`/);
    assert.match(source, /href=\{methodHref\}/);
    assert.match(source, /Start The Method/);
    assert.match(source, /Resume The Method/);
    assert.doesNotMatch(source, /started \? resumeSlug : "lesson-01"/);
  });

  it("does not show a competing empty-dashboard diagnostic CTA while Method owns Day 1", () => {
    const source = readProjectFile("app/dashboard/page.tsx");

    assert.match(source, /methodEntryPending/);
    assert.match(source, /dash\.data\?\.enrolled && !hasData && !methodEntryPending/);
  });

  it("adds The Method to the dashboard program navigation", () => {
    const source = readProjectFile("app/dashboard/layout.tsx");

    assert.match(source, /\{ href: "\/foundations", label: "The Method" \}/);
  });
});
