"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const AUTH_FORM_TIMEOUT_MS = 3000;

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setShowFallback(true),
      AUTH_FORM_TIMEOUT_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        padding: "64px 16px 96px",
      }}
    >
      {mode === "sign-in" ? <SignIn /> : <SignUp />}
      {showFallback && (
        <div
          role="status"
          className="max-w-md rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
        >
          Account access is taking longer than expected. Refresh this page, or
          use the diagnostic while account access finishes loading.
        </div>
      )}
    </div>
  );
}
