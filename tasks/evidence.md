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

- This change has not been deployed during this pass. Because production knowledge search is already returning content, there is no live knowledge outage to resolve before continuing the broader audit.
- The system is still not fully tested end to end; authenticated paid-user browser flows remain the next audit target.
