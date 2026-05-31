"use server";

import { updateTag } from "next/cache";
import {
  TENSION_CATALOG_TAG,
  TENSION_DETAIL_TAG_PREFIX,
} from "./tensions";

// Call this after updating tension metadata or tagging new questions with a tension.
// Invalidates both the specific tension detail page and the full catalog immediately.
export async function revalidateTensionDetail(slug: string): Promise<void> {
  updateTag(`${TENSION_DETAIL_TAG_PREFIX}${slug}`);
  updateTag(TENSION_CATALOG_TAG);
}

// Call this when the tension catalog itself changes (e.g., new official tensions added).
export async function revalidateTensionCatalog(): Promise<void> {
  updateTag(TENSION_CATALOG_TAG);
}

// Call this to invalidate all tension pages at once (e.g., mass update or migration).
export async function revalidateAllTensions(): Promise<void> {
  updateTag(TENSION_CATALOG_TAG);
  // Note: individual detail pages share the TENSION_CATALOG_TAG, so one call covers both.
}
