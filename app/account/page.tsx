import type { Metadata } from "next";
import Link from "next/link";
import { WELCOME } from "@/lib/copy";
import {
  AccountAccessPanel,
  AccountEntitlementPanel,
} from "./account-status";
import { BillingPortalButton } from "./billing-portal-button";
import { EnrollmentRecoveryPanel } from "./enrollment-recovery";

export const metadata: Metadata = {
  title: "Account — BarMatrix",
  description:
    "BarMatrix account confirmation and access details for the July cohort.",
  robots: { index: false, follow: false },
};

interface AccountPageProps {
  searchParams: Promise<{
    welcome?: string;
    checkout_session_id?: string;
    session_id?: string;
  }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const sp = await searchParams;
  const isWelcome = sp.welcome === "1";
  const checkoutSessionId = sp.checkout_session_id ?? sp.session_id ?? null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          {isWelcome ? <WelcomePanel /> : <AccountAccessPanel />}
          <EnrollmentRecoveryPanel checkoutSessionId={checkoutSessionId} />
          <BillingPanel checkoutSessionId={checkoutSessionId} />
        </div>
        <aside className="space-y-6">
          <AccountEntitlementPanel
            isWelcome={isWelcome}
            checkoutSessionId={checkoutSessionId}
          />
          <SettingsPanel />
        </aside>
      </div>
    </section>
  );
}

function WelcomePanel() {
  return (
    <div className="rounded-lg border border-zinc-300 bg-white p-8 shadow-sm sm:p-10">
      <p className="font-mono text-xs uppercase tracking-wider text-emerald-700">
        {WELCOME.badge}
      </p>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {WELCOME.headline}
      </h1>
      <p className="mt-4 text-zinc-600">{WELCOME.body}</p>
      <p className="mt-6 font-mono text-sm tracking-wide text-zinc-500">
        {WELCOME.flagshipLine}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href={WELCOME.primaryCta.href}
          className="rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900"
        >
          {WELCOME.primaryCta.label}
        </Link>
        <Link
          href={WELCOME.secondaryCta.href}
          className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:border-zinc-500"
        >
          {WELCOME.secondaryCta.label}
        </Link>
      </div>
    </div>
  );
}

function BillingPanel({
  checkoutSessionId,
}: {
  checkoutSessionId: string | null;
}) {
  return (
    <div className="mt-6 rounded-lg border border-zinc-300 bg-white p-8 shadow-sm sm:p-10">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Billing
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
        Payment method
      </h2>
      <p className="mt-3 text-zinc-600">
        Open Stripe&apos;s secure customer portal to update the card used for
        payment-plan retries or receipt billing. BarMatrix never receives full
        card numbers.
      </p>
      <BillingPortalButton checkoutSessionId={checkoutSessionId} />
      <p className="mt-4 text-sm text-zinc-500">
        If Stripe cannot find your enrollment, email{" "}
        <Link
          href="mailto:support@barmatrix.app"
          className="border-b border-zinc-400 text-zinc-900"
        >
          support@barmatrix.app
        </Link>{" "}
        with your checkout receipt.
      </p>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="rounded-lg border border-zinc-300 bg-zinc-50 p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Account settings
      </p>
      <div className="mt-5 space-y-4">
        <SettingsRow
          title="Profile"
          body="Use the same enrollment email for dashboard, Red-Zone Map, drills, and Wrong Answer Forensics."
        />
        <SettingsRow
          title="Billing"
          body="Payment method updates run through Stripe's secure customer portal."
        />
        <SettingsRow
          title="Support"
          body="Send receipt or access issues to support with the email used at checkout."
        />
      </div>
      <Link
        href="mailto:support@barmatrix.app"
        className="mt-6 inline-flex rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:border-zinc-500"
      >
        Contact support
      </Link>
    </div>
  );
}

function SettingsRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-zinc-200 pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-600">{body}</p>
    </div>
  );
}
