import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("question runner answer-key debrief", () => {
  it("tries the answer-key debrief after submit and keeps the forensics fallback", () => {
    const source = readProjectFile("components/question-runner.tsx");

    assert.match(source, /AnswerKeyDebrief/);
    assert.match(source, /import type \{ DebriefData \}/);
    assert.match(source, /useClerkAuth/);
    assert.match(source, /api\.getAnswerKey\(question\.question_id, token\)/);
    assert.match(source, /setAnswerKey/);
    assert.match(source, /<AnswerKeyDebrief/);
    assert.match(source, /yourPick=\{selected/);
    assert.match(source, /continueLabel=\{nextLabel\}/);
    assert.match(source, /<ForensicsCard/);
  });

  it("renders continue controls at the top and bottom of the debrief", () => {
    const source = readProjectFile("components/redesign/answer-key-debrief.tsx");

    assert.match(source, /continueLabel\?: string/);
    assert.match(source, /TopContinue/);
    assert.match(source, /BottomContinue/);
    assert.match(source, /continueLabel=\{continueLabel\}/);
  });
});
