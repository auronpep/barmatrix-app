import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readProjectFile(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("diagnostic results enrolled CTA", () => {
  it("renders one recommended next-step CTA instead of dashboard or pricing hubs", () => {
    const source = readProjectFile("app/diagnostic/[session]/results/page.tsx");

    assert.match(source, /import \{ useDashboard, type DashboardState \} from "@\/lib\/use-dashboard";/);
    assert.match(source, /const dash = useDashboard\(\);/);
    assert.match(source, /const accessState = resolveDiagnosticResultsAccess\(dash, recentCheckoutAccess\);/);
    assert.match(source, /\{accessState === "enrolled" && \(\s*<RecommendationCta\s+methodSlug=\{methodSlug\}\s+results=\{results\}/);
    assert.match(source, /<ResultsDecisionPanel\s+diagnosticId=\{diagnosticId\}\s+results=\{results\}\s+accessState=\{accessState\}/);
    assert.match(source, /case "enrolled":/);
    assert.match(source, /href="\/dashboard\/path"/);
    assert.match(source, /Continue your repair path/);
    assert.match(source, /if \(dash\.error\) return "access_unavailable";/);
    assert.match(source, /case "access_unavailable":/);
    assert.match(source, /We could not confirm active access from this screen\./);
    assert.match(source, /href="\/account"/);
    assert.match(source, /"account_unconfirmed"/);
    assert.match(source, /if \(dash\.signedIn && dash\.data && !dash\.data\.enrolled\) return "account_unconfirmed";/);
    assert.match(source, /case "account_unconfirmed":/);
    assert.match(source, /This signed-in account is not showing active Flagship access yet\./);
    assert.match(source, /confirm or recover access before another checkout/i);
    assert.match(source, /useRecentConfirmedCheckoutAccess/);
    assert.match(source, /const recentCheckoutAccess = useRecentConfirmedCheckoutAccess\(\);/);
    assert.match(source, /resolveDiagnosticResultsAccess\(dash, recentCheckoutAccess\)/);
    assert.match(source, /"recent_checkout"/);
    assert.match(source, /if \(recentCheckoutAccess\.checking\) return "checking";/);
    assert.match(source, /if \(recentCheckoutAccess\.active\) return "recent_checkout";/);
    assert.match(source, /case "recent_checkout":/);
    assert.match(source, /This browser has a confirmed checkout on record\./);
    assert.match(source, /buildDiagnosticRecommendation/);
    assert.match(source, /Your top leak is \{rec\.topLeak\} - start here\./);
    assert.match(source, /results\.recommendation\?\.next_step/);
    assert.match(source, /apiRecommendation\?\.level\?\.level/);
    assert.match(source, /apiRecommendation\?\.level\?\.label/);
    assert.match(source, /apiRecommendation\?\.level\?\.description/);
    assert.match(source, /nextStep\.primary_label/);
    assert.match(source, /redZoneDetailHref\(results\) \?\? "\/red-zones"/);
    assert.doesNotMatch(source, /Open dashboard/);
    assert.doesNotMatch(source, /How it works/);
  });

  it("updates placement results to use the level and top remediation target as the CTA", () => {
    const source = readProjectFile("app/diagnostic/session/[sessionId]/results/page.tsx");

    assert.match(source, /<ProgramCta\s+methodSlug=\{methodSlug\}\s+results=\{results\}\s+accessState=\{accessState\}/);
    assert.match(source, /Recommended next step - L\{results\.placement_level\}/);
    assert.match(source, /Your top leak is \{topLeak\} - start here\./);
    assert.match(source, /placementNextStep\(results\.placement_level, methodSlug\)/);
    assert.match(source, /results\.top_remediation_targets\[0\]/);
    assert.doesNotMatch(source, /Start your program at the right level/);
  });

  it("gates placement result CTAs by checkout and enrollment state", () => {
    const source = readProjectFile("app/diagnostic/session/[sessionId]/results/page.tsx");

    assert.match(source, /import \{ useDashboard, type DashboardState \} from "@\/lib\/use-dashboard";/);
    assert.match(source, /import \{ useRecentConfirmedCheckoutAccess \} from "@\/lib\/checkout-access-state";/);
    assert.match(source, /const dash = useDashboard\(\);/);
    assert.match(source, /const recentCheckoutAccess = useRecentConfirmedCheckoutAccess\(\);/);
    assert.match(source, /const accessState = resolvePlacementResultsAccess\(dash, recentCheckoutAccess\);/);
    assert.match(source, /<ProgramCta\s+methodSlug=\{methodSlug\}\s+results=\{results\}\s+accessState=\{accessState\}/);
    assert.match(source, /type PlacementResultsAccessState =/);
    assert.match(source, /function resolvePlacementResultsAccess/);
    assert.match(source, /case "enrolled":/);
    assert.match(source, /This placement is already tied to active Flagship access\./);
    assert.match(source, /href="\/dashboard\/path"/);
    assert.match(source, /Continue your repair path/);
    assert.match(source, /case "recent_checkout":/);
    assert.match(source, /This browser has a confirmed checkout on record\./);
    assert.match(source, /href="\/account"/);
    assert.match(source, /case "account_unconfirmed":/);
    assert.match(source, /confirm or recover\s+access before another checkout/i);
    assert.match(source, /case "signed_out":/);
    assert.match(source, /Sign in before starting another checkout/);
  });

  it("remembers confirmed checkout access for later diagnostic-result screens", () => {
    const tracker = readProjectFile("app/checkout/success/purchase-success-tracker.tsx");
    const state = readProjectFile("lib/checkout-access-state.ts");

    assert.match(tracker, /rememberConfirmedCheckoutAccess\(\{ checkoutSessionId \}\)/);
    assert.match(state, /barmatrix\.checkout\.confirmed_access/);
    assert.match(state, /RECENT_CHECKOUT_ACCESS_TTL_MS/);
    assert.match(state, /useRecentConfirmedCheckoutAccess/);
  });
});
