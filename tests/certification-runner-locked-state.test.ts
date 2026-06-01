import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("certification competency locked state", () => {
  it("maps auth and gate API statuses to user-facing states", () => {
    const page = readProjectFile("app/certification/[competencyId]/page.tsx");

    assert.match(page, /err\.status === 401[\s\S]*return "signed_out"/);
    assert.match(page, /err\.status === 403[\s\S]*return "locked"/);
  });

  it("renders a Method CTA instead of a raw API error for locked competencies", () => {
    const page = readProjectFile("app/certification/[competencyId]/page.tsx");

    assert.match(page, /error === "locked"/);
    assert.match(page, /href="\/foundations"/);
    assert.match(page, /Finish The Method before taking this competency/);
    assert.doesNotMatch(page, /Couldn&apos;t load this competency: \{error\}/);
  });
});
