import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

process.env.NEXT_PUBLIC_API_URL = "https://api.test";

const originalFetch = globalThis.fetch;

function importApiClient() {
  return import(new URL("../lib/api-client.ts", import.meta.url).href) as Promise<
    typeof import("../lib/api-client")
  >;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("api.createCustomerPortalSession", () => {
  it("sends the Clerk bearer token when creating a billing portal session", async () => {
    const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      calls.push({ input, init });
      return new Response(
        JSON.stringify({
          portal_url: "https://billing.stripe.test/session/test",
          session_id: "bps_test_123",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    };

    const { api } = await importApiClient();

    await api.createCustomerPortalSession(
      {
        checkout_session_id: "cs_test_owned",
        return_url: "https://barmatrix.app/account",
      },
      "test-clerk-token",
    );

    assert.equal(calls.length, 1);
    assert.equal(
      String(calls[0]?.input),
      "https://api.test/api/billing/create-portal-session",
    );
    assert.deepEqual(calls[0]?.init?.headers, {
      "content-type": "application/json",
      Authorization: "Bearer test-clerk-token",
    });
    assert.equal(calls[0]?.init?.method, "POST");
    assert.deepEqual(JSON.parse(String(calls[0]?.init?.body)), {
      checkout_session_id: "cs_test_owned",
      return_url: "https://barmatrix.app/account",
    });
  });
});
