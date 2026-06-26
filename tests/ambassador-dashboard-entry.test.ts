import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("dashboard guided-path entry", () => {
  it("uses the BMO/J7 day-plan path as the paid-user entry point", () => {
    const source = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(source, /useDayPlan/);
    assert.match(source, /DayCards/);
    assert.match(source, /Current Task/);
    assert.match(source, /Mark Complete/);
    assert.doesNotMatch(source, /useFoundations\(/);
    assert.doesNotMatch(source, /useC3\(/);
  });

  it("does not show a competing empty-dashboard diagnostic CTA while Lead Me owns Day 1", () => {
    const source = readProjectFile("app/dashboard/path/page.tsx");

    assert.doesNotMatch(source, /methodEntryPending/);
    assert.doesNotMatch(source, /Take the diagnostic to build your Red-Zone Map/);
  });

  it("restores the old paid dashboard navigation while keeping My Path first", () => {
    const source = readProjectFile("app/dashboard/layout.tsx");

    assert.match(source, /VIEW_TABS/);
    assert.match(source, /href: "\/dashboard\/path", label: "My Path"/);
    assert.match(source, /href: "\/dashboard", label: "Full Dashboard"/);
    assert.match(source, /PROGRAM_LINKS/);
    assert.match(source, /href: "\/practice"/);
    assert.match(source, />\s*Program\s*</);
  });

  it("keeps command-deck dashboard live while preserving old dashboard subviews", () => {
    const dashboard = readProjectFile("app/dashboard/page.tsx");
    const mastery = readProjectFile("app/dashboard/mastery/page.tsx");
    const finalSprint = readProjectFile("app/dashboard/final-sprint/page.tsx");
    const path = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(dashboard, /useCommandDeck\(/);
    assert.match(dashboard, /DashboardShell/);
    assert.match(dashboard, /DashboardV2Body/);
    assert.match(mastery, /PatternMasteryBoardPage/);
    assert.match(mastery, /useDashboard\(/);
    assert.match(finalSprint, /FinalSprintPathPage/);
    assert.match(finalSprint, /SPRINT_DAYS/);
    assert.match(path, /useDayPlan/);
    assert.doesNotMatch(mastery, /redirect\("\/dashboard"\)/);
    assert.doesNotMatch(finalSprint, /redirect\("\/dashboard"\)/);
    assert.doesNotMatch(path, /redirect\("\/dashboard"\)/);
  });

  it("keeps Lead Me isolated to /dashboard/path so /dashboard stays the full dashboard", () => {
    const dashboard = readProjectFile("app/dashboard/page.tsx");
    const path = readProjectFile("app/dashboard/path/page.tsx");

    assert.match(path, /useDayPlan\(/);
    assert.doesNotMatch(dashboard, /usePath\(/);
    assert.doesNotMatch(dashboard, /PathSurface/);
    assert.doesNotMatch(dashboard, /next_step != null/);
  });

  it("surfaces the restored paid-program tools inside the full dashboard", () => {
    const shell = readProjectFile("components/preview-dashboard/dashboard-shell.tsx");
    const body = readProjectFile("components/preview-dashboard/dashboard-v2-body.tsx");

    assert.match(shell, /section: "VIEWS"/);
    assert.match(shell, /label: "My Path"/);
    for (const href of [
      "/dashboard/path",
      "/atlas",
      "/red-zones",
      "/drills",
      "/dashboard/mastery",
      "/dashboard/final-sprint",
    ]) {
      assert.match(shell, new RegExp(`href: "${href.replaceAll("/", "\\/")}"`));
    }
    assert.match(body, /Outline Atlas/);
    assert.match(body, /Sequenced repair queue/);
    assert.match(body, /Active Red Zones/);
    assert.match(body, /Mastery trend/);
    assert.match(body, /Recent activity/);
  });

  it("keeps the customer Atlas as a learning map with gated component lanes", () => {
    const atlas = readProjectFile("app/atlas/atlas-client.tsx");
    const answer = readProjectFile("app/atlas/questions/[id]/answer/answer-client.tsx");
    const practice = readProjectFile("app/atlas/questions/[id]/practice/page.tsx");
    const client = readProjectFile("lib/api-client.ts");
    const body = readProjectFile("components/preview-dashboard/dashboard-v2-body.tsx");

    assert.match(atlas, /Walk the MBE outline by code/);
    assert.match(atlas, /Has any lane/);
    assert.match(atlas, /Practice ready/);
    assert.match(atlas, /Practice-ready codes/);
    assert.match(atlas, /SubtopicStat/);
    assert.match(atlas, /readyCodeCount/);
    assert.match(atlas, /Needs content/);
    assert.match(atlas, /Codes with components/);
    assert.match(atlas, /Study lesson/);
    assert.match(atlas, /Selected code lanes/);
    assert.match(atlas, /Debriefs/);
    assert.match(atlas, /copySelectedLink/);
    assert.match(atlas, /directLinkMessage/);
    assert.match(atlas, /Copy link/);
    assert.match(atlas, /Link copied/);
    assert.match(atlas, /atlas-code-lesson/);
    assert.match(atlas, /Outline lesson/);
    assert.match(atlas, /Lesson checkpoint/);
    assert.match(atlas, /Mark lesson studied/);
    assert.match(atlas, /Practice this lesson/);
    assert.match(atlas, /Next unstudied code/);
    assert.match(atlas, /Not studied/);
    assert.match(atlas, /Outline position/);
    assert.match(atlas, /LessonJump/);
    assert.match(atlas, /Prior lesson/);
    assert.match(atlas, /Next lesson/);
    assert.match(atlas, /href=\{`\/atlas\?code=\$\{encodeURIComponent\(code\)\}#atlas-code-lesson`\}/);
    assert.match(atlas, /Component index/);
    assert.match(atlas, /ComponentIndexLink/);
    assert.match(atlas, /href="#atlas-code-components"/);
    assert.match(atlas, /href="#atlas-code-leadme"/);
    assert.match(atlas, /Component lanes/);
    assert.match(atlas, /Study sequence/);
    assert.match(atlas, /Anchor this code/);
    assert.match(atlas, /Work approved questions/);
    assert.match(atlas, /firstSelectedQuestion/);
    assert.match(atlas, /atlasQuestionPracticeHref/);
    assert.match(atlas, /Do first question/);
    assert.match(atlas, /Do question/);
    assert.match(atlas, /Open question list/);
    assert.match(atlas, /atlas-code-questions/);
    assert.match(atlas, /View question bank/);
    assert.match(atlas, /Open approved support/);
    assert.match(atlas, /Follow approved detours/);
    assert.match(atlas, /LeadMe lesson/);
    assert.match(atlas, /id="atlas-code-leadme"/);
    assert.match(atlas, /Question bank/);
    assert.match(atlas, /Start LeadMe/);
    assert.doesNotMatch(atlas, /Drill this code/);
    assert.doesNotMatch(atlas, /No runnable questions matched this outline code yet/);
    assert.match(atlas, /id="atlas-code-components"/);
    assert.match(atlas, /Connected previews/);
    assert.match(atlas, /Atlas walk/);
    assert.match(atlas, /Practice walk/);
    assert.match(atlas, /Weak-section drilldown/);
    assert.match(atlas, /showScopedPractice/);
    assert.match(atlas, /selectedProgress/);
    assert.match(atlas, /LAST_ATLAS_CODE_KEY/);
    assert.match(atlas, /readStoredCode/);
    assert.match(atlas, /resumedCode/);
    assert.match(atlas, /Saved code/);
    assert.match(atlas, /Saved code on this device/);
    assert.match(atlas, /STUDIED_ATLAS_CODES_KEY/);
    assert.match(atlas, /readStoredStudiedCodes/);
    assert.match(atlas, /writeStoredStudiedCodes/);
    assert.match(atlas, /studiedCodes/);
    assert.match(atlas, /laneFootprint/);
    assert.match(atlas, /No approved lanes yet/);
    assert.match(atlas, /guided item/);
    assert.match(atlas, /debrief/);
    assert.match(atlas, /scopedStudiedCount/);
    assert.match(atlas, /scopedStudiedProgress/);
    assert.match(atlas, /scopedComponentCodeCount/);
    assert.match(atlas, /scopedLaneReadyCount/);
    assert.match(atlas, /scopedNoLaneCount/);
    assert.match(atlas, /Scope readiness/);
    assert.match(atlas, /No lane/);
    assert.match(atlas, /selectedSubtopicNodes/);
    assert.match(atlas, /selectedSubtopicIndex/);
    assert.match(atlas, /selectedSubtopicPosition/);
    assert.match(atlas, /previousSubtopicCode/);
    assert.match(atlas, /nextSubtopicCode/);
    assert.match(atlas, /This subtopic/);
    assert.match(atlas, /Prev in subtopic/);
    assert.match(atlas, /Next in subtopic/);
    assert.match(atlas, /aria-current=\{active \? "true" : undefined\}/);
    assert.match(atlas, /Scope: \{scopeLabel\}/);
    assert.match(atlas, /scopedWalkCode/);
    assert.match(atlas, /scopedWalkActionLabel/);
    assert.match(atlas, /Start walk/);
    assert.match(atlas, /Continue walk/);
    assert.match(atlas, /Restart walk/);
    assert.match(atlas, /focusSelectedSubtopic/);
    assert.match(atlas, /Focus this subtopic/);
    assert.match(atlas, /toggleStudiedCode/);
    assert.match(atlas, /Studied on this device/);
    assert.match(atlas, /Mark studied/);
    assert.match(atlas, /Next unstudied/);
    assert.match(atlas, /window\.localStorage\.setItem/);
    assert.match(atlas, /Saved on this device for next time/);
    assert.match(atlas, /nextPracticeCode/);
    assert.match(atlas, /previousPracticeCode/);
    assert.match(atlas, /ComponentPreviewRow/);
    assert.match(atlas, /leadme_item_previews/);
    assert.match(atlas, /debrief_element_previews/);
    assert.match(atlas, /Approval gate/);
    assert.match(atlas, /readRequestedCode/);
    assert.match(atlas, /const requestedCode = readRequestedCode\(\)/);
    assert.doesNotMatch(atlas, /useState\(readRequestedCode\)/);
    assert.match(atlas, /window\.history\.replaceState/);
    assert.match(atlas, /chooseComponentFilter/);
    assert.match(atlas, /matchesComponentFilter/);
    assert.doesNotMatch(atlas, /Direct link/);
    assert.match(answer, /Case study path/);
    assert.match(answer, /ModuleValue/);
    assert.match(answer, /case_study_modules/);
    assert.match(answer, /Related study detours/);
    assert.match(answer, /detourHref/);
    assert.match(answer, /\/traps\/\$\{encodeURIComponent\(detour\.key\)\}/);
    assert.match(answer, /answer\.detours/);
    assert.match(answer, /key !== "detours"/);
    assert.match(answer, /Study this outline code/);
    assert.match(answer, /Review code questions/);
    assert.match(answer, /Practice this question/);
    assert.match(answer, /practiceHref/);
    assert.match(answer, /#atlas-code-questions/);
    assert.match(answer, /encodeURIComponent\(q\.outline_code\)/);
    assert.match(practice, /getAtlasAnswer/);
    assert.match(practice, /getAtlasQuestions/);
    assert.match(practice, /Submit answer/);
    assert.match(practice, /useRouter/);
    assert.match(practice, /hasRenderableCaseStudyModules/);
    assert.match(practice, /router\.push\(answerHref\)/);
    assert.match(practice, /setSelection/);
    assert.match(practice, /submitted: true/);
    assert.match(practice, /selected === q\.correct_answer/);
    assert.match(practice, /Study answer debrief/);
    assert.match(practice, /QuestionNavLink/);
    assert.match(practice, /Next question/);
    assert.match(practice, /Previous question/);
    assert.doesNotMatch(practice, /QuestionRunner/);
    assert.match(client, /getAtlasComponents/);
    assert.match(client, /AtlasLeadMeItemPreview/);
    assert.match(client, /AtlasDebriefElementPreview/);
    assert.match(client, /AtlasAnswerDetour/);
    assert.match(client, /startAtlasLeadMe/);
    assert.match(body, /open approved questions, lessons, and component lanes/);
    assert.doesNotMatch(atlas, /review_count|source_ref|source_label|included_by/);
  });

  it("does not expose raw command-deck fetch failures in the dashboard card", () => {
    const dashboard = readProjectFile("app/dashboard/page.tsx");

    assert.match(dashboard, /Live data sync degraded\. Some panels may be temporarily stale\./);
    assert.match(dashboard, /Your briefing is temporarily unavailable\./);
    assert.doesNotMatch(dashboard, /<p[^>]*>\{error\}<\/p>/);
    assert.doesNotMatch(dashboard, /Live data sync degraded: \{error\}/);
    assert.doesNotMatch(dashboard, /temporarily unavailable\{error/);
  });
});
