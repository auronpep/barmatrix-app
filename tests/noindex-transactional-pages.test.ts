import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("transactional and auth page indexing", () => {
  it("marks checkout return and auth pages as noindex", () => {
    const pages = [
      "app/checkout/page.tsx",
      "app/checkout/success/page.tsx",
      "app/sign-in/[[...sign-in]]/page.tsx",
      "app/sign-up/[[...sign-up]]/page.tsx",
    ];

    for (const pagePath of pages) {
      const source = readProjectFile(pagePath);
      assert.match(source, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
    }
  });
});
