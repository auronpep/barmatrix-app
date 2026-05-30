import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

process.env.NEXT_PUBLIC_API_URL = "https://api.test";

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        drill_id: "11111111-1111-1111-1111-111111111111",
        student_id: "22222222-2222-2222-2222-222222222222",
        question_ids: [],
        size: 0,
        requested: 12,
        matched: 0,
        partial: true,
        red_zone_dimension: "subtopic",
        red_zone_tag: "Hearsay",
        drill_name: "Hearsay repair drill",
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("api.startDrill", () => {
  it("sends a Clerk bearer token when starting an enrollment-gated drill", async () => {
    const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      calls.push({ input, init });
      return new Response(
        JSON.stringify({
          drill_id: "11111111-1111-1111-1111-111111111111",
          student_id: "22222222-2222-2222-2222-222222222222",
          question_ids: [],
          size: 0,
          requested: 12,
          matched: 0,
          partial: true,
          red_zone_dimension: "subtopic",
          red_zone_tag: "Hearsay",
          drill_name: "Hearsay repair drill",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    };

    const { api } = await import("../lib/api-client.ts");

    await api.startDrill(
      { kind: "trap", slug: "hearsay_reflex", size: 12 },
      "test-clerk-token",
    );

    assert.equal(calls.length, 1);
    assert.equal(String(calls[0]?.input), "https://api.test/api/drills/start");
    assert.deepEqual(calls[0]?.init?.headers, {
      "content-type": "application/json",
      Authorization: "Bearer test-clerk-token",
    });
  });
});
