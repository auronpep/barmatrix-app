"use client";

// Client-only analytics pings for the Trap Taxonomy surface. Rendered as
// null-output components inside the server pages so the catalog/detail content
// stays server-rendered while the PostHog events still fire in the browser.

import { useEffect } from "react";
import {
  trackTrapDetailViewedOnce,
  trackTrapTaxonomyViewedOnce,
} from "@/lib/analytics";
import type { TrapDetailResponse } from "@/lib/api-client";

export function TrapTaxonomyAnalytics({
  trapCount,
  officialCount,
}: {
  trapCount: number;
  officialCount: number;
}) {
  useEffect(() => {
    trackTrapTaxonomyViewedOnce({ trapCount, officialCount });
  }, [trapCount, officialCount]);
  return null;
}

export function TrapDetailAnalytics({ detail }: { detail: TrapDetailResponse }) {
  useEffect(() => {
    trackTrapDetailViewedOnce({
      slug: detail.slug,
      kinds: detail.kinds,
      questionCount: detail.question_count,
      subjectDistribution: detail.subject_distribution.map(
        (entry) => `${entry.subject}:${entry.question_count}`,
      ),
      official: detail.official,
    });
  }, [detail]);
  return null;
}
