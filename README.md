# BarMatrix.app

> Premium MBE wrong-answer intelligence. Diagnose the recurring trap patterns behind your missed multiple-choice questions and assign targeted repair drills.

## Source of truth

This repo is the **production Next.js 15+ web app**. The locked launch decisions, stack, copy, taxonomy, schema, and operating rules live in the **BARMATRIX/** master folder in the operations repo (`auronpep/barmatrix-ops-center`). When this repo disagrees with `BARMATRIX/`, that folder wins.

| Surface | Location |
|---|---|
| Locked offer + decisions | `BARMATRIX/CLAUDE.md`, `BARMATRIX/RULES.md`, `BARMATRIX/MASTER_CONTEXT.md` |
| Sprint plan | `BARMATRIX/launch/72_HOUR_BUILD_AND_7_DAY_RAMP.md` |
| Stack + deployment | `BARMATRIX/engineering/STACK_AND_DEPLOYMENT.md` |
| API contracts | `BARMATRIX/engineering/API_CONTRACTS.md` |
| Postgres schema | `BARMATRIX/engineering/SCHEMA_ONE_COHORT.sql` |
| Public copy | `BARMATRIX/growth/WEBSITE_COPY_AND_CREATIVE.md` |
| Drift policy | `BARMATRIX/DRIFT_CONTROL.md` |

The locked copy is mirrored into this repo at [`lib/copy.ts`](lib/copy.ts).

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind v4 |
| Auth | Clerk (planned) |
| Payments | Stripe Checkout + webhook (planned) |
| Analytics | PostHog (planned) |
| Hosting | Vercel |
| Backend API | Flask on Cloud Run (separate repo) |
| Database | Cloud SQL Postgres (per `SCHEMA_ONE_COHORT.sql`) |
| Email | Resend or Postmark (planned) |
| DNS / WAF | Cloudflare |
| Monitoring | Sentry (planned) |

## Locked offer

```text
BarMatrix Flagship — $999.
One July-cycle cohort. Limited seats available.
Enrollment closes when capacity is reached.
Payment plan: $500 today + $499 in 30 days.
Platforms: web, iOS, Android.
```

**Do not** introduce launch discounts, "first 250 save $100," "$899," "early bird," or "web-only" framing. See `BARMATRIX/DRIFT_CONTROL.md` for the full blocklist.

## Development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Deploy

Production deploys via Vercel. Connect this repo to a Vercel project with the `barmatrix.app` domain via Cloudflare.

## License

Proprietary — © BarMatrix. All rights reserved.
