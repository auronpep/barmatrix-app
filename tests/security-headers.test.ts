import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

type ResponseHeader = { key: string; value: string };
type HeaderRule = { headers: ResponseHeader[] };

async function readConfiguredHeaders(): Promise<ResponseHeader[]> {
  const config = await import("../next.config.ts");
  const rules = (await config.default.headers()) as HeaderRule[];

  return rules.flatMap((rule) => rule.headers);
}

function getHeader(headers: ResponseHeader[], key: string): string {
  const header = headers.find((candidate) => candidate.key === key);

  assert.ok(header, `Expected ${key} header to be configured`);
  return header.value;
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

  it("configures an enforced CSP for app, auth, telemetry, API, and static LP assets", async () => {
    const config = readProjectFile("next.config.ts");
    const headers = await readConfiguredHeaders();
    const csp = getHeader(headers, "Content-Security-Policy");

    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /script-src[^;]*'self'[^;]*'unsafe-inline'/);
    assert.match(csp, /script-src[^;]*https:\/\/clerk\.barmatrix\.app/);
    assert.match(csp, /script-src[^;]*https:\/\/\*\.clerk\.accounts\.dev/);
    assert.match(csp, /script-src[^;]*https:\/\/us-assets\.i\.posthog\.com/);
    assert.match(csp, /connect-src[^;]*https:\/\/api\.barmatrix\.app/);
    assert.match(csp, /connect-src[^;]*https:\/\/us\.i\.posthog\.com/);
    assert.match(csp, /connect-src[^;]*https:\/\/o4511480415584256\.ingest\.us\.sentry\.io/);
    assert.match(csp, /style-src[^;]*https:\/\/fonts\.googleapis\.com/);
    assert.match(csp, /font-src[^;]*https:\/\/fonts\.gstatic\.com/);
    assert.match(csp, /img-src[^;]*data:[^;]*blob:[^;]*https:/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /base-uri 'self'/);
    assert.match(csp, /frame-ancestors 'self'/);
    assert.match(config, /ALLOW_LOCAL_CONNECT/);
  });
});
