import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("coach page does not nest a second main landmark inside the root layout", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");
  const coachPage = readFileSync("app/coach/page.tsx", "utf8");

  assert.match(layout, /<main>\s*{children}\s*<\/main>/);
  assert.doesNotMatch(coachPage, /<main\b/);
});
