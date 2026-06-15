import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mobile Access - BarMatrix",
  description:
    "Use BarMatrix from a phone or tablet browser with the same account, dashboard, drills, and red-zone history.",
};

const steps = [
  {
    title: "Open the web app",
    body: "Go to barmatrix.app from the browser on your phone or tablet and sign in with the same enrollment email.",
  },
  {
    title: "Add it to your home screen",
    body: "Use your browser's share or menu control and choose the home-screen option. The site uses manifest.webmanifest so it opens like a focused study app.",
  },
  {
    title: "Keep one account state",
    body: "Your dashboard, Red-Zone Map, practice history, and assigned drills stay tied to the same account across desktop and mobile browsers.",
  },
] as const;

export default function MobileAppsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="eyebrow-red">Mobile Access</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Study from your phone without splitting your BarMatrix account.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
            The launch version runs through the mobile web app. Use the same
            sign-in, the same paid access, and the same repair history whether
            you are at a desk or reviewing on your phone.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/app" className="btn red">
              Open Web App
            </Link>
            <Link href="/dashboard/path" className="btn ghost">
              Continue My Path
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-zinc-300 bg-zinc-50 p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Current access
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Native mobile builds are not required for launch access. Use the web
            app on any modern browser; contact support if your account does not
            open after enrollment.
          </p>
          <Link
            href="/support"
            className="mt-5 inline-flex font-mono text-xs uppercase tracking-wider text-red-700 hover:text-red-900"
          >
            Get support
          </Link>
        </aside>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article key={step.title} className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="font-serif text-xl font-semibold text-zinc-950">
              {step.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
