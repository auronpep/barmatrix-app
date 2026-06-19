"use client";

// Redesign V2 preview — the public Drill Bank catalog.
//
// PHASE 1 (presentation only): the redesign's "every drill ends in a verdict"
// editorial framing + footer IA, rendered over the LIVE catalog data
// (GET /api/drills/catalog) and the seven subject quick-drills. The live
// /drills page is untouched; this route is unlinked, for founder review.

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type DrillCatalogEntry, type DrillCatalogResponse } from "@/lib/api-client";
import { SUBJECT_QUICK_DRILLS } from "@/lib/drills";
import {
  RedesignFooter,
  ScriptureBlock,
  SectionLabel,
} from "@/components/redesign/redesign-chrome";

export default function DrillsPreviewPage() {
  const [catalog, setCatalog] = useState<DrillCatalogResponse | null>(null);

  useEffect(() => {
    let active = true;
    api
      .getDrillCatalog()
      .then((c) => active && setCatalog(c))
      .catch(() => active && setCatalog({ tensions: [], traps: [] }));
    return () => {
      active = false;
    };
  }, []);

  const tensions = catalog?.tensions ?? [];
  const traps = catalog?.traps ?? [];
  const totalDrills = tensions.length + traps.length + SUBJECT_QUICK_DRILLS.length;

  return (
    <section className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 border-b-2 border-zinc-900 pb-6">
        <p className="flex items-center gap-2 font-serif text-2xl font-semibold text-zinc-900">
          <span aria-hidden className="font-mono text-base text-zinc-400">B</span>
          BarMatrix
        </p>
        <Link
          href="/diagnostic"
          className="border-2 border-red-700 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white"
        >
          Start the free diagnostic
        </Link>
      </div>

      {/* Hero */}
      <header className="mt-12">
        <SectionLabel>Repair drills · the live bank</SectionLabel>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-zinc-950">
          Every drill ends in a verdict: true and responsive, or counterfeit.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
          Real MBE mechanics, set in the world you actually live in. Answer under
          pressure, then run the TEAR forensics: see exactly which counterfeit
          almost persuaded you, the keys that break it, and the repair that keeps
          the point next time.
        </p>
        <ScriptureBlock
          quote="The thoughts of the diligent tend only to plenteousness."
          reference="Proverbs 21:5 · KJV"
        />
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          {totalDrills} drills · 7 subjects
        </p>
      </header>

      {/* Subjects */}
      <DrillSection title="By subject">
        <div className="grid gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
          {SUBJECT_QUICK_DRILLS.map((subject) => (
            <DrillCard
              key={subject.slug}
              code={subject.slug.toUpperCase().replace(/-/g, "")}
              title={subject.label}
              meta="Subject quick-drill set"
              href={subject.href}
            />
          ))}
        </div>
      </DrillSection>

      {tensions.length > 0 && (
        <DrillSection title="By tension point">
          <CatalogGrid entries={tensions} basePath="/tensions" />
        </DrillSection>
      )}

      {traps.length > 0 && (
        <DrillSection title="By trap family">
          <CatalogGrid entries={traps} basePath="/traps" />
        </DrillSection>
      )}

      <RedesignFooter />
    </section>
  );
}

function CatalogGrid({
  entries,
  basePath,
}: {
  entries: DrillCatalogEntry[];
  basePath: string;
}) {
  return (
    <div className="grid gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
      {entries.map((entry) => (
        <DrillCard
          key={entry.slug}
          code={entry.slug.slice(0, 12).toUpperCase()}
          title={entry.label}
          meta={`${entry.question_count} question${entry.question_count === 1 ? "" : "s"}`}
          href={`${basePath}/${entry.slug}`}
        />
      ))}
    </div>
  );
}

function DrillSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <p className="border-b border-zinc-900 pb-3 text-center font-mono text-xs uppercase tracking-[0.22em] text-zinc-700">
        {title}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function DrillCard({
  code,
  title,
  meta,
  href,
}: {
  code: string;
  title: string;
  meta: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block bg-white p-6 transition hover:bg-zinc-50">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
          {code}
        </p>
        <MasteryDots />
      </div>
      <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-zinc-950">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{meta}</p>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-red-700">
        Run the drill →
      </p>
    </Link>
  );
}

// Five-dot mastery indicator — Phase 1 renders the empty (unworked) state for
// every card; per-card mastery binds to attempt history in a later phase.
function MasteryDots() {
  return (
    <span aria-hidden className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 bg-zinc-300" />
      ))}
    </span>
  );
}
