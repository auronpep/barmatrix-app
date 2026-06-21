import { chromium, expect } from "@playwright/test";

const BASE_URL = process.env.SMOKE_BASE_URL ?? "https://barmatrix.app";
const API_URL = process.env.SMOKE_API_URL ?? "https://api.barmatrix.app";
const SMOKE_EMAIL =
  process.env.SMOKE_EMAIL ?? `support+diagnostic-smoke-${Date.now()}@barmatrix.app`;

async function api(path, init = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`${path} failed ${response.status}: ${text}`);
  }
  return body;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(
      `${BASE_URL}/diagnostic?source=alternatives&utm_campaign=diagnostic_comparison&lp=alternatives`,
      { waitUntil: "networkidle" },
    );
    await page.getByRole("button", { name: /start the diagnostic/i }).click();
    await page.waitForURL(/\/diagnostic\/[0-9a-f-]+\/0$/i, { timeout: 30000 });

    const url = new URL(page.url());
    const [, , diagnosticId] = url.pathname.split("/");
    if (!diagnosticId) throw new Error(`could not parse diagnostic id from ${page.url()}`);

    await page.locator("button").filter({ hasText: /^A\./ }).first().click();
    await page.getByRole("button", { name: /submit answer/i }).click();
    await expect(page.getByText(/first miss case study/i)).toBeVisible({
      timeout: 30000,
    });
    const continueButtons = page.getByRole("button", { name: /continue diagnostic/i });
    if ((await continueButtons.count()) < 2) {
      throw new Error("first-miss case study did not render both continue buttons");
    }
    await expect(continueButtons.first()).toBeVisible();

    const cache = await page.evaluate((id) => {
      const raw = window.sessionStorage.getItem(`barmatrix.diagnostic.${id}`);
      return raw ? JSON.parse(raw) : null;
    }, diagnosticId);
    if (!cache?.question_ids?.length) {
      throw new Error("diagnostic session cache missing question ids");
    }

    for (const questionId of cache.question_ids.slice(1)) {
      await api("/api/attempts", {
        method: "POST",
        body: JSON.stringify({
          question_id: questionId,
          selected_letter: "A",
          confidence: 4,
          time_seconds: 12,
          platform: "web",
          set_id: diagnosticId,
        }),
      });
    }

    const preGateResults = await fetch(`${API_URL}/api/diagnostic/${diagnosticId}/results`);
    if (preGateResults.status !== 403) {
      const text = await preGateResults.text();
      throw new Error(
        `expected pre-email diagnostic results gate to return 403, got ${preGateResults.status}: ${text}`,
      );
    }

    await page.goto(`${BASE_URL}/diagnostic/${diagnosticId}/results`, {
      waitUntil: "networkidle",
    });
    await expect(page.getByText(/email required for results/i)).toBeVisible({
      timeout: 30000,
    });
    await page.getByLabel(/^email$/i).fill(SMOKE_EMAIL);
    await page.getByLabel(/^first name$/i).fill("Smoke");
    const leadResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/diagnostic/lead") &&
        response.request().method() === "POST",
    );
    await page.getByRole("button", { name: /email my red-zone map/i }).click();
    const leadResponse = await leadResponsePromise;
    const leadJson = await leadResponse.json();
    if (!leadResponse.ok() || leadJson.ok !== true) {
      throw new Error(`lead capture failed: ${JSON.stringify(leadJson)}`);
    }

    await expect(page.getByText(/diagnostic summary/i)).toBeVisible({
      timeout: 30000,
    });
    await expect(page.getByText(/by red-zone dimension/i)).toBeVisible();
    await expect(page.getByText(/beyond another question pile/i)).toBeVisible();
    const cta = page.getByRole("link", { name: /start targeted repair/i });
    await expect(cta).toBeVisible();
    const checkoutHref = await cta.getAttribute("href");
    if (!checkoutHref?.includes("diagnostic_id=") || !checkoutHref.includes("source=alternatives")) {
      throw new Error(`unexpected checkout href: ${checkoutHref}`);
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          diagnosticId,
          questionCount: cache.question_ids.length,
          leadStatus: leadJson.status,
          emailStatus: leadJson.email_status,
          checkoutHref,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
