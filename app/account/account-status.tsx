"use client";

import Link from "next/link";
import { ACCOUNT_PLACEHOLDER, WELCOME } from "@/lib/copy";
import { useDashboard } from "@/lib/use-dashboard";

export function AccountAccessPanel() {
  const dash = useDashboard();

  if (dash.data?.enrolled === true) {
    return (
      <div className="rounded-lg border border-zinc-300 bg-white p-8 shadow-sm sm:p-10">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-700">
          Account active
        </p>
        <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Your BarMatrix access is active.
        </h1>
        <p className="mt-4 text-zinc-600">
          Continue from your dashboard, red-zone map, or assigned repair drills.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900"
          >
            Open dashboard
          </Link>
          <Link
            href="/red-zones"
            className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:border-zinc-500"
          >
            Review red zones
          </Link>
        </div>
      </div>
    );
  }

  if (dash.signedIn && dash.loading) {
    return (
      <div className="rounded-lg border border-zinc-300 bg-white p-8 text-center shadow-sm sm:p-10">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Checking account status...
        </h1>
        <p className="mt-3 text-zinc-600">
          Your signed-in account is loading. This panel will update once
          enrollment status is confirmed.
        </p>
      </div>
    );
  }

  if (dash.signedIn && dash.data && !dash.data.enrolled) {
    return (
      <div className="rounded-lg border border-zinc-300 bg-white p-8 text-center shadow-sm sm:p-10">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Enrollment pending
        </h1>
        <p className="mt-3 text-zinc-600">
          You are signed in, but this account does not have an active BarMatrix
          enrollment yet.
        </p>
        <Link
          href="/checkout"
          className="mt-6 inline-block rounded-md bg-red-700 px-6 py-3 text-sm font-medium text-white hover:bg-red-900"
        >
          Enroll now
        </Link>
      </div>
    );
  }

  if (dash.signedIn && dash.error) {
    return (
      <div className="rounded-lg border border-zinc-300 bg-white p-8 text-center shadow-sm sm:p-10">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Account status unavailable
        </h1>
        <p className="mt-3 text-zinc-600">
          We could not confirm your enrollment from this page. Open the dashboard
          to retry the account check.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-red-700 px-6 py-3 text-sm font-medium text-white hover:bg-red-900"
          >
            Open dashboard
          </Link>
          <Link
            href="mailto:support@barmatrix.app"
            className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 hover:border-zinc-500"
          >
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-300 bg-white p-8 text-center shadow-sm sm:p-10">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">
        {ACCOUNT_PLACEHOLDER.headline}
      </h1>
      <p className="mt-3 text-zinc-600">{ACCOUNT_PLACEHOLDER.body}</p>
      <Link
        href={ACCOUNT_PLACEHOLDER.cta.href}
        className="mt-6 inline-block rounded-md border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 hover:border-zinc-500"
      >
        {ACCOUNT_PLACEHOLDER.cta.label}
      </Link>
    </div>
  );
}

export function AccountEntitlementPanel({
  isWelcome,
  checkoutSessionId,
}: {
  isWelcome: boolean;
  checkoutSessionId: string | null;
}) {
  const dash = useDashboard();
  const hasCheckoutSession = checkoutSessionId !== null;
  const active = dash.data?.enrolled === true;
  const confirmedByUrl = isWelcome || hasCheckoutSession;
  const status = active
    ? "Active"
    : confirmedByUrl
      ? "Confirmed"
      : dash.signedIn && dash.loading
        ? "Checking"
        : dash.signedIn && dash.error
          ? "Unavailable"
          : "Pending sign-in";
  const statusTone = active || confirmedByUrl
    ? "text-emerald-700"
    : dash.signedIn && dash.error
      ? "text-red-700"
      : "text-amber-700";
  const sessionLabel = active
    ? "Verified from signed-in account"
    : checkoutSessionId
      ? `Session attached - ending ${checkoutSessionId.slice(-8)}`
      : dash.signedIn && dash.data && !dash.data.enrolled
        ? "No active enrollment found"
        : "No checkout session attached";

  return (
    <div className="rounded-lg border border-zinc-300 bg-white p-6 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Entitlement status
      </p>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            {WELCOME.flagshipLine}
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Access is tied to the enrollment email and checkout session used at
            purchase.
          </p>
        </div>
        <span
          className={`rounded border border-zinc-200 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${statusTone}`}
        >
          {status}
        </span>
      </div>

      <dl className="mt-6 space-y-4 border-t border-zinc-200 pt-5">
        <StatusRow label="Cohort" value="July-cycle cohort" />
        <StatusRow label="Access tier" value="Flagship" />
        <StatusRow label="Checkout" value={sessionLabel} />
      </dl>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
      <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="text-sm font-medium text-zinc-900">{value}</dd>
    </div>
  );
}
