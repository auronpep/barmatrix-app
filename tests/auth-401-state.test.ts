import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("auth-gated study hooks", () => {
  it("falls foundations back to the public outline when the saved session is rejected", () => {
    const source = readProjectFile("lib/use-foundations.ts");

    assert.match(source, /isAuthRejected\(err\)/);
    assert.match(source, /await api\.listFoundations\(\)/);
    assert.match(source, /signedOut:\s*true/);
  });

  it("treats stale C3 and red-zone sessions as signed out instead of raw API errors", () => {
    const c3 = readProjectFile("lib/use-c3.ts");
    const redZones = readProjectFile("lib/use-red-zones.ts");

    for (const source of [c3, redZones]) {
      assert.match(source, /isAuthRejected\(err\)/);
      assert.match(source, /signedOut:\s*true/);
      assert.match(source, /signedIn:\s*false/);
      assert.doesNotMatch(source, /`API \$\{err\.status\}`/);
    }
  });
});
