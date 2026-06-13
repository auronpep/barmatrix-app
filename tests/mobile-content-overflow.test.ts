import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function subjectPageFiles(): string[] {
  return readdirSync(new URL("../app/subjects", import.meta.url), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join("app/subjects", entry.name, "page.tsx"));
}

describe("mobile content overflow guards", () => {
  it("lets subject question identifiers and metadata wrap inside mobile cards", () => {
    const css = readProjectFile("app/globals.css");
    assert.match(css, /\.break-anywhere\s*{/);
    assert.match(css, /overflow-wrap:\s*anywhere/);

    for (const filePath of subjectPageFiles()) {
      const source = readProjectFile(filePath);
      assert.match(
        source,
        /className="eyebrow-strong break-anywhere"/,
        `${filePath} should wrap long question identifiers`,
      );
      assert.match(
        source,
        /className="mono break-anywhere"/,
        `${filePath} should wrap long topic and chip metadata`,
      );
    }
  });

  it("lets trap and tension catalog rows shrink instead of forcing document overflow", () => {
    const traps = readProjectFile("app/traps/page.tsx");
    const tensions = readProjectFile("app/tensions/page.tsx");

    assert.match(traps, /className="min-w-0"/);
    assert.match(traps, /className="min-w-0"/);
    assert.match(traps, /className="flex min-w-0 w-full flex-col items-start/);
    assert.doesNotMatch(traps, /<span className="mt-0\.5 block break-all[^"]*">\s*\{trap\.slug\}\s*<\/span>/);

    assert.match(tensions, /<li[^>]+className="min-w-0"/);
    assert.match(tensions, /className="flex min-w-0 w-full flex-col items-start/);
    assert.match(tensions, /className="min-w-0 break-words/);
  });

  it("formats tension subject headings instead of exposing DB enum values", () => {
    const tensions = readProjectFile("app/tensions/page.tsx");

    assert.match(tensions, /import \{ humanizeSubject \} from "@\/lib\/format-subject";/);
    assert.match(tensions, /\{humanizeSubject\(subject\)\}/);
    assert.doesNotMatch(tensions, /<h2[^>]*>\s*\{subject\}\s*<\/h2>/);
  });
});
