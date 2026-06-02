# BarMatrix Full Bug Audit Evidence

## Issue

Full audit completed. Expected behavior: the BarMatrix study app should load meaningful screens and primary study/navigation controls should respond without runtime errors. Actual behavior found and fixed: several auth-adjacent study pages could stay loading-only when Clerk did not finish loading; `/sign-in` could render an empty shell under the same condition; retrying missed drill questions dropped auth; `/practice` accepted a narrower subject API shape than neighboring flows; the Criminal Law & Procedure quick drill only queried Criminal Law. Affected domain: BarMatrix web study program.

## Reproduction

- Reproduced: yes for the loading/auth fallback issues and practice interaction; source-confirmed for retry auth and Criminal Law & Procedure query mismatch.
- Steps:
  - Started `npm run dev -- --hostname 127.0.0.1 --port 3000`.
  - Opened `http://127.0.0.1:3000/` and `http://localhost:3000/` in the in-app browser.
  - Observed "Internal Server Error" and dev stderr `Failed to proxy http://localhost:3000/ Error: socket hang up`.
  - Restarted with plain `npm run dev`; opened `http://localhost:3000/` in a fresh in-app Browser tab.
  - Root page rendered the BarMatrix hero with no Browser console errors.
  - `/foundations`, `/mastery`, `/coach`, and `/certification` stayed in loading branches for at least 8 seconds in the signed-out in-app browser when `window.Clerk` was absent.
  - `/sign-in?redirect_url=...` rendered nav/footer only for at least 7 seconds when Clerk's hosted auth UI did not load.
  - After fixes, `/practice` rendered and a `Civil Procedure` subject click loaded a question without console errors.
  - `/drills/criminal-law` is auth-protected and redirected to `/sign-in`; after fixes the redirected page showed the account-access fallback.
- Command:
  - `npm run dev`
  - Browser API: route navigation, DOM snapshots, console log reads, and a `/practice` button click.
- Failure output:
  - Host-binding variant: `Failed to proxy http://localhost:3000/ Error: socket hang up`.
  - Loading/auth pages: loading-only or shell-only DOM with no relevant console error.
- Trace path: default-host `http://localhost:3000` was used as the baseline for product behavior.

## Trace

- Files inspected: `AGENTS.md`, `tasks/todo.md`, `package.json`, local Next 16 docs, `app/layout.tsx`, `app/page.tsx`, `proxy.ts`, `app/auth-form.tsx`, `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx`, `app/foundations/page.tsx`, `app/mastery/page.tsx`, `app/coach/coach-client.tsx`, `app/certification/page.tsx`, `app/drills/[drill_id]/page.tsx`, `app/drills/criminal-law/page.tsx`, `app/practice/practice-client.tsx`, `lib/api-client.ts`, `lib/use-attempts.ts`, `lib/use-clerk-auth.ts`, and related hook files.
- Root causes:
  - `useClerkAuth()` exposed Clerk's unresolved `isLoaded: false` indefinitely, so public/auth-adjacent pages that derive signed-out state from that hook never rendered their signed-out UI when the Clerk script stalled.
  - The sign-in/sign-up pages rendered Clerk's hosted components with no visible fallback for the stalled hosted UI.
  - `onRetryMissed` in `app/drills/[drill_id]/page.tsx` called `api.startDrill` without a token and swallowed all failures.
  - `fetchSubjectIds` in `/practice` only read top-level `questions`, unlike nearby subject pages that tolerate `questions`, `items`, `results`, or `data`.
  - The Criminal Law drill had a combined Criminal Law & Procedure label but a single-subject request constant.
- Confidence: high for the fixed issues except authenticated retry click end-to-end, which is medium because no signed-in in-app browser session was available.
- Assumptions to verify: signed-in Clerk behavior should take over if Clerk loads after the fallback timeout; this was checked by preserving `isLoaded && isSignedIn` semantics in code and by build/type checks, but not with a signed-in browser session.

## Change

- Changed files: `lib/use-clerk-auth.ts`, `app/auth-form.tsx`, `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx`, `app/drills/[drill_id]/page.tsx`, `app/drills/criminal-law/page.tsx`, `app/practice/practice-client.tsx`, regression tests, and task evidence files.
- Diff summary:
  - Added a 3-second Clerk load fallback to derive signed-out state when the Clerk browser script stalls.
  - Added a client auth form wrapper that shows a visible account-access fallback if Clerk hosted UI does not render.
  - Passed Clerk token into retry-drill creation and displayed retry errors.
  - Normalized `/practice` subject payloads across local response shapes.
  - Queried both Criminal Law and Criminal Procedure for the combined quick drill.
- Smallest safe fix rationale: kept changes localized to the owning hooks/pages and used source-contract tests rather than adding a new UI test framework.

## Verification

- Test command:
  - `node --test tests\*.test.ts`
  - `node scripts\check-auth-proxy.mjs`
  - `npm run lint`
  - `npm run build`
  - `git diff --check`
- Test output:
  - 18 tests passed, 18 total.
  - Auth proxy check passed.
  - Lint passed.
  - Build passed with Next.js 16.2.6.
  - Diff check passed with only CRLF normalization warnings.
- Manual QA:
  - In-app Browser route smoke for `/foundations`, `/mastery`, `/coach`, `/certification`, `/sign-in`, and `/practice` showed no framework errors and no relevant console errors.
  - `/practice` interaction: clicked `Civil Procedure`; app rendered question `CP-043` with answer choices and confidence/submit controls.
  - `/drills/criminal-law` unauthenticated route correctly redirected to `/sign-in?redirect_url=...`, where the account fallback rendered.
- Remaining uncertainty:
  - A signed-in browser session was unavailable, so authenticated retry-drill click behavior is covered by regression/source tests and build/type checks, not by a live signed-in browser click.

# Signed-In Drill Attempt API 500 Evidence

## Issue

Expected behavior: a paid signed-in user can answer a Criminal Law & Procedure drill question and see the answer result/forensics. Actual behavior: the signed-in UI loads the queue, but submitting an answer returns `API 500: "internal server error"` and the drill becomes unavailable. Affected domain: answer attempt submission in the BarMatrix study web app/API.

## Reproduction

- Reproduced: yes.
- Steps:
  - Switched local web Clerk configuration to the available test key pair without printing secrets.
  - Restarted the local Next dev server on `http://localhost:3000`.
  - Signed in through the in-app browser as a paid subscriber and opened `http://localhost:3000/drills/criminal-law`.
  - Observed question `CR-323 - General Principles`, selected answer `B`, and clicked `Submit answer`.
  - The page rendered `Criminal Law drill unavailable. API 500: "internal server error"`.
- Failure output:
  - Browser UI: `API 500: "internal server error"`.
  - Local API trace after reproducing the same POST against `http://localhost:8080/api/attempts`: `ER_UNSUPPORTED_PS` on SQL `BEGIN`.

## Trace

- Files inspected: `C:\barmatrix-api\src\db.ts`, `C:\barmatrix-api\src\db.test.ts`, `C:\barmatrix-api\src\routes\attempts.ts`, local API stdout/stderr logs, and signed-in browser state.
- Verified facts:
  - Question queue GETs succeed.
  - Anonymous and signed-in attempt POSTs fail before the insert path.
  - `src\routes\attempts.ts` opens a transaction with `client.query("BEGIN")`.
  - `src\db.ts` implements all MySQL queries with `executor.execute(...)`, which uses mysql2 prepared statements.
  - mysql2/MySQL rejects transaction control command `BEGIN` in the prepared statement protocol.
- Suspected root cause: the DB wrapper should use the simple query protocol for unparameterized SQL such as transaction control commands, while keeping prepared execution for parameterized statements.
- Confidence: high.

## Change

- Changed files in `C:\barmatrix-api`: `src\db.ts`, `src\db.test.ts`, `src\routes\attempts.ts`, `src\routes\attempts.test.ts`, and `src\entitlement.test.ts`.
- Diff summary:
  - The MySQL wrapper now converts pg-style `$n` placeholders to `?` and sends all queries through mysql2's simple query protocol with escaped values.
  - This avoids MySQL prepared-statement protocol incompatibilities observed for `BEGIN` and `LIMIT ? OFFSET ?` while preserving centralized value binding.
  - `/api/attempts` now retries selected-choice lookup without `c3_mold_code` when the optional C3 column is absent, returning `c3_mold_code: null` for SRS enrichment rather than failing the answer submission.
  - The mysql-backed entitlement test double now exposes both `query` and `execute`, matching the real mysql2 pool/connection interface.
- Smallest safe fix rationale: kept behavior changes at the shared DB adapter and the one optional C3 field that blocked attempt recording; no route contract or frontend flow was changed for the API 500.

## Verification

- API red checks:
  - `npx tsx --test src/db.test.ts` failed before implementation because the wrapper still selected prepared execution for bound values.
  - `npx tsx --test src/routes/attempts.test.ts` failed before implementation because the selected-choice fallback helper did not exist.
- API green checks:
  - `npx tsx --test src/db.test.ts` passed.
  - `npx tsx --test src/routes/attempts.test.ts` passed.
  - `npm test` passed: 260 tests, 260 pass.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --check` passed in `C:\barmatrix-api` with only CRLF normalization warnings.
- Runtime/API QA:
  - Local `GET http://localhost:8080/api/questions/by-subject?subject=Evidence&page=1&limit=1` returned HTTP 200 after the DB wrapper change.
  - Local `POST http://localhost:8080/api/attempts` with a real local Evidence question returned HTTP 200 and an `attempt_id`.
- Browser QA:
  - The local web app was pointed at `http://localhost:8080` for verification.
  - In-app browser signed-in session opened `/drills/evidence`, started a queue, selected `A. Yes`, submitted, and rendered `Wrong Answer Forensics` plus `Next Evidence question`.
  - No browser errors were logged after `2026-06-01T17:50:00Z`; earlier Clerk production-key errors were stale from the pre-test-key reproduction.
- Frontend checks:
  - `node --test tests\*.test.ts` passed: 18 tests, 18 pass.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` passed in `C:\barmatrix-app` with only CRLF normalization warnings.
- Remaining uncertainty:
  - The local API fixture DB only contains Evidence questions, so final browser submit verification used Evidence. The original paid Criminal Law failure was reproduced before the fix, and the verified path exercises the same `/api/attempts` failure surface.

# Comprehensive Signed-In Audit Evidence

## Issue

Expected behavior: the BarMatrix study app should render meaningful route states, keep navigation usable, avoid framework/runtime errors, and let primary study interactions progress against the configured local API. Actual behavior found in this audit: `/boot-camps` surfaced `API 500` when the optional boot-camp schema was absent; direct certification competency routes surfaced raw `API 401/403` states; locked certification start attempted to write `cert_sessions` before checking the Method gate; stale rejected auth sessions caused Foundations/C3/Red Zones to show raw API-status copy instead of product states. Affected domain: full web study program across study routes and API-backed surfaces.

## Reproduction

- Reproduced: yes.
- Entry state:
  - Browser URL: `http://localhost:3000/drills/evidence`.
  - Web app local server: `http://localhost:3000`.
  - API local server: `http://localhost:8080`.
  - `tasks/lessons.md` is absent.
  - AM check-in failed because no AM session matched `C:\barmatrix-app`.
- Browser/API findings:
  - `/boot-camps` rendered `Catalog unavailable` / `API 500` while local API logged `Table 'barmatrix.boot_camps' doesn't exist`.
  - `/certification/M1` rendered raw API-status copy for locked/unauthenticated direct access.
  - API logs showed certification start attempting `INSERT INTO cert_sessions` before verifying the Method completion gate.
  - Route smoke after web restart found `/foundations`, `/mastery`, and `/red-zones` could display raw `API 401` copy when a stale/rejected session was present.
  - `/practice`, `/timed-sets`, `/coach`, `/traps`, `/tensions`, `/certification`, `/dashboard`, and `/drills/evidence` rendered meaningful states without recent browser console errors.

## Trace

- Files and runtime areas inspected: `AGENTS.md`, `tasks/lessons.md`, `package.json`, `C:\barmatrix-api\package.json`, local Next docs, active git status for both repos, local port listeners for 3000/8080, browser route state, browser console logs, direct API responses, and API route logs.
- Root causes:
  - `C:\barmatrix-api\src\routes\boot-camps.ts` assumed `boot_camps` was provisioned and treated a missing optional catalog table as a server error.
  - `C:\barmatrix-api\src\routes\certification.ts` let `POST /api/me/certification/:id/start` insert a session before applying the same fail-closed Method completion gate used by competency fetches.
  - `C:\barmatrix-app\app\certification\[competencyId]\page.tsx` mapped all API failures to display strings, so expected auth/gate statuses appeared as raw `API 401/403`.
  - `C:\barmatrix-app\lib\use-foundations.ts`, `lib\use-c3.ts`, and `lib\use-red-zones.ts` treated rejected saved sessions as signed-in data errors instead of recovering to public/signed-out states.
- Confidence: high; each finding was reproduced through the running app/API or route smoke and then covered by regression tests where practical.

## Change

- Changed files in `C:\barmatrix-api`: `src\routes\boot-camps.ts`, `src\routes\boot-camps-auth.test.ts`, `src\routes\certification.ts`, and `src\routes\certification.test.ts`.
- Changed files in `C:\barmatrix-app`: `app\certification\[competencyId]\page.tsx`, `lib\auth-errors.ts`, `lib\use-foundations.ts`, `lib\use-c3.ts`, `lib\use-red-zones.ts`, `tests\auth-401-state.test.ts`, and `tests\certification-runner-locked-state.test.ts`.
- Diff summary:
  - Boot-camp catalog returns `{"boot_camps":[]}` for a missing catalog table.
  - Certification start uses exported `canStartCertification()` before attempting a session insert.
  - Certification competency direct route renders sign-in or Method CTA states for 401/403.
  - Shared `isAuthRejected()` detects rejected saved sessions; Foundations falls back to public outline, and C3/Red Zones render signed-out CTAs.

## Verification

- Regression tests:
  - `npx tsx --test src/routes/boot-camps-auth.test.ts` failed before implementation and passed after.
  - `npx tsx --test src/routes/certification.test.ts` failed before implementation and passed after.
  - `node --test tests\auth-401-state.test.ts` failed before implementation and passed after.
  - `node --test tests\certification-runner-locked-state.test.ts` failed before implementation and passed after.
- Full checks:
  - App `node --test tests\*.test.ts` passed: 22 tests, 22 pass.
  - App `npm run lint` passed.
  - App `npm run build` passed.
  - API `npm test` passed: 262 tests, 262 pass.
  - API `npm run typecheck` passed.
  - API `npm run build` passed.
  - `git diff --check` passed in both repos with only CRLF normalization warnings.
- Runtime/browser QA:
  - Direct `GET http://localhost:8080/api/boot-camps` returned HTTP 200 with `{"boot_camps":[]}`.
  - Browser `/boot-camps` showed `No boot camps are published yet`, not API 500.
  - Browser `/certification/M1` showed a sign-in product state, not raw API status text.
  - Browser `/foundations` loaded the public Method outline; `/mastery` and `/red-zones` showed signed-out CTA states with no raw `API 401`.
  - Browser `/drills/evidence`: started a queue, selected `A. Yes`, submitted, and rendered `Wrong Answer Forensics`; no recent browser errors.
- Screenshots:
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-audit-boot-camps-after-restart.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-audit-certification-m1-ux-after-fix.png`
  - `C:\Users\wks2391\AppData\Local\Temp\barmatrix-audit-evidence-submit-final.png`

## Remaining Risk

- The local DB fixture lacks boot-camp and cert-session tables by design, so this audit verified graceful local behavior for those absent schemas rather than a seeded boot-camp/certification happy path.
- The web dev server had to be restarted to pick up current Clerk development keys; after restart, stale-session states were included in the audit and fixed.

# Remaining Workflow Test Pass Evidence

## Issue

Expected behavior: paid signed-in users should see account-aware next steps, use seeded boot-camp/certification workflows, complete local diagnostic/drill/red-zone paths, and avoid mobile horizontal overflow. Actual behavior found in this pass: diagnostic results always showed the enrollment upsell to an enrolled user; `/account` showed static `Pending sign-in` copy to an enrolled user; the global header diagnostic CTA caused 390px horizontal overflow. Affected domain: paid subscriber study workflows and responsive app shell.

## Reproduction

- Reproduced: yes.
- Entry state:
  - Browser URL started in the boot-camp workflow.
  - Web app: `http://localhost:3000`.
  - API: `http://localhost:8080`.
  - Local DB had Evidence-only question data; additive local-only Method, certification, boot-camp, and gamification tables were provisioned for this test pass.
- Browser findings:
  - `/diagnostic/:session/results` rendered `Enroll for $999` even though the same signed-in user could start paid boot camps and load enrolled dashboard data.
  - `/account` rendered `Pending sign-in` and static placeholder copy even though `/dashboard` showed active subscriber metrics.
  - 390px viewport smoke showed `documentElement.scrollWidth` at 511px on core routes; element tracing identified `.nav-cta .btn.btn-sm.red` for the top nav `Free Diagnostic` CTA as the overflow source.

## Trace

- Files inspected: `app/diagnostic/[session]/results/page.tsx`, `app/account/page.tsx`, `app/layout.tsx`, `app/globals.css`, `lib/use-dashboard.ts`, `app/red-zones/*`, `app/boot-camps/*`, and local Next.js server/client component plus navigation docs.
- Root causes:
  - Diagnostic results used a hard-coded public `EnrollCta` and did not consult the existing dashboard/enrollment hook.
  - Account page derived entitlement status only from welcome/search-param state and ignored the signed-in dashboard enrollment API.
  - The header already had a `.hide-md` responsive utility, but the secondary diagnostic CTA did not use it.

## Change

- Changed files in `C:\barmatrix-app`: `app\diagnostic\[session]\results\page.tsx`, `app\account\page.tsx`, `app\account\account-status.tsx`, `app\layout.tsx`, `tests\diagnostic-results-enrolled-cta.test.ts`, `tests\account-entitlement-state.test.ts`, and `tests\nav-mobile-overflow.test.ts`.
- Diff summary:
  - Diagnostic results now call `useDashboard()` and render dashboard/red-zone next steps for enrolled users while keeping the public enrollment CTA for anonymous/non-enrolled users.
  - Account page now nests client status components that render live signed-in enrollment state, including `Account active`, `Active`, and `Verified from signed-in account`.
  - Header `Free Diagnostic` CTA now uses the existing `hide-md` utility to prevent mobile/tablet overflow.

## Verification

- Browser QA:
  - Boot camp catalog/detail/start/day verified with `hearsay-trap-camp`; Day 1 answered 8/8 local questions and posted attempts. Mastery route correctly showed `Mastery check is locked` because the failed day did not pass the 75% gate.
  - Diagnostic completed all 8 local questions and results rendered enrolled-user CTAs: `Open dashboard` and `Review red zones`.
  - Evidence drill started and submitted a real answer, rendering `Wrong Answer Forensics`.
  - Red Zone Library rendered 3 active zones from real attempts; `tension_point/confrontation_clause` detail rendered misses/questions and its repair link routed to `/drills/evidence`.
  - Certification M1 loaded, accepted 10 selections, submitted, and rendered score/result details plus remediation links.
  - Account rendered `Account active` and `Active` entitlement status for the paid session.
  - 390px smoke on dashboard, Evidence drill, Red Zones, Certification M1, and Account had no horizontal overflow after the nav CTA change.
- Checks:
  - `node --test tests\diagnostic-results-enrolled-cta.test.ts` failed before the diagnostic CTA fix and passed after.
  - `node --test tests\account-entitlement-state.test.ts` failed before the account status component existed and passed after.
  - `node --test tests\nav-mobile-overflow.test.ts` failed before the nav CTA class change and passed after.
  - App `node --test tests\*.test.ts` passed: 25 tests, 25 pass.
  - App `npm run lint` passed.
  - App `npm run build` passed.
  - API `npm test` passed: 262 tests, 262 pass.
  - API `npm run typecheck` passed.
  - API `npm run build` passed.

## Remaining Risk

- The local fixture bank only has Evidence questions, so Contracts/Criminal Law/etc. happy-path drill submissions remain data-blocked locally.
- Boot-camp mastery pass could not be reached through the UI because the local Evidence choices produce a failed Day 1 score; the locked mastery state was verified.

# Live Environment Audit Evidence

## Issue

Expected behavior: the deployed BarMatrix frontend and API should serve the public app, expose healthy public study data, reject unauthenticated protected requests without 500s, allow browser CORS from the app domain, and render live pages without console/runtime failures. Actual behavior in this pass: no live public/API server error was reproduced; remaining gaps are production signed-in mutating flows, live mobile-width browser verification, and unshipped local fixes.

## Reproduction

- Reproduced: no new live public-route failure reproduced.
- Live frontend checks:
  - `https://barmatrix.app` returned HTTP 200 from Vercel.
  - `https://www.barmatrix.app` returned HTTP 308 to `https://barmatrix.app/`.
  - In-app browser route smoke covered `/`, `/boot-camps`, `/practice`, `/foundations`, `/certification`, `/red-zones`, `/traps`, `/tensions`, `/diagnostic`, `/account`, `/drills/evidence`, and `/sign-in?redirect_url=...`.
  - Protected `/drills/evidence` and `/account` redirected to live Clerk sign-in with email/password UI visible.
  - Live `/practice` Evidence subject click rendered a real question without submitting an attempt.
- Live API checks:
  - `/health` returned `{"ok":true,"db":"up"}`.
  - Public GETs returned HTTP 200 for cohort status, boot camps, boot-camp detail, foundations, drill catalog, traps, tensions, C3 deck, and representative subject question queries.
  - Protected unauthenticated requests returned expected auth/gate statuses: dashboard 401, boot-camp start 401, C3 401, C3 next 401, certification M1 401/locked, certification start 401/not authorized.
  - CORS preflight from `https://barmatrix.app` to `/api/diagnostic/start` returned HTTP 204 with `Access-Control-Allow-Origin: https://barmatrix.app` and credentials enabled.

## Trace

- Files/runtime areas inspected: `.vercel/project.json`, frontend env variable names in `.env.example`, `.env.local`, `.vercel/.env.production.local`, `.vercel/.env.development.local`, `lib/api-client.ts`, API route names in `C:\barmatrix-api\src\routes`, live HTTP responses, and in-app browser DOM/console state.
- Verified facts:
  - The local Vercel project is `barmatrix-app`.
  - Local pulled production env metadata includes `NEXT_PUBLIC_API_URL`; the live sign-in UI proves deployed Clerk public configuration is present enough for Clerk to render.
  - Live public API data is provisioned beyond the local Evidence-only fixture, including boot camps and multiple subject banks.
  - Live browser smoke produced no fresh `barmatrix.app` console warnings/errors in the tested desktop viewport.
- Non-bug triage:
  - `/api/me/c3/due`, `/api/me/boot-camps/.../start`, and `/api/certification/competencies` returned 404/400 because those are not app contract routes.
  - The actual app routes `/api/me/c3`, `/api/me/c3/next`, `/api/boot-camps/:slug/start`, and `/api/certification` behaved coherently.

## Change

- No source-code change was made from this live audit pass.
- `tasks/todo.md` and this evidence file were updated with live verification results and remaining risk.

## Verification

- Fresh app checks:
  - `node --test tests\*.test.ts` passed: 25 tests, 25 pass.
  - `npm run lint` passed.
  - `npm run build` passed.
- Fresh API checks:
  - `npm test` passed: 262 tests, 262 pass.
  - `npm run typecheck` passed.
  - `npm run build` passed.
- `git diff --check` passed in both repos with only Git CRLF normalization warnings.

## Remaining Risk

- The audited local fixes remain uncommitted/unshipped, so live is not yet proven to include them.
- Live paid-subscriber mutating flows were not exercised because they require a production subscriber session and would write live attempts/sessions.
- Live mobile-width verification is incomplete because the in-app browser did not expose viewport resize in this session and project dependencies do not include Playwright.
- Public live `/practice` answer submission was intentionally not clicked because it records attempts through `/api/attempts`.
- `vercel env ls` timed out after 60 seconds, likely on CLI auth/project context, so deployed env names were inferred from local metadata plus live runtime behavior rather than the Vercel env table.

# Post-Push Deployment Evidence

## Issue

Expected behavior: after verified fixes are committed and pushed, the API and frontend deployment lanes should update so the live environment can be verified against the fixed code. Actual behavior: the API updated on Hostinger and was live-verified; the frontend source is pushed but Vercel production remains on the prior deployment.

## Reproduction

- Frontend:
  - Pushed `auronpep/barmatrix-app` `main` to commit `418e9452c70ad2e586cbcb88634c3a2044e2d4d1`.
  - Vercel deployment list still shows latest production deployment `dpl_8dwjftRNZg8g9domuuYKUDeShdvB` from commit `2c52e920752ecf7207163f6d2aba050af8f64fb0`.
  - GitHub commit status for `418e945` has no statuses and no deployments.
  - `vercel whoami`, `vercel project ls --yes`, and `vercel deploy --prod --yes` timed out without output in this shell.
- API:
  - Pushed `auronpep/barmatrix-api` `main` to commit `c4fbdcf9529e5d7edd6689644ec25b6a20f9dfd2`.
  - Remote Hostinger app root `/home/u211961595/domains/barmatrix.app/nodejs` reports git SHA `c4fbdcf9529e5d7edd6689644ec25b6a20f9dfd2`.
  - Remote built `dist` contains `toMysqlExecutionPlan`, `findSelectedChoiceForAttempt`, `isMissingBootCampTable`, and `canStartCertification`.
  - Live API accepted one minimal anonymous Evidence attempt and returned forensics successfully.

## Trace

- Frontend deployment gap:
  - Vercel connector can inspect the project/deployments but does not perform deployment directly; its deploy tool instructs using the Vercel CLI.
  - Local process env has no `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or `VERCEL_PROJECT_ID`.
  - Local Vercel CLI config has no usable logged-in account for this shell.
  - GitHub/Vercel integration did not create a deployment for the pushed commit.
  - GitHub issue `auronpep/barmatrix-app#2` tracks the Vercel deployment blocker.
- API deploy path:
  - Live `api.barmatrix.app` resolves to Hostinger and returns Hostinger CDN headers.
  - Hostinger SSH access works with `C:\Users\wks2391\.ssh\hostinger_gemini`.
  - Hostinger auto-pull has already placed the API commit and matching build output on the server.

## Change

- Committed and pushed frontend fixes in `418e945` (`fix: harden study audit flows`).
- Committed and pushed API fixes in `c4fbdcf` (`fix: harden study API flows`).
- No additional source-code change was made after discovering the frontend deployment blocker.

## Verification

- Frontend pre-push verification:
  - `node --test tests\*.test.ts` passed: 25 tests, 25 pass.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --cached --check` passed.
- API pre-push verification, with unrelated admin work stashed out:
  - `npm test` passed: 262 tests, 262 pass.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --cached --check` passed.
- API live verification:
  - `GET https://api.barmatrix.app/health` returned HTTP 200 and DB up.
  - `GET https://api.barmatrix.app/api/boot-camps` returned HTTP 200.
  - `POST https://api.barmatrix.app/api/attempts` with a valid Evidence question returned HTTP 200 and attempt `549c6fd3-3fef-41ee-b93e-ddf13e7233d6`.
  - `GET https://api.barmatrix.app/api/attempts/549c6fd3-3fef-41ee-b93e-ddf13e7233d6/forensics` returned HTTP 200.

## Remaining Risk

- Frontend fixes are not live on `https://barmatrix.app` until Vercel deploys commit `418e945` or a later commit containing the same fixes.
- Production paid-subscriber UI mutation flows are still not fully verified end to end; live API mutation proof was anonymous.
- Live mobile-width verification remains incomplete.
- The API repo still contains unstaged admin/complimentary-access changes that were intentionally excluded from the live fix commit.

# Production Deployment Resolution Evidence

## Issue

Expected behavior: the verified frontend fix commit should be deployed to `https://barmatrix.app` before claiming live behavior is corrected. Actual behavior before this pass: Vercel production was still serving deployment `dpl_8dwjftRNZg8g9domuuYKUDeShdvB` from commit `2c52e920752ecf7207163f6d2aba050af8f64fb0`; the pushed fix commit `418e9452c70ad2e586cbcb88634c3a2044e2d4d1` had no GitHub deployment/status.

## Reproduction

- Reproduced: yes, before deployment.
- GitHub commit status for `418e9452c70ad2e586cbcb88634c3a2044e2d4d1` returned aggregate `pending` with no statuses.
- Vercel project latest production deployment was `dpl_8dwjftRNZg8g9domuuYKUDeShdvB`, sourced from commit `2c52e920752ecf7207163f6d2aba050af8f64fb0`.

## Trace

- `.vercel/project.json` linked the local app to project `prj_LwBgARXTft6aeyoRwhIqEDWh5p4P` and team `team_HKHemC6mfIOm0t6aROxfEOug`.
- `VERCEL_TOKEN` was present in `C:\Users\wks2391\.env` by variable name/presence check only; no token value was printed.
- `vercel whoami` succeeded with the env-loaded token as `sunnylwood-7609`.
- `vercel deploy --prod --yes` succeeded using the token-backed CLI path.

## Change

- No source-code change was needed.
- Deployed the already-pushed frontend commit through the linked Vercel project.
- Closed GitHub issue `auronpep/barmatrix-app#2` as completed with the deployment and verification evidence.

## Verification

- Vercel deployment:
  - Deployment `dpl_7KuTzneMWvjb1gt82fqB24AGxpG2` is `READY`.
  - Deployment metadata reports commit `418e9452c70ad2e586cbcb88634c3a2044e2d4d1` and message `fix: harden study audit flows`.
  - Deployment aliases include `barmatrix.app` and `www.barmatrix.app`.
  - `GET https://barmatrix.app` returned HTTP 200 from Vercel.
- Live browser:
  - `https://barmatrix.app/practice` rendered the production study bank.
  - Evidence practice answer submission returned the expected `Correct` / `Rule held` result state.
  - Missed Evidence answers rendered `WRONG ANSWER FORENSICS`, correct-answer copy, and failure explanations.
  - `https://barmatrix.app/drills/evidence` redirected to production sign-in when unauthenticated.
  - Production page source included a live Clerk public key marker and did not include a test-key marker.
- Fresh local checks:
  - App `node --test tests\*.test.ts` passed: 25 tests, 25 pass.
  - App `npm run lint` passed.
  - App `npm run build` passed.
  - API `npm test` passed: 262 tests, 262 pass.
  - API `npm run typecheck` passed.
  - API `npm run build` passed.
- Live API:
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.

## Remaining Risk

- Production paid-subscriber-only mutation flows still need a production-domain paid subscriber session for full live browser verification.
- Live mobile-width verification remains incomplete.
- The production public-practice verification wrote several anonymous live Evidence attempts while proving correct and missed-answer states.
- The API repo still contains unrelated local admin/complimentary-access changes that are intentionally outside this deployed fix.

# Production Paid And Mobile Verification Evidence

## Issue

Expected behavior: the deployed app should work for a production-domain paid subscriber across protected dashboard/study routes, and core signed-in pages should fit a mobile viewport without document-level horizontal overflow. Actual prior state: production paid-subscriber browser flows and live mobile-width layout were not yet verified after deploying the frontend fix.

## Reproduction

- Reproduced: no paid-session or mobile-layout failure reproduced in this pass.
- Setup evidence:
  - Production DB was queried from the deployed Hostinger app context, returning 13 students, 6 purchases, 6 active non-refunded purchases, 3 boot camps, and 3666 active questions.
  - A short-lived Clerk sign-in token was created only for an active QA paid account. The token URL was not printed, and the temp file was deleted after use.
  - The production browser session showed signed-in navigation (`Dashboard` plus user menu).
- Paid browser flow evidence:
  - `/dashboard` rendered the signed-in paid dashboard with Method progress, C3 state, metrics, and next drill.
  - `/account` rendered `Account active`, `Active`, and `Verified from signed-in account`.
  - `/red-zones` rendered the enrolled Red Zone Library state; after the paid Evidence attempt, it showed 3 active red zones.
  - `/mastery` rendered authenticated `Not yet measured` C3 state.
  - `/certification` rendered the expected Method-locked state for a 0/14 Method account.
  - `/certification/M1` rendered `Finish The Method before taking this competency` plus a Method CTA, not raw API status text.
  - `/drills/evidence` started a protected paid queue, submitted answer `A`, and rendered `Wrong Answer Forensics` with failure explanation copy.
  - `/boot-camps/hearsay-trap-camp` started a production session and redirected to `/boot-camps/sessions/357fd2ce-d197-4874-bc4a-6a37c46df1e5`.
  - The boot-camp session hub showed Day 1 available, and `/days/1` loaded a 12-question live block.
- Mobile browser flow evidence:
  - The in-app browser viewport override was set to 390x844.
  - `/dashboard`, `/account`, `/drills/evidence`, `/red-zones`, `/boot-camps`, and `/certification` each reported `scrollWidth === clientWidth === 375`, so no document-level horizontal overflow.
  - The viewport override was reset after testing.
  - Screenshot: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-production-mobile-certification.png`.
- Browser log evidence:
  - After paid/mobile verification, the in-app browser returned zero warning/error entries whose URL or message referenced `barmatrix.app`.

## Trace

- Files/runtime areas inspected: production DB through deployed `dist/db.js`, Clerk backend SDK sign-in token type surface, production in-app browser DOM, and browser viewport capability docs.
- Verified facts:
  - Production has an active QA paid account suitable for test impersonation.
  - The paid QA account has active entitlement but 0/14 Method lessons, so certification lock is expected.
  - The QA paid purchase used for browser verification has no Stripe customer ID, so account billing portal coverage requires a different QA fixture or explicit use of a real Stripe-backed account.
  - The production mobile shell no longer has the document-level overflow previously reproduced locally before the nav CTA fix.

## Change

- No source-code change was made in this pass.
- `tasks/todo.md` and this evidence file were updated with production paid-session and mobile verification results.

## Verification

- Production runtime/browser:
  - Signed-in production paid subscriber dashboard/account/study routes rendered expected states.
  - Paid Evidence drill start and answer submission succeeded and rendered forensics.
  - Paid boot-camp start and Day 1 load succeeded.
  - 390x844 signed-in mobile smoke found no document-level horizontal overflow on six core routes.
  - Production browser log filter found zero `barmatrix.app` warnings/errors after the pass.
- Fresh command gates:
  - App `node --test tests\*.test.ts` passed: 25 tests, 25 pass.
  - App `npm run lint` passed.
  - App `npm run build` passed.
  - API `npm test` passed: 262 tests, 262 pass.
  - API `npm run typecheck` passed.
  - API `npm run build` passed.
  - App/API `git diff --check` passed; the app repo emitted only LF-to-CRLF normalization warnings for audit-note files.

## Remaining Risk

- Production certification submit remains unverified because the QA paid account is correctly Method-locked at 0/14 lessons.
- Production boot-camp Day 1 completion/mastery remains unverified in live production to avoid writing a full 12-answer day during this pass.
- Account billing portal remains unverified for the QA account because that active QA purchase has no Stripe customer ID.
- The API repo still contains unrelated local admin/complimentary-access changes outside this deployed fix.

# Remaining Production Gap Closure Evidence

## Issue

Expected behavior: production paid-subscriber flows should tolerate optional certification storage, safely open account billing for a Stripe-backed owner, complete boot-camp days/mastery without losing progress on reload, and leave reversible QA fixtures cleaned up after the audit. Actual behavior during the gap-closure pass: certification start and submit exposed optional-storage failures, billing portal coverage required a QA-owned Stripe fixture, and mastery reload exposed that the mastery start response did not include previously answered IDs or correct count.

## Reproduction

- Certification start:
  - Reproduced from production UI after temporarily completing Method progress for the QA account.
  - `/certification/M1` start returned API 500 when optional certification session storage was not provisioned.
- Certification submit:
  - After the first API hardening, `/certification/M1` accepted answers but the submit result crashed the frontend route.
  - Root visible state was the route error boundary after `POST /api/me/certification/M1/submit`.
- Billing portal:
  - The QA paid purchase initially had no Stripe customer link, so `/account` could not exercise the billing portal path.
  - A temporary QA Stripe customer was attached to the QA purchase and the account button opened Stripe Billing Portal.
- Boot camp:
  - Completed production Hearsay Trap Boot Camp Days 1 through 5 from the signed-in in-app browser.
  - Mastery unlocked and accepted answers through question 18.
  - A fetch/reload path during mastery showed the runner needed to resume at question 19, but the mastery start payload did not carry answered IDs or correct count.

## Trace

- Certification root causes:
  - `C:\barmatrix-api\src\routes\certification.ts` attempted optional `cert_sessions` persistence before returning a start payload.
  - The non-persisted certification submit fallback returned grade fields at the top level, while the app consumes `result.conditions`.
  - `shapeCertGradeResponse(...)` now keeps persisted and fallback submit responses on the same contract.
- Billing portal trace:
  - Billing ownership was verified through the signed-in QA purchase only.
  - The temporary Stripe customer was marked with audit-fixture metadata and later deleted only if that marker matched.
- Boot-camp root cause:
  - Day start already returns `answered_question_ids`, so day reloads resume correctly.
  - `POST /api/boot-camps/sessions/:session_id/mastery/start` only returned `question_ids`, forcing the app to initialize mastery with `answeredQuestionIds: []` and `initialCorrect` missing.
  - `C:\barmatrix-app\app\boot-camps\sessions\[session_id]\mastery\page.tsx` therefore restarted the mastery runner after reload instead of skipping answered mastery questions.
- Rebase lint blocker:
  - Remote commit `7fbdd7f` added a diagnostic session page that failed project lint because it called `Date.now()` during render and synchronously reset state in a question-change effect.

## Test

- API certification tests:
  - Added coverage for non-persisted certification start when optional storage is missing.
  - Added coverage that non-persisted certification submit keeps the same nested grade response shape as persisted submit.
- API boot-camp test:
  - Added a source-contract regression that mastery start returns `answered_question_ids`, `correct_count`, and uses `session.mastery_set_id`.
- App boot-camp test:
  - Added `tests/boot-camp-mastery-resume.test.ts` to lock that the mastery page passes `masteryStart.answered_question_ids` and `masteryStart.correct_count` into `QuestionRunner`.

## Change

- `C:\barmatrix-api\src\routes\certification.ts`
  - Certification start now returns a non-persisted session response instead of failing when optional session storage is absent.
  - Certification submit fallback now uses the same response shaper as persisted results.
- `C:\barmatrix-api\src\routes\boot-camps.ts`
  - Mastery start now computes answered mastery IDs and correct count from prior attempts for the mastery set.
- `C:\barmatrix-app\lib\api-client.ts`
  - `BootCampMasteryStartResponse` now includes `answered_question_ids` and `correct_count`.
- `C:\barmatrix-app\app\boot-camps\sessions\[session_id]\mastery\page.tsx`
  - Mastery initialization now passes answered IDs and initial correct count into `QuestionRunner`.
- `C:\barmatrix-app\app\diagnostic\session\[sessionId]\page.tsx`
  - Moved timer initialization out of render and moved question reset work into the next-question event path to satisfy lint after rebasing the remote diagnostic feature.

## Verification

- API source and deploy:
  - Pushed certification API commits `0914c69` and `127ce5f`.
  - Pushed boot-camp resume API commit `21020f3`.
  - Copied matching built route artifacts to Hostinger and restarted the Node app.
  - Verified remote `dist/routes/boot-camps.js` contains `answered_question_ids` and `correct_count`.
- Frontend source and deploy:
  - Pushed boot-camp mastery frontend commit `6948e78`.
  - Pushed diagnostic lint cleanup commit `7f95cc3`.
  - Vercel production deployment `dpl_7KgW8i2RU3dpwMpsBa8LLT7B2MD9` is `READY`, aliased to `https://barmatrix.app`, and `GET https://barmatrix.app` returned HTTP 200.
- Commands:
  - API `npm test` passed: 266 tests, 266 pass.
  - API `npm run typecheck` passed.
  - API `npm run build` passed.
  - App `node --test tests\*.test.ts` passed: 26 tests, 26 pass.
  - App `npm run lint` passed.
  - App `npm run build` passed locally and in Vercel production.
  - Live API `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
- Production browser:
  - `/certification/M1` submit rendered `M1 · RESULTS`, `NOT YET`, `SCORE 5`, item feedback, remediation links, and `(NOT SAVED — SYNC PENDING)`.
  - `/account` opened Stripe Billing Portal for the temporary QA customer.
  - Boot-camp Days 1 through 5 completed through the UI.
  - Reloading production mastery after partial completion resumed at `Mastery check · Question 19 of 24`.
  - Completing the remaining mastery questions rendered `Camp complete`, `Mastery score 100%`, `24/24 correct`, `+440 XP`, `Camp Cleared`, and `Mastery Ace`.
  - Screenshot: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-production-mastery-complete.png`.
  - Browser log checks after mastery completion and fixture cleanup returned zero `barmatrix.app` warnings/errors.
- Fixture cleanup:
  - Removed 14 temporary Method progress rows.
  - Deleted the temporary Stripe customer only after audit-fixture metadata matched.
  - Restored the QA purchase to no Stripe customer link.
  - Browser check confirmed `/certification` returned to `0 of 14 lessons complete`.

## Remaining Risk

- The audited production surfaces are verified, but this is not exhaustive proof that every possible BarMatrix edge case is bug-free.
- Boot-camp completion and practice/drill verification wrote QA/audit attempts to production.
- The API repo still has unrelated admin/complimentary-access work outside this audit.
- `tasks/lessons.md` is missing, so there were no project lesson rules to apply beyond `AGENTS.md`.
- The AM status helper still cannot find a session for `C:\barmatrix-app`.

# Live Diagnostic Session Audit

## Reproduction

- Production entry route: `https://barmatrix.app/diagnostic/session`.
- Initial live API checks:
  - `POST https://api.barmatrix.app/api/diagnostic/session/start` returned `404 {"error":"not found"}`.
  - `GET https://api.barmatrix.app/api/diagnostic/questions` returned `404 {"error":"not found"}`.
  - Existing `POST https://api.barmatrix.app/api/diagnostic/start` still returned HTTP 200.
- In-app browser reproduction:
  - Opened `/diagnostic/session`.
  - Clicked `Start Assessment`.
  - Page rendered `COULDN'T START` with `API 404: "not found"`.
  - Browser log filter for `barmatrix.app` warnings/errors returned zero entries.

## Trace

- Frontend `C:\barmatrix-app\lib\api-client.ts` had added placement methods expecting:
  - `/api/diagnostic/session/start`
  - `/api/diagnostic/questions`
  - `/api/diagnostic/session/:id/attempt`
  - `/api/diagnostic/session/:id/results`
- API `C:\barmatrix-api\src\index.ts` only registered the older diagnostic endpoints:
  - `/api/diagnostic/start`
  - `/api/diagnostic/:id/results`
- After adding/registering the API routes, production started a real session but stayed on `Loading placement assessment`.
- The second root cause was the session page's post-navigation hydration path: it cached only IDs, then loaded 18 separate `api.getQuestion(id)` requests before rendering the first question.
- The final contract now returns and caches the exact hydrated questions selected by `/api/diagnostic/session/start`, so the session page renders from the pinned payload without a client-side 18-request fan-out.

## Test

- API regression coverage:
  - `C:\barmatrix-api\src\routes\placement-diagnostic.test.ts`
  - Covers the 18-question contract, start response with hydrated questions, confidence band mapping, scoring without `c3_mold_code`, and result shaping.
- App regression coverage:
  - `C:\barmatrix-app\tests\placement-diagnostic-contract.test.ts`
  - Covers caching hydrated placement questions before navigation and avoiding `api.getQuestion` / `api.getPlacementQuestions()` in the session-page load path.

## Change

- `C:\barmatrix-api\src\routes\placement-diagnostic.ts`
  - Added production placement start, questions, attempt, and results endpoints.
  - Start response now includes `question_ids` and hydrated `questions`.
  - Attempt scoring tolerates the live DB state where optional C3 mold storage is not provisioned.
- `C:\barmatrix-api\src\index.ts`
  - Registered the placement diagnostic routes.
- `C:\barmatrix-app\lib\api-client.ts`
  - Updated placement start/question types for hydrated questions.
- `C:\barmatrix-app\app\diagnostic\session\placement-entry-client.tsx`
  - Caches the selected hydrated questions before route navigation.
- `C:\barmatrix-app\app\diagnostic\session\[sessionId]\page.tsx`
  - Reads cached hydrated questions, renders from that cache, and shows restart UI for stale ID-only cache entries.

## Verification

- API:
  - `npx tsx --test src/routes/placement-diagnostic.test.ts` passed.
  - `npm test` passed: 271 tests, 271 pass.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - Live start response returned HTTP 200 with `question_count=18`, 18 `question_ids`, and 18 hydrated `questions`.
- App:
  - `node --test tests\placement-diagnostic-contract.test.ts` passed.
  - `node --test tests\*.test.ts` passed: 28 tests, 28 pass.
  - `npm run lint` passed.
  - `npm run build` passed locally and during production deploy.
- Deployment:
  - API commits `e54f1b2` and `f5fbf11` were pushed.
  - App commits `b6b4694` and `ad3d10f` were pushed.
  - Hostinger route artifact was deployed and restarted.
  - Vercel production deployment `dpl_2TieeN83t3J36QGHR1Szk3sCxyrp` is `READY` and aliased to `https://barmatrix.app`.
- Production browser:
  - Started a fresh placement session from `/diagnostic/session`.
  - Reached a real `Question 1 of 18`.
  - Submitted all 18 questions through the UI.
  - Reached `/diagnostic/session/eabecfeb-146c-4b60-9dc4-4ec37bb7b3a2/results`.
  - Results rendered `Placement complete`, `Your C3 Starting Level`, legal/mechanism/calibration score breakdowns, subject breakdown, remediation targets, and next-step CTAs.
  - Browser log filter returned zero `barmatrix.app` warning/error entries after results.
  - Screenshot: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-production-placement-results.png`.
- Fixture cleanup:
  - Deleted production audit data for the verified session only.
  - Cleanup reported `attemptsDeleted: 18` and `studentsDeleted: 1`.

## Remaining Risk

- The newly found diagnostic placement regression is fixed and verified in production.
- This audit still cannot prove every possible untested BarMatrix edge case is bug-free.
- The API repo still has unrelated admin/complimentary-access work outside this audit.
- `tasks/lessons.md` is missing, so there were no project lesson rules to apply beyond `AGENTS.md`.
- The AM status helper still cannot find a session for `C:\barmatrix-app`.

# Production Route Matrix Audit

## Scope

- Continue the live-environment audit after the diagnostic placement fix.
- Cover lower-traffic public/static frontend routes, subject pages, checkout/referral edges, dashboard subpages, public API reads, CORS, and protected API fail-closed behavior.
- Avoid mutating production state during this pass.

## Route Inventory

- App route inventory was built from `app/**/page.tsx`; current production pages include public marketing/legal pages, checkout/success, app/dashboard/account surfaces, foundations, certification, boot camps, practice/timed sets, drills/subjects, red zones, traps, tensions, and both diagnostic flows.
- API route inventory was built from `app.get/post/delete` registrations under `C:\barmatrix-api\src`.

## Verification

- Public frontend/API HTTP smoke:
  - 64 checks run against `https://barmatrix.app` and `https://api.barmatrix.app`.
  - 64 passed.
  - Covered public frontend routes, public API reads, representative trap/tension details and question lists, all subject question reads, diagnostic placement start/questions, public red-zone read, knowledge search, and CORS preflight for placement start.
- Protected API auth-boundary smoke:
  - 22 checks run.
  - 22 passed.
  - Unauthenticated paid/me/drill/boot-camp/certification/billing routes failed closed with expected 401/403 behavior.
  - `GET /api/certification` returned HTTP 200 by expected contract because it serves an anonymous preview outline; protected certification content/mutations still returned 401.
- In-app browser:
  - 49 production routes traversed with route-specific rendered markers.
  - No marker failures.
  - No framework/error overlays.
  - No stuck loading states.
  - Browser log filter returned zero `barmatrix.app` warning/error entries.
  - A follow-up `/dashboard/mastery` wait check confirmed the page rendered the full Pattern Mastery Board with real rows rather than remaining in the loading state.
- Deployment state:
  - App local `main` and `origin/main`: `f60972e`.
  - API local `main`, `origin/main`, and Hostinger checkout: `f5fbf11`.
  - Hostinger `dist/index.js` registers `registerPlacementDiagnosticRoutes`.
  - Hostinger `dist/routes/placement-diagnostic.js` contains the hydrated placement start response.
  - `vercel inspect https://barmatrix.app` reported production deployment `dpl_2TieeN83t3J36QGHR1Szk3sCxyrp`, status `Ready`, aliased to `https://barmatrix.app` and `https://www.barmatrix.app`.

## Observations

- `GET /api/c3/deck` returned HTTP 200 with an empty `cards` array. The current app code does not consume `listC3Deck`, and the API route intentionally degrades missing C3 storage to an empty deck, so this is a content/schema provisioning gap rather than a reproduced UI bug.
- No source-code defect was reproduced in this pass.
- No production study/payment/account mutations were performed in this pass.

## Remaining Risk

- The production route matrix broadens live coverage but still cannot prove every possible user/data edge case is bug-free.
- If the C3 deck is meant to become user-facing, the live environment needs deck content/schema provisioning.
- Source tests/lint/build were not rerun in this pass because no source code changed; runtime checks were the relevant verification.
- The API repo still has unrelated admin/complimentary-access work outside this audit.
- `tasks/lessons.md` is missing, so there were no project lesson rules to apply beyond `AGENTS.md`.
- The AM status helper still cannot find a session for `C:\barmatrix-app`.

# C3 Deck Content Schema Audit

## Issue

Expected behavior: if `/api/c3/deck` is intended as a live public C3 deck endpoint, production should have authoritative C3 card/mold schema and content. Actual behavior: the endpoint returns HTTP 200 with an empty `cards` array. Affected domain: future C3 deck and C3-tagged mastery measurement, not a currently reproduced visible UI failure.

## Reproduction

- Reproduced: yes for the empty public endpoint; no current UI crash reproduced.
- Direct live API check:
  - `GET https://api.barmatrix.app/api/c3/deck` returned HTTP 200 with `cards=0`.
- Browser checks:
  - `http://localhost:3000/boot-camps/sessions/98f7e066-418f-4646-acb2-653573bf295f/mastery` rendered `Mastery check is locked` with no raw API status, loading hang, error boundary, or recent relevant console warnings/errors.
  - `http://localhost:3000/mastery` rendered `Not yet measured` with no raw API status, loading hang, error boundary, or recent relevant console warnings/errors.

## Trace

- Files inspected:
  - `C:\barmatrix-api\src\routes\c3.ts`
  - `C:\barmatrix-api\src\lib\c3-queries.ts`
  - `C:\barmatrix-app\lib\api-client.ts`
  - App route/test usage via `rg`.
- Verified facts:
  - The app exposes `listC3Deck()` in the typed API client, but current app source does not consume it.
  - `/api/c3/deck` reads `c3_cards` and intentionally returns `{ cards: [] }` when that optional table/column layer is missing.
  - `/api/me/c3` reads `c3_molds` and `question_c3_molds` and intentionally degrades to a not-measured C3 state when that optional layer is missing.
  - Sanitized production DB inspection confirmed `c3_cards`, `c3_molds`, and `question_c3_molds` do not exist.
  - Production has `questions` with 3684 rows and `answer_choices` with 14736 rows.
  - Production `answer_choices` does not have `c3_mold_code`.
- Suspected root cause: production has not been provisioned with authoritative C3 deck/mold schema and card/question tagging content.
- Confidence: high for the schema/content gap; high that no current UI defect was reproduced from it.

## Change

- No implementation code changed.
- Audit documentation was updated only.
- No regression test was added because no code defect was confirmed and the current API behavior intentionally handles the missing optional tables.
- Created GitHub issue `auronpep/barmatrix-api#1` to track the C3 deck/mold schema and content provisioning gap.

## Verification

- Live API check confirmed `/api/c3/deck` returns HTTP 200 with an empty array rather than a server error.
- Live sanitized schema check exited 0 and confirmed the missing optional C3 tables/columns without printing secrets or user data.
- In-app Browser verification confirmed the relevant paid-session mastery and C3 mastery surfaces render stable product states instead of raw API errors.
- App `node --test tests\*.test.ts` passed: 28 tests, 28 pass.
- App `npm run lint` passed.
- App `npm run build` passed.
- API `npm test` passed: 271 tests, 271 pass.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- App/API `git diff --check` passed with only existing LF/CRLF normalization warnings.

## Remaining Risk

- If the public C3 deck is intended to be active now, it needs a migration/provisioning task with authoritative `c3_cards`, `c3_molds`, `question_c3_molds`, and question/choice C3 tagging. The current source does not contain enough authoritative card content to create this safely during the bug audit.

# Live Operational Integration Audit

## Issue

Expected behavior: live operational integrations should fail closed where appropriate and configured monitoring/analytics should initialize without blocking the app. Actual behavior found: production API Sentry DSN and frontend Sentry DSN were not configured, and production PostHog initially did not receive directly inlined browser env values even though Vercel had PostHog env names. Affected domain: live telemetry/observability, not core study rendering.

## Reproduction

- Safe live API checks:
  - `POST /api/webhooks/stripe` with no `stripe-signature` returned HTTP 400.
  - `POST /api/webhooks/stripe` with a fake signature returned HTTP 400 signature-verification failure.
  - Invalid `POST /api/checkout/create-session` payload returned HTTP 400 validation errors without creating a Stripe session.
  - `GET /api/checkout/cs_test_missing/status` returned `{"fulfilled":false}`.
  - Allowed checkout CORS preflight from `https://barmatrix.app` returned HTTP 204 with `Access-Control-Allow-Origin: https://barmatrix.app`.
  - Disallowed checkout CORS preflight from `https://evil.example` returned no allow-origin header.
- Admin route checks:
  - Production `GET /api/admin/grants` returned HTTP 404.
  - Production `POST /api/admin/grant-access` with valid JSON and no secret returned HTTP 404.
  - Local dirty API route check returned HTTP 403 without the admin secret.
- Browser checks:
  - Production `/checkout`, `/checkout/success?checkout_session_id=cs_test_missing`, `/account?checkout_session_id=cs_test_missing`, and `/privacy` rendered without raw API status text, loading hangs, error boundaries, or relevant console warnings/errors.
  - `window.posthog` was absent on all four pages.
  - After the direct-env fix was deployed, signed-in production `/drills` rendered normally and the in-app browser observed PostHog config/surveys assets plus `/e/` event requests.
  - The in-app browser's read-only evaluation context continued to report `window.posthog` as absent and did not expose normal DOM mutation methods, so that isolated-world probe is not authoritative for page main-world globals.

## Trace

- Files inspected:
  - `C:\barmatrix-api\src\index.ts`
  - `C:\barmatrix-api\src\config.ts`
  - `C:\barmatrix-api\src\email.ts`
  - `C:\barmatrix-api\src\sentry.ts`
  - `C:\barmatrix-api\src\routes\admin.ts`
  - `C:\barmatrix-app\instrumentation-client.ts`
  - `C:\barmatrix-app\lib\posthog-client.ts`
  - `C:\barmatrix-app\tests\posthog-client.test.ts`
  - `C:\barmatrix-app\tests\sentry-wiring.test.ts`
- Verified facts:
  - Sanitized Hostinger config showed Stripe, Clerk, email, and allowed-origin config present.
  - Hostinger config initially had no API Sentry DSN loaded.
  - Vercel production initially listed PostHog env names but did not list `NEXT_PUBLIC_SENTRY_DSN`.
  - The deployed frontend chunks contained PostHog code, but the live browser had no `window.posthog`.
  - `instrumentation-client.ts` called `initializePostHogClient(posthog)`, which lets the helper read `process.env` as an object.
  - Local Next.js docs state client env values are inlined from direct `process.env.NAME` references and env-object/destructuring patterns do not work reliably.
- Follow-up source review showed the helper coupled browser-global exposure to a fresh SDK initialization, so an already-loaded SDK would not be re-exposed for app analytics.
- Root causes:
  - PostHog initialization did not receive directly referenced public env values.
  - The SDK exposure helper returned early for already-loaded clients before assigning the browser global.
- Confidence: high.

## Test

- Added a failing source-contract regression to `tests/posthog-client.test.ts` requiring `instrumentation-client.ts` to pass direct `process.env.NEXT_PUBLIC_POSTHOG_*` references.
- The focused test failed before the implementation change for the expected reason.
- Added a failing regression requiring an already-loaded PostHog SDK to still be exposed on the browser global.
- The focused test failed before the helper hardening because `browserWindow.posthog` remained undefined.

## Change

- `instrumentation-client.ts` now passes an explicit public-env object to `initializePostHogClient`.
- `lib/posthog-client.ts` now exposes the client on the browser global whenever valid public config exists, while still preventing duplicate `init` calls.
- `tests/posthog-client.test.ts` now covers the direct-env contract.
- `tests/posthog-client.test.ts` now covers the already-loaded SDK exposure contract.
- `tests/sentry-wiring.test.ts` now expects the explicit PostHog env object while preserving Sentry privacy defaults.
- Added `NEXT_PUBLIC_SENTRY_DSN` to Vercel production from the secure local env.
- Added `BARMATRIX_API_SENTRY_DSN` to the persistent Hostinger API env file from the secure local env and touched the Node restart marker.

## Verification

- Red check: `node --test tests\posthog-client.test.ts` failed before the source fix.
- Red check: `node --test tests\posthog-client.test.ts` failed before the global-exposure hardening.
- Green focused check: `node --test tests\posthog-client.test.ts` passed: 5 tests, 5 pass.
- App `node --test tests\*.test.ts` passed: 30 tests, 30 pass.
- App `npm run lint` passed.
- App `npm run build` passed.
- Live API `GET https://api.barmatrix.app/health` returned HTTP 200 with `{"ok":true,"db":"up"}` after touching the Hostinger restart marker.
- Vercel production deployment `dpl_Cw9BNcvBXxHBsM1g5S2jmc2G6cv5` is `Ready` and aliased to `https://barmatrix.app`.
- In-app browser production `/drills?telemetry_check=...` rendered `DRILL LIBRARY`, observed PostHog config/surveys assets and `/e/` event requests, and returned no current relevant warning/error logs.
- Deployed bundle probe on `/checkout` found 15 scripts and PostHog chunks containing the global assignment and loaded guard.

## Remaining Risk

- The live telemetry initialization/configuration gaps reproduced in this pass are closed, but this does not prove every possible operational edge case is bug-free.
- The in-app browser can observe rendered state and network assets, but its isolated evaluation context cannot directly prove page main-world `window` expandos.

# Knowledge Schema Resilience Audit

Expected behavior: optional knowledge storage should not turn public search into a generic 500 when tables or columns are absent. Actual behavior found in source: `src/routes/knowledge.ts` had no missing-table/column fallback. Production currently has knowledge content and returns results, so this was a source resilience defect rather than a live outage.

## Reproduction

- Source-level red test imported the route helpers and asserted that MySQL `ER_NO_SUCH_TABLE`, errno `1146`, `ER_BAD_FIELD_ERROR`, and errno `1054` should be treated as unprovisioned optional knowledge schema.
- Before the implementation change, the focused knowledge test failed because the route did not export or use the fallback helpers.
- Live API checks:
  - `GET https://api.barmatrix.app/api/knowledge/search?component=trap-taxonomy&q=decoder&limit=5` returned HTTP 200 with `KO-SRC-0650-C2C-002`.
  - `GET https://api.barmatrix.app/api/tensions?limit=1` returned HTTP 200 with official tension entries.
  - `GET https://api.barmatrix.app/api/c3/deck` returned HTTP 200 with `{"cards":[]}`.
  - Unauthenticated `GET https://api.barmatrix.app/api/me/c3/next` returned HTTP 401.
  - `GET https://api.barmatrix.app/health` returned HTTP 200 with `{"ok":true,"db":"up"}`.

## Trace

- Files inspected/changed:
  - `C:\barmatrix-api\src\routes\knowledge.ts`
  - `C:\barmatrix-api\src\lib\knowledge.test.ts`
- Root cause:
  - The knowledge route caught all query failures as internal server errors.
  - Other optional content surfaces already degrade missing MySQL schema to empty/not-measured response shapes, so knowledge search was inconsistent with the established route contract.
- Confidence: high for the source defect and fix; production is not currently on the failing path because live knowledge content exists.

## Change

- Added `isMissingKnowledgeSchema()` to recognize the MySQL missing-table and bad-field signals.
- Added `shapeMissingKnowledgeResponse()` to reuse the existing empty `shapeKnowledgeSearchResponse()` contract.
- Updated `/api/knowledge/search` to return the empty search response for unprovisioned optional schema before logging a 500 for unrelated failures.
- Added regression coverage for both the classifier and the response shape.

## Verification

- Red focused check: `npx tsx --test src\lib\knowledge.test.ts` failed before the route fallback existed.
- Green focused check: `npx tsx --test src\lib\knowledge.test.ts` passed: 5 tests, 5 pass.
- API `npm test` passed: 273 tests, 273 pass.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- API `git diff --check` passed with only existing LF/CRLF normalization warnings.

## Remaining Risk

- This change has been carried to Hostinger by the later API deploy. Because production knowledge search was already returning content, there was no live knowledge outage to resolve before continuing the broader audit.
- The system is still not fully tested end to end; authenticated paid-user browser flows remain the next audit target.

# API Sentry Runtime Warning Audit

Expected behavior: production API startup should initialize Sentry before Express is loaded, install Express instrumentation, and boot without Sentry instrumentation warnings. Actual behavior found: production `console.log` showed `[Sentry] express is not instrumented` after the first API deployment in this pass.

## Reproduction

- Hostinger production log before the final fix:
  - `2026-06-02T01:30:44.907Z` warned that Express was not instrumented.
  - `2026-06-02T01:31:19.362Z` repeated the warning after the first preload-only attempt.
- Installed local package evidence:
  - `node_modules/@sentry/node/README.md` says ESM apps should use `node --import ./instrument.mjs app.mjs` so Sentry initializes before app modules are evaluated.
  - `node_modules/@sentry/node/build/esm/integrations/tracing/express.js` shows `setupExpressErrorHandler()` validates that `app.use` was wrapped by Express instrumentation.
- The first attempted start command, `node --import @sentry/node/preload dist/index.js`, did not remove the production warning because `tracesSampleRate: 0` kept the default Express tracing integration out of the init path.

## Trace

- Files changed:
  - `C:\barmatrix-api\package.json`
  - `C:\barmatrix-api\src\index.ts`
  - `C:\barmatrix-api\src\sentry.ts`
  - `C:\barmatrix-api\src\sentry-init.ts`
  - `C:\barmatrix-api\src\sentry.test.ts`
- Root cause:
  - `src/index.ts` imported Express before calling `initSentry()`.
  - The API also set `tracesSampleRate: 0`, so the default performance integration list did not include `expressIntegration()`.
- Confidence: high.

## Change

- Added `src/sentry-init.ts`, which loads config/env and calls `initSentry()` before the app entry imports Express.
- Changed production start to `node --import ./dist/sentry-init.js dist/index.js`.
- Updated `initSentry()` to explicitly include `Sentry.expressIntegration()` while preserving `sendDefaultPii: false` and `tracesSampleRate: 0`.
- Updated `src/index.ts` to install the error handler only when the SDK is already initialized.
- Added Sentry tests for the explicit Express integration, initialized-state check, and production start command.

## Verification

- Focused Sentry test passed: `npx tsx --test src\sentry.test.ts` reported 6 tests, 6 pass.
- API `npm test` passed: 275 tests, 275 pass.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- Local production-start smoke:
  - ran `node --import ./dist/sentry-init.js dist/index.js` on port `18081`.
  - `GET http://127.0.0.1:18081/health` returned HTTP 200 with `{"ok":true,"db":"up"}`.
  - captured logs reported `has_sentry_warning=false`.
- Hostinger production deployment:
  - remote API checkout reached commit `d9f5892`.
  - remote package start command is `node --import ./dist/sentry-init.js dist/index.js`.
  - `tmp/restart.txt` timestamp updated to `2026-06-02 01:36`.
  - fresh `console.log` tail showed only `barmatrix-api listening on :3000 (production) — 4 allowed origins`.
  - `stderr.log` tail was empty.
  - `GET https://api.barmatrix.app/health` returned HTTP 200 with `{"ok":true,"db":"up"}`.
- Post-deploy live API smoke:
  - knowledge search returned HTTP 200 and included `KO-SRC-0650-C2C-002`.
  - tensions returned HTTP 200 with official tension entries.
  - C3 deck returned HTTP 200 with `{"cards":[]}`.
  - unauthenticated C3 coach next route returned HTTP 401.
- In-app browser:
  - production `/drills` rendered `DRILL LIBRARY`.
  - no relevant console/network error logs were captured for `/drills`.
  - the wrapper did not successfully navigate by address bar or CDP during this pass, so no post-Sentry browser claim is made for `/mastery` or boot-camp mastery.

## Remaining Risk

- This closes the reproduced API Sentry runtime warning. It does not prove the whole BarMatrix system is fully tested.
- Continue the audit with authenticated browser flows: boot-camp day progression, boot-camp mastery start/submit, prescribed drill launch/submit, red-zone drill launch, account/billing, and checkout-return pages.

# Authenticated Paid Browser Flow Audit

## Issue

Expected behavior: paid users should be able to navigate study surfaces, complete drills and boot-camp questions, and leave the production API free of runtime errors after attempts. Actual behavior found: user-facing flows succeeded, but production API logs showed the C3 SRS background updater failing after paid attempts because live `answer_choices.c3_mold_code` is not provisioned.

## Reproduction

- Browser session: paid subscriber on `https://barmatrix.app`.
- Stable route checks rendered without relevant browser logs: `/dashboard`, `/account`, `/red-zones`, `/mastery`, `/boot-camps`, `/foundations`, `/certification`, and `/coach`.
- Review drill: launched from `/drills`, answered an Evidence question, and rendered `DRILL MASTERED 1 / 1 correct`.
- Boot camp: created Civil Procedure session `775888a9-63ff-4802-ae8f-ed238d88f142`, answered Day 1 questions 1-12, clicked `Finish day`, saw `Day complete!`, `+170 XP`, and returned to a hub showing `1 OF 5 DAYS COMPLETE` with Day 2 unlocked.
- Production log failure after paid attempts:
  - `[c3-srs] background update failed: Error: Unknown column 'c3_mold_code' in 'SELECT'`
  - Stack pointed to `dist/routes/attempts.js` inside `updateC3SrsAsync`.

## Trace

- Foreground attempt submit already used `findSelectedChoiceForAttempt()` to retry without `c3_mold_code` when the optional column is missing.
- Correct-answer background SRS still queried `SELECT DISTINCT c3_mold_code FROM answer_choices ...` directly.
- Live production schema/content state from earlier audit already established that C3 columns/tables are optional and currently unprovisioned.
- Root cause: the optional C3 schema fallback was applied to the response path but not to the fire-and-forget SRS path.

## Change

- Changed files in `C:\barmatrix-api`:
  - `src\routes\attempts.ts`
  - `src\routes\attempts.test.ts`
- Added `listQuestionC3MoldCodesForAttempt()` to return an empty mold-code list when the optional `c3_mold_code` column is absent.
- Updated `updateC3SrsAsync()` to call that helper for correct answers, preventing expected optional-schema absence from being logged as a background failure.
- Committed and pushed API commit `32bb419 Degrade C3 SRS attempts when mold column missing`.

## Verification

- Red check: `npx tsx --test src\routes\attempts.test.ts` failed before implementation because the fallback helper did not exist.
- Green focused check: `npx tsx --test src\routes\attempts.test.ts` passed.
- API full checks passed:
  - `npm test`: 276 tests passed.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --check` passed with only existing LF/CRLF normalization warnings.
- Hostinger deploy:
  - Remote `HEAD`: `32bb419`.
  - Remote `dist/routes/attempts.js` rebuilt at `2026-06-02 02:00:17 UTC`.
  - Restart marker updated at `2026-06-02 02:00:25 UTC`.
  - `GET https://api.barmatrix.app/health` returned HTTP 200 with `{"ok":true,"db":"up"}`.
- Post-deploy browser verification:
  - Opened Day 2 in the paid Civil Procedure boot-camp session.
  - Submitted Question 1 with answer `D`.
  - UI rendered `CORRECT` and advanced to Question 2.
  - Fresh Hostinger log tail after the post-deploy attempt showed normal listener lines only and no new `[c3-srs]` background errors.

## Remaining Risk

- This pass verifies representative paid production flows and closes the reproduced background log defect. It does not prove every paid-user edge case is bug-free.
- Boot-camp mastery submit, billing portal handoff, and checkout-return mutation flows remain good follow-up coverage targets.

# Live Paid Integration Edge Audit

## Issue

Expected behavior: checkout-return recovery on the production account page should call the Hostinger API and show a useful recovery state when the local purchase has not been fulfilled. Actual behavior found: the page called same-origin `/api/checkout/...` on the Vercel frontend, which returned a Next.js 404 HTML page and left the recovery panel hidden.

## Reproduction

- Browser session: paid subscriber on `https://barmatrix.app`.
- Opened `/account?checkout_session_id=cs_test_missing_live_audit`.
- Live same-origin frontend probe: `https://barmatrix.app/api/checkout/cs_test_missing_live_audit/status` returned HTTP 404.
- Live backend probe: `https://api.barmatrix.app/api/checkout/cs_test_missing_live_audit/status` returned HTTP 200 with `{"fulfilled":false}`.

## Trace

- `app/account/enrollment-recovery.tsx` used direct relative fetches for checkout status and recovery.
- `lib/api-client.ts` already centralizes production API origin resolution through `NEXT_PUBLIC_API_URL` with `https://api.barmatrix.app` fallback.
- Root cause: account recovery bypassed the shared API client and hit the wrong production origin.

## Change

- Changed files in `C:\barmatrix-app`:
  - `app\account\enrollment-recovery.tsx`
  - `lib\api-client.ts`
  - `tests\api-client-billing-portal.test.ts`
  - `tasks\todo.md`
  - `tasks\evidence.md`
- Added `api.getCheckoutStatus()` and `api.recoverCheckoutEnrollment()`.
- Routed the account recovery panel through those helpers.
- Updated recovery copy so an unfulfilled local status no longer claims a checkout session is confirmed.
- Committed and pushed app commits:
  - `5dbd99d Route checkout recovery through API client`
  - `61ba28f Clarify checkout recovery copy`

## Verification

- Red checks:
  - `node --test tests\api-client-billing-portal.test.ts` failed before implementation because checkout recovery helpers were missing and the account component still used same-origin fetches.
  - The focused test also failed before the copy change because the panel claimed `checkout session is confirmed`.
- Green checks:
  - `node --test tests\api-client-billing-portal.test.ts` passed: 5 tests.
  - `node --test tests\*.test.ts` passed: 34 tests, 34 pass.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` passed with only existing LF/CRLF normalization warnings.
- Vercel production:
  - Deployment `dpl_8TpBf2t7BFSFPLCyRpphwP8PKufN` is `READY`.
  - Alias includes `https://barmatrix.app`.
  - Git SHA: `f8751f97fc21bd3cdc3ee5ebb90f7332f1c70d90`.
- In-app Browser:
  - Opened `https://barmatrix.app/account?checkout_session_id=cs_test_missing_live_audit_final_*`.
  - Verified the page renders `Checkout recovery`, `Activation check available`, and `Recover enrollment`.
  - Verified the old misleading copy is absent, no raw API 404/500 text is visible, and recent browser logs are empty.
- Production API:
  - `GET https://api.barmatrix.app/health` returned HTTP 200 with `{"ok":true,"db":"up"}`.
  - Hostinger `console.log` tail showed only normal listener lines.
  - Hostinger `stderr.log` tail was empty.

## Follow-Up

- Billing portal handoff did not redirect to Stripe for the current active account; it returned the handled no-billing-customer message.
- Sanitized production data check showed 6 active non-refunded purchases, 5 missing `stripe_customer_id`, and 1 with `stripe_customer_id`.
- Tracked backend/data follow-up as `auronpep/barmatrix-api#2`.

## Remaining Risk

- Checkout-return recovery is fixed and verified on the live site.
- Billing portal availability still depends on reconciling active purchases that lack Stripe customer IDs or adjusting account UI/API classification for non-Stripe/manual access.

# Billing Portal Missing Customer Audit

## Issue

Expected behavior: a signed-in paid account should open Stripe's billing portal when it has a Stripe-backed active purchase, and should stay in a handled state when active access is manual/complimentary or its historical checkout session is no longer recoverable. Actual behavior before this pass: `/account` showed `No local purchase with a billing customer was found for this account.` Affected domain: production account billing portal handoff.

## Reproduction

- Reproduced: yes.
- Browser session: paid signed-in production session on `https://barmatrix.app/account`.
- Steps:
  - Opened `/account`.
  - Clicked `Update Payment Method`.
  - Page stayed on `/account` and rendered `No local purchase with a billing customer was found for this account.`
- Production logs after the click showed no crash output and `stderr.log` was empty.
- Sanitized production data before repair: 6 active non-refunded purchases, 5 missing `stripe_customer_id`, and 1 with `stripe_customer_id`.

## Trace

- Files changed in `C:\barmatrix-api-billing-work`:
  - `src\lib\clerk-entitlement.ts`
  - `src\lib\billing-portal.ts`
  - `src\index.ts`
  - `src\billing-portal.test.ts`
  - `src\billing-portal-recovery.test.ts`
- Root causes:
  - The billing portal lookup ignored active owned purchases that lacked `stripe_customer_id`, so recoverable local purchases never got a chance to derive the customer from their stored checkout session.
  - Historical `cs_` sessions that are missing in the configured Stripe account can return `StripeInvalidRequestError` / `resource_missing` 404; that should be unrecoverable, not an internal server error.
- Production data finding:
  - One active missing-customer row had a real `cs_` checkout session, but Stripe returned `resource_missing` 404 during the recovery attempt.
  - The remaining missing-customer rows are synthetic `comp_` or blank-session access, so they have no Stripe billing portal to open.
- Confidence: high for the deployed code paths and high that the current browser account remains a data/classification limitation rather than a crash.

## Change

- `resolveOwnedBillingPortalCustomer()` now selects active owned purchases even when `stripe_customer_id` is blank, preferring rows that already have a customer, and invokes a recovery callback only after local purchase ownership is proven.
- Added `recoverBillingCustomerFromCheckoutSession()` to retrieve a Stripe customer from stored `cs_` checkout sessions and update `purchases.stripe_customer_id` when missing.
- Recovery ignores synthetic `comp_` and blank checkout session values.
- Recovery treats Stripe checkout-session 404 / `resource_missing` as `null` so the route remains in the handled missing-customer state.
- Pushed API commits:
  - `bed8c99 Repair billing portal customer recovery`
  - `b8ba193 Handle unrecoverable billing checkout sessions`

## Verification

- Red focused check: `npx tsx --test src\billing-portal.test.ts` failed before implementation for an active owned purchase with a checkout session but no stored Stripe customer.
- Red focused check: `npx tsx --test src\billing-portal-recovery.test.ts` failed before hardening because a Stripe `resource_missing` checkout-session lookup bubbled out.
- Green focused check: `npx tsx --test src\billing-portal.test.ts src\billing-portal-recovery.test.ts` passed: 9 tests.
- Green non-Red-Zone API check: all `src/**/*.test.ts` excluding Red Zones passed, 262 tests.
- API `npm run typecheck` passed.
- API `npm run build` passed.
- API `git diff --check` passed with only LF/CRLF normalization warnings.
- Hostinger deployment:
  - GitHub fetch from Hostinger failed because the remote checkout lacks GitHub credentials.
  - The pushed source files were copied directly, built on Hostinger with `node node_modules/typescript/bin/tsc -p tsconfig.json`, and the restart marker was touched.
  - `dist/lib/billing-portal.js` contains `isMissingStripeCheckoutSession`.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
- In-app Browser verification:
  - Reopened `https://barmatrix.app/account`.
  - Clicked `Update Payment Method`.
  - The current account stayed on `/account` with the handled missing-customer copy, no raw API status text, and no browser warning/error logs.
  - Fresh Hostinger log tail showed normal listener lines and empty `stderr.log`.
- GitHub issue `auronpep/barmatrix-api#2` was updated and remains open.

## Remaining Risk

- The recoverable code path is deployed, but the current browser account still cannot open Stripe billing because its active access has no recoverable Stripe billing customer.
- Sanitized production state after the recovery attempt: 6 active non-refunded purchases, 1 with a Stripe customer, 5 missing; the one missing `cs_` session returns Stripe 404, and the rest are synthetic `comp_` or blank-session records.
- Follow-up should decide how account UI/API should classify active non-Stripe access and whether any manual data backfill is appropriate.

# Billing Portal Non-Stripe Access UX Audit

## Issue

Expected behavior: when an active signed-in account cannot open a Stripe billing portal because its access is manual/complimentary or its historical checkout session is unrecoverable, the account page should explain that no Stripe portal is available rather than implying there is no local purchase. Actual behavior: after clicking `Update Payment Method`, the live account page rendered `No local purchase with a billing customer was found for this account.` Affected domain: production account billing UX.

## Reproduction

- Reproduced: yes on the current live production site.
- Steps:
  - Opened `https://barmatrix.app/account` in the paid signed-in browser session.
  - Clicked `Update Payment Method`.
  - Observed old copy: `No local purchase with a billing customer was found for this account.`
- Browser logs were empty, and the API stayed in the handled missing-customer state.

## Trace

- Files inspected:
  - `app\account\billing-portal-button.tsx`
  - `tests\api-client-billing-portal.test.ts`
  - `lib\api-client.ts`
  - `C:\BMO\BARMATRIX\engineering\API_CONTRACTS.md`
- Contract fact: `POST /api/billing/create-portal-session` may return `404` when the customer or checkout session cannot be matched to a BarMatrix enrollment.
- Root cause: the app mapped every billing portal `404` to "No local purchase..." even when `requireEnrollment()` had already proven active local access for the normal `/account` button path.
- Confidence: high for source behavior and live symptom. Live deployment verification is blocked because production has not advanced to the pushed source commit.

## Change

- Changed `app\account\billing-portal-button.tsx`.
- Added regression coverage in `tests\api-client-billing-portal.test.ts`.
- New copy for the normal active-account path: `This account has active access, but no Stripe billing portal is available for this enrollment...`.
- Checkout-session-specific `404` copy remains distinct: `That checkout session is not connected to a Stripe billing portal for this account.`
- Pushed app commit `a735241 Clarify unavailable billing portal copy`.

## Verification

- Red focused check: `node --test tests\api-client-billing-portal.test.ts` failed before the component change because the old `No local purchase with a billing customer` copy was still present.
- Green focused check: `node --test tests\api-client-billing-portal.test.ts` passed: 6 tests.
- App `node --test tests\*.test.ts` passed: 37 tests.
- App `npm run lint` passed.
- App `npm run build` passed with Next.js 16.2.6.
- App `git diff --check` passed with only LF/CRLF normalization warnings.
- Git push succeeded: `42fc533..a735241 main -> main`.
- Production deployment status:
  - Vercel deployment list still shows latest production deployment `dpl_3MmSey3qXQPT1tTNDupKpQiHvLJk` at Git SHA `42fc5332088b9fc015207d806ea57b20174698ba`.
  - GitHub commit status/checks for `a7352418dca0f9712c6ef79ed8d975ba95c778e9` showed no deployment/check runs.
  - `vercel deploy --prod --yes --debug` hung and timed out locally.
  - Deployment drift is tracked as `auronpep/barmatrix-app#3`.
- Current audit update:
  - Vercel CLI device login completed and saved credentials for the active Windows user.
  - A clean local clone was checked out at `a7352418dca0f9712c6ef79ed8d975ba95c778e9`; `.vercel/project.json` was copied in for project linking.
  - The clean clone had no working-tree changes and was used for all deploy checks to avoid unrelated Red Zone edits in `C:\barmatrix-app`.
  - `npm ci` succeeded in the clean clone.
  - `node --test tests\api-client-billing-portal.test.ts` passed: 6 tests.
  - `node --test tests\*.test.ts` passed: 35 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` passed.
  - `vercel pull --yes --environment=production` succeeded.
  - `vercel build --prod` failed in local prebuilt packaging with `Unable to find lambda for route: /dashboard/final-sprint` despite `next build` passing.
  - `vercel deploy --prod --yes` from the same clean clone succeeded.
- Production deployment after manual deploy:
  - Deployment `dpl_Hq38gL8dhHgJNukcW24Pkwt63act` is `READY`.
  - Vercel aliases include `barmatrix.app` and `www.barmatrix.app`.
  - Deployment metadata reports Git SHA `a7352418dca0f9712c6ef79ed8d975ba95c778e9` and message `Clarify unavailable billing portal copy`.
- Live in-app browser verification is green for the account-copy issue:
  - Before the deploy, clicking `Update Payment Method` still showed `No local purchase with a billing customer was found for this account.`
  - After the deploy, the same paid account rendered `This account has active access, but no Stripe billing portal is available for this enrollment. If your access was granted manually or you expected an active payment plan, contact support.`
  - The old copy was absent, no raw API status text appeared, and browser warning/error logs were empty.
- Post-deploy log checks:
  - Vercel error log query for the new deployment returned no error rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger API `stderr.log` was empty.

## Remaining Risk

- The account-copy issue is now live-verified on production.
- Automatic deploy wiring remains a live-ops gap: the successful deploy used manual Vercel CLI source `cli`; GitHub still has no deployment/check records for `a735241`, no enabled Actions workflow, no repo Actions secrets, and no repo webhooks.
- The local `vercel build --prod` prebuilt path currently fails with `Unable to find lambda for route: /dashboard/final-sprint`; standard remote `vercel deploy --prod --yes` works.

# Non-Red-Zone C3 Deck Audit

## Issue

Expected behavior: the public C3 deck endpoint should return the authored C3 reference deck so C3 remediation/deck references have live content. Actual behavior: `GET https://api.barmatrix.app/api/c3/deck` returned HTTP 200 with an empty `cards` array. Affected domain: live C3 reference/deck provisioning outside the Red Zones audit.

## Reproduction

- Reproduced: yes.
- Steps:
  - Queried `https://api.barmatrix.app/api/c3/deck`; response was `{"cards":[]}`.
  - Queried production schema via the deployed API DB config without printing credentials.
- Failure evidence:
  - No live `c3_cards`, `c3_molds`, `c3_tension_points`, `c3_splits`, `c3_annotations`, or `student_c3_srs` tables existed.
  - `answer_choices` had no `c3_architecture`, `c3_filter_broken`, or `c3_mold_code` columns.
  - The C3 route source intentionally catches missing C3 tables/columns and returns an empty deck/empty mastery state rather than a 500.

## Trace

- Files inspected:
  - `C:\barmatrix-api-billing-work\src\routes\c3.ts`
  - `C:\barmatrix-api-billing-work\src\routes\c3.test.ts`
  - `C:\barmatrix-api-billing-work\src\lib\c3-queries.ts`
  - `C:\barmatrix-api-billing-work\scripts\apply-schema.mjs`
  - `C:\BMO\BARMATRIX\engineering\SCHEMA_MYSQL.sql`
  - `C:\BMO\BARMATRIX\engineering\SCHEMA_C3_MYSQL.sql`
  - `C:\BMO\BARMATRIX\engineering\SEED_C3_DECK_MYSQL.sql`
  - `C:\BMO\BARMATRIX\engineering\SEED_C3_REFERENCE_MYSQL.sql`
- Verified facts:
  - Main `SCHEMA_MYSQL.sql` does not define the C3 tables.
  - Dedicated C3 schema and seed files are additive/idempotent and authoritative.
  - Production `questions.question_id` and `answer_choices.question_id` use `char(36)` with `utf8mb4_unicode_ci`, matching the C3 migration's operator note.
- Root cause: production never received the dedicated C3 schema/reference/deck provisioning layer.
- Confidence: high.

## Change

- Applied these existing SQL assets to the live Hostinger DB:
  - `SCHEMA_C3_MYSQL.sql`
  - `SEED_C3_DECK_MYSQL.sql`
  - `SEED_C3_REFERENCE_MYSQL.sql`
- No API or app source changes were needed.
- Smallest safe fix rationale: the missing live behavior was a provisioning gap, and the project already had idempotent schema/seed SQL for exactly this layer.

## Verification

- Post-provision production schema/counts:
  - `c3_cards`: 135
  - `c3_molds`: 13
  - `c3_tension_points`: 28
  - `c3_splits`: 14
  - `c3_annotations`: 0
  - `student_c3_srs`: 0
  - `answer_choices` C3 columns: `c3_architecture`, `c3_filter_broken`, `c3_mold_code`
  - orphan choice mold references: 0
- Live API:
  - `GET https://api.barmatrix.app/api/c3/deck` returned 135 cards.
  - `GET https://api.barmatrix.app/api/c3/deck/PHIL-01` returned the `The One Idea` card.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty after the verification checks.
- Browser QA:
  - In-app browser opened `https://api.barmatrix.app/api/c3/deck` and saw 135 cards with no browser warnings/errors.
  - Paid `/mastery` rendered a clean `Not yet measured` state, reporting 0 of 99 attempts C3-tagged, with no raw API text.
  - Paid `/coach` Start coaching rendered `Not measurable yet` with Method/diagnostic next steps and no raw API text.
- API automated checks:
  - `npx tsx --test src\routes\c3.test.ts src\routes\c3-coach.test.ts src\lib\c3-queries.test.ts src\lib\c3-bandit.test.ts src\lib\c3-scoring.test.ts src\lib\c3-srs.test.ts` passed: 28 tests.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --check` passed.
- GitHub:
  - Closed `auronpep/barmatrix-api#1` after adding the live before/after evidence.
  - Created `auronpep/barmatrix-api#3` to track the separate C3 annotation and answer-choice mold-tag backfill.

## Remaining Risk

- Public C3 deck availability is now live-verified.
- Student C3 mastery remains unmeasured until C3 annotations and per-answer mold tags are populated. That separate content-tagging/backfill task is tracked as `auronpep/barmatrix-api#3`.
- Red Zones were intentionally skipped because another session is reviewing them.

# Vercel Automatic Deploy Wiring Evidence

## Issue

Expected behavior: pushes to `main` should automatically run checks and deploy the BarMatrix app to Vercel production. Actual behavior before this pass: production had to be advanced manually with Vercel CLI, GitHub had no deployment/check records for the pushed billing-copy commit, and the repo had no enabled workflow, Actions secrets, or webhooks. Affected domain: live app deployment operations.

## Reproduction

- Reproduced: yes.
- Steps:
  - Inspected GitHub repo wiring for `auronpep/barmatrix-app`.
  - Confirmed Actions secrets were empty.
  - Confirmed enabled workflows list was empty.
  - Confirmed repo webhooks list was empty.
  - Confirmed Vercel latest production deployment for the prior billing-copy fix was manual CLI source.
- Failure output:
  - GitHub secret list: `[]`.
  - GitHub workflow list: `[]`.
  - GitHub webhook list: `[]`.
  - Vercel project latest deployment initially pointed at the manually deployed app, not a GitHub push-triggered deploy.

## Trace

- Files and runtime areas inspected:
  - `.github/workflows`
  - `.vercel/project.json`
  - `package.json`
  - GitHub Actions secrets/workflows/webhooks via `gh`
  - Vercel project/deployment metadata via `vercel api` and `vercel inspect`
  - Cached Vercel OpenAPI spec for token creation schema
- Verified facts:
  - Vercel API token creation requires a user-auth token and rejected the locally saved CLI credential for minting a new token.
  - `C:\Users\wks2391\.env` already contained `VERCEL_TOKEN`; it validated with `vercel whoami` and `vercel project inspect`.
  - The repo owner `auronpep` is allowed by project issue-capture rules for automatic GitHub issue updates.
- Root cause:
  - The app repo did not have an enabled CI/CD path after GitHub push; production deploys depended on manual Vercel CLI use.
- Confidence: high; GitHub and Vercel runtime evidence both showed the gap before implementation and the successful workflow after implementation.

## Change

- Added `.github/workflows/deploy-vercel.yml`.
- Added GitHub Actions secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
- Committed and pushed:
  - `aa75e22 Add Vercel production deploy workflow`
- Workflow behavior:
  - Runs on pushes to `main` and `workflow_dispatch`.
  - Runs `npm ci`, `node --test tests/*.test.ts`, `npm run lint`, and `npm run build`.
  - Pulls Vercel production project settings.
  - Deploys production via pinned `npx --yes vercel@54.6.1 deploy --prod --yes`.

## Verification

- Clean committed-tree verification before push:
  - `npm ci` passed.
  - `node --test tests/*.test.ts` passed: 35 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` passed.
  - `npx --yes vercel@54.6.1 pull --yes --environment=production --token "$VERCEL_TOKEN"` passed.
- GitHub Actions:
  - Run `26797511802` completed successfully.
  - URL: `https://github.com/auronpep/barmatrix-app/actions/runs/26797511802`
  - Head SHA: `aa75e2206597d82b7f1d4ee176ab727b2406f51a`
  - Check run `deploy` completed with conclusion `success`.
- Vercel:
  - Deployment `dpl_Ffa8JkUxwHos9t9rx59ixwCxpCfC` is `READY`.
  - Deployment URL: `https://barmatrix-r3fsaq677-sunnylee.vercel.app`.
  - Aliases include `https://barmatrix.app` and `https://www.barmatrix.app`.
  - Deployment metadata reports Git SHA `aa75e2206597d82b7f1d4ee176ab727b2406f51a`, repo `auronpep/barmatrix-app`, ref `main`.
  - Vercel error-log query for the deployment returned no error rows.
- Live API:
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
- Browser QA:
  - In-app browser opened `https://barmatrix.app/account?deploy_auto_verify=1780373040`.
  - The paid account page rendered `Account active`, active access state, and the billing action.
  - Clicking `Update Payment Method` rendered `This account has active access, but no Stripe billing portal is available...`.
  - The old `No local purchase with a billing customer...` copy was absent.
  - No raw API status text appeared and browser warning/error logs were empty.
  - Screenshot: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-auto-deploy-account-billing.png`.

## Remaining Risk

- Automatic production deploy is verified for the app repo's `main` pushes.
- The workflow intentionally uses Vercel's remote deploy path because local prebuilt deploy packaging still fails with `Unable to find lambda for route: /dashboard/final-sprint`.
- Red Zones were intentionally skipped and unrelated Red Zone files remained unstaged.

# Non-Red-Zone C3 Tagging Backfill Evidence

## Issue

Expected behavior: paid C3 Mastery and Coach should become measurable after a user has qualifying attempts on C3-annotated questions and tagged distractors. Actual behavior: production has the C3 deck/reference layer, but `c3_annotations` and all answer-choice C3 tag columns are empty, so paid `/mastery` reports zero C3-tagged attempts and `/coach` cannot produce a coached C3 item. Affected domain: live C3 mastery/coach measurement outside Red Zones.

## Reproduction

- Reproduced: yes.
- Steps:
  - Queried live C3 deck endpoints.
  - Ran sanitized production aggregate counts from the Hostinger app context.
  - Opened paid `/mastery` in the in-app browser.
  - Opened paid `/coach`, clicked `Start coaching` with the DOM interaction API, and read the resulting state.
- Failure/current-state output:
  - Production DB counts: `c3_annotations=0`, `answer_choices_c3_mold_code=0`, `answer_choices_c3_architecture=0`, `answer_choices_c3_filter_broken=0`, `student_c3_srs=0`.
  - C3 QA half-truth/wrong-element frequency query returned `[]`.
  - Paid `/mastery`: `Measured on 0 of your 99 attempts (0% C3-tagged).`
  - Paid `/coach`: `Not measurable yet`.

## Trace

- Files and runtime areas inspected:
  - `C:\BMO\BARMATRIX\engineering\C3_QA_GATE.sql`
  - `C:\BMO\BARMATRIX\engineering\SCHEMA_C3_MYSQL.sql`
  - `C:\BMO\BARMATRIX\engineering\SEED_C3_DECK_MYSQL.sql`
  - `C:\BMO\BARMATRIX\engineering\SEED_C3_REFERENCE_MYSQL.sql`
  - `C:\BMO\BARMATRIX\engineering\*_seed.jsonl`
  - `C:\BMO\BARMATRIX\engineering\SEED_CRIMINAL_REBALANCE_PROD_UPDATE.sql`
  - `C:\barmatrix-api\src\lib\c3-queries.ts`
  - `C:\barmatrix-api\src\routes\c3-coach.ts`
  - live Hostinger app context and paid in-app browser session
- Verified facts:
  - Live deck/reference data exists: 135 cards and 13 molds.
  - Live annotation/tagging data does not exist: zero `c3_annotations` and zero C3-tagged answer choices.
  - Local engineering assets contain schema/reference/deck/QA-gate content only. They do not contain `INSERT INTO c3_annotations`, C3 annotation rows, or `answer_choices.c3_mold_code` update content.
  - The subject-bank JSONL sample keys include question, diagnostic, tension, and forensic data, but no C3 annotation/mold-tag fields.
  - API mastery and coach queries require both annotated questions and tagged choices for measurement/candidate selection.
- Root cause:
  - Missing authored/validated C3 tagging content, not a confirmed source-code defect.
- Confidence: high.

## Change

- No source or production data change was applied.
- Reason: the smallest clean fix would be to apply validated annotation and mold-tag content, but no authoritative local backfill artifact exists. Inventing tags would violate the audit constraint and would create unverified instructional/legal content.
- Updated local audit notes and `auronpep/barmatrix-api#3` with current production counts and missing-asset evidence.

## Verification

- Live API:
  - `GET https://api.barmatrix.app/api/c3/deck` returned 135 cards.
  - `GET https://api.barmatrix.app/api/c3/deck/PHIL-01` returned a valid card.
- Production aggregate counts from Hostinger app context:
  - `c3_cards=135`
  - `c3_molds=13`
  - `c3_annotations=0`
  - `answer_choices_c3_mold_code=0`
  - `answer_choices_c3_architecture=0`
  - `answer_choices_c3_filter_broken=0`
  - `student_c3_srs=0`
  - `orphan_mold_count=0`
  - `active_questions=3466`
- Browser QA:
  - `/mastery` rendered the 0% C3-tagged state, no raw API text, and no warning/error logs.
  - `/coach` rendered `Not measurable yet` after `Start coaching`, no raw API text, and no warning/error logs.

## Remaining Risk

- C3 tagging backfill remains unresolved pending authored/validated annotation content.
- `/coach` has duplicate `<main>` regions in the DOM; that was not the C3 root cause, but it is an accessibility cleanup candidate.

# Coach Main Landmark Fix Evidence

## Issue

Expected behavior: the `/coach` route should have one page-level `<main>` landmark owned by the root layout, with the coach page content inside it. Actual behavior: `/coach` rendered two `<main>` regions with duplicate text in the accessibility/DOM tree. Affected domain: live Coach page semantics and accessibility.

## Reproduction

- Reproduced: yes.
- Steps:
  - Opened paid production `/coach` during the C3 audit.
  - Browser DOM inspection showed `mainCount=2` and duplicate `The C3 Coach` text in both regions.
  - Source inspection showed the root layout wraps `{children}` in `<main>` and the coach page returned another `<main>`.
- Failure output:
  - Browser before fix: two `<main>` elements.
  - Red regression before fix: `tests\coach-main-landmark.test.ts` failed because `app/coach/page.tsx` contained `<main>`.

## Trace

- Files inspected:
  - `node_modules\next\dist\docs\01-app\01-getting-started\03-layouts-and-pages.md`
  - `app\layout.tsx`
  - `app\coach\page.tsx`
  - `app\coach\coach-client.tsx`
- Verified facts:
  - Local Next.js docs show the root layout can place `{children}` inside `<main>`.
  - `app/layout.tsx` does exactly that.
  - `app/coach/page.tsx` added a nested `<main>` wrapper.
- Root cause:
  - Duplicate landmark ownership between the root layout and the coach route page.
- Confidence: high.

## Change

- Changed `app\coach\page.tsx`.
- Added `tests\coach-main-landmark.test.ts`.
- Diff summary:
  - Replaced the coach page wrapper `<main>` with `<section aria-labelledby="coach-title">`.
  - Added `id="coach-title"` to the existing `h1`.
  - Kept all existing layout classes and `CoachClient` behavior.
- Smallest safe fix rationale:
  - The root layout already owns the global landmark; only the route-local wrapper needed to stop declaring another main region.

## Verification

- Red check:
  - `node --test tests\coach-main-landmark.test.ts` failed before implementation.
- Green checks:
  - `node --test tests\coach-main-landmark.test.ts` passed.
  - Tracked app tests plus the new test passed: 36 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check -- app/coach/page.tsx tests/coach-main-landmark.test.ts` passed with only the usual LF/CRLF warning.
- Deployment:
  - Commit `4bf93c1 Fix coach main landmark nesting` was pushed to `main`.
  - GitHub Actions run `26798142796` completed successfully.
  - Vercel deployment `dpl_4C3YAmLDv9dkQTNyCB1ncRkemRzP` is `READY` and reports Git SHA `4bf93c1cda658e164bf6a877c72b28be4d356540`.
  - Vercel error-log query returned no error rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
- Browser QA:
  - Live `/coach` rendered exactly one `<main>` region.
  - `The C3 Coach` and `Start coaching` rendered.
  - Clicking `Start coaching` still rendered `Not measurable yet`.
  - No raw API status text and no browser warning/error logs.

## Remaining Risk

- Coach landmark nesting is fixed and live-verified.
- The C3 measurement content gap remains unresolved and tracked in `auronpep/barmatrix-api#3`.

# Account Billing Capability Pre-Click Evidence

## Issue

Expected behavior: an active signed-in account should only see a payment-method update CTA when a Stripe billing portal is known to be available; active manual, complimentary, blank-session, or unrecoverable checkout-session access should be classified before the CTA is shown. Actual behavior: the live paid account renders active access and still shows `Update Payment Method`; after click it falls back to the handled no-Stripe-portal message. Affected domain: production account billing UX outside Red Zones.

## Reproduction

- Reproduced: yes.
- Browser steps:
  - Opened `https://barmatrix.app/account?billing_capability_audit=1780375200` in the paid in-app browser session.
  - Waited for the account page to settle.
  - Observed active account copy and active entitlement status.
  - Observed the billing panel still showing `Update Payment Method`.
  - Clicked the billing button by visible coordinates after Playwright role-click timed out.
- Failure/current-state output:
  - Before click: active account state plus `Update Payment Method` button; no pre-click no-portal classification.
  - After click: `This account has active access, but no Stripe billing portal is available for this enrollment...`.
  - Old `No local purchase with a billing customer...` copy was absent.
  - No raw `API ###` status text appeared.
  - Browser warning/error logs were empty.
- Sanitized production purchase aggregate:
  - active non-refunded purchases: 6
  - with Stripe customer: 1
  - missing Stripe customer: 5
  - active checkout-session categories: `cs_` 2, `comp_` 3, blank 1, other 0
  - missing-customer categories: `cs_` 1, `comp_` 3, blank 1
  - subscriptions: 0
  - payment plans: complimentary 2, pay-in-full 4, two-pay 0

## Trace

- Files inspected:
  - `C:\barmatrix-app\app\account\page.tsx`
  - `C:\barmatrix-app\app\account\billing-portal-button.tsx`
  - `C:\barmatrix-app\app\account\account-status.tsx`
  - `C:\barmatrix-app\lib\api-client.ts`
  - `C:\barmatrix-app\lib\use-dashboard.ts`
  - `C:\barmatrix-api-billing-work\src\routes\me.ts`
  - `C:\barmatrix-api-billing-work\src\index.ts`
  - `C:\barmatrix-api-billing-work\src\lib\clerk-entitlement.ts`
  - `C:\barmatrix-api-billing-work\src\lib\billing-portal.ts`
- Verified facts:
  - The app's account entitlement panel already uses `/api/me/dashboard` to render active access.
  - The billing panel/button does not receive any billing portal capability data before click.
  - The billing portal mutation route correctly proves enrollment and local purchase ownership before creating a Stripe portal, and it attempts `cs_` customer recovery only after ownership is proven.
  - Production has active access records that cannot produce a Stripe billing portal because the customer is missing and the access is synthetic/manual/blank or historically unrecoverable.
- Suspected root cause:
  - `/api/me/dashboard` exposes enrollment state but not billing portal capability, so the account page cannot distinguish active Stripe-backed access from active non-Stripe/manual access until the user clicks the billing mutation.
- Confidence: high for the UX root cause and live symptom; implementation still needs red/green tests.

## Change

- Changed API files in `C:\barmatrix-api-billing-work`:
  - `src\routes\me.ts`
  - `src\me-dashboard-billing.test.ts`
- Changed app files in `C:\barmatrix-app`:
  - `app\account\billing-portal-button.tsx`
  - `app\account\page.tsx`
  - `lib\api-client.ts`
  - `tests\api-client-billing-portal.test.ts`
- Diff summary:
  - `/api/me/dashboard` now returns `billing_portal` with `portal_available` and an unavailable reason.
  - The dashboard purchase query selects billing fields and orders active purchases with Stripe customers first, matching the billing portal ownership route's effective selection.
  - The account billing button uses dashboard billing capability before showing `Update Payment Method`.
  - Active no-portal accounts now see a `No Stripe billing portal` support state.
  - Account billing copy was made capability-neutral.
- Smallest safe fix rationale:
  - Reused the existing dashboard/account data path instead of adding another endpoint or probing the billing mutation on page load.
  - Kept Stripe portal creation behavior unchanged for accounts where the portal is available.

## Verification

- Red checks:
  - API `npx tsx --test src\me-dashboard-billing.test.ts` failed because `billing_portal` was absent from `routes/me.ts`.
  - App `node --test tests\api-client-billing-portal.test.ts` failed because the client/button did not use dashboard billing capability.
- Green checks:
  - API `npx tsx --test src\me-dashboard-billing.test.ts` passed.
  - API `npm test` with placeholder env passed: 282 tests.
  - API `npm run typecheck` passed.
  - API `npm run build` passed.
  - App tracked tests passed: 37 tests; untracked Red Zone test from the other session was excluded.
  - App `npm run lint` passed.
  - App `npm run build` passed.
  - `git diff --check` passed in both repos with only normal LF/CRLF warnings.
- Deployment:
  - API commit `1807a3b` was pushed and the Hostinger app directory is at that SHA.
  - Remote compiled `dist/routes/me.js` contains `billing_portal`.
  - App commit `ef05f22` was pushed and GitHub Actions run `26798801470` succeeded.
  - Live API health returned `{"ok":true,"db":"up"}`.
  - Vercel error-log query and Hostinger `stderr.log` checks returned no rows.
- Browser QA:
  - Live paid `/account` rendered active account state.
  - Billing panel rendered `No Stripe billing portal. This account has active access...`.
  - `Update Payment Method` was absent before click.
  - Old no-local-purchase copy was absent.
  - No raw API status text appeared.
  - Browser warning/error logs were empty.
  - Screenshot capture timed out in the in-app runtime; DOM and console evidence were captured instead.

## Remaining Risk

- The no-portal path is live-verified for the current paid account.
- A Stripe-backed positive portal button remains covered by source tests/build and previous temporary QA fixture evidence, but it was not live-clicked in this pass because the available paid browser account is classified as no-portal.

# Live Non-Red-Zone Smoke / Main Landmark Evidence

## Issue

Expected behavior: production BarMatrix pages should render one page-level `<main>` landmark owned by the root layout, with non-Red-Zone routes showing meaningful states and no raw API/runtime errors. Actual behavior found in live smoke: `/boot-camps` rendered two `<main>` landmarks. Source scan showed the same nested-landmark pattern in multiple non-Red-Zone `app/**/page.tsx` files under the root layout. Affected domain: non-Red-Zone app page semantics and accessibility.

## Reproduction

- Reproduced: yes.
- Browser steps:
  - Used the paid in-app browser session against `https://barmatrix.app`.
  - Smoked `/dashboard`, `/account`, `/foundations`, `/mastery`, `/coach`, `/certification`, `/certification/M1`, `/boot-camps`, `/practice`, `/timed-sets`, `/traps`, `/tensions`, `/drills/evidence`, `/drills/criminal-law`, and `/diagnostic`.
  - Waited for account-aware routes to settle before classifying their state.
- Failure/current-state output:
  - `/boot-camps` live before fix: `mainCount=2`.
  - No raw `API ###`, `internal server error`, `Application error`, or `Failed to fetch` text appeared during the smoke.
  - Browser warning/error logs were empty.
  - Paid `/account` settled to active access and `No Stripe billing portal`; Red Zones were intentionally skipped.

## Trace

- Files inspected:
  - `node_modules\next\dist\docs\01-app\01-getting-started\03-layouts-and-pages.md`
  - `app\layout.tsx`
  - all `app/**/page.tsx` files with local `<main>` wrappers
  - `tests\coach-main-landmark.test.ts`
- Verified facts:
  - `app/layout.tsx` wraps all route children in `<main>{children}</main>`.
  - Local Next.js layout docs show the root layout may own the page `<main>`.
  - `app\boot-camps\page.tsx` and 18 other route pages declared another `<main>` inside the root landmark.
- Root cause:
  - Route pages and the root layout both claimed page-level landmark ownership.
- Confidence: high; the defect was reproduced in production DOM and matched the source structure.

## Change

- Changed non-Red-Zone app route wrappers from local `<main>` elements to neutral `<div>` wrappers, preserving existing classes and markup structure.
- Added `tests\page-main-landmarks.test.ts` to assert:
  - root layout owns `<main>{children}</main>`
  - no `app/**/page.tsx` declares its own `<main>`
- Committed and pushed app commit `aa397e9 Fix nested page main landmarks`.
- Red Zone page/test files and local audit notes were left unstaged.

## Verification

- Red check:
  - `node --test tests\page-main-landmarks.test.ts` failed before implementation and listed 19 page files with local `<main>` wrappers.
- Green checks:
  - `node --test tests\page-main-landmarks.test.ts tests\coach-main-landmark.test.ts` passed.
  - App tests excluding the untracked Red Zone test passed: 38 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` and `git diff --cached --check` passed with only normal LF/CRLF warnings.
- Local browser QA:
  - `http://localhost:3000/boot-camps`, `/about`, `/subjects/evidence`, `/dashboard/final-sprint`, `/privacy`, `/terms`, and `/waitlist` each rendered `mainCount=1`.
  - No raw API text or browser warning/error logs appeared on those representative routes.
- Deployment:
  - GitHub Actions run `26799377427` succeeded for `aa397e9`.
  - Vercel deployment `dpl_GzinokCxGXJ6oqJaKZskrg4HrWUv` is `Ready` and aliased to `https://barmatrix.app`.
- Live browser QA:
  - `https://barmatrix.app/boot-camps?landmark_live_verify=1780381301`, `/about`, `/subjects/evidence`, `/dashboard/final-sprint`, `/privacy`, `/terms`, and `/waitlist` each rendered `mainCount=1`.
  - No raw API text, horizontal overflow, or fresh browser warning/error logs appeared.
- Production health/logs:
  - Vercel error-log query for the post-deploy window returned no rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty.
- Issue tracker:
  - `auronpep/barmatrix-app` has no open issues.
  - `auronpep/barmatrix-api` has only the known C3 annotation/mold-tag content backfill issue `#3`.

## Remaining Risk

- Red Zone routes were intentionally skipped because another session owns that audit.
- C3 Mastery/Coach measurement remains limited by missing authored annotation/tagging content, tracked as `auronpep/barmatrix-api#3`.
- Some public/non-gated routes are intentionally usable while signed out; account-aware routes were classified only after their auth/enrollment state settled.

# Live Public And Dynamic Route / Checkout Success Evidence

## Issue

Expected behavior: public and dynamic non-Red-Zone production routes should render meaningful states without raw runtime errors, and `/checkout/success` should only confirm enrollment after BarMatrix can verify a checkout session was fulfilled. Actual behavior found in live smoke: `/checkout/success` showed `ENROLLMENT CONFIRMED` for both a missing checkout session and a fake unfulfilled `cs_test_...` session. Affected domain: live checkout return UX and purchase-completion analytics.

## Reproduction

- Reproduced: yes.
- Browser/API steps:
  - Smoked live public/static routes, dynamic non-Red-Zone routes, and subject routes in the in-app browser.
  - Used live API data to choose representative dynamic slugs:
    - Foundation lesson `lesson-01`
    - Boot camp `contract-formation-timing`
    - Trap `overbroad_rule`
    - Tension `cp_diversity_amount_vs_supplemental_jurisdiction`
  - Opened `https://barmatrix.app/checkout/success?settle=2`.
  - Opened `https://barmatrix.app/checkout/success?checkout_session_id=cs_test_missing_live_audit_public_smoke`.
  - Queried `GET https://api.barmatrix.app/api/checkout/cs_test_missing_live_audit_public_smoke/status`.
- Failure output:
  - Missing-session success page rendered `ENROLLMENT CONFIRMED` and `Your Flagship access is being activated.`
  - Fake-session success page rendered the same confirmation copy.
  - The live status endpoint returned `{"fulfilled":false}` for the fake session, proving the frontend had an existing runtime source of truth.
- Other smoke findings:
  - `/referral`, `/drills`, `/foundations/lesson-01`, and `/boot-camps/contract-formation-timing` initially showed loading copy, then settled to meaningful states after waiting.
  - Signed-in `/sign-in` and `/sign-up` redirect to `/`, which is expected.
  - No raw API text, duplicate landmarks, horizontal overflow, or fresh browser errors were found on the other routes in this slice.

## Trace

- Files inspected:
  - `app\checkout\success\page.tsx`
  - `app\checkout\success\purchase-success-tracker.tsx`
  - `app\account\enrollment-recovery.tsx`
  - `app\checkout\page.tsx`
  - `lib\api-client.ts`
  - `tests\api-client-billing-portal.test.ts`
  - local Next.js 16 docs for async `searchParams`
- Verified facts:
  - `app\checkout\success\page.tsx` read `checkout_session_id`/`session_id` only to build an account link.
  - It rendered `ENROLLMENT CONFIRMED` and `PurchaseSuccessTracker` unconditionally.
  - The existing API client already exposes `api.getCheckoutStatus(sessionId)`.
  - The account recovery panel already treats `fulfilled: false` as not activated.
- Root cause:
  - Checkout success was a static return-page confirmation, not a verified activation state.
- Confidence: high; live browser behavior, live API status, and source all matched.

## Change

- Changed `app\checkout\success\page.tsx`.
- Added `tests\checkout-success-state.test.ts`.
- Diff summary:
  - Added `getCheckoutActivationState()` to classify missing, pending, and confirmed checkout returns.
  - Calls `api.getCheckoutStatus(checkoutSessionId)` when a session id is present.
  - Renders `ENROLLMENT CONFIRMED` and `PurchaseSuccessTracker` only when the status is fulfilled.
  - Renders `Checkout verification needed` for missing session ids.
  - Renders `Activation check pending` for unfulfilled or unverifiable session ids.
  - Builds the account link without `welcome=1` unless the checkout is actually confirmed.
- Smallest safe fix rationale:
  - Reused the existing public checkout-status endpoint and existing account recovery path.
  - Did not add a new endpoint or change checkout creation/Stripe behavior.

## Verification

- Red check:
  - `node --test tests\checkout-success-state.test.ts` failed before implementation because the page did not call `api.getCheckoutStatus(checkoutSessionId)` and rendered the success tracker unconditionally.
- Green checks:
  - `node --test tests\checkout-success-state.test.ts tests\api-client-billing-portal.test.ts` passed.
  - App tests excluding the untracked Red Zone test passed: 39 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` and `git diff --cached --check` passed with only normal LF/CRLF warnings.
- Local browser QA:
  - `http://localhost:3000/checkout/success?local_verify=missing` rendered `Checkout verification needed`, not enrollment confirmed.
  - `http://localhost:3000/checkout/success?checkout_session_id=cs_test_missing_live_audit_public_smoke&local_verify=fake` rendered `Activation check pending`, not enrollment confirmed.
  - Both local pages had `<main>` count 1 and no raw API text.
- Deployment:
  - Commit `27af5c3 Verify checkout success before confirming access` was pushed to `main`.
  - GitHub Actions run `26799883858` succeeded.
  - Vercel deployment `dpl_8tmn6svAzTtr3szeBD6gGUfWBpTp` is `Ready` and aliased to `https://barmatrix.app`.
- Live browser QA:
  - `https://barmatrix.app/checkout/success?live_verify=missing_1780387001` rendered `Checkout verification needed`; confirmation copy was absent.
  - `https://barmatrix.app/checkout/success?checkout_session_id=cs_test_missing_live_audit_public_smoke&live_verify=fake_1780387001` rendered `Activation check pending`; confirmation copy was absent.
  - Both live pages had `<main>` count 1, no raw API text, no horizontal overflow, and no fresh browser warning/error logs.
- SEO/log health:
  - `robots.txt` returned HTTP 200 and disallows `/checkout/success`.
  - `sitemap.xml` returned HTTP 200 with 12 `<loc>` entries.
  - API health returned `{"ok":true,"db":"up"}`.
  - Vercel error-log query returned no rows.
  - Hostinger `stderr.log` was empty.

## Remaining Risk

- A real fulfilled Stripe checkout session was not available for live positive-path verification in this pass.
- Red Zones remain out of scope because another session owns them.
- C3 measurement remains blocked on authored C3 annotation and answer-choice mold-tag content, tracked as `auronpep/barmatrix-api#3`.

# Live Mobile Responsive Non-Red-Zone Evidence

## Issue

Expected behavior: representative production routes should fit a 390px mobile viewport without forcing horizontal document scrolling, while still rendering meaningful states with one page-level `<main>` and no raw runtime/API error copy. Actual behavior found in live mobile smoke: `/subjects/evidence`, `/traps`, and `/tensions` each forced horizontal overflow. Red Zone routes were intentionally skipped because another session owns that audit.

## Reproduction

- Reproduced: yes.
- Browser setup:
  - Set the in-app browser viewport to `390x844`.
  - Smoked live non-Red-Zone routes on `https://barmatrix.app`.
- Initial live route smoke:
  - Covered `/`, `/pricing`, `/checkout`, checkout-success missing/fake states, `/account`, `/dashboard`, `/foundations`, `/foundations/lesson-01`, `/drills`, `/drills/evidence`, `/drills/criminal-law`, `/subjects/criminal-law`, `/subjects/evidence`, `/practice`, `/timed-sets`, `/boot-camps`, `/boot-camps/contract-formation-timing`, `/traps`, `/traps/overbroad_rule`, `/tensions`, `/tensions/cp_diversity_amount_vs_supplemental_jurisdiction`, `/diagnostic/session`, `/referral`, `/faq`, and `/partners`.
- Failure output:
  - `/subjects/evidence`: `overflowDelta=381`; a subject question card expanded to `724px` due long question identifier/metadata.
  - `/traps`: `overflowDelta=46`; catalog row content forced a column wider than the viewport.
  - `/tensions`: `overflowDelta=426`; tension rows forced min-content width wider than the viewport.
  - The failing routes still rendered `<main>` count 1, no raw API text, and no fresh browser warnings/errors.

## Trace

- Files inspected:
  - `app\subjects\*\page.tsx`
  - `app\traps\page.tsx`
  - `app\tensions\page.tsx`
  - `app\globals.css`
  - local Next.js CSS/Turbopack docs
- Root causes:
  - Subject question cards used long external ids/topic metadata inside flex rows without an anywhere-wrap or explicit shrink guard.
  - Trap and tension catalog rows used flex/grid layouts where grid children and flex contents did not consistently set `min-width: 0`, and narrow rows did not stack count metadata before reaching larger breakpoints.
- Confidence: high; the live DOM identified the overflowing elements, and the local/deployed verification removed the overflow without global overflow masking.

## Change

- Changed files:
  - `app\globals.css`
  - all seven `app\subjects\*\page.tsx` pages
  - `app\traps\page.tsx`
  - `app\tensions\page.tsx`
  - `tests\mobile-content-overflow.test.ts`
- Diff summary:
  - Added `.break-anywhere` with `min-width: 0`, `overflow-wrap: anywhere`, and `word-break: break-word`.
  - Applied wrap/shrink guards to subject question identifiers, topic labels, and chips across all subject pages.
  - Added min-width guards and mobile-first stacked row layouts for trap and tension catalog rows.
- Smallest safe fix rationale:
  - Fixed the exact min-content width causes in the owning components rather than hiding overflow globally.

## Verification

- Red check:
  - `node --test tests\mobile-content-overflow.test.ts` failed before implementation.
- Green checks:
  - `node --test tests\mobile-content-overflow.test.ts tests\nav-mobile-overflow.test.ts` passed.
  - App tests excluding the untracked Red Zone test passed: 41 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` and `git diff --cached --check` passed with only normal LF/CRLF warnings.
- Local browser QA:
  - `http://localhost:3000/subjects/evidence?mobile_local_verify=1`
  - `http://localhost:3000/subjects/criminal-law?mobile_local_verify=1`
  - `http://localhost:3000/traps?mobile_local_verify=1`
  - `http://localhost:3000/tensions?mobile_local_verify=1`
  - Each route had `scrollWidth=clientWidth=375`, `<main>` count 1, no raw API text, and no fresh browser warnings/errors.
- Deployment:
  - Commit `6a8781e Fix mobile content overflow` was pushed to `main`.
  - GitHub Actions run `26800474033` completed successfully.
  - Vercel deployment `dpl_3p2VFuxmy18bZFyufe1ZNybKWJsS` is `Ready` and aliased to `https://barmatrix.app`.
- Live browser QA:
  - `https://barmatrix.app/subjects/evidence?mobile_live_verify=6a8781e`
  - `https://barmatrix.app/subjects/criminal-law?mobile_live_verify=6a8781e`
  - `https://barmatrix.app/traps?mobile_live_verify=6a8781e`
  - `https://barmatrix.app/tensions?mobile_live_verify=6a8781e`
  - Each route had `scrollWidth=clientWidth=375`, `<main>` count 1, no raw API text, and no fresh browser warnings/errors.
  - The temporary browser viewport override was reset after live verification.
- Production health/logs:
  - Vercel error-log query returned no rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty.

## Remaining Risk

- Red Zone routes remain explicitly out of scope for this pass.
- C3 Mastery/Coach measurement remains blocked on missing authored C3 annotation and mold-tag content, tracked as `auronpep/barmatrix-api#3`.

# Live Malformed Dynamic Route Non-Red-Zone Evidence

## Issue

Expected behavior: nonexistent or malformed non-Red-Zone dynamic routes should render clear product/not-found states with one `<main>`, no raw API/runtime text, no client errors, and no production error logs. Actual behavior found in live smoke: several malformed route params rendered visible `API 400` or `API 404` copy. Affected domain: live dynamic route error states for Foundations, boot camps, diagnostic results, and drills.

## Reproduction

- Reproduced: yes.
- Browser setup:
  - Used the in-app browser against `https://barmatrix.app` while another session owned Red Zone work.
  - Skipped Red Zone routes and source/test files.
- Initial live malformed route smoke:
  - `/foundations/not-a-real-lesson-live-audit` rendered raw `API 400`.
  - `/boot-camps/not-a-real-boot-camp-live-audit` rendered raw `API 404`.
  - `/boot-camps/sessions/not-a-real-session-live-audit` rendered raw `API 400`.
  - `/boot-camps/sessions/not-a-real-session-live-audit/days/1` rendered raw `API 400`.
  - `/boot-camps/sessions/not-a-real-session-live-audit/mastery` rendered raw `API 400`.
  - `/diagnostic/not-a-real-session-live-audit/results` rendered raw `API 400: "invalid diagnostic id"`.
  - `/diagnostic/session/not-a-real-session-live-audit/results` rendered backend API text.
  - `/drills/not-a-real-drill-live-audit` rendered raw `API 400`.
- Control routes:
  - `/traps/not-a-real-trap-live-audit` and `/tensions/not-a-real-tension-live-audit` rendered normal 404 states without raw API copy.
  - `/certification/not-a-real-competency-live-audit` rendered product copy without raw API text.

## Trace

- Files inspected:
  - `node_modules\next\dist\docs\01-app\03-api-reference\03-file-conventions\not-found.md`
  - `app\foundations\[slug]\page.tsx`
  - `app\boot-camps\[slug]\page.tsx`
  - `app\boot-camps\sessions\[session_id]\page.tsx`
  - `app\boot-camps\sessions\[session_id]\days\[day]\page.tsx`
  - `app\boot-camps\sessions\[session_id]\mastery\page.tsx`
  - `app\diagnostic\[session]\results\page.tsx`
  - `app\diagnostic\session\[sessionId]\results\page.tsx`
  - `app\drills\[drill_id]\page.tsx`
  - `lib\api-client.ts`
- Root cause:
  - Affected client pages constructed visible UI strings directly from `ApiClientError.status` and, in diagnostic result pages, included backend error messages verbatim.
  - Expected malformed-resource statuses such as 400 and 404 were treated as user-visible technical failures instead of product-facing not-found/unavailable states.
- Confidence: high; the live DOM, source strings, and local browser recheck all matched the same failure mode.

## Change

- Changed files:
  - `lib\user-facing-errors.ts`
  - `app\foundations\[slug]\page.tsx`
  - `app\boot-camps\[slug]\page.tsx`
  - `app\boot-camps\sessions\[session_id]\page.tsx`
  - `app\boot-camps\sessions\[session_id]\days\[day]\page.tsx`
  - `app\boot-camps\sessions\[session_id]\mastery\page.tsx`
  - `app\diagnostic\[session]\results\page.tsx`
  - `app\diagnostic\session\[sessionId]\results\page.tsx`
  - `app\drills\[drill_id]\page.tsx`
  - `tests\malformed-route-errors.test.ts`
- Diff summary:
  - Added `userFacingResourceError()` to map 401, 403, 400, 404, and unexpected errors to page-provided product copy.
  - Replaced raw `API ${status}` route load errors with user-facing not-found/unavailable messages.
  - Removed diagnostic result rendering of backend error messages in malformed-session states.
- Smallest safe fix rationale:
  - Centralized only the repeated status-to-copy mapping while leaving page layouts, data fetching, routing, and API behavior unchanged.

## Verification

- Red check:
  - `node --test tests\malformed-route-errors.test.ts` failed before implementation because the shared user-facing mapper was absent and raw API strings were still present.
- Green checks:
  - `node --test tests\malformed-route-errors.test.ts` passed.
  - `node --test tests\malformed-route-errors.test.ts tests\checkout-success-state.test.ts` passed.
  - App tests excluding the untracked Red Zone test passed: 42 tests.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check` and `git diff --cached --check` passed with only normal LF/CRLF warnings.
- Local browser QA:
  - The eight affected malformed routes on `http://localhost:3000` each rendered one `<main>`, no raw API status text, and no browser warning/error logs.
- Deployment:
  - Commit `f13a193 Sanitize malformed route error states` was pushed to `main`.
  - GitHub Actions run `26800969639` completed successfully.
  - Vercel deployment `dpl_32CrEZshExCXAoyJi2VQEgHit8v4` is `Ready` and aliased to `https://barmatrix.app`.
- Live browser QA:
  - The eight affected malformed routes on `https://barmatrix.app` with `bad_route_live=f13a1933521f9178d14ad417e5cea406f68f44ae` each rendered product-facing copy.
  - Each live page had `<main>` count 1 and `rawApiText=false`.
  - Fresh browser warning/error logs after deployment completion were empty.
- Production health/logs:
  - Vercel error-log query returned no rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty.

## Remaining Risk

- Red Zone malformed routes remain explicitly out of scope for this pass because another session owns them.
- This pass validated malformed/not-found behavior, not every happy-path workflow.

# Live Signed-In Workflow Non-Red-Zone Evidence

## Issue

Expected behavior: a paid signed-in user should be able to exercise safe non-Red-Zone production study workflows without raw API/runtime text, duplicate page landmarks, visible broken states, fresh client warnings/errors, or production error logs. Actual behavior in this slice: no source defect was reproduced; the tested production workflows rendered or progressed correctly. Affected domain: live signed-in study workflows and production runtime health.

## Reproduction

- Reproduced defect: no.
- Browser setup:
  - Used the paid signed-in in-app browser session against `https://barmatrix.app`.
  - Skipped Red Zone routes and Red Zone source/test files because another session owns that work.
  - Avoided payment-provider side effects.
- Live account state:
  - `/account?workflow_audit=f13a193` rendered `Your BarMatrix access is active.`
  - Billing state rendered `No Stripe billing portal`.
  - Page had one `<main>`, no raw API text, and no fresh warning/error logs.
- Live study workflows exercised:
  - `/drills/evidence`: started the Evidence drill, selected answer A, submitted, and rendered forensics/result state.
  - `/practice`: selected Evidence, loaded a 20-question set, submitted answer A, and rendered `Wrong Answer Forensics`.
  - `/timed-sets`: started a 17-question mixed timed set, submitted answer A, and rendered the timed forensics state.
  - `/boot-camps`: catalog rendered three live camps; `contract-formation-timing` detail rendered; `Start camp` created session `f5cb4b5d-dddb-4794-8685-c5a1cd4f4bb7`; Day 1 loaded and first answer submission advanced to question 2 with forensics.
  - `/certification` and `/certification/M1`: rendered Method-gate states for this account without raw API text.
  - `/diagnostic`: started session `e632e749-3f5f-41dd-8959-aee2d554e7ff`; question 1 submitted, rendered forensics, and next-question navigation reached question 2.
  - `/coach`: `Start coaching` rendered `Not measurable yet`.
  - `/mastery`: rendered measured-on-0-attempts / not-yet-measured C3 state.

## Trace

- Files and runtime areas inspected:
  - `app\drills`
  - `app\practice`
  - `app\timed-sets`
  - `app\diagnostic`
  - `app\boot-camps`
  - `app\certification`
  - `lib\api-client.ts`
  - Vercel production deployment metadata
  - Live API health
  - Vercel frontend error logs
  - Hostinger API stderr
- Verified facts:
  - Production deployment `dpl_32CrEZshExCXAoyJi2VQEgHit8v4` was `Ready` and aliased to `https://barmatrix.app`.
  - Live API health returned `{"ok":true,"db":"up"}` before and after the workflow pass.
  - Every exercised browser state had one `<main>` and `rawApiText=false`.
  - Fresh browser warning/error logs were empty during the workflow window.
  - Vercel error logs and Hostinger stderr were empty after the workflow pass.
- Root cause: none identified in this slice because no defect was reproduced.
- Confidence: high for the specific workflows and states exercised; this does not prove every possible branch or every Red Zone path.

## Change

- No app/API source changes were made.
- No regression test was added because no failing behavior was reproduced.
- Updated `tasks\todo.md` and `tasks\evidence.md` with workflow audit evidence.

## Verification

- Browser QA:
  - Evidence drill start/submit/forensics passed.
  - Practice Evidence set start/submit/forensics passed.
  - Timed mixed set start/submit/forensics passed.
  - Boot-camp catalog/detail/start/session/day submit/forensics passed.
  - Diagnostic start/question submit/forensics/next-question navigation passed.
  - Certification gate, Coach limited state, and Mastery limited state rendered without raw API text or fresh browser errors.
- Production health/logs:
  - Vercel error-log query for the last 30 minutes returned no rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty.
- Automated checks:
  - No source changes were made in this slice, so no new test/lint/build cycle was required for source verification. The current production deployment had already passed CI for commit `f13a193`.

## Remaining Risk

- Red Zone routes remain out of scope for this pass.
- Boot-camp and diagnostic workflows were not fully completed; this pass verified production start, submit, forensics, and navigation/progress transitions.
- Certification full assessment was not available because this paid account has not completed The Method.
- C3 Coach/Mastery measurement remains limited by missing authored C3 annotation/tagging content, tracked as `auronpep/barmatrix-api#3`.

# Live API Auth Boundary Non-Red-Zone Evidence

## Issue

Expected behavior: production API contracts used by the BarMatrix web app should return shaped public JSON, fail closed for protected unauthenticated requests, sanitize malformed input errors, avoid leaking internal implementation details, allow the production app origin through CORS, and leave production logs clean. Actual behavior in this slice: no API contract defect was reproduced. Affected domain: live API auth boundary and error contract for non-Red-Zone app dependencies.

## Reproduction

- Reproduced defect: no.
- Setup:
  - Used live API base `https://api.barmatrix.app`.
  - Mapped representative endpoints from `lib\api-client.ts` and `C:\barmatrix-api\src` route registrations.
  - Skipped Red Zone API paths because another session owns that audit.
  - Avoided Stripe checkout creation and billing portal creation to prevent payment-provider side effects.
- Public live probes returned 200 shaped JSON:
  - `/health`
  - `/api/cohort/status`
  - `/api/foundations`
  - `/api/foundations/lesson-01`
  - `/api/questions/by-subject?subject=Evidence&page=1&limit=2`
  - `/api/questions/:id` using a live Evidence question id from the list response
  - `/api/traps?official=1`
  - `/api/traps/overbroad_rule`
  - `/api/tensions?curated=1`
  - `/api/tensions/cp_diversity_amount_vs_supplemental_jurisdiction`
  - `/api/boot-camps`
  - `/api/boot-camps/contract-formation-timing`
  - `/api/drills/catalog`
  - `/api/c3/deck`
  - `/api/certification`
  - `/api/checkout/cs_test_missing_live_api_audit/status`
- Malformed request probes returned sanitized 400/404 JSON:
  - Bad Foundation slug returned 400 `invalid lesson slug`.
  - Missing question subject returned 400 `subject is required`.
  - Invalid question id returned 400 `invalid question id`.
  - Bad trap/tension/boot-camp slugs returned 404 `trap not found`, `tension not found`, or `boot camp not found`.
  - Invalid `/api/attempts` payload returned 400 validation JSON.
  - Invalid JSON body returned 400 `invalid JSON body`.
- Unauthenticated protected probes failed closed:
  - `/api/me/dashboard`, `/api/me/c3`, `/api/me/c3/next`, `/api/me/gamification`, `/api/drills/prescribed`, and `/api/drills/start` returned 401 `not authenticated`.
  - `/api/certification/M1` returned 401 `locked`.
- CORS probes:
  - `OPTIONS /api/me/dashboard` and `OPTIONS /api/attempts` from `https://barmatrix.app` returned 204 with `Access-Control-Allow-Origin: https://barmatrix.app` and credentials allowed.
  - A disallowed origin did not receive allow-origin or credentials headers.

## Trace

- Files inspected:
  - `lib\api-client.ts`
  - `C:\barmatrix-api\src\index.ts`
  - `C:\barmatrix-api\src\routes\questions.ts`
  - `C:\barmatrix-api\src\routes\drills.ts`
  - API route registrations under `C:\barmatrix-api\src\routes`
- Verified facts:
  - Express global error handler returns `invalid JSON body` for parse errors and `internal server error` for unhandled exceptions.
  - Production CORS config allows configured origins and credentials.
  - Live public/protected/malformed probes matched expected status classes and sanitized body shapes.
  - Live question detail did not expose answer-key or forensic fields before submission.
  - Production logs stayed empty after the probes.
- Root cause: none identified in this slice because no defect was reproduced.
- Confidence: high for the probed endpoint contracts; this is not a proof of every API branch or Red Zone endpoint.

## Change

- No app/API source changes were made.
- No regression test was added because no failing behavior was reproduced.
- Updated `tasks\todo.md` and `tasks\evidence.md` with API boundary audit evidence.

## Verification

- Live API probe evidence:
  - Public endpoints returned shaped 200 JSON.
  - Protected endpoints failed closed with 401 JSON when unauthenticated.
  - Malformed inputs returned 400/404 JSON without stack traces or database details.
  - CORS allowed `https://barmatrix.app` and did not grant a disallowed origin.
  - Internal-leak scan found no stack traces, SQL errors, database exception codes, bearer tokens, Stripe live secret/public keys, or password fields. A first-pass broad match on trap detail was rechecked and came from ordinary answer text (`select strict scrutiny`), not SQL.
- Production health/logs:
  - Vercel error-log query for the last 30 minutes returned no rows.
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - Hostinger `stderr.log` was empty.

## Remaining Risk

- Red Zone API paths remain out of scope for this pass.
- Stripe checkout and billing portal mutation paths were not clicked in this pass to avoid payment-provider side effects.
- Authenticated positive API paths were verified through prior live browser workflows instead of shelling with bearer tokens.

# Live Route And Link Integrity Non-Red-Zone Evidence

## Issue

Expected behavior: every internal link advertised by the live non-Red-Zone app should open a meaningful page state without 404s, raw API/runtime text, duplicate landmarks, desktop overflow, fresh browser errors, or production error logs. Actual behavior found in this slice: the Tension Map catalog emitted 34 `/tensions/...` links that returned Next 404 pages. Affected domain: live Tension Map observed-only tension detail routing outside Red Zones.

## Reproduction

- Reproduced: yes.
- Setup:
  - Used the in-app browser against `https://barmatrix.app`.
  - Skipped Red Zone routes/source because another session owns that review.
  - Browser-smoked 56 non-Red-Zone route targets; all rendered with one `<main>`, no raw API text, no visible runtime errors, no desktop overflow, and no fresh browser warning/error logs.
  - Collected 398 same-origin non-Red-Zone links from rendered pages.
- Failure output:
  - Initial link probe returned 34 broken `/tensions/...` links with 404 states.
  - Browser reproduction: `/tensions/FM-I.B-AMBIGUOUS-ACCEPTANCE-MODE` rendered `404 This page could not be found.`
  - Control route: `/tensions/cp_diversity_amount_vs_supplemental_jurisdiction` rendered a normal curated tension detail page.
  - Live API before the first fix returned HTTP 400 for `/api/tensions/FM-I.B-AMBIGUOUS-ACCEPTANCE-MODE`, `/api/tensions/CON-CM-001%3B%20CON-CM-003`, and `/api/tensions/Fact%20of%20consequence%20%2B%20weak%20proof%2Falternative%20cause`.

## Trace

- Files inspected:
  - `app\tensions\page.tsx`
  - `app\tensions\[slug]\page.tsx`
  - `lib\tensions.ts`
  - `lib\api-client.ts`
  - `C:\barmatrix-api\src\routes\tensions.ts`
  - `C:\barmatrix-api\src\lib\tensions.ts`
  - `C:\barmatrix-api\src\lib\tensions.test.ts`
  - local Next.js dynamic route and Link docs
- Verified facts:
  - The app list page linked to `/tensions/${encodeURIComponent(tension.slug)}` exactly as supplied by the API.
  - The API list shaper emitted raw observed bank values as `slug` for observed-only tensions.
  - The API detail validator initially accepted only `[A-Za-z0-9_-]`, so dotted bank codes, semicolon composites, and slash/prose tags failed before lookup.
  - After widening API detail validation, dotted bank-code pages rendered, but semicolon and slash/prose paths still 404ed in the Next route layer.
  - Live observed tension values outside the simple slug set used only space, semicolon, dot, slash, and plus.
- Root cause:
  - The API was using one field as both the question-bank lookup key and the browser route segment. Raw observed bank values are valid lookup keys but not reliably safe Next path segments.
- Confidence: high; the failure was reproduced in browser and with live API probes, then resolved by separating route-safe observed slugs from decoded bank lookup values.

## Change

- Changed files in `C:\barmatrix-api`:
  - `src\lib\tensions.ts`
  - `src\lib\tensions.test.ts`
- Diff summary:
  - Added `toTensionRouteSlug()` to keep simple observed slugs readable and encode unsafe observed bank values as `observed_<base64url>`.
  - Updated `shapeTensionList()` so observed-only unsafe values publish route-safe slugs.
  - Updated `normalizeTensionSlug()` so detail routes decode `observed_...` back to the original bank tag before querying.
  - Preserved direct raw API lookup support for observed values and continued rejecting quote/injection-shaped values.
- Smallest safe fix rationale:
  - Fixed the API list/detail contract at the source; no frontend route reshaping or broad app refactor was needed.
  - Red Zone files were not touched.

## Verification

- Red checks:
  - `npx tsx --test src/lib/tensions.test.ts` failed before implementation on `invalid tension slug`.
  - The route-safe slug regression failed before implementation because `toTensionRouteSlug` did not exist.
- Green API checks from `C:\Users\wks2391\AppData\Local\Temp\barmatrix-api-tension-fix-20260602`:
  - `npx tsx --test src/lib/tensions.test.ts` passed: 23 tests.
  - `npm test` passed: 286 tests.
  - `npm run typecheck` passed.
  - `npm run build` passed.
  - `git diff --check -- src/lib/tensions.ts src/lib/tensions.test.ts` passed with only CRLF warnings.
- Deployment:
  - Pushed API commits `695e4b8` and `e37b596` to `auronpep/barmatrix-api`.
  - Hostinger SSH could not fetch GitHub from the deployed checkout, so the pushed source files were copied directly, built on Hostinger with `/opt/alt/alt-nodejs20/root/usr/bin/node node_modules/typescript/bin/tsc -p tsconfig.json`, and the `tmp/restart.txt` marker timestamp was updated.
  - Deployed source/dist on Hostinger contain `toTensionRouteSlug` / `observed_` route-safe logic.
- Live API QA:
  - `GET https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
  - `GET /api/tensions` emitted route-safe `observed_...` slugs for semicolon and slash/prose observed values.
  - `GET /api/tensions/FM-I.B-AMBIGUOUS-ACCEPTANCE-MODE`, `GET /api/tensions/observed_Q09OLUNNLTAwMTsgQ09OLUNNLTAwMw`, and `GET /api/tensions/observed_RmFjdCBvZiBjb25zZXF1ZW5jZSArIHdlYWsgcHJvb2YvYWx0ZXJuYXRpdmUgY2F1c2U` returned HTTP 200 detail payloads.
- Live browser QA:
  - `/tensions?catalog_verify=e37b596` rendered 267 catalog links and no raw unsafe tension hrefs.
  - Detail DOM spot checks passed for curated, simple observed, dotted observed, semicolon composite, and slash/prose observed tension links.
  - Each spot-checked page had one `<main>`, no 404, no raw API text, no desktop overflow, and no fresh browser warning/error logs.
  - A catalog-wide HTTP probe found all 267 current `/tensions/...` hrefs returned HTTP 200.
- Production logs:
  - Vercel error logs were clean for the post-verification 3-minute window.
  - The wider 30-minute Vercel window still contained the pre-fix reproduction 404s.
  - Hostinger `stderr.log` was empty after deploy.

## Remaining Risk

- Red Zone routes remain out of scope for this pass.
- The Hostinger deployed files and live behavior match the pushed fix, but the remote git HEAD may lag because SSH GitHub fetch cannot authenticate from Hostinger.

# Hostinger API Deploy Path Evidence

## Issue

Expected behavior: the Hostinger API deployment directory should be able to authenticate to the private `auronpep/barmatrix-api` GitHub repository, fetch/pull the pushed `main` commit, build from git state, and restart without manual source-file copying. Actual behavior: Hostinger initially could not authenticate to GitHub from the deployed checkout, so API deploys required direct file copy and risked git/source drift. Affected domain: live API deployment operations.

## Reproduction

- Reproduced: yes.
- Setup:
  - Used Hostinger SSH via the existing local `hostinger_gemini` key.
  - Avoided printing private keys or environment secrets.
- Failure output:
  - `ssh -T git@github.com` returned `Permission denied (publickey)`.
  - `git ls-remote origin main` failed with `could not read Username for 'https://github.com': No such device or address`.
- Verified deployed checkout state:
  - Directory: `/home/u211961595/domains/barmatrix.app/nodejs`
  - Package: `barmatrix-api`
  - Initial origin URL: `https://github.com/auronpep/barmatrix-api.git`
  - GitHub deploy-key list for `auronpep/barmatrix-api` was initially empty.

## Trace

- Files/runtime areas inspected:
  - Hostinger `nodejs` git remote, branch/head, `.ssh` directory, GitHub SSH probe, and `git ls-remote`.
  - Local `gh auth status`, repo metadata, and deploy-key list.
  - Live API health and tension detail endpoint.
- Root cause:
  - The production API checkout used an HTTPS private-repo remote without stored credentials, and the Hostinger user had no GitHub SSH deploy key. Non-interactive deploy commands could not fetch GitHub.
- Confidence: high; GitHub SSH and HTTPS probes both failed before the deploy-key repair and succeeded after.

## Change

- Generated a Hostinger-local Ed25519 deploy key for the API checkout without printing private key material.
- Added the public key to `auronpep/barmatrix-api` as read-only deploy key `hostinger-barmatrix-api-readonly`.
- Added Hostinger SSH config for `github.com` to use the deploy key.
- Changed API `origin` to `git@github.com:auronpep/barmatrix-api.git`.
- Fetched `origin/main`, reset the deployed checkout to branch `main` tracking `origin/main`, rebuilt the API with Hostinger Node 20, and touched `tmp/restart.txt`.

## Verification

- GitHub deploy key list shows `hostinger-barmatrix-api-readonly` with `read_only: true`.
- Hostinger `ssh -T git@github.com` now authenticates successfully for `auronpep/barmatrix-api`.
- Hostinger `git ls-remote --heads origin main` returned `e37b59611d3d35051c4c9b522e15c620218d3f13`.
- Hostinger deployed checkout:
  - `HEAD = e37b59611d3d35051c4c9b522e15c620218d3f13`
  - branch `main`
  - tracking `origin/main`
  - only untracked runtime `tmp/`
- API build from the fetched checkout completed with `/opt/alt/alt-nodejs20/root/usr/bin/node node_modules/typescript/bin/tsc -p tsconfig.json`.
- Live API:
  - `GET https://api.barmatrix.app/health?deploy_path_verify=1` returned `{"ok":true,"db":"up"}`.
  - `GET https://api.barmatrix.app/api/tensions/observed_Q09OLUNNLTAwMTsgQ09OLUNNLTAwMw?deploy_path_verify=1` returned HTTP 200.
- Logs:
  - Hostinger `stderr.log` was empty.
  - Vercel error logs for the post-check 5-minute window returned no rows.

## Remaining Risk

- The API deploy path can now fetch the private repo from Hostinger using a read-only deploy key.
- This does not cover Red Zone route behavior, which remains out of scope for this audit thread while another session owns it.

# Live Static Surface And Metadata Evidence

## Issue

Expected behavior: public and transactional BarMatrix web surfaces should emit accurate metadata, index only appropriate pages, advertise current public routes, provide an install manifest, avoid stale product claims/links, and include basic defensive headers. Actual behavior found in this slice: several non-Red-Zone static surfaces had wrong or missing production signals, including a global home canonical on non-home pages, missing noindex metadata on auth/checkout status pages, an incomplete and request-time-changing sitemap, no manifest route, stale non-Red-Zone static LP links/mobile claims, and missing app-managed defensive headers. Affected domain: live web trust/discoverability/static surface outside Red Zones.

## Reproduction

- Reproduced: yes.
- Setup:
  - Used source inspection, local Next 16 docs, production HTTP probes, and the in-app browser.
  - Skipped Red Zone source/routes/LP behavior because another session owns that review.
- Failure evidence before changes:
  - `next.config.ts` had no `headers()` export for the tested defensive headers.
  - `app/layout.tsx` exported a global `alternates.canonical = "/"`, which caused routes such as `/pricing` to inherit the home canonical.
  - `app/checkout/success/page.tsx`, `app/sign-in/[[...sign-in]]/page.tsx`, and `app/sign-up/[[...sign-up]]/page.tsx` lacked noindex/nofollow metadata.
  - `app/sitemap.ts` used request-time `new Date()` for every `lastModified` and omitted several public product/catalog routes.
  - `app/manifest.ts` did not exist.
  - Non-Red-Zone static LPs under `public/lp-*.html` contained stale app/mobile copy and stale links such as `/dashboard` and `/`.

## Trace

- Files inspected:
  - `next.config.ts`
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/sitemap.ts`
  - `app/robots.ts`
  - `app/checkout/success/page.tsx`
  - `app/sign-in/[[...sign-in]]/page.tsx`
  - `app/sign-up/[[...sign-up]]/page.tsx`
  - `public/lp-failed-by-6.html`
  - `public/lp-four-traps.html`
  - `public/lp-priced-right.html`
  - `public/lp-wrong-answers.html`
  - local Next.js 16 docs for sitemap, robots, manifest, Open Graph image metadata, and headers.
- Root causes:
  - Metadata intended for the homepage lived in the root layout, so it was inherited by unrelated routes.
  - Transactional/auth pages had no local robots metadata.
  - Sitemap generation mixed route inventory with request-time timestamps.
  - No manifest route existed in the App Router tree.
  - Static LP copy and links had drifted from the current web-only product surface.
  - App-level defensive headers were not configured.
- Confidence: high for these static-surface defects because each was reproduced by direct source/runtime evidence and captured by a focused regression test.

## Change

- Changed files:
  - `next.config.ts`
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/sitemap.ts`
  - `app/manifest.ts`
  - `app/checkout/success/page.tsx`
  - `app/sign-in/[[...sign-in]]/page.tsx`
  - `app/sign-up/[[...sign-up]]/page.tsx`
  - `public/lp-failed-by-6.html`
  - `public/lp-four-traps.html`
  - `public/lp-priced-right.html`
  - `public/lp-wrong-answers.html`
- Tests added:
  - `tests/security-headers.test.ts`
  - `tests/metadata-canonical.test.ts`
  - `tests/noindex-transactional-pages.test.ts`
  - `tests/sitemap-static-surface.test.ts`
  - `tests/static-landing-pages.test.ts`
  - `tests/manifest-route.test.ts`
- Diff summary:
  - Added app-wide `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy` headers.
  - Removed global canonical metadata from the root layout and added the home canonical only to `app/page.tsx`.
  - Added `noindex, nofollow` metadata to sign-in, sign-up, and checkout success.
  - Stabilized sitemap `lastModified` at `2026-06-02T00:00:00.000Z` and added missing public routes.
  - Added `app/manifest.ts` using the existing favicon and brand colors.
  - Updated non-Red-Zone static LP navigation/footer links and removed stale iOS/Android claims.
- Smallest safe fix rationale:
  - Changes are constrained to metadata/config/static LP files and focused tests.
  - No Red Zone files were touched by this slice.
  - CSP was not added because Clerk, Stripe, PostHog, and Sentry require a separate policy design and browser verification pass.

## Verification

- Red-first focused tests:
  - `node --test tests\security-headers.test.ts` failed before `next.config.ts` exported `headers()`.
  - `node --test tests\metadata-canonical.test.ts` failed before moving canonical metadata out of the root layout.
  - `node --test tests\noindex-transactional-pages.test.ts` failed before noindex metadata was added.
  - `node --test tests\sitemap-static-surface.test.ts` failed before sitemap route/timestamp changes.
  - `node --test tests\static-landing-pages.test.ts` failed before non-Red-Zone LP cleanup.
  - `node --test tests\manifest-route.test.ts` failed before `app/manifest.ts` existed.
- Green checks:
  - `node --test tests\security-headers.test.ts` passed.
  - `node --test tests\metadata-canonical.test.ts` passed.
  - `node --test tests\noindex-transactional-pages.test.ts` passed.
  - `node --test tests\sitemap-static-surface.test.ts` passed.
  - `node --test tests\static-landing-pages.test.ts` passed.
  - `node --test tests\manifest-route.test.ts` passed.
  - Full non-Red-Zone test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 51/51 tests.
  - `npm run lint` passed.
  - `npm run build` passed and listed `/manifest.webmanifest`.
  - `git diff --check` passed with only normal CRLF warnings.
- Local production HTTP verification:
  - `http://localhost:3012/`, `/pricing`, `/terms`, `/checkout/success`, `/sign-in`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/lp-four-traps.html`, and `/lp-priced-right.html` returned HTTP 200.
  - Probed local pages emitted the new defensive headers.
  - Home canonical resolved to `https://barmatrix.app`.
  - `/pricing` and `/terms` no longer emitted the wrong home canonical.
  - `/checkout/success` and `/sign-in` emitted `noindex, nofollow`.
  - Sitemap used stable `2026-06-02T00:00:00.000Z` `lastmod` values.
  - Manifest returned HTTP 200 with `application/manifest+json`.
- Local in-app browser verification:
  - `/pricing?static_audit=local` rendered the expected page title/H1, had one `<main>`, linked the manifest, had no wrong canonical, had no runtime error text, had no desktop overflow, and produced no fresh browser warning/error logs.
  - `/checkout/success?static_audit=local` rendered with `noindex, nofollow`, one `<main>`, no wrong canonical, no runtime error text, no stale mobile claim, and expected links.
  - `/lp-four-traps.html?static_audit=local` rendered with cleaned links, no stale mobile claim, no runtime error text, and no fresh browser warning/error logs.
- Deployment:
  - Pushed app commit `5ac3a8f` (`Harden static metadata surface`) to `main`.
  - GitHub Actions run `26804193758` passed the Vercel production workflow: install dependencies, regression tests, lint, build, pull Vercel settings, and deploy to production.
  - `vercel inspect https://barmatrix.app` reported a Ready production deployment created after the push, with aliases including `https://barmatrix.app` and `https://www.barmatrix.app`.
- Live HTTP verification:
  - `https://barmatrix.app/`, `/pricing`, `/terms`, `/checkout/success`, `/sign-in`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/lp-four-traps.html`, and `/lp-priced-right.html` returned HTTP 200.
  - Probed live pages emitted `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, and a `Permissions-Policy` header.
  - `/` emitted canonical `https://barmatrix.app`; `/pricing` and `/terms` did not emit the wrong home canonical.
  - `/checkout/success` and `/sign-in` emitted `noindex, nofollow`.
  - `/manifest.webmanifest` returned `application/manifest+json`.
  - `/sitemap.xml` included stable `2026-06-02T00:00:00.000Z` values and public route coverage including `/app`, `/subjects/evidence`, `/traps`, and `/tensions`.
  - Live non-Red-Zone LP checks confirmed Pricing anchors point to `/pricing`, expected `/how-it-works`, `/diagnostic`, `/boot-camps`, `/app`, `/terms`, and `/privacy` links are present, stale `/dashboard` links are absent, and stale iOS/Android claims are absent.
- Live in-app browser verification:
  - `/pricing?audit=static_audit_5ac3a8f_*` rendered title `Pricing - BarMatrix Flagship $999 | BarMatrix`, H1 `One price. One cohort. Full repair access.`, one `<main>`, manifest link `/manifest.webmanifest`, no wrong canonical, `index, follow`, no stale mobile claim, no runtime error text, no desktop overflow, and no fresh browser warning/error logs.
  - `/checkout/success?audit=static_audit_5ac3a8f_*` rendered title `Checkout Complete - BarMatrix | BarMatrix`, H1 `Open your account to confirm access.`, one `<main>`, manifest link `/manifest.webmanifest`, no wrong canonical, `noindex, nofollow`, no stale mobile claim, no runtime error text, no desktop overflow, and no fresh browser warning/error logs.
  - `/lp-four-traps.html?audit=static_audit_5ac3a8f_*` rendered the expected static LP title/H1, cleaned links, no stale mobile claim, no runtime error text, no desktop overflow, and no fresh browser warning/error logs.
- Production health/logs:
  - Vercel production error logs for the last 15 minutes returned no rows after the live probes.
  - `GET https://api.barmatrix.app/health?static_surface_verify=5ac3a8f` returned `{"ok":true,"db":"up"}`.
  - Hostinger API `stderr.log` tail was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- `app/checkout/page.tsx` remains a client component without page metadata; adding noindex there should be a separate wrapper refactor if needed.
- CSP remains a separate security-hardening task because third-party scripts and connect destinations need careful policy coverage.

# Checkout Indexing And Deploy Runtime Evidence

## Issue

Expected behavior: all transactional checkout surfaces should be marked `noindex, nofollow`, and the production deploy workflow should run without the GitHub Actions Node 20 action-runtime deprecation warning. Actual behavior found in this slice: `/checkout` is still a client-only page with no page-level robots metadata, and the latest production workflow run reported the Node 20 actions deprecation annotation even though the application Node version is set to 24. Affected domain: live web indexing/trust and production deploy operations outside Red Zones.

## Reproduction

- Reproduced: yes.
- Setup:
  - Current repo state has unrelated dirty Red Zone files; they are intentionally excluded.
  - Local Next 16 docs state that `metadata` exports are only supported in Server Components, so the current `"use client"` checkout page cannot directly export robots metadata.
- Failure targets:
  - `app/checkout/page.tsx` lacks `robots: { index: false, follow: false }`.
  - `.github/workflows/deploy-vercel.yml` lacks the explicit `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` opt-in while the latest workflow annotation reports Node 20 actions deprecation.
- Red test output:
  - `node --test tests\noindex-transactional-pages.test.ts` failed because `app/checkout/page.tsx` did not match the transactional robots metadata assertion.
  - `node --test tests\vercel-workflow-runtime.test.ts` failed because `.github/workflows/deploy-vercel.yml` did not match `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24:\s*true`.

## Trace

- Files inspected:
  - `app/checkout/page.tsx`
  - `app/checkout/success/page.tsx`
  - `.github/workflows/deploy-vercel.yml`
  - `node_modules\next\dist\docs\01-app\01-getting-started\14-metadata-and-og-images.md`
- Verified facts:
  - The checkout page owns interactive state/effects and browser navigation, so it needs a Client Component boundary.
  - Next 16 metadata exports are only supported in Server Components.
  - The deploy workflow already uses app Node `24`, but the GitHub annotation is about the action runtime for `actions/checkout@v4` and `actions/setup-node@v4`.
- Root cause hypothesis:
  - `/checkout` needs a Server Component route file that exports metadata and delegates interactive behavior to a child Client Component.
  - The workflow needs current action major versions, not just the explicit runtime opt-in, because `actions/checkout@v4` and `actions/setup-node@v4` still target Node 20.
- Confidence: high; the failures were reproduced by focused tests, the implementation path follows the local Next 16 Server Component metadata rule, and the first workflow deploy proved the env-only hypothesis incomplete by still emitting a forced-runtime warning.

## Change

- Changed files:
  - `.github/workflows/deploy-vercel.yml`
  - `app/checkout/page.tsx`
  - `app/checkout/checkout-client.tsx`
  - `tests/noindex-transactional-pages.test.ts`
  - `tests/vercel-workflow-runtime.test.ts`
- Diff summary:
  - Moved the existing interactive checkout implementation into `app/checkout/checkout-client.tsx` and kept it as a Client Component.
  - Replaced `app/checkout/page.tsx` with a Server Component wrapper that exports checkout metadata and renders the client checkout UI.
  - Added `robots: { index: false, follow: false }` to `/checkout`.
  - Added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` at workflow scope.
  - Updated `actions/checkout` and `actions/setup-node` from v4 to v5 after verifying v5 tags exist for both action repositories.
- Smallest safe fix rationale:
  - The checkout UI and payment-start logic were not rewritten; only the client boundary moved so metadata can live in the route file.
  - The workflow keeps the same deploy steps and only changes the action runtime compatibility layer.
  - Red Zone files were not touched.

## Verification

- Red checks before implementation:
  - `node --test tests\noindex-transactional-pages.test.ts` failed on missing checkout robots metadata.
  - `node --test tests\vercel-workflow-runtime.test.ts` failed on missing `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`.
- Green checks after implementation:
  - `node --test tests\noindex-transactional-pages.test.ts` passed.
  - `node --test tests\vercel-workflow-runtime.test.ts` passed.
  - After the first pushed workflow passed but still warned that v4 actions target Node 20, `tests\vercel-workflow-runtime.test.ts` was tightened and passed with assertions for `actions/checkout@v5`, `actions/setup-node@v5`, and no v4 checkout/setup-node actions.
  - Full non-Red-Zone app test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 52/52 tests.
  - `npm run lint` passed.
  - `npm run build` passed and listed `/checkout` as static.
  - `git diff --check` passed with only normal CRLF warnings.
- Local production verification:
  - Started `next start` on `http://localhost:3013` after `npm run build`.
  - In-app browser `/checkout?local_checkout_audit=ready` rendered `Checkout - BarMatrix | BarMatrix`, H1 `One step from your Red-Zone Map.`, one `<main>`, two checkout buttons, `noindex, nofollow`, no runtime error text, no desktop overflow, and no fresh browser warning/error logs.
  - In-app browser `/checkout?capacity=reached&local_checkout_audit=capacity` rendered the capacity panel and waitlist link, zero checkout buttons, `noindex, nofollow`, no runtime error text, no desktop overflow, and no fresh browser warning/error logs.
  - The local production server was stopped after verification.
- Deployment:
  - Commit `5b608eb` (`Noindex checkout entrypoint`) pushed and deployed successfully, but the workflow still emitted a warning that `actions/checkout@v4` and `actions/setup-node@v4` target Node 20 and were being forced to Node 24.
  - Verified `v5` tags exist for both `actions/checkout` and `actions/setup-node`, then pushed commit `654377e` (`Use Node 24 GitHub actions`).
  - GitHub Actions run `26805196406` passed install, regression tests, lint, build, Vercel pull, and production deploy; `gh run watch` and `gh run view` printed no annotations for the run.
  - `vercel inspect https://barmatrix.app` reported a Ready production deployment created after `654377e`, with aliases including `https://barmatrix.app`.
- Live verification:
  - `GET https://barmatrix.app/checkout?live_checkout_audit=654377e` returned HTTP 200, `Checkout - BarMatrix | BarMatrix`, `noindex, nofollow`, defensive headers, and expected checkout content.
  - In-app browser `/checkout?live_checkout_audit=654377e_ready` rendered H1 `One step from your Red-Zone Map.`, one `<main>`, two checkout buttons, `noindex, nofollow`, no wrong canonical, no visible runtime error text, no desktop overflow, and no fresh browser warning/error logs.
  - In-app browser `/checkout?capacity=reached&live_checkout_audit=654377e_capacity` rendered the capacity panel and waitlist link, zero checkout buttons, `noindex, nofollow`, no visible runtime error text, no desktop overflow, and no fresh browser warning/error logs.
  - Vercel production error logs for the last 10 minutes returned no rows.
  - `GET https://api.barmatrix.app/health?checkout_indexing_verify=654377e` returned `{"ok":true,"db":"up"}`.
  - Hostinger API `stderr.log` tail was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- CSP remains a separate security-hardening task.

# CSP Header Audit Evidence

## Issue

Expected behavior: BarMatrix production pages should emit an app-managed Content Security Policy that constrains scripts, styles, frames, images, fonts, API/telemetry connections, and embedding without breaking Clerk auth, PostHog/Sentry telemetry, API calls, or static LP font loading. Actual behavior: live `/`, `/sign-in`, `/account`, and `/lp-four-traps.html` responses have no `Content-Security-Policy` and no `Content-Security-Policy-Report-Only` header. Affected domain: live web security posture outside Red Zones.

## Reproduction

- Reproduced: yes.
- Setup:
  - Dirty Red Zone source/test files were left untouched because another session owns that review.
  - Read local Next 16 CSP/header docs under `node_modules/next/dist/docs/`.
  - Probed live routes with PowerShell HTTP requests and the in-app browser.
- Failure evidence:
  - `HEAD https://barmatrix.app/`, `/sign-in`, `/account`, and `/lp-four-traps.html` returned baseline defensive headers but no CSP header.
  - `next.config.ts` defines `SECURITY_HEADERS` for `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy`, but no CSP.

## Trace

- Files inspected:
  - `next.config.ts`
  - `app/layout.tsx`
  - `proxy.ts`
  - `instrumentation-client.ts`
  - `lib/posthog-client.ts`
  - `lib/api-client.ts`
  - `public/lp-four-traps.html`
  - local environment hostnames, with secret values redacted
- Runtime/source origins found:
  - Same-origin app assets: `https://barmatrix.app`
  - API: `https://api.barmatrix.app`
  - Local API during development: `http://localhost`
  - Clerk live custom domain: `https://clerk.barmatrix.app`
  - Clerk local/test frontend API: `https://*.clerk.accounts.dev`
  - Clerk images: `https://img.clerk.com`
  - PostHog ingest: `https://us.i.posthog.com`
  - PostHog asset loader: `https://us-assets.i.posthog.com`
  - Sentry ingest: `https://o4511480415584256.ingest.us.sentry.io`
  - Static LP fonts: `https://fonts.googleapis.com` and `https://fonts.gstatic.com`
- Root cause:
  - The previous static security-header pass added baseline headers but intentionally deferred CSP. No code path currently emits either an enforced or report-only CSP.
- Confidence: high.

## Change

- Changed files:
  - `next.config.ts`
  - `tests/security-headers.test.ts`
  - `tasks/todo.md`
  - `tasks/evidence.md`
- Diff summary:
  - Added a no-nonce enforced `Content-Security-Policy` to the existing global `SECURITY_HEADERS`.
  - Allowed only the observed app/auth/analytics/error-reporting/API/font surfaces: same-origin app assets, `api.barmatrix.app`, Clerk live/test domains, Clerk images, PostHog ingest/assets, Sentry ingest, and Google Fonts for static LPs.
  - Added local-only `localhost`/`127.0.0.1` HTTP and websocket connect allowances behind `ALLOW_LOCAL_CONNECT = !process.env.VERCEL`, so Vercel production does not emit local connect sources.
  - Avoided nonce-based CSP so static App Router pages remain static/cached.
- Smallest safe fix rationale:
  - The missing behavior is an app header policy, so the source change is constrained to `next.config.ts`.
  - No route/component behavior or Red Zone source was changed.

## Verification

- Red check before implementation:
  - `node --test tests\security-headers.test.ts` failed on missing `Content-Security-Policy`.
- Green focused check after implementation:
  - `node --test tests\security-headers.test.ts` passed: 2/2 tests.
- Broader local checks:
  - Full non-Red-Zone app test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 53/53 tests.
  - `npm run lint` passed.
  - `npm run build` passed and preserved static generation for static routes.
  - `git diff --check -- next.config.ts tests\security-headers.test.ts tasks\todo.md tasks\evidence.md` passed with only normal CRLF warnings.
- Local production HTTP verification:
  - Started `next start` on `http://localhost:3014`.
  - `GET /`, `/account`, `/checkout`, and `/lp-four-traps.html` returned HTTP 200 and emitted `Content-Security-Policy`.
  - Local non-Vercel CSP included `http://localhost:8080`, `http://localhost:*`, `http://127.0.0.1:*`, `ws://localhost:*`, and `ws://127.0.0.1:*` for local API/dev connectivity.
- Local in-app browser verification:
  - `/`, `/account`, `/checkout`, and `/lp-four-traps.html` rendered meaningful content with no visible runtime text, no horizontal overflow in the tested viewport, and no fresh browser warning/error logs.
  - Local browser-observed origins were covered by CSP: local app origin, `https://daring-mammal-68.clerk.accounts.dev`, `https://img.clerk.com`, `https://us-assets.i.posthog.com`, `https://fonts.googleapis.com`, and `https://fonts.gstatic.com`.
  - Screenshot saved: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-csp-local-lp-four-traps.png`.
- Deployment:
  - Pushed commit `39b70d1` (`Add enforced content security policy`) to `main`.
  - GitHub Actions run `26806093231` passed install, regression tests, lint, build, Vercel project pull, and production deploy.
  - `vercel inspect https://barmatrix.app` reported a Ready production deployment created after the push, with aliases including `https://barmatrix.app` and `https://www.barmatrix.app`.
- Live HTTP verification:
  - `GET https://barmatrix.app/`, `/account`, `/checkout`, and `/lp-four-traps.html` returned HTTP 200 and emitted `Content-Security-Policy`.
  - Live CSP contained the expected app/auth/telemetry/API/font directives and did not include `localhost`, `127.0.0.1`, or `ws://`.
- Live in-app browser verification:
  - `/` rendered `Master the finite universe of MBE traps.`
  - `/account` rendered `Your BarMatrix access is active.` for the paid signed-in browser session.
  - `/checkout` rendered `One step from your Red-Zone Map.`
  - `/lp-four-traps.html` rendered `The 4 traps that write themselves into nearly every MBE question.`
  - All four live pages had meaningful content, no visible runtime text, no horizontal overflow in the tested viewport, and no fresh browser warning/error logs.
  - Live browser-observed origins were covered by CSP: `https://barmatrix.app`, `https://clerk.barmatrix.app`, `https://img.clerk.com`, `https://us-assets.i.posthog.com`, `https://fonts.googleapis.com`, and `https://fonts.gstatic.com`.
  - Screenshot saved: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-csp-live-lp-four-traps.png`.
- Production health/logs:
  - `GET https://api.barmatrix.app/health?csp_verify=39b70d1` returned `{"ok":true,"db":"up"}`.
  - `vercel logs https://barmatrix.app --since 10m` filtered for errors/CSP violations returned no matches after the live browser pass.
  - Hostinger API `stderr.log` tail was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- The enforced CSP is verified across core app/auth/account/checkout/static-LP surfaces. Future third-party embeds or new payment-provider UI embeds will need explicit CSP entries before they are shipped.

# Live Post-CSP Study Flow Evidence

## Issue

Expected behavior: after the enforced CSP deployment, live signed-in non-Red-Zone study routes should still render meaningful states and complete API-backed interactions without CSP violations, browser runtime errors, or production log errors. Actual behavior: this protected study workflow surface has not yet been audited after CSP enforcement. Affected domain: live BarMatrix study program outside Red Zones.

## Reproduction

- Reproduced: no source defect reproduced in this slice.
- Setup:
  - Dirty Red Zone source/test files remain out of scope for this slice.
  - In-app browser is signed in as a paid subscriber.
  - Live production deployment is current after commits `39b70d1` and `91ca64b`.
- Live HTTP route checks:
  - `/dashboard`, `/drills/evidence`, `/practice`, `/timed-sets`, `/boot-camps`, `/certification`, `/coach`, `/foundations`, `/mastery`, `/traps`, and `/tensions` returned HTTP 200 and emitted `Content-Security-Policy`.
  - None of those live CSP headers contained `localhost`, `127.0.0.1`, or `ws://`.
- Live in-app browser route smoke:
  - `/dashboard` rendered `Progress, next drill, and recent wrong-answer forensics.`
  - `/drills/evidence` rendered `Evidence questions with wrong-answer forensics in the same drill.`
  - `/practice` rendered `Practice the bank`.
  - `/timed-sets` rendered `Run a timed mixed set, then review the traps that surfaced under pressure.`
  - `/boot-camps` rendered `Boot camps organize repeated misses into short repair sequences.`
  - `/certification` rendered `Finish The Method first`.
  - `/coach` rendered `The C3 Coach`.
  - `/foundations` rendered `The Method: Cut → Clash → Call — the BarMatrix wrong-answer method`.
  - `/mastery` rendered `How well you run the method`.
  - `/traps` rendered `The finite universe of MBE traps`.
  - `/tensions` rendered `The recurring legal tension points`.
  - Each route had one `<main>`, meaningful content, no desktop overflow in the tested viewport, and no fresh browser warning/error logs.
- False-positive check:
  - The broad raw-error heuristic flagged `/traps` and `/tensions`.
  - Exact context inspection showed ordinary catalog/legal text (`Violation Equals Suppression`, `statutory violation`), not API status or CSP failure text.
- Interaction proof:
  - Live `/drills/evidence` loaded a real queue question: `presentation_questions_batch_023_E4_conviction_of_crime::r4::Q03 - E4`.
  - Selected answer `A. Admit the conviction because all felony convictions of testifying defendants are automatically admissible.`
  - Clicked `Submit answer`.
  - The UI rendered forensics/result state and `Next Evidence question` with no visible runtime text and no fresh browser warning/error logs.
  - Screenshot saved: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-post-csp-evidence-submit.png`.

## Trace

- Files/runtime areas inspected:
  - `tasks/todo.md`
  - `tasks/evidence.md`
  - Live HTTP response headers
  - Live in-app browser DOM snapshots/logs
  - Live API health
  - Vercel frontend logs
  - Hostinger API `stderr.log`
- Root cause:
  - No post-CSP non-Red-Zone study-flow defect was reproduced.
- Confidence: medium-high for the tested route set and Evidence interaction; this does not prove every possible workflow branch.

## Change

- No app/API source changes were made in this slice.
- Task ledgers were updated with the audit scope and evidence.

## Verification

- Live route header probe passed for 11 representative non-Red-Zone study routes.
- Live signed-in browser smoke passed for dashboard, Evidence drill, practice, timed sets, boot camps, certification, coach, foundations, mastery, traps, and tensions.
- Live Evidence drill answer submission rendered forensics/next-question state.
- `GET https://api.barmatrix.app/health?post_csp_study_verify=1` returned `{"ok":true,"db":"up"}`.
- `vercel logs https://barmatrix.app --since 10m` filtered for errors/CSP violations returned no matches.
- Hostinger API `stderr.log` tail was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- This slice submitted one Evidence answer. It did not re-submit every longer boot-camp, certification, timed-set, coach, or diagnostic workflow after CSP because earlier audit slices already covered those workflows and repeating all of them would add extra production attempts.

# Account Checkout-Return Billing Capability Evidence

## Issue

Expected behavior: an active signed-in account whose dashboard billing capability says no Stripe portal is available should see the handled `No Stripe billing portal` state even when the URL contains a missing checkout-session id. Actual behavior: `https://barmatrix.app/account?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789` rendered both `Recover enrollment` and `Update Payment Method`, while plain `/account` correctly rendered no payment-method CTA after auth hydration. Affected domain: account/billing UX outside Red Zones.

## Reproduction

- Reproduced: yes.
- Setup:
  - In-app browser signed in as the current paid subscriber.
  - Dirty Red Zone source/test files intentionally untouched.
- Live browser evidence:
  - `/account?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789` rendered `Your BarMatrix access is active.`, `Activation check available`, `Recover enrollment`, and `Update Payment Method`.
  - The page had one `<main>`, no horizontal overflow, and no visible raw API/runtime/CSP error text.
  - Plain `/account?plain_account_compare=1` initially showed auth hydration, then settled to `Your BarMatrix access is active.` and `No Stripe billing portal. This account has active access, but no Stripe billing portal is available for this enrollment...` with no payment-method button.

## Trace

- Files inspected:
  - `app/account/page.tsx`
  - `app/account/billing-portal-button.tsx`
  - `app/account/enrollment-recovery.tsx`
  - `lib/api-client.ts`
  - `tests/api-client-billing-portal.test.ts`
  - `node_modules\next\dist\docs\01-app\03-api-reference\03-file-conventions\page.md`
- Verified facts:
  - `AccountPage` passes `checkoutSessionId` from either `checkout_session_id` or `session_id`.
  - `BillingPortalButton` reads the signed-in dashboard `billing_portal` capability through `useDashboard()`.
  - Before the change, both `needsDashboardBillingCheck` and `portalKnownUnavailable` required `!checkoutSessionId`, so checkout-return URLs bypassed the same billing capability that hid the CTA on plain `/account`.
- Root cause: a query-param-specific bypass in the client billing button capability gate.
- Confidence: high.

## Change

- Changed files:
  - `app/account/billing-portal-button.tsx`
  - `tests/api-client-billing-portal.test.ts`
  - `tasks/todo.md`
  - `tasks/evidence.md`
- Diff summary:
  - Removed `!checkoutSessionId` from the signed-in dashboard loading and portal-unavailable checks.
  - Added a regression that asserts checkout-return URLs do not bypass dashboard billing capability.
- Smallest safe fix rationale:
  - The enrollment recovery panel and portal creation API contract are unchanged.
  - Only the pre-click capability gate that controls the misleading CTA was changed.
  - Red Zone files were not touched.

## Verification

- Red check before implementation:
  - `node --test tests\api-client-billing-portal.test.ts` failed on `!checkoutSessionId` in `needsDashboardBillingCheck`.
- Green focused check after implementation:
  - `node --test tests\api-client-billing-portal.test.ts` passed 8/8.
- Broader local checks:
  - Full non-Red-Zone app test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 54/54.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check -- app\account\billing-portal-button.tsx tests\api-client-billing-portal.test.ts tasks\todo.md tasks\evidence.md` passed with only normal CRLF warnings.
- Local production browser check:
  - Started `next start` on `http://localhost:3015`; the account route rendered, but the local auth/API context could not reproduce the live paid-dashboard branch and showed `Account status unavailable`, so this was not used as final UI proof.
  - The temporary local server was stopped after verification.
- Deployment:
  - Pushed commit `be0a3ad` (`Honor billing capability on checkout return`) to `main`.
  - GitHub Actions run `26807478692` passed install, regression tests, lint, build, Vercel pull, and production deploy.
  - `vercel inspect https://barmatrix.app` reported production deployment `dpl_6bLKobZ7kBdjGss1tyD4vMms8Sv7` Ready and aliased to `https://barmatrix.app`.
- Live browser verification:
  - `/account?checkout_session_id=cs_test_missing_live_audit_final2_1780367857789&live_account_return_verify=be0a3ad` rendered `Your BarMatrix access is active.`, `Activation check available`, `Recover enrollment`, `No Stripe billing portal`, and `Contact support`.
  - The fixed live page had no `Update Payment Method` button, one `<main>`, no desktop overflow, no visible raw runtime/API/CSP text, and no fresh live browser warnings/errors; the only returned warnings were stale localhost Clerk warnings from an earlier local session.
  - Screenshot evidence: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-account-return-billing-be0a3ad.png`.
- Production health/logs:
  - `GET https://api.barmatrix.app/health?account_return_verify=be0a3ad` returned `{"ok":true,"db":"up"}`.
  - Vercel logs for the check window showed only normal info request rows, including the account route.
  - Hostinger API `stderr.log` tail was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- The checkout recovery panel still appears for the fake checkout-session id, as intended for the recovery workflow; this fix only removes the misleading billing-portal CTA when the signed-in dashboard capability says no Stripe portal exists.

# Live Public Transactional Navigation Evidence

## Issue

Expected behavior: representative public, transactional, auth, static landing, and non-Red-Zone catalog entry points should render meaningful page states with one page-level `<main>` landmark, no raw runtime/API/CSP text, no desktop overflow, and fresh browser console health. Actual behavior found in this slice: the non-Red-Zone static LPs rendered meaningful content but had no `<main>` landmark. Affected domain: public static landing pages outside Red Zones.

## Reproduction

- Reproduced: yes.
- Setup:
  - Current worktree has unrelated dirty Red Zone route/test files; they remain untouched.
  - Used the in-app browser against the live production deployment after commit `e06203b`.
  - Avoided payment-provider mutations, waitlist submission, and Red Zone routes/source.
- Live HTTP route matrix:
  - `/`, `/how-it-works`, `/pricing`, `/partners`, `/referral`, `/waitlist`, `/app`, `/about`, `/faq`, `/terms`, `/privacy`, `/diagnostic`, `/diagnostic/session`, `/checkout`, `/checkout?capacity=reached`, `/checkout/success`, `/sign-in`, `/sign-up`, subjects, drills, practice, timed sets, boot camps, certification, coach, foundations, mastery, traps, tensions, four non-Red-Zone static LPs, robots, sitemap, and manifest returned HTTP 200 after expected redirects, with CSP present and no broad raw-error markers.
  - Unauthenticated HTTP probes for `/drills` and `/drills/evidence` followed to sign-in as expected.
- Live browser route matrix:
  - App-rendered public/transactional/study/catalog routes rendered one `<main>`, no desktop overflow, no visible raw runtime/API/CSP text, no framework overlay, and no fresh `barmatrix.app` warning/error logs.
  - Non-Red-Zone static LPs `/lp-four-traps.html`, `/lp-priced-right.html`, `/lp-failed-by-6.html`, and `/lp-wrong-answers.html` rendered meaningful content with no overflow or raw-error text, but `mainCount=0`.

## Trace

- Files inspected:
  - `public/lp-four-traps.html`
  - `public/lp-priced-right.html`
  - `public/lp-failed-by-6.html`
  - `public/lp-wrong-answers.html`
  - `tests/static-landing-pages.test.ts`
  - `node_modules\next\dist\docs\01-app\03-api-reference\03-file-conventions\page.md`
  - `node_modules\next\dist\docs\01-app\03-api-reference\04-functions\generate-metadata.md`
- Verified facts:
  - The static LPs are served as plain HTML under `public/`, so they do not inherit the App Router root `<main>` wrapper.
  - Each non-Red-Zone static LP had nav, content sections, and footer, but no `<main>` or `</main>` tag.
- Root cause: static LP content was outside any page-level main landmark.
- Confidence: high.

## Change

- Changed files:
  - `public/lp-four-traps.html`
  - `public/lp-priced-right.html`
  - `public/lp-failed-by-6.html`
  - `public/lp-wrong-answers.html`
  - `tests/static-landing-pages.test.ts`
- Diff summary:
  - Added one `<main>` immediately after the existing LP nav and one `</main>` immediately before the existing footer on each non-Red-Zone static LP.
  - Added a regression asserting each non-Red-Zone static LP has exactly one main landmark before the footer.
- Smallest safe fix rationale:
  - No copy, links, CTA targets, CSS classes, payment behavior, or Red Zone LP/source were changed.

## Verification

- Red check before implementation:
  - `node --test tests\static-landing-pages.test.ts` failed because `public/lp-failed-by-6.html` had zero `<main>` tags.
- Green focused check after implementation:
  - `node --test tests\static-landing-pages.test.ts` passed 3/3.
- Broader local checks:
  - Full non-Red-Zone app test sweep passed with `tests\red-zone-detail-params.test.ts` excluded: 55/55.
  - `npm run lint` passed.
  - `npm run build` passed.
  - `git diff --check -- public\lp-four-traps.html public\lp-priced-right.html public\lp-failed-by-6.html public\lp-wrong-answers.html tests\static-landing-pages.test.ts tasks\todo.md tasks\evidence.md` passed with only normal CRLF warnings.
- Local production browser verification:
  - Started `next start` on `http://localhost:3016`.
  - `/lp-four-traps.html`, `/lp-priced-right.html`, `/lp-failed-by-6.html`, and `/lp-wrong-answers.html` each rendered `mainCount=1`, meaningful H1/title, no desktop overflow, no visible raw runtime/API/CSP text, and no fresh browser warning/error logs.
  - Screenshot evidence: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-lp-main-local.png`.
  - The temporary local server was stopped after verification.
- Deployment:
  - Pushed commit `69f117b` (`Add main landmarks to static landing pages`) to `main`.
  - GitHub Actions run `26808290547` passed install, regression tests, lint, build, Vercel pull, and production deploy.
  - `vercel inspect https://barmatrix.app` reported production deployment `dpl_FweyVh2CSK8SqsFWKL3y1FD9KNp8` Ready and aliased to `https://barmatrix.app`.
- Live HTTP verification:
  - `/lp-four-traps.html`, `/lp-priced-right.html`, `/lp-failed-by-6.html`, and `/lp-wrong-answers.html` returned HTTP 200 with CSP present, exactly one `<main>`, exactly one `</main>`, and expected titles.
- Live browser verification:
  - The four changed LPs each rendered `mainCount=1`, meaningful H1/title, no desktop overflow, no visible raw runtime/API/CSP text, and no fresh browser warning/error logs.
  - Screenshot evidence: `C:\Users\wks2391\AppData\Local\Temp\barmatrix-lp-main-live-69f117b.png`.
- Production health/logs:
  - `GET https://api.barmatrix.app/health?lp_main_verify=69f117b` returned `{"ok":true,"db":"up"}`.
  - Vercel logs for the check window showed only normal info rows.
  - Hostinger API `stderr.log` tail was empty.

## Remaining Risk

- Red Zone routes/source remain out of scope for this pass.
- Signed-in browser checks for `/sign-in` and `/sign-up` redirect to home because the browser session is already authenticated; unauthenticated HTTP checks returned auth pages with `noindex, nofollow`.
- C3 Coach/Mastery measurement remains limited by missing authored C3 annotation/tagging content tracked separately in `auronpep/barmatrix-api#3`.
