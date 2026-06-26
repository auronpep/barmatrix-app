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
      assert.match(config, redirectPairPattern(source, destination));
    }
  });

  it("keeps old public and legal .html URLs off 404 pages", () => {
    const config = readProjectFile("next.config.ts");

    const redirects = [
      ["/about.html", "/about"],
      ["/boot-camps.html", "/boot-camps"],
      ["/certification.html", "/certification"],
      ["/diagnostic.html", "/diagnostic"],
      ["/faq.html", "/faq"],
      ["/foundations.html", "/foundations"],
      ["/mastery.html", "/mastery"],
      ["/partners.html", "/partners"],
      ["/pricing.html", "/pricing"],
      ["/privacy.html", "/privacy"],
      ["/red-zones.html", "/red-zones"],
      ["/referral.html", "/referral"],
      ["/refund.html", "/refund"],
      ["/support.html", "/support"],
      ["/terms.html", "/terms"],
      ["/timed-sets.html", "/timed-sets"],
      ["/tensions.html", "/tensions"],
      ["/traps.html", "/traps"],
      ["/waitlist.html", "/waitlist"],
      ["/webinar.html", "/webinar"],
    ];

    for (const [source, destination] of redirects) {
      assert.match(config, redirectPairPattern(source, destination));
    }
  });

  it("keeps stale app entry URLs off signed-in 404 pages", () => {
    const config = readProjectFile("next.config.ts");

    const redirects = [
      ["/checkout/recover", "/account"],
      ["/dashboard/command-deck", "/dashboard"],
      ["/dashboard/red-zones", "/red-zones"],
      ["/dashboard/foundations", "/foundations"],
      ["/dashboard/c3", "/question-history"],
      ["/dashboard/gamification", "/dashboard"],
    ];

    for (const [source, destination] of redirects) {
      assert.match(config, redirectPairPattern(source, destination));
    }
  });
});

function redirectPairPattern(source: string, destination: string): RegExp {
  return new RegExp(
    `\\[\\s*["']${escapeRegExp(source)}["']\\s*,\\s*["']${escapeRegExp(destination)}["']\\s*\\]`,
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
