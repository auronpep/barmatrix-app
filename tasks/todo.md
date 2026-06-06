# BarMatrix Full Bug Audit

## Scope

- Audit the local BarMatrix study web app from the rendered UI and project runtime evidence.
- Treat the flow under test as: app loads -> first meaningful screen renders -> primary study/navigation controls respond without runtime errors.
- Fix concrete root causes with the smallest clean implementation changes.
- Add or update regression coverage where the bug is practical to capture in the current test stack.

## Plan

- [x] Read `AGENTS.md` and `tasks/lessons.md` if present.
- [x] Confirm repository, package scripts, and current working tree state.
- [x] Read relevant local Next.js 16 docs before modifying app code.
- [x] Map routes, components, data access, tests, and likely user flows.
- [x] Start the local app and reproduce behavior through the in-app browser.
- [x] Record observed issues with UI evidence, console logs, and affected files.
- [x] Prioritize root-cause fixes that are small, clean, and testable.
- [x] Add failing regression tests or focused repro scripts before implementation fixes where practical.
- [x] Implement the smallest clean fixes.
- [x] Run focused tests, full available tests, lint, build, and browser verification.
- [x] Add review notes with checks run and any remaining risk.

## Findings Fixed

- Public/auth-adjacent study routes (`/foundations`, `/mastery`, `/coach`, `/certification`) could stay in a loading-only state when Clerk's browser script did not finish loading.
- `/sign-in` could render only the app shell when Clerk's hosted auth UI did not finish loading, leaving protected-route redirects with no useful account-access state.
- Completed drill retry used the anonymous `api.startDrill` path and swallowed failures, so "Retry missed questions" could appear to do nothing for signed-in users.
- `/practice` subject sets accepted only a top-level `questions` response, while neighboring subject flows already support `questions`, `items`, `results`, or `data`.
- `/drills/criminal-law` was labeled "Criminal Law & Procedure" but only queried `Criminal Law`.

## Review

- Added regression tests for Clerk load fallback, auth form fallback, drill retry auth, practice subject response normalization, and Criminal Law & Procedure drill coverage.
- Added a 3-second Clerk auth fallback that treats unresolved Clerk loading as signed-out for public/auth-adjacent surfaces, while still allowing Clerk to take over if it eventually loads.
- Wrapped Clerk SignIn/SignUp in a client fallback so account-access routes are not blank when the hosted UI stalls.
- Passed the active Clerk token to retry-drill creation and surfaced retry failures in the mastery card.
- Normalized `/practice` subject responses to match the shape tolerance already used in nearby study pages.
- Changed the Criminal Law quick drill to fetch both `Criminal Law` and `Criminal Procedure`.

## Verification

- Red/green regression checks were run for each new test before and after implementation.
- `node --test tests\*.test.ts` passed: 18 tests, 18 pass.
- `node scripts\check-auth-proxy.mjs` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check` passed with only existing CRLF normalization warnings.
- In-app Browser verified:
  - `/foundations` leaves loading and renders The Method with sign-in progress CTA.
  - `/mastery`, `/coach`, and `/certification` leave loading and show signed-out prompts.
  - `/sign-in` shows the account-access fallback instead of an empty shell when hosted Clerk UI does not load.
  - `/practice` loads, selecting `Civil Procedure` renders a real question with no console errors.
  - `/drills/criminal-law` redirects unauthenticated traffic through the protected-route proxy to `/sign-in`, where the fallback is visible.

## Remaining Risk

- Authenticated-only drill retry behavior was verified by source regression, lint, type/build checks, and protected-route browser redirect behavior. A signed-in browser session was not available in the in-app browser, so the actual authenticated retry click was not exercised end to end.

# Push Changes

## Certification CTA Render Fix Plan

- [x] Read local project setup map and switch to the real frontend repo.
- [x] Review app-local instructions and relevant Next.js CSS/App Router docs.
- [x] Locate the certification locked route and CTA source.
- [x] Reproduce the certification route locally on port 3001.
- [x] Inspect the live route, compiled CTA CSS, and console health.
- [x] Add the smallest useful regression coverage for this CTA.
- [x] Fix the root cause in the owning component/style.
- [x] Verify the exact route visually and run lint/build.
- [x] Record review notes.

### Certification CTA Render Fix Review

- Changed the locked certification `Go to The Method` CTA from a Tailwind utility stack to a dedicated `certification-method-cta` class.
- Added the class to `app/globals.css` with explicit red background, white text, fixed minimum height, padding, and hover/active states. The rule intentionally does not inherit `.btn` uppercase text transformation, preserving the screenshot's title-case label.
- Added `tests/certification-cta.test.ts` to lock the CTA class and readable red/white CSS.
- Local dev was used for reproduction and CSS inspection; production deployment is the finish line for this bug.

### Certification CTA Render Fix Verification

- Red/green check: `node --test tests\certification-cta.test.ts` failed before the component/style change and passed after it.
- `node --test tests\*.test.ts` passed: 13 tests, 13 pass.
- `npm run lint` passed.
- `npm run build` passed.
- Browser verification opened `http://localhost:3001/certification`; route rendered without console errors. The unauthenticated browser remained in Clerk's `Loading certification...` branch, so the signed-in locked card was not directly visible locally.
- Live compiled CSS inspection confirmed `.certification-method-cta` is emitted with `background: var(--red)` and `color: rgb(255, 255, 255)`.
- Actual-site path: commit and push `main` to `auronpep/barmatrix-app`; Vercel project `barmatrix-app` is linked to this repo and domain `barmatrix.app`.

- [x] Inspect branch, local diffs, and remote visibility.
- [x] Run focused verification for current changes.
- [x] Commit pending work if verification passes.
- [x] Push `main` to the confirmed-private `origin`.
- [x] Verify local and remote refs match after push.

## Notes

- `main` is 6 commits ahead of `origin/main` before this task.
- `origin` points to private repository `auronpep/barmatrix-app`.
- Pending source changes route attempt submission and dashboard auth through existing keyless-safe hooks.

## Verification

- `git diff --check` passed with only Git CRLF normalization warnings.
- `npm run lint` passed.
- `npm run build` passed.

## Review

- Confirmed `origin` is the private GitHub repository `auronpep/barmatrix-app`.
- Included the two source changes that make dashboard auth and question-attempt submission use keyless-safe hooks.
- Pushed `main` after verification.

# Signed-In Drill Flow Verification

## Plan

- [x] Inspect the current `/sign-in` redirect page in the in-app browser.
- [x] Determine whether Clerk's hosted sign-in UI is usable in the local browser session.
- [ ] If sign-in is available, authenticate through the UI and follow the redirect to `/drills/criminal-law`.
- [ ] Verify the Criminal Law & Procedure drill flow while signed in.
- [x] Capture browser evidence, console health, and any blocker/root cause found.

## Review

- The in-app browser reopened `http://localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fdrills%2Fcriminal-law`.
- The visible page remained on the auth fallback with zero inputs and zero Clerk buttons.
- Browser console captured Clerk rejecting the local origin: production keys are only allowed for `barmatrix.app`, and `http://localhost:3000` is not accepted.
- Local environment inspection found only live Clerk keys in `.env.local`; no development/test Clerk key exists in process env or `.vercel` local env files.
- Signed-in local drill verification is blocked until the local app uses development Clerk keys or runs under an allowed production-domain origin with a valid user session.

# Signed-In Drill Attempt API 500

## Plan

- [x] Use Clerk test keys locally without exposing secrets in logs or task notes.
- [x] Reproduce the paid signed-in Criminal Law & Procedure drill flow in the in-app browser.
- [x] Trace the submit-answer failure through local runtime evidence.
- [x] Add regression tests for the DB wrapper behavior and optional C3 attempt-field fallback.
- [x] Apply the smallest API fixes at the root causes.
- [x] Run targeted API tests plus full API test/typecheck/build.
- [x] Point local web verification at the fixed local API and submit an answer from the signed-in UI.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Signed-in browser reproduction on `/drills/criminal-law` reached a real question and failed on submit with `API 500: "internal server error"`.
- Local API trace showed the first root cause: the DB wrapper sent `BEGIN` through mysql2's prepared-statement protocol, which this MySQL runtime rejects.
- After fixing that, local runtime exposed the second root cause: `answer_choices.c3_mold_code` is optional/unprovisioned in the current DB, but `/api/attempts` selected it as mandatory before recording the attempt.
- API change in `C:\barmatrix-api`: use mysql2's simple query protocol with escaped placeholder values for the pg-shaped wrapper, preserving `$n -> ?` conversion and avoiding prepared-statement incompatibilities for `BEGIN` and `LIMIT/OFFSET`.
- API change in `C:\barmatrix-api`: make selected-choice lookup fall back without `c3_mold_code`, leaving C3 SRS enrichment null when the optional column is missing while still recording the answer attempt.
- The local API fixture DB only has Evidence questions, so final signed-in browser verification used `/drills/evidence` against `http://localhost:8080`; the original Criminal Law failure and the verified Evidence submit share the same `/api/attempts` route.

## Verification

- API red checks failed before implementation:
  - `npx tsx --test src/db.test.ts`
  - `npx tsx --test src/routes/attempts.test.ts`
- API checks passed after implementation:
  - `npx tsx --test src/db.test.ts`
  - `npx tsx --test src/routes/attempts.test.ts`
  - `npm test` passed: 260 tests, 260 pass.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - Direct `POST http://localhost:8080/api/attempts` with a local Evidence question returned HTTP 200.
- Frontend checks passed:
  - `node --test tests\*.test.ts` passed: 18 tests, 18 pass.
  - `npm run lint` passed.
  - `npm run build` passed.
- Browser verification passed:
  - Signed-in paid-subscriber session opened `http://localhost:3000/drills/evidence`.
  - Started the drill, selected `A. Yes`, clicked `Submit answer`.
  - UI rendered `Wrong Answer Forensics` with `Next Evidence question`; no recent browser errors were recorded after the verification window.
- `git diff --check` passed in both repos with only existing CRLF normalization warnings.

# Comprehensive Signed-In Audit

## Scope

- Audit the local BarMatrix web study program using the paid signed-in in-app browser session.
- Use `http://localhost:3000` for the web app and `http://localhost:8080` for the fixed local API currently configured in `.env.local`.
- Cover app shell, protected study routes, subject/drill flows, dashboard/account surfaces, public catalog routes, API-backed empty states, console health, and server logs.
- Fix only concrete reproduced root causes with small changes and regression coverage where practical.

## Plan

- [x] Refresh project instructions, active dirty worktree state, and local server status.
- [x] Map route inventory and API endpoints worth smoking.
- [x] Capture baseline app/API logs and current browser console health.
- [x] Browser-smoke signed-in navigation across dashboard, account, foundations, mastery, coach, certification, drills, practice, red-zones, traps, tensions, and subject pages.
- [x] Exercise primary workflows that mutate harmless local data: Evidence drill answer, practice set start/submit, timed set start/submit, and coach start.
- [x] Inspect API logs and browser console after each route cluster.
- [x] Triage each reproduced issue to root cause before editing code.
- [x] Add or update regression tests for fixes where practical.
- [x] Run targeted tests, full relevant app/API checks, and browser re-verification.
- [x] Add review notes, screenshots, commands, and remaining risk.

## Review

- Browser route smoke covered `/`, `/dashboard`, `/account`, `/foundations`, `/mastery`, `/coach`, `/certification`, `/certification/M1`, `/boot-camps`, `/practice`, `/timed-sets`, `/traps`, `/tensions`, `/red-zones`, and `/drills/evidence`.
- API smoke covered `/health`, `/api/foundations`, `/api/boot-camps`, `/api/drills/catalog`, `/api/traps`, `/api/tensions`, and `/api/questions/by-subject?subject=Evidence&page=1&limit=3`.
- Fixed `C:\barmatrix-api`: `/api/boot-camps` now returns an empty catalog when the optional `boot_camps` table is not provisioned instead of surfacing API 500 in the web UI.
- Fixed `C:\barmatrix-api`: certification start now fails closed on Method completion before writing `cert_sessions`, preventing locked users from hitting an unprovisioned session table path.
- Fixed `C:\barmatrix-app`: direct certification competency routes map 401/403 responses to sign-in or Method-gate UI instead of raw `API 401/403`.
- Fixed `C:\barmatrix-app`: stale rejected sessions in Foundations, C3 Mastery, and Red Zones now render public/signed-out product states instead of raw API-status copy.
- Verified Evidence study flow after the fixes: opened `/drills/evidence`, started the queue, selected `A. Yes`, submitted, and saw `Wrong Answer Forensics` with no recent browser errors.
- The local fixture DB only has Evidence study questions and no boot-camp/cert session tables, so audit verification used Evidence for mutating study flow and validated missing optional tables through graceful empty/locked states.

## Verification

- App: `node --test tests\*.test.ts` passed: 22 tests, 22 pass.
- App: `npm run lint` passed.
- App: `npm run build` passed.
- API: `npm test` passed: 262 tests, 262 pass.
- API: `npm run typecheck` passed.
- API: `npm run build` passed.
- `git diff --check` passed in both repos with only existing CRLF normalization warnings.
- Direct API `GET http://localhost:8080/api/boot-camps` returned HTTP 200 with `{"boot_camps":[]}`.
- Browser screenshots saved:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-audit-boot-camps-after-restart.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-audit-certification-m1-ux-after-fix.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-audit-evidence-submit-final.png`

# Remaining Workflow Test Pass

## Scope

- Continue the audit test list against the local web app and API.
- Prioritize seeded happy paths: boot camps, certification unlock/submit, subject drills, diagnostic, red-zone details, entitlement/account surfaces, and responsive smoke.
- Do not rely on bug-specific facts outside the local project/runtime.

## Plan

- [x] Re-read project instructions and confirm `tasks/lessons.md` status.
- [x] Inspect local schema/data readiness for boot-camp and certification happy paths.
- [x] Verify boot-camp catalog/detail/start/day/mastery if local schema/data exists, otherwise document exact blocker and seed path.
- [x] Verify certification unlocked route and submit flow if a local complete-Method user exists, otherwise document exact blocker and seed path.
- [x] Verify subject drill submit paths that have local question data.
- [x] Verify diagnostic end-to-end if enough local questions exist.
- [x] Verify red-zone detail and repair-drill flow from real attempt history.
- [x] Verify entitlement/account surfaces for signed-out, stale-session, active, and unavailable states practical in local runtime.
- [x] Run responsive browser smoke on core study routes.
- [x] Run relevant automated checks after any change and document results.

## Review

- Local schema/data readiness was expanded with additive local-only Method, certification, boot-camp, and gamification tables. The local question bank still contains only Evidence questions, so cross-subject happy paths remain limited by fixture data.
- Boot-camp catalog/detail/start/day flow verified in the in-app browser with seeded `hearsay-trap-camp`. Day 1 answered all 8 pinned local questions and posted attempts successfully. Mastery correctly stayed locked because the day did not pass the 75% advance gate.
- Certification hub was unlocked for the complete-Method paid user. M1 loaded, accepted 10 radio selections, submitted, and returned item-by-item grading plus remediation links.
- Evidence subject drill started and submitted a real answer, then rendered Wrong Answer Forensics and the next-question control.
- Diagnostic started, answered all 8 local questions, and rendered results from the local bank. Fixed the paid-user CTA so enrolled users see dashboard/red-zone next steps instead of `Enroll for $999`.
- Red Zone Library populated from real attempt history; `tension_point/confrontation_clause` detail rendered recent misses/questions and its repair link routed to `/drills/evidence`.
- Dashboard showed active subscriber metrics. Fixed `/account` so signed-in enrolled users see `Account active` and `Active` entitlement status instead of the static `Pending sign-in` placeholder.
- Responsive smoke at 390px found global horizontal overflow from the header diagnostic CTA. Added the existing `hide-md` class to that secondary CTA and verified no overflow on dashboard, Evidence drill, Red Zones, Certification M1, and Account.

## Verification

- Red/green focused tests:
  - `node --test tests\diagnostic-results-enrolled-cta.test.ts`
  - `node --test tests\account-entitlement-state.test.ts`
  - `node --test tests\nav-mobile-overflow.test.ts`
- Full app checks:
  - `node --test tests\*.test.ts` passed: 25 tests, 25 pass.
  - `npm run lint` passed.
  - `npm run build` passed.
- API checks:
  - `npm test` passed: 262 tests, 262 pass.
  - `npm run typecheck` passed.
  - `npm run build` passed.
- Browser screenshots saved:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-remaining-boot-camp-finish-day.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-remaining-diagnostic-enrolled-cta.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-remaining-evidence-drill-submit.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-remaining-red-zone-detail.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-remaining-certification-m1-submit.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-remaining-account-live.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-remaining-mobile-overflow-fixed.png`

# Live Environment Audit

## Scope

- Verify the deployed BarMatrix frontend and API with runtime evidence.
- Check public deployment routing, API health, CORS, protected-route failure modes, and deployed frontend rendering.
- Avoid destructive or paid-provider side effects unless explicitly approved.

## Plan

- [x] Re-read project instructions and confirm `tasks/lessons.md` status.
- [x] Inspect deployment/environment wiring without exposing secret values.
- [x] Smoke live frontend redirects and rendering.
- [x] Smoke live API health, public routes, CORS preflight, and protected unauthenticated responses.
- [x] Use the in-app browser to verify live page console health and visible route states.
- [x] Triage any reproduced live/local parity bugs with focused regression coverage where practical.
- [x] Run relevant checks and document remaining risk.

## Review

- Live `https://barmatrix.app` returned HTTP 200 from Vercel; `https://www.barmatrix.app` returned a 308 redirect to the apex domain.
- Live API `https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
- Live API public reads returned HTTP 200 for cohort status, boot camps, boot-camp detail, foundations, drill catalog, traps, tensions, C3 deck, and representative subject question queries for Evidence, Criminal Law, Criminal Procedure, Contracts, and Civil Procedure.
- Live API protected unauthenticated routes returned expected auth/gate responses rather than server errors: dashboard 401, boot-camp start 401, C3 401, C3 next 401, certification M1 401/locked, certification start 401/not authorized.
- Live CORS preflight for `Origin: https://barmatrix.app` against `/api/diagnostic/start` returned HTTP 204 with credentialed origin headers.
- In-app browser smoke verified live homepage, boot camps, practice, foundations, certification, red zones, traps, tensions, diagnostic, account redirect, protected Evidence drill redirect, and sign-in UI with no fresh `barmatrix.app` console warnings/errors at the tested desktop viewport.
- In-app browser interaction on live `/practice` clicked the Evidence subject and rendered a real live question without writing an attempt.
- `vercel env ls` did not complete within 60 seconds, likely waiting on CLI auth/context. Local pulled env metadata was inspected by variable name only; no secret values were printed.
- Screenshot capture from the in-app browser timed out during `Page.captureScreenshot`; visible DOM/runtime evidence was still captured.

## Verification

- App `node --test tests\*.test.ts` passed: 25 tests, 25 pass.
- App `npm run lint` passed.
- App `npm run build` passed.
- API `npm test` passed: 262 tests, 262 pass.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- `git diff --check` passed in both repos with only Git CRLF normalization warnings.

## Remaining Risk

- The local fixes are still uncommitted/unshipped in the working trees; live verification is against the currently deployed build, not these pending changes.
- Live paid-subscriber mutating flows were not exercised because they require a production subscriber session and would write live attempts/sessions.
- Live mobile-width verification is not complete; the in-app browser did not expose a viewport resize capability in this session.
- Public `/practice` answer submission was intentionally not clicked on live because it writes through `/api/attempts`.

# Post-Push Deployment Pass

## Review

- Frontend fix commit `418e9452c70ad2e586cbcb88634c3a2044e2d4d1` was pushed to `auronpep/barmatrix-app` `main`.
- API fix commit `c4fbdcf9529e5d7edd6689644ec25b6a20f9dfd2` was pushed to `auronpep/barmatrix-api` `main`.
- Hostinger API auto-pulled `c4fbdcf`; remote `/home/u211961595/domains/barmatrix.app/nodejs` reports that exact SHA and built `dist` includes the DB wrapper, attempts fallback, boot-camp, and certification fixes.
- Live API smoke after deploy passed:
  - `GET https://api.barmatrix.app/health` returned HTTP 200 with DB up.
  - `GET https://api.barmatrix.app/api/boot-camps` returned HTTP 200.
  - `POST https://api.barmatrix.app/api/attempts` with a valid live Evidence question returned HTTP 200 and an `attempt_id`.
  - `GET https://api.barmatrix.app/api/attempts/{attempt_id}/forensics` returned HTTP 200.
- Vercel still reports frontend production on prior commit `2c52e920752ecf7207163f6d2aba050af8f64fb0`; no GitHub deployment/status exists for frontend commit `418e945`.
- Local Vercel CLI is not authenticated/usable in this shell: `vercel whoami`, `vercel project ls --yes`, and `vercel deploy --prod --yes` all timed out without output. The Vercel connector can inspect deployments but its deploy tool only delegates to the CLI.
- GitHub issue `auronpep/barmatrix-app#2` tracks the Vercel deployment blocker.

## Verification

- Before commit/push, the frontend staged set passed `node --test tests\*.test.ts`, `npm run lint`, `npm run build`, and `git diff --cached --check`.
- Before commit/push, the API staged set was verified alone with unrelated admin work stashed out: `npm test`, `npm run typecheck`, `npm run build`, and `git diff --cached --check` all passed.
- GitHub `origin/main` matches local `main` for both pushed commits.

## Remaining Risk

- Frontend fixes are pushed but not deployed to `https://barmatrix.app`; production is still serving Vercel deployment `dpl_8dwjftRNZg8g9domuuYKUDeShdvB` from commit `2c52e92`.
- The frontend deployment path needs repair or an authenticated Vercel CLI/session before the web fixes can be live-verified.
- API paid-subscriber flows are not fully production-verified; the live mutation proof used one anonymous attempt to minimize production data impact.
- API repo still has local unstaged admin/complimentary-access work that was intentionally excluded from the fix commit.

# Production Deployment Resolution

## Review

- Found a `VERCEL_TOKEN` entry in `C:\Users\wks2391\.env` by name/presence only; no token value was printed.
- `vercel whoami` succeeded with that token as `sunnylwood-7609`.
- `vercel deploy --prod --yes` succeeded for the linked local project and produced deployment `dpl_7KuTzneMWvjb1gt82fqB24AGxpG2`.
- Vercel now reports latest production deployment `dpl_7KuTzneMWvjb1gt82fqB24AGxpG2`, `READY`, sourced from frontend commit `418e9452c70ad2e586cbcb88634c3a2044e2d4d1`.
- `https://barmatrix.app` is aliased to the new deployment and returned HTTP 200.
- GitHub issue `auronpep/barmatrix-app#2` was closed as completed with the production deployment evidence.
- Live browser verification on production:
  - `/practice` rendered the study bank.
  - Evidence practice answer submission returned `Correct` and `Rule held`.
  - Missed Evidence answers rendered `WRONG ANSWER FORENSICS` with correct-answer and failure explanation copy.
  - `/drills/evidence` redirected to production sign-in when unauthenticated.
  - Production page source contains a live Clerk public key marker and not a test-key marker.

## Verification

- Vercel production build completed successfully during deploy.
- App `node --test tests\*.test.ts` passed: 25 tests, 25 pass.
- App `npm run lint` passed.
- App `npm run build` passed.
- API `npm test` passed: 262 tests, 262 pass.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- Live API `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.

## Remaining Risk

- Production paid-subscriber routes were verified locally with the signed-in paid session, but not fully re-exercised on the production domain because the browser did not have a production-domain subscriber session.
- Production public practice verification wrote several live anonymous Evidence attempts while testing correct and missed-answer states.
- Live mobile-width verification remains incomplete.
- API repo still has local unstaged admin/complimentary-access work that was intentionally excluded from the live fix commit.

# Production Paid And Mobile Verification

## Review

- Used the deployed Hostinger app context for a sanitized production data check:
  - 13 students.
  - 6 purchases.
  - 6 active, non-refunded purchases.
  - 3 boot camps.
  - 3666 active questions.
- Created a short-lived Clerk sign-in token for the active QA paid account only. The token URL was stored in a temp file, was not printed, and the temp file was deleted after browser sign-in.
- In-app browser signed into production as the QA paid subscriber; production nav showed `Dashboard` and a user menu.
- Production paid browser verification:
  - `/dashboard` rendered paid dashboard state with Method progress, enrolled diagnostic CTA, C3 state, metrics, and next drill.
  - `/account` rendered `Account active`, `Active`, and `Verified from signed-in account`.
  - `/red-zones` rendered enrolled state, and after the paid drill attempt showed 3 active red zones.
  - `/mastery` rendered authenticated C3 state (`Not yet measured`) without API errors.
  - `/certification` rendered the expected Method gate for the QA account.
  - `/certification/M1` rendered the direct-route Method CTA instead of raw API status text.
  - `/drills/evidence` started a paid Evidence queue, submitted an answer, and rendered the live `Wrong Answer Forensics` rail.
  - `/boot-camps/hearsay-trap-camp` started a production boot-camp session and loaded the session hub with Day 1 available.
  - `/boot-camps/sessions/{session_id}/days/1` loaded the live 12-question Day 1 block.
- Production mobile verification used the in-app browser viewport override at 390x844:
  - No document-level horizontal overflow on `/dashboard`, `/account`, `/drills/evidence`, `/red-zones`, `/boot-camps`, or `/certification`.
  - Mobile screenshot saved at `C:\Users\wks2391\AppData\Local\Temp\barmatrix-production-mobile-certification.png`.
- Production browser log check after the paid/mobile pass returned zero `barmatrix.app` warning/error entries.

## Verification

- Runtime/UI verification was performed against `https://barmatrix.app` production, not localhost.
- The temporary viewport override was reset after mobile testing.
- The short-lived sign-in URL temp file was deleted after use.
- App `node --test tests\*.test.ts` passed: 25 tests, 25 pass.
- App `npm run lint` passed.
- App `npm run build` passed.
- API `npm test` passed: 262 tests, 262 pass.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- `git diff --check` passed in app and API repos; the app repo reported only existing LF-to-CRLF normalization warnings for `tasks/evidence.md` and `tasks/todo.md`.

## Remaining Risk

- Production certification submit was not exercised because the QA paid account has 0/14 Method lessons complete, so the locked Method gate is the correct production state for that account.
- Production boot-camp Day 1 was opened but not completed; completing the full day would write 12 more live QA attempts.
- Account billing portal was not opened because the QA paid purchase has no Stripe customer ID; testing that path safely requires a QA account with a Stripe-backed purchase or explicit approval to use a real customer-backed account.
- API repo still has local unstaged admin/complimentary-access work that is outside this deployed audit fix.

# Remaining Production Gap Closure

## Scope

- Close the remaining live-audit gaps using QA-only data where practical.
- Do not use or impersonate a real customer-backed account.
- Do not print Clerk, Stripe, database, or sign-in token secret values.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Inspect certification, billing portal, and boot-camp route requirements.
- [x] Prepare reversible QA-only fixtures for Method completion and Stripe billing ownership.
- [x] Verify production certification submit from the signed-in QA account.
- [x] Verify production billing portal creation/redirect from the signed-in QA account.
- [x] Verify production boot-camp day completion and mastery path where safe.
- [x] Run relevant tests/lint/build and record evidence.

## Review

- Certification storage hardening was added in `C:\barmatrix-api`:
  - Missing optional certification session storage now returns a non-persisted session response instead of API 500.
  - Missing optional certification result storage now preserves the frontend grade response shape, including nested `result.conditions`.
- Production certification verification used a reversible QA Method fixture:
  - `/certification` unlocked for the QA paid subscriber.
  - `/certification/M1` loaded, accepted 10 answers, submitted, and rendered `M1 · RESULTS`, `NOT YET`, item feedback, remediation links, and `(NOT SAVED — SYNC PENDING)` rather than an error boundary.
- Production billing portal verification used a temporary QA Stripe customer:
  - `/account` rendered `Update Payment Method`.
  - Clicking the account control opened Stripe Billing Portal for the temporary QA customer.
  - The portal URL and account identity were not recorded in task notes.
- Production boot-camp verification completed the full Hearsay Trap Boot Camp for the QA account:
  - Day 1 through Day 5 each completed through the UI.
  - Mastery unlocked after Day 5.
  - A reload during mastery resumed at `Question 19 of 24` after the resume fix, instead of restarting or staying in the fetch-error state.
  - Remaining mastery answers completed through the UI and rendered `Camp complete`, `Mastery score 100%`, `24/24 correct`, `+440 XP`, `Camp Cleared`, and `Mastery Ace`.
- A production-only lint blocker from the remote diagnostic feature was fixed after rebasing:
  - `app/diagnostic/session/[sessionId]/page.tsx` no longer calls `Date.now()` during render.
  - The question-state reset moved from a synchronous effect into the existing next-question event path.
- Deployment:
  - API commit `21020f3` was pushed and its built `boot-camps` route artifact was copied to Hostinger, then the app was restarted.
  - Frontend commit `6948e78` and lint cleanup commit `7f95cc3` were pushed.
  - Vercel production deployment `dpl_7KgW8i2RU3dpwMpsBa8LLT7B2MD9` is `READY` and aliased to `https://barmatrix.app`.
- QA fixture cleanup completed:
  - Removed 14 temporary Method progress rows.
  - Deleted the temporary Stripe customer only after verifying audit-fixture metadata.
  - Restored the QA purchase to no Stripe customer link.
  - Browser check confirmed certification returned to `0 of 14 lessons complete`.

## Verification

- API:
  - `npx tsx --test src/routes/certification.test.ts` passed after each certification fix.
  - `npx tsx --test src/routes/boot-camps-auth.test.ts` passed for the mastery resume contract.
  - `npm test` passed: 266 tests, 266 pass.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --check` passed with only LF/CRLF normalization warnings.
  - Live `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
- App:
  - `node --test tests\*.test.ts` passed: 26 tests, 26 pass.
  - `npm run lint` passed after the diagnostic-page cleanup.
  - `npm run build` passed locally and during Vercel production deploy.
  - `git diff --check` passed with only LF/CRLF normalization warnings for audit-note files.
- Browser:
  - Production certification submit, billing portal redirect, boot-camp days 1-5, mastery resume, and mastery completion were exercised in the signed-in in-app browser.
  - Production browser log filter found zero `barmatrix.app` warnings/errors after mastery completion and after QA fixture cleanup.
  - Screenshot saved: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-production-mastery-complete.png`.

## Remaining Risk

- This was a broad audit of the currently targeted public, protected, certification, billing, mobile, drill, and boot-camp flows. It is not proof that every untested edge case in the full system is bug-free.
- The boot-camp completion and anonymous practice checks intentionally wrote QA/audit attempts to production.
- The API repo still has unrelated local admin/complimentary-access work that was intentionally excluded.
- `tasks/lessons.md` is still missing.
- The AM status command still fails because no AM session matches `C:\barmatrix-app`.

# Live Diagnostic Session Audit

## Scope

- Audit the new `/diagnostic/session` production flow that landed after the earlier live audit.
- Verify the entry route, session route, question submit path, results route, browser logs, and live API support.
- Use only local code/runtime and live production evidence; do not expose tokens or QA identity details.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Inspect diagnostic session pages, API client methods, and matching API endpoints.
- [x] Verify live route/API behavior from the signed-in in-app browser.
- [x] If a defect is reproduced, trace root cause before editing and add focused regression coverage where practical.
- [x] Run relevant app/API tests, lint, build, and live browser verification.
- [x] Record evidence and remaining risk.

## Review

- Production `/diagnostic/session` initially failed at the entry CTA with `API 404: "not found"` because the frontend expected placement routes that the API had not registered.
- Added API placement routes for start, question payloads, attempt submit, and results, with fallback behavior for the live DB where `answer_choices.c3_mold_code` is not provisioned.
- Production then started a real session but remained on `Loading placement assessment`; the session page was hydrating 18 individual questions client-side after navigation.
- Fixed the contract so `/api/diagnostic/session/start` returns the exact hydrated 18-question payload it selected, and the frontend caches that payload before navigating.
- Production browser verification completed all 18 placement questions, rendered the C3 starting level results page, and reported zero `barmatrix.app` warning/error console entries.
- Cleanup removed the 18 anonymous audit attempts and the synthetic anonymous placement student for the verified session.

## Verification

- API:
  - `npx tsx --test src/routes/placement-diagnostic.test.ts` passed.
  - `npm test` passed: 271 tests, 271 pass.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --check` passed with only LF/CRLF normalization warnings.
  - Live `POST https://api.barmatrix.app/api/diagnostic/session/start` returned HTTP 200 with 18 question IDs and 18 hydrated questions.
- App:
  - `node --test tests\placement-diagnostic-contract.test.ts` passed.
  - `node --test tests\*.test.ts` passed: 28 tests, 28 pass.
  - `npm run lint` passed.
  - `npm run build` passed locally and during Vercel production deploy.
  - `git diff --check` passed with only LF/CRLF normalization warnings.
- Deployment:
  - API commits `e54f1b2` and `f5fbf11` were pushed; the placement route artifact was copied to Hostinger and the Node app restarted.
  - Frontend commits `b6b4694` and `ad3d10f` were pushed.
  - Vercel production deployment `dpl_2TieeN83t3J36QGHR1Szk3sCxyrp` is `READY` and aliased to `https://barmatrix.app`.
- Browser:
  - In-app browser verified `https://barmatrix.app/diagnostic/session` -> `Start Assessment` -> real `Question 1 of 18`.
  - Submitted all 18 questions through the UI and reached `/diagnostic/session/eabecfeb-146c-4b60-9dc4-4ec37bb7b3a2/results`.
  - Results showed `Placement complete`, `Your C3 Starting Level`, legal/mechanism/calibration score breakdowns, subject breakdown, and next-step CTAs.
  - Screenshot saved: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-production-placement-results.png`.

## Remaining Risk

- This closes the newly found `/diagnostic/session` production regression, but it is not proof that every future edge case in the system is bug-free.
- The verified placement session wrote 18 anonymous audit attempts before cleanup; cleanup reported `attemptsDeleted: 18` and `studentsDeleted: 1`.
- The API repo still has unrelated local admin/complimentary-access work that was intentionally excluded.
- `tasks/lessons.md` is still missing.
- The AM status command still fails because no AM session matches `C:\barmatrix-app`.

# Production Route Matrix Audit

## Scope

- Continue the full live-environment audit by covering lower-traffic public/static routes, subject pages, checkout/referral edges, and dashboard subpages not proven by the last focused pass.
- Run production HTTP smoke checks for public frontend routes and API reads.
- Use the signed-in in-app browser for representative app routes that need session state.
- Fix only reproduced root causes with regression coverage where practical.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm app/API working-tree state and prior audit evidence.
- [x] Build a current route/API matrix from local source.
- [x] Run production HTTP smoke checks for public frontend pages and API endpoints.
- [x] Browser-verify representative signed-in pages and console health.
- [x] Triage/fix any reproduced defects and rerun relevant checks.
- [x] Record evidence and remaining risk.

## Review

- Built the current route inventory from `app/**/page.tsx` and the API route registrations.
- Production HTTP smoke checked 64 public frontend/API routes with zero failures.
- Production auth-boundary smoke checked 22 protected or preview API routes with zero failures after correcting the expected contract for anonymous certification outline preview.
- Broad in-app browser traversal checked 49 production frontend routes with route-specific rendered markers, no framework/error overlays, no stuck loading states, and zero `barmatrix.app` warning/error console entries.
- Deployment-state check confirmed:
  - App local `main` and `origin/main` are `f60972e`.
  - API local `main`, `origin/main`, and Hostinger checkout are `f5fbf11`.
  - Hostinger `dist/index.js` registers placement diagnostic routes and `dist/routes/placement-diagnostic.js` contains hydrated placement start.
  - Vercel alias `https://barmatrix.app` points to production deployment `dpl_2TieeN83t3J36QGHR1Szk3sCxyrp`, status `Ready`.
- No source-code defect was reproduced in this pass.

## Verification

- HTTP smoke: 64/64 public frontend/API checks passed.
- API auth smoke: 22/22 protected or preview checks matched expected 401/403/200 contracts.
- Browser smoke: 49/49 route markers rendered with no app console warnings/errors.
- Follow-up `/dashboard/mastery` check after an 8-second wait rendered the full board, not a stuck loading state.
- C3 deck observation: `GET /api/c3/deck` returned HTTP 200 with an empty `cards` array. Current app code does not consume `listC3Deck`, and the API route intentionally degrades missing C3 storage to an empty deck, so this was recorded as a content/schema gap rather than a live UI defect.

## Remaining Risk

- The production matrix significantly broadens route coverage, but it still does not prove every possible user/data edge case is bug-free.
- The C3 deck public endpoint is healthy but empty; if the deck is meant to be user-facing, it needs content/schema provisioning rather than an app bugfix.
- No source code changed in this pass, so source tests/lint/build were not rerun for this documentation-only update.
- The API repo still has unrelated local admin/complimentary-access work that was intentionally excluded.
- `tasks/lessons.md` is still missing.
- The AM status command still fails because no AM session matches `C:\barmatrix-app`.

# C3 Deck Content Schema Audit

## Scope

- Investigate the live `/api/c3/deck` endpoint returning HTTP 200 with an empty `cards` array.
- Determine from local code/schema/runtime evidence whether the endpoint is an unused placeholder, a missing live table, an empty live table, or a route/query defect.
- Avoid inventing C3 content; if the issue is content provisioning, record it as such unless the repo already contains authoritative card content.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Inspect current app/API working trees and prior audit evidence.
- [x] Inspect local source, route usage, tests, and schema scripts for intended deck behavior.
- [x] Inspect live schema/data counts for C3 tables without exposing secrets.
- [x] Inspect the currently open paid boot-camp mastery page for visible state, browser console errors, and API failures.
- [x] If a defect is confirmed, apply the smallest aligned fix with regression coverage.
- [x] Verify with relevant tests/build/live API checks and document evidence.

## Review

- Local source inspection confirmed `lib/api-client.ts` exposes `listC3Deck()` and `C3DeckResponse`, but no current app route or test consumes `listC3Deck`.
- API source inspection confirmed `/api/c3/deck` and `/api/c3/deck/:id` read `c3_cards`, while `/api/me/c3` reads `c3_molds`/`question_c3_molds`; these routes intentionally degrade missing C3 schema to empty/not-measured states.
- Live `GET https://api.barmatrix.app/api/c3/deck` returned HTTP 200 with `cards=0`.
- Sanitized production DB inspection showed:
  - `c3_cards`, `c3_molds`, and `question_c3_molds` do not exist.
  - `questions` exists with 3684 rows.
  - `answer_choices` exists with 14736 rows.
  - `answer_choices.c3_mold_code` is not provisioned.
- In-app Browser local paid-session check opened `http://localhost:3000/boot-camps/sessions/98f7e066-418f-4646-acb2-653573bf295f/mastery`; it rendered the valid locked state `Mastery check is locked` with no raw API status, loading hang, error boundary, or recent relevant console warnings/errors.
- In-app Browser local C3 mastery check opened `http://localhost:3000/mastery`; it rendered `Not yet measured` with no raw API status, loading hang, error boundary, or recent relevant console warnings/errors.
- No source-code defect was confirmed in this pass. The open C3 issue is live schema/content provisioning for a currently unused public deck endpoint and future C3-tagged mastery measurement.
- Created GitHub issue `auronpep/barmatrix-api#1` to track the C3 deck/mold schema and content provisioning gap.

## Verification

- Live API check: `/api/c3/deck` returned HTTP 200 with an empty `cards` array.
- Live sanitized schema check exited 0 and confirmed the missing optional C3 tables/columns without printing secrets or user data.
- Browser verification confirmed the paid boot-camp mastery and C3 mastery UI surfaces fail soft rather than breaking.
- No implementation code changed, so no regression test was added in this pass.
- App `node --test tests\*.test.ts` passed: 28 tests, 28 pass.
- App `npm run lint` passed.
- App `npm run build` passed.
- API `npm test` passed: 271 tests, 271 pass.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- App/API `git diff --check` passed with only existing LF/CRLF normalization warnings.

## Remaining Risk

- If the public C3 deck or C3-tagged mastery measurement is intended to be user-facing now, production needs authoritative `c3_cards`, `c3_molds`, `question_c3_molds`, and related tagging migrations/content. There is no authoritative card seed in the current source evidence, so inventing content would not be a clean fix.

# Live Operational Integration Audit

## Scope

- Audit live-environment integration surfaces that are not fully proven by normal route smoke.
- Cover Stripe webhook fail-closed behavior, billing/checkout/email configuration presence, Sentry/PostHog wiring, health/deployment parity, and production browser console state on integration-touching pages.
- Avoid printing secret values or triggering paid-provider side effects.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Attempt AM working check-in and record failure if it still cannot find the workspace session.
- [x] Inspect API/app integration source, tests, and deployment env contracts.
- [x] Run safe live HTTP checks for operational endpoints and fail-closed paths.
- [x] Inspect sanitized production env/config presence without exposing values.
- [x] Browser-verify production integration-touching pages for runtime and console health.
- [x] Fix only reproduced code defects with regression coverage.
- [x] Run relevant tests/lint/build, deploy, and record live evidence.

## Review

- Safe live checks confirmed Stripe webhook fail-closed behavior:
  - Missing `stripe-signature` returned HTTP 400.
  - Fake `stripe-signature` returned HTTP 400 signature-verification failure.
- Safe checkout checks confirmed:
  - Invalid checkout payload returned HTTP 400 validation errors without creating a Stripe session.
  - `GET /api/checkout/cs_test_missing/status` returned `{"fulfilled":false}`.
  - Allowed CORS preflight from `https://barmatrix.app` returned HTTP 204 with the expected allow-origin header.
  - Disallowed CORS preflight from `https://evil.example` returned no allow-origin header.
- Production admin route safety:
  - Live `GET /api/admin/grants` returned HTTP 404.
  - Live `POST /api/admin/grant-access` with valid JSON and no secret returned HTTP 404.
  - Local dirty API worktree has an unreleased admin route; its local no-secret check returned HTTP 403.
- Sanitized production API config check showed Stripe, Clerk, email, and allowed-origin config present.
- Found and repaired telemetry gaps:
  - API `BARMATRIX_API_SENTRY_DSN` was absent from Hostinger env; added it from the secure local env and touched the Hostinger restart marker.
  - Vercel production did not have `NEXT_PUBLIC_SENTRY_DSN`; added it from the secure local env.
  - Production frontend had PostHog env names in Vercel, but `window.posthog` was absent on `/checkout`, `/checkout/success`, `/account`, and `/privacy`.
- Root cause for missing PostHog: `instrumentation-client.ts` passed the default `process.env` object into `initializePostHogClient`. The local Next.js docs state browser env values are inlined from direct `process.env.NAME` references and env-object/destructuring patterns do not work reliably.
- Source fix: `instrumentation-client.ts` now passes a small explicit object containing direct `process.env.NEXT_PUBLIC_POSTHOG_*` references into the PostHog initializer.
- Follow-up hardening: `initializePostHogClient` now exposes the SDK on the browser global whenever valid public config exists, even if the SDK was already loaded, while still avoiding duplicate `init` calls.
- Post-deploy browser verification on the signed-in production `/drills` page rendered `DRILL LIBRARY`, observed PostHog config/surveys assets plus `/e/` event requests, and found no current relevant warning/error logs.
- The in-app browser's read-only evaluation context still reported `window.posthog` as absent and did not expose normal DOM mutation methods, so that isolated-world probe is not treated as authoritative for the page's main-world globals.
- Regression coverage:
  - `tests/posthog-client.test.ts` now locks the direct public-env references.
  - `tests/posthog-client.test.ts` now covers already-loaded SDK global exposure.
  - `tests/sentry-wiring.test.ts` was updated to preserve the Sentry/PostHog source contract with the explicit env object.

## Verification

- Red check: `node --test tests\posthog-client.test.ts` failed before the source fix because `instrumentation-client.ts` called `initializePostHogClient(posthog)` with no explicit env object.
- Red check: `node --test tests\posthog-client.test.ts` failed before the global-exposure hardening because an already-loaded SDK was not assigned to `window.posthog`.
- Green focused check: `node --test tests\posthog-client.test.ts` passed: 5 tests, 5 pass.
- App `node --test tests\*.test.ts` passed: 30 tests, 30 pass.
- App `npm run lint` passed.
- App `npm run build` passed.
- Live API `GET https://api.barmatrix.app/health` returned HTTP 200 with `{"ok":true,"db":"up"}` after the Hostinger restart marker was touched.
- Vercel production deployment `dpl_Cw9BNcvBXxHBsM1g5S2jmc2G6cv5` is `Ready` and aliased to `https://barmatrix.app`.
- Deployed bundle probe on `/checkout` found 15 scripts and PostHog chunks containing the global assignment and loaded guard.

## Remaining Risk

- This closes the reproduced live telemetry initialization/configuration gaps, but it does not prove every possible operational edge case is bug-free.
- The in-app browser can observe rendered state and network assets, but its isolated evaluation context cannot directly prove page main-world `window` expandos.

# Knowledge Schema Resilience Audit

## Scope

- Compare current API source behavior against live knowledge/tension/C3 runtime evidence.
- Confirm whether missing optional knowledge storage would break the API or degrade gracefully.
- Fix only verified source defects and avoid inventing content for intentionally empty or unprovisioned optional features.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Inspect current API/app worktree state and isolate unrelated dirty API admin changes.
- [x] Probe live API knowledge, tension, C3, auth-gated C3, and health endpoints.
- [x] Build a source-level regression for optional knowledge schema absence.
- [x] Implement the smallest route-level fallback consistent with existing optional-schema routes.
- [x] Run API tests, typecheck, build, diff hygiene, and refresh live endpoint evidence.

## Review

- Production knowledge search is currently working: `GET /api/knowledge/search?component=trap-taxonomy&q=decoder&limit=5` returned HTTP 200 with a real `KO-SRC-0650-C2C-002` result.
- Production tension catalog is currently working: `GET /api/tensions?limit=1` returned HTTP 200 with official tension entries.
- Production C3 deck remains graceful but empty: `GET /api/c3/deck` returned HTTP 200 with `{"cards":[]}`.
- Production auth gating remains fail-closed: unauthenticated `GET /api/me/c3/next` returned HTTP 401.
- Production API health is up on the correct route: `GET /health` returned HTTP 200 with `{"ok":true,"db":"up"}`.
- Source defect found: `src/routes/knowledge.ts` returned HTTP 500 for missing optional knowledge tables/columns, unlike neighboring optional-schema routes such as C3 and tensions.
- Source fix: missing MySQL table/column signals now return the normal empty knowledge search response shape instead of a generic 500.
- Unrelated local API admin/complimentary-access changes were intentionally left untouched.

## Verification

- Red focused check: `npx tsx --test src\lib\knowledge.test.ts` failed before the helper/fallback existed.
- Green focused check: `npx tsx --test src\lib\knowledge.test.ts` passed: 5 tests, 5 pass.
- API `npm test` passed: 273 tests, 273 pass.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- API `git diff --check` passed with only existing LF/CRLF normalization warnings.
- Refreshed live API checks confirmed knowledge/tensions/health are serving, C3 deck is empty by content/schema state, and unauthenticated C3 coach access returns 401.

## Remaining Risk

- The source hardening is verified and has been carried to Hostinger by the later API deploy. Production currently has the knowledge schema/content, so the live knowledge endpoint was not exhibiting this 500 path before the deploy.
- The broader system is not fully proven bug-free; the next high-value audit area is authenticated paid-user browser coverage across boot-camp progress, prescribed drills, red-zone drills, account/billing, and checkout-return flows.

# API Sentry Runtime Warning Audit

## Scope

- Investigate the fresh production API boot warning: `[Sentry] express is not instrumented`.
- Fix the root cause using installed package/runtime evidence only.
- Prove the fix locally, in tests, and against the Hostinger production runtime.

## Plan

- [x] Inspect production Hostinger logs after the knowledge-route deployment.
- [x] Inspect local `@sentry/node` package docs/source for the expected Express instrumentation path.
- [x] Add regression coverage for the API start command and Sentry initialization options.
- [x] Implement the smallest startup-order fix.
- [x] Run focused/full API checks and local production-start smoke.
- [x] Deploy through Hostinger Git auto-deploy and verify live health/logs.

## Review

- Production log at `2026-06-02T01:30:44Z` and `2026-06-02T01:31:19Z` showed `[Sentry] express is not instrumented`.
- Local installed Sentry README says ESM apps should initialize Sentry through a `--import` file before application modules load.
- Local installed Sentry source showed `setupExpressErrorHandler()` calls `ensureIsWrapped(app.use, "express")`.
- Root cause: the API initialized Sentry inside `src/index.ts` after importing Express. A generic `@sentry/node/preload` was not enough because `tracesSampleRate: 0` meant the default Express tracing integration was not installed.
- Source fix:
  - Added `src/sentry-init.ts`, preloaded by the production start command before `dist/index.js`.
  - `initSentry()` now explicitly installs `Sentry.expressIntegration()` while keeping `tracesSampleRate: 0` and `sendDefaultPii: false`.
  - `src/index.ts` now installs the Express error handler only when the SDK was already initialized by the preload entry.
- Hostinger advanced to API commit `d9f5892`; `package.json` start command is `node --import ./dist/sentry-init.js dist/index.js`.

## Verification

- Focused Sentry test passed: `npx tsx --test src\sentry.test.ts` reported 6 tests, 6 pass.
- API `npm test` passed: 275 tests, 275 pass.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- Local production-start smoke ran `node --import ./dist/sentry-init.js dist/index.js` on port `18081`; `/health` returned HTTP 200 and captured logs had `has_sentry_warning=false`.
- Production Hostinger log after deploy showed only `barmatrix-api listening on :3000 (production) — 4 allowed origins`; no fresh Sentry Express warning was present.
- Production `GET https://api.barmatrix.app/health` returned HTTP 200 with `{"ok":true,"db":"up"}`.
- Post-deploy live API smoke confirmed:
  - knowledge search returned HTTP 200 with `KO-SRC-0650-C2C-002`.
  - tensions returned HTTP 200 with official entries.
  - C3 deck returned HTTP 200 with `{"cards":[]}`.
  - unauthenticated C3 coach returned HTTP 401.
- In-app browser production `/drills` remained healthy and rendered `DRILL LIBRARY` with no relevant console/network error logs. Address-bar navigation through this browser wrapper did not work in this pass, so `/mastery` and boot-camp mastery were not reverified through the browser after the API-only Sentry change.

## Remaining Risk

- The API Sentry runtime warning is fixed and deployed, but this does not make the entire system fully tested.
- Remaining high-value audit coverage is authenticated paid-user browser flows beyond `/drills`: boot-camp day progression, mastery start/submit, prescribed drills, red-zone detail/drill launch, account/billing portal, and checkout-return handling.

# Authenticated Paid Browser Flow Audit

## Scope

- Use the existing paid-subscriber browser session to test production study workflows beyond the already verified `/drills` landing state.
- Cover paid-user route access, dashboard/account state, drill launch and answer flow, red-zone surfaces, boot-camp progress/mastery surfaces, C3 mastery, and checkout-return/account billing behavior where safe.
- Prefer non-destructive or low-impact interactions first; when a flow mutates progress, capture the exact session/page state and verify the UI/API result.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm app/API worktree state and isolate unrelated API admin changes.
- [x] Map app routes and API calls for paid study surfaces from local source.
- [x] Connect to the in-app browser and verify navigation capabilities with the current paid session.
- [x] Browser-test production paid dashboard, account, mastery, boot-camp, drills, and red-zone flows.
- [x] Inspect production API/app logs for any browser-visible errors or warnings.
- [x] If defects are reproduced, trace source, add/update regression coverage, fix, and deploy.
- [x] Run relevant app/API tests/lint/build and update evidence.

## Review

- Paid production route smoke rendered stable states for `/dashboard`, `/account`, `/red-zones`, `/mastery`, `/boot-camps`, `/foundations`, `/certification`, and `/coach` with no relevant browser logs or raw API-status copy.
- Stale production URLs for the old localhost boot-camp session `98f7e066-418f-4646-acb2-653573bf295f` returned the expected unavailable/404 state. Fresh production-created sessions were verified instead.
- Review drill flow passed end to end: `/drills` launched a review drill, an Evidence question was answered, and the UI rendered `DRILL MASTERED 1 / 1 correct`.
- Boot-camp flow passed end to end for fresh production data: Evidence camp detail/session rendered; Civil Procedure camp created session `775888a9-63ff-4802-ae8f-ed238d88f142`; Day 1 answered 12/12; finish screen awarded `+170 XP`; session hub persisted `1 OF 5 DAYS COMPLETE` and unlocked Day 2.
- Production API logs exposed a real background defect after paid attempts: `[c3-srs] background update failed: Unknown column 'c3_mold_code' in 'SELECT'`.
- Root cause: the foreground attempt path tolerated an unprovisioned optional `answer_choices.c3_mold_code` column, but the correct-answer C3 SRS background lookup still queried that column directly.
- API fix in `C:\barmatrix-api`: commit `32bb419` adds `listQuestionC3MoldCodesForAttempt()`, returns an empty mold list when the optional column is absent, and routes the background SRS update through that helper.
- Deployed to Hostinger: remote `HEAD` is `32bb419`, `dist/routes/attempts.js` rebuilt, restart marker updated at `2026-06-02 02:00:25` UTC, and live health returned HTTP 200.
- Post-deploy browser verification submitted Civil Procedure Day 2 Question 1 with answer `D`; UI rendered `CORRECT`, and fresh Hostinger log tails showed only normal listener lines with no new `[c3-srs]` errors.

## Verification

- Red/green API regression:
  - `npx tsx --test src\routes\attempts.test.ts` failed before implementation because `listQuestionC3MoldCodesForAttempt` did not exist.
  - `npx tsx --test src\routes\attempts.test.ts` passed after implementation.
- API full checks passed:
  - `npm test`: 276 tests passed.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --check` passed with only existing LF/CRLF normalization warnings.
- Live checks passed:
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - `GET https://barmatrix.app/drills` returned HTTP 200.
  - In-app browser paid-flow checks covered dashboard/account/red-zones/mastery/foundations/certification/coach, review drill completion, boot-camp creation, 12-question Day 1 completion, session-hub persistence, and a post-deploy correct answer submission.

## Remaining Risk

- This audit significantly expands paid-user production coverage, but it still cannot prove every possible user/data edge case is bug-free.
- App source code did not change in this pass; app checks are limited to browser/HTTP verification and documentation diff hygiene.
- Boot-camp mastery start/submit, billing portal handoff, and checkout-return mutation flows remain good follow-up candidates if the goal is exhaustive transaction-level coverage.
- The API repo still has unrelated local admin/complimentary-access changes that were intentionally not staged or deployed.
- `tasks/lessons.md` is still missing.
- The AM status helper still cannot find a session for `C:\barmatrix-app`.

# Live Paid Integration Edge Audit

## Scope

- Continue from the paid-subscriber production audit by targeting remaining high-value live edges.
- Cover safe billing/account portal behavior, checkout-return status pages, boot-camp mastery readiness or submit flow when available, and production logs after those actions.
- Avoid paid-provider mutations unless the UI flow itself requires a safe session creation, and do not expose secrets.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm app/API worktree state and isolate unrelated API admin changes.
- [x] Inspect billing, checkout-return, and boot-camp mastery source contracts.
- [x] Connect to the in-app browser with the current paid production session.
- [x] Browser-test account/billing, checkout-return, and boot-camp mastery surfaces.
- [x] Inspect production API/runtime logs after the browser actions.
- [x] If defects are reproduced, trace source, add/update regression coverage, fix, deploy, and reverify.
- [x] Run relevant checks and update evidence.

## Review

- Production `/account?checkout_session_id=cs_test_missing_live_audit` rendered the active paid account state but did not surface checkout recovery.
- Live same-origin frontend probe confirmed `https://barmatrix.app/api/checkout/cs_test_missing_live_audit/status` returns a Next.js 404 page.
- Live backend probe confirmed `https://api.barmatrix.app/api/checkout/cs_test_missing_live_audit/status` returns HTTP 200 with `{"fulfilled":false}`.
- Root cause: `app/account/enrollment-recovery.tsx` bypassed the shared API client and called relative `/api/checkout/...` endpoints, so production hit the Vercel frontend origin instead of the Hostinger API origin.
- Source fix: checkout status/recovery helpers now live in `lib/api-client.ts`, and the account recovery panel uses those helpers.
- Follow-up browser verification exposed misleading recovery copy for arbitrary unfulfilled checkout IDs; the panel now says `Checkout recovery` / `Activation check available` and no longer claims the checkout session is confirmed.
- Billing portal handoff on the active paid account returned the handled state `No local purchase with a billing customer was found for this account.` Production API logs had no crash output and `stderr.log` remained empty.
- Sanitized production data check showed 6 active non-refunded purchases, with 5 missing `stripe_customer_id` and 1 containing `stripe_customer_id`; tracked as `auronpep/barmatrix-api#2`.

## Verification

- Red check: `node --test tests\api-client-billing-portal.test.ts` failed before implementation because checkout recovery helpers were missing and the account component still used same-origin fetches.
- Green focused check: `node --test tests\api-client-billing-portal.test.ts` passed after implementation.
- App `node --test tests\*.test.ts` passed: 33 tests, 33 pass.
- App `npm run lint` passed.
- App `npm run build` passed.
- App `git diff --check` passed with only existing LF/CRLF normalization warnings.
- Red/green copy regression was added after the deployed behavior surfaced the misleading recovery copy; final focused check passed with 5 tests.
- Final app checks after the copy change passed:
  - `node --test tests\*.test.ts`: 34 tests, 34 pass.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` passed with only existing LF/CRLF normalization warnings.
- Vercel production deployment `dpl_8TpBf2t7BFSFPLCyRpphwP8PKufN` is `READY`, aliased to `https://barmatrix.app`, and reports Git SHA `f8751f97fc21bd3cdc3ee5ebb90f7332f1c70d90`.
- In-app Browser verified `https://barmatrix.app/account?checkout_session_id=cs_test_missing_live_audit_final_*` renders the recovery panel with corrected copy, no old misleading copy, no raw API error text, and no recent browser logs.
- Production API `GET https://api.barmatrix.app/health` returned HTTP 200 with `{"ok":true,"db":"up"}`.
- Hostinger API log tail after checkout recovery and billing actions showed only normal listener lines; `stderr.log` was empty.

## Remaining Risk

- Checkout-return recovery is fixed and verified on the live site.
- Billing portal handoff is not fully green for this paid account because production purchase records largely lack `stripe_customer_id`; this is now tracked in `auronpep/barmatrix-api#2` for data/backfill or UI/API classification follow-up.
- The broader system still cannot be called exhaustively bug-free; the next audit section remains the logged-in Red Zones path sweep.

# Red Zones Logged-In Path Audit

## Scope

- Use the current logged-in BarMatrix program state to audit `/red-zones` and every user-facing path reachable from the Red Zones area.
- Verify each path renders meaningful content, does not show raw API errors or blank/loading-only states, and that primary controls navigate or mutate as intended.
- Fix only reproduced root causes with focused regression coverage where practical.

## Plan

- [x] Map Red Zones routes, links, API calls, and existing tests.
- [x] Run logged-in browser verification across every Red Zones path and capture UI/console/API evidence.
- [x] Trace any reproduced defect to the owning source and compare against similar working flows.
- [x] Add failing focused regression tests or repro checks before implementation where practical.
- [x] Implement scoped fixes and re-run focused plus full relevant checks.
- [x] Record review notes, verification commands, browser evidence, and remaining risk.

## Review

- Paid production `/red-zones` rendered the signed-in library with 51 unique detail links, metrics, no raw API text, no loading stall, and no browser warning/error logs.
- Reproduced a real bug before the fix: encoded detail paths such as `/red-zones/subject/Civil%20Procedure`, `/red-zones/subtopic/II.A%20%2F%20II.C.1`, and `/red-zones/tension_point/Fact%20of%20consequence%20%2B%20weak%20proof%2Falternative%20cause` rendered no zone status and `Questions in this zone · 0` even though the index advertised real question counts.
- Root cause: `app/red-zones/[dimension]/[tag]/page.tsx` sent the URL-encoded route params directly to `api.getMyRedZoneDetail()`, so API lookups used values like `Civil%20Procedure` and `II.A%20%2F%20II.C.1` instead of the stored tag values.
- Source fix: decode dynamic route params once in the detail route before building the route key and API request, and render the normalized tag without double-decoding.
- Deployed frontend production deployment `dpl_3MmSey3qXQPT1tTNDupKpQiHvLJk`; Vercel reports `Ready` and aliases `https://barmatrix.app` plus `https://www.barmatrix.app`.

## Verification

- Red check: `node --test tests\red-zone-detail-params.test.ts` failed before implementation because the detail route did not decode params and double-decoded the heading.
- Green checks:
  - `node --test tests\red-zone-detail-params.test.ts` passed: 2 tests.
  - `node --test tests\*.test.ts` passed: 36 tests, 36 pass.
  - `npm run lint` passed.
  - `npm run build` passed locally and during Vercel production deploy.
  - `git diff --check` passed with only the existing LF/CRLF normalization warning.
- Production in-app Browser sweep:
  - `/red-zones` rendered 51 unique detail links and no relevant console logs.
  - All 51 `/red-zones/{dimension}/{tag}` detail paths loaded without signed-out states, loading stalls, raw API text, or framework overlays.
  - Every detail page's `Questions in this zone` count matched the count advertised on the index.
  - Unique repair-drill targets `/drills/civil-procedure`, `/drills/contracts`, `/drills/evidence`, and `/drills/real-property` all rendered valid drill pages without raw API text or console warnings/errors.
  - Detail-page `Red Zone Library` and `Back to dashboard` controls navigated to the expected pages.
- Production API health returned `{"ok":true,"db":"up"}`; Hostinger API `console.log` tail showed only normal listener lines and `stderr.log` was empty.

## Remaining Risk

- The logged-in Red Zones area and all current reachable Red Zones detail/repair-drill paths are verified green for the current paid QA account.
- Future `user_red_zones.dimension` values outside the API whitelist (`subject`, `subtopic`, `tension_point`) could still produce invalid detail routes if such data is introduced.
- Detail-route stale-auth handling still formats generic API statuses for non-logged-in/stale-session cases; this was not reproduced in the logged-in path sweep.
- AM status check-in still failed because no AM session matched `C:\barmatrix-app`.

# Billing Portal Missing Customer Audit

## Scope

- Continue the live audit outside Red Zones.
- Investigate the production account billing portal failure where an active paid account sees `No local purchase with a billing customer was found for this account.`
- Preserve unrelated API admin/complimentary-access work already present in `C:\barmatrix-api`.

## Plan

- [x] Skip Red Zones paths and leave existing Red Zones worktree changes untouched.
- [x] Reproduce the billing portal failure in the paid production browser session.
- [x] Inspect sanitized production purchase state and API log health.
- [x] Add a focused failing regression for owned active purchases missing `stripe_customer_id`.
- [x] Implement the smallest backend repair path that still proves local purchase ownership before touching Stripe.
- [x] Harden historical Stripe checkout-session 404s so they remain a handled missing-customer state.
- [x] Run focused and non-Red-Zone API checks.
- [x] Deploy API source changes and browser-verify the live account behavior/log health.

## Review

- Billing portal recovery now looks up the latest active owned purchase even when `stripe_customer_id` is blank, then recovers the customer from the stored checkout session only after local purchase ownership is proven.
- Synthetic/manual access is intentionally not recovered: `comp_` checkout-session IDs and blank sessions return the existing missing-customer state instead of touching Stripe.
- Production had one active missing-customer `cs_` checkout session; Stripe returned `resource_missing` 404 for that historical session, so the helper now treats that narrow case as unrecoverable instead of bubbling a server error.
- API commits pushed to `auronpep/barmatrix-api`: `bed8c99 Repair billing portal customer recovery` and `b8ba193 Handle unrecoverable billing checkout sessions`.
- Hostinger GitHub fetch was unavailable from the remote checkout, so the pushed source files were copied directly, built on Hostinger through `node node_modules/typescript/bin/tsc -p tsconfig.json`, and the restart marker was touched.
- Browser verification on the current paid account still does not redirect to Stripe; it remains on `/account` with `No local purchase with a billing customer was found for this account.` This is a verified data/classification limitation for that account, not a crash.
- GitHub issue `auronpep/barmatrix-api#2` remains open and was updated with the production evidence.

## Verification

- Red focused check: `npx tsx --test src\billing-portal.test.ts` fails because `resolveOwnedBillingPortalCustomer()` returns `missing_customer` for an active owned purchase with a checkout session but no stored Stripe customer.
- Red focused check: `npx tsx --test src\billing-portal-recovery.test.ts` fails before the 404 hardening because a Stripe `resource_missing` checkout-session lookup bubbles out of recovery.
- Green focused check: `npx tsx --test src\billing-portal.test.ts src\billing-portal-recovery.test.ts` passed: 9 tests.
- Green non-Red-Zone API check: `npx tsx --test <all src/**/*.test.ts excluding red-zones>` passed: 262 tests.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- API `git diff --check` passed with only LF/CRLF normalization warnings.
- Live `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}` after deploy.
- In-app Browser `/account` click after deploy showed the handled missing-customer copy, no raw API status text, no browser warning/error logs, and Hostinger `stderr.log` was empty.
- Full API `npm test` was not used as the acceptance check because the user asked this session to skip Red Zones and the Red Zone integration suite is failing setup on the remote DB user.

## Remaining Risk

- The deployed code repairs the recoverable missing-customer path, but the current browser account still has no recoverable Stripe billing customer.
- Sanitized production state after the recovery attempt: 6 active non-refunded purchases, 1 with a Stripe customer, 5 missing; the only missing `cs_` session returns Stripe 404, and the rest are synthetic `comp_` or blank-session records.
- Follow-up is data/backfill/manual-access classification or account-page copy/visibility for non-Stripe active access.

# Billing Portal Non-Stripe Access UX Audit

## Scope

- Continue outside Red Zones.
- Tighten account billing UX for active paid/manual/complimentary access that cannot open a Stripe billing portal.
- Preserve the API contract: `POST /api/billing/create-portal-session` may return `404` when the customer or checkout session cannot be matched to a BarMatrix enrollment.

## Plan

- [x] Re-read project instructions and confirm `tasks/lessons.md` status.
- [x] Read relevant local Next.js client-component/mutation docs before app code changes.
- [x] Inspect the billing API contract, app button copy, and current live account behavior.
- [x] Add a failing regression that rejects the misleading "No local purchase" billing copy.
- [x] Apply the smallest account-copy change for non-Stripe/manual access.
- [x] Run focused app checks, lint/build, and push the source change.
- [x] Track the production deployment blocker.
- [x] Re-run live browser verification after production deploy advances past `42fc533`.
- [x] Record final evidence and remaining risk.

## Review

- Root cause: the app mapped every billing-portal `404` to "No local purchase with a billing customer...", but the live account evidence proves an active account can have local access and still lack a Stripe billing portal because its access is manual/complimentary or its historical checkout session is unrecoverable.
- Source fix: `app/account/billing-portal-button.tsx` now gives distinct `404` copy for checkout-session-specific failures versus active-access/no-portal failures.
- Pushed app commit `a735241 Clarify unavailable billing portal copy`.
- Production initially had not advanced to this commit. Vercel still pointed at `42fc533`, GitHub had no deployment/check run for `a735241`, and the CLI had no saved credentials for this Windows user.
- The Vercel CLI device login completed during the current audit, so a clean local clone checked out at `a735241` was used for deployment. This avoided the dirty main worktree and skipped unrelated Red Zone files.
- `vercel build --prod` in the clean clone failed in the local prebuilt packaging path with `Unable to find lambda for route: /dashboard/final-sprint`, even though `npm run build` passed. Standard `vercel deploy --prod --yes` from the same clean clone succeeded.
- Production deployment `dpl_Hq38gL8dhHgJNukcW24Pkwt63act` is `READY`, aliased to `https://barmatrix.app`, and reports Git SHA `a7352418dca0f9712c6ef79ed8d975ba95c778e9`.
- The deployment drift issue remains tracked as `auronpep/barmatrix-app#3` for automatic Git/CI deploy wiring, because the successful deploy was manual CLI source `cli`, not a GitHub push-triggered deployment.

## Verification

- Red check: `node --test tests\api-client-billing-portal.test.ts` failed before the copy change because the button still contained `No local purchase with a billing customer`.
- Green focused check: `node --test tests\api-client-billing-portal.test.ts` passed: 6 tests.
- App `node --test tests\*.test.ts` passed: 37 tests.
- App `npm run lint` passed.
- App `npm run build` passed with Next.js 16.2.6.
- App `git diff --check` passed with only LF/CRLF normalization warnings.
- Clean-clone checks before deploy:
  - `npm ci` succeeded.
  - `node --test tests\api-client-billing-portal.test.ts` passed: 6 tests.
  - `node --test tests\*.test.ts` passed: 35 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` passed.
- Live browser verification after deploy:
  - Before deploy, clicking `Update Payment Method` still showed `No local purchase with a billing customer was found for this account.`
  - After deploy, clicking the same button showed `This account has active access, but no Stripe billing portal is available for this enrollment...`
  - The old copy was absent, no raw API status text appeared, and browser warning/error logs were empty.
- Post-deploy checks:
  - Vercel project latest deployment is `dpl_Hq38gL8dhHgJNukcW24Pkwt63act`.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Vercel error log query for the new deployment returned no error rows.
  - Hostinger API `stderr.log` was empty.

## Remaining Risk

- The account-copy issue is now live-verified for the current paid account.
- Automatic Vercel deploy wiring is still not proven: the repo still has no enabled GitHub Actions workflow, no repo secrets, and no GitHub webhooks. Future pushes may still need manual CLI deploy until `auronpep/barmatrix-app#3` is resolved.

# Non-Red-Zone C3 Deck Audit

## Scope

- Continue the live audit outside Red Zones while another session owns Red Zone review/debugging.
- Investigate why the live C3 deck endpoint returns an empty deck and determine whether the root cause is source code, schema provisioning, or missing authoritative content.
- Do not invent C3 card/mold content; only apply a fix if local project/runtime evidence identifies a clean source-level or provisioning root cause.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm the app worktree contains unrelated Red Zone changes and leave them untouched.
- [x] Reproduce the live C3 deck behavior through API/browser-accessible evidence.
- [x] Search local app/API source, migrations, tests, and docs for C3 schema and authoritative deck/mold content.
- [x] Inspect sanitized live schema/counts for C3 tables and optional mold columns.
- [x] Classify the root cause and add a focused regression/provisioning check if practical.
- [x] Apply the smallest safe fix only if authoritative schema/content exists locally.
- [x] Run relevant non-Red-Zone checks and browser/API verification.
- [x] Record findings, remaining blockers, and any GitHub follow-up.

## Review

- Skipped Red Zones per the user's instruction; existing Red Zone worktree changes were not touched.
- Reproduced the live C3 deck issue: `GET https://api.barmatrix.app/api/c3/deck` returned HTTP 200 with `cards: []`.
- Production schema probe before the fix showed no `c3_cards`, `c3_molds`, `c3_tension_points`, `c3_splits`, `c3_annotations`, or `student_c3_srs` tables, and no `answer_choices.c3_*` columns.
- Local authoritative assets exist outside the app/API repos under `C:\BMO\BARMATRIX\engineering`: `SCHEMA_C3_MYSQL.sql`, `SEED_C3_DECK_MYSQL.sql`, and `SEED_C3_REFERENCE_MYSQL.sql`.
- Applied only those existing idempotent SQL assets to the live Hostinger DB. No source route changes were needed.
- Post-provision live state: `c3_cards=135`, `c3_molds=13`, `c3_tension_points=28`, `c3_splits=14`, `c3_annotations=0`, `student_c3_srs=0`, and `answer_choices` now has `c3_architecture`, `c3_filter_broken`, and `c3_mold_code`.
- The C3 deck API now returns 135 cards; `GET /api/c3/deck/PHIL-01` returns the expected philosophy card.
- Paid browser verification confirmed `/mastery` renders a clean not-yet-measured state and `/coach` Start coaching renders `Not measurable yet`, both with no raw API status text or browser warning/error logs.

## Verification

- Live API:
  - `GET https://api.barmatrix.app/api/c3/deck` returned 135 cards.
  - `GET https://api.barmatrix.app/api/c3/deck/PHIL-01` returned `The One Idea`.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty after the provisioning and verification checks.
- API automated checks in `C:\barmatrix-api-billing-work`:
  - `npx tsx --test src\routes\c3.test.ts src\routes\c3-coach.test.ts src\lib\c3-queries.test.ts src\lib\c3-bandit.test.ts src\lib\c3-scoring.test.ts src\lib\c3-srs.test.ts` passed: 28 tests.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --check` passed.
- GitHub follow-up:
  - Closed `auronpep/barmatrix-api#1` after live deck provisioning was verified.
  - Created `auronpep/barmatrix-api#3` for C3 annotations and answer-choice mold-tag backfill.

## Remaining Risk

- The public C3 deck/reference layer is now provisioned and live-verified.
- C3 mastery remains `not_yet_measured` for the current paid account because live `c3_annotations` has zero rows and no answer choices are tagged with mold codes yet. That content-tagging/backfill follow-up is tracked as `auronpep/barmatrix-api#3`.
- The existing production deployment drift issue for the app billing-copy commit remains open and unchanged.

# Vercel Automatic Deploy Wiring Audit

## Scope

- Continue outside Red Zones.
- Resolve the app production deployment drift follow-up by adding a verified automatic GitHub-to-Vercel deployment path for `main`.
- Do not include unrelated dirty Red Zone work in the deployment commit.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm current dirty worktree and skip Red Zone files.
- [x] Verify GitHub/Vercel wiring state: repo secrets, workflows, webhooks, project metadata, latest deployments.
- [x] Validate available Vercel credentials without printing token values.
- [x] Add the smallest enabled GitHub Actions workflow for production deploys.
- [x] Verify the committed tree in a clean clone before push.
- [x] Push to `main` and wait for the push-triggered workflow.
- [x] Verify Vercel production deployment, API health, and paid browser account behavior.
- [x] Update GitHub tracking.

## Review

- GitHub initially had no Actions secrets, no enabled workflows, and no repo webhooks.
- Vercel project metadata showed the billing-copy production deploy was manual `cli` source, not a GitHub-triggered deployment.
- Vercel rejected minting a new token from the locally saved CLI credential (`Only user authentication tokens can be used to create new tokens.`).
- Existing `VERCEL_TOKEN` in `C:\Users\wks2391\.env` validated with `vercel whoami` and `vercel project inspect` without printing the token.
- Added GitHub Actions secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.
- Added `.github/workflows/deploy-vercel.yml` and pushed commit `aa75e22 Add Vercel production deploy workflow`.
- The workflow uses the standard remote Vercel deploy path, not prebuilt deploy, because local `vercel build --prod` previously failed in prebuilt packaging while standard `vercel deploy --prod --yes` worked.
- Dirty Red Zone work and Red Zone test files were left unstaged and were not included in the deploy commit.

## Verification

- Clean clone at committed tree `aa75e22` passed:
  - `npm ci`
  - `node --test tests/*.test.ts`: 35 tests passed
  - `npm run lint`
  - `npm run build`
  - `git diff --check`
  - `npx --yes vercel@54.6.1 pull --yes --environment=production --token "$VERCEL_TOKEN"`
- Push-triggered GitHub Actions workflow succeeded:
  - Run: `https://github.com/auronpep/barmatrix-app/actions/runs/26797511802`
  - Commit: `aa75e2206597d82b7f1d4ee176ab727b2406f51a`
  - Job: `deploy`, conclusion `success`
- Vercel production deployment:
  - Deployment: `dpl_Ffa8JkUxwHos9t9rx59ixwCxpCfC`
  - URL: `https://barmatrix-r3fsaq677-sunnylee.vercel.app`
  - Aliases: `https://barmatrix.app`, `https://www.barmatrix.app`
  - Git metadata: SHA `aa75e2206597d82b7f1d4ee176ab727b2406f51a`, repo `auronpep/barmatrix-app`, ref `main`
  - `vercel logs ... --level error` returned no error rows
- Live API `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
- In-app Browser verification on `https://barmatrix.app/account?deploy_auto_verify=1780373040`:
  - Account page rendered active paid state and `Update Payment Method`.
  - Clicking `Update Payment Method` rendered the new active-access/no-Stripe-portal copy.
  - Old `No local purchase with a billing customer...` copy was absent.
  - No raw API status text appeared and browser warning/error logs were empty.
  - Screenshot saved: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-auto-deploy-account-billing.png`.

## Remaining Risk

- The automatic app production deploy path is verified for pushes to `main`.
- The workflow uses CLI remote deployment, so Vercel deployment `source` still reports `cli`; the GitHub Actions check and deployment metadata prove it was push-triggered.
- The known local prebuilt packaging issue (`Unable to find lambda for route: /dashboard/final-sprint`) remains, but this workflow intentionally avoids the prebuilt path.

# Non-Red-Zone C3 Tagging Backfill Audit

## Scope

- Continue outside Red Zones.
- Investigate `auronpep/barmatrix-api#3`: production C3 deck/reference data exists, but C3 mastery and coach remain unmeasured because live question/choice tagging is empty.
- Do not invent C3 annotations or per-answer mold tags; only apply a data/source fix if local authoritative content exists.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone files remain separate and skip them.
- [x] Reproduce current live C3 measurement state through production API/DB/browser evidence.
- [x] Search local engineering assets, seed files, API source, and app source for authoritative C3 annotation or mold-tag backfill content.
- [x] Run the C3 QA-gate-equivalent aggregate checks against production from the Hostinger app context.
- [x] Browser-verify paid `/mastery` and `/coach` current behavior.
- [x] Classify whether a safe fix exists in local evidence.
- [x] Update audit notes and GitHub issue tracking.

## Review

- Production C3 reference/deck provisioning is still present: `GET https://api.barmatrix.app/api/c3/deck` returns 135 cards, and `GET /api/c3/deck/PHIL-01` returns a card.
- Production DB aggregate counts from the Hostinger app context:
  - `c3_cards=135`
  - `c3_molds=13`
  - `c3_annotations=0`
  - `answer_choices.c3_mold_code` populated rows: `0`
  - `answer_choices.c3_architecture` populated rows: `0`
  - `answer_choices.c3_filter_broken` populated rows: `0`
  - `student_c3_srs=0`
  - orphan mold tags: `0`
  - QA half-truth/wrong-element subject frequency rows: `[]`
  - active questions: 3,466 total across Civil Procedure, Constitutional Law, Contracts, Criminal Law, Criminal Procedure, Evidence, Real Property, and Torts.
- Local authoritative assets under `C:\BMO\BARMATRIX\engineering` include schema/reference/deck/QA-gate files, but no file containing `INSERT INTO c3_annotations`, `c3_mold_code` updates, `deciding_phase` content, or validated annotation rows.
- The subject bank JSONL samples contain normal question, diagnostic, tension, and forensics fields, but no C3 annotation/mold-tag keys.
- `SEED_CRIMINAL_REBALANCE_PROD_UPDATE.sql` updates answer correctness only; it is not a C3 tag backfill.
- API source behavior is consistent with the content gap: C3 mastery queries count only `c3_annotations` rows with `PASS`/`FORK_OR_SPLIT` and choices carrying `c3_mold_code`; coach candidates also require tagged choices.
- No source-code root cause or safe local data fix was found. The blocker is missing authored/validated C3 tagging content.

## Verification

- Live API:
  - `GET https://api.barmatrix.app/api/c3/deck` returned 135 cards.
  - `GET https://api.barmatrix.app/api/c3/deck/PHIL-01` returned `PHIL-01`.
- Hostinger production aggregate query exited successfully and printed only sanitized counts.
- In-app Browser paid `/mastery` verification:
  - Rendered `Measured on 0 of your 99 attempts (0% C3-tagged).`
  - Rendered `Not yet measured`.
  - No raw API status text and browser warning/error logs were empty.
- In-app Browser paid `/coach` verification:
  - Page rendered a single `Start coaching` control.
  - DOM click rendered `Not measurable yet` with Method/diagnostic next steps.
  - No raw API status text and browser warning/error logs were empty.
- Local asset search found no authoritative C3 annotation or mold-tag backfill file beyond `SCHEMA_C3_MYSQL.sql`, `SEED_C3_DECK_MYSQL.sql`, `SEED_C3_REFERENCE_MYSQL.sql`, and `C3_QA_GATE.sql`.

## Remaining Risk

- `auronpep/barmatrix-api#3` remains open because the acceptance criteria require authored C3 annotations and mold tags that are not present in local project evidence.
- Paid C3 Mastery and Coach fail soft, but they cannot produce measured C3 skill coverage or coached C3 items until validated tagging content exists.
- A separate accessibility cleanup candidate was observed: `/coach` currently has two `<main>` regions with duplicate text in the DOM. It did not cause a visible product failure in this pass.

# Coach Main Landmark Fix

## Scope

- Fix the concrete non-Red-Zone accessibility/DOM defect found during the C3 browser audit: `/coach` rendered duplicate `<main>` landmarks because the root layout already wraps pages in `<main>` and `app/coach/page.tsx` rendered another one.
- Keep the C3 fail-soft behavior unchanged.

## Plan

- [x] Read local Next.js layout/page docs before app code changes.
- [x] Reproduce duplicate main landmarks in the paid production browser session.
- [x] Trace the owning files and root cause.
- [x] Add a focused failing regression test.
- [x] Apply the smallest markup fix.
- [x] Run focused and broader tracked app checks.
- [x] Push and verify the automatic production deployment.
- [x] Browser-verify live `/coach` after deployment.

## Review

- Root cause: `app/layout.tsx` wraps all routes in `<main>{children}</main>`, while `app/coach/page.tsx` returned its own `<main className="mx-auto max-w-3xl px-4 py-8">`.
- Source fix: changed the coach page wrapper to `<section aria-labelledby="coach-title">` and added `id="coach-title"` to the `h1`.
- Added `tests/coach-main-landmark.test.ts` to lock that the root layout owns the main landmark and the coach page does not nest a second one.
- Pushed app commit `4bf93c1 Fix coach main landmark nesting`.
- The existing GitHub Actions/Vercel workflow deployed the commit successfully.

## Verification

- Red check before implementation: `node --test tests\coach-main-landmark.test.ts` failed because `app/coach/page.tsx` contained `<main>`.
- Green checks:
  - `node --test tests\coach-main-landmark.test.ts` passed.
  - Tracked app tests plus the new test passed: 36 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check -- app/coach/page.tsx tests/coach-main-landmark.test.ts` passed with only the usual LF/CRLF warning.
- Deployment:
  - GitHub Actions run `https://github.com/auronpep/barmatrix-app/actions/runs/26798142796` succeeded for commit `4bf93c1cda658e164bf6a877c72b28be4d356540`.
  - Vercel production deployment `dpl_4C3YAmLDv9dkQTNyCB1ncRkemRzP` is `READY`, aliased to `https://barmatrix.app`, and reports Git SHA `4bf93c1cda658e164bf6a877c72b28be4d356540`.
  - Vercel error-log query for the deployment returned no error rows.
  - Live API health returned `{"ok":true,"db":"up"}`.
- In-app Browser live verification:
  - `https://barmatrix.app/coach?main_landmark_verify=1780374200` rendered exactly one `<main>` region.
  - The route still rendered `The C3 Coach` and `Start coaching`.
  - Clicking `Start coaching` rendered the expected `Not measurable yet` fail-soft state.
  - No raw API status text appeared and browser warning/error logs were empty.

## Remaining Risk

- Coach landmark nesting is fixed and live-verified.
- C3 Coach remains not measurable because the live C3 annotation/tagging content is absent; that is tracked separately in `auronpep/barmatrix-api#3`.

# Account Billing Capability Pre-Click Audit

## Scope

- Continue outside Red Zones; another session owns Red Zone review/debugging.
- Fix the live account billing UX gap where active non-Stripe/manual access still sees a normal `Update Payment Method` CTA before the app knows a Stripe billing portal is available.
- Use the clean API worktree at `C:\barmatrix-api-billing-work` for backend changes; leave dirty Red Zone app files and dirty `C:\barmatrix-api` files untouched.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` is absent.
- [x] Reproduce current paid account behavior in the in-app browser.
- [x] Inspect sanitized production purchase categories without printing IDs, emails, tokens, or customer IDs.
- [x] Trace account UI, dashboard data, and billing portal ownership code.
- [x] Add failing API/app regression tests for pre-click billing capability classification.
- [x] Expose a small dashboard billing capability field from the API.
- [x] Use that field in the account billing UI to avoid showing a payment-method CTA for active access without a Stripe portal.
- [x] Run focused tests, full relevant checks, lint/build, and browser verification.
- [x] Record final review notes and remaining risk.

## Review

- API commit `1807a3b Expose billing portal capability on dashboard` was pushed to `auronpep/barmatrix-api`.
- App commit `ef05f22 Classify account billing portal availability` was pushed to `auronpep/barmatrix-app`.
- The API dashboard payload now includes `billing_portal.portal_available` plus an unavailable reason derived from the active purchase row selected with the same customer-first ordering as the portal ownership path.
- The account billing panel now waits for dashboard billing state and renders `No Stripe billing portal` plus support contact for active access that cannot use Stripe, instead of showing `Update Payment Method`.
- The static billing copy no longer promises Stripe before capability is known.
- Red Zone files and the untracked Red Zone test were left untouched and unstaged.

## Verification

- Red checks failed before implementation:
  - API `npx tsx --test src\me-dashboard-billing.test.ts`
  - App `node --test tests\api-client-billing-portal.test.ts`
- Green checks:
  - API `npx tsx --test src\me-dashboard-billing.test.ts` passed.
  - API `npm test` passed with placeholder test env: 282 tests.
  - API `npm run typecheck` passed.
  - API `npm run build` passed.
  - App tracked tests passed: 37 tests. Untracked Red Zone test from the other session was intentionally excluded.
  - App `npm run lint` passed.
  - App `npm run build` passed.
  - `git diff --check` passed in both repos with only LF/CRLF warnings.
- Deployment:
  - API Hostinger app directory is at `1807a3b`; compiled `dist/routes/me.js` contains `billing_portal`.
  - App GitHub Actions run `26798801470` succeeded for `ef05f22`.
  - Live API `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Vercel error logs and Hostinger `stderr.log` checks returned no rows.
- Live browser verification:
  - `https://barmatrix.app/account?billing_capability_verify=1780375550` rendered active account state.
  - Billing panel rendered `No Stripe billing portal...`.
  - `Update Payment Method` was absent.
  - Old `No local purchase with a billing customer...` copy was absent.
  - No raw `API ###` text appeared, `<main>` count was 1, and browser warning/error logs were empty.
  - Browser screenshot capture timed out in the in-app runtime; DOM and console evidence were captured.

## Remaining Risk

- Active non-Stripe/manual accounts are now classified before the payment-method CTA is shown.
- Stripe-backed accounts should still see the portal CTA when `billing_portal.portal_available` is true; this was covered by source/build checks, but the current paid browser account is a no-portal account, so a Stripe-backed browser account was not available for live positive-path re-verification in this pass.

# Live Non-Red-Zone Smoke Audit

## Scope

- Continue the live production audit while another session owns Red Zone review/debugging.
- Exclude Red Zone routes and Red Zone source/test files from this pass.
- Verify paid-user non-Red-Zone study surfaces, account surfaces, production logs, and open non-Red-Zone follow-ups.
- Fix only concrete root causes reproduced from local/runtime evidence.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work is present and leave it untouched.
- [x] Run live in-app-browser smoke on non-Red-Zone paid routes.
- [x] Check browser console/runtime health for raw API statuses, duplicate main landmarks, and visible broken states.
- [x] Check production API/frontend logs after browser smoke.
- [x] Review open non-Red-Zone GitHub follow-ups for current blockers already evidenced locally.
- [x] Triage any reproduced issue to root cause before editing source.
- [x] Add focused regression coverage and apply the smallest clean fix if a source defect is found.
- [x] Run relevant tests/lint/build/deploy verification for any changes.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Skipped Red Zones per the user's instruction and left the existing dirty Red Zone page/test untouched.
- Live paid smoke covered `/dashboard`, `/account`, `/foundations`, `/mastery`, `/coach`, `/certification`, `/certification/M1`, `/boot-camps`, `/practice`, `/timed-sets`, `/traps`, `/tensions`, `/drills/evidence`, `/drills/criminal-law`, and `/diagnostic`.
- The paid account hooks can take a few seconds to settle; after waiting, `/account` rendered active access and the no-portal billing state.
- The live smoke found no raw API error text, no horizontal overflow at the tested desktop width, and no fresh browser warning/error logs.
- Reproduced a non-Red-Zone accessibility defect: `/boot-camps` rendered two `<main>` landmarks because the root layout already wraps all pages in `<main>` while several route pages also declared `<main>`.
- Fixed the source-wide root cause by converting route-local page `<main>` wrappers to neutral `<div>` wrappers, preserving layout classes and leaving `app/layout.tsx` as the single page landmark owner.
- Added `tests/page-main-landmarks.test.ts` to lock the convention across `app/**/page.tsx`.
- App commit `aa397e9 Fix nested page main landmarks` was pushed to `auronpep/barmatrix-app`.
- Red Zone files and local audit notes remained unstaged after the commit.

## Verification

- Red check before implementation: `node --test tests\page-main-landmarks.test.ts` failed and listed 19 route page files with local `<main>` wrappers.
- Green checks:
  - `node --test tests\page-main-landmarks.test.ts tests\coach-main-landmark.test.ts` passed.
  - App tests excluding the untracked Red Zone test passed: 38 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` and `git diff --cached --check` passed with only normal LF/CRLF warnings.
- Local in-app browser verification on representative affected routes (`/boot-camps`, `/about`, `/subjects/evidence`, `/dashboard/final-sprint`, `/privacy`, `/terms`, `/waitlist`) showed exactly one `<main>`, no raw API text, and no browser warning/error logs.
- GitHub Actions deploy run `26799377427` succeeded for `aa397e9`.
- Vercel production deployment `dpl_GzinokCxGXJ6oqJaKZskrg4HrWUv` is `Ready` and aliased to `https://barmatrix.app`.
- Live in-app browser verification on the same representative routes showed exactly one `<main>`, no raw API text, no horizontal overflow, and no fresh browser warning/error logs.
- Vercel error logs for the post-deploy window returned no rows.
- `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}` and Hostinger `stderr.log` was empty.
- Open issue check: `auronpep/barmatrix-app` has no open issues; `auronpep/barmatrix-api` still has only the known C3 content backfill issue `#3`.

## Remaining Risk

- Red Zone routes remain explicitly out of scope for this pass.
- C3 Mastery/Coach remain limited by missing authored C3 annotation and mold-tag content, tracked in `auronpep/barmatrix-api#3`.
- Some public routes briefly show signed-out nav while Clerk/account state settles, then account-aware routes update; no broken state persisted after the wait used in verification.

# Live Public And Dynamic Route Audit

## Scope

- Continue the live production audit outside Red Zones.
- Cover public/static marketing routes, dynamic non-Red-Zone detail pages, SEO endpoints, and production logs.
- Avoid destructive checkout, diagnostic, or study-attempt mutations unless a concrete failure requires them.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Derive representative public, dynamic, and SEO routes from local app/API evidence.
- [x] Browser-smoke those live routes for visible broken states, raw API text, duplicate landmarks, overflow, and fresh console errors.
- [x] Verify key API-backed dynamic detail endpoints through rendered pages or live HTTP responses.
- [x] Check Vercel frontend logs, API health, and Hostinger API stderr after the smoke.
- [x] Trace any reproduced issue to source/runtime root cause before editing source.
- [x] Add a focused regression and apply the smallest clean fix if a source defect is found.
- [x] Run relevant checks and live verification for any changes.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Live public/dynamic smoke covered `/`, `/how-it-works`, `/pricing`, `/checkout`, `/checkout/success`, `/faq`, `/partners`, `/referral`, `/app`, `/sign-in`, `/sign-up`, `/drills`, all seven `/subjects/*` pages, `/foundations/lesson-01`, `/boot-camps/contract-formation-timing`, `/traps/overbroad_rule`, `/traps?official=1`, `/tensions/cp_diversity_amount_vs_supplemental_jurisdiction`, `/tensions?curated=1`, and `/diagnostic/session`.
- Dynamic slugs were derived from live API data rather than guessed: Foundation lesson `lesson-01`, boot camp `contract-formation-timing`, trap `overbroad_rule`, and tension `cp_diversity_amount_vs_supplemental_jurisdiction`.
- Auth pages redirect a signed-in user to `/`, which is expected and rendered without raw API text or fresh browser errors.
- Client-backed pages that first looked like loading states (`/referral`, `/drills`, `/foundations/lesson-01`, `/boot-camps/contract-formation-timing`) settled to meaningful states after waiting.
- Reproduced a live checkout-success bug: `/checkout/success` with no checkout session, and with fake unfulfilled session `cs_test_missing_live_audit_public_smoke`, rendered `ENROLLMENT CONFIRMED`.
- Root cause: `app/checkout/success/page.tsx` rendered confirmation copy and `PurchaseSuccessTracker` unconditionally without checking the existing checkout-status endpoint.
- Fixed the success page to call `api.getCheckoutStatus(checkoutSessionId)`, render confirmation only when `fulfilled` is true, render `Checkout verification needed` for missing session IDs, render `Activation check pending` for unfulfilled/unverifiable sessions, and track purchase completion only after confirmed fulfillment.
- App commit `27af5c3 Verify checkout success before confirming access` was pushed to `auronpep/barmatrix-app`.
- Red Zone files and local audit notes remained unstaged after the commit.

## Verification

- Red check before implementation: `node --test tests\checkout-success-state.test.ts` failed because the page did not call `api.getCheckoutStatus(checkoutSessionId)` and rendered the success tracker unconditionally.
- Green checks:
  - `node --test tests\checkout-success-state.test.ts tests\api-client-billing-portal.test.ts` passed.
  - App tests excluding the untracked Red Zone test passed: 39 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` and `git diff --cached --check` passed with only normal LF/CRLF warnings.
- Local browser verification:
  - `/checkout/success` with no checkout session rendered `Checkout verification needed`, not enrollment confirmed.
  - `/checkout/success?checkout_session_id=cs_test_missing_live_audit_public_smoke` rendered `Activation check pending`, not enrollment confirmed.
  - Both states rendered one `<main>` and no raw API text.
- Deployment:
  - GitHub Actions run `26799883858` succeeded for `27af5c3`.
  - Vercel production deployment `dpl_8tmn6svAzTtr3szeBD6gGUfWBpTp` is `Ready` and aliased to `https://barmatrix.app`.
- Live browser verification:
  - `https://barmatrix.app/checkout/success?live_verify=missing_1780387001` rendered `Checkout verification needed`; `ENROLLMENT CONFIRMED` was absent.
  - `https://barmatrix.app/checkout/success?checkout_session_id=cs_test_missing_live_audit_public_smoke&live_verify=fake_1780387001` rendered `Activation check pending`; `ENROLLMENT CONFIRMED` was absent.
  - Both live pages had `<main>` count 1, no raw API text, no horizontal overflow, and no fresh browser warning/error logs.
- SEO/log checks:
  - `https://barmatrix.app/robots.txt` returned HTTP 200 and disallows `/checkout/success`.
  - `https://barmatrix.app/sitemap.xml` returned HTTP 200 with 12 `<loc>` entries.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Vercel error-log query returned no rows.
  - Hostinger `stderr.log` was empty.

## Remaining Risk

- Red Zone routes remain explicitly out of scope for this pass.
- A real fulfilled Stripe session was not available for live positive-path verification; the confirmed branch is covered by source regression and deploy/build checks, while the two previously false-positive live paths are directly verified.
- C3 Mastery/Coach measurement remains limited by missing authored annotation/tagging content, tracked as `auronpep/barmatrix-api#3`.

# Live Mobile Responsive Non-Red-Zone Audit

## Scope

- Continue the live production audit outside Red Zones.
- Use a temporary 390px mobile viewport in the in-app browser, then reset the viewport before finishing.
- Check representative public, paid, study, and dynamic non-Red-Zone routes for meaningful states, raw API text, duplicate landmarks, horizontal overflow, and fresh browser errors.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Read the in-app browser viewport capability documentation.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Set the in-app browser to a mobile viewport.
- [x] Browser-smoke representative live non-Red-Zone pages at mobile width.
- [x] Trace any reproduced responsive defect to root cause before editing source.
- [x] Add focused regression coverage and apply the smallest clean fix if a source defect is found.
- [x] Run relevant tests/lint/build/deploy/live verification for any source changes.
- [x] Reset the temporary browser viewport and record evidence/results.

## Review

- Initial 390px live mobile smoke covered `/`, `/pricing`, `/checkout`, checkout-success missing/fake states, `/account`, `/dashboard`, `/foundations`, `/foundations/lesson-01`, `/drills`, `/drills/evidence`, `/drills/criminal-law`, `/subjects/criminal-law`, `/subjects/evidence`, `/practice`, `/timed-sets`, `/boot-camps`, `/boot-camps/contract-formation-timing`, `/traps`, `/traps/overbroad_rule`, `/tensions`, `/tensions/cp_diversity_amount_vs_supplemental_jurisdiction`, `/diagnostic/session`, `/referral`, `/faq`, and `/partners`.
- Reproduced persistent mobile document overflow on `/subjects/evidence`, `/traps`, and `/tensions`; each route still had one `<main>`, no raw API text, and no fresh browser warnings/errors.
- Root cause: live subject question cards could force min-content width through long external ids/topic metadata, and trap/tension catalog flex/grid rows did not consistently opt their grid/flex children into shrinking or stacking on narrow screens.
- Added `tests/mobile-content-overflow.test.ts`, a `.break-anywhere` utility, subject question-card wrap guards across all seven subject pages, and min-width/stacking guards for trap and tension catalog rows.
- App commit `6a8781e Fix mobile content overflow` was pushed to `auronpep/barmatrix-app`; Red Zone files and the untracked Red Zone test remained untouched and unstaged.

## Verification

- Red check before implementation: `node --test tests\mobile-content-overflow.test.ts` failed on missing wrap/shrink guards.
- Green checks:
  - `node --test tests\mobile-content-overflow.test.ts tests\nav-mobile-overflow.test.ts` passed.
  - App tests excluding the untracked Red Zone test passed: 41 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` and `git diff --cached --check` passed with only normal LF/CRLF warnings.
- Local browser verification at mobile width:
  - `http://localhost:3000/subjects/evidence`, `/subjects/criminal-law`, `/traps`, and `/tensions` each had `scrollWidth=clientWidth`, `<main>` count 1, no raw API text, and no fresh browser warnings/errors.
- Deployment:
  - GitHub Actions run `26800474033` succeeded for `6a8781e`.
  - Vercel production deployment `dpl_3p2VFuxmy18bZFyufe1ZNybKWJsS` is `Ready` and aliased to `https://barmatrix.app`.
- Live browser verification at mobile width:
  - `https://barmatrix.app/subjects/evidence?mobile_live_verify=6a8781e`, `/subjects/criminal-law`, `/traps`, and `/tensions` each had `scrollWidth=clientWidth=375`, `<main>` count 1, no raw API text, and no fresh browser warnings/errors.
  - The temporary browser viewport override was reset after verification.
- Production health/log checks:
  - Vercel error-log query returned no rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty.

## Remaining Risk

- Red Zone routes remain explicitly out of scope for this pass.
- C3 Mastery/Coach measurement remains limited by missing authored annotation/tagging content, tracked as `auronpep/barmatrix-api#3`.

# Live Malformed Dynamic Route Non-Red-Zone Audit

## Scope

- Continue the live production audit outside Red Zones.
- Check nonexistent or malformed dynamic route params for non-Red-Zone pages.
- Expected behavior: clear product/not-found or sign-in/gated states, one `<main>`, no raw API/runtime error text, no client error logs, and no production error-log entries.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Read local Next.js not-found docs before changing route behavior.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Browser-smoke representative malformed live non-Red-Zone dynamic routes.
- [x] Trace any reproduced broken state to source/runtime root cause before editing.
- [x] Add focused regression coverage and apply the smallest clean fix if a source defect is found.
- [x] Run relevant tests/lint/build/deploy/live verification for any source changes.
- [x] Check production logs/API health and record evidence/results.

## Review

- Initial live malformed-route smoke found raw API status text on `/foundations/not-a-real-lesson-live-audit`, `/boot-camps/not-a-real-boot-camp-live-audit`, `/boot-camps/sessions/not-a-real-session-live-audit`, `/boot-camps/sessions/not-a-real-session-live-audit/days/1`, `/boot-camps/sessions/not-a-real-session-live-audit/mastery`, `/diagnostic/not-a-real-session-live-audit/results`, `/diagnostic/session/not-a-real-session-live-audit/results`, and `/drills/not-a-real-drill-live-audit`.
- Root cause: client route pages built visible error strings directly from `ApiClientError.status` and, in two diagnostic pages, included backend error messages verbatim.
- Added `lib/user-facing-errors.ts` so expected 400/404 resource failures map to product-facing not-found/unavailable copy.
- Updated affected non-Red-Zone dynamic pages to use the shared mapper, preserving signed-out/forbidden/unavailable distinctions where the page already exposed them.
- Added `tests/malformed-route-errors.test.ts` to prevent reintroducing raw API status copy in those route error states.
- App commit `f13a193 Sanitize malformed route error states` was pushed to `auronpep/barmatrix-app`.
- Red Zone files and the untracked Red Zone test remained untouched and unstaged.

## Verification

- Red check before implementation: `node --test tests\malformed-route-errors.test.ts` failed because `lib/user-facing-errors.ts` did not exist and the pages still rendered raw API statuses.
- Green checks:
  - `node --test tests\malformed-route-errors.test.ts` passed.
  - `node --test tests\malformed-route-errors.test.ts tests\checkout-success-state.test.ts` passed.
  - App tests excluding the untracked Red Zone test passed: 42 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` and `git diff --cached --check` passed with only normal LF/CRLF warnings.
- Local browser verification on the eight affected malformed routes showed one `<main>`, no raw API status text, and no browser warning/error logs.
- Deployment:
  - GitHub Actions run `26800969639` succeeded for `f13a193`.
  - Vercel production deployment `dpl_32CrEZshExCXAoyJi2VQEgHit8v4` is `Ready` and aliased to `https://barmatrix.app`.
- Live browser verification on the eight affected malformed routes with `bad_route_live=f13a193...` showed user-facing copy, one `<main>`, no raw API status text, and no fresh browser warning/error logs after the deploy window.
- Production health/log checks:
  - Vercel error-log query returned no rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty.

## Remaining Risk

- Red Zone malformed routes remain explicitly out of scope for this pass.
- These checks validate nonexistent/malformed route failure states. Happy-path C3 Mastery/Coach measurement remains limited by missing authored annotation/tagging content, tracked as `auronpep/barmatrix-api#3`.

# Live Signed-In Workflow Non-Red-Zone Audit

## Scope

- Continue the live production audit outside Red Zones.
- Use the paid signed-in in-app browser session to verify safe, non-payment study workflows on production.
- Avoid destructive checkout/payment-provider side effects and skip Red Zone source/routes handled by the other session.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Inspect workflow route/client code and live API readiness for safe browser actions.
- [x] Browser-test signed-in non-Red-Zone study workflows on production.
- [x] Check visible state, raw API text, duplicate landmarks, overflow, and fresh console logs.
- [x] Check production frontend/API logs after the workflow smoke.
- [x] Trace any reproduced issue to root cause before editing.
- [x] Add focused regression coverage and apply the smallest clean fix if a source defect is found.
- [x] Run relevant checks/deploy/live verification if source changes are made.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Verified production deployment `dpl_32CrEZshExCXAoyJi2VQEgHit8v4` was still `Ready` and aliased to `https://barmatrix.app`; live API health returned `{"ok":true,"db":"up"}` before workflow testing.
- Confirmed the in-app browser account rendered active access on `/account` with `No Stripe billing portal`, one `<main>`, no raw API text, and no fresh warning/error logs.
- Live Evidence drill: started the Evidence queue, selected answer A, submitted, and rendered the forensics/result state with one `<main>`, no raw API text, and no fresh warning/error logs.
- Live Practice: selected the Evidence subject, loaded a 20-question set, submitted answer A, and rendered `Wrong Answer Forensics`.
- Live Timed Sets: started a 17-question mixed set, submitted the first answer, and rendered the timed forensics state.
- Live Boot Camps: catalog and `contract-formation-timing` detail rendered; `Start camp` created session `f5cb4b5d-dddb-4794-8685-c5a1cd4f4bb7`; Day 1 loaded and the first answer submitted, advancing to question 2 with forensics.
- Live Certification: `/certification` and `/certification/M1` correctly rendered Method-gate states for this account, without raw API text.
- Live Diagnostic: started session `e632e749-3f5f-41dd-8959-aee2d554e7ff`, submitted question 1, rendered forensics, and advanced to question 2.
- Live Coach: `Start coaching` rendered the expected `Not measurable yet` state because C3 measurement content is not available for this account.
- Live Mastery: rendered measured-on-0-attempts / not-yet-measured C3 state without raw API text.
- No source defect was reproduced in this slice, so no app/API code was changed and no regression test was added.

## Verification

- Browser checks after each workflow confirmed one `<main>`, no raw `API ###` copy, no visible `internal server error` / `Application error`, and no fresh browser warning/error logs since the workflow window began.
- Production health/log checks after workflow testing:
  - Vercel error-log query for the last 30 minutes returned no rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty.
- No source changes were made in this slice, so deployment/test reruns were not applicable beyond the already-current production deployment and live browser/log verification.

## Remaining Risk

- Red Zone routes and source remain explicitly out of scope because another session owns that audit.
- The diagnostic and boot-camp workflows were partially exercised to verify production start/submit/navigation paths; they were not completed end-to-end to avoid replacing the account's full diagnostic result or finishing a full boot camp.
- Certification full assessment remains gated for this account until The Method is complete.
- C3 Coach/Mastery measurement remains limited by missing authored C3 annotation/tagging content, tracked as `auronpep/barmatrix-api#3`.

# Live API Auth Boundary Non-Red-Zone Audit

## Scope

- Continue the live production audit outside Red Zones.
- Probe representative public, protected, malformed, CORS preflight, and method-boundary API contracts used by the web app.
- Expected behavior: public endpoints return shaped JSON, protected endpoints fail closed without stack traces, malformed requests return sanitized client errors, CORS permits the production app origin, and production logs stay clean.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Map app API calls to representative live endpoints.
- [x] Probe live public/protected/CORS/error contracts.
- [x] Check production frontend/API logs after the API probes.
- [x] Trace any reproduced issue to root cause before editing.
- [x] Add focused regression coverage and apply the smallest clean fix if a source defect is found.
- [x] Run relevant checks/deploy/live verification if source changes are made.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Mapped representative app dependencies from `lib/api-client.ts` and API route registrations in `C:\barmatrix-api\src`.
- Public live probes returned shaped 200 responses for health, cohort status, Foundations outline/lesson, Evidence question list/detail, traps, tensions, boot camps, drill catalog, C3 deck, certification outline, and fake checkout status.
- Malformed live probes returned sanitized 400/404 JSON for bad Foundation/question/trap/tension/boot-camp identifiers and missing subject query.
- Unauthenticated protected probes failed closed with 401 JSON for `/api/me/dashboard`, `/api/me/c3`, `/api/me/c3/next`, `/api/me/gamification`, `/api/drills/prescribed`, `/api/drills/start`, and `/api/certification/M1`.
- Invalid write probes returned sanitized 400 JSON for malformed `/api/attempts` payloads and invalid JSON bodies.
- Question detail response was scanned and did not expose answer-key or forensic fields (`is_correct`, `why_correct`, `why_wrong`, `forensic_tags`, `misconception_tags`) before attempt submission.
- CORS preflight allowed `https://barmatrix.app` with credentials for protected dashboard and attempts endpoints; a disallowed origin did not receive allow-origin/credentials headers.
- No source defect was reproduced in this slice, so no app/API code was changed and no regression test was added.

## Verification

- Live API probe set covered representative public, protected, malformed, CORS, and invalid-write contracts.
- Narrow internal-leak scan found no stack traces, SQL errors, database exception codes, bearer tokens, Stripe secret/public live keys, or password fields. One broad first-pass match on trap detail was rechecked and identified as ordinary answer text (`select strict scrutiny`), not SQL.
- Production health/log checks after probes:
  - Vercel error-log query for the last 30 minutes returned no rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty.
- No source changes were made in this slice, so deployment/test reruns were not applicable.

## Remaining Risk

- Red Zone API paths remain explicitly out of scope because another session owns Red Zone review/debugging.
- This pass did not click Stripe checkout creation or billing portal creation to avoid payment-provider side effects.
- Authenticated API positive paths are covered by the prior live signed-in browser workflow pass rather than by printing bearer tokens into a shell probe.

# Live Route And Link Integrity Non-Red-Zone Audit

## Scope

- Continue the live production audit outside Red Zones.
- Check rendered production routes and internal links for broken navigation, duplicate landmarks, raw API/runtime text, visible error states, desktop overflow, and fresh browser/production errors.
- Use the in-app browser for rendered UI evidence and skip Red Zone routes/source owned by the other session.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Derive non-Red-Zone static and representative dynamic route targets.
- [x] Browser-smoke rendered live route targets.
- [x] Collect same-origin internal links from rendered pages and probe their HTTP/redirect status.
- [x] Check production frontend/API logs after the route/link pass.
- [x] Trace any reproduced issue to root cause before editing.
- [x] Add focused regression coverage and apply the smallest clean fix if a source defect is found.
- [x] Run relevant checks/deploy/live verification if source changes are made.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Browser route smoke covered 56 live non-Red-Zone route targets with one `<main>`, no raw API text, no visible runtime errors, no desktop overflow, and no fresh browser warning/error logs.
- Link discovery collected 398 same-origin non-Red-Zone links; the initial probe found 34 broken `/tensions/...` links from the Tension Map catalog.
- Root cause was an API catalog/detail contract mismatch: observed-only tension tags were emitted as raw list slugs, but detail validation and Next path routing could not reliably open all raw bank values (`FM-I.B-*`, semicolon composites, and slash/prose tags).
- API commits pushed to `auronpep/barmatrix-api`:
  - `695e4b8 Accept observed tension link slugs`
  - `e37b596 Publish route-safe observed tension slugs`
- Hostinger could not fetch GitHub from SSH, so the pushed API source files were copied to the deployed app directory, built there with Node 20, and the `tmp/restart.txt` marker timestamp was updated. The deployed source/dist contain the `toTensionRouteSlug` route-safe observed-slug logic.
- Live API now emits route-safe `observed_...` slugs for unsafe observed values, while detail endpoints decode them back to the original bank tag.

## Verification

- Red checks:
  - `npx tsx --test src/lib/tensions.test.ts` failed before the validator change on `invalid tension slug`.
  - The route-safe slug regression failed before implementation because `toTensionRouteSlug` did not exist.
- Green API checks from the clean deploy worktree:
  - `npx tsx --test src/lib/tensions.test.ts` passed: 23 tests.
  - `npm test` passed: 286 tests.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --check -- src/lib/tensions.ts src/lib/tensions.test.ts` passed with only normal CRLF warnings.
- Live API verification:
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - `/api/tensions/FM-I.B-AMBIGUOUS-ACCEPTANCE-MODE`, `/api/tensions/observed_Q09OLUNNLTAwMTsgQ09OLUNNLTAwMw`, and `/api/tensions/observed_RmFjdCBvZiBjb25zZXF1ZW5jZSArIHdlYWsgcHJvb2YvYWx0ZXJuYXRpdmUgY2F1c2U` returned HTTP 200 detail payloads.
- Live browser verification:
  - `/tensions` rendered 267 current catalog links, including route-safe `observed_...` hrefs for semicolon and slash/prose observed tags; no raw unsafe tension hrefs were present.
  - Rendered detail checks passed for `/tensions/AEDPA`, `/tensions/cl_congress_power_vs_anti_commandeering`, `/tensions/observed_Q09OLUNNLTAwMTsgQ09OLUNNLTAwMw`, `/tensions/observed_RmFjdCBvZiBjb25zZXF1ZW5jZSArIHdlYWsgcHJvb2YvYWx0ZXJuYXRpdmUgY2F1c2U`, and `/tensions/FM-I.B-AMBIGUOUS-ACCEPTANCE-MODE`.
  - Each checked detail page had one `<main>`, no 404, no raw API text, no desktop overflow, and no fresh browser warning/error logs.
  - A catalog-wide HTTP probe found all 267 current `/tensions/...` hrefs returned HTTP 200.
- Production log checks:
  - Vercel error logs were clean for the post-verification 3-minute window. The wider 30-minute window contained the pre-fix reproduction 404s.
  - Hostinger `stderr.log` was empty after deploy.

## Remaining Risk

- Red Zone routes and source remain explicitly out of scope because another session owns them.
- The API deployed source/dist are live, but Hostinger SSH cannot fetch the private GitHub repo, so the remote git HEAD may lag the pushed commit even though the deployed files and behavior match the fix.

# Hostinger API Deploy Path Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Investigate and repair the Hostinger API deploy-path gap where the production checkout cannot fetch the private `auronpep/barmatrix-api` repo from GitHub.
- Expected behavior: the deployed API directory can authenticate to GitHub read-only, fetch/pull the pushed `main` commit, build from git state, restart cleanly, and leave live API/browser health/log checks clean.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Inspect Hostinger git remote, SSH key, GitHub deploy-key, and local `gh` auth state without exposing secrets.
- [x] Choose the smallest safe deployment authentication repair.
- [x] Apply the repair and verify Hostinger can fetch/pull `main`.
- [x] Build/restart the API from the fetched git checkout.
- [x] Verify live API health, relevant endpoint behavior, and production logs.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Confirmed local `gh` is authenticated with admin permission on private repo `auronpep/barmatrix-api`.
- Confirmed Hostinger initially had no GitHub SSH auth: `ssh -T git@github.com` returned publickey denied, and `git ls-remote origin main` failed because `origin` was HTTPS with no interactive credentials.
- Created a read-only GitHub deploy key named `hostinger-barmatrix-api-readonly` for `auronpep/barmatrix-api`.
- Added an SSH config entry on Hostinger for `github.com` using the new deploy key, changed API `origin` to `git@github.com:auronpep/barmatrix-api.git`, fetched `origin/main`, and reset the deployed checkout onto a normal `main` branch tracking `origin/main`.
- Rebuilt the API from the fetched git checkout with Hostinger Node 20 and touched `tmp/restart.txt`.

## Verification

- GitHub deploy key list shows `hostinger-barmatrix-api-readonly` with `read_only: true`.
- Hostinger `ssh -T git@github.com` now authenticates as `auronpep/barmatrix-api`.
- Hostinger `git ls-remote --heads origin main` returned `e37b59611d3d35051c4c9b522e15c620218d3f13`.
- Hostinger deployed checkout `HEAD` is `e37b59611d3d35051c4c9b522e15c620218d3f13` on branch `main`, tracking `origin/main`, with only untracked runtime `tmp/`.
- Live `GET https://api.barmatrix.app/health?deploy_path_verify=1` returned `{"ok":true,"db":"up"}`.
- Live `GET https://api.barmatrix.app/api/tensions/observed_Q09OLUNNLTAwMTsgQ09OLUNNLTAwMw?deploy_path_verify=1` returned HTTP 200.
- Hostinger `stderr.log` was empty.
- Vercel error logs for the post-check 5-minute window returned no rows.

## Remaining Risk

- API production deploys can now fetch the private repo from Hostinger through a read-only deploy key.
- Red Zone routes/source remain out of scope for this pass.

# Live Static Surface And Metadata Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify public/static surfaces that support production discoverability and trust: sitemap, robots, metadata/open graph, icons/manifest, legal/static pages, checkout/account status states, security headers, asset delivery, and cache behavior.
- Use local source/runtime and live browser/HTTP evidence only; do not use external bug-specific facts.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Map public/static route source, metadata, icons/assets, headers, sitemap/robots, and cache rules.
- [x] Probe representative live pages/assets and rendered browser states.
- [x] Check production frontend/API logs after the static-surface pass.
- [x] Trace any reproduced issue to root cause before editing.
- [x] Add focused regression coverage and apply the smallest clean fix if a source defect is found.
- [x] Run relevant local checks and browser verification.
- [x] Deploy and run live post-deploy verification.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Initial live/source audit found multiple non-Red-Zone static-surface defects:
  - Global `app/layout.tsx` canonical metadata forced routes such as `/pricing` to canonicalize to the home page.
  - Transactional/auth status pages did not declare `noindex, nofollow`.
  - Public sitemap omitted several product/catalog routes and used request-time `new Date()` for every `lastModified`.
  - The app had no manifest route, so `/manifest.webmanifest` was missing.
  - Production responses lacked basic defensive headers managed by the app.
  - Non-Red-Zone static LPs linked to stale destinations and still advertised iOS/Android availability.
- Applied the smallest source changes for this slice:
  - Added app-wide security headers in `next.config.ts`.
  - Moved the home canonical from global layout metadata to `app/page.tsx`.
  - Added `noindex, nofollow` metadata to sign-in, sign-up, and checkout success.
  - Stabilized sitemap `lastModified` and added missing public routes.
  - Added `app/manifest.ts`.
  - Cleaned stale links/mobile claims in `public/lp-failed-by-6.html`, `public/lp-four-traps.html`, `public/lp-priced-right.html`, and `public/lp-wrong-answers.html`.
- Red Zone source, tests, and LP behavior remain excluded because another session owns that area.
- Pushed app commit `5ac3a8f` (`Harden static metadata surface`) to `main`; the Vercel production deployment completed successfully and `https://barmatrix.app` aliases a Ready deployment created after that push.

## Verification

- Focused regression tests were written red-first and now pass:
  - `node --test tests\security-headers.test.ts`
  - `node --test tests\metadata-canonical.test.ts`
  - `node --test tests\noindex-transactional-pages.test.ts`
  - `node --test tests\sitemap-static-surface.test.ts`
  - `node --test tests\static-landing-pages.test.ts`
  - `node --test tests\manifest-route.test.ts`
- Full non-Red-Zone app test sweep passed with the unrelated Red Zone test excluded:
  - `node --test <all tests except tests\red-zone-detail-params.test.ts>` passed 51/51.
- `npm run lint` passed.
- `npm run build` passed and emitted `/manifest.webmanifest`.
- Local production verification on `http://localhost:3012` passed for `/`, `/pricing`, `/terms`, `/checkout/success`, `/sign-in`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/lp-four-traps.html`, and `/lp-priced-right.html`.
- In-app browser verification passed for local `/pricing`, `/checkout/success`, and `/lp-four-traps.html`: intended page identity, meaningful content, no framework overlay/runtime text, no desktop overflow, expected canonical/robots/manifest signals, expected cleaned LP links, and no fresh browser warning/error logs.
- Live HTTP verification passed for `https://barmatrix.app/`, `/pricing`, `/terms`, `/checkout/success`, `/sign-in`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/lp-four-traps.html`, and `/lp-priced-right.html`: HTTP 200, new defensive headers present, home canonical only on `/`, noindex/nofollow on checkout success and sign-in, manifest served as `application/manifest+json`, stable sitemap `lastmod`, and expected sitemap route coverage.
- Live static LP verification passed for `lp-four-traps`, `lp-priced-right`, `lp-failed-by-6`, and `lp-wrong-answers`: Pricing anchors point to `/pricing`, expected footer/product links are present, stale `/dashboard` links are absent, and stale iOS/Android claims are absent.
- Live in-app browser verification passed for `/pricing?audit=static_audit_5ac3a8f_*`, `/checkout/success?audit=static_audit_5ac3a8f_*`, and `/lp-four-traps.html?audit=static_audit_5ac3a8f_*`: expected titles/H1s, metadata, cleaned links, no visible runtime errors, no desktop overflow, and no fresh browser warning/error logs.
- Production health/log checks after live probes:
  - Vercel production error logs for the last 15 minutes returned no rows.
  - `GET https://api.barmatrix.app/health?static_surface_verify=5ac3a8f` returned `{"ok":true,"db":"up"}`.
  - Hostinger API `stderr.log` tail was empty.

## Remaining Risk

- Red Zone routes and source remain out of scope for this pass.
- `app/checkout/page.tsx` still lacks a page-level noindex export because it is a client component; changing that would require a broader server/client wrapper refactor.
- CSP was intentionally not added in this smallest-change pass because Clerk, Stripe, PostHog, and Sentry need a carefully tested policy.

# Checkout Indexing And Deploy Runtime Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Close the remaining transactional `/checkout` indexing gap from the static-surface audit.
- Remove the production workflow's GitHub Actions Node 20 runtime deprecation warning without changing app behavior.
- Keep dirty Red Zone source/test files untouched.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Read local Next 16 metadata guidance for the client/server page boundary.
- [x] Reproduce the checkout noindex and workflow runtime-warning gaps with focused tests.
- [x] Apply the smallest clean source/workflow changes.
- [x] Run focused tests, full non-Red-Zone tests, lint, build, local browser verification, and diff hygiene.
- [x] Deploy and run live HTTP/browser verification.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Added a red regression to include `app/checkout/page.tsx` in transactional noindex coverage; it failed because the current page was a Client Component without robots metadata.
- Added a red regression for `.github/workflows/deploy-vercel.yml`; it failed because the workflow did not set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`.
- Split `/checkout` into:
  - `app/checkout/page.tsx`: Server Component route wrapper with title/description and `robots: { index: false, follow: false }`.
  - `app/checkout/checkout-client.tsx`: existing interactive checkout UI and Stripe-session startup behavior.
- Added the GitHub Actions Node 24 runtime opt-in at workflow scope.
- First deploy after the opt-in passed, but GitHub still emitted a warning that `actions/checkout@v4` and `actions/setup-node@v4` target Node 20 and were being forced to Node 24. Verified `v5` tags exist for both actions and updated the workflow to `actions/checkout@v5` and `actions/setup-node@v5`.

## Verification

- Red checks before implementation:
  - `node --test tests\noindex-transactional-pages.test.ts` failed on missing checkout robots metadata.
  - `node --test tests\vercel-workflow-runtime.test.ts` failed on missing `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`.
- Green checks after implementation:
  - `node --test tests\noindex-transactional-pages.test.ts` passed.
  - `node --test tests\vercel-workflow-runtime.test.ts` passed.
  - After the first deployment proved the env-only fix incomplete, `tests\vercel-workflow-runtime.test.ts` was tightened to require `actions/checkout@v5`, `actions/setup-node@v5`, and no v4 checkout/setup-node actions.
  - Full non-Red-Zone app test sweep passed with the unrelated Red Zone test excluded: 52/52.
  - `npm run lint` passed.
  - `npm run build` passed and kept `/checkout` static.
  - `git diff --check` passed with only normal CRLF warnings.
- Local production browser verification on `http://localhost:3013`:
  - `/checkout?local_checkout_audit=ready` rendered title `Checkout - BarMatrix | BarMatrix`, H1 `One step from your Red-Zone Map.`, one `<main>`, two checkout buttons, `noindex, nofollow`, no runtime error text, no desktop overflow, and no fresh browser warning/error logs.
  - `/checkout?capacity=reached&local_checkout_audit=capacity` rendered the capacity panel and waitlist link, zero checkout buttons, `noindex, nofollow`, no runtime error text, no desktop overflow, and no fresh browser warning/error logs.
- Deployment and live verification:
  - Commit `5b608eb` deployed successfully but still produced the forced-runtime Node 20 warning, proving the env-only workflow change incomplete.
  - Commit `654377e` updated `actions/checkout` and `actions/setup-node` to v5; production workflow run `26805196406` passed regression tests, lint, build, Vercel pull, and production deploy with no annotations printed by `gh run watch` / `gh run view`.
  - `vercel inspect https://barmatrix.app` reported a Ready production deployment created after `654377e`, aliased to `https://barmatrix.app`.
  - Live HTTP `/checkout?live_checkout_audit=654377e` returned 200, `Checkout - BarMatrix | BarMatrix`, `noindex, nofollow`, defensive headers, and expected checkout content.
  - Live in-app browser `/checkout?live_checkout_audit=654377e_ready` rendered one `<main>`, two checkout buttons, `noindex, nofollow`, no wrong canonical, no visible runtime error text, no desktop overflow, and no fresh browser warning/error logs.
  - Live in-app browser `/checkout?capacity=reached&live_checkout_audit=654377e_capacity` rendered the capacity panel and waitlist link, zero checkout buttons, `noindex, nofollow`, no visible runtime error text, no desktop overflow, and no fresh browser warning/error logs.
  - Vercel production error logs for the last 10 minutes returned no rows, API health returned `{"ok":true,"db":"up"}`, and Hostinger API `stderr.log` tail was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- CSP remains a separate security-hardening task.

# CSP Header Audit

## Scope

- Continue the live/static security audit outside Red Zones.
- Add the smallest app-managed Content Security Policy that does not break the current Next.js static rendering model, Clerk auth shell, PostHog/Sentry telemetry wiring, API calls, or static landing-page fonts.
- Use only local source/runtime and live browser/HTTP evidence. Keep dirty Red Zone files untouched.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Read local Next 16 CSP/header docs before editing config.
- [x] Map current live headers and rendered third-party origins.
- [x] Add a focused failing regression for the missing CSP policy.
- [x] Apply the smallest safe CSP header change.
- [x] Run focused tests, full non-Red-Zone tests, lint, build, local production HTTP/browser verification.
- [x] Deploy and run live HTTP/browser/log verification.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Added an enforced app-managed CSP in `next.config.ts` using the runtime origins observed in source, environment hostnames, live HTTP probes, and in-app browser checks.
- Kept the policy no-nonce to preserve static generation and CDN caching for static routes.
- Scoped local API/dev connect allowances behind `!process.env.VERCEL`; verified the live production CSP does not include `localhost`, `127.0.0.1`, or `ws://`.
- Red Zone source and tests remain untouched because another session owns that review.

## Verification

- Red/green focused test: `node --test tests\security-headers.test.ts`.
- Full non-Red-Zone app test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 53/53 tests.
- `npm run lint` passed.
- `npm run build` passed.
- Local production HTTP/browser verification passed on `http://localhost:3014` for `/`, `/account`, `/checkout`, and `/lp-four-traps.html`.
- Commit `39b70d1` deployed through GitHub Actions run `26806093231`; the deploy job passed tests, lint, build, Vercel pull, and production deploy.
- Vercel reports the new production deployment Ready and aliased to `https://barmatrix.app`.
- Live HTTP/browser verification passed for `/`, `/account`, `/checkout`, and `/lp-four-traps.html` with CSP present, no local-source leakage, meaningful rendered content, and no fresh browser warning/error logs.
- Production health/log checks after live verification: API health returned `{"ok":true,"db":"up"}`, Vercel log filter found no CSP/error matches, and Hostinger API `stderr.log` was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- The enforced CSP was browser-verified across the core app/auth/account/checkout/static-LP surfaces; uncommon future third-party embeds or new payment-provider UI embeds will need explicit CSP additions before launch.

# Live Post-CSP Study Flow Audit

## Scope

- Continue the live environment audit outside Red Zones after the enforced CSP deployment.
- Verify signed-in, API-backed study surfaces still render and interact under CSP.
- Avoid payment-provider side effects and skip Red Zone routes/source because another session owns that review.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Verify live CSP headers on representative protected study routes.
- [x] Browser-smoke signed-in dashboard/study routes under CSP.
- [x] Exercise one harmless live API-backed study interaction.
- [x] Check production frontend/API logs and live API health after the smoke.
- [x] Trace and fix any reproduced non-Red-Zone root cause with regression coverage where practical.
- [x] Record review notes, evidence, and remaining risk.

## Review

- Live HTTP probes confirmed CSP on `/dashboard`, `/drills/evidence`, `/practice`, `/timed-sets`, `/boot-camps`, `/certification`, `/coach`, `/foundations`, `/mastery`, `/traps`, and `/tensions`, with no `localhost`, `127.0.0.1`, or `ws://` leakage.
- In-app browser signed-in smoke covered dashboard, Evidence drill, practice, timed sets, boot camps, certification, coach, foundations, mastery, traps, and tensions under the live enforced CSP.
- Traps/tensions initially tripped a broad text heuristic, but exact-match inspection showed ordinary legal catalog content (`Violation Equals Suppression`, `statutory violation`), not raw API/CSP errors.
- Evidence drill interaction loaded a real live question, selected answer `A`, submitted it, and rendered forensics/next-question state with no fresh browser warning/error logs.
- No non-Red-Zone source defect was reproduced in this slice, so no code change or regression test was added.

## Verification

- Live route header probe passed for 11 representative non-Red-Zone study routes.
- Live browser smoke found meaningful content, one `<main>`, no desktop overflow in the tested viewport, and no fresh browser warning/error logs on each route.
- Live Evidence drill submit rendered result/forensics state and `Next Evidence question`.
- Production health/log checks after the smoke: API health returned `{"ok":true,"db":"up"}`, Vercel log filter found no CSP/error matches, and Hostinger API `stderr.log` was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- This slice verified one live study mutation in Evidence. It did not submit every boot-camp, certification, timed-set, coach, or diagnostic workflow again after CSP because those longer workflows were covered in earlier audit slices and would create extra production attempts.

# Account Checkout-Return Billing Capability Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Reproduce and repair the account billing CTA regression seen on `https://barmatrix.app/account?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789`.
- Keep the existing dirty Red Zone source/test files untouched.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Reproduce the account checkout-return billing state in the in-app browser.
- [x] Compare the checkout-return branch against plain `/account`.
- [x] Trace the branch to local source and add a failing regression test.
- [x] Apply the smallest source change.
- [x] Run focused tests, full non-Red-Zone tests, lint, build, browser verification, and production log checks.
- [x] Deploy if verification remains green, then run live browser verification.
- [x] Record final review notes and remaining risk.

## Review

- Live browser reproduction found that plain `/account` correctly settles to `No Stripe billing portal` for the current active account, but `/account?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789` rendered `Update Payment Method`.
- Root cause: `app/account/billing-portal-button.tsx` skipped the dashboard billing capability check when a checkout-session id was present.
- Added a regression in `tests/api-client-billing-portal.test.ts` proving checkout-return URLs must not bypass dashboard billing capability.
- Changed only the billing button capability gate so signed-in account pages wait for and honor dashboard billing capability with or without `checkoutSessionId`.
- Pushed commit `be0a3ad` (`Honor billing capability on checkout return`) to `main`; Vercel production deployment `dpl_6bLKobZ7kBdjGss1tyD4vMms8Sv7` is Ready and aliased to `https://barmatrix.app`.

## Verification

- Red check before implementation: `node --test tests\api-client-billing-portal.test.ts` failed on `!checkoutSessionId` in `needsDashboardBillingCheck`.
- Green focused check after implementation: `node --test tests\api-client-billing-portal.test.ts` passed 8/8.
- Full non-Red-Zone app test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 54/54.
- `npm run lint` passed.
- `npm run build` passed.
- Local production build started on `http://localhost:3015`; the route rendered, but local auth/API did not reproduce the live paid-dashboard branch, so final UI proof used production.
- Live in-app browser verification of `/account?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789&live_account_return_verify=be0a3ad` rendered active access, checkout recovery, `No Stripe billing portal`, no `Update Payment Method`, one `<main>`, no desktop overflow, and no visible raw runtime/API/CSP text.
- Screenshot evidence: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-account-return-billing-be0a3ad.png`.
- Production health/log checks passed: API health returned `{"ok":true,"db":"up"}`, Vercel logs showed only normal info request rows in the check window, and Hostinger API `stderr.log` was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- The checkout recovery panel still appears for the fake checkout-session id, as intended for the recovery workflow; this pass only removed the misleading Stripe portal CTA from accounts whose dashboard capability says no portal is available.

# Live Public Transactional Navigation Audit

## Scope

- Continue the live environment audit outside Red Zones after the account checkout-return deploy.
- Verify representative public, transactional, auth, static landing, and non-Red-Zone catalog entry points still render meaningful states with current metadata/security headers and safe navigation targets.
- Avoid payment-provider mutations, waitlist submissions, sign-out/sign-in state changes, and Red Zone routes/source handled elsewhere.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Probe the current production deployment and live HTTP status/header/metadata signals for representative routes.
- [x] Use the in-app browser to verify rendered page identity, one `<main>`, no raw runtime/API/CSP text, no desktop overflow, and fresh console health.
- [x] Exercise safe navigation/CTA targets without creating checkout sessions or submitting forms.
- [x] Trace and fix any reproduced source defect with focused regression coverage.
- [x] Record review notes, verification evidence, and remaining risk.

## Review

- Live HTTP matrix returned HTTP 200 for representative public, transactional, auth, catalog, study, static LP, robots, sitemap, and manifest routes, with CSP present and no broad raw-error markers.
- Live signed-in browser matrix found app-rendered routes had one `<main>`, no desktop overflow, no visible raw runtime/API/CSP text, and no fresh `barmatrix.app` warning/error logs.
- Found a concrete non-Red-Zone static LP defect: `/lp-four-traps.html`, `/lp-priced-right.html`, `/lp-failed-by-6.html`, and `/lp-wrong-answers.html` rendered `mainCount=0`.
- Root cause: static LPs are plain `public/` HTML and do not inherit the App Router root `<main>`.
- Added one `<main>` wrapper around non-footer content on each non-Red-Zone LP and regression coverage in `tests/static-landing-pages.test.ts`.

## Verification

- Red check before implementation: `node --test tests\static-landing-pages.test.ts` failed on missing `<main>`.
- Green focused check after implementation: `node --test tests\static-landing-pages.test.ts` passed 3/3.
- Full non-Red-Zone app test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 55/55.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check -- public\lp-four-traps.html public\lp-priced-right.html public\lp-failed-by-6.html public\lp-wrong-answers.html tests\static-landing-pages.test.ts tasks\todo.md tasks\evidence.md` passed with only normal CRLF warnings.
- Local production browser verification on `http://localhost:3016` passed for the four changed LPs: each had `mainCount=1`, meaningful H1/title, no desktop overflow, no visible raw runtime/API/CSP text, and no fresh browser warning/error logs.
- Local screenshot evidence: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-lp-main-local.png`.
- Pushed commit `69f117b` (`Add main landmarks to static landing pages`) to `main`; GitHub Actions run `26808290547` passed install, regression tests, lint, build, Vercel pull, and production deploy.
- Vercel production deployment `dpl_FweyVh2CSK8SqsFWKL3y1FD9KNp8` is Ready and aliased to `https://barmatrix.app`.
- Live HTTP verification passed for the four changed LPs: HTTP 200, CSP present, exactly one `<main>` and one `</main>`, and expected titles.
- Live in-app browser verification passed for the four changed LPs: each rendered `mainCount=1`, meaningful H1/title, no desktop overflow, no visible raw runtime/API/CSP text, and no fresh browser warning/error logs.
- Live screenshot evidence: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-lp-main-live-69f117b.png`.
- Production health/log checks passed: API health returned `{"ok":true,"db":"up"}`, Vercel logs showed only normal info rows in the check window, and Hostinger API `stderr.log` was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- Signed-in browser checks for `/sign-in` and `/sign-up` redirect to home because the browser session is already authenticated; unauthenticated HTTP checks still returned the auth pages with `noindex, nofollow`.
- C3 Coach/Mastery measurement remains limited by missing authored C3 annotation/tagging content tracked separately in `auronpep/barmatrix-api#3`.

# Live Dashboard Utility Routes Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify signed-in dashboard utility routes that combine live dashboard data with client-only state: `/dashboard/final-sprint` and `/dashboard/mastery`.
- Exercise only safe interactions; avoid Red Zone route navigation/source and production mutations beyond local browser storage.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Browser-verify `/dashboard/final-sprint` on production for meaningful content, one `<main>`, no overflow, no raw runtime/API/CSP text, and fresh console health.
- [x] Exercise the Final Sprint exam-date control and verify the plan state updates without runtime errors.
- [x] Browser-verify `/dashboard/mastery` on production for meaningful content, one `<main>`, no overflow, no raw runtime/API/CSP text, and fresh console health.
- [x] Trace and fix any reproduced non-Red-Zone root cause with focused regression coverage where practical.
- [x] Run relevant tests, lint, build, and production health/log checks.
- [x] Record review notes, verification evidence, and remaining risk.

## Review

- Live signed-in browser verification passed for `/dashboard/final-sprint`: meaningful H1/content, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh `barmatrix.app` warning/error logs.
- The Final Sprint page's own `Use preview date` button changed the plan to `Sprint active with 10 days left.`, set the input to `2026-06-12`, removed the missing-date prompt, kept one `<main>`, and produced no fresh browser warning/error logs.
- Direct synthetic filling of the native date input changed the DOM input value but did not advance visible React state in the Browser runtime. The page-owned button path passed, and no real user-facing source defect was confirmed from that synthetic-only signal.
- Live signed-in browser verification passed for `/dashboard/mastery`: meaningful H1/content, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh `barmatrix.app` warning/error logs.
- Mastery's `Refresh with diagnostic` link navigated to `/diagnostic`, rendered `Don't guess. Diagnose.`, kept one `<main>`, and produced no fresh browser warning/error logs.
- No non-Red-Zone source defect was reproduced in this slice, so no implementation patch or new regression test was added.

## Verification

- Focused local check: `node --test tests\page-main-landmarks.test.ts` passed 1/1.
- Full local non-Red-Zone test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 55/55.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check -- tasks\todo.md tasks\evidence.md` passed with only normal CRLF warnings.
- Production unauthenticated HTTP probes for `/dashboard/final-sprint` and `/dashboard/mastery` returned expected 307 redirects to `/sign-in?...` with CSP present.
- Production health/log checks passed: API health returned `{"ok":true,"db":"up"}`, Vercel logs showed normal info request rows for the dashboard routes and no filtered error/CSP entries, and Hostinger API `stderr.log` was empty.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-dashboard-final-sprint-preview-button-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-dashboard-mastery-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-dashboard-mastery-diagnostic-nav-live-20260602.png`

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- The in-app Browser tab did not expose a viewport-resize capability, so this slice used the current desktop viewport (`873x912`) rather than a separate mobile browser pass.

# Live Practice And Timed Sets Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify the signed-in paid-user study flows for `/practice` and `/timed-sets` from the rendered UI.
- Exercise safe question-flow interactions where available, while avoiding Red Zone route/source and unnecessary production mutations.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Inspect local practice/timed-set source and existing tests to understand expected UI/API behavior.
- [x] Browser-verify `/practice` on production for meaningful content, one `<main>`, no overflow, no raw runtime/API/CSP text, and fresh console health.
- [x] Exercise a safe `/practice` question-flow interaction if the live UI presents one.
- [x] Browser-verify `/timed-sets` on production for meaningful content, one `<main>`, no overflow, no raw runtime/API/CSP text, and fresh console health.
- [x] Exercise a safe `/timed-sets` interaction if the live UI presents one.
- [x] Trace and fix any reproduced non-Red-Zone root cause with focused regression coverage where practical.
- [x] Run relevant tests, lint, build, and production health/log checks.
- [x] Record review notes, verification evidence, and remaining risk.

## Review

- Live signed-in browser verification passed for `/practice`: meaningful H1/content, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh `barmatrix.app` warning/error logs.
- From `/practice`, selected the `Evidence` subject, loaded question `1/20`, selected answer `A`, submitted, and rendered the Wrong Answer Forensics card with `Correct answer: C` and a `Next question` control.
- Live signed-in browser verification passed for `/timed-sets`: meaningful H1/content, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh `barmatrix.app` warning/error logs.
- From `/timed-sets`, started a 17-question mixed set, loaded question `1/17`, selected answer `A`, submitted, and rendered the Wrong Answer Forensics card with why-it-looked-right/why-it-fails text, an assigned repair drill, and a `Next timed question` control.
- Mobile viewport smoke at `390x844` passed for `/practice` and `/timed-sets`: one `<main>`, no horizontal overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh browser warning/error logs.
- No non-Red-Zone source defect was reproduced in this slice, so no implementation patch or new regression test was added.

## Verification

- Focused local checks: `node --test tests\practice-subject-response.test.ts tests\api-client-drills.test.ts` passed 4/4.
- Full local non-Red-Zone test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 55/55.
- `npm run lint` passed.
- `npm run build` passed.
- Production HTTP probes for `/practice` and `/timed-sets` returned HTTP 200 with CSP present.
- Production health/log checks passed: API health returned `{"ok":true,"db":"up"}`, Vercel logs showed normal info request rows for the study routes and no filtered error/CSP entries, and Hostinger API `stderr.log` was empty.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-practice-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-timed-sets-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-practice-mobile-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-timed-sets-mobile-live-20260602.png`

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- This slice submitted one live practice attempt and one live timed-set attempt on the paid test account. It did not complete all 20 practice questions or all 17 timed-set questions.

# Live Diagnostic Session Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify the C3/placement diagnostic session flow from the rendered UI: landing/session start, question screen, one answer submit, and post-submit feedback state.
- Exercise only one live attempt unless a defect requires narrower reproduction.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Inspect diagnostic session source and existing tests to understand expected UI/API behavior.
- [x] Browser-verify `/diagnostic/session` on production for meaningful content, one `<main>`, no overflow, no raw runtime/API/CSP text, and fresh console health.
- [x] Start a live diagnostic session from the UI and verify question rendering.
- [x] Submit one safe diagnostic answer and verify the post-submit feedback or navigation state.
- [x] Run a mobile viewport smoke for the diagnostic entry/question state where practical.
- [x] Trace and fix any reproduced non-Red-Zone root cause with focused regression coverage where practical.
- [x] Run relevant tests, lint, build, deployment, production health/log checks, and post-deploy browser verification.
- [x] Record review notes, verification evidence, and remaining risk.

## Review

- Live diagnostic entry, session start, question page, one answer submission, feedback state, and mobile smoke checks passed before the patch except for one confirmed source defect: the standalone `/diagnostic/session/[sessionId]` question/feedback page rendered no page-level `<h1>`.
- Root cause: `app/diagnostic/session/[sessionId]/page.tsx` used a section as its top-level content wrapper and only rendered progress/question/feedback subcontent, leaving the route without a stable page identity heading in question and feedback states.
- Small clean change: added one `sr-only` H1, `C3 Placement Assessment`, inside the session route content wrapper. This preserves visual layout while restoring route identity for accessibility and DOM audit checks.
- Added a focused regression test that failed before the source change and passes after it.
- Localhost browser verification after the patch used the UI start flow, created session `e790b043-39d9-48ae-9af0-9405e0ce47a8`, rendered question 1 of 18, and verified exactly one H1 with text `C3 Placement Assessment`, one `<main>`, no horizontal overflow, no raw runtime text, no dev dialog overlay, and no browser logs.
- Pushed app commit `ad3b613` and deployed production via Vercel deployment `dpl_2vfNbR1ibYZfJS6SyZ6EkmJmA7RX`, aliased to `https://barmatrix.app`.
- Live post-deploy browser verification created session `537688fe-c245-4d25-9fd1-d916148d9d08`, rendered question 1 of 18, and verified exactly one H1 with text `C3 Placement Assessment`, one `<main>`, no horizontal overflow, no raw runtime/API text, no framework overlay, and no browser logs.

## Verification

- Red regression: `node --test tests\diagnostic-session-heading.test.ts` failed before the source change because the session page had no H1.
- Focused green checks: `node --test tests\diagnostic-session-heading.test.ts tests\placement-diagnostic-contract.test.ts tests\malformed-route-errors.test.ts` passed 4/4.
- Full non-Red-Zone test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 56/56.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check -- "app/diagnostic/session/[sessionId]/page.tsx" tests/diagnostic-session-heading.test.ts tasks/todo.md tasks/evidence.md` passed with only normal CRLF warnings.
- Local browser verification screenshot: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-diagnostic-session-localhost-origin-ui-start-20260602.png`.
- Deployment:
  - Removed stale Vercel deployment `dpl_9PcRHv7mh25yorddN9uTLfgvVGSa`, which was stuck initializing from an earlier deploy and blocking the queue.
  - Clean worktree deploy from commit `ad3b613` completed; `https://barmatrix.app` now resolves to `dpl_2vfNbR1ibYZfJS6SyZ6EkmJmA7RX`.
- Live production checks:
  - `GET https://api.barmatrix.app/health?diagnostic_heading_audit=ad3b613` returned `{"ok":true,"db":"up"}`.
  - Vercel logs for the post-deploy window showed normal 200 rows for `/diagnostic/session` and `/diagnostic/session/537688fe-c245-4d25-9fd1-d916148d9d08`; the error/CSP filter found no actionable entries.
  - Hostinger API `stderr.log` was empty.
- Live post-deploy screenshot: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-diagnostic-session-live-postdeploy-ad3b613.png`.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- A separate local `npx next start` attempt on ports `3017` and `3018` accepted sockets but did not answer HTTP requests. The existing authenticated `localhost:3000` app server and the successful production build were used for local browser/source verification instead.

# Live Boot Camp Session Routes Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify signed-in paid-user boot-camp surfaces from the rendered UI: `/boot-camps`, a boot-camp detail route, a live session route, a day route when available, and the mastery route.
- Exercise safe navigation and one low-impact interaction where available; avoid completing large workflows or changing Red Zone state.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Inspect boot-camp source and existing tests to understand expected UI/API behavior.
- [x] Browser-verify `/boot-camps` on production for meaningful content, one `<main>`, no overflow, no raw runtime/API/CSP text, and fresh console health.
- [x] Navigate into a boot-camp detail route and verify state.
- [x] Navigate into a live boot-camp session route and verify state.
- [x] Navigate into a day route or mastery route where exposed by the UI and verify state.
- [x] Trace and fix any reproduced non-Red-Zone root cause with focused regression coverage where practical.
- [x] Run relevant local tests, lint, build, and diff hygiene checks.
- [x] Deploy and verify the day-route heading on production.
- [x] Run production health/log checks and record final evidence.

## Review

- Live signed-in browser verification passed for `/boot-camps`, a boot-camp detail page, and a live session hub: each rendered meaningful content, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh `barmatrix.app` warning/error logs.
- Starting the first boot camp reused/created session `f5cb4b5d-dddb-4794-8685-c5a1cd4f4bb7` and exposed Day 1 through the session hub.
- The Day 1 runner loaded a real question state with answer choices and submit controls, but the route rendered `h1Count=0`.
- Root cause: boot-camp day/mastery runner pages delegate the visible title/progress to `QuestionRunner`, whose route title is rendered as a paragraph. The root layout owns the only `<main>`, so runner routes still need their own stable page-level heading.
- Added `sr-only` route headings for boot-camp day and mastery running/loading states without changing the visible layout.
- Added `tests/boot-camp-runner-headings.test.ts` to lock the heading contract.
- Pushed commit `f46af99` (`Add boot camp runner headings`) to `main`; GitHub Actions run `26812106019` passed install, regression tests, lint, build, Vercel pull, and production deploy.
- Vercel production deployment `barmatrix-p7gj4kndv-sunnylee.vercel.app` was Ready and aliased to `https://barmatrix.app`.
- Live post-deploy browser verification of the Day 1 route showed `h1Count=1`, `h1Text="Boot Camp Day 1"`, one `<main>`, the expected question runner, four answer choices, enabled submit after selecting answer `B`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh production browser warnings/errors.

## Verification

- Red regression: `node --test tests\boot-camp-runner-headings.test.ts` failed before the source change because the boot-camp day runner page had no route-level H1.
- Focused local checks: `node --test tests\boot-camp-runner-headings.test.ts tests\boot-camp-mastery-resume.test.ts tests\api-client-drills.test.ts tests\malformed-route-errors.test.ts tests\page-main-landmarks.test.ts` passed 7/7.
- Full local non-Red-Zone test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 57/57.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check -- "app/boot-camps/sessions/[session_id]/days/[day]/page.tsx" "app/boot-camps/sessions/[session_id]/mastery/page.tsx" tests/boot-camp-runner-headings.test.ts tasks/todo.md tasks/evidence.md` passed with only normal CRLF warnings.
- GitHub Actions production deploy run `26812106019` passed.
- Production API health returned `{"ok":true,"db":"up"}` for `https://api.barmatrix.app/health?bootcamp_heading_audit=f46af99`.
- Vercel log capture for the post-deploy window had `NO_ERROR_OR_CSP_MATCHES`; visible rows around the route were normal 200s.
- Hostinger API `stderr.log` was empty.
- Screenshot evidence: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-boot-camp-day-live-postdeploy-f46af99.png`.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- A localhost browser check of the patched day URL fell into the signed-out `Day unavailable` state, so active-runner rendered verification used production after deployment.
- This slice did not complete the boot-camp day or unlock the mastery check; it verified the catalog/detail/session/day route surfaces and source/test coverage for the mastery running branch.

# Live Foundations And Coach Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify signed-in paid-user Foundations/Method and C3 Coach surfaces from the rendered UI.
- Exercise safe controls that do not unnecessarily submit production attempts: Foundations hub, lesson navigation, reveal/self-check state, and Coach start/availability state.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Inspect Foundations/Coach source and existing tests to understand expected UI/API behavior.
- [x] Browser-verify `/foundations` on production for meaningful content, one `<main>`, no overflow, no raw runtime/API/CSP text, and fresh console health.
- [x] Navigate into a Foundations lesson and verify content plus safe reveal-key control.
- [x] Browser-verify `/coach` on production for meaningful content, one `<main>`, no overflow, no raw runtime/API/CSP text, and fresh console health.
- [x] Exercise the Coach start/availability path without submitting an answer.
- [x] Trace any reproduced non-Red-Zone root cause with focused regression coverage where practical.
- [x] Run relevant tests, lint/build as needed, production health/log checks, and record final evidence.

## Review

- Live signed-in browser verification passed for `/foundations`: rendered H1 `The Method: Cut → Clash → Call — the BarMatrix wrong-answer method`, 14 lesson rows, course progress `0/14 lessons · 0%`, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh `barmatrix.app` browser warning/error logs.
- Live signed-in browser verification passed for `/foundations/lesson-01`: rendered H1 `The One Idea: TRUE and RESPONSIVE`, the full lesson body, five `Reveal key` controls, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh browser warning/error logs.
- Clicking the first lesson `Reveal key` button changed that control to `Hide key`, kept the same H1 and single `<main>`, and produced no fresh production browser warning/error logs. This was client-side only; no lesson completion or self-check persistence was triggered.
- Live signed-in browser verification passed for `/coach`: rendered H1 `The C3 Coach`, one `Start coaching` button, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh browser warning/error logs.
- Clicking `Start coaching` resolved to the expected `Not measurable yet` state for the current paid account, with links back to The Method/diagnostic guidance, no raw API text, no overflow, and no fresh browser warning/error logs.
- No non-Red-Zone source defect was reproduced in this slice, so no implementation patch or new regression test was added.

## Verification

- Focused local checks: `node --test tests\coach-main-landmark.test.ts tests\auth-401-state.test.ts tests\page-main-landmarks.test.ts` passed 4/4.
- Full local non-Red-Zone test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 57/57.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check -- tasks/todo.md tasks/evidence.md` passed with only normal CRLF warnings.
- Production HTTP probes for `/foundations`, `/foundations/lesson-01`, and `/coach` returned HTTP 200 with CSP present and no broad raw-error markers.
- Production API health returned `{"ok":true,"db":"up"}` for `https://api.barmatrix.app/health?foundations_coach_audit=20260602`.
- Vercel log capture showed normal 200 rows for `/foundations`, `/foundations/lesson-01`, and `/coach`; the error/CSP-only filter returned `NO_ERROR_OR_CSP_MATCHES`.
- Hostinger API `stderr.log` was empty.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-foundations-hub-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-foundations-lesson-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-foundations-lesson-reveal-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-coach-live-initial-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-coach-live-started-20260602.png`

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- This slice did not mark a Foundations lesson complete, toggle signed-in drill self-check persistence, submit a Coach answer, or force Method completion for Coach question availability. It verified the current live paid-account state and safe non-submitting controls.

# Live Subject And Drill Entry Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify the signed-in paid-user drill catalog, seven subject quick-drill landing pages, and seven subject bank pages from the rendered UI.
- Avoid starting extra drill/practice queues or submitting production attempts unless a concrete defect requires deeper reproduction.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Inspect subject/drill source and existing tests to understand expected UI/API behavior.
- [x] Browser-verify `/drills` and all `/drills/<subject>` quick-drill landing pages on production.
- [x] Browser-verify all `/subjects/<subject>` bank pages on production.
- [x] Probe live API subject and drill catalog contracts across all MBE subjects.
- [x] Trace and fix any reproduced non-Red-Zone root cause with focused regression coverage where practical.
- [x] Run relevant tests, lint/build as needed, production health/log checks, and record final evidence.

## Review

- Live signed-in browser verification covered 15 non-Red-Zone subject/drill routes: `/drills`, seven quick-drill entries, and seven subject bank pages.
- Every route rendered one `<main>`, one H1, meaningful body content, no desktop horizontal overflow at the current in-app browser viewport, no raw runtime/API/CSP text, no framework overlay, and no stale loading state.
- The `/drills` catalog tabs were exercised without starting a drill: `Catalog` selected the catalog cards and removed the prescribed review-misses list; `Prescribed for you` restored the review/resume state. No fresh browser warning/error logs appeared.
- Live API probes returned HTTP 200 for Evidence, Criminal Law, Criminal Procedure, Contracts, Civil Procedure, Constitutional Law, Real Property, and Torts by-subject endpoints with nonzero totals. The drill catalog returned HTTP 200 with 50 tensions and 50 traps. API health returned `{"ok":true,"db":"up"}`.
- No non-Red-Zone source defect was reproduced in this slice, so no implementation patch or new regression test was added.

## Verification

- Focused local checks passed 9/9:
  - `node --test tests\api-client-drills.test.ts tests\criminal-law-drill-subjects.test.ts tests\mobile-content-overflow.test.ts tests\practice-subject-response.test.ts tests\sitemap-static-surface.test.ts`
- Full local non-Red-Zone test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 57/57.
- `npm run lint` passed.
- `npm run build` passed.
- Production Vercel log filter returned `NO_ERROR_CSP_OR_AUDIT_MATCHES`.
- Hostinger API `stderr.log` was empty.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-drill-catalog-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-drill-evidence-entry-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-subject-evidence-live-20260602.png`

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- This slice did not start a new production drill/practice queue or submit any production answer. It verified entry states, safe drill catalog tab switching, live API contracts, and current paid-account rendering.

# Live Account Checkout Auth Transactional Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify signed-in paid-user account and checkout-return surfaces from rendered production UI, including the missing/unowned checkout session edge.
- Verify checkout entry, pricing CTA surface, and auth pages without creating a new Stripe checkout or billing portal session unless a concrete defect requires deeper reproduction.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Inspect account/checkout/auth source and existing regression tests.
- [x] Browser-verify `/account`, `/account?checkout_session_id=<missing-test-id>`, `/checkout/success`, and `/checkout/success?checkout_session_id=<missing-test-id>` on production.
- [x] Browser-verify `/checkout`, `/pricing`, `/sign-in`, and `/sign-up` transactional entry states on production without initiating checkout.
- [x] Probe live API/account checkout status boundaries and production logs where safe.
- [x] Trace and fix any reproduced non-Red-Zone root cause with focused regression coverage where practical.
- [x] Run relevant tests, lint/build as needed, production health/log checks, and record final evidence.

## Review

- Live pre-patch production reproduction found one non-Red-Zone defect on `/account?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789`: the paid account rendered `Your BarMatrix access is active.` and also rendered `Checkout recovery` / `Recover enrollment` for the unrelated unresolved checkout session.
- Root cause: `EnrollmentRecoveryPanel` only considered `checkoutSessionId` and checkout-status fulfillment. It did not wait for or consult signed-in dashboard enrollment state, so an unresolved session could show a recovery CTA even when the current account already had active access.
- Small clean change: `EnrollmentRecoveryPanel` now reads `useDashboard()`, waits while account status is pending, skips checkout-status polling when active access is already confirmed, and returns `null` for active accounts.
- Added a focused regression to `tests/api-client-billing-portal.test.ts`; it failed before the source change and passes after it.
- Other transactional surfaces in the pre-patch live matrix rendered coherent states: `/account`, checkout success missing-session states, `/checkout`, `/pricing?checkout=cancelled`, and signed-in redirects from `/sign-in` and `/sign-up` to the home page. No checkout or billing portal session was created.

## Verification

- Red regression: `node --test tests\api-client-billing-portal.test.ts` failed before the source change on the new active-account recovery guard.
- Focused checks passed 13/13:
  - `node --test tests\api-client-billing-portal.test.ts tests\account-entitlement-state.test.ts tests\checkout-success-state.test.ts tests\auth-form-fallback.test.ts tests\noindex-transactional-pages.test.ts`
- Full local non-Red-Zone test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 58/58.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check -- app\account\enrollment-recovery.tsx tests\api-client-billing-portal.test.ts tasks\todo.md tasks\evidence.md` passed with only normal CRLF warnings.
- Localhost browser caveat: `http://localhost:3000/account?checkout_session_id=...` rendered `Account status unavailable`, so it could not prove the active-account branch locally. Production signed-in verification is required after deployment.
- Pre-patch production screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-account-missing-session-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-checkout-success-missing-session-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-checkout-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-sign-in-live-20260602.png`
- Local post-patch screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-account-missing-session-local-guard-20260602.png`
- Production deploy run `26814257016` completed successfully for commit `c763c0b`.
- Live post-deploy browser verification of `/account?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789&post_deploy_account_guard=c763c0b` passed: active access remained visible, checkout recovery was absent, one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and no fresh browser warnings/errors.
- Production API health returned `{"ok":true,"db":"up"}` for `https://api.barmatrix.app/health?account_recovery_guard=c763c0b`.
- Vercel logs showed a normal 200 row for `/account` and no error/CSP matches in the post-deploy window.
- Hostinger API `stderr.log` was empty.
- Production post-deploy screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-account-missing-session-live-postdeploy-c763c0b.png`

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- This slice intentionally avoids creating a new Stripe checkout session or billing portal session unless a concrete defect requires it.
- This slice did not click `Recover enrollment`, create a Stripe checkout session, or create a Stripe billing portal session.

# Live Tensions And Traps Knowledge Surface Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify signed-in paid-user `/tensions`, representative `/tensions/<slug>`, `/traps`, and representative `/traps/<slug>` production surfaces.
- Exercise safe catalog/navigation/profile/history rendering only; avoid submitting production attempts or changing user progress unless a concrete defect requires deeper reproduction.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone work remains separate and untouched.
- [x] Inspect Tensions/Traps source and existing regression tests to understand expected UI/API behavior.
- [x] Browser-verify `/tensions` and one representative `/tensions/<slug>` on production.
- [x] Browser-verify `/traps` and one representative `/traps/<slug>` on production.
- [x] Probe safe live API/production health/log signals for Tensions and Traps.
- [x] Trace and fix any reproduced non-Red-Zone root cause with focused regression coverage where practical.
- [x] Run relevant tests, lint/build as needed, production health/log checks, and record final evidence.

## Review

- Live signed-in browser verification covered `/tensions`, `/tensions/cp_diversity_amount_vs_supplemental_jurisdiction`, `/traps`, and `/traps/undocumented_ordinary_alienage`.
- The Tensions catalog rendered 267 tension links, the `Curated only` filter narrowed to 84 links, and `All tensions` restored the full catalog. The representative detail rendered 95 targeted questions with 12 initial examples; the safe `Load more` action advanced the button from `Load more (12/95)` to `Load more (24/95)`.
- The Traps catalog rendered 61 first-page trap links with the signed-in `Your trap profile` panel. The `Official only` filter narrowed to 18 trap links, and `All traps` restored the catalog. The representative detail rendered signed-in `Your history`; opening the first example expanded the wrong-choice explanation without navigation or state mutation.
- Every audited route/state rendered one `<main>`, one H1, meaningful body content, no desktop horizontal overflow in the in-app browser viewport, no raw runtime/API/CSP text, no framework overlay, and no fresh browser warning/error logs.
- Live API probes returned HTTP 200 contracts for the public catalog/detail/question endpoints. API health returned `{"ok":true,"db":"up"}`.
- No non-Red-Zone source defect was reproduced in this slice, so no implementation patch or new regression test was added.

## Verification

- Focused local checks passed 8/8:
  - `node --test tests\mobile-content-overflow.test.ts tests\sitemap-static-surface.test.ts tests\page-main-landmarks.test.ts tests\static-landing-pages.test.ts`
- Full local non-Red-Zone test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 58/58.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check -- tasks\todo.md tasks\evidence.md` passed with only normal CRLF warnings.
- Production Vercel log filter returned `NO_ERROR_CSP_OR_500_MATCHES`; normal 200 rows appeared for Traps routes.
- Hostinger API `stderr.log` was empty.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-tensions-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-tension-detail-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-traps-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-trap-detail-live-20260602.png`

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- This slice did not submit production answers or start practice from the Tension/Trap detail CTAs.
- The live Traps data currently reports `misconception_count: 0`; the UI handles this state, but authored misconception taxonomy content remains a data/content question rather than a reproduced frontend defect.

# Live Trap Misconception Taxonomy Data Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Follow up on the live Trap Taxonomy data gap where `/api/traps` reports `misconception_count: 0` while the UI exposes a dedicated Misconception column.
- Use local project/runtime evidence only to determine whether this is an API/query defect, schema/content provisioning gap, or expected current data state.
- Avoid touching unrelated dirty API billing/admin/tension work unless the root cause requires a tightly scoped patch in a clean write path.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone app work remains separate and untouched.
- [x] Confirm API repo instructions/status before relying on or editing backend code.
- [x] Reproduce the zero-misconception condition from live UI/API and production runtime evidence.
- [x] Inspect app/API Trap Taxonomy source, tests, and local data assumptions.
- [x] Trace production data shape from safe aggregate queries without exposing secrets.
- [x] If a code defect is confirmed, add/update a failing regression test and make the smallest clean fix in a safe write path.
- [x] Run relevant app/API tests, lint/build, browser verification, production health/log checks, and record final evidence.

## Review

- Live signed-in Browser verification reproduced the zero-misconception state on `/traps?misconception_audit=20260602b`: the page rendered `The finite universe of MBE traps`, one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no framework overlay, and the Misconception column was present with no trap rows.
- The safe `Official only` interaction navigated to `/traps?official=1`; the architecture column narrowed to 17 traps, the Misconception column reported `0 TRAPS`, and the empty-column copy rendered once.
- Direct live API evidence matched the UI: `GET https://api.barmatrix.app/api/traps?misconception_audit=20260602b` returned 1,363 architecture traps, 0 misconception traps, and 17 official traps.
- Production aggregate evidence classified the root cause as content/data provisioning, not frontend rendering or API query logic: all 10,998 active wrong choices have valid `misconception_tags` JSON, but 0 active wrong choices have a non-empty `misconception_tags` array. Diagnostic rows also have 0 non-empty misconception arrays.
- The API query helpers already unnest `answer_choices.misconception_tags`, shape misconception rows correctly, and include misconception tags in detail/profile/history lookups. No alternate live `question_tags` trap/misconception dimension was found.
- No source patch or new regression test was added because encoding "zero misconception rows" as a failing application test would be testing missing authored data, not a code defect.

## Verification

- Browser verification:
  - `/traps?misconception_audit=20260602b` rendered one H1, one `<main>`, `Wrong-answer architecture`, `Misconception`, no overflow, no raw runtime text, no framework overlay, and no live misconception trap links.
  - `/traps?official=1` rendered `Official only` as the active filter, 17 architecture traps, `0 TRAPS` for Misconception, and `No traps in this column for the current filter.` once.
  - Clean production tab for `/traps?misconception_clean_console=20260602b` rendered one H1, one `<main>`, no overflow, and the empty Misconception column message. The only Browser warning object was inherited/stale and pointed at a localhost chunk URL, not the production Trap route.
- Live API/data checks:
  - `GET https://api.barmatrix.app/api/traps?misconception_audit=20260602b` returned 1,363 architecture traps, 0 misconception traps, and 17 official traps.
  - Production aggregate: active rows have 3,666 questions, 14,664 answer choices, and 10,998 wrong choices.
  - Production aggregate: active wrong choices have 10,368 non-empty `forensic_tags` arrays and 0 non-empty `misconception_tags` arrays.
  - Production aggregate: JSON_TABLE over active wrong-choice `forensic_tags` returned 10,368 tag rows and 2,983 distinct slugs; JSON_TABLE over `misconception_tags` returned 0 tag rows and 0 distinct slugs.
  - Production aggregate: no active `question_tags` dimensions matching trap/misconception/forensic/wrong were found.
  - Production status aggregate: active and diagnostic question statuses both have 0 wrong choices with non-empty `misconception_tags`.
  - `GET https://api.barmatrix.app/health?trap_misconception_audit=20260602b` returned `{"ok":true,"db":"up"}`.
  - Vercel log filter returned `NO_ERROR_CSP_OR_500_MATCHES`.
  - Hostinger API `stderr.log` was empty.
- Local checks:
  - `node --test tests\mobile-content-overflow.test.ts tests\sitemap-static-surface.test.ts tests\page-main-landmarks.test.ts tests\static-landing-pages.test.ts` passed 8/8.
  - `npx --no-install tsx --test src/lib/traps.test.ts src/lib/me-traps.test.ts` in `C:\barmatrix-api` passed 30/30.
  - `npm run lint` in `C:\barmatrix-app` passed.
  - `npm run build` in `C:\barmatrix-api` passed.
  - `npm run build` in `C:\barmatrix-app` passed.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-traps-misconception-data-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-traps-misconception-official-live-20260602.png`

## Remaining Risk

- Red Zone routes/source/tests remain out of scope for this pass.
- The production app currently has no authored misconception taxonomy content in `answer_choices.misconception_tags`; populating that column is a content/data pipeline task, not a frontend/API bug fix from the evidence gathered here.
- The API repo still has unrelated dirty billing/admin/tension work and is behind `origin/main` by 5 commits; it was inspected and tested but not modified.

# Live Foundations Certification Mutation Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Verify signed-in paid-user Foundations progress persistence, including self-check and lesson-complete mutations from the rendered UI.
- Verify the C3 Certification gate after Method completion and exercise one Certification runner submission if the gate unlocks.
- Use the paid test subscriber state intentionally; record any progress/certification side effects.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone app work remains separate and untouched.
- [x] Inspect Foundations, Coach, and Certification source/API behavior.
- [x] Browser-verify current Foundations and Certification state before mutation.
- [x] Exercise Foundations self-check and lesson completion from the live UI.
- [x] Complete remaining Method lessons if needed to verify Certification unlock.
- [x] Exercise one Certification competency start/submit flow if unlocked.
- [x] Trace and fix any reproduced non-Red-Zone root cause with focused regression coverage where practical.
- [x] Run relevant app/API tests, lint/build, production health/log checks, and record final evidence.

## Review

- Live Foundations pre-state showed `0/14 lessons`; the signed-in paid test subscriber then completed all 14 Method lessons from the rendered UI, and `/foundations` showed `14/14 lessons · 100%`.
- Live Certification unlocked after Method completion. M1 rendered key-free before submit, accepted radio selections, and rendered item-by-item grading after submit.
- Certification persistence is blocked by production schema provisioning: `cert_competency_results` does not exist, so the runner correctly shows `(NOT SAVED — SYNC PENDING)` and the scorecard remains `attempts 0`. Tracked as GitHub issue #5.
- Production C3 Coach has no tagged question coverage: `answer_choices.c3_mold_code` exists but has 0 populated active/diagnostic choices. Tracked as GitHub issue #6.
- Fixed the confirmed frontend copy bug: Coach now branches on API unavailable reasons and says `Coach coverage pending` for `no_tagged_items` / `c3_not_provisioned` instead of telling a completed-Method user to finish The Method.

## Verification

- Red regression: `node --test tests\coach-unavailable-reason-copy.test.ts` failed before the Coach client change and passed after it.
- Focused app checks passed 6/6:
  - `node --test tests\coach-unavailable-reason-copy.test.ts tests\coach-main-landmark.test.ts tests\certification-runner-locked-state.test.ts tests\certification-cta.test.ts`
- Full local non-Red-Zone app sweep passed 59/59 with `tests\red-zone-detail-params.test.ts` excluded.
- Relevant API checks passed 11/11:
  - `npx --no-install tsx --test src/routes/c3-coach.test.ts src/routes/certification.test.ts`
- `npm run lint` passed.
- `npm run build` passed.
- Production deploy run `26817049631` completed successfully for commit `a7cd6835688a9b4ceae3924dc1552c5ae060c25a`.
- Live post-deploy Browser verification of `/coach?coach_reason_fix=a7cd683b` passed: after `Start coaching`, the page rendered `Coach coverage pending`, included `C3 Coach is waiting on tagged question coverage`, did not render `Finish The Method`, had one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, and no relevant browser warning/error logs.
- Production API health returned `{"ok":true,"db":"up"}`.
- Vercel production error log filter returned no logs for the deploy window.
- Hostinger API `stderr.log` was empty.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-foundations-complete-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-certification-unlocked-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-certification-m1-graded-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-certification-scorecard-after-m1-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-coach-coverage-pending-live-postdeploy-a7cd683.png`

## Remaining Risk

- Red Zone routes/source/tests remain out of scope for this pass.
- Production Certification attempts will not persist until issue #5 provisions `cert_competency_results`.
- Production C3 Coach cannot serve adaptive questions until issue #6 populates C3-tagged question coverage.
- This slice intentionally completed the paid test subscriber's Method progress and submitted M1 grading attempts; those M1 attempts were not persisted because the production certification-results table is absent.

# Live Certification Persistence Provisioning Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Resolve the production Certification persistence gap tracked as GitHub issue #5.
- Use existing deployed API route contracts and live DB conventions; avoid unrelated dirty API/app work.
- Verify from the rendered paid-user UI that a new Certification submission persists and the scorecard attempt count updates.

## Plan

- [x] Confirm dirty Red Zone app work and unrelated dirty API work remain separate and untouched.
- [x] Inspect API Certification source and live DB schema conventions.
- [x] Provision only the missing live Certification persistence tables needed by the deployed route contract.
- [x] Browser-verify a live Certification competency submission persists.
- [x] Verify backing DB rows, API health, Hostinger stderr, Vercel logs, and focused app/API tests.
- [x] Close GitHub issue #5 with the verification receipt.

## Review

- Root cause was production schema provisioning, not app rendering: `cert_competency_results` and `cert_sessions` were absent while the deployed Certification route already handled and wrote those tables.
- Applied idempotent live DDL for `cert_sessions` and `cert_competency_results` using existing production conventions: InnoDB, `utf8mb4_unicode_ci`, `char(36)` student ids, `datetime(6)` timestamps, foreign keys to `students`, and JSON validity checks for `per_item`.
- Live paid Browser verification submitted M2 after the schema provisioning. The graded result no longer displayed `(NOT SAVED — SYNC PENDING)`, and the scorecard showed `M2 ... attempts 1`.
- Production DB aggregate confirmed one `cert_sessions` row and one `cert_competency_results` row for the hashed paid test subscriber, with `competency_id='M2'`, `attempts_count=1`, and valid JSON `per_item`.
- Closed GitHub issue #5 as completed.

## Verification

- API focused check passed 7/7:
  - `npx --no-install tsx --test src/routes/certification.test.ts`
- App focused check passed 4/4:
  - `node --test tests\certification-runner-locked-state.test.ts tests\certification-cta.test.ts`
- Live Browser verification:
  - `/certification/M2?cert_persist_verify=20260602a` rendered key-free before submit, one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, and no relevant browser logs.
  - The graded M2 result rendered `SCORE 1`, no `(NOT SAVED — SYNC PENDING)` marker, one H1, one `<main>`, no desktop overflow, and no raw runtime/API/CSP text.
  - `/certification?cert_persist_verify=20260602a_scorecard` rendered `M2 ... attempts 1`, one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, and no relevant browser logs.
- Production health/logs:
  - `GET https://api.barmatrix.app/health?cert_persist_verify=20260602a` returned `{"ok":true,"db":"up"}`.
  - Vercel production error and `cert_persist_verify` log filters returned no logs for the verification window.
  - Hostinger API `stderr.log` was empty.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-certification-m2-persisted-live-20260602.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-certification-scorecard-m2-attempt-live-20260602.png`

## Remaining Risk

- Red Zone routes/source/tests remain out of scope for this pass.
- This slice added one live M2 Certification attempt for the paid test subscriber; it intentionally did not pass all ten competencies.
- Production C3 Coach still cannot serve adaptive questions until issue #6 populates C3-tagged question coverage.

# Live C3 Coach Tagged Coverage Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Investigate the production C3 Coach tagged-question coverage gap tracked by issue #6.
- Use only local source/runtime evidence to decide whether this is a code defect, schema issue, or content/data provisioning gap.
- Apply a live/content fix only if an authoritative local C3 tagging source exists; do not guess classifications.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone app work remains separate and untouched.
- [x] Inspect C3 Coach API/app source, query helpers, tests, and local C3 content assets.
- [x] Query live production C3 schema/data aggregates safely.
- [x] Determine whether an authoritative C3 tagging/backfill source exists locally.
- [x] Decide whether a safe provisioning change exists and verify the current Coach behavior.
- [x] Run relevant app/API tests, lint/build as needed, production health/log/browser checks, and record evidence.

## Review

- Skipped Red Zones per the user's instruction; existing Red Zone route/test changes remain untouched.
- API source behavior requires both `c3_annotations` rows with `PASS`/`FORK_OR_SPLIT` and active questions with answer choices carrying `c3_mold_code` before Coach can choose a candidate.
- Production still has the C3 deck/reference layer (`c3_cards=135`, `c3_molds=13`) but no measurement/tagging layer: `c3_annotations=0`, `answer_choices.c3_mold_code=0`, `answer_choices.c3_architecture=0`, `answer_choices.c3_filter_broken=0`, and `student_c3_srs=0`.
- The local engineering asset search found schema/reference/deck/QA-gate files only. It did not find validated `c3_annotations` rows or `answer_choices.c3_mold_code` backfill content.
- No source-code root cause or safe local data fix was found. The blocker remains missing authored/validated C3 tagging content, tracked in `auronpep/barmatrix-api#3`.
- Live paid Browser verification confirmed `/coach` fails soft: after `Start coaching`, it renders `Coach coverage pending` and no question runner.
- Updated `auronpep/barmatrix-app#6` with the refreshed production counts, browser verification, checks run, and pointer to the API content-backfill owner issue.

## Verification

- Live API:
  - `GET https://api.barmatrix.app/api/c3/deck?coach_coverage_audit=20260602c` returned HTTP 200 with 135 cards.
  - `GET https://api.barmatrix.app/health?coach_coverage_audit=20260602c` returned `{"ok":true,"db":"up"}`.
- Production DB aggregate from Hostinger app context:
  - `c3_cards=135`
  - `c3_molds=13`
  - `c3_annotations=0`
  - `answer_choices.c3_mold_code` populated rows: `0` across 14,736 active/diagnostic choices
  - `answer_choices.c3_architecture` populated rows: `0`
  - `answer_choices.c3_filter_broken` populated rows: `0`
  - `student_c3_srs=0`
  - orphan mold tags: `0`
- Browser verification:
  - `/coach?coach_coverage_audit=20260602c` rendered one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, and no relevant browser warning/error logs.
  - After clicking `Start coaching`, the page rendered `Coach coverage pending`, omitted `Finish The Method`, and did not render a question runner.
- Local checks:
  - App `node --test tests\coach-unavailable-reason-copy.test.ts tests\coach-main-landmark.test.ts` passed 2/2.
  - API `npx --no-install tsx --test src\routes\c3-coach.test.ts src\routes\c3.test.ts src\lib\c3-queries.test.ts` passed 10/10.
  - App `npm run lint` passed.
  - App `npm run build` passed.
  - API `npm run build` passed.
- Production logs:
  - Vercel logs showed normal `/coach` HTTP 200 rows and no matching error/CSP/500 signals.
  - Hostinger API `stderr.log` was empty.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-c3-coach-coverage-pending-live-20260602c.png`

## Remaining Risk

- Red Zone routes/source/tests remain out of scope for this pass.
- C3 Coach and C3 Mastery cannot become measured until authored C3 annotation and per-choice mold-tag content exists and passes the QA gate.

# Live Trap Misconception Column Retirement Audit

## Scope

- Continue the live environment audit outside Red Zones.
- Resolve `auronpep/barmatrix-app#4` by retiring the visible empty Misconception taxonomy column when production has no authored misconception rows.
- Preserve future behavior: if `misconception_count` becomes non-zero, the Misconception column should render again.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone app work remains separate and untouched.
- [x] Inspect issue #4, Trap source/tests, and relevant local Next.js docs.
- [x] Reproduce the live zero-misconception UI/API state.
- [x] Add a failing regression for conditional Misconception column rendering.
- [x] Apply the smallest page change to hide the empty dimension without hiding future content.
- [x] Run focused tests, lint/build, and local build checks.
- [x] Deploy, run live browser verification, production health/log checks.
- [x] Record final evidence and update/close issue #4 if verified.

## Review

- Live production reproduction confirmed `/traps` rendered a Misconception H2 and empty-column copy even though the live API returned `misconception_count=0`.
- Production DB aggregate confirmed the source data state: 11,052 active/diagnostic wrong choices have valid `misconception_tags` JSON, but 0 have non-empty arrays.
- Added `tests/trap-misconception-column.test.ts`; it failed before the page change because there was no API-total gate for the Misconception dimension.
- Changed `app/traps/page.tsx` so the Misconception dimension is shown only when `catalog.totals.misconception_count > 0`. The intro copy no longer mentions misconceptions when that dimension has no rows.
- The change preserves future content behavior: if the API starts returning non-zero misconception totals, the Misconception column and copy render again.

## Verification So Far

- Red regression:
  - `node --test tests\trap-misconception-column.test.ts` failed before the page change.
- Local green checks:
  - `node --test tests\trap-misconception-column.test.ts` passed 1/1.
  - `node --test tests\mobile-content-overflow.test.ts tests\sitemap-static-surface.test.ts tests\page-main-landmarks.test.ts` passed 5/5.
  - Full non-Red-Zone app sweep with `tests\red-zone-detail-params.test.ts` excluded passed 60/60.
  - `npm run lint` passed.
  - `npm run build` passed.

## Production Verification

- Pushed commit `18df351` to `main`; Deploy Vercel Production run `26818686043` passed.
- Live Browser verification of `/traps?misconception_retire_verify=18df351` passed: the page rendered one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, and no relevant browser warnings/errors.
- The verified live page retained `Wrong-answer architecture` and no longer rendered the `Misconception` heading, `misconception_tags` caption, `misconceptions they prey on` copy, or `No traps in this column for the current filter.`
- `GET https://api.barmatrix.app/health?misconception_retire_verify=18df351` returned `{"ok":true,"db":"up"}`.
- Hostinger API `stderr.log` was empty.
- Vercel logs showed normal `/traps` HTTP 200 rows and no matching error/CSP/500 signals.
- Closed `auronpep/barmatrix-app#4` with the verification receipt.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-traps-misconception-retired-live-18df351.png`

## Remaining Risk

- Red Zone routes/source/tests remain out of scope for this pass.
- If authored misconception taxonomy content is later added, the column will reappear automatically when `/api/traps` returns non-zero `totals.misconception_count`.

# Live Non-Red-Zone Completion Sweep

## Scope

- Continue the live environment audit while another session owns Red Zone review/debugging.
- Exclude `/red-zones`, `app/red-zones/**`, and Red Zone regression files.
- Verify representative public, paid, study, certification, drill, boot-camp, Trap, and Tension surfaces from the rendered production UI.
- Correlate UI state with production API health, fail-closed protected endpoint behavior, Hostinger API stderr, Vercel logs, and local non-Red-Zone regression checks.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm dirty Red Zone app work remains separate and untouched.
- [x] Browser-smoke representative production routes outside Red Zone.
- [x] Exercise the non-Red-Zone Coach start interaction.
- [x] Probe representative production API endpoints and protected unauthenticated behavior.
- [x] Check Hostinger API stderr, Vercel logs, and open non-Red-Zone GitHub issues.
- [x] Run local non-Red-Zone app tests plus relevant API tests, lint, typecheck, and builds.
- [x] Record sweep outcome and remaining blockers.

## Review

- Production Browser route smoke passed for 25 non-Red-Zone routes: `/`, `/pricing`, `/how-it-works`, `/about`, `/faq`, `/privacy`, `/terms`, `/partners`, `/waitlist`, `/dashboard`, `/account`, `/foundations`, `/mastery`, `/coach`, `/certification`, `/certification/M2`, `/drills`, `/drills/evidence`, `/practice`, `/timed-sets`, `/boot-camps`, `/traps`, `/traps/legally_true_but_irrelevant`, `/tensions`, and `/tensions/cp_diversity_amount_vs_supplemental_jurisdiction`.
- Each smoked route rendered one H1, one `<main>`, meaningful body content, no desktop horizontal overflow, no raw runtime/API/CSP text, and no relevant production browser warning/error logs.
- Coach `Start coaching` still fails soft into `Coach coverage pending`; no question runner renders because C3 tagging coverage is still absent.
- Public production API probes returned HTTP 200 for health, Traps, Tensions, C3 deck, C3 card `CIV-01`, Evidence questions, drills catalog, and boot camps.
- Protected direct API probes without auth returned HTTP 401 for `/api/me/c3` and `/api/me/c3/next`, which is the expected fail-closed behavior.
- No new non-Red-Zone code defect was reproduced in this sweep, so no source patch or new regression test was added.

## Verification

- App test sweep excluding Red Zone tests passed 60/60:
  - `node --test <all tests/*.test.ts except red-zone*>`
- API focused checks passed 17/17:
  - `npx --no-install tsx --test src\routes\c3-coach.test.ts src\routes\c3.test.ts src\lib\c3-queries.test.ts src\routes\certification.test.ts`
- App `npm run lint` passed.
- App `npm run build` passed.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- `GET https://api.barmatrix.app/health?nonred_sweep=736dec5` returned `{"ok":true,"db":"up"}`.
- Hostinger API `stderr.log` was empty.
- Vercel logs showed normal 200/304 route traffic for the audited pages and no matching error/CSP/500 signals.
- Open non-Red-Zone issues remain limited to the C3 content blocker pair:
  - `auronpep/barmatrix-app#6` - production C3 Coach has no tagged question coverage.
  - `auronpep/barmatrix-api#3` - backfill C3 annotations and answer-choice mold tags.
- Screenshot evidence:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-nonred-coach-coverage-live-736dec5.png`

## Remaining Risk

- Red Zone routes/source/tests remain out of scope for this pass because another session is reviewing/debugging them.
- C3 Coach and C3 Mastery still cannot become measured until authored C3 annotations and per-choice mold tags are populated and pass QA.
- The AM dashboard check-in failed again because no AM session matched `C:\barmatrix-app`.

# Live C3 Coverage Remediation Investigation

## Scope

- Continue the live environment audit outside Red Zone.
- Determine whether the remaining C3 Coach/Mastery blocker can be resolved from authoritative local source, database, or engineering assets.
- Do not invent C3 classifications or legal/instructional labels.
- Leave unrelated dirty app/API work untouched.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm current app/API worktree state and Red Zone exclusion.
- [x] Re-trace C3 Coach/Mastery API requirements and app behavior.
- [x] Search local app/API/BMO assets for authoritative C3 annotation or answer-choice mold-tag data.
- [x] Re-check live production C3 schema/counts and candidate rows.
- [x] Apply a smallest safe fix only if an authoritative backfill/provisioning source exists.
- [x] Verify with Browser, API checks, tests/builds/logs, and update task evidence.

## Review

- No authoritative local C3 backfill artifact was found. The remaining measured Coach/Mastery blocker is still missing authored `c3_annotations` rows and `answer_choices.c3_mold_code` tags, not a safe source-code backfill task.
- A separate frontend defect was reproduced on live `/mastery`: a Method-complete paid user with recorded attempts but zero measured C3-tagged attempts was told to finish The Method again.
- Root cause: `app/mastery/page.tsx` treated every unmeasured state the same and hard-coded the "Finish The Method" copy whenever `data.readiness.score === null`.
- Added `coveragePending = data.coverage.total_attempts > 0 && data.coverage.measured_attempts === 0` and changed the unmeasured panel to send coverage-pending users to practice instead of Foundations.
- Added `tests/mastery-coverage-pending-copy.test.ts`; it failed before the page change and passed after the page change.

## Verification So Far

- App non-Red-Zone test sweep passed 61/61 with Red Zone tests excluded:
  - `node --test <all tests/*.test.ts except red-zone*>`
- API focused C3/certification checks passed 17/17:
  - `npx --no-install tsx --test src\routes\c3-coach.test.ts src\routes\c3.test.ts src\lib\c3-queries.test.ts src\routes\certification.test.ts`
- App `npm run lint` passed.
- App `npm run build` passed.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- Local Browser verification of patched `/mastery` could not reach the paid state because the localhost Clerk session is currently signed out; it rendered the signed-out fallback instead.
- Pushed app commit `4476d1c` to `main`; Deploy Vercel Production run `26820039185` completed successfully.
- Production Browser verification of `/mastery?c3_mastery_copy_fix=4476d1c` passed for the paid user:
  - Rendered `Measured on 0 of your 107 attempts (0% C3-tagged)`.
  - Rendered `Tagged coverage pending`.
  - Rendered the C3 coverage-pending explanation and `Practice the bank` CTA.
  - Did not render the old `Finish The Method, then work questions` copy.
  - Had one H1, one `<main>`, no desktop horizontal overflow, no raw runtime/API/CSP text, and no relevant live `barmatrix.app` browser warning/error logs.
  - `GET https://api.barmatrix.app/health?c3_mastery_copy_fix=4476d1c` returned `{"ok":true,"db":"up"}`.
  - Hostinger API stderr could not be checked in this slice because both SSH attempts timed out.
  - Screenshot evidence:
    - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-c3-mastery-coverage-pending-live-viewport-4476d1c.png`

# Live Environment Config Sweep

## Scope

- Continue the full live debug goal outside Red Zone while Red Zone remains owned by another session.
- Verify production environment signals that can break the study program without a page-specific source bug: auth key class, security headers, API health/CORS, deploy logs, and browser console output.
- Do not print secrets. Only record key classes/prefixes and pass/fail signals.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm current worktree and open issue state.
- [x] Inspect live browser/runtime auth key class without exposing the key.
- [x] Inspect production response headers and CSP for app and API.
- [x] Check current production deploy logs for error-class signals.
- [x] Retry Hostinger API stderr access if available.
- [x] Record findings, fixes, or remaining gaps.

## Review

- Live HTML for `/dashboard?live_env_config_sweep=20260602a` contains a live Clerk public-key marker, does not contain a test-key marker, uses `clerk.barmatrix.app`, and does not contain development-key warning text.
- Live Browser dashboard check rendered paid dashboard content with one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, and no fresh `barmatrix.app` warning/error logs.
- Production app CSP had the expected security header set, no localhost/127/ws leakage, and no test key marker, but it still allowed `https://*.clerk.accounts.dev` in `script-src`, `connect-src`, `frame-src`, and `form-action` despite the live key/domain.
- Added a failing regression proving live-key production CSP should exclude Clerk test origins while test-key/development CSP still allows them.
- Changed `next.config.ts` to derive Clerk CSP origins from `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: always allow `https://clerk.barmatrix.app`, and allow `https://*.clerk.accounts.dev` only in development or when the configured public key starts with `pk_test_`.
- API health returned `{"ok":true,"db":"up"}` and API headers retained JSON content type, credentials support, `nosniff`, `SAMEORIGIN`, and HSTS.
- The latest deploy log filter showed no actionable error/failure/CSP rows; only routine Node/module warnings and successful regression rows.
- Hostinger API stderr could not be checked because SSH timed out again.

## Verification So Far

- Red regression:
  - `node --test tests\security-headers.test.ts` failed before the config change because live-key production CSP still contained `clerk.accounts.dev`.
- Local green checks:
  - `node --test tests\security-headers.test.ts` passed 4/4.
  - Full app non-Red-Zone test sweep with Red Zone tests excluded passed 63/63.
- App `npm run lint` passed.
- App `npm run build` passed.
- Pushed commit `2b4a5f2` to `main`; Deploy Vercel Production run `26820889447` completed successfully.
- Live post-deploy header verification of `/dashboard?live_env_csp_verify=2b4a5f2` passed:
  - HTTP 200 with CSP present.
  - `https://clerk.barmatrix.app` present.
  - `clerk.accounts.dev` absent.
  - `localhost`, `127.0.0.1`, and `ws://` absent.
  - `nosniff`, `SAMEORIGIN`, and `strict-origin-when-cross-origin` retained.
- Live post-deploy HTML verification confirmed live Clerk key marker present, test key marker absent, Clerk accounts-dev absent, and development-key warning text absent.
- Live signed-in Browser verification of `/dashboard?live_env_csp_verify=2b4a5f2` rendered the paid dashboard, one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, no sign-in fallback, and no fresh `barmatrix.app` browser warning/error logs.
- `GET https://api.barmatrix.app/health?live_env_csp_verify=2b4a5f2` returned `{"ok":true,"db":"up"}`.
- Deploy log for run `26820889447` showed the new CSP tests passing and no actionable error/failure/CSP rows.

# Live API Boundary Audit

## Scope

- Continue the full live debug goal outside Red Zone while Red Zone remains owned by another session.
- Verify API boundary behavior that protects or enables the web study program: production-origin CORS, hostile-origin CORS, preflight handling, unauthenticated protected routes, and safe headers.
- Treat `C:\barmatrix-api` as read-only unless local/runtime evidence reproduces a backend source defect, because that repo currently has unrelated dirty billing/admin/tension work.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm current app/API worktree state and open issue state.
- [x] Probe live API CORS and preflight from `https://barmatrix.app` and a hostile origin.
- [x] Inspect API CORS/auth/header source and tests.
- [x] Add or update a regression only if a backend source defect is reproduced.
- [x] Run relevant checks and record evidence.

## Review

- Live API CORS allows `https://barmatrix.app` and withholds CORS grants from `https://evil.example`.
- Live allowed-origin `GET /health` returned HTTP 200 with `Access-Control-Allow-Origin: https://barmatrix.app` and `Access-Control-Allow-Credentials: true`.
- Live hostile-origin `GET /health` returned HTTP 200 with no CORS grant.
- Live allowed-origin preflight to `/api/attempts` returned HTTP 204 with credentialed CORS headers and requested headers allowed.
- Live hostile-origin preflight to `/api/attempts` returned HTTP 404 with no CORS grant.
- Live allowed-origin `GET /api/me/c3` without auth returned HTTP 401, credentialed CORS headers, and `{"error":"not authenticated"}`.
- Live hostile-origin `GET /api/me/c3` without auth returned HTTP 401 with no CORS grant.
- Source trace: `C:\barmatrix-api\src\index.ts` uses dynamic `cors({ origin: ..., credentials: true })` after `helmet()`.
- Reproduced hardening gap: allowed-origin GET/401 and OPTIONS/204 responses do not emit `Vary: Origin`, even though `Access-Control-Allow-Origin` varies by request origin.
- No API source change was applied in this slice because `C:\barmatrix-api` has unrelated dirty billing/admin/tension changes and no GitHub deploy workflow; Hostinger SSH has also been timing out.
- Filed `auronpep/barmatrix-api#4` to track adding `Vary: Origin` for dynamic CORS responses and verifying it live after deploy.
- Browser route check on `/dashboard?api_boundary_browser=20260602a` rendered paid dashboard content with one H1, one `<main>`, no desktop overflow, no raw runtime/API/CSP text, and no relevant browser logs. The sandboxed browser-evaluate context did not expose `fetch`, so extra synthetic fetches were not available there.

# Live Non-Red-Zone Account And Checkout Follow-Up

## Scope

- Continue the full live debug goal while Red Zone remains owned by another session.
- Re-check the deployed audit receipt for commit `d46f081`.
- Verify paid signed-in account and checkout-return surfaces without creating a new Stripe Checkout session.
- Re-run local app/API checks with Red Zone tests excluded from the app sweep.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Confirm current app/API dirty worktree state and Red Zone exclusion.
- [x] Confirm the production deployment workflow for `d46f081`.
- [x] Browser-smoke `/account` with the provided bogus checkout session id.
- [x] Browser-smoke `/checkout/success`, `/pricing`, and `/checkout` without clicking payment-plan actions.
- [x] Re-check open non-Red-Zone GitHub issues.
- [x] Run non-Red-Zone app tests, lint, and build.
- [x] Run API tests, typecheck, and build.

## Review

- Deploy Vercel Production run `26821615672` for commit `d46f081` completed successfully.
- Live `/account?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789` initially showed loading copy, then settled into the paid active-account state.
- Final account state rendered `Your BarMatrix access is active.`, `Verified from signed-in account`, one H1, one `<main>`, no desktop overflow, no visible bogus checkout-session id, no raw API/runtime/CSP text, and no relevant live browser warning/error logs.
- The account billing panel rendered `No Stripe billing portal.` from the signed-in dashboard billing capability. That matches the current app contract for active access without an attached Stripe portal.
- Live `/checkout/success?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789` rendered the pending activation state, hid the raw checkout id, and linked users to account recovery without raw API/runtime text.
- Live `/pricing?checkout_account_audit=20260602a` and `/checkout?checkout_account_audit=20260602a` rendered their public enrollment surfaces without overflow or browser errors. No Stripe session was created.
- Open non-Red-Zone issues remain:
  - `auronpep/barmatrix-app#6` - production C3 Coach has no tagged question coverage.
  - `auronpep/barmatrix-api#3` - backfill C3 annotations and answer-choice mold tags.
  - `auronpep/barmatrix-api#4` - dynamic CORS responses omit `Vary: Origin`.

## Verification

- App non-Red-Zone test sweep passed 63/63:
  - `node --test <all tests/*.test.ts except red-zone*>`
- App `npm run lint` passed.
- App `npm run build` passed.
- API `npm test` passed 284/284 against the current local API worktree.
- API `npm run typecheck` passed.
- API `npm run build` passed.

## Remaining Risk

- Red Zone routes/source/tests remain out of scope by request because another session is reviewing/debugging them.
- C3 Coach and C3 Mastery measured behavior remains blocked on authored C3 annotation and answer-choice mold-tag content.
- API dynamic CORS still needs `Vary: Origin` added and live-verified.
- The API repo still has unrelated dirty billing/admin/tension work; checks passed, but those backend changes were not staged or deployed in this pass.

# Live API CORS Cache Mitigation

## Scope

- Continue the live API boundary audit outside Red Zone.
- Fix and deploy the dynamic-CORS cache hardening gap without touching unrelated dirty API work.
- Verify production behavior from the live edge and from the signed-in account UI.

## Plan

- [x] Re-read `AGENTS.md`; confirm `tasks/lessons.md` status.
- [x] Use the isolated API worktree for the CORS cache change.
- [x] Add/verify regression coverage for source-level `Vary: Origin` and no-store cache behavior.
- [x] Run API tests, typecheck, build, and diff checks.
- [x] Push API `main`, deploy Hostinger runtime, and restart Passenger.
- [x] Probe live allowed/hostile CORS, preflight, and protected unauthenticated paths.
- [x] Browser-smoke the paid account surface after the API restart.
- [x] Update `auronpep/barmatrix-api#4` without closing it.

## Review

- API commit `e940a71` added `res.vary("Origin")` before dynamic CORS; API commit `467bdfe` added `Cache-Control: no-store` before dynamic CORS.
- Hostinger production runtime was updated to detached `467bdfe`; `dist/index.js` contains both `Cache-Control: no-store` and `vary("Origin")`.
- Remote GitHub fetch was blocked by noninteractive GitHub credentials, so the deployed commit was transferred with a verified local git bundle over the working Hostinger SSH connection.
- Temporary `.htaccess` header experiments were removed; production `Cache-Control: no-store` still survives from app source.
- Live hcdn still strips or overwrites `Vary: Origin`, surfacing `Vary: Accept-Encoding` or no `Vary` depending on route/status.
- `auronpep/barmatrix-api#4` was updated with the live evidence and remains open for provider/CDN remediation.

## Verification

- API `npm test` passed 288/288 in `C:\barmatrix-api\.worktrees\api-cors-vary`.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- `git diff --check` passed with only Git CRLF normalization warnings.
- Live allowed-origin `GET /health?cors_nostore_verify=467bdfe` returned HTTP 200, credentialed CORS, `Cache-Control: no-store`, and `Vary: Accept-Encoding`.
- Live hostile-origin `GET /health?cors_nostore_verify=467bdfe` returned HTTP 200 with no CORS grant and `Cache-Control: no-store`.
- Live allowed-origin `GET /api/me/c3?cors_nostore_verify=467bdfe` returned HTTP 401 fail-closed with credentialed CORS and `Cache-Control: no-store`.
- Live hostile-origin `GET /api/me/c3?cors_nostore_verify=467bdfe` returned HTTP 401 fail-closed with no CORS grant and `Cache-Control: no-store`.
- Live allowed preflight to `/api/attempts?cors_nostore_verify=467bdfe` returned HTTP 204 with credentialed CORS and `Cache-Control: no-store`.
- Live hostile preflight to `/api/attempts?cors_nostore_verify=467bdfe` returned HTTP 404 with no CORS grant.
- In-app Browser verified `https://barmatrix.app/account?api_cors_nostore_verify=467bdfe`: paid active-account copy, one H1, one `<main>`, no desktop overflow, no raw API/runtime text, and no relevant browser warning/error logs.

## Remaining Risk

- `Vary: Origin` is not live-verified because Hostinger/hcdn strips or overwrites it at the edge. The verified mitigation is `Cache-Control: no-store` on API responses.
- Red Zone remains out of scope by request because another session is reviewing/debugging it.
- C3 Coach/Mastery measured behavior remains blocked on authored C3 annotations and answer-choice mold tags.

# Ambassador Dashboard Entry And Diagnostic Recommendation

## Scope

- Add the Day-1 Ambassador dashboard entry into The Method.
- Replace generic post-diagnostic result CTAs with one recommendation CTA using level plus the top red-zone/remediation signal.
- Keep app-repo changes only and reuse existing dashboard, diagnostic, foundations, and red-zone surfaces.

## Plan

- [x] Read the A3 work order and Day-1 experience contract.
- [x] Read the local Next.js App Router/link/client-component docs before editing.
- [x] Create `feat/ambassador-dashboard` from `origin/main`.
- [x] Add a dashboard Overview Method entry that routes through Foundations `next_slug`.
- [x] Suppress the competing empty-dashboard diagnostic CTA while the Method card owns Day 1.
- [x] Add The Method to dashboard program navigation.
- [x] Replace free diagnostic results hub/enroll CTAs with a single recommendation CTA.
- [x] Replace placement diagnostic results hub CTA with a level/top-remediation recommendation CTA.
- [x] Add focused regression coverage.
- [x] Repair the campaign static landing-page shell that blocked the production workflow.
- [x] Run lint and build with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set.

## Review

- Dashboard Overview now shows a prominent `Start The Method` / `Resume The Method` card whenever Foundations progress is incomplete.
- The dashboard Method CTA uses `progress.next_slug`, falling back to the first lesson and then `lesson-01`.
- Fresh enrolled empty dashboards no longer show the diagnostic banner CTA while the Method card is pending or visible.
- The dashboard program row includes `The Method` as the first program link.
- `/diagnostic/[session]/results` now renders `Your top leak is X - start here.` with level-aware routing and support for optional API recommendation/next-step fields.
- `/diagnostic/session/[sessionId]/results` now routes from `placement_level` and the top remediation target instead of sending users to `/dashboard`.
- Campaign static landing pages now share the expected product/legal nav/footer links and one non-footer `<main>` landmark, matching the existing landing-page contract.
- No new daily-plan table or state library was added.

## Verification

- Focused tests passed:
  - `node --test tests\ambassador-dashboard-entry.test.ts tests\diagnostic-results-enrolled-cta.test.ts`
- `git diff --check` passed for changed paths with only normal CRLF warnings.
- `node --test tests\static-landing-pages.test.ts` passed after repairing the campaign static shell.
- `node --test tests\*.test.ts` passed 70/70.
- `npm run lint` passed.
- `npm run build` passed with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set.
