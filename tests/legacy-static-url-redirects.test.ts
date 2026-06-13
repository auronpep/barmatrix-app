import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("legacy static URL redirects", () => {
  it("keeps old checkout, auth, and account entry URLs off 404 pages", () => {
    const config = readProjectFile("next.config.ts");

    const redirects = [
      ["/checkout.html", "/checkout"],
      ["/login.html", "/sign-in"],
      ["/signin.html", "/sign-in"],
      ["/signup.html", "/sign-up"],
      ["/account.html", "/account"],
      ["/dashboard.html", "/dashboard"],
      ["/welcome", "/account?welcome=1"],
    ];

    for (const [source, destination] of redirects) {
      assert.match(config, new RegExp(`source:\\s*["']${escapeRegExp(source)}["']`));
      assert.match(
        config,
        new RegExp(`destination:\\s*["']${escapeRegExp(destination)}["']`),
      );
    }
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
