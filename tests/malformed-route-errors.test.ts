import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("malformed dynamic route error copy", () => {
  it("uses a shared user-facing API error helper for bad dynamic params", () => {
    const helper = readProjectFile("lib/user-facing-errors.ts");

    assert.match(helper, /export function userFacingResourceError/);
    assert.match(helper, /err\.status === 400 \|\| err\.status === 404/);
    assert.doesNotMatch(helper, /`API \$\{err\.status\}`/);

    const affectedFiles = [
      "app/foundations/[slug]/page.tsx",
      "app/boot-camps/[slug]/page.tsx",
      "app/boot-camps/sessions/[session_id]/page.tsx",
      "app/boot-camps/sessions/[session_id]/days/[day]/page.tsx",
      "app/boot-camps/sessions/[session_id]/mastery/page.tsx",
      "app/diagnostic/[session]/results/page.tsx",
      "app/diagnostic/session/[sessionId]/results/page.tsx",
      "app/drills/[drill_id]/page.tsx",
    ];

    for (const filePath of affectedFiles) {
      const source = readProjectFile(filePath);
      assert.match(
        source,
        /userFacingResourceError/,
        `${filePath} should use user-facing API error copy`,
      );
      assert.doesNotMatch(
        source,
        /API \$\{err\.status\}|API \$\{error\.status\}|API \$\{err\.status\}:|API \$\{error\.status\}:/,
        `${filePath} should not render raw API status strings for load errors`,
      );
    }
  });
});
