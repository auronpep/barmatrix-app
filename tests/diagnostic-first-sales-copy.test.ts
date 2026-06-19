import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readActiveHomePage(): string {
  const entry = readFileSync("app/page.tsx", "utf8");
  const match = entry.match(/export \{ default, metadata \} from "\.\/([^"]+)\/page";/);
  return match ? readFileSync(`app/${match[1]}/page.tsx`, "utf8") : entry;
}

test("public sales copy keeps the proof-before-price diagnostic path", () => {
  const copy = readFileSync("lib/copy.ts", "utf8");
  const home = readActiveHomePage();
  const diagnostic = readFileSync("app/diagnostic/diagnostic-page-client.tsx", "utf8");
  const pricing = readFileSync("app/pricing/page.tsx", "utf8");

  assert.match(copy, /proof should come before the price/i);
  assert.match(copy, /same diagnostic-to-repair loop/i);
  assert.match(copy, /diagnostic-first MBE repair system/);
  assert.match(home, /PROOF BEFORE PRICE/);
  assert.match(home, /RED-ZONE MAP/);
  assert.match(home, /Assigned repair drills tied to your diagnostic misses/);
  assert.match(diagnostic, /Assigned repair drills tied to your diagnostic misses/);
  assert.match(pricing, /Try the diagnostic first/);
  assert.match(pricing, /Price comes after the Red-Zone Map/);
  assert.match(pricing, /No card\. No commitment\./);
  assert.match(pricing, /href="\/checkout"|href=\{["']\/checkout["']\}/);

  for (const source of [copy, home, diagnostic, pricing]) {
    assert.doesNotMatch(source, /finite universe/);
    assert.doesNotMatch(source, /forensic bank/);
    assert.doesNotMatch(source, /question-bank access/);
    assert.doesNotMatch(source, /resource dashboard/);
    assert.doesNotMatch(source, /Sample assigned drills/);
    assert.doesNotMatch(source, /try before you buy/i);
  }
});
