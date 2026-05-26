// Typed client for the barmatrix-api backend.
//
// Single source of truth for the frontend's contract with the API. All fetches
// go through this file so type drift and URL drift get caught at compile time.
//
// API URL resolution order:
//   1. NEXT_PUBLIC_API_URL env var at build time (Vercel injects this)
//   2. Direct Cloud Run URL fallback (works until api.barmatrix.app DNS flips)
//
// Source of truth: BARMATRIX/engineering/API_CONTRACTS.md (SRC-0020).

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://barmatrix-api-153207558013.us-central1.run.app";

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
  payment_plan: PaymentPlan;
  partner_id?: string | null;
  referral_click_id?: string | null;
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
  student_id?: string;
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

  health: () =>
    request<{ ok: boolean; db: string }>("/health"),

  // Hearsay seam endpoints — Handoff 10
  getQuestion: (id: string) =>
    request<QuestionPayload>(`/api/questions/${encodeURIComponent(id)}`),

  submitAttempt: (payload: AttemptRequest) =>
    request<AttemptResponse>("/api/attempts", {
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
};

export { ApiClientError, API_URL };
