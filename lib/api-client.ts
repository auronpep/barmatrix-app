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
  diagnostic_id?: string | null;
  success_url?: string;
  cancel_url?: string;
}

export interface CheckoutStatusResponse {
  fulfilled: boolean;
  purchaseId?: string;
  status?: string;
}

export interface CheckoutRecoveryResponse {
  status: string;
  purchaseId?: string;
  studentId?: string;
  seatNumber?: number;
  message?: string;
}

export interface WebinarLeadRequest {
  email: string;
  full_name?: string | null;
  role?: string | null;
  jurisdiction?: string | null;
  exam_window?: string | null;
  context?: string | null;
  source_page?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  partner_id?: string | null;
  referral_click_id?: string | null;
  website?: string | null;
}

export interface WebinarLeadResponse {
  ok: true;
  lead_id: string | null;
  status: "created" | "updated" | "ignored";
  message: string;
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

export interface DiagnosticRecommendationNextStep {
  label?: string;
  href?: string;
  slug?: string;
}

export interface DiagnosticRecommendation {
  level?: number | string;
  placement_level?: number | string;
  label?: string;
  level_label?: string;
  placement_label?: string;
  description?: string;
  level_description?: string;
  placement_description?: string;
  entry_route?: string[];
  next_step?: DiagnosticRecommendationNextStep;
}

// One reusable rule the diagnostic taker now owns — surfaced from the anchor
// card seeded on each answered question (questions.metadata.anchor_card). The
// "you learned this" win moment. Theming lives only in example names, never the rule.
export interface AnchorCard {
  id: string;
  title: string | null;
  rule: string;
  prompt: string | null;
  source_tag: string;
  subject: string;
}

export interface DiagnosticResultsResponse {
  diagnostic_id: string;
  answered: number;
  summary: DiagnosticSummary;
  red_zones: { by_dimension: Record<string, DiagnosticRedZoneEntry[]> };
  top_trap_patterns: DiagnosticTrapPattern[];
  anchors?: AnchorCard[];
  recommendation?: DiagnosticRecommendation;
  level?: number | string;
  placement_level?: number | string;
  placement_label?: string;
  placement_description?: string;
  entry_route?: string[];
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

// --- Personal Trap Profile (Web Component 02 personalization) ---

export interface MyTrapEntry {
  slug: string;
  name: string;
  kind: TrapKind;
  official: boolean;
  fell_count: number;
  confident_fell_count: number;
  last_fell_at: string | null;
}

export interface MyTrapProfile {
  enrolled: boolean;
  student_id: string | null;
  metrics: {
    distinct_traps: number;
    total_falls: number;
    total_confident_falls: number;
    top_trap_slug: string | null;
  };
  traps: MyTrapEntry[];
}

export interface MyTrapOccurrence {
  attempt_id: string;
  question_id: string;
  external_id: string | null;
  subject: string;
  subtopic: string | null;
  selected_letter: string;
  confidence: number | null;
  attempted_at: string;
  why_attractive: string | null;
  why_wrong: string | null;
  future_cue: string | null;
}

export interface MyTrapHistory {
  enrolled: boolean;
  slug: string;
  name: string;
  official: boolean;
  fell_count: number;
  confident_fell_count: number;
  first_fell_at: string | null;
  last_fell_at: string | null;
  recent: MyTrapOccurrence[];
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
  billing_portal: {
    portal_available: boolean;
    unavailable_reason:
      | "not_enrolled"
      | "manual_or_complimentary"
      | "stripe_customer_missing"
      | null;
  };
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
  gamification: BootCampGamificationGrant | null;
}

export interface BootCampMasteryStartResponse {
  session_id: string;
  set_id: string;
  question_ids: string[];
  answered_question_ids: string[];
  correct_count: number;
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
  gamification: BootCampGamificationGrant | null;
}

export interface BootCampGamificationGrant {
  xp_earned: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  badges_unlocked: string[];
}

export interface MyGamificationBadge {
  slug: string;
  label: string;
  description: string;
  emoji: string;
  earned_at: string;
}

export interface MyGamification {
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  badges: MyGamificationBadge[];
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
  subject?: string;
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

// --- Foundations ("The Method" / C3) — the gated core starter course ---
// Content reads are anonymous + DB-free (authored, shipped in the API). Progress
// is Clerk-gated and server-attributed. See routes/foundations.ts.

export type FoundationsLessonStatus = "not_started" | "in_progress" | "completed";

export interface FoundationsPart {
  roman: string;
  title: string;
  lesson_numbers: number[];
}

export interface FoundationsLessonOutline {
  slug: string;
  number: number;
  part: string;
  part_title: string;
  title: string;
  objective: string;
  est_minutes: number;
  drill_count: number;
  drill_item_count: number;
  status: FoundationsLessonStatus;
  drills_completed: number;
}

export interface FoundationsProgressSummary {
  lessons_completed: number;
  lesson_count: number;
  percent: number;
  complete: boolean;
  next_slug: string | null;
}

export interface FoundationsOutline {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  version: string;
  lesson_count: number;
  drill_item_count: number;
  est_total_minutes: number;
  parts: FoundationsPart[];
  lessons: FoundationsLessonOutline[];
  progress: FoundationsProgressSummary;
}

// C3 interactive reflex-trainer types. The server grades; it strips every
// answer-bearing field from items before sending, so the page source cannot leak
// the key. Mirrors barmatrix-api/src/lib/c3-drill.ts (public shapes only).
export type C3Status =
  | "TRUE"
  | "NOT_TRUE"
  | "TRUE_BUT_NOT_RESPONSIVE"
  | "SURVIVES";

export type C3TaskType =
  | "TRUTH_CHECK"
  | "FILTER_BREAK"
  | "SURVIVOR_PICK"
  | "TRUE_VS_TRUE"
  | "MIXED_CLASSIFICATION"
  | "CALL_CHECK"
  | "CHOICE_CLASSIFICATION"
  | "LABEL_SELECT"
  // Mirror of api src/lib/c3-drill.ts — keep in sync. COUNT_SELECT (Drill 2.2,
  // survivor count) and SEQUENCE_SELECT (Drill 14.1, next workflow move) are
  // single-choice picks from a fixed option set; both grade on correct_choice_id.
  | "COUNT_SELECT"
  | "SEQUENCE_SELECT"
  // MULTI_SELECT (Drills 2.5/13.5/14.5): the full-workflow drills. The item carries
  // parts[] — several finite sub-answers (answer/phase/band/mechanism), each graded
  // independently. Keep in sync with api src/lib/c3-drill.ts.
  | "MULTI_SELECT";

export type C3Skill = "EAR" | "ISSUE_SENSE" | "CUT" | "CLASH" | "CALL";
export type C3MissedFilter = "NOT_TRUE" | "NOT_RESPONSIVE" | "SURVIVES";

export interface C3Choice {
  id: string;
  text: string;
}

/** One MULTI_SELECT sub-question as shipped to the browser (answer key stripped). */
export interface C3DrillPartPublic {
  id: string;
  prompt: string;
  choices: C3Choice[];
}

export interface C3DrillItemPublic {
  id: string;
  drill_id: string;
  sequence: number;
  task_type: C3TaskType;
  stem?: string;
  prompt: string;
  choice_text?: string;
  choices?: C3Choice[];
  /** MULTI_SELECT only: the per-item sub-questions to render as choice groups. */
  parts?: C3DrillPartPublic[];
  skill: C3Skill;
  legal_review_status: "pending" | "approved" | "needs_revision";
  source_status: "authored" | "legacy_candidate" | "licensed" | "unknown";
  enabled: boolean;
}

export interface C3StudentResponse {
  selected_status?: C3Status;
  selected_choice_id?: string;
  selected_choice_statuses?: Record<string, C3Status>;
  /** MULTI_SELECT only: part_id -> chosen choice id. */
  selected_parts?: Record<string, string>;
}

/** Per-part outcome for a MULTI_SELECT item (independent scoring + feedback). */
export interface C3PartResult {
  part_id: string;
  correct: boolean;
  correct_choice_id: string;
}

export interface C3Explanation {
  verdict: string;
  why: string;
  trap?: string;
  say_the_break: string;
}

export interface C3GradeResult {
  correct: boolean;
  correct_status?: C3Status;
  correct_choice_id?: string;
  choice_statuses?: Record<string, C3Status>;
  missed_filter: C3MissedFilter | null;
  missed_skill: C3Skill | null;
  explanation: C3Explanation;
  /** MULTI_SELECT only: independent per-part correctness for student feedback. */
  part_results?: C3PartResult[];
}

export interface FoundationsDrill {
  id: string;
  title: string;
  instructions_md: string;
  items: string[];
  item_count: number;
  key_md: string;
  // Present only when the drill runs in interactive mode (items parsed + legal
  // gate passed). When absent, the drill renders in the reveal-key form.
  task_type?: C3TaskType;
  graded_items?: C3DrillItemPublic[];
}

export interface FoundationsLesson {
  slug: string;
  number: number;
  part: string;
  part_title: string;
  title: string;
  objective: string;
  est_minutes: number;
  body_md: string;
  drills: FoundationsDrill[];
  how_to_use_md: string;
  drill_item_count: number;
}

export interface FoundationsLessonProgress {
  status: FoundationsLessonStatus;
  drills_completed: string[];
  completed_at: string | null;
}

export interface FoundationsLessonResponse {
  course_slug: string;
  course_title: string;
  lesson: FoundationsLesson;
  prev_slug: string | null;
  next_slug: string | null;
  progress: FoundationsLessonProgress;
}

export interface FoundationsMarkRequest {
  status?: FoundationsLessonStatus;
  completed?: boolean;
  drills_completed?: string[];
}

export interface FoundationsMarkResponse {
  persisted: boolean;
  reason?: string;
  lesson_slug: string;
  status: FoundationsLessonStatus;
  drills_completed: string[];
  progress?: FoundationsProgressSummary;
}

export interface FoundationsAttemptRequest extends C3StudentResponse {
  drill_id: string;
  item_id: string;
  attempt_number?: number;
  time_ms?: number;
  confidence?: number;
  reflection_text?: string;
}

export interface FoundationsAttemptResponse {
  graded: C3GradeResult;
  persisted: boolean;
  attempt_id: string | null;
}

// --- C3 Placement Diagnostic (curated 18-question session) ---
// POST /api/diagnostic/session/start → session_id + question_count
// GET  /api/diagnostic/questions      → ordered list of 18 questions (no answer keys)
// POST /api/diagnostic/session/:id/attempt → per-question score + feedback
// GET  /api/diagnostic/session/:id/results → placement level + breakdown

export interface PlacementSessionStartResponse {
  session_id: string;
  question_count: number;
  question_ids: string[];
  questions: PlacementQuestion[];
  placement_model: string;
}

export interface PlacementQuestion {
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

export interface PlacementQuestionsResponse {
  questions: PlacementQuestion[];
  question_count: number;
}

export type C3Mechanism =
  | "CUT_MISSTATE"
  | "CUT_WRONG_Q"
  | "CLASH"
  | "CALL"
  | "ANCHOR"
  | "FORK";

export interface PlacementAttemptRequest {
  question_id: string;
  selected_letter: Letter;
  confidence: number;
  time_seconds: number;
  mechanism: C3Mechanism;
}

export interface PlacementAttemptResponse {
  is_correct: boolean;
  correct_letter: Letter;
  correct_text: string;
  why_wrong_or_correct: string;
  remediation_id: string | null;
  legal_score: number;
  mechanism_score: number;
  calibration_score: number;
  session_score_so_far: number;
  attempts_so_far: number;
}

export interface PlacementSubjectAccuracy {
  subject: string;
  correct: number;
  total: number;
}

export interface PlacementRemediationTarget {
  subject: string;
  label: string;
}

export interface PlacementResults {
  placement_level: number;
  placement_label: string;
  placement_description: string;
  entry_route: string[];
  subject_accuracy: PlacementSubjectAccuracy[];
  top_remediation_targets: PlacementRemediationTarget[];
  total_score: number;
  legal_score: number;
  mechanism_score: number;
  calibration_score: number;
  attempts_so_far: number;
}

// GET /api/me/c3/next — C3 Coach adaptive item. Mirrors buildCoachPayload in
// barmatrix-api/src/routes/c3-coach.ts.
export interface CoachChoice { choice_id: string; letter: string; choice_text: string; }
export interface CoachQuestion {
  question_id: string; external_id: string | null; subject: string;
  topic: string | null; subtopic: string | null; tension_point: string | null;
  fact_pattern: string; question_stem: string; call_of_question: string | null;
  choices: CoachChoice[];
}
export interface CoachingMeta {
  target_mold: string; name: string; family: string;
  deficit_pct: number; exposures: number; measured: boolean;
}
export interface CoachRemediation { lesson_slug: string | null; deck_ref: string | null; }
export type CoachNext =
  | { available: false; reason: string }
  | {
      available: true;
      coverage: { total_attempts: number; measured_attempts: number; pct: number };
      question: CoachQuestion;
      coaching: CoachingMeta;
      remediation: CoachRemediation;
      cohort_signal: null;
    };

// --- C3 Mastery (flagship measurement surface) ---
// GET /api/me/c3 (Clerk-gated mastery payload) + GET /api/c3/deck (public).
// Shapes mirror shapeC3Response in barmatrix-api/src/routes/c3.ts.

export interface C3Calibration {
  error: number;
  direction: "overconfident" | "underconfident" | "calibrated";
  buckets: Array<{ confidence: number; actual: number; n: number }>;
}

export interface C3WeakMold {
  mold_code: string;
  name: string;
  family: string;
  bite_pct: number;
  exposures: number;
  deck_ref: string | null;
  lesson_slug: string | null;
  proficiency: number | null;
}

export interface C3Family {
  family: string;
  proficiency: number | null;
  measured_molds: number;
  accuracy: number | null;
}

export interface C3Mastery {
  coverage: { measured_attempts: number; total_attempts: number; pct: number };
  readiness: {
    score: number | null;
    label: "measured" | "not_yet_measured";
    mold_floor: number;
  };
  families: C3Family[];
  tracks: {
    ear_overclaim: number | null;
    ear_falsity: number | null;
    ear_distortion: number | null;
    issue_sense: number | null;
    phase_accuracy: Record<string, number>;
    clean_cut_hit_rate: number | null;
    calibration: C3Calibration;
  };
  weak_molds: C3WeakMold[];
  facets: {
    by_subject: Array<{ subject: string; accuracy: number; n: number }>;
  };
}

export interface C3DeckCard {
  card_id: string;
  type: string;
  subject: string | null;
  front: string;
  is_fork: boolean;
}

export interface C3DeckResponse {
  cards: C3DeckCard[];
}

// --- C3 Mastery Certification (Phase 4) — gated, auto-graded scorecard ---
// GET /api/certification (outline) + GET /api/certification/:id (key-free content)
// + POST /api/me/certification/:id/start + POST /api/me/certification/:id (grade).
// Answer keys NEVER reach the client; the grade response is the only place the
// correct answers appear. Shapes mirror barmatrix-api/src/routes/certification.ts.

export type CertCapture =
  | "single"
  | "rule_distractor"
  | "axis_survivor"
  | "band"
  | "integration";

export interface CertMcqOption {
  letter: string;
  text: string;
}

export interface CertPublicItem {
  id: string;
  prompt: string;
  options?: CertMcqOption[];
  axis_options?: string[];
  survivor_options?: CertMcqOption[];
}

export interface CertPassSpec {
  type: string;
  n?: number;
  of?: number;
  band_match_min?: number;
  no_undercalled_cut?: boolean;
  accuracy?: { n: number; of: number };
  phase_min?: number;
}

export interface CertCompetencyStatus {
  id: string;
  title: string;
  capture: CertCapture;
  pass: CertPassSpec;
  status: "passed" | "not_yet" | "not_started";
  attempts: number;
  retry_at: string | null;
}

export interface CertOutline {
  title: string;
  preview: boolean;
  preview_note: string;
  overall_gate: string;
  lessons_completed: number;
  lesson_count: number;
  unlocked: boolean;
  overall: "CONFIRMED" | "NOT_YET";
  competencies: CertCompetencyStatus[];
}

export interface CertPublicCompetency {
  id: string;
  title: string;
  capture: CertCapture;
  pass: CertPassSpec;
  lesson_refs: string[];
  label_options?: string[];
  rule_options?: string[];
  distractor_options?: string[];
  band_options?: string[];
  phase_options?: string[];
  items: CertPublicItem[];
}

export interface CertPerItem {
  id: string;
  correct: boolean;
  your: string | null;
  key: string | null;
  explanation?: string;
}

export interface CertGradeResult {
  persisted: boolean;
  passed: boolean;
  score: number;
  conditions: {
    accuracy_score: number | null;
    forks_passed: boolean | null;
    phase_score: number | null;
    calibration_passed: boolean | null;
  };
  per_item: CertPerItem[];
  remediation_lessons: string[];
  overall?: "CONFIRMED" | "NOT_YET";
}

export interface CertSubmitAnswer {
  id: string;
  value?: string;
  rule?: string;
  distractor?: string;
  axis?: string;
  survivor?: string;
  band?: "HIGH" | "MED" | "COIN";
  phase?: "CUT" | "CLASH" | "CALL";
  flag?: boolean;
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

  getCheckoutStatus: (sessionId: string) =>
    request<CheckoutStatusResponse>(
      `/api/checkout/${encodeURIComponent(sessionId)}/status`,
    ),

  recoverCheckoutEnrollment: (sessionId: string) =>
    request<CheckoutRecoveryResponse>(
      `/api/checkout/${encodeURIComponent(sessionId)}/recover`,
      { method: "POST", body: JSON.stringify({}) },
    ),

  createWebinarLead: (payload: WebinarLeadRequest) =>
    request<WebinarLeadResponse>("/api/webinar/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createCustomerPortalSession: (
    payload: CustomerPortalSessionRequest,
    token: string,
  ) =>
    authedRequest<CustomerPortalSessionResponse>(
      "/api/billing/create-portal-session",
      token,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
      },
    ),

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

  getMyGamification: (token: string, init?: RequestInit) =>
    authedRequest<MyGamification>("/api/me/gamification", token, init),

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

  getMyTraps: (token: string) =>
    authedRequest<MyTrapProfile>("/api/me/traps", token),

  getMyTrap: (token: string, slug: string) =>
    authedRequest<MyTrapHistory>(
      `/api/me/traps/${encodeURIComponent(slug)}`,
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

  startBootCamp: (slug: string, payload: BootCampStartRequest = {}, token?: string | null) =>
    token
      ? authedRequest<BootCampStartResponse>(
          `/api/boot-camps/${encodeURIComponent(slug)}/start`,
          token,
          { method: "POST", body: JSON.stringify(payload) },
        )
      : request<BootCampStartResponse>(
          `/api/boot-camps/${encodeURIComponent(slug)}/start`,
          { method: "POST", body: JSON.stringify(payload) },
        ),

  getBootCampSession: (sessionId: string, token: string, init?: RequestInit) =>
    authedRequest<BootCampSession>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}`,
      token,
      init,
    ),

  startBootCampDay: (sessionId: string, day: number, token: string) =>
    authedRequest<BootCampDayStartResponse>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}/days/${day}/start`,
      token,
      { method: "POST", body: JSON.stringify({}) },
    ),

  completeBootCampDay: (
    sessionId: string,
    day: number,
    token: string,
    payload: { skip?: boolean } = {},
  ) =>
    authedRequest<BootCampDayCompleteResponse>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}/days/${day}/complete`,
      token,
      { method: "POST", body: JSON.stringify(payload) },
    ),

  startBootCampMastery: (sessionId: string, token: string) =>
    authedRequest<BootCampMasteryStartResponse>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}/mastery/start`,
      token,
      { method: "POST", body: JSON.stringify({}) },
    ),

  completeBootCampMastery: (sessionId: string, token: string) =>
    authedRequest<BootCampMasteryCompleteResponse>(
      `/api/boot-camps/sessions/${encodeURIComponent(sessionId)}/mastery/complete`,
      token,
      { method: "POST", body: JSON.stringify({}) },
    ),

  // --- Drill Library (Web Component 04) — enrolled starts, public catalog ---
  getDrillCatalog: (init?: RequestInit) =>
    request<DrillCatalogResponse>("/api/drills/catalog", init),

  getPrescribedDrills: (token: string) =>
    authedRequest<PrescribedDrillsResponse>("/api/drills/prescribed", token),

  startDrill: (payload: DrillStartRequest, token?: string | null) =>
    token
      ? authedRequest<DrillStartResponse>("/api/drills/start", token, {
          method: "POST",
          body: JSON.stringify(payload),
        })
      : request<DrillStartResponse>("/api/drills/start", {
          method: "POST",
          body: JSON.stringify(payload),
        }),

  getDrill: (drillId: string, token: string, init?: RequestInit) =>
    authedRequest<DrillDetail>(
      `/api/drills/${encodeURIComponent(drillId)}`,
      token,
      init,
    ),

  completeDrill: (drillId: string, token: string) =>
    authedRequest<DrillCompleteResponse>(
      `/api/drills/${encodeURIComponent(drillId)}/complete`,
      token,
      { method: "POST", body: JSON.stringify({}) },
    ),

  // --- Foundations ("The Method") — gated core starter course ---
  // Public course outline (anonymous; progress is all zeros).
  listFoundations: (init?: RequestInit) =>
    request<FoundationsOutline>("/api/foundations", init),

  // Signed-in outline: same shape, merged with the student's lesson status.
  getMyFoundations: (token: string) =>
    authedRequest<FoundationsOutline>("/api/me/foundations", token),

  // Public lesson content (full body + drills + keys).
  getFoundationsLesson: (slug: string, init?: RequestInit) =>
    request<FoundationsLessonResponse>(
      `/api/foundations/${encodeURIComponent(slug)}`,
      init,
    ),

  // Persist lesson progress (mark complete / record self-checked drills).
  markFoundationsLesson: (
    token: string,
    slug: string,
    payload: FoundationsMarkRequest,
  ) =>
    authedRequest<FoundationsMarkResponse>(
      `/api/me/foundations/${encodeURIComponent(slug)}`,
      token,
      { method: "POST", body: JSON.stringify(payload) },
    ),

  // Grade one interactive drill attempt. Optional auth: anonymous learners are
  // graded (no persistence); a token attributes + records the attempt.
  gradeFoundationsAttempt: (
    slug: string,
    payload: FoundationsAttemptRequest,
    token?: string,
  ) =>
    request<FoundationsAttemptResponse>(
      `/api/foundations/${encodeURIComponent(slug)}/attempts`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),

  // --- C3 Mastery (flagship measurement surface) ---
  // Clerk-gated mastery payload; student is server-derived.
  getMyC3: (token: string) => authedRequest<C3Mastery>("/api/me/c3", token),

  getCoachNext: (token: string, init?: RequestInit) =>
    authedRequest<CoachNext>("/api/me/c3/next", token, init),

  // Public list of C3 deck cards.
  listC3Deck: (init?: RequestInit) =>
    request<C3DeckResponse>("/api/c3/deck", init),

  // --- C3 Placement Diagnostic (curated 18-question session) ---
  startPlacementSession: () =>
    request<PlacementSessionStartResponse>("/api/diagnostic/session/start", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  getPlacementQuestions: (init?: RequestInit) =>
    request<PlacementQuestionsResponse>("/api/diagnostic/questions", init),

  submitPlacementAttempt: (
    sessionId: string,
    payload: PlacementAttemptRequest,
  ) =>
    request<PlacementAttemptResponse>(
      `/api/diagnostic/session/${encodeURIComponent(sessionId)}/attempt`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),

  getPlacementResults: (sessionId: string) =>
    request<PlacementResults>(
      `/api/diagnostic/session/${encodeURIComponent(sessionId)}/results`,
    ),

  // --- C3 Mastery Certification (Phase 4) — gated scorecard + runner ---
  // Outline (anonymous -> locked + zero progress; authed -> merged status).
  getCertification: (token: string) =>
    authedRequest<CertOutline>("/api/certification", token),

  // Per-competency content (key-free). Requires the unlock gate to pass.
  getCertCompetency: (token: string, id: string) =>
    authedRequest<CertPublicCompetency>(
      `/api/certification/${encodeURIComponent(id)}`,
      token,
    ),

  // Start a server-timestamped session before answering.
  startCert: (token: string, id: string) =>
    authedRequest<{ session_id: string }>(
      `/api/me/certification/${encodeURIComponent(id)}/start`,
      token,
      { method: "POST", body: JSON.stringify({}) },
    ),

  // Submit answers; the grade response is the only place keys appear.
  submitCert: (token: string, id: string, answers: CertSubmitAnswer[]) =>
    authedRequest<CertGradeResult>(
      `/api/me/certification/${encodeURIComponent(id)}`,
      token,
      { method: "POST", body: JSON.stringify({ answers }) },
    ),
};

export { ApiClientError, API_URL };
