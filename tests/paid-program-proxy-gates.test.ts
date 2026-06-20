import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function protectedRouteBlock(proxy: string): string {
  const match = proxy.match(/createRouteMatcher\(\[(?<routes>[\s\S]*?)\]\);/);
  assert.ok(match?.groups?.routes, "proxy should define protected routes with createRouteMatcher");
  return match.groups.routes;
}

function literalPattern(value: string): RegExp {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

describe("paid program proxy gates", () => {
  it("protects logged-in program engines that are linked from the paid dashboard", () => {
    const routes = protectedRouteBlock(readProjectFile("proxy.ts"));
    const protectedRoutes = [
      "/atlas(.*)",
      "/atlas-v1(.*)",
      "/matrix(.*)",
      "/misconceptions(.*)",
      "/question-history(.*)",
      "/practice(.*)",
      "/boot-camps(.*)",
      "/certification/(.*)",
      "/timed-sets(.*)",
      "/flashcards(.*)",
      "/study(.*)",
    ];

    for (const route of protectedRoutes) {
      assert.match(routes, literalPattern(JSON.stringify(route)));
    }
  });

  it("keeps acquisition and diagnostic surfaces outside the paid-program gate", () => {
    const routes = protectedRouteBlock(readProjectFile("proxy.ts"));
    const publicRoutes = [
      "/pricing",
      "/checkout",
      "/diagnostic",
      "/certification",
      "/red-zones",
      "/support",
      "/mobile-apps",
    ];

    for (const route of publicRoutes) {
      assert.doesNotMatch(routes, literalPattern(JSON.stringify(`${route}(.*)`)));
    }
  });
});
