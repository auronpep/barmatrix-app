"use client";

// Fires a one-shot confetti burst when `trigger` becomes truthy. Respects
// prefers-reduced-motion: when the user opts out of motion, nothing animates.

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export default function Celebration({ trigger }: { trigger: boolean }) {
  const fired = useRef(false);
  useEffect(() => {
    if (!trigger || fired.current) return;
    fired.current = true;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    void confetti({
      particleCount: 90,
      spread: 70,
      startVelocity: 38,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  }, [trigger]);
  return null;
}
