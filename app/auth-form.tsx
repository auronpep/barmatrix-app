"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { resolveAuthReturnPath } from "@/app/auth-return-path";
import Link from "next/link";
import { useEffect, useState } from "react";

const AUTH_FORM_TIMEOUT_MS = 3000;

export function AuthForm({
  mode,
  after,
}: {
  mode: "sign-in" | "sign-up";
  after?: string | null;
}) {
  const [showFallback, setShowFallback] = useState(false);
  const returnPath = resolveAuthReturnPath(after);
  const isSignUp = mode === "sign-up";
  const title = isSignUp
    ? "Create your BarMatrix account"
    : "Sign in to BarMatrix";
  const body = isSignUp
    ? "Use the email you used at checkout so your paid access can attach to the right enrollment."
    : "Continue to your dashboard and repair tools. Use the email you used at checkout if you already enrolled.";

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setShowFallback(true),
      AUTH_FORM_TIMEOUT_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-6 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1fr)] lg:items-start">
      <div className="border border-zinc-300 bg-white p-8 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Account access
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-zinc-950">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-700">{body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={returnPath} className="btn ghost">
            Continue after access
          </Link>
          <Link href="/account" className="btn ghost">
            Account status
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5">
        {mode === "sign-in" ? (
          <SignIn
            forceRedirectUrl={returnPath}
            fallbackRedirectUrl={returnPath}
            signUpForceRedirectUrl={returnPath}
            signUpFallbackRedirectUrl={returnPath}
          />
        ) : (
          <SignUp
            forceRedirectUrl={returnPath}
            fallbackRedirectUrl={returnPath}
            signInForceRedirectUrl={returnPath}
            signInFallbackRedirectUrl={returnPath}
          />
        )}
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
    </section>
  );
}
