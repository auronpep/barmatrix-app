import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("public entry, pricing, and checkout lead to complimentary registration", () => {
  const homeEntry = readFileSync("app/page.tsx", "utf8");
  const home = readFileSync("app/preview/homepage-diagnostic/page.tsx", "utf8");
  const auth = readFileSync("app/auth-form.tsx", "utf8");
  const checkout = readFileSync("app/checkout/page.tsx", "utf8");
  const pricing = readFileSync("app/pricing/page.tsx", "utf8");
  const results = readFileSync("app/diagnostic/[session]/results/page.tsx", "utf8");

  assert.match(homeEntry, /homepage-diagnostic/);
  assert.match(home, /Start free diagnostic/i);
  assert.match(home, /Create free account/i);
  assert.match(auth, /Registration is free/);
  assert.match(auth, /No card required/);
  assert.match(checkout, /permanentRedirect\("\/sign-up\?after=dashboard\/path"\)/);
  assert.match(pricing, /permanentRedirect\("\/sign-up\?after=dashboard\/path"\)/);
  assert.match(results, /Complimentary registration is open/);
  assert.match(results, /No card or checkout is required/);
  assert.doesNotMatch(results, /BarMatrix Flagship is \$999/);
});
