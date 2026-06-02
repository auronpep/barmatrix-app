import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("checkout success only confirms enrollment after status verification", () => {
  const page = readFileSync("app/checkout/success/page.tsx", "utf8");

  assert.match(page, /api\.getCheckoutStatus\(checkoutSessionId\)/);
  assert.match(page, /activationState\.kind === "confirmed"/);
  assert.match(
    page,
    /activationState\.kind === "confirmed"[\s\S]*<PurchaseSuccessTracker \/>/,
  );
  assert.match(page, /Activation check pending/);
  assert.match(page, /Checkout verification needed/);
});
