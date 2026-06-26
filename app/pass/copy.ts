// Locked public copy — source of truth: BARMATRIX/growth/WEBSITE_COPY_AND_CREATIVE.md (SRC-0029)
// Any change here must be approved by the founder. See BARMATRIX/DRIFT_CONTROL.md for blocked language.

export const BRAND = "BarMatrix";
export const DOMAIN = "barmatrix.app";

export const HERO = {
  headline: "Diagnose the MBE patterns behind your misses.",
  subhead:
    "BarMatrix uses the C3 method to diagnose the wrong-answer patterns behind your missed MBE questions, map your red zones, and assign the next repair drill instead of sending you back into random practice.",
  primaryCta: { label: "Take the Free MBE Trap Diagnostic", href: "/diagnostic" },
  secondaryCta: { label: "See Wrong Answer Forensics", href: "/how-it-works" },
  flagshipLine: "BarMatrix Flagship - $999, or $500 today + $499 in 30 days.",
} as const;

export const PRICING = {
  flagshipName: "BarMatrix Flagship",
  priceLabel: "$999",
  priceCents: 99900,
  paymentPlanLabel: "Payment plan: $500 today + $499 in 30 days",
  paymentPlanTotalCents: 99900,
  capacityLine: "Enrollment is open for the July-cycle guided repair program.",
  includes: [
    "Free MBE Trap Diagnostic",
    "Red-Zone Map",
    "C3 wrong-answer repair method",
    "Wrong Answer Forensics",
    "Targeted Red-Zone Drills",
    "Boot Camps",
    "Timed mixed sets",
    "Pattern Mastery Board",
    "Final sprint path",
    "Full web access",
  ],
} as const;

// Dynamic capacity bands, per BARMATRIX/engineering/SCHEMA_ONE_COHORT.sql cohort_public_status view (SRC-0024).
// The actual band is returned by GET /api/cohort/status — these constants are the fallback when no API yet.
export const CAPACITY_COPY = {
  open: "July-cycle cohort enrollment is open.",
  limited: "July-cycle cohort enrollment is open.",
  almost_full: "July-cycle cohort enrollment is open.",
  last_seats: "July-cycle cohort enrollment is open.",
  waitlist: "Enrollment is currently paused. Contact support for the next available start.",
} as const;

export const PROOF_CARD = {
  trap: "Hearsay — Purpose of Offer",
  studentSelected: "Exclude as hearsay",
  forensicTag: "Overbroad hearsay myth",
  whyLookedRight: "The statement was made out of court.",
  whyFails: "It was offered to show notice, not truth.",
  nextDrill: "Hearsay Purpose-of-Offer Drill",
} as const;

export const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What is BarMatrix?",
    a: "BarMatrix is a diagnostic-first MBE repair system for California MBE test takers. It maps recurring trap patterns, explains why attractive wrong answers pull students off call, and assigns targeted drills.",
  },
  { q: "What is the price?", a: "BarMatrix Flagship is $999." },
  {
    q: "Is there a payment plan?",
    a: "Yes. The payment plan is $500 today and $499 in 30 days.",
  },
  {
    q: "How does enrollment work?",
    a: "Enrollment is open for the July-cycle guided repair program. If enrollment is ever paused, checkout will say so before payment.",
  },
  {
    q: "Is this a full bar course?",
    a: "No. BarMatrix is multiple-choice-only and is designed to pair with full bar prep as a diagnostic repair layer.",
  },
  {
    q: "Do you have official NCBE or State Bar endorsement?",
    a: "No. BarMatrix is an independent educational product and is not affiliated with or endorsed by NCBE, the State Bar of California, or any bar authority.",
  },
  {
    q: "What results should I expect and what should I not expect?",
    a: "Expect clearer visibility into your recurring trap patterns and a guided repair path. We do not make pass-rate, score-increase, or outcome guarantees.",
  },
];

export const APP_STATUS = {
  // Web-only for now. iOS/Android messaging removed until those builds ship.
  webLiveAppsSubmitted: "Web access is live now.",
  testFlight: "Web access is live now.",
  playTesting: "Web access is live now.",
  storeApproved: "Web access is live now.",
} as const;

export const WELCOME = {
  badge: "Enrollment confirmed",
  headline: "You're in the July cohort.",
  body: "Check your email for your access details — we'll send your onboarding link, study schedule, and Red-Zone Map walkthrough within the next few minutes.",
  flagshipLine: "BarMatrix Flagship · One July-cycle cohort.",
  primaryCta: { label: "Take the diagnostic now", href: "/diagnostic" },
  secondaryCta: { label: "What's next", href: "/how-it-works" },
} as const;

export const ACCOUNT_PLACEHOLDER = {
  headline: "Account",
  body: "Sign-in is coming online with the cohort launch. If you've already enrolled, check your email for your access details.",
  cta: { label: "Back to home", href: "/" },
} as const;

export const DISCLAIMER =
  "BarMatrix is an independent educational product. It is not affiliated with, endorsed by, sponsored by, or licensed by NCBE, the State Bar of California, or any bar authority. BarMatrix is multiple-choice only and does not replace essay preparation, performance-test preparation, legal advice, or official bar-admission guidance. No score, pass result, or exam outcome is guaranteed. Questions are original unless expressly identified as licensed material.";
