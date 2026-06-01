import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("practice subject response normalization", () => {
  it("accepts the by-subject response shapes used by neighboring study surfaces", () => {
    const source = readProjectFile("app/practice/practice-client.tsx");

    assert.match(source, /function\s+pickQuestionArray\(payload:\s*unknown\):\s*unknown\[\]/);
    assert.match(source, /\["questions",\s*"items",\s*"results",\s*"data"\]/);
    assert.match(source, /function\s+normalizeQuestionId\(value:\s*unknown\):\s*string\s*\|\s*null/);
    assert.match(source, /asString\(value\.question_id\)\s*\?\?\s*asString\(value\.id\)/);
    assert.match(source, /pickQuestionArray\(payload\)\s*\.map\(normalizeQuestionId\)/);
  });
});
