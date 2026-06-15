import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("checkout coupon context", () => {
  it("surfaces coupon intent and locks discounted visitors to pay-in-full checkout", () => {
    const source = readProjectFile("app/checkout/checkout-client.tsx");

    assert.match(source, /function getCouponCode/);
    assert.match(source, /params\.get\("coupon"\)/);
    assert.match(source, /params\.get\("code"\)/);
    assert.match(source, /params\.get\("promo"\)/);

    assert.match(source, /Coupons apply to pay-in-full checkout only/);
    assert.match(source, /Code \{attribution\.coupon\} will be applied automatically/);
    assert.match(source, /coupon_code: plan === "pay_in_full" \? getCouponCode\(checkoutSearchParams\) : null/);
    assert.match(source, /const hasCouponContext = attribution\.coupon !== null/);
    assert.match(source, /plan === "two_pay_500_499" && hasCouponContext/);
    assert.match(source, /disabled=\{phase === "redirecting" \|\| hasCouponContext\}/);
    assert.match(source, /Payment plan unavailable with coupon/);
  });
});
