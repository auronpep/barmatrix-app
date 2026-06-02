import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("boot-camp question-runner routes expose page-level headings", () => {
  const dayPage = readFileSync(
    "app/boot-camps/sessions/[session_id]/days/[day]/page.tsx",
    "utf8",
  );
  const masteryPage = readFileSync(
    "app/boot-camps/sessions/[session_id]/mastery/page.tsx",
    "utf8",
  );

  assert.match(dayPage, /<h1 className="sr-only">\s*Boot Camp Day \{day\}\s*<\/h1>/);
  assert.match(
    masteryPage,
    /<h1 className="sr-only">\s*Boot Camp Mastery Check\s*<\/h1>/,
  );
});
