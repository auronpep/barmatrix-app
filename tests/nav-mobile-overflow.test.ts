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

  it("keeps the signed-in dashboard CTA out of the phone top bar", () => {
    const mobileNav = readProjectFile("components/mobile-nav.tsx");
    const css = readProjectFile("app/globals.css");

    assert.match(mobileNav, /href: "\/dashboard\/path", label: "Dashboard"/);
    assert.match(css, /\.nav-cta > \.btn\.ghost\s*\{[^}]*display:\s*none;/s);
    assert.match(css, /\.nav-inner \{[^}]*gap: 8px;/s);
    assert.match(css, /\.nav-cta \{[^}]*gap: 8px;/s);
  });
});
