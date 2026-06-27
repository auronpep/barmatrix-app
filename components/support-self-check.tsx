import Link from "next/link";

const checks = [
  "Sign in with the same checkout email you used in Stripe.",
  "Find the Stripe or BarMatrix receipt email before opening a billing request.",
  "Open the dashboard route after Account confirms active access.",
] as const;

export function SupportSelfCheck() {
  return (
    <div className="rounded-lg border border-zinc-300 bg-zinc-50 p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Before you email support
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-950">
        Fast access check
      </h2>
      <ol className="mt-4 space-y-3">
        {checks.map((check, index) => (
          <li key={check} className="flex gap-3 text-sm leading-6 text-zinc-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 font-mono text-[10px] text-white">
              {index + 1}
            </span>
            <span>{check}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href="/account" className="btn red">
          Check Account
        </Link>
        <Link href="/dashboard" className="btn ghost">
          Open Dashboard
        </Link>
        <Link
          href="mailto:support@barmatrix.app?subject=BarMatrix%20support%20request"
          className="btn ghost"
        >
          Email support
        </Link>
      </div>
    </div>
  );
}
