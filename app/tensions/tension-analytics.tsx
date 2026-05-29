"use client";

// Client-only analytics pings for the Tension Map surface. Rendered as
// null-output components inside the server pages so the catalog/detail content
// stays server-rendered while the PostHog events still fire in the browser.

import { useEffect } from "react";
import {
  trackTensionDetailViewedOnce,
  trackTensionMapViewedOnce,
} from "@/lib/analytics";
import type { TensionDetailResponse } from "@/lib/api-client";

export function TensionMapAnalytics({
  tensionCount,
  officialCount,
}: {
  tensionCount: number;
  officialCount: number;
}) {
  useEffect(() => {
    trackTensionMapViewedOnce({ tensionCount, officialCount });
  }, [tensionCount, officialCount]);
  return null;
}

export function TensionDetailAnalytics({
  detail,
}: {
  detail: TensionDetailResponse;
}) {
  useEffect(() => {
    trackTensionDetailViewedOnce({
      slug: detail.slug,
      questionCount: detail.question_count,
      subject: detail.subject,
      official: detail.official,
      subjectDistribution: detail.subject_distribution.map(
        (entry) => `${entry.subject}:${entry.question_count}`,
      ),
    });
  }, [detail]);
  return null;
}
