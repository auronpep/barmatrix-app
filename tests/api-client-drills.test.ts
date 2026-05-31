import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

process.env.NEXT_PUBLIC_API_URL = "https://api.test";

const originalFetch = globalThis.fetch;

function importApiClient() {
  return import(new URL("../lib/api-client.ts", import.meta.url).href) as Promise<
    typeof import("../lib/api-client")
  >;
}

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

    const { api } = await importApiClient();

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

describe("paid study resume calls", () => {
  it("sends a Clerk bearer token when reading and completing a paid drill", async () => {
    const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      calls.push({ input, init });
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const { api } = await importApiClient();

    await api.getDrill(
      "11111111-1111-1111-1111-111111111111",
      "test-clerk-token",
      { cache: "no-store" },
    );
    await api.completeDrill("11111111-1111-1111-1111-111111111111", "test-clerk-token");

    assert.equal(calls.length, 2);
    assert.equal(
      String(calls[0]?.input),
      "https://api.test/api/drills/11111111-1111-1111-1111-111111111111",
    );
    assert.deepEqual(calls[0]?.init?.headers, {
      "content-type": "application/json",
      Authorization: "Bearer test-clerk-token",
    });
    assert.equal(calls[0]?.init?.cache, "no-store");
    assert.equal(
      String(calls[1]?.input),
      "https://api.test/api/drills/11111111-1111-1111-1111-111111111111/complete",
    );
    assert.deepEqual(calls[1]?.init?.headers, {
      "content-type": "application/json",
      Authorization: "Bearer test-clerk-token",
    });
    assert.equal(calls[1]?.init?.method, "POST");
  });

  it("sends a Clerk bearer token for boot-camp session reads and mutations", async () => {
    const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      calls.push({ input, init });
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const { api } = await importApiClient();
    const sessionId = "33333333-3333-3333-3333-333333333333";

    await api.getBootCampSession(sessionId, "test-clerk-token", { cache: "no-store" });
    await api.startBootCampDay(sessionId, 1, "test-clerk-token");
    await api.completeBootCampDay(sessionId, 1, "test-clerk-token");
    await api.startBootCampMastery(sessionId, "test-clerk-token");
    await api.completeBootCampMastery(sessionId, "test-clerk-token");

    assert.equal(calls.length, 5);
    for (const call of calls) {
      assert.deepEqual(call.init?.headers, {
        "content-type": "application/json",
        Authorization: "Bearer test-clerk-token",
      });
    }
    assert.equal(calls[0]?.init?.cache, "no-store");
    assert.equal(
      String(calls[0]?.input),
      "https://api.test/api/boot-camps/sessions/33333333-3333-3333-3333-333333333333",
    );
    assert.equal(calls[1]?.init?.method, "POST");
    assert.equal(calls[2]?.init?.method, "POST");
    assert.equal(calls[3]?.init?.method, "POST");
    assert.equal(calls[4]?.init?.method, "POST");
  });
});
