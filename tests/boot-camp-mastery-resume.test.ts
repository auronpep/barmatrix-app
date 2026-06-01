import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("boot-camp mastery resume", () => {
  it("passes mastery answered ids and initial correct count into QuestionRunner", () => {
    const page = readProjectFile("app/boot-camps/sessions/[session_id]/mastery/page.tsx");
    const apiClient = readProjectFile("lib/api-client.ts");

    assert.match(apiClient, /answered_question_ids:\s*string\[\]/);
    assert.match(apiClient, /correct_count:\s*number/);
    assert.match(page, /answeredQuestionIds:\s*masteryStart\.answered_question_ids/);
    assert.match(page, /initialCorrect:\s*masteryStart\.correct_count/);
    assert.match(page, /initialCorrect=\{state\.data\.initialCorrect\}/);
  });
});
