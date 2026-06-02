import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("security response headers", () => {
  it("configures baseline browser security headers for every route", () => {
    const config = readProjectFile("next.config.ts");

    assert.match(config, /async headers\(\)/);
    assert.match(config, /source:\s*"\/:path\*"/);
    assert.match(config, /key:\s*"X-Content-Type-Options"[\s\S]*value:\s*"nosniff"/);
    assert.match(
      config,
      /key:\s*"Referrer-Policy"[\s\S]*value:\s*"strict-origin-when-cross-origin"/,
    );
    assert.match(config, /key:\s*"X-Frame-Options"[\s\S]*value:\s*"SAMEORIGIN"/);
    assert.match(
      config,
      /key:\s*"Permissions-Policy"[\s\S]*camera=\(\), microphone=\(\), geolocation=\(\), browsing-topics=\(\)/,
    );
  });
});
