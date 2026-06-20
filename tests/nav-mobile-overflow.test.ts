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

    assert.match(layout, /<NavPrimaryCta className="btn btn-sm red hide-md" \/>/);
    assert.match(css, /\.nav-cta \.hide-md \{ display: none; \}/);
  });

  it("keeps the signed-in dashboard CTA out of the phone top bar", () => {
    const mobileNav = readProjectFile("components/mobile-nav.tsx");
    const css = readProjectFile("app/globals.css");

    assert.doesNotMatch(mobileNav, /href: "\/dashboard\/path", label: "Dashboard"/);
    assert.match(css, /\.nav-cta > \.btn\.ghost\s*\{[^}]*display:\s*none;/s);
    assert.match(css, /\.nav-inner \{[^}]*gap: 8px;/s);
    assert.match(css, /\.nav-cta \{[^}]*gap: 8px;/s);
  });

  it("uses auth-aware primary CTAs instead of repeating Free Diagnostic for signed-in users", () => {
    const layout = readProjectFile("app/layout.tsx");
    const mobileNav = readProjectFile("components/mobile-nav.tsx");
    const navAuth = readProjectFile("app/nav-auth.tsx");

    assert.match(layout, /<NavPrimaryCta className="btn btn-sm red hide-md" \/>/);
    assert.match(mobileNav, /<NavPrimaryCta\s+className="mobile-nav-link mobile-nav-cta"\s+onClick=\{\(\) => setOpen\(false\)\}\s+\/>/s);
    assert.match(mobileNav, /<NavPrimaryCta[\s\S]*\{NAV_LINKS\.map/);
    assert.match(navAuth, /href="\/dashboard\/path"/);
    assert.match(navAuth, /My Path/);
  });
});
