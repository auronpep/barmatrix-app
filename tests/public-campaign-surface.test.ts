import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function readPublicCampaignPages(): Array<{ path: string; source: string }> {
  const publicDir = new URL("../public", import.meta.url);
  const filenames = readdirSync(publicDir).filter(
    (name) => name === "campaign.html" || /^lp-.*\.html$/.test(name),
  );

  return filenames.map((name) => ({
    path: `public/${name}`,
    source: readFileSync(new URL(`../public/${name}`, import.meta.url), "utf8"),
  }));
}

describe("public campaign surface", () => {
  it("does not expose old demo wording on public campaign pages", () => {
    for (const { path, source } of readPublicCampaignPages()) {
      assert.doesNotMatch(
        source,
        /\b(demo|mock|prototype|placeholder)\b|coming soon|under construction|lorem ipsum/i,
        path,
      );
    }
  });

  it("serves the public TikTok entry route advertised by crawlers and campaigns", () => {
    assert.ok(existsSync(new URL("../app/tiktok/page.tsx", import.meta.url)));

    const sitemap = readProjectFile("app/sitemap.ts");
    assert.match(sitemap, /"\/tiktok"/);
  });

  it("lists every static campaign page in the sitemap", () => {
    const sitemap = readProjectFile("app/sitemap.ts");

    for (const { path } of readPublicCampaignPages()) {
      const route = `/${path.replace(/^public\//, "")}`;
      assert.match(sitemap, new RegExp(`"${route.replaceAll(".", "\\.")}"`), path);
    }
  });
});
