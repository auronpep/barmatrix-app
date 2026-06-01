import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("criminal-law drill subject coverage", () => {
  it("queries both Criminal Law and Criminal Procedure for the combined drill label", () => {
    const source = readProjectFile("app/drills/criminal-law/page.tsx");

    assert.match(
      source,
      /const\s+SUBJECTS\s*=\s*\["Criminal Law",\s*"Criminal Procedure"\]\s+as\s+const/,
    );
    assert.doesNotMatch(source, /const\s+SUBJECT\s*=\s*"Criminal Law"/);
    assert.match(source, /SUBJECTS\.map\(\(subject\)\s*=>\s*fetchSubjectQueue\(subject\)\)/);
    assert.match(source, /queues\.flat\(\)/);
  });
});
