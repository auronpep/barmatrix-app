import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("red-zone detail routing", () => {
  it("decodes dynamic route params before querying the red-zone detail API", () => {
    const source = readProjectFile("app/red-zones/[dimension]/[tag]/page.tsx");

    assert.match(source, /const dimension = decodeRouteParam\(firstParam\(params\?\.dimension\)\);/);
    assert.match(source, /const tag = decodeRouteParam\(firstParam\(params\?\.tag\)\);/);
    assert.match(source, /api\.getMyRedZoneDetail\(token, dimension, tag\)/);
    assert.match(source, /function decodeRouteParam\(value: string\): string/);
    assert.doesNotMatch(source, /decodeURIComponent\(tag\) : "Red zone"/);
  });
});
