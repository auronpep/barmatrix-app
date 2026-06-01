import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("auth form fallback", () => {
  it("renders a visible fallback when Clerk's hosted auth UI does not load", () => {
    const wrapper = readProjectFile("app/auth-form.tsx");
    const signIn = readProjectFile("app/sign-in/[[...sign-in]]/page.tsx");
    const signUp = readProjectFile("app/sign-up/[[...sign-up]]/page.tsx");

    assert.match(wrapper, /"use client"/);
    assert.match(wrapper, /AUTH_FORM_TIMEOUT_MS\s*=\s*3000/);
    assert.match(wrapper, /setShowFallback\(true\)/);
    assert.match(wrapper, /role="status"/);
    assert.match(wrapper, /Account access is taking longer than expected/);
    assert.match(signIn, /<AuthForm mode="sign-in" \/>/);
    assert.match(signUp, /<AuthForm mode="sign-up" \/>/);
  });
});
