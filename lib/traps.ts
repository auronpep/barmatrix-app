// Server-side data helpers for the Trap Taxonomy surface (Web Component 02).
//
// These wrap the typed api-client with ISR caching (revalidate: 60) and fail
// soft: a browse surface should render an empty/“not found” state if the API is
// unreachable, never throw a 500 at the route. The API already returns each
// trap's display `name` and `official` flag, so the frontend stays presentational.

import {
  api,
  ApiClientError,
  type TrapDetailResponse,
  type TrapListResponse,
} from "./api-client";

const REVALIDATE_SECONDS = 60;

// Outside production, ask the API to include hidden bank rows so the catalog is
// non-degenerate before the 1,409-question bank is promoted to `active`
// (parent handoff cross-cutting contract #1). The API ignores this in production.
const INCLUDE_HIDDEN = process.env.NODE_ENV !== "production";

const EMPTY_CATALOG: TrapListResponse = {
  architecture: [],
  misconception: [],
  totals: {
    architecture_count: 0,
    misconception_count: 0,
    official_count: 0,
  },
};

export async function getTrapCatalog(): Promise<TrapListResponse> {
  try {
    return await api.listTraps(
      { include_hidden: INCLUDE_HIDDEN },
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
  } catch (err) {
    console.error("[traps] catalog fetch failed:", err);
    return EMPTY_CATALOG;
  }
}

// Returns null for an unknown trap (API 404) so the page can call notFound().
// Other failures also resolve to null (degraded → 404 page) rather than a 500;
// the underlying error is logged for diagnosis.
export async function getTrapDetail(
  slug: string,
): Promise<TrapDetailResponse | null> {
  try {
    return await api.getTrap(
      slug,
      { include_hidden: INCLUDE_HIDDEN },
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      return null;
    }
    console.error("[traps] detail fetch failed:", err);
    return null;
  }
}
