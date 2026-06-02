import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("web app manifest route", () => {
  it("publishes a minimal install metadata route using existing assets", () => {
    const manifestPath = new URL("../app/manifest.ts", import.meta.url);

    assert.equal(existsSync(manifestPath), true);

    const source = readFileSync(manifestPath, "utf8");
    assert.match(source, /MetadataRoute\.Manifest/);
    assert.match(source, /name:\s*BRAND/);
    assert.match(source, /short_name:\s*BRAND/);
    assert.match(source, /start_url:\s*"\/"/);
    assert.match(source, /display:\s*"standalone"/);
    assert.match(source, /src:\s*"\/favicon.ico"/);
  });
});
