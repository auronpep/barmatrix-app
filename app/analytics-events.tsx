"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  createRouteAnalyticsState,
  trackRouteAnalytics,
  type RouteAnalyticsState,
} from "@/lib/analytics";

export function AnalyticsEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeState = useRef<RouteAnalyticsState>(createRouteAnalyticsState());
  const path = pathname || "/";
  const search = searchParams.toString();

  useEffect(() => {
    routeState.current = trackRouteAnalytics({
      path,
      searchParams: new URLSearchParams(search),
      state: routeState.current,
    });
  }, [path, search]);

  return null;
}
