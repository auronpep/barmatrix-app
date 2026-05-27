import type { Metadata } from "next";
import Link from "next/link";
import { WELCOME, ACCOUNT_PLACEHOLDER } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Account — BarMatrix",
  description:
    "BarMatrix account confirmation and access details for the July cohort.",
  robots: { index: false, follow: false },
};

interface AccountPageProps {
  searchParams: Promise<{ welcome?: string }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const sp = await searchParams;
  const isWelcome = sp.welcome === "1";

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      {isWelcome ? <WelcomePanel /> : <AccountPlaceholder />}
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
          className="rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700"
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

function AccountPlaceholder() {
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
