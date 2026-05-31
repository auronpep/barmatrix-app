// Typed client for the barmatrix-api backend.
//
// Single source of truth for the frontend's contract with the API. All fetches
// go through this file so type drift and URL drift get caught at compile time.
//
// API URL resolution order:
//   1. NEXT_PUBLIC_API_URL env var at build time (Vercel injects this)
//   2. Intended Hostinger API domain fallback
//
// Source of truth: BARMATRIX/engineering/API_CONTRACTS.md (SRC-0020).

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.barmatrix.app";

export type CohortPublicStatus =
  | "open"
  | "limited"
  | "almost_full"
  | "last_seats"
  | "waitlist";

export interface CohortStatus {
  cohort_code: string;
  public_status: CohortPublicStatus;
  public_copy: string;
}

export interface DiagnosticStartResponse {
  diagnostic_id: string;
  question_ids: string[];
  total_questions: number;
  expected_total: number;
  bank_loaded: boolean;
  next_question_index: number;
}

export interface DiagnosticStartRequest {
  email?: string;
  jurisdiction?: string;
  partner_id?: string;
}

export type PaymentPlan = "pay_in_full" | "two_pay_500_499";

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface CheckoutSessionRequest {
  product_code?: "barmatrix_flagship_999";
  payment_plan: PaymentPlan;
  partner_id?: string | null;
  referral_click_id?: string | null;
  success_url?: string;
  cancel_url?: string;
}

export interface CustomerPortalSessionRequest {
  checkout_session_id?: string | null;
  return_url: string;
}

export interface CustomerPortalSessionResponse {
  portal_url?: string;
  url?: string;
  session_id?: string;
}

// --- Hearsay seam (Handoff 10) ---

export type Letter = "A" | "B" | "C" | "D";

export interface QuestionChoice {
  choice_id: string;
  letter: Letter;
  choice_text: string;
}

export interface QuestionPayload {
  question_id: string;
  external_id: string | null;
  subject: string;
  topic: string | null;
  subtopic: string | null;
  tension_point: string | null;
  fact_pattern: string;
  question_stem: string;
  call_of_question: string | null;
  choices: QuestionChoice[];
}

export interface AttemptRequest {
  question_id: string;
  selected_letter: Letter;
  confidence: number;
  time_seconds: number;
  platform?: "web" | "ios" | "android";
  set_id?: string;
}

export interface AttemptResponse {
  attempt_id: string;
  correct: boolean;
  correct_answer: Letter | null;
  forensics_url: string;
  red_zone_updates: Array<{ dimension: string; tag: string }>;
}

export interface FocusGroupBlock {
  selected_choice_pct: number;
  sample_size: number;
}

export interface ForensicsResponse {
  correct: boolean;
  // Wrong-variant fields:
  trap_name?: string;
  why_attractive?: string;
  why_wrong?: string;
  future_cue?: string;
  assigned_drill?: { name: string; slug: string } | null;
  // Correct-variant fields:
  why_correct?: string;
  // Shared:
  focus_group: FocusGroupBlock | null;
}

export interface RedZoneEntry {
  tag: string;
  proficiency_score: number;
  attempts: number;
  high_confidence_wrongs: number;
}

export interface RedZonesResponse {
  by_dimension: Record<string, RedZoneEntry[]>;
  message?: string;
}

// --- diagnostic results (computed Red-Zone preview, anonymous-safe) ---
// GET /api/diagnostic/:id/results aggregates one session's attempts (by set_id)
// into a score summary + Red-Zone preview. Computed on the fly; never persisted
// to user_red_zones (that stays the enrollment-gated surface).

export interface DiagnosticSummary {
  correct: number;
  total: number;
  score_pct: number;
  avg_confidence: number;
  avg_time_seconds: number;
  high_confidence_misses: number;
}

export interface DiagnosticRedZoneEntry {
  tag: string;
  proficiency_score: number;
  attempts: number;
  high_confidence_wrongs: number;
  subject?: string;
}

export interface DiagnosticTrapPattern {
  rank: number;
  dimension: string;
  tag: string;
  label: string;
  subject: string | null;
  proficiency_score: number;
  attempts: number;
  high_confidence_wrongs: number;
  severity: "high" | "medium";
}

export interface DiagnosticResultsResponse {
  diagnostic_id: string;
  answered: number;
  summary: DiagnosticSummary;
  red_zones: { by_dimension: Record<string, DiagnosticRedZoneEntry[]> };
  top_trap_patterns: DiagnosticTrapPattern[];
}

export type KnowledgeComponent =
  | "01-tension-map"
  | "02-trap-taxonomy"
  | "03-question-bank"
  | "04-drill-library"
  | "05-boot-camp";

export interface KnowledgeSearchParams {
  q?: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
  component?: KnowledgeComponent | string;
  channel?: "channel1" | "channel2" | "bridge" | "product_surface" | string;
  object_type?: string;
  canonicality?: "canonical" | "candidate" | "rejected" | "reference_only" | string;
  review_status?:
    | "needs_review"
    | "content_review"
    | "content_approved"
    | "attorney_review"
    | "attorney_approved"
    | "rejected"
    | string;
  promotion_status?: "hold" | "queued" | "promoted" | "rejected" | "archived" | string;
  source_id?: string;
  include_rejected?: boolean;
  limit?: number;
}

export interface KnowledgeSearchFilters {
  q?: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
  component?: KnowledgeComponent;
  channel?: string;
  objectType?: string;
  canonicality?: string;
  reviewStatus?: string;
  promotionStatus?: string;
  sourceId?: string;
  includeRejected: boolean;
  limit: number;
}

export interface KnowledgeSearchResult {
  object_id: string;
  object_type: string;
  summary: string | null;
  body_preview: string;
  subject: string | null;
  topic: string | null;
  subtopic: string | null;
  taxonomy_version: string | null;
  taxonomy_ids: Record<string, unknown>;
  channel: string;
  component_targets: KnowledgeComponent[];
  wrong_answer_tags: string[];
  channel2_architecture: string | null;
  surface_pattern: string | null;
  decoder_move: string | null;
  metadata: Record<string, unknown>;
  text_score: number;
  source: {
    source_id: string;
    source_role: string;
    source_path: string | null;
    source_span_start: number | null;
    source_span_end: number | null;
  };
  review: {
    canonicality: string;
    review_status: string;
    promotion_status: string;
  };
}

export interface KnowledgeSearchResponse {
  filters: KnowledgeSearchFilters;
  results: KnowledgeSearchResult[];
  by_component: Record<string, string[]>;
  review_summary: Record<string, number>;
}

// --- Trap Taxonomy (Web Component 02) ---

export type TrapKind = "forensic" | "misconception";

export interface TrapEntry {
  slug: string;
  name: string;
  official: boolean;
  question_count: number;
  choice_count: number;
}

export interface TrapListResponse {
  architecture: TrapEntry[];
  misconception: TrapEntry[];
  totals: {
    architecture_count: number;
    misconception_count: number;
    official_count: number;
  };
}

export interface TrapExample {
  question_id: string;
  external_id: string | null;
  subject: string;
  topic: string | null;
  subtopic: string | null;
  letter: string;
  choice_text: string;
  why_attractive: string | null;
  why_wrong: string | null;
  future_cue: string | null;
  kinds: TrapKind[];
}

export interface TrapSubjectCount {
  subject: string;
  question_count: number;
}

export interface TrapDetailResponse {
  slug: string;
  name: string;
  official: boolean;
  kinds: TrapKind[];
  question_count: number;
  subject_distribution: TrapSubjectCount[];
  examples: TrapExample[];
  examples_truncated: boolean;
}

export interface TrapQuestionSummary {
  question_id: string;
  external_id: string | null;
  subject: string;
  topic: string | null;
  subtopic: string | null;
  tension_point: string | null;
}

export interface TrapQuestionsResponse {
  slug: string;
  page: number;
  limit: number;
  total: number;
  questions: TrapQuestionSummary[];
}

// --- Tension Map (Web Component 01) — anonymous, read-only ---

export interface TensionEntry {
  slug: string;
  name: string;
  subject: string;
  domain: string | null;
  official: boolean;
  question_count: number;
  tension_point_id: string | null;
}

export interface TensionListResponse {
  tensions: TensionEntry[];
  subjects: string[];
  totals: {
    tension_count: number;
    official_count: number;
    observed_count: number;
  };
  // false when the curated tension_points catalog migration isn't applied yet;
  // the surface still lists tensions observed in the bank.
  catalog_ready: boolean;
}

export interface TensionExample {
  question_id: string;
  external_id: string | null;
  subject: string;
  topic: string | null;
  subtopic: string | null;
  stem_preview: string | null;
}

export interface TensionSubjectCount {
  subject: string;
  question_count: number;
}

export interface TensionDetailResponse {
  slug: string;
  name: string;
  official: boolean;
  tension_point_id: string | null;
  subject: string | null;
  domain: string | null;
  legal_collision: string | null;
  decision_axis: string | null;
  common_misconceptions: string | null;
  question_count: number;
  subject_distribution: TensionSubjectCount[];
  examples: TensionExample[];
  examples_truncated: boolean;
  catalog_ready: boolean;
}

export interface TensionQuestionSummary {
  question_id: string;
  external_id: string | null;
  subject: string;
  topic: string | null;
  subtopic: string | null;
  tension_point: string | null;
}

export interface TensionQuestionsResponse {
  slug: string;
  page: number;
  limit: number;
  total: number;
  questions: TensionQuestionSummary[];
}

export interface ApiError {
  error: string | Record<string, unknown>;
}

class ApiClientError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(
      typeof body === "object" && body !== null && "error" in body
        ? JSON.stringify((body as ApiError).error)
        : `API ${status}`,
    );
    this.status = status;
    this.body = body;
    this.name = "ApiClientError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    throw new ApiClientError(res.status, body);
  }
  return body as T;
}

function queryString(params: KnowledgeSearchParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

// --- Authenticated "my data" (Clerk-gated dashboard) ---

export interface DashboardRedZoneEntry {
  tag: string;
  proficiency_score: number;
  attempts: number;
  high_confidence_wrongs: number;
}

export interface DashboardRecentAttempt {
  attempt_id: string;
  question_id: string;
  subject: string;
  subtopic: string | null;
  selected_letter: Letter | null;
  correct: boolean;
  trap_name: string | null;
  attempted_at: string;
}

export interface DashboardAssignedDrill {
  assignment_id: string;
  drill_slug: string | null;
  drill_name: string;
  reason: string;
  red_zone_dimension: string | null;
  red_zone_tag: string | null;
  status: string;
  prescribed_at: string;
}

export interface DashboardData {
  enrolled: boolean;
  status: string | null;
  refunded: boolean;
  student_id: string | null;
  metrics: {
    repair_progress_pct: number;
    active_red_zones: number;
    high_confidence_wrongs: number;
  };
  red_zones: { by_dimension: Record<string, DashboardRedZoneEntry[]> };
  recent_attempts: DashboardRecentAttempt[];
  assigned_drills: DashboardAssignedDrill[];
}

// --- Red Zone Library (Clerk-gated, server-derives the student) ---

export interface RedZoneLibraryZone {
  tag: string;
  proficiency_score: number;
  attempts: number;
  high_confidence_wrongs: number;
  question_count: number;
  has_drill: boolean;
}

export interface RedZoneLibraryDimension {
  dimension: string;
  zones: RedZoneLibraryZone[];
}

export interface RedZoneLibrary {
  enrolled: boolean;
  status: string | null;
  refunded: boolean;
  student_id: string | null;
  metrics: {
    repair_progress_pct: number;
    active_red_zones: number;
    high_confidence_wrongs: number;
    total_zones: number;
  };
  dimensions: RedZoneLibraryDimension[];
}

export interface RedZoneDetailQuestion {
  question_id: string;
  external_id: string | null;
  subject: string | null;
  subtopic: string | null;
  tension_point: string | null;
}

export interface RedZoneDetailWrong {
  attempt_id: string;
  question_id: string;
  subject: string | null;
  subtopic: string | null;
  selected_letter: Letter | null;
  trap_name: string;
  attempted_at: string;
}

export interface RedZoneDetailDrill {
  drill_slug: string | null;
  drill_name: string;
  reason: string;
  status: string;
}

export interface RedZoneDetail {
  enrolled: boolean;
  dimension: string;
  tag: string;
  repair_subject: string | null;
  repair_slug: string | null;
  zone: {
    proficiency_score: number;
    attempts: number;
    high_confidence_wrongs: number;
    question_count: number;
  } | null;
  questions: RedZoneDetailQuestion[];
  recent_wrongs: RedZoneDetailWrong[];
  drill: RedZoneDetailDrill | null;
}

// Like request(), but attaches the caller's Clerk session token as a Bearer
// header. Kept separate so unauthenticated callers never need to pass a token.
async function authedRequest<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  return request<T>(path, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
}

function trapQuery(params: {
  include_hidden?: boolean;
  page?: number;
  limit?: number;
}): string {
  const search = new URLSearchParams();
  if (params.include_hidden) search.set("include_hidden", "true");
  if (typeof params.page === "number") search.set("page", String(params.page));
  if (typeof params.limit === "number") search.set("limit", String(params.limit));
  const text = search.toString();
  return text ? `?${text}` : "";
}

// --- Boot Camp (Web Component 05) ---

export type BootCampDayStatus = "complete" | "current" | "locked";

export interface BootCampSummary {
  slug: string;
  display_name: string;
  subject: string;
  description: string | null;
  day_count: number;
  questions_per_day: number;
  mastery_question_count: number;
  mastery_threshold: number;
  target_tensions: string[];
  target_traps: string[];
  status: string;
}

export interface BootCampListResponse {
  boot_camps: BootCampSummary[];
}

export interface BootCampDetail extends BootCampSummary {
  day_plan: Array<{ day: number; questions_per_day: number }>;
}

export interface BootCampStartRequest {
  student_id?: string;
  include_hidden?: boolean;
}

export interface BootCampStartResponse {
  session_id: string;
  slug: string;
  current_day: number;
  status: string;
  resumed: boolean;
  partial: boolean;
  pinned_total?: number;
  used_fallback?: boolean;
}

export interface BootCampDayProgress {
  day: number;
  status: BootCampDayStatus;
  total: number;
  answered: number;
  correct: number;
}

export interface BootCampMasteryProgress {
  unlocked: boolean;
  total: number;
  answered: number;
  correct: number;
  score: number | null;
  passed: boolean;
}

export interface BootCampSession {
  session_id: string;
  slug: string;
  display_name: string;
  subject: string;
  status: string;
  current_day: number;
  day_count: number;
  mastery_threshold: number;
  days: BootCampDayProgress[];
  mastery: BootCampMasteryProgress;
}

export interface BootCampDayStartResponse {
  session_id: string;
  day: number;
  set_id: string;
  question_ids: string[];
  answered_question_ids: string[];
  correct_count: number;
}

export interface BootCampDayCompleteResponse {
  session_id: string;
  day: number;
  answered: number;
  correct: number;
  day_question_count: number;
  passed: boolean;
  score: number;
  advanced: boolean;
  skipped: boolean;
  current_day: number;
  mastery_unlocked: boolean;
}

export interface BootCampMasteryStartResponse {
  session_id: string;
  set_id: string;
  question_ids: string[];
}

export interface BootCampRedZoneDelta {
  dimension: string;
  tag: string;
  proficiency_score: number;
}

export interface BootCampMasteryCompleteResponse {
  session_id: string;
  mastery_score: number;
  mastered: boolean;
  threshold: number;
  correct?: number;
  total?: number;
  already_completed?: boolean;
  red_zone_deltas: BootCampRedZoneDelta[];
}

// --- Drill Library (Web Component 04) — anonymous-first prescriptive drills ---

export interface DrillCatalogEntry {
  slug: string;
  label: string;
  question_count: number;
}

export interface DrillCatalogResponse {
  tensions: DrillCatalogEntry[];
  traps: DrillCatalogEntry[];
}

export interface PrescribedDrillSuggestion {
  kind: "prescribed_red_zone";
  red_zone_dimension: string;
  red_zone_tag: string;
  label: string;
  proficiency_score: number;
  candidate_question_count: number;
  suggested_size: number;
}

export interface InProgressDrill {
  drill_id: string;
  drill_name: string;
  red_zone_dimension: string | null;
  red_zone_tag: string | null;
  status: string;
  question_count: number;
  prescribed_at: string;
}

export interface PrescribedReview {
  available_count: number;
  suggested_size: number;
}

export interface PrescribedDrillsResponse {
  suggested: PrescribedDrillSuggestion[];
  in_progress: InProgressDrill[];
  review?: PrescribedReview;
  message?: string;
}

export type DrillStartKind =
  | "tension"
  | "trap"
  | "prescribed_red_zone"
  | "review"
  | "retry";

export interface DrillStartRequest {
  kind: DrillStartKind;
  slug?: string;
  red_zone_dimension?: string;
  red_zone_tag?: string;
  size?: number;
  student_id?: string;
  source_drill_id?: string;
  exclude_mastered?: boolean;
}

export interface DrillStartResponse {
  drill_id: string | null;
  student_id: string;
  question_ids: string[];
  size: number;
  requested: number;
  matched: number;
  partial: boolean;
  red_zone_dimension: string | null;
  red_zone_tag: string | null;
  drill_name: string;
}

export interface DrillProgress {
  answered: number;
  correct: number;
  total: number;
}

export interface DrillDetail {
  drill_id: string;
  student_id: string;
  status: string;
  drill_name: string;
  red_zone_dimension: string | null;
  red_zone_tag: string | null;
  question_ids: string[];
  size: number;
  progress: DrillProgress;
}

export interface DrillRedZoneSnapshot {
  dimension: string;
  tag: string;
  proficiency_score: number;
  attempts: number;
  high_confidence_wrongs: number;
}

export interface DrillCompleteResponse {
  drill_id: string;
  correct: number;
  total: number;
  answered: number;
  mastered: boolean;
  status: string;
  red_zone: DrillRedZoneSnapshot | null;
}

export const api = {
  cohortStatus: () => request<CohortStatus>("/api/cohort/status"),

  startDiagnostic: (payload: DiagnosticStartRequest = {}) =>
    request<DiagnosticStartResponse>("/api/diagnostic/start", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createCheckoutSession: (payload: CheckoutSessionRequest) =>
    request<CheckoutSessionResponse>("/api/checkout/create-session", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createCustomerPortalSession: (payload: CustomerPortalSessionRequest) =>
    request<CustomerPortalSessionResponse>("/api/billing/create-portal-session", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
    }),

  health: () =>
    request<{ ok: boolean; db: string }>("/health"),

  // Hearsay seam endpoints — Handoff 10
  getQuestion: (id: string) =>
    request<QuestionPayload>(`/api/questions/${encodeURIComponent(id)}`),

  // token (Clerk session) is optional: when present the API attributes the
  // attempt to the signed-in student so red-zones + drills update; otherwise it
  // records anonymously. Surfaces submit via lib/use-attempts.ts.
  submitAttempt: (payload: AttemptRequest, token?: string | null) =>
    token
      ? authedRequest<AttemptResponse>("/api/attempts", token, {
          method: "POST",
          body: JSON.stringify(payload),
        })
      : request<AttemptResponse>("/api/attempts", {
          method: "POST",
          body: JSON.stringify(payload),
        }),

  getForensics: (attemptId: string) =>
    request<ForensicsResponse>(
      `/api/attempts/${encodeURIComponent(attemptId)}/forensics`,
    ),

  getRedZones: (studentId?: string) =>
    request<RedZonesResponse>(
      `/api/red-zones${studentId ? `?student_id=${encodeURIComponent(studentId)}` : ""}`,
    ),

  // Computed Red-Zone preview for one diagnostic session — anonymous-safe.
  getDiagnosticResults: (diagnosticId: string) =>
    request<DiagnosticResultsResponse>(
      `/api/diagnostic/${encodeURIComponent(diagnosticId)}/results`,
    ),

  searchKnowledge: (params: KnowledgeSearchParams = {}) =>
    request<KnowledgeSearchResponse>(
      `/api/knowledge/search${queryString(params)}`,
    ),

  getMyDashboard: (token: string) =>
    authedRequest<DashboardData>("/api/me/dashboard", token),

  getMyRedZones: (token: string) =>
    authedRequest<RedZoneLibrary>("/api/me/red-zones", token),

  getMyRedZoneDetail: (
    token: string,
    dimension: string,
    tag: string,
    includeHidden = false,
  ) =>
    authedRequest<RedZoneDetail>(
      `/api/me/red-zones/zone?dimension=${encodeURIComponent(
        dimension,
      )}&tag=${encodeURIComponent(tag)}${
        includeHidden ? "&include_hidden=true" : ""
      }`,
      token,
    ),

  // --- Trap Taxonomy (Web Component 02) — anonymous, read-only ---
  listTraps: (
    params: { include_hidden?: boolean } = {},
    init?: RequestInit,
  ) => request<TrapListResponse>(`/api/traps${trapQuery(params)}`, init),

  getTrap: (
    slug: string,
    params: { include_hidden?: boolean } = {},
    init?: RequestInit,
  ) =>
    request<TrapDetailResponse>(
      `/api/traps/${encodeURIComponent(slug)}${trapQuery(params)}`,
      init,
    ),

  getTrapQuestions: (
    slug: string,
    params: { include_hidden?: boolean; page?: number; limit?: number } = {},
    init?: RequestInit,
  ) =>
    request<TrapQuestionsResponse>(
      `/api/traps/${encodeURIComponent(slug)}/questions${trapQuery(params)}`,
      init,
    ),

  // --- Tension Map (Web Component 01) — anonymous, read-only ---
  listTensions: (
    params: { include_hidden?: boolean } = {},
    init?: RequestInit,
  ) => request<TensionListResponse>(`/api/tensions${trapQuery(params)}`, init),

  getTension: (
    slug: string,
    params: { include_hidden?: boolean } = {},
    init?: RequestInit,
  ) =>
    request<TensionDetailResponse>(
      `/api/tensions/${encodeURIComponent(slug)}${trapQuery(params)}`,
      init,
    ),

  getTensionQuestions: (
    slug: string,
    params: { include_hidden?: boolean; page?: number; limit?: number } = {},
    init?: RequestInit,
  ) =>
    request<TensionQuestionsResponse>(
      `/api/tensions/${encodeURIComponent(slug)}/questions${trapQuery(params)}`,
      init,
    ),

  // --- Boot Camp (Web Component 05) — anonymous-first repair sequences ---
  listBootCamps: (init?: RequestInit) =>
    request<BootCampListResponse>("/api/boot-camps", init),

  getBootCamp: (slug: string, init?: RequestInit) =>
    request<BootCampDetail>(`/api/boot-camps/${encodeURIComponent(slug)}`, init),

  startBootCamp: (slug: string, payload: BootCampStartRequest = {}) =>
    request<BootCampStartResponse>(
      `/api/boot-camps/${encodeURIComponent(slug)}/start`,
      { method: "POST", body: JSON.stringify(payload) },
    ),

  getBootCampSession: (sessionId: string, init?: RequestInit) =>
    request<BootCampSession>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}`,
      init,
    ),

  startBootCampDay: (sessionId: string, day: number) =>
    request<BootCampDayStartResponse>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}/days/${day}/start`,
      { method: "POST", body: JSON.stringify({}) },
    ),

  completeBootCampDay: (
    sessionId: string,
    day: number,
    payload: { skip?: boolean } = {},
  ) =>
    request<BootCampDayCompleteResponse>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}/days/${day}/complete`,
      { method: "POST", body: JSON.stringify(payload) },
    ),

  startBootCampMastery: (sessionId: string) =>
    request<BootCampMasteryStartResponse>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}/mastery/start`,
      { method: "POST", body: JSON.stringify({}) },
    ),

  completeBootCampMastery: (sessionId: string) =>
    request<BootCampMasteryCompleteResponse>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}/mastery/complete`,
      { method: "POST", body: JSON.stringify({}) },
    ),

  // --- Drill Library (Web Component 04) — anonymous-first ---
  getDrillCatalog: (init?: RequestInit) =>
    request<DrillCatalogResponse>("/api/drills/catalog", init),

  getPrescribedDrills: (studentId: string, init?: RequestInit) =>
    request<PrescribedDrillsResponse>(
      `/api/drills/prescribed?student_id=${encodeURIComponent(studentId)}`,
      init,
    ),

  startDrill: (payload: DrillStartRequest) =>
    request<DrillStartResponse>("/api/drills/start", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getDrill: (drillId: string, init?: RequestInit) =>
    request<DrillDetail>(`/api/drills/${encodeURIComponent(drillId)}`, init),

  completeDrill: (drillId: string) =>
    request<DrillCompleteResponse>(
      `/api/drills/${encodeURIComponent(drillId)}/complete`,
      { method: "POST", body: JSON.stringify({}) },
    ),
};

export { ApiClientError, API_URL };
