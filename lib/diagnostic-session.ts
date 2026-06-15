// Remembers the visitor's most recent free-diagnostic id in localStorage so the
// checkout flow can pass it to the API. Fulfillment then claims that diagnostic
// session's attempts onto the buyer's new student record — their Red-Zone Map is
// populated on day one instead of an empty dashboard.
//
// localStorage (not sessionStorage) so it survives the Stripe round-trip and a
// return visit in the same browser. Best-effort: storage may be unavailable
// (private mode, blocked cookies) — every accessor fails closed to null/no-op.

const LATEST_DIAGNOSTIC_KEY = "barmatrix.diagnostic.latest";

export function rememberDiagnosticId(diagnosticId: string): void {
  if (typeof window === "undefined" || !diagnosticId) return;
  try {
    window.localStorage.setItem(LATEST_DIAGNOSTIC_KEY, diagnosticId);
  } catch {
    // storage unavailable — claiming will fall back to email match server-side.
  }
}

export function getRememberedDiagnosticId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LATEST_DIAGNOSTIC_KEY);
  } catch {
    return null;
  }
}

export function clearRememberedDiagnosticId(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LATEST_DIAGNOSTIC_KEY);
  } catch {
    // no-op
  }
}
