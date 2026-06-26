import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("sale offer framework", () => {
  it("derives campaign prices from the internal coupon registry", () => {
    const source = readProjectFile("lib/sale-offers.ts");

    assert.match(source, /slug: "launch-half-off-499"/);
    assert.match(source, /couponCode: "HALFOFF499"/);
    assert.match(source, /STANDARD_FLAGSHIP_PRICE_CENTS = 99900/);
    assert.match(source, /PROMO_CODE_DISCOUNTS_CENTS/);
    assert.match(source, /FINALHOUR: 90000/);
    assert.match(source, /salePriceCents: 49900/);
    assert.match(source, /savingsCents: 50000/);
    assert.match(source, /checkoutHrefForSaleOffer/);
    assert.match(source, /coupon: offer\.couponCode/);
    assert.match(source, /getSaleOfferByCode/);
    assert.match(source, /"this"/);
    assert.match(source, /params\.get\("this"\)/);
    assert.match(source, /firstQueryValue\(searchParams\.this\)/);
    assert.match(source, /buildSaleOfferFromQuery/);
    assert.match(source, /normalizeCouponCode/);
    assert.match(source, /\^\[A-Z0-9\]\{2,32\}\$/);
    assert.doesNotMatch(source, /parseDollarParam/);
    assert.doesNotMatch(source, /firstQueryValue\(searchParams\.price\)/);
    assert.doesNotMatch(source, /firstQueryValue\(searchParams\.savings\)/);
    assert.doesNotMatch(source, /params\.set\("price"/);
    assert.doesNotMatch(source, /params\.set\("savings"/);
  });

  it("renders campaign routes and 404s unknown offer codes", () => {
    const source = readProjectFile("app/sale/[slug]/page.tsx");

    assert.match(source, /generateStaticParams/);
    assert.match(source, /searchParams: Promise<SalePageQueryInput>/);
    assert.match(source, /splitSaleVariantSlug\(slug\)/);
    assert.match(source, /buildSaleOfferFromQuery\(baseSlug, sp\)/);
    assert.match(source, /notFound\(\)/);
    assert.match(source, /checkoutHrefForSaleOffer\(offer\)/);
    assert.match(source, /pay-in-full checkout/);
    assert.match(source, /50% off BarMatrix Flagship/);
    assert.match(source, /Open \{price\} checkout/);
    assert.match(source, /Code attached before checkout/);
    assert.match(source, /Payment\s+plans use the standard checkout/);
    assert.match(source, /The 50% off sale applies to pay-in-full checkout/);
    assert.match(source, /matched to the campaign code/);
    assert.match(source, /robots: \{ index: false, follow: false \}/);
    assert.match(source, /Red-Zone Map/);
    assert.doesNotMatch(source, /two_pay_500_499/);
    assert.doesNotMatch(source, /comes from the URL/);
    assert.doesNotMatch(source, /checkout does not yet support/i);
    assert.doesNotMatch(source, /split-pay approval/i);
    assert.doesNotMatch(source, /guarantee/i);
  });

  it("supports the opaque win route without exposing sale mechanics in the URL", () => {
    const source = readProjectFile("app/win/[slug]/page.tsx");

    assert.match(source, /generateMetadata/);
    assert.match(source, /\.\.\/\.\.\/sale\/\[slug\]\/page/);
    assert.doesNotMatch(source, /price/);
    assert.doesNotMatch(source, /savings/);
  });

  it("keeps coupon traffic locked to pay-in-full checkout", () => {
    const source = readProjectFile("app/checkout/checkout-client.tsx");

    assert.match(source, /function getCouponCode/);
    assert.match(source, /params\.get\("coupon"\)/);
    assert.match(source, /params\.get\("code"\)/);
    assert.match(source, /params\.get\("promo"\)/);
    assert.match(source, /Coupons apply to pay-in-full checkout only/);
    assert.match(source, /plan === "two_pay_500_499" && hasCouponContext/);
    assert.match(source, /disabled=\{phase === "redirecting" \|\| hasCouponContext\}/);
    assert.match(source, /Payment plan unavailable with coupon/);
  });

  it("keeps the flash sale preview on supported payment terms", () => {
    const source = readProjectFile("app/preview/pricing-flash-sale/page.tsx");

    assert.match(source, /Flash-sale pricing variant for BarMatrix Flagship at \$499 pay-in-full checkout/);
    assert.match(source, /The payment plan stays on standard pricing/);
    assert.match(source, /not part of this 50% off campaign/);
    assert.doesNotMatch(source, /\$250/);
    assert.doesNotMatch(source, /\$249/);
    assert.doesNotMatch(source, /checkout does not yet support/i);
    assert.doesNotMatch(source, /split-pay approval/i);
    assert.doesNotMatch(source, /Hold split-pay/i);
  });
});
