"use client";

import { useEffect, useRef, useState } from "react";
import { formatXp } from "@/lib/gamification";

const DURATION_MS = 600;

// Arcade count-up: when the XP total increases during a session (e.g. after a
// completed task), the number rolls up to the new value. Dependency-free
// (requestAnimationFrame — no animation library).
//
// Hydration-safe: SSR and the first client render show the true value, so we
// only animate *subsequent* changes (never a 0→value flash on mount). Honors
// prefers-reduced-motion by snapping, and keeps the aria-label on the true
// value so assistive tech is never read intermediate frames.
export default function XpTotal({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;
    if (from === to) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // reduced-motion → duration 0 snaps on the first frame, keeping the only
    // setState inside the (async) rAF callback so we never setState in the
    // effect body.
    const duration = reduced ? 0 : DURATION_MS;

    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = duration <= 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="leading-tight" aria-label={`${formatXp(value)} total XP`}>
      <p className="font-serif text-xl font-semibold tabular-nums text-zinc-900">
        {formatXp(display)}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">total XP</p>
    </div>
  );
}
