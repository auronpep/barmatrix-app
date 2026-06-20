// Redesign V2 — shared chrome for the "judge the answer" information architecture.
//
// PHASE 1 (presentation only): these components carry the redesign's editorial
// voice — scripture blocks, the section label, and the footer IA — and are used
// by the unlinked preview routes under app/preview/*. They reuse the app's
// existing design language (font-serif headings, font-mono eyebrows, zinc/red
// palette) so a later "flip" into the live routes is a swap, not a rewrite.

import Link from "next/link";

/** Eyebrow label with the redesign's red tick mark. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-700">
      <span aria-hidden className="inline-block h-3.5 w-[3px] bg-red-700" />
      {children}
    </p>
  );
}

/** Scripture pull-quote with a red left rule, matching the redesign deck. */
export function ScriptureBlock({
  quote,
  reference,
}: {
  quote: string;
  reference: string;
}) {
  return (
    <figure className="my-10 border-l-4 border-red-700 pl-5">
      <blockquote className="font-serif text-lg italic leading-relaxed text-zinc-500">
        “{quote}”
      </blockquote>
      <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-red-700">
        {reference}
      </figcaption>
    </figure>
  );
}

/**
 * Footer information architecture from the redesign deck. Links resolve to the
 * closest existing live routes; "Exam-Day Prayer Chain" has no route yet and
 * points at the FAQ until that surface exists.
 */
export function RedesignFooter() {
  return (
    <footer className="mt-20 border-t-4 border-red-700 pt-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-serif text-2xl font-semibold text-zinc-400">
            <span aria-hidden className="font-mono text-base">
              B
            </span>
            BarMatrix
          </p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-600">
            MBE wrong-answer diagnosis for Christian bar takers learning to judge
            rightly.
          </p>
        </div>

        <nav aria-label="The work">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
            The Work
          </p>
          <ul className="mt-4 space-y-2 text-zinc-600">
            <li><Link href="/how-it-works" className="hover:text-zinc-900">TEAR / C3 Method</Link></li>
            <li><Link href="/drills" className="hover:text-zinc-900">Repair Drills</Link></li>
            <li><Link href="/diagnostic" className="hover:text-zinc-900">The Diagnostic</Link></li>
            <li><Link href="/pricing" className="hover:text-zinc-900">Pricing</Link></li>
            <li><Link href="/faq" className="hover:text-zinc-900">Help</Link></li>
          </ul>
        </nav>

        <div className="space-y-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
              Be Strong Fellowship
            </p>
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              Courage for the exam. Wisdom for the work. Christ above both.
            </p>
            <ul className="mt-3 space-y-2 text-zinc-600">
              <li><Link href="/faq" className="hover:text-zinc-900">Exam-Day Prayer Chain</Link></li>
            </ul>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
              Joshua 1:9
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
              Account
            </p>
            <ul className="mt-4 space-y-2 text-zinc-600">
              <li><Link href="/sign-in" className="hover:text-zinc-900">Sign in</Link></li>
              <li><Link href="/checkout" className="hover:text-zinc-900">Enroll</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-6">
        <ScriptureBlock
          quote="Nay, in all these things we are more than conquerors through him that loved us."
          reference="Romans 8:37 · KJV · Today's verse"
        />
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          MBE wrong-answer diagnosis and repair. Not a full bar course, and not a
          pass guarantee. The bar is not your identity. The law is not your
          savior. But your preparation still belongs to Christ.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-5 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
          <span>© BarMatrix · barmatrix.app</span>
          <span>Judge righteous judgment.</span>
        </div>
      </div>
    </footer>
  );
}

/** Banner that names the day's active concept, in the redesign's outlined style. */
export function NamedConceptBanner({ label }: { label: string }) {
  return (
    <div className="mt-8 border-2 border-red-700 px-6 py-4 text-center font-mono text-sm uppercase tracking-[0.22em] text-red-700">
      {label}
    </div>
  );
}
