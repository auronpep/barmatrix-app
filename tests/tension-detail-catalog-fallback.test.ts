import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("tension detail catalog fallback", () => {
  it("falls back to the catalog entry when an observed detail endpoint 404s", () => {
    const helper = readProjectFile("lib/tensions.ts");
    const page = readProjectFile("app/tensions/[slug]/page.tsx");

    assert.match(helper, /export function detailFromTensionCatalogEntry/);
    assert.match(page, /async function getTensionDetailOrCatalogFallback/);
    assert.match(page, /const detail = await getTensionDetail\(slug\);/);
    assert.match(page, /const catalog = await getTensionCatalog\(\);/);
    assert.match(
      page,
      /const entry = catalog\.tensions\.find\(\(tension\) => tension\.slug === slug\);/,
    );
    assert.match(
      page,
      /entry \? detailFromTensionCatalogEntry\(entry, catalog\.catalog_ready\) : null/,
    );
    assert.match(
      helper,
      /subject_distribution: entry\.subject\s+\? \[\{ subject: entry\.subject, question_count: entry\.question_count \}\]\s+: \[\]/,
    );
  });
});
