import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("diagnostic results enrolled CTA", () => {
  it("uses account state so enrolled students are not shown the enrollment upsell", () => {
    const source = readProjectFile("app/diagnostic/[session]/results/page.tsx");

    assert.match(source, /useDashboard\(\)/);
    assert.match(source, /dashboard\.data\?\.enrolled/);
    assert.match(source, /Open dashboard/);
    assert.match(source, /href="\/red-zones"/);
    assert.match(source, /<ResultsCta dashboard=\{dashboard\} \/>/);
  });
});
