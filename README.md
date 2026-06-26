# BarMatrix.app

> Premium MBE wrong-answer intelligence. Diagnose the recurring trap patterns behind your missed multiple-choice questions and assign targeted repair drills.

## Source of truth

This repo is the **production Next.js 16 web app**. The locked launch decisions, stack, copy, taxonomy, schema, and operating rules live in the **BARMATRIX/** master folder in the operations repo (`auronpep/barmatrix-ops-center`). When this repo disagrees with `BARMATRIX/`, that folder wins.

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
| Auth | Clerk or equivalent magic-link login (planned) |
| Payments | Stripe Checkout + webhook (planned, API-owned) |
| Analytics | PostHog + GA4 (planned) |
| Hosting | Vercel |
| Backend API | Node 24 + Express + TypeScript on Hostinger Node.js Selector (separate repo) |
| Database | Hostinger MySQL 8 (per `SCHEMA_MYSQL.sql`) |
| Email | Resend or Postmark (planned) |
| DNS / WAF | Hostinger DNS; Cloudflare optional later |
| Monitoring | Sentry (planned) |

## Locked offer

```text
BarMatrix Flagship — $999.
One July-cycle cohort. Limited seats available.
Enrollment closes when capacity is reached.
Payment plan: $500 today + $499 in 30 days.
Platforms: web, iOS, Android.
```

Current approved campaign exception: `HALFOFF499` may present BarMatrix
Flagship as a $499 pay-in-full checkout offer for the current 50% off sale.
This exception does not apply to the $500 + $499 payment plan.

**Do not** introduce any other launch discounts, "first 250 save $100,"
"$899," "early bird," or "web-only" framing unless a newer task/tracker note
explicitly supersedes this section. See `BARMATRIX/DRIFT_CONTROL.md` for the
full blocklist.

## Development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Deploy

Production deploys via Vercel. Connect this repo to a Vercel project with the `barmatrix.app` domain using the current Hostinger DNS zone; Cloudflare remains optional later.

Set the public frontend environment variables from [`.env.example`](.env.example) in Vercel. Backend secrets such as database credentials, Stripe secret keys, webhook secrets, and Clerk secret keys belong in the separate API runtime environment.

## License

Proprietary — © BarMatrix. All rights reserved.
