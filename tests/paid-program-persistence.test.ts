import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("paid program persistence guards", () => {
  it("signed-in attempt submission never falls back to anonymous when Clerk has no token", () => {
    const source = readProjectFile("lib/use-attempts.ts");

    assert.match(source, /if \(!isLoaded\)[\s\S]*Checking sign-in/i);
    assert.match(
      source,
      /if \(isSignedIn\) \{[\s\S]*const token = await getToken\(\);[\s\S]*if \(!token\)[\s\S]*Sign in again to save this attempt[\s\S]*return api\.submitAttempt\(payload, token\);[\s\S]*return api\.submitAttempt\(payload\);/,
    );
    assert.doesNotMatch(source, /const token = isLoaded && isSignedIn \? await getToken\(\) : null;\s*return api\.submitAttempt\(payload, token\);/);
  });

  it("drill and boot camp starts fail visibly instead of starting tokenless from paid surfaces", () => {
    const drills = readProjectFile("app/drills/page.tsx");
    const bootCamp = readProjectFile("app/boot-camps/[slug]/page.tsx");

    assert.match(drills, /if \(!authLoaded\)[\s\S]*Checking sign-in/i);
    assert.match(drills, /if \(!authSignedIn\)[\s\S]*Sign in to start a drill/i);
    assert.match(
      drills,
      /const token = await getToken\(\);[\s\S]*if \(!token\)[\s\S]*Sign in again to start a drill/i,
    );
    assert.match(drills, /api\.startDrill\(\s*\{ \.\.\.payload \},\s*token\s*\)/);
    assert.doesNotMatch(drills, /const token = authSignedIn \? await getToken\(\) : null;\s*const res = await api\.startDrill/);

    assert.match(bootCamp, /const token = await getToken\(\);[\s\S]*if \(!token\)[\s\S]*Sign in again to start this boot camp/i);
    assert.match(bootCamp, /api\.startBootCamp\(slug, \{\}, token\)/);
  });

  it("flashcard completion surfaces persistence failures and only returns after saves complete", () => {
    const source = readProjectFile("app/flashcards/[deckId]/page.tsx");

    assert.match(source, /const\s+\[finishError,\s*setFinishError\]\s*=\s*useState/);
    assert.match(source, /if \(!isLoaded\)[\s\S]*Checking sign-in/i);
    assert.match(source, /if \(stepId && !isSignedIn\)[\s\S]*Sign in again to save this card/i);
    assert.match(source, /if \(!token\)[\s\S]*Sign in again to save this card/i);
    assert.match(source, /await api\.completeFlashcardDeck\(token, deckId, Array\.from\(reviewed\)\);/);
    assert.match(source, /await api\.completeMyDayPlanStep\(token, stepId\);/);
    assert.match(source, /setFinishError\("We couldn't save that flashcard progress\. Try again\."\)/);
    assert.match(source, /\{finishError &&/);
    assert.doesNotMatch(source, /\.catch\(\(\) => undefined\)/);
  });

  it("study completion uses the current Lead Me day-plan endpoint and does not swallow failures", () => {
    const doctrinal = readProjectFile("app/study/doctrinal/[slug]/page.tsx");
    const miniDrill = readProjectFile("app/study/mini-drill/[drillId]/page.tsx");

    for (const source of [doctrinal, miniDrill]) {
      assert.match(source, /completeMyDayPlanStep\(token, stepId\)/);
      assert.doesNotMatch(source, /completePathStep\(token, stepId\)/);
      assert.doesNotMatch(source, /\.catch\(\(\) => undefined\)/);
      assert.match(source, /if \(!isLoaded\)[\s\S]*Checking sign-in/i);
      assert.match(source, /if \(stepId && !isSignedIn\)[\s\S]*Sign in again to save this step/i);
      assert.match(source, /if \(!token\)[\s\S]*Sign in again to save this step/i);
      assert.match(source, /setFinishError\("We couldn't save that step\. Try again\."\)/);
    }
  });
});
