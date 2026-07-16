import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("red-zone repair drill", () => {
  it("starts a prescribed drill for the exact zone and opens its runner", () => {
    const source = readProjectFile("app/red-zones/[dimension]/[tag]/page.tsx");

    assert.match(source, /kind:\s*"prescribed_red_zone"/);
    assert.match(source, /red_zone_dimension:\s*data\.dimension/);
    assert.match(source, /red_zone_tag:\s*data\.tag/);
    assert.match(source, /api\.startDrill\([\s\S]*?,\s*token,?\s*\)/);
    assert.match(source, /router\.push\(`\/drills\/\$\{result\.drill_id\}`\)/);
    assert.match(source, /Building repair drill/);
    assert.doesNotMatch(source, /subject repair drill isn&apos;t available/);
  });
});
