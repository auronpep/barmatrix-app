import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("account entitlement state", () => {
  it("renders live signed-in enrollment state instead of only URL-derived status", () => {
    const page = readProjectFile("app/account/page.tsx");
    const status = readProjectFile("app/account/account-status.tsx");

    assert.match(page, /<AccountAccessPanel \/>/);
    assert.match(page, /<AccountEntitlementPanel/);
    assert.match(status, /useDashboard\(\)/);
    assert.match(status, /dash\.data\?\.enrolled/);
    assert.match(status, /Account active/);
    assert.match(status, /Open dashboard/);
  });
});
