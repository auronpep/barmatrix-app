import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("trap catalog retires the Misconception column until authored content exists", () => {
  const source = readProjectFile("app/traps/page.tsx");

  assert.match(
    source,
    /const hasMisconceptionDimension =\s*catalog\.totals\.misconception_count > 0;/,
    "the page should gate the Misconception dimension on API totals",
  );
  assert.match(
    source,
    /hasMisconceptionDimension\s*\?\s*"[^"]*misconceptions[^"]*"\s*:\s*"[^"]*wrong-answer architectures[^"]*"/s,
    "intro copy should not promise misconceptions when that dimension has no rows",
  );
  assert.match(
    source,
    /{hasMisconceptionDimension && \(\s*<TrapColumn\s+title="Misconception"/s,
    "the Misconception column should render only when the dimension exists",
  );
});

test("trap catalog cards do not expose raw trap slugs as visible copy", () => {
  const source = readProjectFile("app/traps/page.tsx");

  assert.match(source, /href=\{`\/traps\/\$\{encodeURIComponent\(trap\.slug\)\}`\}/);
  assert.match(source, /<PersonalTrapBadge slug=\{trap\.slug\} \/>/);
  assert.doesNotMatch(
    source,
    /<span className="mt-0\.5 block break-all[^"]*">\s*\{trap\.slug\}\s*<\/span>/,
  );
});
