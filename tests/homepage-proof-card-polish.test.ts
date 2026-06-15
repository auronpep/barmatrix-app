import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("homepage proof card polish", () => {
  it("does not describe the main proof visual as a demo or illustrative mockup", () => {
    const page = readProjectFile("app/page.tsx");
    const css = readProjectFile("app/globals.css");

    assert.doesNotMatch(page, /Illustrative example/i);
    assert.doesNotMatch(page, /demo-caption/);
    assert.doesNotMatch(css, /demo-caption/);
    assert.match(page, /Diagnostic output example/);
    assert.match(css, /proof-caption/);
  });
});
