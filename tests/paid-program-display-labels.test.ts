import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("paid program display labels", () => {
  it("formats raw drill names before rendering dashboard and drill runner headings", () => {
    const helpers = readProjectFile("lib/drills.ts");
    const drillLibrary = readProjectFile("app/drills/page.tsx");
    const drillRunner = readProjectFile("app/drills/[drill_id]/page.tsx");

    assert.match(helpers, /function formatDrillName/);
    assert.match(helpers, /review_drill/);
    assert.match(helpers, /Review Missed Questions/);

    assert.match(drillLibrary, /formatDrillName\(d\.drill_name\)/);
    assert.doesNotMatch(drillLibrary, /title:\s*d\.drill_name/);
    assert.doesNotMatch(drillLibrary, /\{d\.drill_name\}/);

    assert.match(
      drillRunner,
      /const drillDisplayName =[\s\S]*formatDrillName\(state\.detail\.drill_name\)/,
    );
    assert.match(drillRunner, /title=\{drillDisplayName\}/);
    assert.doesNotMatch(drillRunner, /title=\{state\.detail\.drill_name\}/);
  });

  it("formats assigned drill names and statuses on the final sprint path", () => {
    const finalSprint = readProjectFile("app/dashboard/final-sprint/page.tsx");

    assert.match(finalSprint, /import \{ formatDrillName \} from "@\/lib\/drills";/);
    assert.match(finalSprint, /formatDrillName\(d\.drill_name\)/);
    assert.match(finalSprint, /formatSprintDrillStatus\(d\.status\)/);
    assert.doesNotMatch(finalSprint, /uppercase tracking-wider text-zinc-500">\s*\{formatSprintDrillStatus\(d\.status\)\}/);
    assert.doesNotMatch(finalSprint, /\{d\.drill_name\}/);
    assert.doesNotMatch(finalSprint, /\{d\.status\}/);
  });

  it("does not expose external IDs or UUID fragments in the Contracts live queue label", () => {
    const contracts = readProjectFile("app/drills/contracts/page.tsx");

    assert.match(contracts, /function formatQueueQuestionLabel/);
    assert.match(contracts, /formatQueueQuestionLabel\(currentRef\)/);
    assert.doesNotMatch(
      contracts,
      /currentRef\.external_id\s*\?\?\s*currentRef\.question_id\.slice/,
    );
  });

  it("formats raw drill catalog API labels before rendering catalog cards", () => {
    const helpers = readProjectFile("lib/drills.ts");
    const drillLibrary = readProjectFile("app/drills/page.tsx");

    assert.match(helpers, /function formatCatalogDrillLabel/);
    assert.match(helpers, /CON: "Constitutional Law"/);
    assert.match(helpers, /\$\{subject\} Targeted Drill \$\{number\}/);
    assert.match(drillLibrary, /formatCatalogDrillLabel\(item\.label, item\.slug\)/);
    assert.doesNotMatch(drillLibrary, /\{item\.label\}/);
  });

  it("keeps cohort capacity copy user-facing instead of exposing raw status codes", () => {
    const checkout = readProjectFile("app/checkout/checkout-client.tsx");
    const copy = readProjectFile("lib/copy.ts");

    assert.match(checkout, /api\.cohortStatus\(\)/);
    assert.match(checkout, /cohort\.public_status === "waitlist"/);
    assert.match(checkout, /CAPACITY_COPY\.waitlist/);
    assert.match(copy, /waitlist: "Enrollment is currently paused/);
    assert.doesNotMatch(checkout, /\{status\.cohort_code\} \/ \{status\.public_status\}/);
  });

  it("keeps paid study surfaces from sounding like unfinished previews", () => {
    const paidSources = [
      "components/path/milestone-map.tsx",
      "app/boot-camps/boot-camps-catalog.tsx",
      "app/timed-sets/page.tsx",
      "app/drills/civil-procedure/page.tsx",
      "app/drills/constitutional-law/page.tsx",
      "app/drills/contracts/page.tsx",
      "app/drills/criminal-law/page.tsx",
      "app/drills/evidence/page.tsx",
      "app/drills/real-property/page.tsx",
      "app/drills/torts/page.tsx",
    ].map(readProjectFile);

    for (const source of paidSources) {
      assert.doesNotMatch(source, /Coming soon/);
      assert.doesNotMatch(source, /Wrong-answer forensics preview/);
      assert.doesNotMatch(source, /Timed set engine preview/);
      assert.doesNotMatch(source, /replace this preview/);
      assert.doesNotMatch(source, /preview card/);
      assert.doesNotMatch(source, /proof preview/);
      assert.doesNotMatch(source, /published yet/i);
      assert.doesNotMatch(source, /seeded/i);
      assert.doesNotMatch(source, /endpoints come online/i);
      assert.doesNotMatch(source, /tables are applied/i);
    }

    const bootCampCatalog = readProjectFile("app/boot-camps/boot-camps-catalog.tsx");
    assert.doesNotMatch(bootCampCatalog, /API \$\{/);
    assert.doesNotMatch(bootCampCatalog, /\{state\.message\}/);
  });
});
