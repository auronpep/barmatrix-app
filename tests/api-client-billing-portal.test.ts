import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

describe("api checkout recovery helpers", () => {
  it("checks checkout status on the configured API host", async () => {
    const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      calls.push({ input, init });
      return new Response(JSON.stringify({ fulfilled: false }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const { api } = await importApiClient();

    const status = await api.getCheckoutStatus("cs_test_missing live");

    assert.deepEqual(status, { fulfilled: false });
    assert.equal(calls.length, 1);
    assert.equal(
      String(calls[0]?.input),
      "https://api.test/api/checkout/cs_test_missing%20live/status",
    );
  });

  it("posts checkout recovery on the configured API host", async () => {
    const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      calls.push({ input, init });
      return new Response(
        JSON.stringify({ status: "recovered", purchaseId: "purchase_test" }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    };

    const { api } = await importApiClient();

    const recovered = await api.recoverCheckoutEnrollment("cs_test_recover");

    assert.deepEqual(recovered, {
      status: "recovered",
      purchaseId: "purchase_test",
    });
    assert.equal(calls.length, 1);
    assert.equal(
      String(calls[0]?.input),
      "https://api.test/api/checkout/cs_test_recover/recover",
    );
    assert.equal(calls[0]?.init?.method, "POST");
  });
});

describe("EnrollmentRecoveryPanel checkout routing", () => {
  it("uses the shared API client instead of same-origin checkout fetches", () => {
    const source = readFileSync(
      new URL("../app/account/enrollment-recovery.tsx", import.meta.url),
      "utf8",
    );

    assert.match(source, /import \{[^}]*\bapi\b[^}]*\} from "@\/lib\/api-client";/);
    assert.match(source, /api\.getCheckoutStatus\(checkoutSessionId\)/);
    assert.match(source, /api\.recoverCheckoutEnrollment\(checkoutSessionId\)/);
    assert.doesNotMatch(source, /fetch\(`\/api\/checkout/);
  });

  it("does not claim an unfulfilled checkout status proves confirmation", () => {
    const source = readFileSync(
      new URL("../app/account/enrollment-recovery.tsx", import.meta.url),
      "utf8",
    );

    assert.doesNotMatch(source, /Enrollment Not Yet Activated/);
    assert.doesNotMatch(source, /checkout session is confirmed/i);
    assert.match(source, /Checkout recovery/);
  });
});

describe("BillingPortalButton unavailable-state copy", () => {
  it("does not tell active non-Stripe accounts that no local purchase exists", () => {
    const source = readFileSync(
      new URL("../app/account/billing-portal-button.tsx", import.meta.url),
      "utf8",
    );

    assert.doesNotMatch(source, /No local purchase with a billing customer/);
    assert.match(source, /no Stripe billing portal/i);
    assert.match(source, /manual/i);
  });
});
