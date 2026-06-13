import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("tension detail catalog fallback", () => {
  it("falls back to the catalog entry when an observed detail endpoint 404s", () => {
    const source = readProjectFile("lib/tensions.ts");

    assert.match(source, /export function detailFromTensionCatalogEntry/);
    assert.match(source, /const catalog = await getTensionCatalog\(\);/);
    assert.match(
      source,
      /const entry = catalog\.tensions\.find\(\(tension\) => tension\.slug === slug\);/,
    );
    assert.match(
      source,
      /return detailFromTensionCatalogEntry\(entry, catalog\.catalog_ready\);/,
    );
    assert.match(
      source,
      /subject_distribution: entry\.subject\s+\? \[\{ subject: entry\.subject, question_count: entry\.question_count \}\]\s+: \[\]/,
    );
  });
});
