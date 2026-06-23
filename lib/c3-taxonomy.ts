import {
  api,
  type C3AxisListResponse,
  type C3ChoicePatternListResponse,
  type C3RedZoneCatalogResponse,
} from "./api-client";

const REVALIDATE_SECONDS = 60;

const EMPTY_CATALOG: C3RedZoneCatalogResponse = {
  version: "c3-redzone-v5",
  categories: [],
  totals: {
    files: 0,
    packets: 0,
    visible_packets: 0,
    blocked_packets: 0,
    axes: 0,
    visible_axes: 0,
    choice_patterns: 0,
    visible_choice_patterns: 0,
    human_review_rows: 0,
  },
};

const EMPTY_AXES: C3AxisListResponse = { axes: [], total: 0, returned: 0 };
const EMPTY_PATTERNS: C3ChoicePatternListResponse = {
  choice_patterns: [],
  total: 0,
  returned: 0,
};

export async function getC3RedZoneCatalog(): Promise<C3RedZoneCatalogResponse> {
  try {
    return await api.listC3RedZoneCatalog({ next: { revalidate: REVALIDATE_SECONDS } });
  } catch (err) {
    console.error("[c3-taxonomy] red-zone catalog fetch failed:", err);
    return EMPTY_CATALOG;
  }
}

export async function getC3Axes(params: {
  red_zone_id?: string | null;
  subject?: string | null;
  outline_code?: string | null;
  limit?: number;
} = {}): Promise<C3AxisListResponse> {
  try {
    return await api.listC3Tensions(params, { next: { revalidate: REVALIDATE_SECONDS } });
  } catch (err) {
    console.error("[c3-taxonomy] axis fetch failed:", err);
    return EMPTY_AXES;
  }
}

export async function getC3ChoicePatterns(params: {
  red_zone_id?: string | null;
  subject?: string | null;
  outline_code?: string | null;
  mold_code?: string | null;
  filter_broken?: string | null;
  limit?: number;
} = {}): Promise<C3ChoicePatternListResponse> {
  try {
    return await api.listC3Traps(params, { next: { revalidate: REVALIDATE_SECONDS } });
  } catch (err) {
    console.error("[c3-taxonomy] choice-pattern fetch failed:", err);
    return EMPTY_PATTERNS;
  }
}
