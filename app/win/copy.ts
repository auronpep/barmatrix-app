// Diagnostic-first launch copy. Keep public claims narrow and evidence-safe.

export const BRAND = "BarMatrix";
export const DOMAIN = "barmatrix.app";

export const HERO = {
  headline: "Find the MBE red zones your question sets are hiding.",
  subhead:
    "BarMatrix is a premium MBE-only repair system for California repeaters and July 2026 takers who are doing questions but not improving. Start with the free diagnostic, get a Red-Zone Map, then let the system lead you to one next guided repair task.",
  primaryCta: { label: "Start the Free Diagnostic", href: "/diagnostic" },
  secondaryCta: { label: "See How Repair Works", href: "#how-it-works" },
  flagshipLine: "BarMatrix Flagship - $999, or $500 today + $499 in 30 days.",
} as const;

export const PRICING = {
  flagshipName: "BarMatrix Flagship",
  priceLabel: "$999",
  priceCents: 99900,
  paymentPlanLabel: "Payment plan: $500 today + $499 in 30 days",
  paymentPlanTotalCents: 99900,
  capacityLine: "Limited seats available. Enrollment closes when capacity is reached.",
  includes: [
    "Red-Zone Map carried from the diagnostic into enrollment",
    "One next guided repair task instead of a resource dashboard",
    "Wrong-answer forensics for the trap that pulled you",
    "Two-answer trap repair and selection discipline",
    "Call, controlling rule, collision, answer training",
    "Focused Criminal Law/Procedure calibration during launch",
    "Lead Me guided daily delivery",
    "3-5 visible milestones for context, not browsing",
    "Catch-up handling for missed repair tasks",
    "Web access to the guided path",
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
    a: "BarMatrix is a diagnostic-first MBE repair system. It starts with a free diagnostic and Red-Zone Map, then turns the highest-priority miss pattern into one guided repair task at a time.",
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
    a: "No. BarMatrix is multiple-choice-only and is designed as a companion repair system for the MBE side. It does not replace essay preparation, performance-test preparation, or your broader bar plan.",
  },
  {
    q: "Why start with the diagnostic before purchase?",
    a: "The diagnostic is the proof step. It shows the red zones, wrong-answer traps, and repair priority before asking you to decide whether Flagship is worth buying.",
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
  headline: "Your guided repair path is ready.",
  body: "Your first screen is the guided daily path: one active MBE repair task, a small milestone map, and no resource-browsing decisions.",
  flagshipLine: "BarMatrix Flagship · One July-cycle cohort.",
  primaryCta: { label: "Open the guided repair path", href: "/dashboard" },
  secondaryCta: { label: "Start the free diagnostic", href: "/diagnostic" },
} as const;

export const ACCOUNT_PLACEHOLDER = {
  headline: "Account",
  body: "Sign-in is coming online with the cohort launch. If you've already enrolled, check your email for your access details.",
  cta: { label: "Back to home", href: "/" },
} as const;

export const DISCLAIMER =
  "BarMatrix is an independent educational product. It is multiple-choice only and does not replace essay preparation, performance-test preparation, legal advice, or bar-admission guidance. No exam outcome is promised. New diagnostic and guided-path content is being authored as replacement BarMatrix content unless expressly identified as licensed material.";
