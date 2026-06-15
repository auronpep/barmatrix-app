import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("trap detail page keeps trap slug for behavior but not visible header copy", () => {
  const source = readProjectFile("app/traps/[slug]/page.tsx");

  assert.match(source, /<YourTrapHistory slug=\{detail\.slug\} \/>/);
  assert.match(
    source,
    /href=\{`\/practice\?trap=\$\{encodeURIComponent\(detail\.slug\)\}`\}/,
  );
  assert.doesNotMatch(
    source,
    /<p className="mt-2 font-mono text-xs text-zinc-400">\s*\{detail\.slug\}\s*<\/p>/,
  );
});

test("tension detail page keeps tension slug for behavior but not visible header copy", () => {
  const source = readProjectFile("app/tensions/[slug]/page.tsx");

  assert.match(source, /slug=\{detail\.slug\}/);
  assert.match(
    source,
    /href=\{`\/practice\?tension=\$\{encodeURIComponent\(detail\.slug\)\}`\}/,
  );
  assert.match(
    source,
    /href=\{`\/drills\?tension=\$\{encodeURIComponent\(detail\.slug\)\}`\}/,
  );
  assert.doesNotMatch(
    source,
    /<p className="mt-2 font-mono text-xs text-zinc-400">\s*\{detail\.slug\}\s*<\/p>/,
  );
});

test("trap and tension detail subject distributions humanize subject labels", () => {
  const traps = readProjectFile("app/traps/[slug]/page.tsx");
  const tensions = readProjectFile("app/tensions/[slug]/page.tsx");

  assert.match(traps, /import \{ humanizeSubject \} from "@\/lib\/format-subject";/);
  assert.match(traps, /const subjectLabel = humanizeSubject\(entry\.subject\);/);
  assert.match(traps, /<span className="text-zinc-800">\{subjectLabel\}<\/span>/);
  assert.doesNotMatch(traps, /<span className="text-zinc-800">\{entry\.subject\}<\/span>/);

  assert.match(tensions, /import \{ humanizeSubject \} from "@\/lib\/format-subject";/);
  assert.match(tensions, /const subjectLabel = humanizeSubject\(entry\.subject\);/);
  assert.match(tensions, /\{humanizeSubject\(detail\.subject\)\}/);
  assert.match(tensions, /<span className="text-zinc-800">\{subjectLabel\}<\/span>/);
  assert.doesNotMatch(tensions, /<span className="text-zinc-800">\{entry\.subject\}<\/span>/);
});
