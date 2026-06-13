// Locked public copy — source of truth: BARMATRIX/growth/WEBSITE_COPY_AND_CREATIVE.md (SRC-0029)
// Any change here must be approved by the founder. See BARMATRIX/DRIFT_CONTROL.md for blocked language.

export const BRAND = "BarMatrix";
export const DOMAIN = "barmatrix.app";

export const HERO = {
  headline: "Master the finite universe of MBE traps.",
  subhead:
    "BarMatrix diagnoses the wrong-answer patterns behind your missed MBE questions and assigns targeted repair drills so you stop practicing randomly and start repairing the traps that keep costing you points.",
  primaryCta: { label: "Take the Free MBE Trap Diagnostic", href: "/diagnostic" },
  secondaryCta: { label: "See Wrong Answer Forensics", href: "/how-it-works" },
  flagshipLine: "BarMatrix Flagship — $999. Limited July-cycle cohort seats available.",
} as const;

export const PRICING = {
  flagshipName: "BarMatrix Flagship",
  priceLabel: "$999",
  priceCents: 99900,
  paymentPlanLabel: "Payment plan: $500 today + $499 in 30 days",
  paymentPlanTotalCents: 99900,
  capacityLine: "Limited seats available. Enrollment closes when capacity is reached.",
  includes: [
    "Free MBE Trap Diagnostic",
    "Red-Zone Map",
    "Forensic question bank",
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
  open: "July-cycle cohort enrollment is open. Limited seats available.",
  limited: "Limited July-cycle cohort seats available.",
  almost_full: "The July-cycle cohort is almost full.",
  last_seats: "Last July-cycle cohort seats available.",
  waitlist: "Cohort capacity reached. Join the waitlist.",
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
    a: "BarMatrix is an MBE-focused diagnostic repair system. It maps recurring trap patterns, explains why attractive wrong answers pull students in, and assigns targeted drills.",
  },
  { q: "What is the price?", a: "BarMatrix Flagship is $999." },
  {
    q: "Is there a payment plan?",
    a: "Yes. The payment plan is $500 today and $499 in 30 days.",
  },
  {
    q: "Is enrollment limited?",
    a: "Yes. The July-cycle cohort has limited seats. Enrollment closes when capacity is reached.",
  },
  {
    q: "Is this a full bar course?",
    a: "No. BarMatrix is multiple-choice-only and is designed to complement a full bar course.",
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
