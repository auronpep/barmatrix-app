import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("public sales copy keeps the proof-before-price diagnostic path", () => {
  const copy = readFileSync("lib/copy.ts", "utf8");
  const home = readFileSync("app/page.tsx", "utf8");
  const pricing = readFileSync("app/pricing/page.tsx", "utf8");

  assert.match(copy, /proof should come before the price/i);
  assert.match(copy, /same diagnostic-to-repair loop/i);
  assert.match(home, /PROOF BEFORE PRICE/);
  assert.match(pricing, /Try the diagnostic first/);
  assert.match(pricing, /No card\. No commitment\./);
  assert.match(pricing, /href="\/checkout"|href=\{["']\/checkout["']\}/);
});
