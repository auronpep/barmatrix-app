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

  it("shows a checking account panel before signed-in status resolves", () => {
    const status = readProjectFile("app/account/account-status.tsx");

    assert.match(status, /if \(dash\.loading\)/);
    assert.match(status, /Checking account status/);
    assert.doesNotMatch(
      status,
      /if \(dash\.signedIn && dash\.loading\)/,
      "auth-loading state must not fall through to the signed-out launch placeholder",
    );
  });

  it("keeps the account fallback pointed at live sign-in, not launch-placeholder copy", () => {
    const copy = readProjectFile("lib/copy.ts");
    const status = readProjectFile("app/account/account-status.tsx");

    assert.match(status, /ACCOUNT_PLACEHOLDER/);
    assert.match(copy, /Open your BarMatrix account\./);
    assert.match(copy, /Sign in with the email used at checkout/);
    assert.match(copy, /\/sign-in\?after=account/);
    assert.doesNotMatch(copy, /coming online/);
    assert.doesNotMatch(copy, /check your email for your access details/);
  });
});
