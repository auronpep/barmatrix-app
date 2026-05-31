// Server-side data helpers for the Tension Map surface (Web Component 01).
//
// Wrap the typed api-client with tag-based ISR caching and fail soft: a
// browse surface should render an empty / "not found" state if the API is
// unreachable, never throw a 500 at the route. The API already returns each
// tension's display `name`, `subject`, and `official` flag, plus a `catalog_ready`
// signal, so the frontend stays presentational.

import {
  api,
  ApiClientError,
  type TensionDetailResponse,
  type TensionListResponse,
} from "./api-client";

export const TENSION_CATALOG_TAG = "tensions-catalog";
export const TENSION_DETAIL_TAG_PREFIX = "tensions-detail:";

// Outside production, ask the API to include hidden bank rows so the map is
// non-degenerate before the 1,409-question bank is promoted to `active`
// (parent handoff cross-cutting contract #1). The API ignores this in production.
const INCLUDE_HIDDEN = process.env.NODE_ENV !== "production";

const EMPTY_CATALOG: TensionListResponse = {
  tensions: [],
  subjects: [],
  totals: { tension_count: 0, official_count: 0, observed_count: 0 },
  catalog_ready: false,
};

export async function getTensionCatalog(): Promise<TensionListResponse> {
  try {
    return await api.listTensions(
      { include_hidden: INCLUDE_HIDDEN },
      { next: { tags: [TENSION_CATALOG_TAG] } },
    );
  } catch (err) {
    console.error("[tensions] catalog fetch failed:", err);
    return EMPTY_CATALOG;
  }
}

// Returns null for an unknown tension (API 404) so the page can call notFound().
// Other failures also resolve to null (degraded → 404 page) rather than a 500;
// the underlying error is logged for diagnosis.
export async function getTensionDetail(
  slug: string,
): Promise<TensionDetailResponse | null> {
  try {
    return await api.getTension(
      slug,
      { include_hidden: INCLUDE_HIDDEN },
      { next: { tags: [`${TENSION_DETAIL_TAG_PREFIX}${slug}`, TENSION_CATALOG_TAG] } },
    );
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      return null;
    }
    console.error("[tensions] detail fetch failed:", err);
    return null;
  }
}
