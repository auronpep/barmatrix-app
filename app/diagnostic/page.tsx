import Link from "next/link";

export const metadata = {
  title: "Free MBE Trap Diagnostic — BarMatrix",
  description:
    "Take the free MBE Trap Diagnostic. Identify the wrong-answer patterns behind your misses and receive a Red-Zone Map preview.",
};

export default function DiagnosticPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Free MBE Trap Diagnostic
      </h1>
      <p className="mt-6 text-lg text-zinc-600">
        Start with a short diagnostic. Instead of reporting only a percentage, BarMatrix looks at the type of wrong answers you choose: legally true but irrelevant, wrong timing, exception omitted, wrong party, wrong standard, and other recurring MBE trap patterns.
      </p>
      <div className="mt-12 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
        <p className="font-mono text-sm uppercase tracking-wider text-zinc-500">
          Diagnostic flow — Day 1 shell
        </p>
        <p className="mt-3 text-zinc-600">
          Backend wiring lands when{" "}
          <code className="font-mono text-sm">/api/diagnostic/start</code> is live (see SRC-0020 API_CONTRACTS).
        </p>
        <div className="mt-6">
          <Link
            href="/pricing"
            className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
