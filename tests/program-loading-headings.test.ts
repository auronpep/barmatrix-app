import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("paid program loading states", () => {
  it("keeps the guided path page headed while the day plan loads", () => {
    const source = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(source, /Preparing today&apos;s path/);
    assert.match(source, /<h1 className="sr-only">\s*Lead Me\s*<\/h1>/);
  });

  it("keeps the certification page headed while certification status loads", () => {
    const source = readProjectFile("app/certification/page.tsx");

    assert.match(source, /Loading certification/);
    assert.match(
      source,
      /<h1 className="sr-only">\s*C3 Mastery Certification\s*<\/h1>/,
    );
  });
});
