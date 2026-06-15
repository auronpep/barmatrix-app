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
  const drillPages = [
    "app/drills/civil-procedure/page.tsx",
    "app/drills/constitutional-law/page.tsx",
    "app/drills/contracts/page.tsx",
    "app/drills/criminal-law/page.tsx",
    "app/drills/evidence/page.tsx",
    "app/drills/real-property/page.tsx",
    "app/drills/torts/page.tsx",
  ];

  const subjectPages = [
    "app/subjects/civil-procedure/page.tsx",
    "app/subjects/constitutional-law/page.tsx",
    "app/subjects/contracts/page.tsx",
    "app/subjects/criminal-law/page.tsx",
    "app/subjects/evidence/page.tsx",
    "app/subjects/real-property/page.tsx",
    "app/subjects/torts/page.tsx",
  ];

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

  it("formats returned question metadata before rendering subject banks and drill cards", () => {
    const helper = readProjectFile("lib/study-labels.ts");
    const contractsDrill = readProjectFile("app/drills/contracts/page.tsx");
    const civilSubject = readProjectFile("app/subjects/civil-procedure/page.tsx");

    assert.match(helper, /function formatStudyLabel/);
    assert.match(helper, /function formatTensionLabel/);
    assert.match(helper, /function formatQuestionPreview/);
    assert.match(contractsDrill, /formatStudyLabel\(question\.subject/);
    assert.match(contractsDrill, /formatStudyLabel\(question\.topic/);
    assert.match(contractsDrill, /formatStudyLabel\(question\.subtopic/);
    assert.match(civilSubject, /formatStudyLabel\(question\.topic/);
    assert.match(civilSubject, /formatStudyLabel\(question\.subtopic/);
    assert.match(civilSubject, /formatTensionLabel\(question\.tension_point\)/);
    assert.match(civilSubject, /formatQuestionPreview\(/);
    assert.doesNotMatch(contractsDrill, /\{question\.topic && <span>\/ \{question\.topic\}<\/span>\}/);
    assert.doesNotMatch(civilSubject, /\{question\.topic \?\? SUBJECT\}/);
    assert.doesNotMatch(civilSubject, /Question preview pending/);
  });

  it("keeps formatter coverage on every subject and subject-drill page", () => {
    for (const page of drillPages) {
      const source = readProjectFile(page);

      assert.match(source, /formatStudyLabel\(question\.subject/);
      assert.match(source, /formatStudyLabel\(question\.topic/);
      assert.match(source, /formatStudyLabel\(question\.subtopic/);
      assert.doesNotMatch(source, /<span>\{question\.subject\}<\/span>/);
      assert.doesNotMatch(source, /\{question\.topic && <span>\/ \{question\.topic\}<\/span>\}/);
    }

    for (const page of subjectPages) {
      const source = readProjectFile(page);

      assert.match(source, /formatQuestionPreview\(question\.question_stem, question\.fact_pattern\)/);
      assert.match(source, /formatTensionLabel\(question\.tension_point\)/);
      assert.doesNotMatch(source, /Question preview pending/);
      assert.doesNotMatch(source, /Tension pending/);
    }
  });
});
