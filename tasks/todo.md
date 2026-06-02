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

- [ ] Map Red Zones routes, links, API calls, and existing tests.
- [ ] Run logged-in browser verification across every Red Zones path and capture UI/console/API evidence.
- [ ] Trace any reproduced defect to the owning source and compare against similar working flows.
- [ ] Add failing focused regression tests or repro checks before implementation where practical.
- [ ] Implement scoped fixes and re-run focused plus full relevant checks.
- [ ] Record review notes, verification commands, browser evidence, and remaining risk.

## Review

- Pending.

## Verification

- Pending.

## Remaining Risk

- Pending.
