import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getPostHogBrowserConfig,
  initializePostHogClient,
} from "../lib/posthog-client.ts";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = join(import.meta.dirname, "..");

describe("posthog client config", () => {
  it("does not initialize without a public project token", () => {
    assert.equal(getPostHogBrowserConfig({}), null);
  });

  it("uses the app env contract with conservative capture defaults", () => {
    const config = getPostHogBrowserConfig({
      NEXT_PUBLIC_POSTHOG_KEY: "phc_test_token",
      NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com/",
    });

    assert.ok(config);
    assert.equal(config.projectToken, "phc_test_token");
    assert.equal(config.options.api_host, "https://us.i.posthog.com");
    assert.equal(config.options.defaults, "2026-01-30");
    assert.equal(config.options.autocapture, false);
    assert.equal(config.options.capture_pageview, false);
    assert.equal(config.options.capture_pageleave, false);
    assert.equal(config.options.person_profiles, "identified_only");
    assert.equal(config.options.disable_session_recording, false);
    assert.equal(config.options.enable_recording_console_log, false);
    assert.equal(config.options.session_recording.maskAllInputs, true);
    assert.equal(config.options.session_recording.maskTextSelector, "*");
  });

  it("initializes the SDK once", () => {
    const calls: Array<{ token: string; options: unknown }> = [];
    const client = {
      init(token: string, options: unknown) {
        calls.push({ token, options });
        this.__loaded = true;
      },
      __loaded: false,
    };

    assert.equal(
      initializePostHogClient(client, {
        NEXT_PUBLIC_POSTHOG_KEY: "phc_test_token",
      }),
      true,
    );
    assert.equal(initializePostHogClient(client, { NEXT_PUBLIC_POSTHOG_KEY: "phc_test_token" }), false);
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.token, "phc_test_token");
  });

  it("passes directly referenced public env values from instrumentation-client", () => {
    const source = readFileSync(
      join(projectRoot, "instrumentation-client.ts"),
      "utf8",
    );

    assert.match(source, /NEXT_PUBLIC_POSTHOG_KEY:\s*process\.env\.NEXT_PUBLIC_POSTHOG_KEY/);
    assert.match(source, /NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN:\s*process\.env\.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN/);
    assert.match(source, /NEXT_PUBLIC_POSTHOG_HOST:\s*process\.env\.NEXT_PUBLIC_POSTHOG_HOST/);
    assert.doesNotMatch(source, /initializePostHogClient\(posthog\)/);
  });
});
