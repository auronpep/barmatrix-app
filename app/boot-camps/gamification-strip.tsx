"use client";

import { useEffect, useState } from "react";
import { api, type MyGamification } from "@/lib/api-client";
import GamificationSummary from "@/components/gamification/gamification-summary";
import { useClerkAuth } from "@/lib/use-clerk-auth";

export default function GamificationStrip() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [data, setData] = useState<MyGamification | null>(null);
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let active = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token || !active) return;
        const g = await api.getMyGamification(token, { cache: "no-store" });
        if (active) setData(g);
      } catch {
        if (active) setData(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [getToken, isLoaded, isSignedIn]);
  if (!data) return null;
  return (
    <div className="mb-8">
      <GamificationSummary data={data} />
    </div>
  );
}
