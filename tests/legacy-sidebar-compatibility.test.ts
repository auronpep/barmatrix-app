import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("old BMO sidebar compatibility routes", () => {
  it("maps old drill mode and mobile aliases to current app experiences", () => {
    const drill = readProjectFile("app/drill/page.tsx");
    const mobile = readProjectFile("app/mobile/page.tsx");

    assert.match(drill, /redirect\("\/practice"\)/);
    assert.match(mobile, /redirect\("\/mobile-apps"\)/);
  });

  it("publishes honest mobile access and support pages", () => {
    const mobileApps = readProjectFile("app/mobile-apps/page.tsx");
    const support = readProjectFile("app/support/page.tsx");

    assert.match(mobileApps, /Mobile Access/);
    assert.match(mobileApps, /manifest\.webmanifest/);
    assert.doesNotMatch(mobileApps, /TestFlight|App Store|Google Play|Android app/i);

    assert.match(support, /Support/);
    assert.match(support, /support@barmatrix\.app/);
    assert.doesNotMatch(support, /billing@barmatrix\.app/);
  });

  it("links mobile access and support from the paid program shell", () => {
    const dashboardLayout = readProjectFile("app/dashboard/layout.tsx");
    const accountPage = readProjectFile("app/account/page.tsx");

    assert.match(dashboardLayout, /href: "\/mobile-apps"/);
    assert.match(dashboardLayout, /href: "\/support"/);
    assert.match(accountPage, /href="\/support"/);
  });
});
