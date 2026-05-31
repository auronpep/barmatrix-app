const ANALYTICS_SCHEMA_VERSION = "2026-05-28";
const SESSION_STORAGE_KEY = "barmatrix_analytics_session_id";
const DISTINCT_STORAGE_KEY = "barmatrix_analytics_distinct_id";
const ATTRIBUTION_STORAGE_KEY = "barmatrix_analytics_attribution";
const PURCHASE_STORAGE_KEY = "barmatrix_analytics_purchase_ids";
const DIAGNOSTIC_COMPLETED_STORAGE_PREFIX = "barmatrix_analytics_diagnostic_completed:";
const REFERRAL_CLICK_STORAGE_PREFIX = "barmatrix_analytics_referral_click:";
const RED_ZONE_PREVIEW_STORAGE_PREFIX = "barmatrix_analytics_red_zone_preview:";
const EXPERIMENT_ASSIGNMENT_STORAGE_PREFIX = "barmatrix_analytics_experiment:";
const EVENT_DEDUPE_STORAGE_PREFIX = "barmatrix_analytics_event:";
const DEFAULT_DIAGNOSTIC_JURISDICTION = "CA";
export const DEFAULT_LAUNCH_COHORT_ID = "july_2026";

export type AnalyticsPrimitive = string | number | boolean;
export type AnalyticsValue = AnalyticsPrimitive | AnalyticsPrimitive[];
export type AnalyticsPayload = Record<string, AnalyticsValue>;

const SERVER_EVENT_DEDUPE_KEYS = new Set<string>();

type AnalyticsCatalogEntry = {
  area: "traffic" | "diagnostic" | "revenue" | "cohort" | "product" | "platform" | "partner";
  required: readonly string[];
  optional?: readonly string[];
};

type AnalyticsSession = {
  session_id: string;
  is_new_session: boolean;
};

export type RouteAnalyticsState = {
  hasTrackedSessionEvent: boolean;
  lastPageViewKey: string;
};

type RouteAnalyticsInput = {
  path: string | null | undefined;
  searchParams: URLSearchParams;
  state?: RouteAnalyticsState;
};

export type CheckoutPaymentPlan = "pay_in_full" | "two_pay_500_499";

type CheckoutStartedInput = {
  payment_plan: CheckoutPaymentPlan;
  searchParams: URLSearchParams;
  cohort_id?: string | null;
};

type PurchaseCompletedInput = {
  payment_plan: CheckoutPaymentPlan;
  partner_id?: string | null;
  checkout_session_id?: string | null;
  cohort_id?: string | null;
};

type ReferralClickInput = {
  searchParams: URLSearchParams;
  attribution?: StoredAttribution;
};

type ExperimentAssignmentInput = {
  experimentId: string;
  variants: readonly string[];
  searchParams?: URLSearchParams;
  forcedVariant?: string | null;
};

export type RepairAnalyticsSource = "diagnostic" | "dashboard" | "red_zone" | "manual" | "mobile";
export type RepairCompletionStatus = "completed" | "abandoned" | "skipped";

type RepairAnalyticsContext = {
  assignmentId?: string | null;
  repairId?: string | null;
  subject?: string | null;
  topic?: string | null;
  tensionPointId?: string | null;
  misconceptionCode?: string | null;
  sessionId?: string | null;
  cohortId?: string | null;
  studentId?: string | null;
};

type DrillStartedInput = RepairAnalyticsContext & {
  drillId: string;
  source: RepairAnalyticsSource;
};

type DrillCompletedInput = RepairAnalyticsContext & {
  drillId: string;
  completionStatus?: RepairCompletionStatus;
  durationSeconds?: number | null;
  questionCount?: number | null;
  correctCount?: number | null;
  masteryPassed?: boolean | null;
};

type BootcampStartedInput = RepairAnalyticsContext & {
  bootcampId: string;
  source: RepairAnalyticsSource;
};

type BootcampCompletedInput = RepairAnalyticsContext & {
  bootcampId: string;
  completionStatus?: RepairCompletionStatus;
  durationSeconds?: number | null;
  drillCount?: number | null;
  masteryPassed?: boolean | null;
  postScore?: number | null;
};

export type StoredAttribution = {
  source: string;
  campaign: string;
  partner_id: string;
  referrer: string;
};

const CHECKOUT_PLAN_ANALYTICS = {
  pay_in_full: {
    price_cents: 99900,
    net_collected_cents: 99900,
  },
  two_pay_500_499: {
    price_cents: 99900,
    net_collected_cents: 50000,
  },
} as const satisfies Record<CheckoutPaymentPlan, { price_cents: number; net_collected_cents: number }>;

type DiagnosticStartedInput = {
  searchParams?: URLSearchParams;
  jurisdiction?: string | null;
  sessionId?: string | null;
  cohortId?: string | null;
};

type DiagnosticCompletedInput = {
  sessionId: string;
  topTrapTags: string[];
  scoreBand: string;
  cohortId?: string | null;
};

type RedZonePreviewInput = {
  trapTags: string[];
  sessionId?: string | null;
  cohortId?: string | null;
  dedupeKey?: string | null;
};

type PricingViewedInput = {
  cohortStatus?: string | null;
  searchParams?: URLSearchParams;
  sessionId?: string | null;
  cohortId?: string | null;
};

type QuestionAttemptedInput = {
  questionId: string;
  correct: boolean;
  confidence: number;
  sessionId?: string | null;
  cohortId?: string | null;
  studentId?: string | null;
};

type ForensicsViewedInput = {
  attemptId: string;
  forensicTags: string[];
  sessionId?: string | null;
  cohortId?: string | null;
  studentId?: string | null;
};

declare global {
  interface Window {
    posthog?: {
      capture?: (eventId: string, properties?: AnalyticsPayload) => void;
    };
  }
}

export const ANALYTICS_EVENT_CATALOG = {
  page_viewed: {
    area: "traffic",
    required: ["path", "session_id"],
    optional: ["source", "campaign", "partner_id", "referrer"],
  },
  session_started: {
    area: "traffic",
    required: ["session_id", "path"],
    optional: ["source", "campaign", "partner_id", "referrer"],
  },
  session_resumed: {
    area: "traffic",
    required: ["session_id", "path"],
    optional: ["source", "campaign", "partner_id", "referrer"],
  },
  landing_page_viewed: {
    area: "traffic",
    required: ["path", "source", "campaign", "partner_id"],
    optional: ["session_id", "referrer"],
  },
  diagnostic_started: {
    area: "diagnostic",
    required: ["source", "jurisdiction", "partner_id"],
    optional: ["session_id", "cohort_id", "campaign", "referrer"],
  },
  diagnostic_completed: {
    area: "diagnostic",
    required: ["top_trap_tags", "score_band"],
    optional: ["session_id", "cohort_id", "source", "campaign", "partner_id"],
  },
  red_zone_preview_viewed: {
    area: "diagnostic",
    required: ["trap_tags"],
    optional: ["session_id", "cohort_id"],
  },
  trap_taxonomy_viewed: {
    area: "product",
    required: ["trap_count"],
    optional: ["official_count", "session_id", "cohort_id"],
  },
  trap_detail_viewed: {
    area: "product",
    required: ["slug"],
    optional: ["kinds", "question_count", "subject_distribution", "official", "session_id", "cohort_id"],
  },
  trap_profile_viewed: {
    area: "product",
    required: [],
    optional: ["distinct_traps", "total_falls", "session_id", "cohort_id"],
  },
  trap_history_viewed: {
    area: "product",
    required: ["slug"],
    optional: ["fell_count", "session_id", "cohort_id"],
  },
  tension_map_viewed: {
    area: "product",
    required: ["tension_count"],
    optional: ["official_count", "subject", "session_id", "cohort_id"],
  },
  tension_detail_viewed: {
    area: "product",
    required: ["slug"],
    optional: ["question_count", "subject", "official", "subject_distribution", "session_id", "cohort_id"],
  },
  practice_set_started: {
    area: "product",
    required: ["count"],
    optional: ["filter_subject", "filter_tension", "filter_trap", "session_id", "cohort_id"],
  },
  practice_set_completed: {
    area: "product",
    required: ["set_id", "correct_count", "total_count"],
    optional: ["session_id", "cohort_id"],
  },
  pricing_viewed: {
    area: "revenue",
    required: ["cohort_status"],
    optional: ["session_id", "cohort_id", "partner_id"],
  },
  checkout_started: {
    area: "revenue",
    required: ["price_cents", "payment_plan", "partner_id"],
    optional: ["session_id", "cohort_id", "source", "campaign"],
  },
  purchase_completed: {
    area: "revenue",
    required: ["price_cents", "net_collected_cents", "partner_id"],
    optional: ["session_id", "cohort_id", "seat_id", "payment_plan", "source", "campaign"],
  },
  cohort_seat_assigned: {
    area: "cohort",
    required: ["cohort_code", "public_status"],
    optional: ["session_id", "cohort_id", "seat_id", "student_id"],
  },
  dashboard_opened: {
    area: "product",
    required: ["platform", "entitlement_status"],
    optional: ["session_id", "cohort_id", "seat_id", "student_id"],
  },
  question_attempted: {
    area: "product",
    required: ["platform", "question_id", "correct", "confidence"],
    optional: ["session_id", "cohort_id", "student_id"],
  },
  forensics_viewed: {
    area: "product",
    required: ["platform", "attempt_id", "forensic_tags"],
    optional: ["session_id", "cohort_id", "student_id"],
  },
  drill_assigned: {
    area: "product",
    required: ["drill_id", "reason"],
    optional: ["session_id", "cohort_id", "student_id"],
  },
  drill_started: {
    area: "product",
    required: ["drill_id", "source"],
    optional: [
      "session_id",
      "cohort_id",
      "student_id",
      "assignment_id",
      "repair_id",
      "subject",
      "topic",
      "tension_point_id",
      "misconception_code",
    ],
  },
  drill_completed: {
    area: "product",
    required: ["drill_id", "completion_status"],
    optional: [
      "session_id",
      "cohort_id",
      "student_id",
      "assignment_id",
      "repair_id",
      "subject",
      "topic",
      "tension_point_id",
      "misconception_code",
      "duration_seconds",
      "question_count",
      "correct_count",
      "mastery_passed",
    ],
  },
  drill_library_viewed: {
    area: "product",
    required: [],
    optional: [
      "platform",
      "session_id",
      "cohort_id",
      "student_id",
      "prescribed_count",
      "free_count",
    ],
  },
  bootcamp_started: {
    area: "product",
    required: ["bootcamp_id", "source"],
    optional: [
      "session_id",
      "cohort_id",
      "student_id",
      "assignment_id",
      "repair_id",
      "subject",
      "topic",
      "tension_point_id",
      "misconception_code",
    ],
  },
  bootcamp_completed: {
    area: "product",
    required: ["bootcamp_id", "completion_status"],
    optional: [
      "session_id",
      "cohort_id",
      "student_id",
      "assignment_id",
      "repair_id",
      "subject",
      "topic",
      "tension_point_id",
      "misconception_code",
      "duration_seconds",
      "drill_count",
      "mastery_passed",
      "post_score",
    ],
  },
  mobile_login_success: {
    area: "platform",
    required: ["platform", "app_version"],
    optional: ["session_id", "student_id"],
  },
  referral_click: {
    area: "partner",
    required: ["partner_id", "campaign_id"],
    optional: ["session_id", "source"],
  },
  experiment_assigned: {
    area: "traffic",
    required: ["experiment_id", "variant_id"],
    optional: ["session_id", "source", "campaign", "partner_id"],
  },
  partner_purchase_completed: {
    area: "partner",
    required: ["partner_id", "purchase_id"],
    optional: ["session_id", "cohort_id"],
  },
} as const satisfies Record<string, AnalyticsCatalogEntry>;

export type AnalyticsEventId = keyof typeof ANALYTICS_EVENT_CATALOG;
export type AnalyticsProperties = Partial<Record<AnalyticsPropertyKey, AnalyticsValue | null | undefined>>;
export type AnalyticsDedupeScope = "session" | "local" | "memory";

export type AnalyticsValidationResult = {
  event_id: AnalyticsEventId;
  valid: boolean;
  missing_properties: readonly string[];
  payload: AnalyticsPayload;
};

type TrackAnalyticsOptions = {
  dedupeKey?: string | null;
  dedupeScope?: AnalyticsDedupeScope;
};

type AnalyticsPropertyKey =
  | SharedPropertyKey
  | (typeof ANALYTICS_EVENT_CATALOG)[AnalyticsEventId]["required"][number]
  | NonNullable<(typeof ANALYTICS_EVENT_CATALOG)[AnalyticsEventId]["optional"]>[number]
  | "schema_version";

type AnalyticsFunnelStep = {
  order: number;
  event_id: AnalyticsEventId;
  label: string;
  required_properties: readonly AnalyticsPropertyKey[];
};

type AnalyticsFunnelDefinition = {
  posthog_title: string;
  source_refs: readonly string[];
  conversion_window_hours: number;
  steps: readonly AnalyticsFunnelStep[];
  breakdown_properties: readonly AnalyticsPropertyKey[];
  notes: string;
};

type AnalyticsDashboardFilter = {
  property: AnalyticsPropertyKey;
  operator: "equals" | "not_equals";
  value: AnalyticsValue;
};

type AnalyticsDashboardCard = {
  title: string;
  event_id: AnalyticsEventId;
  metric: "count" | "sum";
  interval: "day";
  property?: AnalyticsPropertyKey;
  filters?: readonly AnalyticsDashboardFilter[];
};

type AnalyticsDashboardDefinition = {
  posthog_title: string;
  source_refs: readonly string[];
  cards: readonly AnalyticsDashboardCard[];
  breakdown_properties: readonly AnalyticsPropertyKey[];
  notes: string;
};

type AnalyticsReportQuery = {
  query_id: string;
  title: string;
  event_id: AnalyticsEventId;
  metric: "count" | "sum";
  interval: "week";
  property?: AnalyticsPropertyKey;
  filters?: readonly AnalyticsDashboardFilter[];
};

type AnalyticsReportDefinition = {
  posthog_title: string;
  source_refs: readonly string[];
  cadence: "weekly";
  queries: readonly AnalyticsReportQuery[];
  breakdown_properties: readonly AnalyticsPropertyKey[];
  external_inputs: readonly string[];
  notes: string;
};

type SharedPropertyKey =
  | "cohort_id"
  | "seat_id"
  | "session_id"
  | "student_id"
  | "platform"
  | "environment";

export const ANALYTICS_FUNNEL_CATALOG = {
  launch_home_diagnostic_red_zone_checkout: {
    posthog_title: "BarMatrix Launch Home Diagnostic Red-Zone Checkout",
    source_refs: ["SRC-0021", "SRC-0032"],
    conversion_window_hours: 24,
    steps: [
      {
        order: 1,
        event_id: "landing_page_viewed",
        label: "Home page viewed",
        required_properties: ["path", "source", "campaign", "partner_id"],
      },
      {
        order: 2,
        event_id: "diagnostic_started",
        label: "Diagnostic started",
        required_properties: ["source", "jurisdiction", "partner_id"],
      },
      {
        order: 3,
        event_id: "diagnostic_completed",
        label: "Diagnostic completed",
        required_properties: ["top_trap_tags", "score_band"],
      },
      {
        order: 4,
        event_id: "red_zone_preview_viewed",
        label: "Red-Zone preview viewed",
        required_properties: ["trap_tags"],
      },
      {
        order: 5,
        event_id: "pricing_viewed",
        label: "Pricing viewed",
        required_properties: ["cohort_status"],
      },
      {
        order: 6,
        event_id: "checkout_started",
        label: "Checkout started",
        required_properties: ["price_cents", "payment_plan", "partner_id"],
      },
    ],
    breakdown_properties: ["source", "campaign", "partner_id", "score_band", "cohort_status", "payment_plan"],
    notes: "Primary launch funnel from home traffic through diagnostic, Red-Zone preview, pricing, and checkout intent.",
  },
  drill_engagement: {
    posthog_title: "BarMatrix Drill Engagement",
    source_refs: ["SRC-0032"],
    conversion_window_hours: 168,
    steps: [
      {
        order: 1,
        event_id: "drill_assigned",
        label: "Repair drill assigned",
        required_properties: ["drill_id"],
      },
      {
        order: 2,
        event_id: "drill_started",
        label: "Assigned drill opened",
        required_properties: ["drill_id", "source"],
      },
      {
        order: 3,
        event_id: "drill_completed",
        label: "Assigned drill completed",
        required_properties: ["drill_id", "completion_status"],
      },
    ],
    breakdown_properties: [
      "cohort_id",
      "assignment_id",
      "repair_id",
      "subject",
      "topic",
      "misconception_code",
    ],
    notes: "Use this funnel for product-dashboard drill starts, completions, and paid users without first drill.",
  },
  bootcamp_completion: {
    posthog_title: "BarMatrix Bootcamp Completion",
    source_refs: ["SRC-0032"],
    conversion_window_hours: 336,
    steps: [
      {
        order: 1,
        event_id: "bootcamp_started",
        label: "Bootcamp opened",
        required_properties: ["bootcamp_id", "source"],
      },
      {
        order: 2,
        event_id: "drill_completed",
        label: "Bootcamp drill completed",
        required_properties: ["drill_id", "completion_status"],
      },
      {
        order: 3,
        event_id: "bootcamp_completed",
        label: "Bootcamp completed",
        required_properties: ["bootcamp_id", "completion_status"],
      },
    ],
    breakdown_properties: [
      "cohort_id",
      "bootcamp_id",
      "source",
      "completion_status",
      "subject",
      "topic",
      "misconception_code",
      "mastery_passed",
    ],
    notes: "Use this funnel for longer repair programs, bootcamp abandonment, and mastery completion review.",
  },
  return_engagement: {
    posthog_title: "BarMatrix Return Engagement",
    source_refs: ["SRC-0032"],
    conversion_window_hours: 72,
    steps: [
      {
        order: 1,
        event_id: "session_resumed",
        label: "Returning session resumed",
        required_properties: ["session_id", "path"],
      },
      {
        order: 2,
        event_id: "dashboard_opened",
        label: "Paid dashboard opened",
        required_properties: ["platform", "entitlement_status"],
      },
      {
        order: 3,
        event_id: "question_attempted",
        label: "Question attempted after return",
        required_properties: ["platform", "question_id", "correct", "confidence"],
      },
      {
        order: 4,
        event_id: "forensics_viewed",
        label: "Forensics viewed after return",
        required_properties: ["platform", "attempt_id", "forensic_tags"],
      },
    ],
    breakdown_properties: [
      "platform",
      "cohort_id",
      "entitlement_status",
      "source",
      "campaign",
      "partner_id",
    ],
    notes: "Use this funnel for retained student return sessions, active practice, forensics engagement, and app usage by platform.",
  },
} as const satisfies Record<string, AnalyticsFunnelDefinition>;

type AnalyticsFunnelId = keyof typeof ANALYTICS_FUNNEL_CATALOG;
type AnalyticsAlertSeverity = "warning" | "critical";
type AnalyticsAlertAudience = "ops" | "growth" | "product";

type AnalyticsFunnelDropAlertDefinition = {
  posthog_title: string;
  source_refs: readonly string[];
  funnel_id: AnalyticsFunnelId;
  from_event_id: AnalyticsEventId;
  to_event_id: AnalyticsEventId;
  metric: "conversion_rate";
  interval: "day";
  lookback_days: number;
  baseline_days: number;
  threshold_drop_percent: number;
  minimum_from_count: number;
  severity: AnalyticsAlertSeverity;
  notify: readonly AnalyticsAlertAudience[];
  breakdown_properties: readonly AnalyticsPropertyKey[];
  notes: string;
};

export const ANALYTICS_DASHBOARD_CATALOG = {
  daily_revenue: {
    posthog_title: "BarMatrix Daily Revenue",
    source_refs: ["SRC-0032"],
    cards: [
      {
        title: "Checkout starts by day",
        event_id: "checkout_started",
        metric: "count",
        interval: "day",
      },
      {
        title: "Purchases by day",
        event_id: "purchase_completed",
        metric: "count",
        interval: "day",
      },
      {
        title: "Net collected cents by day",
        event_id: "purchase_completed",
        metric: "sum",
        interval: "day",
        property: "net_collected_cents",
      },
      {
        title: "Booked price cents by day",
        event_id: "purchase_completed",
        metric: "sum",
        interval: "day",
        property: "price_cents",
      },
      {
        title: "Payment-plan starts by day",
        event_id: "checkout_started",
        metric: "count",
        interval: "day",
        filters: [
          {
            property: "payment_plan",
            operator: "equals",
            value: "two_pay_500_499",
          },
        ],
      },
      {
        title: "Partner-attributed purchases by day",
        event_id: "purchase_completed",
        metric: "count",
        interval: "day",
        filters: [
          {
            property: "partner_id",
            operator: "not_equals",
            value: "none",
          },
        ],
      },
    ],
    breakdown_properties: ["payment_plan", "partner_id", "source", "campaign", "cohort_id"],
    notes: "Use cents for revenue math in PostHog, then format dashboard display values as dollars.",
  },
  cohort_fill_progress: {
    posthog_title: "BarMatrix Cohort-Fill Progress",
    source_refs: ["SRC-0032"],
    cards: [
      {
        title: "Pricing views by cohort status",
        event_id: "pricing_viewed",
        metric: "count",
        interval: "day",
      },
      {
        title: "Checkout starts by plan",
        event_id: "checkout_started",
        metric: "count",
        interval: "day",
      },
      {
        title: "Purchases by plan",
        event_id: "purchase_completed",
        metric: "count",
        interval: "day",
      },
      {
        title: "Seats assigned by public status",
        event_id: "cohort_seat_assigned",
        metric: "count",
        interval: "day",
      },
      {
        title: "Limited-status pricing views",
        event_id: "pricing_viewed",
        metric: "count",
        interval: "day",
        filters: [
          {
            property: "cohort_status",
            operator: "equals",
            value: "limited",
          },
        ],
      },
      {
        title: "Partner-influenced checkout starts",
        event_id: "checkout_started",
        metric: "count",
        interval: "day",
        filters: [
          {
            property: "partner_id",
            operator: "not_equals",
            value: "none",
          },
        ],
      },
    ],
    breakdown_properties: [
      "cohort_id",
      "cohort_code",
      "public_status",
      "cohort_status",
      "payment_plan",
      "partner_id",
    ],
    notes: "Use public cohort status and assigned-seat events to monitor fill progress without exposing internal capacity values.",
  },
  acquisition_by_channel: {
    posthog_title: "BarMatrix Acquisition by Channel",
    source_refs: ["SRC-0032"],
    cards: [
      {
        title: "Visitors by source",
        event_id: "page_viewed",
        metric: "count",
        interval: "day",
      },
      {
        title: "Landing views by campaign",
        event_id: "landing_page_viewed",
        metric: "count",
        interval: "day",
      },
      {
        title: "Diagnostic starts by channel",
        event_id: "diagnostic_started",
        metric: "count",
        interval: "day",
      },
      {
        title: "Diagnostic completions by channel",
        event_id: "diagnostic_completed",
        metric: "count",
        interval: "day",
      },
      {
        title: "Checkout starts by channel",
        event_id: "checkout_started",
        metric: "count",
        interval: "day",
      },
      {
        title: "Purchases by channel",
        event_id: "purchase_completed",
        metric: "count",
        interval: "day",
      },
      {
        title: "Referral clicks by partner",
        event_id: "referral_click",
        metric: "count",
        interval: "day",
      },
    ],
    breakdown_properties: ["source", "campaign", "partner_id", "referrer", "cohort_id"],
    notes: "Use this dashboard for visitors by source, diagnostic conversion, partner attribution, and acquisition quality by channel.",
  },
  referral_attribution: {
    posthog_title: "BarMatrix Referral Attribution",
    source_refs: ["SRC-0032"],
    cards: [
      {
        title: "Referral clicks by day",
        event_id: "referral_click",
        metric: "count",
        interval: "day",
      },
      {
        title: "Partner diagnostic starts by day",
        event_id: "diagnostic_started",
        metric: "count",
        interval: "day",
        filters: [
          {
            property: "partner_id",
            operator: "not_equals",
            value: "none",
          },
        ],
      },
      {
        title: "Partner checkout starts by day",
        event_id: "checkout_started",
        metric: "count",
        interval: "day",
        filters: [
          {
            property: "partner_id",
            operator: "not_equals",
            value: "none",
          },
        ],
      },
      {
        title: "Partner purchases by day",
        event_id: "purchase_completed",
        metric: "count",
        interval: "day",
        filters: [
          {
            property: "partner_id",
            operator: "not_equals",
            value: "none",
          },
        ],
      },
      {
        title: "Partner purchase confirmations by day",
        event_id: "partner_purchase_completed",
        metric: "count",
        interval: "day",
      },
      {
        title: "Partner net collected cents by day",
        event_id: "purchase_completed",
        metric: "sum",
        interval: "day",
        property: "net_collected_cents",
        filters: [
          {
            property: "partner_id",
            operator: "not_equals",
            value: "none",
          },
        ],
      },
    ],
    breakdown_properties: ["partner_id", "campaign_id", "campaign", "source", "payment_plan", "cohort_id"],
    notes: "Use this dashboard for partner effectiveness from click through checkout and purchase confirmation without exposing payout details.",
  },
  forensics_usage: {
    posthog_title: "BarMatrix Forensics Usage",
    source_refs: ["SRC-0032"],
    cards: [
      {
        title: "Question attempts by day",
        event_id: "question_attempted",
        metric: "count",
        interval: "day",
      },
      {
        title: "Wrong attempts by day",
        event_id: "question_attempted",
        metric: "count",
        interval: "day",
        filters: [
          {
            property: "correct",
            operator: "equals",
            value: false,
          },
        ],
      },
      {
        title: "Confidence-5 attempts by day",
        event_id: "question_attempted",
        metric: "count",
        interval: "day",
        filters: [
          {
            property: "confidence",
            operator: "equals",
            value: 5,
          },
        ],
      },
      {
        title: "Forensics views by day",
        event_id: "forensics_viewed",
        metric: "count",
        interval: "day",
      },
      {
        title: "Drill starts after forensics by day",
        event_id: "drill_started",
        metric: "count",
        interval: "day",
      },
    ],
    breakdown_properties: ["platform", "cohort_id", "forensic_tags", "correct", "confidence", "drill_id"],
    notes: "Use this dashboard for forensics views, top trap tags, high-confidence wrong inputs, and follow-on drill usage.",
  },
} as const satisfies Record<string, AnalyticsDashboardDefinition>;

export const ANALYTICS_REPORT_QUERY_CATALOG = {
  weekly_kpi_rollup: {
    posthog_title: "BarMatrix Weekly KPI Rollup",
    source_refs: ["SRC-0032"],
    cadence: "weekly",
    queries: [
      {
        query_id: "visitors_by_source",
        title: "Visitors by source",
        event_id: "page_viewed",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "diagnostic_starts",
        title: "Diagnostic starts",
        event_id: "diagnostic_started",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "diagnostic_completions",
        title: "Diagnostic completions",
        event_id: "diagnostic_completed",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "pricing_views",
        title: "Pricing views",
        event_id: "pricing_viewed",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "checkout_starts",
        title: "Checkout starts",
        event_id: "checkout_started",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "purchases",
        title: "Purchases",
        event_id: "purchase_completed",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "net_collected_cents",
        title: "Net collected cents",
        event_id: "purchase_completed",
        metric: "sum",
        interval: "week",
        property: "net_collected_cents",
      },
      {
        query_id: "payment_plan_starts",
        title: "Payment-plan starts",
        event_id: "checkout_started",
        metric: "count",
        interval: "week",
        filters: [
          {
            property: "payment_plan",
            operator: "equals",
            value: "two_pay_500_499",
          },
        ],
      },
      {
        query_id: "cohort_seats_assigned",
        title: "Cohort seats assigned",
        event_id: "cohort_seat_assigned",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "referral_attributed_purchases",
        title: "Referral-attributed purchases",
        event_id: "purchase_completed",
        metric: "count",
        interval: "week",
        filters: [
          {
            property: "partner_id",
            operator: "not_equals",
            value: "none",
          },
        ],
      },
      {
        query_id: "app_logins",
        title: "App logins",
        event_id: "mobile_login_success",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "dashboard_opens",
        title: "Dashboard opens",
        event_id: "dashboard_opened",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "forensics_views",
        title: "Forensics views",
        event_id: "forensics_viewed",
        metric: "count",
        interval: "week",
      },
      {
        query_id: "drill_starts",
        title: "Drill starts",
        event_id: "drill_started",
        metric: "count",
        interval: "week",
      },
    ],
    breakdown_properties: ["source", "campaign", "partner_id", "cohort_id", "platform"],
    external_inputs: ["media_spend", "support_p0_count"],
    notes: "Use this query set for the weekly command rollup. CAC, ROAS, and support health need external spend/support inputs joined outside browser analytics.",
  },
} as const satisfies Record<string, AnalyticsReportDefinition>;

export const ANALYTICS_ALERT_CATALOG = {
  diagnostic_completion_drop: {
    posthog_title: "BarMatrix Alert Diagnostic Completion Drop",
    source_refs: ["SRC-0032"],
    funnel_id: "launch_home_diagnostic_red_zone_checkout",
    from_event_id: "diagnostic_started",
    to_event_id: "diagnostic_completed",
    metric: "conversion_rate",
    interval: "day",
    lookback_days: 1,
    baseline_days: 14,
    threshold_drop_percent: 35,
    minimum_from_count: 20,
    severity: "warning",
    notify: ["ops", "growth"],
    breakdown_properties: ["source", "campaign", "partner_id"],
    notes: "Alert when diagnostic starts are healthy but same-day completions fall materially below the recent baseline.",
  },
  pricing_checkout_drop: {
    posthog_title: "BarMatrix Alert Pricing to Checkout Drop",
    source_refs: ["SRC-0032"],
    funnel_id: "launch_home_diagnostic_red_zone_checkout",
    from_event_id: "pricing_viewed",
    to_event_id: "checkout_started",
    metric: "conversion_rate",
    interval: "day",
    lookback_days: 1,
    baseline_days: 14,
    threshold_drop_percent: 30,
    minimum_from_count: 20,
    severity: "warning",
    notify: ["ops", "growth"],
    breakdown_properties: ["source", "campaign", "partner_id", "cohort_status", "payment_plan"],
    notes: "Alert when pricing interest stops becoming checkout intent after enough pricing views to avoid noisy alerts.",
  },
  checkout_purchase_drop: {
    posthog_title: "BarMatrix Alert Checkout to Purchase Drop",
    source_refs: ["SRC-0032"],
    funnel_id: "launch_home_diagnostic_red_zone_checkout",
    from_event_id: "checkout_started",
    to_event_id: "purchase_completed",
    metric: "conversion_rate",
    interval: "day",
    lookback_days: 1,
    baseline_days: 14,
    threshold_drop_percent: 25,
    minimum_from_count: 10,
    severity: "critical",
    notify: ["ops", "growth"],
    breakdown_properties: ["source", "campaign", "partner_id", "payment_plan", "cohort_id"],
    notes: "Alert when checkout starts stop producing successful purchases; investigate payment, entitlement, and success-route health first.",
  },
  return_product_drop: {
    posthog_title: "BarMatrix Alert Return Product Drop",
    source_refs: ["SRC-0032"],
    funnel_id: "return_engagement",
    from_event_id: "dashboard_opened",
    to_event_id: "question_attempted",
    metric: "conversion_rate",
    interval: "day",
    lookback_days: 1,
    baseline_days: 14,
    threshold_drop_percent: 35,
    minimum_from_count: 20,
    severity: "warning",
    notify: ["ops", "product"],
    breakdown_properties: ["platform", "cohort_id", "entitlement_status"],
    notes: "Alert when paid product opens stop turning into active practice, grouped only by safe product properties.",
  },
} as const satisfies Record<string, AnalyticsFunnelDropAlertDefinition>;

const SHARED_KEYS = new Set<SharedPropertyKey>([
  "cohort_id",
  "seat_id",
  "session_id",
  "student_id",
  "platform",
  "environment",
]);

export function validateAnalyticsEvent(
  eventId: AnalyticsEventId,
  properties: AnalyticsProperties,
): AnalyticsValidationResult {
  const entry = ANALYTICS_EVENT_CATALOG[eventId];
  const payload = buildAnalyticsPayload(entry, properties);
  const missingProperties = getMissingRequiredProperties(entry, payload);

  return {
    event_id: eventId,
    valid: missingProperties.length === 0,
    missing_properties: missingProperties,
    payload,
  };
}

export function trackAnalyticsEvent(
  eventId: AnalyticsEventId,
  properties: AnalyticsProperties,
  options: TrackAnalyticsOptions = {},
): boolean {
  const validation = validateAnalyticsEvent(eventId, properties);

  if (!validation.valid || hasAnalyticsEventDedupeMarker(eventId, options)) {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }

  const payload = {
    schema_version: ANALYTICS_SCHEMA_VERSION,
    environment: getAnalyticsEnvironment(),
    platform: "web",
    ...validation.payload,
  } satisfies AnalyticsPayload;

  if (window.posthog?.capture) {
    window.posthog.capture(eventId, payload);
    markAnalyticsEventDedupeMarker(eventId, options);
    return true;
  }

  const captured = captureViaPostHogEndpoint(eventId, payload);

  if (captured) {
    markAnalyticsEventDedupeMarker(eventId, options);
  }

  return captured;
}

export function getAnalyticsSession(): AnalyticsSession {
  if (typeof window === "undefined") {
    return {
      session_id: "server",
      is_new_session: false,
    };
  }

  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (existing) {
    return {
      session_id: existing,
      is_new_session: false,
    };
  }

  const sessionId = createStableId("sess");
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);

  return {
    session_id: sessionId,
    is_new_session: true,
  };
}

export function getAttributionProperties(searchParams: URLSearchParams): StoredAttribution {
  const current = readCurrentAttribution(searchParams);
  const stored = readStoredAttribution();
  const nextAttribution = {
    source: current.source || stored.source || getReferrerSource(),
    campaign: current.campaign || stored.campaign || "none",
    partner_id: current.partner_id || stored.partner_id || "none",
    referrer: stored.referrer || getReferrerSource(),
  };

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(nextAttribution));
  }

  return nextAttribution;
}

export function trackDiagnosticStarted({
  searchParams = new URLSearchParams(),
  jurisdiction = DEFAULT_DIAGNOSTIC_JURISDICTION,
  sessionId,
  cohortId,
}: DiagnosticStartedInput = {}): boolean {
  const attribution = getAttributionProperties(searchParams);

  return trackAnalyticsEvent("diagnostic_started", {
    source: attribution.source,
    campaign: attribution.campaign,
    jurisdiction: normalizeJurisdiction(jurisdiction),
    partner_id: attribution.partner_id,
    referrer: attribution.referrer,
    session_id: cleanToken(sessionId) || undefined,
    cohort_id: cleanToken(cohortId) || undefined,
  });
}

export function trackDiagnosticCompletedOnce(input: DiagnosticCompletedInput): boolean {
  if (hasDiagnosticCompletedMarker(input.sessionId)) {
    return false;
  }

  const attribution = readStoredAttribution();
  const captured = trackAnalyticsEvent("diagnostic_completed", {
    top_trap_tags: normalizeTrapTags(input.topTrapTags),
    score_band: cleanToken(input.scoreBand) || "unknown",
    session_id: cleanToken(input.sessionId),
    cohort_id: cleanToken(input.cohortId) || undefined,
    source: attribution.source,
    campaign: attribution.campaign,
    partner_id: attribution.partner_id,
  });

  if (captured) {
    markDiagnosticCompleted(input.sessionId);
  }

  return captured;
}

type TrapTaxonomyViewedInput = {
  trapCount: number;
  officialCount?: number | null;
  sessionId?: string | null;
  cohortId?: string | null;
};

export function trackTrapTaxonomyViewedOnce({
  trapCount,
  officialCount,
  sessionId,
  cohortId,
}: TrapTaxonomyViewedInput): boolean {
  return trackAnalyticsEvent(
    "trap_taxonomy_viewed",
    {
      trap_count: normalizeNonNegativeInteger(trapCount) ?? 0,
      official_count: normalizeNonNegativeInteger(officialCount ?? undefined),
      session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
      cohort_id: cleanToken(cohortId) || undefined,
    },
    { dedupeKey: "trap-taxonomy", dedupeScope: "session" },
  );
}

type TrapDetailViewedInput = {
  slug: string;
  kinds?: string[];
  questionCount?: number | null;
  subjectDistribution?: string[];
  official?: boolean | null;
  sessionId?: string | null;
  cohortId?: string | null;
};

export function trackTrapDetailViewedOnce({
  slug,
  kinds,
  questionCount,
  subjectDistribution,
  official,
  sessionId,
  cohortId,
}: TrapDetailViewedInput): boolean {
  const cleanSlug = cleanToken(slug);
  return trackAnalyticsEvent(
    "trap_detail_viewed",
    {
      slug: cleanSlug,
      kinds:
        kinds && kinds.length > 0
          ? kinds.map((kind) => cleanToken(kind)).filter(Boolean)
          : undefined,
      question_count: normalizeNonNegativeInteger(questionCount ?? undefined),
      subject_distribution:
        subjectDistribution && subjectDistribution.length > 0
          ? subjectDistribution.slice(0, 12)
          : undefined,
      official: official ?? undefined,
      session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
      cohort_id: cleanToken(cohortId) || undefined,
    },
    { dedupeKey: `trap-detail:${cleanSlug}`, dedupeScope: "session" },
  );
}

type TrapProfileViewedInput = {
  distinctTraps?: number | null;
  totalFalls?: number | null;
  sessionId?: string | null;
  cohortId?: string | null;
};

export function trackTrapProfileViewedOnce({
  distinctTraps,
  totalFalls,
  sessionId,
  cohortId,
}: TrapProfileViewedInput): boolean {
  return trackAnalyticsEvent(
    "trap_profile_viewed",
    {
      distinct_traps: normalizeNonNegativeInteger(distinctTraps ?? undefined),
      total_falls: normalizeNonNegativeInteger(totalFalls ?? undefined),
      session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
      cohort_id: cleanToken(cohortId) || undefined,
    },
    { dedupeKey: "trap-profile", dedupeScope: "session" },
  );
}

type TrapHistoryViewedInput = {
  slug: string;
  fellCount?: number | null;
  sessionId?: string | null;
  cohortId?: string | null;
};

export function trackTrapHistoryViewedOnce({
  slug,
  fellCount,
  sessionId,
  cohortId,
}: TrapHistoryViewedInput): boolean {
  const cleanSlug = cleanToken(slug);
  return trackAnalyticsEvent(
    "trap_history_viewed",
    {
      slug: cleanSlug,
      fell_count: normalizeNonNegativeInteger(fellCount ?? undefined),
      session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
      cohort_id: cleanToken(cohortId) || undefined,
    },
    { dedupeKey: `trap-history:${cleanSlug}`, dedupeScope: "session" },
  );
}

type TensionMapViewedInput = {
  tensionCount: number;
  officialCount?: number | null;
  subject?: string | null;
  sessionId?: string | null;
  cohortId?: string | null;
};

export function trackTensionMapViewedOnce({
  tensionCount,
  officialCount,
  subject,
  sessionId,
  cohortId,
}: TensionMapViewedInput): boolean {
  return trackAnalyticsEvent(
    "tension_map_viewed",
    {
      tension_count: normalizeNonNegativeInteger(tensionCount) ?? 0,
      official_count: normalizeNonNegativeInteger(officialCount ?? undefined),
      subject: cleanToken(subject) || undefined,
      session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
      cohort_id: cleanToken(cohortId) || undefined,
    },
    { dedupeKey: "tension-map", dedupeScope: "session" },
  );
}

type TensionDetailViewedInput = {
  slug: string;
  questionCount?: number | null;
  subject?: string | null;
  official?: boolean | null;
  subjectDistribution?: string[];
  sessionId?: string | null;
  cohortId?: string | null;
};

export function trackTensionDetailViewedOnce({
  slug,
  questionCount,
  subject,
  official,
  subjectDistribution,
  sessionId,
  cohortId,
}: TensionDetailViewedInput): boolean {
  const cleanSlug = cleanToken(slug);
  return trackAnalyticsEvent(
    "tension_detail_viewed",
    {
      slug: cleanSlug,
      question_count: normalizeNonNegativeInteger(questionCount ?? undefined),
      subject: cleanToken(subject) || undefined,
      official: official ?? undefined,
      subject_distribution:
        subjectDistribution && subjectDistribution.length > 0
          ? subjectDistribution.slice(0, 12)
          : undefined,
      session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
      cohort_id: cleanToken(cohortId) || undefined,
    },
    { dedupeKey: `tension-detail:${cleanSlug}`, dedupeScope: "session" },
  );
}

type PracticeSetStartedInput = {
  count: number;
  filterSubject?: string | null;
  filterTension?: string | null;
  filterTrap?: string | null;
  sessionId?: string | null;
  cohortId?: string | null;
};

export function trackPracticeSetStarted({
  count,
  filterSubject,
  filterTension,
  filterTrap,
  sessionId,
  cohortId,
}: PracticeSetStartedInput): boolean {
  return trackAnalyticsEvent("practice_set_started", {
    count: normalizeNonNegativeInteger(count) ?? 0,
    filter_subject: cleanToken(filterSubject) || undefined,
    filter_tension: cleanToken(filterTension) || undefined,
    filter_trap: cleanToken(filterTrap) || undefined,
    session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
    cohort_id: cleanToken(cohortId) || undefined,
  });
}

type PracticeSetCompletedInput = {
  setId: string;
  correctCount: number;
  totalCount: number;
  sessionId?: string | null;
  cohortId?: string | null;
};

export function trackPracticeSetCompletedOnce({
  setId,
  correctCount,
  totalCount,
  sessionId,
  cohortId,
}: PracticeSetCompletedInput): boolean {
  const cleanSetId = cleanToken(setId);
  return trackAnalyticsEvent(
    "practice_set_completed",
    {
      set_id: cleanSetId,
      correct_count: normalizeNonNegativeInteger(correctCount) ?? 0,
      total_count: normalizeNonNegativeInteger(totalCount) ?? 0,
      session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
      cohort_id: cleanToken(cohortId) || undefined,
    },
    { dedupeKey: `practice-set:${cleanSetId}`, dedupeScope: "session" },
  );
}

export function trackRedZonePreviewViewedOnce(input: RedZonePreviewInput): boolean {
  const trapTags = normalizeTrapTags(input.trapTags);
  const sessionId = cleanToken(input.sessionId) || getAnalyticsSession().session_id;
  const dedupeKey = cleanToken(input.dedupeKey) || cleanToken(input.sessionId) || trapTags.join("_");

  if (hasRedZonePreviewMarker(dedupeKey)) {
    return false;
  }

  const captured = trackAnalyticsEvent("red_zone_preview_viewed", {
    trap_tags: trapTags,
    session_id: sessionId,
    cohort_id: cleanToken(input.cohortId) || undefined,
  });

  if (captured) {
    markRedZonePreviewViewed(dedupeKey);
  }

  return captured;
}

export function trackQuestionAttempted({
  questionId,
  correct,
  confidence,
  sessionId,
  cohortId,
  studentId,
}: QuestionAttemptedInput): boolean {
  return trackAnalyticsEvent("question_attempted", {
    platform: "web",
    question_id: cleanToken(questionId),
    correct,
    confidence: normalizeConfidence(confidence),
    session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
    cohort_id: cleanToken(cohortId) || undefined,
    student_id: cleanToken(studentId) || undefined,
  });
}

export function trackForensicsViewed({
  attemptId,
  forensicTags,
  sessionId,
  cohortId,
  studentId,
}: ForensicsViewedInput): boolean {
  return trackAnalyticsEvent("forensics_viewed", {
    platform: "web",
    attempt_id: cleanToken(attemptId),
    forensic_tags: normalizeTrapTags(forensicTags),
    session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
    cohort_id: cleanToken(cohortId) || undefined,
    student_id: cleanToken(studentId) || undefined,
  });
}

export function trackPricingViewed({
  cohortStatus = "limited",
  searchParams = new URLSearchParams(),
  sessionId,
  cohortId,
}: PricingViewedInput = {}): boolean {
  const attribution = getAttributionProperties(searchParams);

  return trackAnalyticsEvent("pricing_viewed", {
    cohort_status: cleanToken(cohortStatus) || "limited",
    partner_id: attribution.partner_id,
    session_id: cleanToken(sessionId) || getAnalyticsSession().session_id,
    cohort_id: cleanToken(cohortId) || undefined,
  });
}

export function createRouteAnalyticsState(): RouteAnalyticsState {
  return {
    hasTrackedSessionEvent: false,
    lastPageViewKey: "",
  };
}

export function trackRouteAnalytics({
  path,
  searchParams,
  state = createRouteAnalyticsState(),
}: RouteAnalyticsInput): RouteAnalyticsState {
  const routePath = normalizeAnalyticsPath(path);
  const attribution = getAttributionProperties(searchParams);
  const session = getAnalyticsSession();
  const nextState = { ...state };

  trackReferralClickFromSearch({ searchParams, attribution });

  if (!nextState.hasTrackedSessionEvent) {
    trackAnalyticsEvent(session.is_new_session ? "session_started" : "session_resumed", {
      ...attribution,
      path: routePath,
      session_id: session.session_id,
    });
    nextState.hasTrackedSessionEvent = true;
  }

  const pageViewKey = buildPageViewKey(session.session_id, routePath, searchParams);

  if (nextState.lastPageViewKey !== pageViewKey) {
    trackAnalyticsEvent("page_viewed", {
      ...attribution,
      path: routePath,
      session_id: session.session_id,
    });

    if (routePath === "/") {
      trackAnalyticsEvent("landing_page_viewed", {
        ...attribution,
        path: routePath,
        session_id: session.session_id,
      });
    }

    nextState.lastPageViewKey = pageViewKey;
  }

  return nextState;
}

export function trackReferralClickFromSearch({
  searchParams,
  attribution = getAttributionProperties(searchParams),
}: ReferralClickInput): boolean {
  const partnerId = cleanToken(searchParams.get("partner_id") ?? searchParams.get("ref"));

  if (!partnerId) {
    return false;
  }

  const campaignId = cleanToken(
    searchParams.get("campaign_id") ?? searchParams.get("utm_campaign") ?? searchParams.get("campaign"),
  ) || "none";
  const referralKey = `${partnerId}:${campaignId}`;

  if (hasReferralClickMarker(referralKey)) {
    return false;
  }

  const captured = trackAnalyticsEvent("referral_click", {
    partner_id: partnerId,
    campaign_id: campaignId,
    source: attribution.source,
    session_id: getAnalyticsSession().session_id,
  });

  if (captured) {
    markReferralClick(referralKey);
  }

  return captured;
}

export function assignAnalyticsExperiment({
  experimentId,
  variants,
  searchParams = new URLSearchParams(),
  forcedVariant,
}: ExperimentAssignmentInput): string {
  const safeExperimentId = cleanToken(experimentId) || "experiment";
  const safeVariants = normalizeExperimentVariants(variants);
  const forcedSafeVariant = cleanToken(forcedVariant);
  const storageKey = `${EXPERIMENT_ASSIGNMENT_STORAGE_PREFIX}${safeExperimentId}`;
  const storedVariant = readStoredExperimentVariant(storageKey, safeVariants);
  const assignedVariant = forcedSafeVariant && safeVariants.includes(forcedSafeVariant)
    ? forcedSafeVariant
    : storedVariant ?? pickExperimentVariant(safeVariants);
  const isNewAssignment = storedVariant !== assignedVariant;

  if (isNewAssignment) {
    rememberExperimentVariant(storageKey, assignedVariant);
    const attribution = getAttributionProperties(searchParams);

    trackAnalyticsEvent("experiment_assigned", {
      experiment_id: safeExperimentId,
      variant_id: assignedVariant,
      source: attribution.source,
      campaign: attribution.campaign,
      partner_id: attribution.partner_id,
      session_id: getAnalyticsSession().session_id,
    });
  }

  return assignedVariant;
}

export function trackCheckoutStarted({ payment_plan, searchParams, cohort_id }: CheckoutStartedInput): StoredAttribution {
  const attribution = getAttributionProperties(searchParams);
  const session = getAnalyticsSession();
  const plan = CHECKOUT_PLAN_ANALYTICS[payment_plan];

  trackAnalyticsEvent("checkout_started", {
    price_cents: plan.price_cents,
    payment_plan,
    partner_id: attribution.partner_id,
    source: attribution.source,
    campaign: attribution.campaign,
    session_id: session.session_id,
    cohort_id: cleanToken(cohort_id) || DEFAULT_LAUNCH_COHORT_ID,
  });

  return attribution;
}

export function trackPurchaseCompleted({
  payment_plan,
  partner_id,
  checkout_session_id,
  cohort_id,
}: PurchaseCompletedInput): boolean {
  const plan = CHECKOUT_PLAN_ANALYTICS[payment_plan];
  const purchaseKey = cleanToken(checkout_session_id);
  const attribution = readStoredAttribution();

  if (purchaseKey && hasTrackedPurchase(purchaseKey)) {
    return false;
  }

  const captured = trackAnalyticsEvent("purchase_completed", {
    price_cents: plan.price_cents,
    net_collected_cents: plan.net_collected_cents,
    payment_plan,
    partner_id: cleanToken(partner_id) || attribution.partner_id || "none",
    source: attribution.source,
    campaign: attribution.campaign,
    session_id: getAnalyticsSession().session_id,
    cohort_id: cleanToken(cohort_id) || DEFAULT_LAUNCH_COHORT_ID,
  });

  if (purchaseKey) {
    rememberTrackedPurchase(purchaseKey);
  }

  return captured;
}

export function trackDrillStarted({
  drillId,
  source,
  ...context
}: DrillStartedInput): boolean {
  return trackAnalyticsEvent("drill_started", {
    drill_id: cleanToken(drillId),
    source,
    ...buildRepairAnalyticsContext(context),
  });
}

export function trackDrillCompleted({
  drillId,
  completionStatus = "completed",
  durationSeconds,
  questionCount,
  correctCount,
  masteryPassed,
  ...context
}: DrillCompletedInput): boolean {
  return trackAnalyticsEvent("drill_completed", {
    drill_id: cleanToken(drillId),
    completion_status: completionStatus,
    duration_seconds: normalizeNonNegativeInteger(durationSeconds),
    question_count: normalizeNonNegativeInteger(questionCount),
    correct_count: normalizeNonNegativeInteger(correctCount),
    mastery_passed: masteryPassed ?? undefined,
    ...buildRepairAnalyticsContext(context),
  });
}

export function trackBootcampStarted({
  bootcampId,
  source,
  ...context
}: BootcampStartedInput): boolean {
  return trackAnalyticsEvent("bootcamp_started", {
    bootcamp_id: cleanToken(bootcampId),
    source,
    ...buildRepairAnalyticsContext(context),
  });
}

export function trackBootcampCompleted({
  bootcampId,
  completionStatus = "completed",
  durationSeconds,
  drillCount,
  masteryPassed,
  postScore,
  ...context
}: BootcampCompletedInput): boolean {
  return trackAnalyticsEvent("bootcamp_completed", {
    bootcamp_id: cleanToken(bootcampId),
    completion_status: completionStatus,
    duration_seconds: normalizeNonNegativeInteger(durationSeconds),
    drill_count: normalizeNonNegativeInteger(drillCount),
    mastery_passed: masteryPassed ?? undefined,
    post_score: normalizeScore(postScore),
    ...buildRepairAnalyticsContext(context),
  });
}

function buildAnalyticsPayload(entry: AnalyticsCatalogEntry, properties: AnalyticsProperties): AnalyticsPayload {
  const allowedKeys = new Set<string>([
    ...SHARED_KEYS,
    ...entry.required,
    ...(entry.optional ?? []),
    "schema_version",
  ]);
  const payload: AnalyticsPayload = {};

  for (const [key, value] of Object.entries(properties)) {
    if (!allowedKeys.has(key) || value === null || value === undefined) {
      continue;
    }

    if (isAnalyticsValue(value)) {
      payload[key] = value;
    }
  }

  return payload;
}

function buildRepairAnalyticsContext(context: RepairAnalyticsContext): AnalyticsProperties {
  return {
    assignment_id: cleanToken(context.assignmentId) || undefined,
    repair_id: cleanToken(context.repairId) || undefined,
    subject: cleanToken(context.subject) || undefined,
    topic: cleanToken(context.topic) || undefined,
    tension_point_id: cleanToken(context.tensionPointId) || undefined,
    misconception_code: cleanToken(context.misconceptionCode) || undefined,
    session_id: cleanToken(context.sessionId) || getAnalyticsSession().session_id,
    cohort_id: cleanToken(context.cohortId) || undefined,
    student_id: cleanToken(context.studentId) || undefined,
  };
}

function getMissingRequiredProperties(entry: AnalyticsCatalogEntry, payload: AnalyticsPayload): string[] {
  return entry.required.filter((key) => payload[key] === undefined || payload[key] === "");
}

function isAnalyticsValue(value: unknown): value is AnalyticsValue {
  if (["string", "number", "boolean"].includes(typeof value)) {
    return true;
  }

  return Array.isArray(value) && value.every((item) => ["string", "number", "boolean"].includes(typeof item));
}

function captureViaPostHogEndpoint(eventId: AnalyticsEventId, properties: AnalyticsPayload): boolean {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (!apiKey) {
    return false;
  }

  const distinctId = getDistinctId();

  void fetch(`${host.replace(/\/$/, "")}/capture/`, {
    method: "POST",
    mode: "cors",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      event: eventId,
      distinct_id: distinctId,
      properties,
    }),
  }).catch(() => undefined);

  return true;
}

function hasAnalyticsEventDedupeMarker(eventId: AnalyticsEventId, options: TrackAnalyticsOptions): boolean {
  const dedupeKey = buildAnalyticsEventDedupeKey(eventId, options.dedupeKey);

  if (!dedupeKey) {
    return false;
  }

  if (SERVER_EVENT_DEDUPE_KEYS.has(dedupeKey)) {
    return true;
  }

  if (typeof window === "undefined" || options.dedupeScope === "memory") {
    return false;
  }

  return readDedupeStorage(options.dedupeScope).getItem(`${EVENT_DEDUPE_STORAGE_PREFIX}${dedupeKey}`) === "1";
}

function markAnalyticsEventDedupeMarker(eventId: AnalyticsEventId, options: TrackAnalyticsOptions): void {
  const dedupeKey = buildAnalyticsEventDedupeKey(eventId, options.dedupeKey);

  if (!dedupeKey) {
    return;
  }

  SERVER_EVENT_DEDUPE_KEYS.add(dedupeKey);

  if (typeof window === "undefined" || options.dedupeScope === "memory") {
    return;
  }

  readDedupeStorage(options.dedupeScope).setItem(`${EVENT_DEDUPE_STORAGE_PREFIX}${dedupeKey}`, "1");
}

function buildAnalyticsEventDedupeKey(eventId: AnalyticsEventId, key: string | null | undefined): string {
  const cleanKey = cleanToken(key);
  return cleanKey ? `${eventId}:${cleanKey}` : "";
}

function readDedupeStorage(scope: AnalyticsDedupeScope = "session"): Storage {
  return scope === "local" ? window.localStorage : window.sessionStorage;
}

function getDistinctId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(DISTINCT_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const distinctId = createStableId("anon");
  window.localStorage.setItem(DISTINCT_STORAGE_KEY, distinctId);
  return distinctId;
}

function getAnalyticsEnvironment(): "production" | "staging" | "development" | "test" {
  if (process.env.NODE_ENV === "test") {
    return "test";
  }

  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ? "staging" : "production";
  }

  return "development";
}

function readCurrentAttribution(searchParams: URLSearchParams): Partial<StoredAttribution> {
  return {
    source: cleanToken(searchParams.get("utm_source") ?? searchParams.get("source")),
    campaign: cleanToken(searchParams.get("utm_campaign") ?? searchParams.get("campaign")),
    partner_id: cleanToken(searchParams.get("partner_id") ?? searchParams.get("ref")),
  };
}

function readStoredAttribution(): StoredAttribution {
  if (typeof window === "undefined") {
    return {
      source: "direct",
      campaign: "none",
      partner_id: "none",
      referrer: "direct",
    };
  }

  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "{}") as Partial<StoredAttribution>;

    return {
      source: cleanToken(parsed.source) || "direct",
      campaign: cleanToken(parsed.campaign) || "none",
      partner_id: cleanToken(parsed.partner_id) || "none",
      referrer: cleanToken(parsed.referrer) || "direct",
    };
  } catch {
    return {
      source: "direct",
      campaign: "none",
      partner_id: "none",
      referrer: "direct",
    };
  }
}

function normalizeJurisdiction(value: string | null | undefined): string {
  return cleanToken(value) || DEFAULT_DIAGNOSTIC_JURISDICTION;
}

function normalizeTrapTags(values: string[]): string[] {
  const tags = values.map((value) => cleanToken(value)).filter(Boolean).slice(0, 5);
  return tags.length > 0 ? tags : ["none"];
}

function normalizeNonNegativeInteger(value: number | null | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.round(value)) : undefined;
}

function normalizeScore(value: number | null | undefined): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return Math.min(1, Math.max(0, value));
}

function normalizeConfidence(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(value)));
}

function hasDiagnosticCompletedMarker(sessionId: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(`${DIAGNOSTIC_COMPLETED_STORAGE_PREFIX}${sessionId}`) === "1";
}

function markDiagnosticCompleted(sessionId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(`${DIAGNOSTIC_COMPLETED_STORAGE_PREFIX}${sessionId}`, "1");
}

function hasRedZonePreviewMarker(dedupeKey: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(`${RED_ZONE_PREVIEW_STORAGE_PREFIX}${dedupeKey}`) === "1";
}

function markRedZonePreviewViewed(dedupeKey: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(`${RED_ZONE_PREVIEW_STORAGE_PREFIX}${dedupeKey}`, "1");
}

function hasReferralClickMarker(referralKey: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(`${REFERRAL_CLICK_STORAGE_PREFIX}${referralKey}`) === "1";
}

function markReferralClick(referralKey: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(`${REFERRAL_CLICK_STORAGE_PREFIX}${referralKey}`, "1");
}

function normalizeExperimentVariants(variants: readonly string[]): string[] {
  const safeVariants = Array.from(new Set(variants.map((variant) => cleanToken(variant)).filter(Boolean)));
  return safeVariants.length > 0 ? safeVariants : ["control"];
}

function readStoredExperimentVariant(storageKey: string, variants: readonly string[]): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedVariant = cleanToken(window.localStorage.getItem(storageKey));
  return storedVariant && variants.includes(storedVariant) ? storedVariant : null;
}

function rememberExperimentVariant(storageKey: string, variant: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, variant);
}

function pickExperimentVariant(variants: readonly string[]): string {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return variants[values[0] % variants.length];
  }

  return variants[Math.floor(Math.random() * variants.length)];
}

function hasTrackedPurchase(purchaseKey: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return readTrackedPurchases().includes(purchaseKey);
}

function rememberTrackedPurchase(purchaseKey: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const trackedPurchases = readTrackedPurchases();

  if (!trackedPurchases.includes(purchaseKey)) {
    window.localStorage.setItem(
      PURCHASE_STORAGE_KEY,
      JSON.stringify([...trackedPurchases.slice(-24), purchaseKey]),
    );
  }
}

function readTrackedPurchases(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(PURCHASE_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function getReferrerSource(): string {
  if (typeof document === "undefined" || !document.referrer) {
    return "direct";
  }

  try {
    return cleanToken(new URL(document.referrer).hostname) || "direct";
  } catch {
    return "direct";
  }
}

function cleanToken(value: string | null | undefined): string {
  return value?.replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 120) ?? "";
}

function normalizeAnalyticsPath(path: string | null | undefined): string {
  const trimmedPath = path?.trim();
  return trimmedPath ? trimmedPath : "/";
}

function buildPageViewKey(sessionId: string, path: string, searchParams: URLSearchParams): string {
  const search = searchParams.toString();
  return `${sessionId}:${path}${search ? `?${search}` : ""}`;
}

function createStableId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}
