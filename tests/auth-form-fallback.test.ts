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
    assert.match(signIn, /<AuthForm mode="sign-in" after=\{after\} \/>/);
    assert.match(signUp, /<AuthForm mode="sign-up" after=\{after\} \/>/);
  });

  it("renders immediate account-access copy before Clerk finishes loading", () => {
    const wrapper = readProjectFile("app/auth-form.tsx");

    assert.match(wrapper, /const isSignUp = mode === "sign-up";/);
    assert.match(wrapper, /<h1[^>]*>/);
    assert.match(wrapper, /Create your BarMatrix account/);
    assert.match(wrapper, /Sign in to BarMatrix/);
    assert.match(wrapper, /Continue to your dashboard and repair tools/);
  });

  it("passes sanitized after destinations into Clerk redirect props", () => {
    const wrapper = readProjectFile("app/auth-form.tsx");
    const helper = readProjectFile("app/auth-return-path.ts");
    const signIn = readProjectFile("app/sign-in/[[...sign-in]]/page.tsx");
    const signUp = readProjectFile("app/sign-up/[[...sign-up]]/page.tsx");

    assert.match(wrapper, /const returnPath = resolveAuthReturnPath\(after\);/);
    assert.match(wrapper, /forceRedirectUrl=\{returnPath\}/);
    assert.match(wrapper, /fallbackRedirectUrl=\{returnPath\}/);
    assert.match(wrapper, /signUpForceRedirectUrl=\{returnPath\}/);
    assert.match(wrapper, /signInForceRedirectUrl=\{returnPath\}/);
    assert.match(signIn, /const after = Array\.isArray\(params\?\.after\) \? params\.after\[0\] : params\?\.after;/);
    assert.match(signUp, /const after = Array\.isArray\(params\?\.after\) \? params\.after\[0\] : params\?\.after;/);
    assert.match(helper, /function resolveAuthReturnPath\(after: string \| null \| undefined\): string/);
    assert.match(helper, /dashboard: "\/dashboard"/);
    assert.match(helper, /AUTH_RETURN_PATHS\[normalized\] \?\? "\/dashboard"/);
    assert.doesNotMatch(wrapper, /return after;/);
  });

  it("keeps the no-Clerk fallback on the same sanitized return path", () => {
    const unavailable = readProjectFile("app/auth-unavailable.tsx");
    const signIn = readProjectFile("app/sign-in/[[...sign-in]]/page.tsx");
    const signUp = readProjectFile("app/sign-up/[[...sign-up]]/page.tsx");

    assert.match(unavailable, /const returnPath = resolveAuthReturnPath\(after\);/);
    assert.match(unavailable, /href=\{returnPath\}/);
    assert.match(unavailable, /Use the email from checkout/);
    assert.match(unavailable, /Continue to dashboard/);
    assert.doesNotMatch(unavailable, /coming online/);
    assert.doesNotMatch(unavailable, /being connected for the cohort launch/);
    assert.match(signIn, /<AuthUnavailable mode="sign-in" after=\{after\} \/>/);
    assert.match(signUp, /<AuthUnavailable mode="sign-up" after=\{after\} \/>/);
  });
});
