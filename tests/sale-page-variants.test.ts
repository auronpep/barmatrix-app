import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync } from "node:fs";
import { saleStaticParams, splitSaleVariantSlug } from "../lib/sale-offers.ts";

describe("sale page variants", () => {
  it("maps suffix routes to the base campaign slug", () => {
    assert.deepEqual(splitSaleVariantSlug("launch-half-off-499"), {
      baseSlug: "launch-half-off-499",
      variant: "standard",
    });
    assert.deepEqual(splitSaleVariantSlug("launch-half-off-499_jly"), {
      baseSlug: "launch-half-off-499",
      variant: "legacy",
    });
    assert.deepEqual(splitSaleVariantSlug("launch-half-off-499_flash"), {
      baseSlug: "launch-half-off-499",
      variant: "flash",
    });
  });

  it("prebuilds every direct-link variant for each registered offer", () => {
    const slugs = saleStaticParams().map((param) => param.slug);

    assert.ok(slugs.includes("launch-half-off-499"));
    assert.ok(slugs.includes("launch-half-off-499_jly"));
    assert.ok(slugs.includes("launch-half-off-499_flash"));
  });

  it("keeps the current homepage archive available by direct _jly route", () => {
    assert.equal(existsSync("app/victory_jly/page.tsx"), true);
  });
});
