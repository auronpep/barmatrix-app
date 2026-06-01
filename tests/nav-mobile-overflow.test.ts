import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("mobile navigation width", () => {
  it("hides the secondary diagnostic CTA at mobile/tablet widths", () => {
    const layout = readProjectFile("app/layout.tsx");
    const css = readProjectFile("app/globals.css");

    assert.match(layout, /href="\/diagnostic" className="btn btn-sm red hide-md"/);
    assert.match(css, /\.nav-cta \.hide-md \{ display: none; \}/);
  });
});
