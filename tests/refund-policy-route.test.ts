import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

test("refund policy is a first-class checkout/legal route", () => {
  assert.ok(existsSync("app/refund/page.tsx"), "/refund must be restored");

  const refund = read("app/refund/page.tsx");
  assert.match(refund, /title:\s*"Refund Policy/);
  assert.match(refund, /3-day window/i);
  assert.match(refund, /support@barmatrix\.app/);
  assert.doesNotMatch(refund, /billing@barmatrix\.app/);
  assert.match(refund, /2-pay plan/i);
  assert.doesNotMatch(refund, /7-day/i);

  const layout = read("app/layout.tsx");
  assert.match(layout, /href="\/refund"/);
  assert.match(layout, /Refund Policy/);

  const checkout = read("app/checkout/checkout-client.tsx");
  assert.match(checkout, /href="\/refund"/);

  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /"\/refund"/);
});
