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
