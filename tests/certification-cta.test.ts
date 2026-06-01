import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("certification locked CTA", () => {
  it("uses the dedicated red Method CTA class", () => {
    const page = readProjectFile("app/certification/page.tsx");

    assert.match(
      page,
      /href="\/foundations"\s+className="certification-method-cta"/,
    );
    assert.match(page, /Go to The Method/);
  });

  it("keeps the Method CTA style readable", () => {
    const css = readProjectFile("app/globals.css");

    assert.match(css, /\.certification-method-cta\s*\{[^}]*background:\s*var\(--red\)/s);
    assert.match(css, /\.certification-method-cta\s*\{[^}]*color:\s*white/s);
    assert.doesNotMatch(css, /\.certification-method-cta\s*\{[^}]*text-transform:\s*uppercase/s);
  });
});
