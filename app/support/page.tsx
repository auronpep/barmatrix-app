import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support - BarMatrix",
  description:
    "BarMatrix account, billing, and study support for enrolled students.",
};

const supportRows = [
  {
    title: "Account access",
    body: "Use the same email from checkout. If you paid but cannot enter the dashboard, include your checkout receipt or the email used at enrollment.",
    href: "mailto:support@barmatrix.app?subject=BarMatrix%20account%20access",
    label: "support@barmatrix.app",
  },
  {
    title: "Billing",
    body: "For payment-plan, receipt, refund-window, or Stripe portal questions, include the billing email and the approximate checkout time.",
    href: "mailto:billing@barmatrix.app?subject=BarMatrix%20billing",
    label: "billing@barmatrix.app",
  },
  {
    title: "Study workflow",
    body: "For drill, dashboard, red-zone, or diagnostic issues, send the page URL and what you expected to happen next.",
    href: "mailto:support@barmatrix.app?subject=BarMatrix%20study%20workflow",
    label: "Send workflow issue",
  },
] as const;

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow-red">Support</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Get account, billing, or study help.
        </h1>
        <p className="mt-5 text-lg leading-8 text-zinc-600">
          Send the enrollment email, the page you were on, and the next step you
          expected. That gives support enough context to fix access or route you
          to the right part of the program.
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {supportRows.map((row) => (
          <article key={row.title} className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="font-serif text-xl font-semibold text-zinc-950">
              {row.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{row.body}</p>
            <Link
              href={row.href}
              className="mt-5 inline-flex font-mono text-xs uppercase tracking-wider text-red-700 hover:text-red-900"
            >
              {row.label}
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-zinc-300 bg-zinc-50 p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Fast self-check
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link href="/account" className="btn red">
            Check Account
          </Link>
          <Link href="/dashboard/path" className="btn ghost">
            Open My Path
          </Link>
          <Link href="/mobile-apps" className="btn ghost">
            Mobile Access
          </Link>
        </div>
      </div>
    </section>
  );
}
