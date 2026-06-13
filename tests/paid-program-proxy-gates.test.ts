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

describe("paid program proxy gates", () => {
  it("protects logged-in program engines that are linked from the paid dashboard", () => {
    const routes = protectedRouteBlock(readProjectFile("proxy.ts"));
    const protectedRoutes = [
      "/matrix(.*)",
      "/misconceptions(.*)",
      "/question-history(.*)",
      "/practice(.*)",
      "/boot-camps(.*)",
      "/timed-sets(.*)",
      "/flashcards(.*)",
      "/study(.*)",
    ];

    for (const route of protectedRoutes) {
      assert.match(routes, new RegExp(JSON.stringify(route)));
    }
  });

  it("keeps acquisition and diagnostic surfaces outside the paid-program gate", () => {
    const routes = protectedRouteBlock(readProjectFile("proxy.ts"));
    const publicRoutes = [
      "/pricing",
      "/checkout",
      "/diagnostic",
      "/red-zones",
      "/support",
      "/mobile-apps",
    ];

    for (const route of publicRoutes) {
      assert.doesNotMatch(routes, new RegExp(JSON.stringify(`${route}(.*)`)));
    }
  });
});
