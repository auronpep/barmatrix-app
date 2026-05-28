const ANALYTICS_SCHEMA_VERSION = "2026-05-28";
const SESSION_STORAGE_KEY = "barmatrix_analytics_session_id";
const DISTINCT_STORAGE_KEY = "barmatrix_analytics_distinct_id";
const ATTRIBUTION_STORAGE_KEY = "barmatrix_analytics_attribution";

type AnalyticsPrimitive = string | number | boolean;
type AnalyticsValue = AnalyticsPrimitive | AnalyticsPrimitive[];
type AnalyticsPayload = Record<string, AnalyticsValue>;

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

type StoredAttribution = {
  source: string;
  campaign: string;
  partner_id: string;
  referrer: string;
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
    optional: ["session_id", "cohort_id"],
  },
  diagnostic_completed: {
    area: "diagnostic",
    required: ["top_trap_tags", "score_band"],
    optional: ["session_id", "cohort_id"],
  },
  red_zone_preview_viewed: {
    area: "diagnostic",
    required: ["trap_tags"],
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
    optional: ["session_id", "cohort_id"],
  },
  purchase_completed: {
    area: "revenue",
    required: ["price_cents", "net_collected_cents", "partner_id"],
    optional: ["session_id", "cohort_id", "seat_id"],
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
  partner_purchase_completed: {
    area: "partner",
    required: ["partner_id", "purchase_id"],
    optional: ["session_id", "cohort_id"],
  },
} as const satisfies Record<string, AnalyticsCatalogEntry>;

export type AnalyticsEventId = keyof typeof ANALYTICS_EVENT_CATALOG;
export type AnalyticsProperties = Partial<Record<AnalyticsPropertyKey, AnalyticsValue | null | undefined>>;

type AnalyticsPropertyKey =
  | SharedPropertyKey
  | (typeof ANALYTICS_EVENT_CATALOG)[AnalyticsEventId]["required"][number]
  | NonNullable<(typeof ANALYTICS_EVENT_CATALOG)[AnalyticsEventId]["optional"]>[number]
  | "schema_version";

type SharedPropertyKey =
  | "cohort_id"
  | "seat_id"
  | "session_id"
  | "student_id"
  | "platform"
  | "environment";

const SHARED_KEYS = new Set<SharedPropertyKey>([
  "cohort_id",
  "seat_id",
  "session_id",
  "student_id",
  "platform",
  "environment",
]);

export function trackAnalyticsEvent(eventId: AnalyticsEventId, properties: AnalyticsProperties): boolean {
  const entry = ANALYTICS_EVENT_CATALOG[eventId];
  const safePayload = buildAnalyticsPayload(entry, properties);

  if (!hasRequiredProperties(entry, safePayload)) {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }

  const payload = {
    schema_version: ANALYTICS_SCHEMA_VERSION,
    environment: getAnalyticsEnvironment(),
    platform: "web",
    ...safePayload,
  } satisfies AnalyticsPayload;

  if (window.posthog?.capture) {
    window.posthog.capture(eventId, payload);
    return true;
  }

  return captureViaPostHogEndpoint(eventId, payload);
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

function hasRequiredProperties(entry: AnalyticsCatalogEntry, payload: AnalyticsPayload): boolean {
  return entry.required.every((key) => payload[key] !== undefined && payload[key] !== "");
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
