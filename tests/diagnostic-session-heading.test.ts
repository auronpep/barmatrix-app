import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("placement diagnostic session page exposes a page-level heading", () => {
  const source = readFileSync(
    "app/diagnostic/session/[sessionId]/page.tsx",
    "utf8",
  );

  assert.match(source, /<h1\b[^>]*>\s*C3 Placement Assessment\s*<\/h1>/);
});
