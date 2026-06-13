import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("site brand accessible name", () => {
  it("does not expose the decorative B mark as part of the BarMatrix home link", () => {
    const source = readProjectFile("app/layout.tsx");

    assert.match(source, /<Link href="\/" className="brand" aria-label="BarMatrix home">/);
    assert.match(source, /<span className="mark" aria-hidden="true">B<\/span>/);
    assert.match(source, /<span className="dot" aria-hidden="true" \/>/);
  });
});
