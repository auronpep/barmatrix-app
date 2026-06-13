import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("certification public labels", () => {
  it("does not expose prototype/sample certification copy in the runner", () => {
    const page = readProjectFile("app/certification/[competencyId]/page.tsx");

    assert.doesNotMatch(page, /fixed sample items/i);
    assert.doesNotMatch(page, /sample items/i);
    assert.match(page, /Auto-graded on submit/);
  });

  it("formats certification ids, capture modes, and option values before display", () => {
    const page = readProjectFile("app/certification/[competencyId]/page.tsx");
    const scorecard = readProjectFile("app/certification/page.tsx");

    assert.match(page, /formatCertificationCode\(comp\.id\)/);
    assert.match(page, /formatCertificationCapture\(comp\.capture\)/);
    assert.match(page, /formatCertificationOption\(o\)/);
    assert.match(page, /formatCertificationOption\(p\.your\)/);
    assert.match(page, /formatCertificationOption\(p\.key\)/);
    assert.doesNotMatch(page, /comp\.capture\.replace\(/);

    assert.match(scorecard, /formatCertificationCode\(comp\.id\)/);
    assert.match(scorecard, /formatCertificationCapture\(comp\.capture\)/);
    assert.doesNotMatch(scorecard, /comp\.capture\.replace\(/);
  });
});
