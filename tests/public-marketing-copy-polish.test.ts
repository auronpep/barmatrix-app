import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("public marketing copy polish", () => {
  it("does not expose internal source IDs on prospect-facing pages", () => {
    const publicPages = ["app/about/page.tsx", "app/faq/page.tsx"];

    for (const path of publicPages) {
      const source = readProjectFile(path);
      assert.doesNotMatch(source, />SRC-\d{4}</, `${path} exposes a source stamp`);
    }
  });
});
