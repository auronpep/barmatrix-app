import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function readActiveHomePage(): string {
  const entry = readProjectFile("app/page.tsx");
  const match = entry.match(/export \{ default, metadata \} from "\.\/([^"]+)\/page";/);
  return match ? readProjectFile(`app/${match[1]}/page.tsx`) : entry;
}

describe("canonical metadata", () => {
  it("does not force every route to canonicalize to the home page", () => {
    const layout = readProjectFile("app/layout.tsx");

    assert.doesNotMatch(layout, /alternates:\s*\{[\s\S]*canonical:\s*"\/"/);
  });

  it("keeps the home page canonical on the home page itself", () => {
    const homePage = readActiveHomePage();

    assert.match(homePage, /export const metadata/);
    assert.match(homePage, /alternates:\s*\{[\s\S]*canonical:\s*"\/"/);
  });
});
