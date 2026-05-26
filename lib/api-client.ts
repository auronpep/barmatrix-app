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
};

export { ApiClientError, API_URL };
