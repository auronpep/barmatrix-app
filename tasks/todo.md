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
