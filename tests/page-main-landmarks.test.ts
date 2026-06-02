import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

function findPageFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      return findPageFiles(entryPath);
    }
    return entry.isFile() && entry.name === "page.tsx" ? [entryPath] : [];
  });
}

test("root layout owns the only page-level main landmark", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");
  assert.match(layout, /<main>\s*{children}\s*<\/main>/);

  const pageFiles = findPageFiles("app");
  const pageFilesWithMain = pageFiles
    .filter((filePath) => /<main\b/.test(readFileSync(filePath, "utf8")))
    .map((filePath) => relative(process.cwd(), filePath));

  assert.deepEqual(pageFilesWithMain, []);
});
