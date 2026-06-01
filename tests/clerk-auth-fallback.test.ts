import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("Clerk auth fallback", () => {
  it("does not leave public study pages loading forever when Clerk never loads", () => {
    const source = readProjectFile("lib/use-clerk-auth.ts");

    assert.match(source, /AUTH_LOAD_TIMEOUT_MS\s*=\s*3000/);
    assert.match(source, /setAuthLoadTimedOut\(true\)/);
    assert.match(source, /isLoaded:\s*isLoaded\s*\|\|\s*authLoadTimedOut/);
    assert.match(source, /isSignedIn:\s*Boolean\(isLoaded\s*&&\s*isSignedIn\)/);
    assert.match(source, /getToken:\s*isLoaded\s*\?\s*getToken\s*:\s*ANON_GET_TOKEN/);
  });
});
