import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const CUSTOMER_STUDY_SURFACES = [
  "app/timed-sets/page.tsx",
  "app/drills/civil-procedure/page.tsx",
  "app/drills/constitutional-law/page.tsx",
  "app/drills/contracts/page.tsx",
  "app/drills/criminal-law/page.tsx",
  "app/drills/evidence/page.tsx",
  "app/drills/real-property/page.tsx",
  "app/drills/torts/page.tsx",
  "app/subjects/civil-procedure/page.tsx",
  "app/subjects/constitutional-law/page.tsx",
  "app/subjects/contracts/page.tsx",
  "app/subjects/criminal-law/page.tsx",
  "app/subjects/evidence/page.tsx",
  "app/subjects/real-property/page.tsx",
  "app/subjects/torts/page.tsx",
] as const;

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("customer-facing study surface labels", () => {
  it("does not expose source IDs, API labels, or endpoint diagnostics", () => {
    for (const path of CUSTOMER_STUDY_SURFACES) {
      const source = readProjectFile(path);

      assert.doesNotMatch(source, /SRC-\d{4}/, path);
      assert.doesNotMatch(source, /BY-SUBJECT API/, path);
      assert.doesNotMatch(source, /Inline forensics/, path);
      assert.doesNotMatch(source, /by-subject endpoint/i, path);
      assert.doesNotMatch(source, /subject endpoint/i, path);
      assert.doesNotMatch(source, /The route is live/i, path);
    }
  });

  it("uses product-language badges on the paid study surfaces", () => {
    const timedSets = readProjectFile("app/timed-sets/page.tsx");
    const contractsDrill = readProjectFile("app/drills/contracts/page.tsx");
    const civilSubject = readProjectFile("app/subjects/civil-procedure/page.tsx");

    assert.match(timedSets, /Live mixed bank/);
    assert.match(contractsDrill, /Wrong-answer forensics/);
    assert.match(contractsDrill, /Guided review/);
    assert.match(civilSubject, /Subject bank/);
    assert.match(civilSubject, /Live practice/);
  });
});
