import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("boot-camp public labels", () => {
  it("formats seeded tension and trap codes before rendering boot-camp targets", () => {
    const helper = readProjectFile("lib/boot-camps.ts");
    const catalog = readProjectFile("app/boot-camps/boot-camps-catalog.tsx");
    const detail = readProjectFile("app/boot-camps/[slug]/page.tsx");

    assert.match(helper, /function formatBootCampTargetLabel/);
    assert.match(helper, /Fourth Amendment Focus/);
    assert.match(helper, /Warrant Exception Focus/);
    assert.match(catalog, /formatBootCampTargetLabel\(value\)/);
    assert.match(detail, /formatBootCampTargetLabel\(value\)/);
    assert.doesNotMatch(catalog, /\{humanizeTag\(value\)\}/);
    assert.doesNotMatch(detail, /\{humanizeTag\(value\)\}/);
  });
});
