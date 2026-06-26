// Operator console — launch-sprint demo data (typed).
//
// Ported from the design bundle's window.BM_OP_DATA. PHASE 2 PREVIEW data: in
// production this is a GET /api/me/operator aggregation over Stripe / enrollment
// / refunds / partners. Commercial framing rewritten to the LOCKED model
// (BARMATRIX/CLAUDE.md): standard price $999, plan $500 today + $499 in 30 days.
// The current approved public discount exception is the HALFOFF499 pay-in-full
// campaign; do not model a discounted payment plan unless it is explicitly approved.
// The 1,000 internal cap appears here because this console is founder-only / internal.

export interface Kpi {
  value: number;
  target?: number;
  delta: number;
  deltaLabel: string;
}

export interface OpData {
  meta: {
    sprintDay: number;
    sprintTotal: number;
    launchDate: string;
    currentTime: string;
    operator: string;
    operatorRole: string;
    operatorInitials: string;
  };
  kpis: Record<
    | "enrollments"
    | "payInFullRate"
    | "revenueTotal"
    | "revenueToday"
    | "diagnosticStarted"
    | "diagnosticCompleted"
    | "emailList"
    | "refundRate",
    Kpi
  >;
  revenueTrend: { day: string; rev: number; enrollments: number; note: string }[];
  funnel: { stage: string; count: number; pctOfPrev: number; pctTotal: number }[];
  activity: {
    id: string;
    type: "purchase" | "diagnostic" | "refund" | "webinar";
    ts: string;
    who: string;
    what: string;
    amount: number | null;
    partner: string | null;
  }[];
  refunds: {
    id: string;
    student: string;
    purchased: string;
    price: number;
    usage: number;
    reason: string;
    status: "auto-approved" | "approved" | "review" | "denied";
  }[];
  partners: {
    id: string;
    name: string;
    type: "Influencer" | "Tutor" | "Org";
    clicks: number;
    conversions: number;
    commission: number;
    status: string;
    topGeo: string;
  }[];
  webinars: {
    id: string;
    title: string;
    date: string;
    attendees: number;
    registered: number;
    conv: number | null;
    ledTo: number;
    live?: boolean;
    upcoming?: boolean;
  }[];
  geo: { state: string; count: number; pct: number }[];
  support: { open: number; answered: number; avgResponseMin: number; topIssues: { issue: string; count: number }[] };
  health: { uptime: number; p95LatencyMs: number; stripeWebhookSuccess: number; errorRate: number; activeNow: number };
  capacity: { enrolled: number; cap: number; remaining: number; revenueIfFilled: number };
}

export const BM_OP_DATA: OpData = {
  meta: {
    sprintDay: 5,
    sprintTotal: 7,
    launchDate: "2026-05-22",
    currentTime: "2026-05-21 16:34 PT",
    operator: "Vera Brooks",
    operatorRole: "Founder · Operator",
    operatorInitials: "VB",
  },

  kpis: {
    enrollments: { value: 187, target: 1000, delta: 24, deltaLabel: "+24 today" },
    payInFullRate: { value: 0.7, target: 0.6, delta: 0.03, deltaLabel: "+3pt vs yest" },
    revenueTotal: { value: 168013, target: 974000, delta: 21576, deltaLabel: "+$21.5k today" },
    revenueToday: { value: 21576, delta: 4612, deltaLabel: "+$4.6k vs yest" },
    diagnosticStarted: { value: 1834, delta: 247, deltaLabel: "+247 today" },
    diagnosticCompleted: { value: 1102, delta: 142, deltaLabel: "+142 today" },
    emailList: { value: 2418, delta: 312, deltaLabel: "+312 today" },
    refundRate: { value: 0.011, delta: 0.002, deltaLabel: "+0.2pt vs yest" },
  },

  revenueTrend: [
    { day: "May 15", rev: 0, enrollments: 0, note: "Pre-launch" },
    { day: "May 16", rev: 4995, enrollments: 5, note: "Soft beta — partner invites" },
    { day: "May 17", rev: 19980, enrollments: 20, note: "Tutor outreach Day 1" },
    { day: "May 18", rev: 29970, enrollments: 30, note: "Webinar #1 · 412 attendees" },
    { day: "May 19", rev: 39960, enrollments: 40, note: "TikTok viral — 2.1M views" },
    { day: "May 20", rev: 53946, enrollments: 54, note: "Diagnostic emails fired" },
    { day: "May 21", rev: 21576, enrollments: 24, note: "TODAY · still running" },
  ],

  funnel: [
    { stage: "Diagnostic Started", count: 1834, pctOfPrev: 100, pctTotal: 100 },
    { stage: "Diagnostic Completed", count: 1102, pctOfPrev: 60.1, pctTotal: 60.1 },
    { stage: "Email Confirmed", count: 998, pctOfPrev: 90.6, pctTotal: 54.4 },
    { stage: "Pricing Viewed", count: 624, pctOfPrev: 62.5, pctTotal: 34.0 },
    { stage: "Checkout Started", count: 287, pctOfPrev: 46.0, pctTotal: 15.6 },
    { stage: "Purchase Completed", count: 187, pctOfPrev: 65.2, pctTotal: 10.2 },
  ],

  activity: [
    { id: "EV-9821", type: "purchase", ts: "16:32", who: "Aaliyah K.", what: "purchased Flagship · $999 · pay-in-full", amount: 999, partner: "@tutorpro" },
    { id: "EV-9820", type: "diagnostic", ts: "16:31", who: "M. Reyes", what: "completed diagnostic · score 4/12 · top trap: STALE RULE", amount: null, partner: null },
    { id: "EV-9819", type: "purchase", ts: "16:28", who: "D. Chen", what: "purchased Flagship · $500 today + $499 in 30 days", amount: 500, partner: null },
    { id: "EV-9818", type: "refund", ts: "16:24", who: "B. Patel", what: "refund requested · purchased 6d ago · usage 0% · auto-approved", amount: -999, partner: null },
    { id: "EV-9817", type: "diagnostic", ts: "16:21", who: "J. Okonkwo", what: "started diagnostic · ref @lawschoollife", amount: null, partner: "@lawschoollife" },
    { id: "EV-9816", type: "purchase", ts: "16:18", who: "L. Hernandez", what: "purchased Flagship · $999 · pay-in-full", amount: 999, partner: "@barpreptalk" },
    { id: "EV-9815", type: "webinar", ts: "16:15", who: "127 attendees", what: "joined Webinar #2 · 10:00 AM PT · live", amount: null, partner: null },
    { id: "EV-9814", type: "purchase", ts: "16:11", who: "T. Williams", what: "purchased Flagship · $999 · pay-in-full", amount: 999, partner: "@tutorpro" },
    { id: "EV-9813", type: "diagnostic", ts: "16:08", who: "K. Singh", what: "completed diagnostic · score 7/12", amount: null, partner: null },
    { id: "EV-9812", type: "purchase", ts: "16:04", who: "R. Garcia", what: "purchased Flagship · $500 today + $499 in 30 days", amount: 500, partner: "@mbecoach" },
  ],

  refunds: [
    { id: "RFND-0007", student: "B. Patel", purchased: "2026-05-15", price: 999, usage: 0, reason: "Changed mind", status: "auto-approved" },
    { id: "RFND-0006", student: "A. Kim", purchased: "2026-05-16", price: 999, usage: 12, reason: "Already enrolled BARBRI", status: "approved" },
    { id: "RFND-0005", student: "F. Johnson", purchased: "2026-05-17", price: 500, usage: 38, reason: "Studying with BARBRI primarily — supplementing", status: "review" },
    { id: "RFND-0004", student: "K. Murphy", purchased: "2026-05-13", price: 999, usage: 5, reason: "Postponed bar exam to Feb", status: "approved" },
    { id: "RFND-0003", student: "I. Mendez", purchased: "2026-05-14", price: 999, usage: 73, reason: "Not what I expected", status: "review" },
    { id: "RFND-0002", student: "C. Adler", purchased: "2026-05-12", price: 999, usage: 22, reason: "Outside refund window — denying", status: "denied" },
    { id: "RFND-0001", student: "P. Wu", purchased: "2026-05-11", price: 500, usage: 4, reason: "Decided not to take bar", status: "approved" },
  ],

  partners: [
    { id: "PT-001", name: "@tutorpro", type: "Influencer", clicks: 2847, conversions: 38, commission: 7562, status: "active", topGeo: "California" },
    { id: "PT-002", name: "@barpreptalk", type: "Influencer", clicks: 1923, conversions: 24, commission: 4776, status: "active", topGeo: "Multi" },
    { id: "PT-003", name: "@mbecoach", type: "Tutor", clicks: 1187, conversions: 22, commission: 4378, status: "active", topGeo: "California" },
    { id: "PT-004", name: "@lawschoollife", type: "Influencer", clicks: 3214, conversions: 19, commission: 3781, status: "active", topGeo: "New York" },
    { id: "PT-005", name: "Coastal Bar Tutoring", type: "Org", clicks: 564, conversions: 18, commission: 3582, status: "active", topGeo: "California" },
    { id: "PT-006", name: "@studywithriley", type: "Influencer", clicks: 1456, conversions: 11, commission: 2189, status: "active", topGeo: "Texas" },
    { id: "PT-007", name: "Lawyered Up Tutoring", type: "Org", clicks: 312, conversions: 8, commission: 1592, status: "active", topGeo: "Florida" },
    { id: "PT-008", name: "@bestbartutor", type: "Tutor", clicks: 894, conversions: 7, commission: 1393, status: "active", topGeo: "Multi" },
    { id: "PT-009", name: "@futurelawyervlogs", type: "Influencer", clicks: 5128, conversions: 6, commission: 1194, status: "active", topGeo: "Multi" },
    { id: "PT-010", name: "@thejdcoach", type: "Tutor", clicks: 423, conversions: 5, commission: 995, status: "active", topGeo: "California" },
  ],

  webinars: [
    { id: "WB-01", title: "Webinar #1 · MBE Tension Matrix Method", date: "May 18, 11:00 AM PT", attendees: 412, registered: 624, conv: 0.072, ledTo: 30 },
    { id: "WB-02", title: "Webinar #2 · Wrong Answer Forensics Live", date: "May 21, 10:00 AM PT", attendees: 287, registered: 489, conv: 0.058, ledTo: 17, live: true },
    { id: "WB-03", title: "Webinar #3 · Final Sprint Q&A", date: "May 21, 5:00 PM PT", attendees: 0, registered: 326, conv: null, ledTo: 0, upcoming: true },
  ],

  geo: [
    { state: "California", count: 84, pct: 44.9 },
    { state: "New York", count: 26, pct: 13.9 },
    { state: "Texas", count: 19, pct: 10.2 },
    { state: "Florida", count: 14, pct: 7.5 },
    { state: "Illinois", count: 11, pct: 5.9 },
    { state: "Other", count: 33, pct: 17.6 },
  ],

  support: {
    open: 7,
    answered: 41,
    avgResponseMin: 12,
    topIssues: [
      { issue: "Can't sign in after purchase", count: 4 },
      { issue: "Where's the iOS app?", count: 3 },
      { issue: "Payment plan didn't trigger second charge", count: 2 },
    ],
  },

  health: { uptime: 99.97, p95LatencyMs: 142, stripeWebhookSuccess: 100.0, errorRate: 0.0021, activeNow: 67 },

  capacity: { enrolled: 187, cap: 1000, remaining: 813, revenueIfFilled: 812187 },
};
