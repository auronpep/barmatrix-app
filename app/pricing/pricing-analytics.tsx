"use client";

import { useEffect, useRef } from "react";
import { trackPricingViewed } from "@/lib/analytics";

export function PricingAnalytics() {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) {
      return;
    }

    hasTracked.current = true;
    trackPricingViewed({
      cohortStatus: "limited",
      searchParams: readCurrentSearchParams(),
    });
  }, []);

  return null;
}

function readCurrentSearchParams(): URLSearchParams {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.search);
}
