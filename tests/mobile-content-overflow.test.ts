import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function subjectPageFiles(): string[] {
  return readdirSync(new URL("../app/subjects", import.meta.url), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join("app/subjects", entry.name, "page.tsx"));
}

describe("mobile content overflow guards", () => {
  it("lets subject question identifiers and metadata wrap inside mobile cards", () => {
    const css = readProjectFile("app/globals.css");
    assert.match(css, /\.break-anywhere\s*{/);
    assert.match(css, /overflow-wrap:\s*anywhere/);

    for (const filePath of subjectPageFiles()) {
      const source = readProjectFile(filePath);
      assert.match(
        source,
        /className="eyebrow-strong break-anywhere"/,
        `${filePath} should wrap long question identifiers`,
      );
      assert.match(
        source,
        /className="mono break-anywhere"/,
        `${filePath} should wrap long topic and chip metadata`,
      );
    }
  });

  it("lets trap and tension catalog rows shrink instead of forcing document overflow", () => {
    const traps = readProjectFile("app/traps/page.tsx");
    const tensions = readProjectFile("app/tensions/page.tsx");

    assert.match(traps, /className="min-w-0"/);
    assert.match(traps, /className="min-w-0"/);
    assert.match(traps, /className="flex min-w-0 w-full flex-col items-start/);
    assert.doesNotMatch(traps, /<span className="mt-0\.5 block break-all[^"]*">\s*\{trap\.slug\}\s*<\/span>/);

    assert.match(tensions, /<li[^>]+className="min-w-0"/);
    assert.match(tensions, /className="flex min-w-0 w-full flex-col items-start/);
    assert.match(tensions, /className="min-w-0 break-words/);
  });

  it("keeps link resets layered so Tailwind color utilities win", () => {
    const css = readProjectFile("app/globals.css").replace(/\r\n/g, "\n");
    const baseLayerIndex = css.indexOf("@layer base");
    const anchorResetIndex = css.indexOf(
      "a {\n    color: inherit;\n    text-decoration: none;\n  }",
    );

    assert.ok(baseLayerIndex >= 0, "globals.css should declare a base layer");
    assert.ok(anchorResetIndex > baseLayerIndex, "anchor reset should be inside @layer base");
    assert.doesNotMatch(css.slice(0, baseLayerIndex), /a\s*{\s*color:\s*inherit;/);
  });

  it("formats tension subject headings instead of exposing DB enum values", () => {
    const tensions = readProjectFile("app/tensions/page.tsx");

    assert.match(tensions, /import \{ humanizeSubject \} from "@\/lib\/format-subject";/);
    assert.match(tensions, /\{humanizeSubject\(subject\)\}/);
    assert.doesNotMatch(tensions, /<h2[^>]*>\s*\{subject\}\s*<\/h2>/);
  });

  it("formats red-zone labels and lets long zone cards shrink on mobile", () => {
    const redZones = readProjectFile("app/red-zones/page.tsx");

    assert.match(redZones, /<li key=\{`\$\{item\.dimension\}:\$\{item\.zone\.tag\}`\} className="min-w-0">/);
    assert.match(redZones, /className="block min-w-0 border border-zinc-200 bg-zinc-50/);
    assert.match(redZones, /\{titleize\(item\.zone\.tag\)\}/);
    assert.match(redZones, /<li key=\{zone\.tag\} className="min-w-0">/);
    assert.match(redZones, /className="min-w-0 break-words text-base font-semibold/);
    assert.match(redZones, /\{titleize\(zone\.tag\)\}/);
    assert.doesNotMatch(redZones, />\s*\{zone\.tag\}\s*<\/span>/);
    assert.doesNotMatch(redZones, />\s*\{item\.zone\.tag\}\s*<\/h3>/);
  });

  it("lets dashboard panels and matrix content shrink inside mobile viewports", () => {
    const panel = readProjectFile("components/preview-dashboard/panel.tsx");
    const matrix = readProjectFile("components/preview-dashboard/tension-matrix.tsx");

    assert.match(panel, /className="min-w-0 border border-zinc-900 bg-white"/);
    assert.match(panel, /className=\{flush \? "min-w-0" : "min-w-0 p-5"\}/);
    assert.match(matrix, /className="min-w-0 p-5"/);
    assert.match(matrix, /className="max-w-full grid gap-1 overflow-x-auto"/);
  });
});
