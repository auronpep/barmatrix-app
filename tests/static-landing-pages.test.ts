import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readLandingPages(): Array<{ path: string; source: string }> {
  return readdirSync(new URL("../public", import.meta.url))
    .filter((name) => /^lp-.*\.html$/.test(name))
    .filter((name) => name !== "lp-red-zone.html")
    .map((name) => ({
      path: `public/${name}`,
      source: readFileSync(new URL(`../public/${name}`, import.meta.url), "utf8"),
    }));
}

describe("static landing page shell", () => {
  it("points shared navigation and footer links at real product/legal routes", () => {
    for (const { path, source } of readLandingPages()) {
      assert.match(source, /<a href="\/pricing"><button>Pricing<\/button><\/a>/, path);
      assert.match(source, /<li><a href="\/how-it-works">How It Works<\/a><\/li>/, path);
      assert.match(source, /<li><a href="\/pricing">Pricing<\/a><\/li>/, path);
      assert.match(source, /<li><a href="\/diagnostic">Free Diagnostic<\/a><\/li>/, path);
      assert.match(source, /<li><a href="\/app">Open App<\/a><\/li>/, path);
      assert.match(source, /<li><a href="\/terms">Terms<\/a><\/li>/, path);
      assert.match(source, /<li><a href="\/privacy">Privacy<\/a><\/li>/, path);
      assert.doesNotMatch(source, /Live Webinars/, path);
    }
  });

  it("does not claim unavailable mobile apps in shared landing-page copy", () => {
    for (const { path, source } of readLandingPages()) {
      assert.doesNotMatch(source, /iOS|ANDROID/, path);
    }
  });

  it("avoids public diagnostic-count and volume proof claims", () => {
    const pages = [
      ...readLandingPages(),
      {
        path: "public/campaign.html",
        source: readFileSync(new URL("../public/campaign.html", import.meta.url), "utf8"),
      },
      {
        path: "public/lp-red-zone.html",
        source: readFileSync(new URL("../public/lp-red-zone.html", import.meta.url), "utf8"),
      },
    ];

    for (const { path, source } of pages) {
      assert.doesNotMatch(source, /\b(?:12|18|20)-question/i, path);
      assert.doesNotMatch(source, /2,400-question|1,247/, path);
    }
  });

  it("wraps non-footer page content in one main landmark", () => {
    for (const { path, source } of readLandingPages()) {
      const openMainCount = (source.match(/<main[\s>]/g) ?? []).length;
      const closeMainCount = (source.match(/<\/main>/g) ?? []).length;
      const mainIndex = source.indexOf("<main");
      const footerIndex = source.indexOf("<footer");

      assert.equal(openMainCount, 1, path);
      assert.equal(closeMainCount, 1, path);
      assert.ok(mainIndex > -1 && footerIndex > mainIndex, path);
    }
  });
});
