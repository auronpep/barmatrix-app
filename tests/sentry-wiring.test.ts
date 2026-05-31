import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("Sentry Next.js wiring", () => {
  it("declares the Sentry SDK dependency", () => {
    const packageJson = JSON.parse(readProjectFile("package.json"));

    assert.match(packageJson.dependencies["@sentry/nextjs"], /^\^?\d+\.\d+\.\d+/);
  });

  it("wraps Next config with Sentry without hard-coded secrets", () => {
    const nextConfig = readProjectFile("next.config.ts");

    assert.match(nextConfig, /import\s+\{\s*withSentryConfig\s*\}\s+from\s+"@sentry\/nextjs"/);
    assert.match(nextConfig, /export\s+default\s+withSentryConfig\(/);
    assert.match(nextConfig, /project:\s*process\.env\.SENTRY_PROJECT\s*\?\?\s*"barmatrix-app"/);
    assert.doesNotMatch(nextConfig, /dsn:\s*["']/i);
    assert.doesNotMatch(nextConfig, /authToken:\s*["']/i);
  });

  it("initializes browser Sentry while preserving PostHog initialization", () => {
    const clientConfig = readProjectFile("instrumentation-client.ts");

    assert.match(clientConfig, /import\s+\*\s+as\s+Sentry\s+from\s+"@sentry\/nextjs"/);
    assert.match(clientConfig, /Sentry\.init\(/);
    assert.match(clientConfig, /dsn:\s*process\.env\.NEXT_PUBLIC_SENTRY_DSN/);
    assert.match(clientConfig, /initializePostHogClient\(posthog\)/);
    assert.match(clientConfig, /sendDefaultPii:\s*false/);
    assert.match(clientConfig, /tracesSampleRate:\s*0/);
    assert.match(clientConfig, /onRouterTransitionStart\s*=\s*Sentry\.captureRouterTransitionStart/);
    assert.doesNotMatch(clientConfig, /replayIntegration|feedbackIntegration|replaysSessionSampleRate|replaysOnErrorSampleRate/);
  });

  it("registers server and edge Sentry configs and request error capture", () => {
    const instrumentation = readProjectFile("instrumentation.ts");
    const serverConfig = readProjectFile("sentry.server.config.ts");
    const edgeConfig = readProjectFile("sentry.edge.config.ts");

    assert.match(instrumentation, /await import\("\.\/sentry\.server\.config"\)/);
    assert.match(instrumentation, /await import\("\.\/sentry\.edge\.config"\)/);
    assert.match(instrumentation, /onRequestError\s*=\s*Sentry\.captureRequestError/);

    for (const config of [serverConfig, edgeConfig]) {
      assert.match(config, /Sentry\.init\(/);
      assert.match(config, /dsn:\s*process\.env\.NEXT_PUBLIC_SENTRY_DSN/);
      assert.match(config, /sendDefaultPii:\s*false/);
      assert.match(config, /tracesSampleRate:\s*0/);
    }
  });
});
