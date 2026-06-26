import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function readActiveHomePage(): string {
  const entry = readProjectFile("app/page.tsx");
  const match = entry.match(/export \{ default, metadata \} from "\.\/([^"]+)\/page";/);
  return match ? readProjectFile(`app/${match[1]}/page.tsx`) : entry;
}

describe("public marketing copy polish", () => {
  it("does not expose internal source IDs on prospect-facing pages", () => {
    const publicPages = ["app/about/page.tsx", "app/faq/page.tsx"];

    for (const path of publicPages) {
      const source = readProjectFile(path);
      assert.doesNotMatch(source, />SRC-\d{4}</, `${path} exposes a source stamp`);
    }
  });

  it("keeps the about page on supported product-method claims", () => {
    const source = readProjectFile("app/about/page.tsx");

    assert.doesNotMatch(source, /Vera Brooks/i);
    assert.doesNotMatch(source, /eleven years/i);
    assert.doesNotMatch(source, /years tutoring/i);
    assert.doesNotMatch(source, /founded 2026/i);
  });

  it("keeps the active homepage diagnostic-first and claim-safe", () => {
    const source = readActiveHomePage();

    assert.match(source, /Down to/);
    assert.match(source, /two answers/);
    assert.match(source, /Sample Red-Zone Map/);
    assert.match(source, /Pattern Dashboard/);
    assert.match(source, /One next repair task/);
    assert.match(source, /C3 turns a miss into four repairable dimensions/);
    assert.match(source, /Trap archetypes students can recognize again/);
    assert.match(source, /Pay in full/);
    assert.match(source, /Payment plan/);
    assert.match(source, /proof step/);

    assert.doesNotMatch(source, /pass rate/i);
    assert.doesNotMatch(source, /score increase/i);
    assert.doesNotMatch(source, /guaranteed pass/i);
    assert.doesNotMatch(source, /official NCBE/i);
    assert.doesNotMatch(source, /testimonial/i);
  });

  it("keeps public variants off unsupported volume and score framing", () => {
    for (const path of [
      "app/victory/page.tsx",
      "app/success/page.tsx",
      "app/pass/page.tsx",
    ]) {
      const source = readProjectFile(path);

      assert.doesNotMatch(source, /thousands of MBE questions/i);
      assert.doesNotMatch(source, /score plateaued/i);
      assert.doesNotMatch(source, /real exam/i);
    }
  });
});
