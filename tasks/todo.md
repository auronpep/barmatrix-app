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
