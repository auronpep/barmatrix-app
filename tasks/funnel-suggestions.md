# Funnel & Paid-UX Suggestions — Under-the-Hood Review (June 2026)

Context: follow-up to the live-site review. Most of that review's items are
already fixed in this repo (sitemap/robots, FAQ + JSON-LD, og-image, honest
capacity policy, payment-plan FAQ, partner referral attribution). This file
covers what's still open, ordered by expected impact. Items 1 and 2 are
**implemented on this branch**; the rest are proposals.

## Shipped on this branch

1. **Email capture at the verdict screen** (`components/save-map-form.tsx`).
   The anonymous Red-Zone Map is session-only and not persisted; a bounce was
   an unreachable lead. The form reuses the existing `/api/webinar/leads`
   endpoint (honeypot included) with `source_page: "/diagnostic/results"` and
   the diagnostic ID in `context`, so no backend change is needed to start
   collecting. New analytics event: `red_zone_map_save_requested`.

2. **Viral share card on diagnostic results** (`components/share-map.tsx`).
   Wordle-style, spoiler-free text card: trap names + severity squares, never
   the raw score, linking to `/diagnostic?utm_source=share&utm_campaign=red_zone_map`.
   Native share sheet with clipboard fallback. New analytics event:
   `red_zone_map_shared`. The hook is social currency ("every bar taker has a
   trap") without the embarrassment of sharing a score.

## Proposed next (priority order)

3. **Backend follow-through for saved maps.** The lead row now carries
   `diagnostic_id`. Worth a small API change: a recovery link
   (`/diagnostic/{id}/results`) emailed on request, and attaching the saved
   diagnostic to the account at signup (the claim path already exists for
   checkout fulfillment — reuse it for sign-in, not just purchase).

4. **Checkout abandonment recovery.** `checkout_started` is tracked and the
   lead endpoint exists, but a taker who opens Stripe and bails is lost. If
   they saved their map (item 1), a single "your map + seat status" follow-up
   is now possible. Also consider asking for email *before* redirecting to
   Stripe when the user is anonymous.

5. **Share at more moments of pride.** The results page shares "what caught
   me"; boot-camp badges and streaks (`bootcamp_badge_unlocked`,
   `bootcamp_streak_extended`) are higher-arousal *positive* share moments for
   paid users — the strongest referral source. Reuse the `ShareMap` pattern
   with a badge card and the partner-style attribution params so paid-user
   shares are measurable.

6. **OG image per share link.** Shared diagnostic links all preview the same
   static og-image. A dynamic OG image route (Next `ImageResponse`) for
   `/diagnostic` with the trap-card framing ("These traps caught me…") would
   make pasted links self-explanatory in iMessage/Discord/Reddit, where bar
   takers actually share.

7. **Placement results parity.** `/diagnostic/session/[sessionId]/results`
   (C3 placement) has the enroll CTA but neither save-map capture nor share.
   Same two components drop in with minor prop mapping.

8. **Referral page is partner-only.** `/referral` defaults to
   `partner-demo` and reads as internal tooling. A consumer-facing "invite a
   study buddy" variant (no partner ID required, plain link + disclosure-free
   copy) would open the loop to ordinary takers. Keep the partner flow as-is.

9. **Pricing-page anchor.** The page states what Flagship is/is not but never
   anchors $999 against the $3k–$4k full-course alternatives or the cost of a
   retake cycle. One comparison row under the price card ("full bar review:
   $2,500–$4,000 · BarMatrix repairs the MBE layer: $999") would do the work
   the FAQ currently leaves implicit. Keep claims factual and sourced.

10. **Two-pay default test.** Checkout supports `two_pay_500_499`. Worth an
    experiment (the `experiment_assigned` machinery exists) making the split
    plan the visually primary option — $500 today reads materially smaller
    than $999 at the decision point.
