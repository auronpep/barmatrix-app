import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("checkout success only confirms enrollment after status verification", () => {
  const page = readFileSync("app/checkout/success/page.tsx", "utf8");
  const hero = readFileSync("app/checkout/success/checkout-success-hero.tsx", "utf8");

  assert.match(page, /api\.getCheckoutStatus\(checkoutSessionId\)/);
  assert.match(page, /activationState\.kind === "confirmed"/);
  assert.match(
    page,
    /activationState\.kind === "confirmed"[\s\S]*<PurchaseSuccessTracker \/>/,
  );
  assert.match(hero, /Activation check pending/);
  assert.match(hero, /Checkout verification needed/);
});

test("checkout success upgrades the page when signed-in account is already active", () => {
  const page = readFileSync("app/checkout/success/page.tsx", "utf8");
  const hero = readFileSync("app/checkout/success/checkout-success-hero.tsx", "utf8");

  assert.match(page, /<CheckoutSuccessHero/);
  assert.match(hero, /import \{ useDashboard \} from "@\/lib\/use-dashboard";/);
  assert.match(hero, /const signedInAccessActive = dash\.data\?\.enrolled === true/);
  assert.match(hero, /Signed-in access confirmed/);
  assert.match(hero, /Your Flagship access is active\./);
  assert.match(hero, /Start with Lead Me; The Method and account tools stay available after the first task\./);
  assert.match(hero, /Open Lead Me/);
  assert.match(hero, /href="\/foundations" className="btn btn-lg ghost"/);
  assert.match(
    hero,
    /className=\{signedInAccessActive \? "btn btn-lg ghost" : "btn btn-lg red"\}/,
  );
});
